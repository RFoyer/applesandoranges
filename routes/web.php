<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    $data = DB::table('ratables')->where('name', 'Green Bay Packers')->value('name');
    return view('home', ['trend' => $data]);
});

Auth::routes();

//Route::get('/home', 'HomeController@index');

Route::get('search', 'SearchController@show');
