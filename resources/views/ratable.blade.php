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
            <table id='table-2' class='guest'>
                <thead></thead>
                <tbody><tr><td>Please <a href="{{ url('/login') }}">login</a> to write a review.</td></tr></tbody>
            </table>
            <table id="table-3" class="guest">
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
    @else
        <div id='ratings-data' class="user">
            <table id='table-1' class='user'>
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
        <div id='reviews-data'>
            <table id='table-2' class='user'>
                <thead></thead>
                <tbody>
                    <tr id="tr-review-form">
                        <td id='td-review'>
                            <form class="review-form" role="form" method="POST" action="{{ url('/review') }}">
                                {{ csrf_field() }}
                                
                                <div class="form-group{{ $errors->has('review') ? ' has-error' : '' }}">
                                    <div>
                                        <textarea rows='2' cols='50' maxlength='4000' placeholder="write review..." class="form-control" name="review" value="{{ old('review') }}" required></textarea>
                                        @if ($errors->has('review'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('review') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group{{ $errors->has('headline') ? ' has-error' : '' }}">
                                    <div>
                                        <input maxlength='90' type="text" class="form-control" name="headline" value="{{ old('headline') }}" placeholder="headline...">

                                        @if ($errors->has('headline'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('headline') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>
                                
                                <input type="hidden" name="ratable">
                                <input type="hidden" name="anonymous" value="false">

                                <div class="form-group">
                                    <div>
                                        <button id="review-submit" type="submit" class="btn btn-primary">
                                            Submit
                                        </button>                                        
                                    </div>
                                </div>
                            </form>
                        </td>
                        <td style="width:34px;vertical-align:top;text-align:center;">
                            <i style="padding-left:2px;text-align:center;" class="fa fa-user-secret secret-empty fa-lg" data-toggle="tooltip" data-placement="top" title="review anonymously"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table id="table-3">
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
    @endif
</div>
@endsection

