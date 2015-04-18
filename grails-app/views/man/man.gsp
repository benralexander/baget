<%--
  Created by IntelliJ IDEA.
  User: ben
  Date: 3/30/2015
  Time: 3:42 PM
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,manhattan"/>
    <r:layoutResources/>
    <style>
text.y {
    font-size: 12pt;
}
text.x {
    font-size: 12pt;
}
    </style>
</head>
<body>

%{--<g:javascript src="bootstrap.min.js" />--}%
<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">(incomplete) Manhattan Plot</h1>

    </div>

</div>
<style>

.chart rect {
    fill: steelblue;
}

.chart text {
    fill: white;
    font: 10px sans-serif;
    text-anchor: middle;
}

</style>


<div class="jumbotron">
    <div class="container">

        <div class="btn-toolbar">
            <div class="pull-left"></div>

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

        <div class="col-md-8"><div id="manhattanPlot1"></div>
            <div id="chart"></div>
            %{--<svg class="chart"></svg>--}%

            <div class="col-md-2"></div>

        </div>

    </div>
</div>
<script>
    var widthAdjuster = function ()  {
        var returnValue;
        var browserWidth =   $(window).width();
        returnValue = (browserWidth > 200) ?  browserWidth : 200;
        returnValue = (returnValue < 1000) ?  returnValue : 1000;
        return   returnValue;
    }
    var heightAdjuster = function ()  {
        var returnValue;
        var browserHeight =   $(window).height()-3200;
        returnValue = (browserHeight > 300) ?  browserHeight : 350;
        returnValue = (returnValue < 1000) ?  returnValue : 1000;
        return   returnValue;
    }


    var margin = {top: 30, right: 20, bottom: 50, left: 70},
            width = 800 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom,
            sliderOnScreenTop = 10,
            sliderOnScreenBottom = 200;


    var qqPlot;

    var width = 960,
            height = 500;

    var chart = d3.select("#manhattanPlot1")
            .attr("width", width)
            .attr("height", height);


    var addMoreData = function (d3Object) {

         d3.json("${createLink(controller: 'man', action:'manData1')}", function (error, data) {

             d3Object.dataAppender("#manhattanPlot1",data)
                     .dotRadius(3);

             d3.select("#manhattanPlot1").call(d3Object.render);

         });
    };





    d3.json("${createLink(controller: 'man', action:'manData')}", function (error, data) {

        var manhattan = baget.manhattan()
                .width(width)
                .height(height)
                .dataHanger("#manhattanPlot1",data)
                .overrideYMinimum (0)
                .overrideYMaximum (10)
                .dotRadius(3)
                .blockColoringThreshold(0.3);

        d3.select("#manhattanPlot1").call(manhattan.render);

        addMoreData (manhattan) ;


    });

        function type(d) {
            d.value = +d.value; // coerce to number
            return d;
        }



    d3.select(window).on('resize', resize);

    function resize() {
        width = widthAdjuster()- margin.left - margin.right;
        height = heightAdjuster() - margin.top - margin.bottom;
        var extractedData  = d3.selectAll('#groupHolder').selectAll('g.allGroups').data();
        var dataRange = UTILS.extractDataRange(extractedData);
        d3.select("#scatterPlot1").selectAll('svg').remove();
        qqPlot.width(width)
                .height(height)
                .dataHanger ("#scatterPlot1", extractedData);
        d3.select("#scatterPlot1").call(qqPlot.render);
    }











</script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
%{--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>--}%
<!-- Include all compiled plugins (below), or include individual files as needed -->
%{--<script src="../../../web-app/js/baget/bootstrap.min.js"></script>--}%
</body>
</html>