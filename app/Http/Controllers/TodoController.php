<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(): JsonResponse
    {
        $todos = Todo::all()->toArray();

        return response()->json($todos);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'todo' => 'required',
        ]);

        Todo::create($validated);

        return response()->json(['status' => 'Todo created.']);
    }

    public function destroy(Todo $todo): JsonResponse
    {
        $todo->delete();

        return response()->json(['status' => 'Todo deleted.']);
    }
}
