<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Ratable;
use App\User;
use App\Rating;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Auth;


class RatingController extends Controller
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
        if (Auth::check()) {
            $ratable = $request->input('ratable');
            $newRating = $request->input('rating') + 1;
            $newAnonymous = false;
            if ($request->input('anonymous') === "true") {
                $newAnonymous = true;
            }
            $ratableId = Ratable::where('name', $ratable)->value('id');
            $rtg = Rating::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', $ratableId]
                ])->first();
            if ($rtg) {
                if (($rtg->rating !== $newRating) || ($rtg->anonymous !== $newAnonymous)) {
                    $this->update($request, $ratableId);                  
                }
            }
            else {
                $rtg = new Rating;
                $rtg->user_id = Auth::id();
                $rtg->ratable_id = $ratableId;
                $rtg->anonymous = $newAnonymous;
                $rtg->rating = $newRating;
                $rtg->save();
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
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
            $rating = Rating::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', $ratableId]
                ])->first();
            if ($rating) {
                if (Input::has('rating')) {
                    $rating->rating = $request->input('rating') + 1;
                    $anonymous = false;
                    if ($request->input('anonymous') === "true") {
                        $anonymous = true;
                    }
                    $rating->anonymous = $anonymous;
                    $rating->save();
                }
                else if (Input::has('anonymous')) {
                    $anonymous = false;
                    if ($request->input('anonymous') === "true") {
                        $anonymous = true;
                    }
                    $rating->anonymous = $anonymous;
                    $rating->save();
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
            $rating = Rating::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', (int)$id]
            ])->first();
            if ($rating) {
                $rating->delete();
            }
        }
    }
}
