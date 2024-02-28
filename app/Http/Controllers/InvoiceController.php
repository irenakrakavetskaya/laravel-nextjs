<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $request->get('limit');
        $status = $request->get('status');
        $invoices = Invoice::with('customer')->latest('created_at');
        if ($status) {
            $invoices->where('status', strtoupper($status));
        }
        if ($limit) {
            $invoices->take($limit);
        }
        $invoices = $invoices->get();

        return response()->json($invoices);
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
    public function store(StoreInvoiceRequest $request)
    {
        //
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
    public function update(Request $request)
    {
        //$item = Item::find($id);
        /*$invoice->amount = $request->input('amount');
        $invoice->status = $request->input('status');
        $invoice->customerId = $request->input('customerId');
        $invoice->save();*/

        $invoice = Invoice::findOrFail($request->id);

        if ($invoice->updateOrFail($request->all()) === false) {
            return response(
                "Couldn't update the invoice with id {$request->id}",
                Response::HTTP_BAD_REQUEST
            );
        }

        return response($invoice);
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
