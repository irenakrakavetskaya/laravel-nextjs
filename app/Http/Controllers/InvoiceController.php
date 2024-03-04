<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $request->get('limit');
        $offset = $request->get('offset');
        $status = $request->get('status');
        $input = $request->get('query');
        $invoices = Invoice::with('customer')->latest('created_at');

        if ($status) {
            $invoices->where('status', strtoupper($status));
        }
        if ($input) {
            if (is_numeric($input)) {
                $input *= 100;
            }
            $invoices
           ->whereHas('customer', function ($query) use ($input) {
                $query->where('name', 'like', "%{$input}%")
                ->orWhere('email', 'LIKE', "%{$input}%");;
            })
            ->orwhere('amount', 'LIKE', "%{$input}%")
            ->orWhere('status', 'LIKE', "{$input}");
        }

        if ($offset) {
            $invoices->offset($offset);
        }
        if ($limit) {
            $invoices->take($limit);
        }

        $invoices = $invoices->get();
        $invoicesCount = $invoices->count();

        return response()->json([
            'invoices' => $invoices,
            'count' => $invoicesCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required',
            'status' => 'required',
            'customer_id' => 'required',
        ]);

        $invoice = Invoice::create($validated);

        return response()->json(['status' => 'Invoice created.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice): JsonResponse
    {
        $record = Invoice::find($invoice->id)->toArray();

        return response()->json($record);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice): JsonResponse
    {
        $record = Invoice::find($invoice->id)->toArray();

        return response()->json($record);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required',
            'status' => 'required',
            'customer_id' => 'required',
        ]);

        $invoice->update($validated);

        return response()->json(['status' => 'Invoice updated.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice): JsonResponse
    {
        $invoice->delete();

        return response()->json(['status' => 'Invoice deleted.']);
    }
}
