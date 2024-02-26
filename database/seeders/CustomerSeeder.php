<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //repeat php artisan db:seed --class=CustomerSeeder several times
        DB::table('customers')->insert([
            'name' => Str::random(10),
            'email' => Str::random(10).'@example.com',
            'created_at' => fake()->dateTimeBetween('-1 month', '-1 week'),
            'updated_at' => fake()->dateTimeBetween('-1 week'),
        ]);
    }
}
