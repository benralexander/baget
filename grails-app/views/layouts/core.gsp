<%@ page import="temporary.BuildInfo" %>
<!DOCTYPE html>
<html>
<head>

    <title>Baget</title>
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
    <meta name="wot-verification" content="44f810adf1432de3ec6b"/>
</head>

<body>
<script>
    $(document).ready(function(){
        $('.dropdown-toggle').selectmenu()
    });
</script>
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

                <li class="active"><a href="<g:createLink controller='barChart' action ='index'/>">Bar Chart</a></li>

                <li class="active"><a href="<g:createLink controller='boxWhisker' action ='index'/>">Box Whisker</a></li>

                <li class="active"><a href="<g:createLink controller='man' action ='manhattanPlot'/>">Manhattan Plot</a></li>

                <li class="active"><a href="<g:createLink controller='crossMap' action ='crossTrait'/>">Cross Map</a></li>

                <li class="active"><a href="<g:createLink controller='funcData' action ='functionalData'/>">Functional data</a></li>

                <li class="active"><a href="<g:createLink controller='funcGenData' action ='functionalGenData'/>">Multi-track data</a></li>

                <li class="active"><a href="<g:createLink controller='dynaLine' action ='dynaLine'/>">Dynamic line plot</a></li>

                <li class="active"><a href="<g:createLink controller='growthFactor' action ='growthFactorPlot'/>">Growth factor</a></li>

                <li class="dropdown navbar-right" style="margin-left:200px">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">More examples<span class="caret"></span></a>
                    <ul class="pull-right dropdown-menu" role="menu">
                        <li><a href="http://graphicscow.com/">test code</a></li>
                        <li><a href="http://bovinecontemplation.org">bovine contemplation</a></li>
                    </ul>
                </li>
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

<div id="belowfooter">
    Built on ${BuildInfo?.buildHost} at ${BuildInfo?.buildTime}.  Version=${BuildInfo?.appVersion}.${BuildInfo?.buildNumber}
</div>
</body>
</html>