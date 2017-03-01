<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Ratable;
use App\Rating;

class RatableController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $ratable = $request->input('name');
        $query = DB::select('select * from ratables where lower(name) like ? limit 1', [strtolower($ratable)]);
        $data = [];
        if ($query)
        {
            foreach ($query as $q) {
                $userRating = Rating::where([
                    ['user_id', '=', Auth::id()],
                    ['ratable_id', '=', $q->id]
                ])->first();
                if ($userRating) {
                    $userRating = $userRating->rating;
                }
                else {        
                    $userRating = 0;
                }
                $allRatings = Rating::where('ratable_id', $q->id);
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
                if ($q->img_src === "#") {
                $q->img_src = "https://upload.wikimedia.org/wikipedia/commons/7/71/Arrow_east.svg";                    
            }
                $data = ['name' => $q->name, 'img_src' => $q->img_src, 'desc' => $q->desc, 'rating' => $rating, 'userRating' => $userRating, 'numberOfRatings' => $numberOfRatings];
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
