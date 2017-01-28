<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GetJsonController extends Controller
{
    public function index(Request $request)
    {
        //$req = $request->input('req');
        if (true)
        {
            return response()->json(['load-data' => 
                ['highest-rated' => 
                    [
                        0 => ['name' => 'Green Bay Packers', 'rating' => 4.9, 'numberOfRatings' => 25],
                        1 => ['name' => 'Netflix', 'rating' => 4.4, 'numberOfRatings' => 77]
                    ]
                ]
            ]);
        }
        else
        {
            return response()->json(['load-data' => '']);
        }
    }
}
