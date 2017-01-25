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
    $trend1 = DB::table('Ratables')->where('name', 'Green Bay Packers')->value('name');
    $trend2 = DB::table('Ratables')->where('id', '2')->value('name');
    $trend3 = DB::table('Ratables')->where('id', '3')->value('name');
    return view('home', ['trend1' => $trend1, 'trend2' => $trend2, 'trend3' => $trend3]);
});

Auth::routes();

//Route::get('/home', 'HomeController@index');

Route::get('search', 'SearchController@show');
