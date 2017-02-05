@extends('layouts.app')

@section('content')
<div class="panel-body">
                @if (Auth::guest())
                <br>
                <table id='table-1' class='guest'>
                    <thead>
                        <tr>
                            <th colspan="3">Things to Rate:</th>
                        </tr>
                    </thead>
                    <tbody id='things-to-rate-body'>
                        
                    </tbody>
                </table>
                <br>
                @else
                <table id='table-1' class='user'>
                    <thead>
                        <tr>
                            <th colspan="3">Things to rate:</th>
                        </tr>
                    </thead>
                    <tbody id='things-to-rate-body'>
                        
                    </tbody>
                </table>
                <br>
                @endif
            </div>
@endsection
