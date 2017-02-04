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

Route::get('search', 'SearchController@show');

Route::post('/', 'RatingController@store');

Route::get('json', 'GetJsonController@index');

Route::get('user', 'UserController@index');

Route::get('{path}', 'GetPathController@index')->where('path', '.*');



