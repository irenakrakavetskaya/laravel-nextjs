<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $posts = Post::all()->toArray();

        return response($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'title' => 'required',
            'content' => 'required',
        ]);

        $post = Post::create($validated);

        return response(['status' => 'Post created.'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post): Response
    {
        return response($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post): Response
    {
        $validated = $request->validate([
            'title' => 'required',
            'content' => 'required',
        ]);

        $post->update($validated);

        return response(['status' => 'Post updated.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post): Response
    {
        $post->delete();

        return response(['status' => 'Post deleted.']);
    }
}
