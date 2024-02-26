<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Revenue>
 */
class RevenueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'revenue' => fake()->numberBetween(1000, 4000),
            'month' => fake()->unique()->numberBetween(1, 12),
            'created_at' => fake()->dateTimeBetween('-1 month', '-1 week'),
            'updated_at' => fake()->dateTimeBetween('-1 week'),
        ];
    }
}
