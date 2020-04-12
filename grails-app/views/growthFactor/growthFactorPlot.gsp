<%--
  Created by IntelliJ IDEA.
  User: ben
  Date: 3/30/2020
  Time: 2:27 PM
--%>
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,growthFactor"/>
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

<h2>Comparing growth factors for Covid-19 across countries</h2>

<div class="container">

%{--    <div class="starter-template">--}%
%{--        <h1 style="font-weight: bold">Comparing growth factors for Covid-19 across countries</h1>--}%
%{--    </div>--}%

    <div class="starter-template">
        <h2>Comparing growth factors for Covid-19 across countries</h2>
    </div>
    <div>
        <input type="checkbox" class="custom-control-input" id="includeNewAdditions"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
        <label class="custom-control-label" for="includeNotInflected">Include countries that we have been tracking for less than 10 days</label>
    </div>

    <div>
        <input type="checkbox" class="custom-control-input" id="includeNotInflected"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
        <label class="custom-control-label" for="includeNotInflected">Include countries that have NOT reached an inflection point</label>
    </div>
    <div>
        <input type="checkbox" class="custom-control-input" id="includeInflected" checked onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
        <label class="custom-control-label" for="includeInflected">Include countries that have reached an inflection point</label>
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
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/growthFactorLauncher.js')">growthFactorLauncher.js</li>
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/growthFactor.js')">growthFactor.js</li>
                    </ul>
                </div>

                <div class="btn-group">
                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                        Stylesheets
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'css/baget/growthFactor.css')">growthFactor.css</li>
                    </ul>
                </div>
            </div>



        </div>

    </div>



    <div class="row">

        <div class="col-md-2">


        </div>

        <div class="col-md-8">

            <div id="growthFactorPlot"></div>

            %{--<svg class="chart"></svg>--}%

            <div class="col-md-2"></div>

        </div>

    </div>
</div>
<script>
    function drawPic(){
        const geneName = $('#geneName').val() || 'SLC30A8';
        const stringPriorAllelicVarianceVar  = $('#priorAllelicVariance').val() || '0.14';
        mpgSoftware.growthFactorLauncher.prepareDisplay("${createLink(controller: 'growthFactor', action:'infectionDataPerCountry')}",
            window);
    }
</script>
$( window ).ready(function() {
drawPic();
});
</body>
</html>
