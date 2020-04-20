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
        <h2>Comparing growth factors for Covid-19 </h2>
    </div>
    <div class="row">
        <div class="col-sm-12 dataChoosingSection">
            <div class="sectionDescription">
               Data we will analyze
            </div>
            <div class="row">
                <div class="col-sm-6 clickOnSectionsWeWant">
                    <div>
                        <input type="checkbox" class="custom-control-input" id="includeCountries"  checked onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                        <label class="custom-control-label" for="includeCountries">Include data for individual countries</label>
                    </div>
                    <div>
                        <input type="checkbox" class="custom-control-input" id="includeCombinations"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                        <label class="custom-control-label" for="includeCombinations">Include county combinations</label>
                    </div>
                    <div>
                        <input type="checkbox" class="custom-control-input" id="includeCategories"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                        <label class="custom-control-label" for="includeCategories">Include other categories of data</label>
                    </div>
                    <div>
                        <input type="checkbox" class="custom-control-input" id="includeNewAdditions"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                        <label class="custom-control-label" for="includeNewAdditions">Include countries that we have been tracking for less than 10 days</label>
                    </div>
                    <div>
                        <p>
                            <label for="amount">Date range:</label>
                            <input type="text" id="amount" style="border: 0; color: #f6931f; font-weight: bold;" size="100"/>
                        </p>

                        <div id="dateSlider"></div>
                    </div>
                </div>
                <div class="col-sm-6 displayTheSectionsWeWant">
                    <div>
                        <span  class="pull-right"><div class="everyGroupToDisplay"></div></span>
                    </div>
                </div>
            </div>


        </div>
        <div class="col-sm-12  dataChoosingSection">
            <div class="sectionDescription">
                Analyses to present
            </div>
            <div class="row">
                <div class="col-sm-6 clickOnSectionsWeWant">
                    <div>
                        <input type="checkbox" class="custom-control-input" id="includeNotInflected"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                        <label class="custom-control-label" for="includeNotInflected">Include groups that have NOT reached an inflection point</label>
                    </div>
                    <div>
                        <input type="checkbox" class="custom-control-input" id="includeInflected" checked onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                        <label class="custom-control-label" for="includeInflected">Include groups that have reached an inflection point</label>
                    </div>
                </div>
                <div class="col-sm-6 displayTheSectionsWeWant">
                    <div class="pull-right">
                        <input type="checkbox" class="custom-control-input" id="logVersusLinear" checked onclick="mpgSoftware.growthFactorLauncher.logVersusLinear (this)">
                        <label class="custom-control-label" for="logVersusLinear">Linear scale</label>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="row">
        <span  class="pull-right"><button onclick="mpgSoftware.growthFactorLauncher.buildThePlotWithRememberedData()">refresh data</button></span>
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
    $( window ).ready(function() {
        mpgSoftware.growthFactorLauncher.prepareDisplay("${createLink(controller: 'growthFactor', action:'infectionDataPerCountry')}",
            "${createLink(controller: 'growthFactor', action:'infectionDataPerState')}",
            window);
    });
</script>

</body>
</html>
