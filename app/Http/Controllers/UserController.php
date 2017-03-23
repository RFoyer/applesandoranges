<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Review;
use App\Rating;
use App\Ratable;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show($id) {
        return view('user');        
    }
    
    public function destroy($id) {
        //must destory ratings/reviews data too!!!
    }
}
