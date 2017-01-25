<?php

use Illuminate\Database\Seeder;

class RatablesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ratables')->insert([
            'name' => 'Green Bay Packers'            
        ]);
    }
}
