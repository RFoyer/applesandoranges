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
            if (isset($ratableId)) {
                $oldReview = Review::where([
                    ['user_id', '=', Auth::id()],
                    ['ratable_id', '=', $ratableId]
                    ])->first();
                if ($oldReview) {
                    $this->update($request, $ratableId);               
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
                if ($review->anonymous) {
                    $anonymous = true;
                }
                else {
                    $anonymous = false;
                }
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
                $data = ['review' => htmlspecialchars($review->review), 'anonymous' => $anonymous, 'headline' => htmlspecialchars($review->headline), 'userId' => Auth::id(), 'user' => htmlspecialchars(Auth::user()->name), 'date' => date('F j, Y', strtotime((string)$review->updated_at)), 'rating' => $rating];
            }
        }
        else if ($request->input('userId') === 'all') {
            $ratableId = Ratable::where('name', $request->input('ratable'))->value('id');
            $reviews = Review::where('ratable_id', $ratableId)->get();
            $reviewsArr = [];
            if ($reviews) {
                foreach($reviews as $review) {
                    if ($review->anonymous) {
                        $user = "";
                        $userId = '';
                    }
                    else {
                        $user = User::where('id', $review->user_id)->value('name');
                        $userId = $review->user_id;
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
                    $reviewsArr[] = ['review' => htmlspecialchars($review->review), 'headline' => htmlspecialchars($review->headline), 'userId' => $userId, 'user' => htmlspecialchars($user), 'date' => date('F j, Y', strtotime((string)$review->updated_at)), 'rating' => $rating];                    
                }
                $data = ['reviews' => $reviewsArr];
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
                $data = ['review' => htmlspecialchars($review->review), 'headline' => htmlspecialchars($review->headline), 'date' => date('F j, Y', strtotime((string)$review->updated_at)), 'rating' => $rating];
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
