<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ContributorsController extends Controller
{
    public function show(Request $request) {
        
        return view('contributors');
    }
}
