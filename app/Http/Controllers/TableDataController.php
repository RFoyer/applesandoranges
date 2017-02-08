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
        $userRating = Rating::where([
                    ['user_id', '=', Auth::id()],
                    ['ratable_id', '=', $ratable->id]
                ])->first();
        if ($userRating) {
            $userRating = $userRating->rating;
        }
        else {        
            $userRating = 0;
        }
        $allRatings = Rating::where('ratable_id', $ratable->id)->get();
        if ($allRatings->count()) {
            $rating = $allRatings->avg('rating');
            $numberOfRatings = $allRatings->count();
        }
        else {
            $rating = 0;
            $numberOfRatings = 0;
        }
        $data = ['name' => $ratable->name, 'img_src' => $ratable->img_src, 'desc' => $ratable->desc, 'userRating' => $userRating, 'rating' => $rating, 'numberOfRatings' => $numberOfRatings];        
        
        return response()->json($data);        
    }   
}
