<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class SearchAutocompleteController extends Controller
{
    public function show(Request $request) {
        $response = [];
        $query = DB::select('select * from ratables where lower(name) like ? limit 3', [strtolower($request->input('term')).'%']);
        foreach ($query as $q) {
            if ($q->img_src === "#") {
                        $q->img_src = "https://upload.wikimedia.org/wikipedia/commons/7/71/Arrow_east.svg";
                    }
            array_push($response, ['value' => $q->name, 'img' => $q->img_src, 'id' => $q->id]);            
        }
        return response()->json($response);        
    }
}
