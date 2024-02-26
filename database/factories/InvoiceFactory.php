<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount' => fake()->numberBetween(1, 10000),
            'status' => fake()->randomElement(['paid', 'pending']),
            'customer_id' => Customer::all()->random()->id,
            'created_at' => fake()->dateTimeBetween('-1 month', '-1 week'),
            'updated_at' => fake()->dateTimeBetween('-1 week'),
        ];
    }
}
