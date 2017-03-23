<?php

use Illuminate\Database\Seeder;
use App\Ratable;

class AandOSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $ratable = Ratable::where('name', 'Apples and Oranges')->first();
        $ratable->img_src = '/images/a-and-o.jpg';
        $ratable->save();
        
        /*$ratable = Ratable::where('name', 'Downton Abbey')->first();
        $ratable->desc = 'Historical period drama tv series (2010-2015) set in the fictional Yorkshire country estate of Downton Abbey between 1912 and 1925.';
        $ratable->save();*/
    }
}
