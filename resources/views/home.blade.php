@extends('layouts.app')

@section('content')
<div class="panel-body">
                @if (Auth::guest())
                Things to Rate:<br>
                <table id='table-1' class='guest'>
                    <thead>
                        
                    </thead>
                    <tbody id='things-to-rate-body'>
                        
                    </tbody>
                </table>
                <br>
                @else
                Things to Rate:<br>
                <table id='table-1' class='user btn-star a-tooltip'>
                    <thead>
                        
                    </thead>
                    <tbody id='things-to-rate-body'>
                        
                    </tbody>
                </table>
                <br>
                @endif
            </div>
@endsection
