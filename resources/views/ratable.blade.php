@extends('layouts.app')

@section('content')
<div class="panel-body">
    @if (Auth::guest())
        <div id='ratings-data' class="guest">

        </div>
        <div id='reviews-data'>

        </div>
    @else
        <div id='ratings-data' class="user">
        
        </div>
        <div id='reviews-data'>

        </div>
    @endif
</div>
@endsection

