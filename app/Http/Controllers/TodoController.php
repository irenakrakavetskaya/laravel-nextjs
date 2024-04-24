<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TodoController extends Controller
{
    public function index(): Response
    {
        $todos = Todo::all()->toArray();

        return response($todos);
    }

    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'todo' => 'required',
        ]);

        Todo::create($validated);

        return response(['status' => 'Todo created.'], 201);
    }

    public function destroy(Todo $todo): Response
    {
        $todo->delete();

        return response(['status' => 'Todo deleted.']);
    }
}
