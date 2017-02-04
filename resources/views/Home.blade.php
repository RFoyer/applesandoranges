@extends('layouts.app')

@section('content')
<div class="panel-body">
                @if (Auth::guest())
                <br>
                <table class='guest'>
                    <thead>
                        <tr>
                            <th colspan="3">Highest Rated:</th>
                        </tr>
                    </thead>
                    <tbody id='highest-rated-body'>
                        
                    </tbody>
                </table>
                <br>
                @else
                <table class='user'>
                    <thead>
                        <tr>
                            <th colspan="3">Things to rate:</th>
                        </tr>
                    </thead>
                    <tbody id='things-to-rate-body'>
                        
                    </tbody>
                </table>
                <br>
                <table class='user'>
                    <thead>
                        <tr>
                            <th colspan="3">Highest Rated:</th>
                        </tr>
                    </thead>
                    <tbody id='highest-rated-body'>
                        
                    </tbody>
                </table>                                    
                @endif
            </div>
@endsection
