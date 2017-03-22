<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="/css/app.css" rel="stylesheet">
    <link rel='stylesheet' href="/css/font-awesome.min.css">
    <link rel='stylesheet' href='/css/applesandoranges-1.0.css'>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    
    
    <!-- Scripts -->    
    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>
    </script>
</head>
<body id='body'>
    <div id="app">
        <div class="ad-space">Ad Space</div>
        <div id='div-mid'>   
        <nav id="nav" class="navbar navbar-default">
            <div id="nav-container" class="container">
                <div class="navbar-header">

                    <!-- Collapsed Hamburger -->
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                        <span class="sr-only">Toggle Navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>

                    <!-- Branding Image -->
                    <div id="logo-div">
                        <a id='logo' class="navbar-brand" href="{{ url('/') }}">
                            <span id='apples'>Apples</span> <span id='and'>-and-</span> <span id='oranges'>Oranges</span>
                        </a>
                    </div>
                </div>

                <div class="collapse navbar-collapse" id="app-navbar-collapse">
                    <!-- Left Side Of Navbar -->
                    <ul class="nav navbar-nav">
                        <div id="div-form-search">
                            <form novalidate>
                                <div class="input-group">
                                    <input type="text" id="search-box" class="form-control" placeholder="Search ratables..." name="q" autocomplete="off">
                                    <span class="input-group-btn">
                                        <button id="btn-search" type="submit" formmethod="get" class="btn btn-default" formaction="/search">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </ul>
                    <ul class="nav navbar-nav">
                        <li class="dropdown">
                            <a href="#" style="color:white;" class="dropdown-toggle nav-a" data-toggle="dropdown" role="button" aria-expanded="false">
                                Contributors <span class="caret"></span>
                            </a>
                            <ul class="dropdown-menu" role="menu" style="background-color:white;">
                                <li>
                                    <a class="nav-a" style="color:#32a232;" href="{{ url('/proposed') }}">Proposed Ratables</a>
                                </li>
                                <li>
                                    <a class="nav-a" style="color:#32a232;" href="{{ url('/ratable/create') }}">Request New Ratable</a>
                                </li>
                                <li>
                                    <a class="nav-a" style="color:#32a232;" href="{{ url('/contributors') }}">Top Contributors</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    
                    <!-- Right Side Of Navbar -->
                    <ul class="nav navbar-nav navbar-right">
                        <!-- Authentication Links -->
                        @if (Auth::guest())
                            <li><a class="nav-a" style="color:white;" href="{{ url('/login') }}">Login</a></li>
                            <li><a class="nav-a" style="color:white;" href="{{ url('/register') }}">Register</a></li>
                        @else
                            <li class="dropdown">
                                <a href="#" style="color:white;" class="dropdown-toggle nav-a" data-toggle="dropdown" role="button" aria-expanded="false">
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <ul id="ul-logout" class="dropdown-menu" role="menu" style="background-color:white;">
                                    <li>
                                        <a class="nav-a" style="color:#32a232;" href="{{ url('/logout') }}"
                                            onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">Logout</a>

                                        <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
                                            {{ csrf_field() }}
                                        </form>
                                    </li>
                                </ul>
                            </li>
                        @endif
                    </ul>
                </div>
            </div>
        </nav>
        <div id="main-body-container" class="container panel panel-default">
            <div>
                @yield('content')
            </div>
            <div id="footer">
            Apples and Oranges - &copy; 2017 Raymond Foyer
            </div>
        </div>
        
        </div>
        <div class="ad-space">Ad Space</div>
</div>

    <!-- Scripts -->
    <script src="/js/app.js"></script>
    <script src='/js/applesandoranges-1.0.js'></script>
    <script src="/custom-jquery-ui/jquery-ui.min.js"></script>    
  
</body>
</html>
