<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Review;
use App\Rating;
use App\Ratable;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index($id) {
        return view('user');        
    }
    
    public function show($id) {
        $user = User::where('id', (int)$id)->first();
        $data = [];
        if ($user) {
            $userRatings = new Rating;
            $userReviews = new Review;
            if ((int)$id === Auth::id()) {
                $userRatings = Rating::where('user_id', (int)$id)->get();
                $userReviews = Review::where('user_id', (int)$id)->get();
            }
            else {
                $userRatings = Rating::where([
                    ['user_id', '=', (int)$id],
                    ['anonymous', '=', false]
                ])->get();
                $userReviews = Review::where([
                    ['user_id', '=', (int)$id],
                    ['anonymous', '=', false]
                ])->get();
            }
            $ratings = [];
            $reviews = [];
            foreach ($userRatings as $r) {
                $ratings[] = ['rating' => $r->rating, 'anonymous' => $r->anonymous, 'ratable' => Ratable::where('id', $r->ratable_id)->value('name')];
            }
            foreach ($userReviews as $r) {
                $reviews[] = ['review' => $r->review, 'headline' => $r->headline, 'date' => date('F j, Y', strtotime((string)$r->updated_at)), 'anonymous' => $r->anonymous, 'ratable' => Ratable::where('id', $r->ratable_id)->value('name')];
            }
            $data = ['username' => $user->name, 'ratings' => $ratings, 'reviews' => $reviews];        
        }
        return response()->json($data);
    }
}
