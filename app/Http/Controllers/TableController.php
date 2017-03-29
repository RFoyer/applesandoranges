<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Ratable;
use App\User;
use App\Review;
use App\Rating;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    public function show(Request $request, $table) {
        $data = [];
        if (Auth::check()) {
            $thisUserId = Auth::id();
        }
        else {
            $thisUserId = 0;
        }
        if ($table === 'master') {
            $ratable = Ratable::where([
                ['approved', '=', true],
                ['id', '=', 1 + (int)$request->input('skip')]
            ])->first();
        }
        else if ($table === 'proposed') {
            $ratable = Ratable::where('approved', false)->skip((int)$request->input('skip'))->first();
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
        else if ($table === 'contributors') {
            $users = DB::table('ratings')->select(DB::raw('user_id, count(user_id) as user_count'))->groupBy('user_id')->orderBy('user_count', 'desc')->take(10)->get();
            $data = [];
            foreach($users as $u) {
                $user = User::where('id', $u->user_id)->first();
                $numberOfRatings = Rating::where('user_id', $user->id)->count();
                $numberOfReviews = Review::where('user_id', $user->id)->count();
                $numberOfProposedRatables = Ratable::where('creator_id', $user->id)->count();
                $numberOfApprovedRatables = Ratable::where('creator_id', $user->id)->where('approved', true)->count();
                //$numberOfPendingRatables = diff between last two
                //$numberOfRejectedRatables
                array_push($data, ['name' => htmlspecialchars($user->name),
                    'email' => $user->email,
                    'id' => $user->id,
                    'numberOfRatings' => (empty($numberOfRatings)) ? 0 : $numberOfRatings,
                    'numberOfReviews' => (empty($numberOfReviews)) ? 0 : $numberOfReviews,
                    'numberOfProposedRatables' => (empty($numberOfProposedRatables)) ? 0 : $numberOfProposedRatables,
                    'numberOfApprovedRatables' => (empty($numberOfApprovedRatables)) ? 0 : $numberOfApprovedRatables
                ]);
            }
        }
        else if ($table === 'user') {
            $id = $request->input('id');
            $user = User::where('id', (int)$id)->first();
            if ($user) {
                $userRatings = new Rating;
                $userReviews = new Review;
                if ((int)$id === (int)$thisUserId) {
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
                    $ratings[] = ['rating' => $r->rating, 'anonymous' => $r->anonymous, 'ratable' => htmlspecialchars(Ratable::where('id', $r->ratable_id)->value('name'))];
                }
                foreach ($userReviews as $r) {
                    $reviews[] = ['review' => htmlspecialchars($r->review), 'headline' => htmlspecialchars($r->headline), 'date' => date('F j, Y', strtotime((string)$r->updated_at)), 'anonymous' => $r->anonymous, 'ratable' => htmlspecialchars(Ratable::where('id', $r->ratable_id)->value('name'))];
                }
                $data = ['username' => htmlspecialchars($user->name), 'ratings' => $ratings, 'reviews' => $reviews];        
            }
        }
        if (isset($ratable)) {
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
                    ['user_id', '=', (int)$thisUserId],
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
            $data = ['id' => $ratable->id, 'name' => htmlspecialchars($ratable->name), 'style' => $ratable->style, 'img_src' => $ratable->img_src, 'desc' => htmlspecialchars($ratable->desc), 'isApproved' => $ratable->approved, 'region' => htmlspecialchars($region), 'userRating' => $userRating, 'isAnonymous' => $isAnonymous, 'rating' => $rating, 'numberOfRatings' => $numberOfRatings];
        }
        
        return response()->json($data);
    }
}
