<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Ratable;

class GetPathController extends Controller
{
    public function index(Request $request)
    {
        $path = urldecode($request->path());
        if (Ratable::where('name', $path)->value('name') === $path)
        {
            return view('ratable');
        }
        else if (false)
        {
            
        }
        else
        {
            return view('notFound');
        }        
    }
}
