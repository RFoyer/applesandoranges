<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Ratable;
use App\User;
use App\Rating;
use Illuminate\Support\Facades\Auth;

class TableDataController extends Controller
{
    public function show(Request $request)
    {
        $id = (int)$request->input('id');
        $ratable = Ratable::where('id', $id)->first();
        if ($ratable->img_src === "#") {
            $ratable->img_src = "https://upload.wikimedia.org/wikipedia/commons/7/71/Arrow_east.svg";                    
        }
        $prevRating = Rating::where([
                    ['user_id', '=', Auth::id()],
                    ['ratable_id', '=', $ratable->id]
                ])->first();
        $prev;
        if ($prevRating) {
            $prev = $prevRating->rating;
        }
        else {        
            $prev = 0;
        }
        $data = ['name' => $ratable->name, 'img_src' => $ratable->img_src, 'desc' => $ratable->desc, 'prevRating' => $prev];        
        
        return response()->json($data);        
    }   
}
