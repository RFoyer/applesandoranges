<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Ratable;
use App\User;
use App\Rating;
use Illuminate\Support\Facades\Auth;

class GetJsonController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->input('page');
        $data = [];
        
        switch ($page) {
            case 'home':
                $things = Ratable::orderBy('name')->take(10)->get();
                
                $data = ['things-to-rate' => array(), 'highest-rated' => array()];
                $r;
                $i = 0;
                foreach ($things as $h) {
                    $img = $h['img_src'];
                    $imgRat = $h['img_use_rationale_src'];
                    if ($img === "#") {
                        $img = "https://upload.wikimedia.org/wikipedia/commons/7/71/Arrow_east.svg";
                        $imgRat = 'https://commons.wikimedia.org/wiki/File:Arrow_east.svg';
                    }
                    $r = array('name' => $h['name'], 'img_src' => $img, 'img_use_rationale_src' => $imgRat, 'desc' => $h['desc'], 'prevRating' => 0);
                    $prevRating = Rating::where([
                ['user_id', '=', Auth::id()],
                ['ratable_id', '=', Ratable::where('name', $r['name'])->value('id')]
                ])->first();
                    if ($prevRating) {
                        $r['prevRating'] = $prevRating->rating;
                    }
                    array_push($data['things-to-rate'], $r);                    
                }
                
                break;
            case 'ratable':
                
                break;
            case 'user':
                //
                break;
            default:
                $data = '';                
        }
        
        return response()->json($data);        
    }
}
