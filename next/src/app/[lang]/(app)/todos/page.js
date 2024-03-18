import { AddForm } from '@/app/[lang]/ui/add-form'
import { DeleteForm } from '@/app/[lang]/ui/delete-form'
import Header from '@/app/[lang]/ui/Header'
import { fetchTodos } from '@/lib'

export const metadata = {
    title: 'TODO',
}

export default async function Page() {
    let todos = await fetchTodos()

    return (
        <>
            <Header title="Todos" />
            <div className="w-full">
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <AddForm />
                </div>
                <div className="mt-6 flow-root">
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                            <ul className="todoUl">
                                {todos.map(todo => (
                                    <li key={todo.id}>
                                        {todo.todo}
                                        <DeleteForm
                                            id={todo.id}
                                            todo={todo.todo}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
