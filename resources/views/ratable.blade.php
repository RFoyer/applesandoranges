@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel-heading">
                @if (Auth::guest())
                    You are not logged in.
                @else
                    
                @endif
            </div>
                <div class="panel-body">
                    <form>
                        <input type='text' placeholder="Search Appples and Oranges..." name='q' size="50">
                        <input type='submit' formaction='/search' value="Submit"><br>
                    </form>
                </div>
                <div class="panel-body">
                    {{ $data['name'] }}:<br>
                    Rating: {{ $data['rating'] }} stars<br>
                    Number of Ratings: {{ $data['numberOfRatings'] }}
                </div>
		</div>
    </div>
</div>
@endsection

