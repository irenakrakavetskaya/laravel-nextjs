'use client'

import Head from 'next/head'
import Link from 'next/link'
import Button from '@/components/Button'
import { axios, token } from '@/lib/axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '@/app/global.css'

export async function getServerSideProps() {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL + `/api/posts`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
    });
    const data = await res.json()
    return { props: { data } }
}

export default function Index({ data }) {
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const router = useRouter()
    useEffect(() => {
        if (router.query.status?.length > 0 && errors.length === 0) {
            setStatus(router.query.status)
        } else {
            setStatus(null)
        }
    })

    const del = (id) => {axios.delete(`/api/posts/${id}`)
        .then(res => {
            router.push({
                pathname:`/blog`,
                query:{ status: res.data.status }
            },'/blog')
        })
        .catch(error => {
            if (error.response.status !== 422) throw error
            setErrors(error.response.data.errors)
        })
    }

    const edit = (id) => {axios.get(`/api/posts/${id}`)
        .then(res => {
            router.push({
                pathname:`/blog/edit`,
                query:{ id: res.data.id, title: res.data.title, content:res.data.content }
            },'/blog/edit')
        })}

    return (
        <>
            <Head>
                <title>Posts</title>
            </Head>
            <div className="m-6">
                <Link href="blog/create" className="py-2 px-4 m-4 bg-gray-50 text-gray-600 font-bold border border-gray-400 hover:bg-white hover:drop-shadow-md rounded-md">Create Post</Link>
            </div>
            <div className="bg-white rounded-md overflow-x-auto m-6 drop-shadow-lg">
                <table className="w-full whitespace-nowrap">
                    <thead>
                    <tr className="bg-gray-500 text-white font-extrabold">
                        <th className="px-4 py-1 border">Title</th>
                        <th className="px-4 py-1 border">Content</th>
                        <th className="px-4 py-1 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(post => (
                        <tr key={post.id}>
                            <td className="px-4 py-1 border">{post.title}</td>
                            <td className="px-4 py-1 border">{post.content}</td>
                            <td className="px-4 py-1 border">
                                <Button className="ml-4" onClick={()=>edit(post.id)}>Edit</Button>
                                <Button className="ml-4 bg-red-600 hover:bg-red-500" onClick={()=>del(post.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
