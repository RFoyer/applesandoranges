<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Ratable;
use App\User;
use App\Review;

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
        if (Auth::check()) {
            $ratable = $request->input('ratable');
            $newReview = $request->input('review');
            $ratableID = Review::where('name', $ratable)->value('id');
            $rvw = Review::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', $ratableID]
                ])->first();
            if ($rvw) {
                if ($rvw->review !== $newReview) {
                    $rvw->review = $newReview;
                    $rvw->save();
                }
            }
            else {
                $rvw = new Review;
                $rvw->user_id = Auth::id();
                $rvw->ratable_id = $ratableID;
                $rvw->anonymous = false;
                $rvw->review = $newReview;
                $rvw->save();
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
        //
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
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
