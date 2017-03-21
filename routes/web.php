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

Route::get('table/{table}', 'TableController@show');

Route::post('rating', 'RatingController@store');

Route::post('rating/{id}', "RatingController@update");

Route::delete('rating/destroy/{id}', "RatingController@destroy");

Route::get('review', 'ReviewController@show');

Route::post('review', 'ReviewController@store');

Route::post('review/{id}', "ReviewController@update");

Route::delete('review/destroy/{id}', "ReviewController@destroy");

Auth::routes();

Route::get('search', 'SearchFormSubmitController@show');

Route::get('autocomplete', 'SearchAutocompleteController@show');

Route::get('ratable/create', 'RatableController@create');

Route::post('ratable/create/success', 'RatableController@store');

//Route::get('admin', function(){return view('home');});

Route::get('proposed', 'HomeController@index');

Route::get('user/{id}', 'UserController@index');

Route::get('user/userdata/{id}', 'UserController@show');

Route::get('contributors', "ContributorsController@index");

Route::get('contributors/retrieve/{skip}', "ContributorsController@show");

Route::get('{path}', "RatableController@index");