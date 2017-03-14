@extends('layouts.app')

@if(Auth::guest())
@section('content')
<div style="padding: 15px;">Please <a href='{{ url('/login') }}'>login</a> to propose new ratables!</div>
@endsection

@elseif ($newRatable !== 'create')
@section('content')
    <div style="padding: 15px;">
        <p>Submission successful! <i class="fa fa-check" style="color: green;"></i></p>
        <p>Remember that your proposal must be approved before it becomes permanent.</p>
        <p>You may now rate <a href='{{ url('/'.$newRatable) }}'>{{ $newRatable }}</a> on Apples and Oranges!</p>
    </div>
@endsection

@else
@section('content')
<div id="content-container" class="container" style="padding-top: 15px;">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Propose New Ratable</div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" method="POST" action="{{ url('/ratable/create/success') }}">
                        {{ csrf_field() }}

                        <div class="form-group{{ $errors->has('name') ? ' has-error' : '' }}">
                            <label for="name" class="col-md-4 control-label">Name of new ratable</label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control" name="name" value="{{ old('name') }}" required autofocus>

                                @if ($errors->has('name'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('name') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('location') ? ' has-error' : '' }}">
                            <label for="location" class="col-md-4 control-label">Location (if applicable)</label>

                            <div class="col-md-6">
                                <input id="location" type="text" class="form-control" name="location" value="{{ old('location') }}" placeholder="city, state/province, country">

                                @if ($errors->has('location'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('location') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('desc') ? ' has-error' : '' }}">
                            <label for="desc" class="col-md-4 control-label">Description</label>

                            <div class="col-md-6">
                                <textarea id="desc" class="form-control" name="desc" required></textarea>

                                @if ($errors->has('desc'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('desc') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <button type="submit" class="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@endif