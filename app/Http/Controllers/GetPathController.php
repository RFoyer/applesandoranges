<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GetPathController extends Controller
{
    public function index(Request $request)
    {
        $path = urldecode($request->path());
        if (ratable::where('name', $path)->value('name') === $path)
        {
            return view('ratable');
        }
        else if (false)
        {
            //auth
        }
        else
        {
            return view('notFound');
        }        
    }
}
