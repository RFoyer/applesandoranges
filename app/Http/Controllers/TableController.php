<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Ratable;
use App\User;
use App\Review;
use App\Rating;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    public function show(Request $request, $table) {
        $data = [];
        if ($table === 'master') {
            $ratable = Ratable::where([
                ['approved', '=', true],
                ['id', '=', 1 + (int)$request->input('skip')]
            ])->first();
        }
        else if ($table === 'proposed') {
            $ratable = Ratable::where('approved', false)->skip($skip)->first();
        }
        else if ($table === 'home') {
            $rat = DB::select('select * from ratables where lower(name) like ? limit 1', [strtolower($request->input('name'))]);
            foreach ($rat as $r) {
                $ratable = $r;
            }
        }
        else if ($table === 'search') {
            $ratable = Ratable::where('id', $request->input('id'))->first();
        }            
        if ($ratable) {
            if ($ratable->img_src === "#") {
                $ratable->img_src = "https://upload.wikimedia.org/wikipedia/commons/7/71/Arrow_east.svg";                    
            }
            $region = '';
            $substrStartIndex = strpos($ratable->class, '{');
            if ($substrStartIndex !== false) {
                $substrLength = strpos($ratable->class, '}') - $substrStartIndex - 1;
                $region = substr($ratable->class, $substrStartIndex + 1, $substrLength);
            }
            $userRating = Rating::where([
                    ['user_id', '=', Auth::id()],
                    ['ratable_id', '=', $ratable->id]
                ])->first();
            $isAnonymous = false;
            if ($userRating) {
                $isAnonymous = $userRating->anonymous;
                $userRating = $userRating->rating;
            }
            else {        
                $userRating = 0;
            }
            $allRatings = Rating::where('ratable_id', $ratable->id);
            if ($allRatings->count()) {
                foreach ($allRatings as $r) {
                    $r->rating = (float)($r->rating.".0");
                }
                $rating = number_format($allRatings->avg('rating'), 1);
                $numberOfRatings = $allRatings->count();
            }
            else {
                $rating = number_format(0, 1);
                $numberOfRatings = 0;
            }
            $data = ['id' => $ratable->id, 'name' => $ratable->name, 'img_src' => $ratable->img_src, 'desc' => $ratable->desc, 'isApproved' => $ratable->approved, 'region' => $region, 'userRating' => $userRating, 'isAnonymous' => $isAnonymous, 'rating' => $rating, 'numberOfRatings' => $numberOfRatings];
        }        
        
        return response()->json($data);
    }
}
