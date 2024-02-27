<?php

namespace App\Http\Controllers;

use App\Models\Revenue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

class RevenueController extends Controller
{
    public function index(): JsonResponse
    {
        $revenues = Revenue::orderBy('month','asc')->get();

        return response()->json($revenues);
    }
}
