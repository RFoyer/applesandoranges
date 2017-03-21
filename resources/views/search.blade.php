@extends('layouts.app')

@section('content')

<div class="panel-body">
    
    Top Search Results:<br>
    @if (Auth::guest())
        <table id='table-1' class='guest'>
            <thead id="{{ $searchTerm }}">
                 
            </thead>
            <tbody id='table-1-body'>
                   
            </tbody>
        </table>
        <br>
    @else
        <table id='table-1' class='user'>
            <thead id="{{ $searchTerm }}">
                        
            </thead>
            <tbody id='table-1-body'>
                      
            </tbody>
        </table>
        <br>
    @endif
</div>
@endsection

