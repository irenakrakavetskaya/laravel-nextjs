<?php

namespace App\Http\Controllers;

use App\Models\Revenue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RevenueController extends Controller
{
    public function index()
    {
        $revenues = Revenue::orderBy('month','asc')->get();

        return $revenues;
    }
}
