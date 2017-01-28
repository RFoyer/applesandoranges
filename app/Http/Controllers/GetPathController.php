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
            $model = [];
            $model['name'] = $path;
            $model['rating'] = Ratable::where('name', $path)->value('Rating');
            $model['numberOfRatings'] = Ratable::where('name', $path)->value('NumberOfRatings');
            return view('ratable', ['model' => $model]);
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
