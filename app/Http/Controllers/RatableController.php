<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Ratable;
use App\Rating;
use App\Review;

class RatableController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($path)
    {
        $ratable = Ratable::where('name', $path)->first();
        $view = "notFound";
        if (isset($ratable)) {
            $view = 'ratable';
        }
        return view($view);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('create', ['newRatable' => 'create']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => ['required', 'unique:ratables', 'max:45', 'regex:/^[\w\s\.,?!\(\)"\']+$/'],
            'location' => 'max:60',
            'desc' => ['required', 'max:450', 'regex:/^[\w\s\.,?!\(\)"\']+$/']
        ]);
        
        if (Auth::check()) {
            $ratable = new Ratable;
            $ratable->name = $request->name;
            if (!empty($request->location)) {
                $ratable->class = 'region:{'.$request->location.'}';
            }
            $ratable->desc = $request->desc;
            $ratable->creator_id = Auth::id();
            $ratable->save();
            return view('create', ['newRatable' => $ratable->name]);
        }        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
