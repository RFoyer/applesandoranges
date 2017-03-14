@extends('layouts.app')

@section('content')
<div class="panel-body">
    @if (Auth::guest())
        <div id='ratings-data' class="guest">
            <table id='table-1' class='guest'>
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
        <div id='reviews-data'>

        </div>
    @else
        <div id='ratings-data' class="user">
            <table id='table-1' class='user'>
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
        <div id='reviews-data'>

        </div>
    @endif
</div>
@endsection

