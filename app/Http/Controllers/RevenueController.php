<?php

namespace App\Http\Controllers;

use App\Models\Revenue;
use Illuminate\Http\Response;

class RevenueController extends Controller
{
    public function index(): Response
    {
        $revenues = Revenue::orderBy('month','asc')->get();

        return response($revenues);
    }
}
