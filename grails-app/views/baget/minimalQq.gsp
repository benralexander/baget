<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core"/>
    <r:layoutResources/>

    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>

<link media="all" rel="stylesheet" href="../css/baget/baget.css">
<link media="all" rel="stylesheet" href="../css/baget/bootstrap.min.css">
<link media="all" rel="stylesheet" href="../css/baget/ie-emulation-modes-warning.js">
<link media="all" rel="stylesheet" href="../css/baget/ie10-viewport-bug-workaround.js">
<script src="../js/d3.js"></script>
<script src="../js/baget/sharedMethods.js"></script>
<script src="../js/baget/qqplot.js"></script>
<script src="../js/baget/d3tooltip.js"></script>
<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-53398031-1', 'auto');
    ga('send', 'pageview');

</script>
<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">Minimal QQ Plot</h1>

    </div>

</div><!-- /.container -->


<div class="jumbotron">
    <div class="container">

        <div class="btn-toolbar">
            <div class="pull-left"><a
                    href="<g:createLink controller='baget' action='index'/>">Fully featured example</a></div>

            <div class="pull-right">
                <div class="btn-group">
                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                        JavaScript
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="btn"
                            onclick="openTheWindow('<g:createLink controller='baget' action ='index'/>', 'js/baget/sharedMethods.js')">sharedMethods.js</li>
                        <li class="btn"
                            onclick="openTheWindow('<g:createLink controller='baget' action ='index'/>', 'js/baget/qqplot.js')">qqplot.js</li>
                    </ul>
                </div>

                <div class="btn-group">
                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                        Stylesheets
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="btn"
                            onclick="openTheWindow('<g:createLink controller='baget' action ='index'/>', 'css/baget/baget.css')">baget.css</li>
                    </ul>
                </div>
            </div>
        </div>

    </div>



<div class="row">

    <div class="col-md-2"></div>

    <div class="col-md-8"><div id="scatterPlot1"></div>

        <div class="col-md-2"></div>

    </div>

</div>
</div>
    <script>

        var margin = {top: 30, right: 20, bottom: 50, left: 70},
                width = 700 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom,
                sliderOnScreenTop = 10,
                sliderOnScreenBottom = 200;


        var qqPlot;

        d3.json("../baget/qqPlotData", function (error, json) {


            var dataRange = UTILS.extractDataRange(json);


            qqPlot = baget.qqPlot()
                    .selectionIdentifier("#scatterPlot1")
                    .width(width)
                    .height(height)
                    .margin(margin)
                    .displayIdentityLine(false)
                    .significanceLineValue(dataRange.median)
                    .assignData(json);
            qqPlot.render();


        });




    </script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="../js/baget/bootstrap.min.js"></script>
</body>
</html>