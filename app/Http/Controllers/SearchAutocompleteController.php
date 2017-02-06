<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Ratable;

class SearchAutocompleteController extends Controller
{
    public function show(Request $request) {
        return response()->json([Ratable::where('name', 'like', $request->input('term').'%')->value('name')]);        
    }
}
