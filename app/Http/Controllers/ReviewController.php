<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Ratable;
use App\User;
use App\Review;
use App\Rating;

use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'review' => 'required|max:4500',
            'headline' => 'max:100'
        ]);
        
        if (Auth::check()) {
            $newReview = $request->input('review');
            $isAnonymous = $request->input('anonymous');
            $newHeadline = $request->input('headline');
            $ratableId = Ratable::where('name', $request->input('ratable'))->value('id');
            $oldReview = Review::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', $ratableId]
                ])->first();
            if ($oldReview) {
                if (($oldReview->review !== $newReview) || ($oldReview->headline !== $newHeadline)) {
                    $this->update($request, $ratableId);
                }                
            }
            else {
                $review = new Review;
                $review->user_id = Auth::id();
                $review->ratable_id = $ratableId;
                $review->anonymous = $isAnonymous;
                $review->headline = $newHeadline;
                $review->review = $newReview;
                $review->save();
            }            
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $data = [];
        if ($request->input('userId') === 'useAuthId') {
            $ratableId = Ratable::where('name', $request->input('ratable'))->value('id');
            $review = Review::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', $ratableId]
            ])->first();
            if ($review) {
                $rating = Rating::where([
                    ['user_id', '=', Auth::id()],
                    ['ratable_id', '=', $ratableId]
                ])->first();
                if ($rating) {
                    if (!$rating->anonymous) {
                        $rating = $rating->rating;
                    }
                    else {
                        $rating = 0;
                    }
                }
                else {
                    $rating = 0;
                }
                $data = ['review' => $review->review, 'headline' => $review->headline, 'user' => Auth::user()->name, 'date' => date('F j, Y', strtotime((string)$review->updated_at)), 'rating' => $rating];
            }
        }
        else if ($request->input('userId') === 'useSkip') {
            $ratableId = Ratable::where('name', $request->input('ratable'))->value('id');
            $review = Review::where('ratable_id', $ratableId)->skip($request->input('skip'))->first();
            if ($review) {
                if ($review->anonymous) {
                    $user = "";
                }
                else {
                    $user = User::where('id', $review->user_id)->value('name');
                }
                $rating = Rating::where([
                    ['user_id', '=', $review->user_id],
                    ['ratable_id', '=', $ratableId],
                    ['anonymous', '=', false]
                ])->first();
                if ($rating) {
                    $rating = $rating->rating;
                }
                else {
                    $rating = 0;
                }
                $data = ['review' => $review->review, 'headline' => $review->headline, 'user' => $user, 'date' => date('F j, Y', strtotime((string)$review->updated_at)), 'rating' => $rating];
            }
        }
        else {
            $review = Review::where([
                ['user_id', '=', (int)$request->input('userId')],
                ['anonymous', '=', false]
            ])->skip($request->input('skip'))->first();
            if ($review) {
                $rating = Rating::where([
                    ['user_id', '=', $review->user_id],
                    ['ratable_id', '=', $review->ratable_id],
                    ['anonymous', '=', false]
                ])->first();
                if ($rating) {
                    $rating = $rating->rating;
                }
                else {
                    $rating = 0;
                }
                $data = ['review' => $review->review, 'headline' => $review->headline, 'date' => date('F j, Y', strtotime((string)$review->updated_at)), 'rating' => $rating];
            }
        }
        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $ratableId)
    {
        if (Auth::check()) {
            $review = Review::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', $ratableId]
                ])->first();
            if ($review) {
                if ($request->input('review')) {
                    $review->review = $request->input('review');
                    $anonymous = false;
                    if ($request->input('anonymous') === "true") {
                        $anonymous = true;
                    }
                    $review->anonymous = $anonymous;
                    $review->headline = $request->input('headline');
                    $review->save();
                }
                else if ($request->input('anonymous')) {
                    $anonymous = false;
                    if ($request->input('anonymous') === "true") {
                        $anonymous = true;
                    }
                    $review->anonymous = $anonymous;
                    $review->save();
                }
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (Auth::check()) {
            $review = Review::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', (int)$id]
            ])->first();
            if ($review) {
                $review->delete();
            }
        }
    }
}
