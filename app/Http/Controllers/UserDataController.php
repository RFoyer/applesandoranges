<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use App\Review;
use App\Rating;
use App\Ratable;

class UserDataController extends Controller
{
    public function show(Request $request) {
        $userId = (int)substr($request->path(), 14);
        $user = User::where('id', $userId)->first();
        $data = [];
        if ($user) {
            $userRatings = new Rating;
            $userReviews = new Review;
            $userRatings = Rating::where('user_id', $userId)->get();
            $userReviews = Review::where('user_id', $userId)->get();
            $ratings = [];
            $reviews = [];
            foreach ($userRatings as $r) {
                $ratings[] = ['rating' => $r->rating, 'anonymous' => $r->anonymous, 'ratable' => Ratable::where('id', $r->ratable_id)->value('name')];
            }
            foreach ($userReviews as $r) {
                $reviews[] = ['review' => $r->review, 'anonymous' => $r->anonymous, 'ratable' => Ratable::where('id', $r->ratable_id)->value('name')];
            }
            $data = ['username' => $user->name, 'ratings' => $ratings, 'reviews' => $reviews];        
        }
        return response()->json($data);
    }
}
