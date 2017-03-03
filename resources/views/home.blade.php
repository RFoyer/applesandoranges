@extends('layouts.app')

@section('content')
<div class="panel-body">
                @if (Auth::guest())
                <table id='table-1' class='guest'>
                    <thead></thead>
                    <tbody id='things-to-rate-body'></tbody>
                </table>
                <br>
                @else
                <table id='table-1' class='user'>
                    <thead></thead>
                    <tbody id='things-to-rate-body'></tbody>
                </table>
                <br>
                @endif
            </div>
@endsection
