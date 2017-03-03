<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use App\Rating;
use App\Review;
use App\Ratable;

class ContributorsController extends Controller
{
    public function index() {
        return view('contributors');
    }
    
    public function show($skip) {        
        $users = User::orderBy('name')->skip($skip)->take(10)->get();
        $data = [];
        foreach($users as $u) {
            $numberOfRatings = Rating::where('user_id', $u->id)->count();
            $numberOfReviews = Review::where('user_id', $u->id)->count();
            $numberOfProposedRatables = Ratable::where('creator_id', $u->id)->count();
            $numberOfApprovedRatables = Ratable::where('creator_id', $u->id)->where('approved', true)->count();
            //$numberOfPendingRatables = diff between last two
            //$numberOfRejectedRatables
            array_push($data, ['name' => $u->name,
                'email' => $u->email,
                'id' => $u->id,
                'numberOfRatings' => (empty($numberOfRatings)) ? 0 : $numberOfRatings,
                'numberOfReviews' => (empty($numberOfReviews)) ? 0 : $numberOfReviews,
                'numberOfProposedRatables' => (empty($numberOfProposedRatables)) ? 0 : $numberOfProposedRatables,
                'numberOfApprovedRatables' => (empty($numberOfApprovedRatables)) ? 0 : $numberOfApprovedRatables
            ]);
        }
        usort($data, function($a, $b) {
            if ($a['numberOfRatings'] === $b['numberOfRatings']) {
                return 0;
            }
            return ($a['numberOfRatings'] > $b['numberOfRatings']) ? -1 : 1;
        });
        return response()->json($data);
    }
}
