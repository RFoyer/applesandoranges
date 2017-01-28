@extends('layouts.app')

@section('content')
<div class="panel-body">
                @if (Auth::guest())
                <br>
                <table class='highest-rated guest'>
                    <thead>
                        <tr>
                            <th colspan="3">Highest Rated:</th>
                        </tr>
                    </thead>
                    <tbody class='highest-rated-body guest'>
                        
                    </tbody>
                </table>
                <br>
                @else
                <br>
                <table class='things-to-rate user'>
                    <thead>
                        <tr>
                            <th colspan="3">Things to rate:</th>
                        </tr>
                    </thead>
                    <tbody class='things-to-rate-body user'>
                        
                    </tbody>
                </table>
                <br>
                <table class='highest-rated user'>
                    <thead>
                        <tr>
                            <th colspan="3">Highest Rated:</th>
                        </tr>
                    </thead>
                    <tbody class='highest-rated-body'>
                        
                    </tbody>
                </table>                                    
                @endif
            </div>
@endsection
