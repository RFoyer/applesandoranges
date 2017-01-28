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
                    <tbody>
                        @foreach($model['ranking'] as $item)
                        <tr>
                            <td>{{ $item['name'] }} </td>
                            <td>{{ $item['rating'] }} </td>
                            <td><span class='star-rate'></span> (4.9/5 - 25 Ratings)</td>
                        </tr>
                        @endforeach
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
                    <tbody>
                        @foreach($model['ranking'] as $item)
                        <tr>
                            <td>Ratable -</td>
                            <td><span class='star-rate'></span></td>
                            <td>(no./5 no. ratings)</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                <br>
                <table class='highest-rated user'>
                    <thead>
                        <tr>
                            <th colspan="3">Highest Rated:</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($model['ranking'] as $item)
                        <tr>
                            <td>{{ $item['name'] }} - </td>
                            <td><span class='star-rate'></span></td>
                            <td> (NA/5 - NA ratings)</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>                                    
                @endif
            </div>
@endsection
