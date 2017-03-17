<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use App\Rating;
use App\Review;
use App\Ratable;

use Illuminate\Support\Facades\DB;

class ContributorsController extends Controller
{
    public function index() {
        return view('contributors');
    }
    
    public function show($skip) {        
        $users = DB::table('ratings')->select(DB::raw('user_id, count(user_id) as user_count'))->groupBy('user_id')->orderBy('user_count', 'desc')->skip($skip)->take(10)->get();
        //$users = Rating::groupBy('user_id')->havingRaw('COUNT(user_id)')->skip($skip)->take(10)->get();
        $data = [];
        foreach($users as $u) {
            $user = User::where('id', $u->user_id)->first();
            $numberOfRatings = Rating::where('user_id', $user->id)->count();
            $numberOfReviews = Review::where('user_id', $user->id)->count();
            $numberOfProposedRatables = Ratable::where('creator_id', $user->id)->count();
            $numberOfApprovedRatables = Ratable::where('creator_id', $user->id)->where('approved', true)->count();
            //$numberOfPendingRatables = diff between last two
            //$numberOfRejectedRatables
            array_push($data, ['name' => $user->name,
                'email' => $user->email,
                'id' => $user->id,
                'numberOfRatings' => (empty($numberOfRatings)) ? 0 : $numberOfRatings,
                'numberOfReviews' => (empty($numberOfReviews)) ? 0 : $numberOfReviews,
                'numberOfProposedRatables' => (empty($numberOfProposedRatables)) ? 0 : $numberOfProposedRatables,
                'numberOfApprovedRatables' => (empty($numberOfApprovedRatables)) ? 0 : $numberOfApprovedRatables
            ]);
        }
        return response()->json($data);
    }
}
