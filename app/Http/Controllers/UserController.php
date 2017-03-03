<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Review;
use App\Rating;
use App\Ratable;


class UserController extends Controller
{
    public function index($id) {
        return view('user');        
    }
    
    public function show($id) {
        $user = User::where('id', $id)->first();
        $data = [];
        if ($user) {
            $userRatings = new Rating;
            $userReviews = new Review;
            $userRatings = Rating::where('user_id', $id)->get();
            $userReviews = Review::where('user_id', $id)->get();
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
