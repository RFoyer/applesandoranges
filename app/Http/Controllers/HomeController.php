<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Ratable;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $model = [];
        $viewData = [];
        $viewData['guest'] = Auth::guest();
        if ($viewData['guest'])       
        {
            //
        }
        else
        {
            $model['ranking'] = [ 0 => [ 'name' => '', 'rating' => '']];
            $model['ranking'][0]['name'] = Ratable::where('name', 'Green Bay Packers')->value('name');
            $model['ranking'][0]['rating'] = Ratable::where('name', 'Green Bay Packers')->value('Rating');
        }
        return view('home', ['model' => $model, 'viewData' => $viewData]);
    }
}
