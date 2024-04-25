<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    public const STATUS = [
        'paid',
        'pending'
    ];

    protected $table = 'invoices';

    protected $fillable = [
        'amount', 'status', 'customer_id'
    ];

    /**
     * Get the customer that owns the invoice
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
