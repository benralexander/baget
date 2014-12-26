<!DOCTYPE html>
<html>
<head>

    <title>Baget</title>
    <r:require modules="tooltip"/>
    <r:require modules="core"/>
    <g:layoutTitle/>
    <r:layoutResources/>

    <meta charset="utf-8">
    <title>QQ plot</title>
    <link rel="stylesheet" type="text/css" href="../css/styles.css"/>
    %{--<script type="text/javascript" src="../js/d3.js"></script>--}%
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="ba">
    <link rel="icon" href="../../baget.ico">

    <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700,900,300italic,400italic,700italic,900italic'
          rel='stylesheet' type='text/css'>

    <g:layoutHead/>

    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-53398031-1', 'auto');
        ga('send', 'pageview');

    </script>

</head>

<body>

<r:layoutResources/>
<div id="spinner" class="spinner" style="display:none;">
</div>

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>

            </button>
            <a class="navbar-brand" href="<g:createLink controller='baget' action ='projectDescription'/>">BAGET project</a>
        </div>
        <div class="collapse navbar-collapse navigationControls">
            <ul class="nav navbar-nav">
                <li class="active"><a href="<g:createLink controller='qqPlot' action ='index'/>">QQ Plot</a></li>
            </ul>
            <ul class="nav navbar-nav">
                <li class="active"><a href="<g:createLink controller='barChart' action ='index'/>">Bar Chart</a></li>
            </ul>
        </div>
    </div>
</div>

<g:layoutBody/>

<div id="footer">
    <div class="container">
        <div class="separator"></div>
    </div>
</div>

<div id="belowfooter"></div>

</body>
</html>