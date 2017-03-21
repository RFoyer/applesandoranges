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
}
