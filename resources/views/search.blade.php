@extends('layouts.app')

@section('content')

<div class="panel-body">
    @if ($notFound)
    No search results matching <mark>{{ $searchString }}</mark>.
    @else
    Search Results:<br>
    {{ $model['name'] }} - {{ $model['rating'] }} stars ({{ $model['numberOfRatings'] }} ratings)
    @endif
</div>
@endsection

