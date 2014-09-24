<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core"/>
    <r:layoutResources/>
</head>
<body>

<g:javascript src="bootstrap.min.js" />
<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">Minimal QQ Plot</h1>

    </div>

</div>


<div class="jumbotron">
    <div class="container">

        <div class="btn-toolbar">
            <div class="pull-left"><a
                    href="<g:createLink controller='qqPlot' action='fullQqplot'/>">Fully featured example</a></div>

            <div class="pull-right">
                <div class="btn-group">
                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                        JavaScript
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/sharedMethods.js')">sharedMethods.js</li>
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/qqplot.js')">qqplot.js</li>
                    </ul>
                </div>

                <div class="btn-group">
                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                        Stylesheets
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'css/baget/baget.css')">baget.css</li>
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

        d3.json("../qqPlot/qqPlotData", function (error, json) {


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
%{--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>--}%
<!-- Include all compiled plugins (below), or include individual files as needed -->
%{--<script src="../../../web-app/js/baget/bootstrap.min.js"></script>--}%
</body>
</html>