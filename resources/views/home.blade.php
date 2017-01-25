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
                        <input type='text' placeholder="Search Appples and Oranges..." name='q'>
                        <input type='submit' formaction='/search' value="Submit"><br>
                    </form>
                </div>
                <div class="panel-body">
                    Trending Now:<br>
                    <a href='#'>{{ $trend }}</a> - 5.0 stars<br>
                    <a href='#'>New England Patriots</a> - 1.2 stars<br>
                    <a href='#'>Netflix</a> - 4.4 stars<br>
                </div>
		</div>
    </div>
</div>
@endsection
