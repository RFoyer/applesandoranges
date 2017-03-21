@extends('layouts.app')

@section('content')
<div class="panel-body">
    <table id="contributors-data">
        <caption>TOP CONTRIBUTORS</caption>
        <thead>
            <tr>
                <th>Name</th>
                <th>Ratings</th>
                <th>Reviews</th>
                <th>Ratables Proposed</th>
                <th>Ratables Approved</th>                
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>
@endsection
