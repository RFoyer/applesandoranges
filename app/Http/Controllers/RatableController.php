<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Ratable;
use App\Rating;
use App\Review;

class RatableController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($path)
    {
        return view('ratable');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('create', ['newRatable' => 'create']);
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
            'name' => 'required|unique:ratables|max:45',
            'location' => 'max:60',
            'desc' => 'required|max:450'
        ]);
        
        if (Auth::check()) {
            $ratable = new Ratable;
            $ratable->name = $request->name;
            if (!empty($request->location)) {
                $ratable->class = 'region:{'.$request->location.'}';
            }
            $ratable->desc = $request->desc;
            $ratable->creator_id = Auth::id();
            $ratable->save();
            return view('create', ['newRatable' => $ratable->name]);
        }        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $table, $skip)
    {
        $skip = (int)$skip;
        $data = [];
        if ($table === 'master') {
            $ratable = Ratable::where([
                ['approved', '=', true],
                ['id', '=', 1 + $skip]
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
