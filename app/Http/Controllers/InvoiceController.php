<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
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

        return response([
            'invoices' => $invoices,
            'count' => $invoicesCount,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request): Response
    {
        $validated = $request->validated();

        $invoice = Invoice::create($validated);

        return response(['status' => 'Invoice created.'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice): Invoice
    {
        Log::info('Showing the invoice for : {id}', ['id' => $invoice->id]);
        //in logs
        //[2024-04-26 12:30:50] local.INFO: Showing the invoice for : 1 {"id":1}

        //You may return Eloquent ORM model, Laravel will automatically convert the model to JSON responses
        return $invoice;
    }

    /**
     * Update the specified resource in storage.
     */
    // route parameters ($invoice) should be after your other dependencies (Request $request)
    public function update(Request $request, Invoice $invoice): Response
    {
        $validated = $request->validate([
            'amount' => 'required',
            'status' => 'required|string',
            'customer_id' => 'required|integer',
        ]);

        $invoice->update($validated);

        return response(['status' => 'Invoice updated.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice): Response
    {
        $invoice->delete();

        return response(['status' => 'Invoice deleted.']);
    }
}
