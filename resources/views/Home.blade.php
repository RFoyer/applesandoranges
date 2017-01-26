@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel-heading">
                @if ($model['guest'])
                Please <a href="/login">login</a> to rate items.
                @else
                Hello, {{ Auth::user()->name }}.    
                @endif
            </div>
                <div class="panel-body">
                    <form>
                        <input type='text' placeholder="Search Appples and Oranges..." name='q' size="50">
                        <input type='submit' formaction='/search' value="Submit"><br>
                    </form>
                </div>
            <div class="panel-body">
                @if ($model['guest'])
                Highest Rated:<br>
                    <a href='#'>Green Bay Packers</a> - 5.0 stars<br>
                    <a href='#'>Netflix</a> - 4.4 stars<br>
                    <a href='#'>New England Patriots</a> - 1.2 stars<br>
                @else
                Things you might like to rate:<br>
                    <a href='#'>Green Bay Packers</a> - 5.0 stars - My Rating: <br>
                <br>
                Highest Rated:<br>
                    <a href='#'>Green Bay Packers</a> - 5.0 stars<br>
                    <a href='#'>Netflix</a> - 4.4 stars<br>
                    <a href='#'>New England Patriots</a> - 1.2 stars<br>                
                @endif
            </div>
	</div>
    </div>
</div>
@endsection
