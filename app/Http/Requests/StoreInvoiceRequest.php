<?php

namespace App\Http\Requests;

use App\Models\Invoice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Indicates if the validator should stop on the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = true;

    /**
     * authorization logic for the request is handled in another part of your application,
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //bail - stop running validation rules on an attribute after the first validation failure
            //The amount field must have 0-1 decimal places.
            'amount' => 'bail|required|decimal:0,1|max:1000000',
            'status' => ['required', 'string', Rule::in(Invoice::STATUS)],
            'customer_id' => 'required|integer',
        ];
    }

    //Customizing the Error Messages
    public function messages(): array
    {
        return [
            'amount.required' => 'An amount is required',
            'status.required' => 'A status is required',
        ];
    }

    //Customizing the Validation Attributes
    public function attributes(): array
    {
        return [
            'customer_id' => 'customer identifier',
        ];
    }
}
