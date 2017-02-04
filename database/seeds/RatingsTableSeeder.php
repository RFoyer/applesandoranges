<?php

use Illuminate\Database\Seeder;

use App\Ratable;

class RatingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ratings')->insert([
            'ratable_id' => Ratable::where('name', 'Breaking Bad')->value('id'),
            'user_id' => 1,
            'anonymous' => false,
            'rating' => 5
        ]);
    }
}
