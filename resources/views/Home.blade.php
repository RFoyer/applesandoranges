@extends('layouts.app')

@section('content')
<div class="panel-body">
                @if ($viewData['guest'])
                Highest Rated:<br>
                    <a href='#'>Green Bay Packers</a> - 5.0 stars<br>
                    <a href='#'>Netflix</a> - 4.4 stars<br>
                    <a href='#'>New England Patriots</a> - 1.2 stars<br>
                @else
                <br>
                <table>
                    <thead>
                        <tr>
                            <th colspan="3">Things you might want to rate:</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($model['ranking'] as $item)
                        <tr>
                            <td>{{ $item['name'] }} - </td>
                            <td>{{ $item['rating'] }} stars - </td>
                            <td>Your Rating: <span class='star-rate'></span></td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                <br>
                <table>
                    <thead>
                        <tr>
                            <th colspan="3">Highest Rated:</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($model['ranking'] as $item)
                        <tr>
                            <td>{{ $item['name'] }} - </td>
                            <td>{{ $item['rating'] }} stars - </td>
                            <td>Your Rating: none</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>                                    
                @endif
            </div>
@endsection
