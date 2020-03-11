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
    <r:require modules="core,dynaline"/>
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
        <h1 style="font-weight: bold">Dynamic line Plot</h1>
    </div>

    <div class="starter-template">
        <h2>Plot made with dynaline.js</h2>
    </div>

    <div>
        <label for="geneName">Gene:</label>
        <input type="text" id="geneName" name="geneName">
    </div>
    <div>
        <label for="priorAllelicVariance">prior allelic variance:</label>
        <input type="text" id="priorAllelicVariance" name="priorAllelicVariance">
        <span  class="pull-right"><button onclick="drawPic()">Launch</button></span>
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
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/dynaLineLauncher.js')">dynaLineLauncher.js</li>
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/dynamicLine.js')">dynamicLine.js</li>
                    </ul>
                </div>

                <div class="btn-group">
                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                        Stylesheets
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'css/baget/dynaLine.css')">dynaLine.css</li>
                    </ul>
                </div>
            </div>



        </div>

    </div>



    <div class="row">

        <div class="col-md-2">


        </div>

        <div class="col-md-8">

            <div id="dynamicLine"></div>

            %{--<svg class="chart"></svg>--}%

            <div class="col-md-2"></div>

        </div>

    </div>
</div>
<script>
    function drawPic(){
        const geneName = $('#geneName').val() || 'SLC30A8';
        const stringPriorAllelicVarianceVar  = $('#priorAllelicVariance').val() || '0.14';
        const priorAllelicVarianceVar  = parseFloat(stringPriorAllelicVarianceVar);
        mpgSoftware.dynaLineLauncher.prepareDisplay("${createLink(controller: 'dynaLine', action:'bestGeneBurdenResultsForGene')}",
            geneName,
            priorAllelicVarianceVar,
            window);
    }
</script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
%{--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>--}%
<!-- Include all compiled plugins (below), or include individual files as needed -->
%{--<script src="../../../web-app/js/baget/bootstrap.min.js"></script>--}%
</body>
