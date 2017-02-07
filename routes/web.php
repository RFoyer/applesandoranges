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

Auth::routes();

Route::get('search', 'SearchFormSubmitController@show');

Route::get('autocomplete', 'SearchAutocompleteController@show');

Route::post('/', 'RatingController@store');

Route::get('table', 'TableDataController@show');

Route::get('user', 'UserController@index');

Route::get('{path}', 'GetPathController@index')->where('path', '.*');



