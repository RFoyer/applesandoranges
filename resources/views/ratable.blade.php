@extends('layouts.app')

@section('content')
<div class="panel-body">
                {{ $model['name'] }}:<br>
                     Rating: {{ $model['rating'] }} stars<br>
                     Number of Ratings: {{ $model['numberOfRatings'] }}
            </div>
@endsection

