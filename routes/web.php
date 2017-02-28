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

Route::get('/', 'HomeController@index');

Route::post('/', 'RatingController@store');

Route::post('review', 'ReviewController@store');

Auth::routes();

Route::get('search', 'SearchFormSubmitController@show');

Route::get('autocomplete', 'SearchAutocompleteController@show');

Route::get('table', 'TableDataController@show');

//Route::get('admin', function(){return view('home');});

Route::get('ratable', 'RatableController@show');

Route::get('user/userdata/{id}', 'UserDataController@show')->where('id', '.*');

Route::get('user/{id}', 'UserController@show')->where('id', '.*');

Route::get('contributors', "ContributorsController@show");

Route::get('{path}', function(){return view('ratable');})->where('path', '.*');



