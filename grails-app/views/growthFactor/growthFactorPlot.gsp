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

<div class="container" style="width: 80%">




    <div class="starter-template">
        <h2>Comparing growth factors for Covid-19 </h2>
    </div>

    <div class="container" style="width: 100%">

        <ul class="nav nav-tabs" role="tablist" style="font-size: 20px">
            <li class="active">
                <a href="#country" role="tab" data-toggle="tab">
                    COVID-19 by country
                </a>
            </li>
            <li><a href="#states" role="tab" data-toggle="tab">
                COVID-19 by US States
            </a>
            </li>

        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
        <div class="tab-pane fade active in coreObject" id="country" >
                <div class="row">
                    <div class="col-sm-8 col-sm-offset-2">
                        <div class="dataChoosingSection">
                            <div class="sectionDescription">
                                Choose data for analysis
                            </div>
                            <div class="row">
                                <div class="col-sm-4 clickOnSectionsWeWant">
                                    <div class='dateChooserContainer'>
                                        <div>
                                            <input type="checkbox" class="custom-control-input displayControl"
                                                   checked onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'includeTopLevelGroups')">
                                            <label class="custom-control-label displayControl">Include data for individual countries</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="custom-control-input displayControl"
                                                   onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'includeSummaryGroups')">
                                            <label class="custom-control-label displayControl">Include data for the world</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-4 clickOnSectionsWeWant">
                                    <div class='text-center dateSliderContainer'>

                                        <label >Date range:</label>
                                        <input type="text" class="amount" style="margin-top: 10px" width="150"/>
                                        <div class="dateSlider" style="margin-top: 10px"></div>


                                    </div>
                                </div>
                                <div class="col-sm-4 displayTheSectionsWeWant holdTheExpandableBlock" >
                                    <div class="everyGroupToDisplayHolder smaller" >
                                        <div class="expander">
                                            <span class = "pull-left describeWhatWeAreExpanding">Countries</span>
                                            <span class = "pull-right expanderText" onclick="mpgSoftware.growthFactorLauncher.toggleDisplayOfSelectableElements(this)">Expand</span>
                                        </div>
                                        <div class="everyGroupToDisplay"></div>
                                    </div>


                                </div>

                            </div>
                        </div>
                     </div>
                    <div class="col-sm-2"></div>
                </div>
                <div class="row">

                    <div class="col-sm-6 col-sm-offset-2" style="height: 190px">
                        <div class="dataChoosingSection">
                            <div class="sectionDescription">
                                Adjust analyses
                            </div>
                            <div class="row">
                                <div class="col-sm-7 clickOnSectionsWeWant">
                                    <div class='dateChooserContainer' >
                                        <div>
                                            <input type="checkbox" class="custom-control-input"
                                                   onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'showGroupsWithoutInflectionPoints')">
                                            <label class="custom-control-label" >Include countries that have NOT reached an inflection point</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="custom-control-input"checked
                                                   onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'showGroupsWithInflectionPoints')">
                                            <label class="custom-control-label">Include countries that have reached an inflection point</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" class="custom-control-input"  checked
                                                   onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'showGroupsWithInsufficientData')">
                                            <label class="custom-control-label">Include countries with insufficient data for analysis</label>
                                        </div>
                                    </div>

                                </div>
                                <div class="col-sm-5 clickOnSectionsWeWant">
                                    <div class='dateChooserContainer' >
                                        <div>
                                            <input type="text" class="spinner movingAverageWindow"/>
                                            <label class="custom-control-label">Days in moving average window</label>
                                        </div>
                                        <div>
                                            <input type="text" class="spinner daysOfNonExponentialGrowthRequired"/>
                                            <label class="custom-control-label">Number of days of declining growth</label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </div>
                    <div class="col-sm-2" style="height: 190px">
                        <div class="dataChoosingSection">
                           <div class="sectionDescription">
                                Adjust display
                            </div>

                            <div class="text-center" >
                                <button type="button" class="btn btn-outline-primary logLinChg align-middle" onclick="mpgSoftware.growthFactorLauncher.logVersusLinear (this)"
                                        style="">Change to log scale</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <span  class="pull-right"><button onclick="mpgSoftware.growthFactorLauncher.buildThePlotWithRememberedData('country')">refresh data</button></span>
                </div>

                <div class="jumbotron" style = "padding: 0">
%{--                    <div class="container">--}%

%{--                        <div class="btn-toolbar">--}%
%{--                            <div class="pull-left"></div>--}%

%{--                            <div class="pull-right">--}%
%{--                                <div class="btn-group">--}%
%{--                                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">--}%
%{--                                        JavaScript--}%
%{--                                        <span class="caret"></span>--}%
%{--                                    </a>--}%
%{--                                    <ul class="dropdown-menu">--}%
%{--                                        <li class="btn"--}%
%{--                                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/growthFactorLauncher.js')">growthFactorLauncher.js</li>--}%
%{--                                        <li class="btn"--}%
%{--                                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/growthFactor.js')">growthFactor.js</li>--}%
%{--                                    </ul>--}%
%{--                                </div>--}%

%{--                                <div class="btn-group">--}%
%{--                                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">--}%
%{--                                        Stylesheets--}%
%{--                                        <span class="caret"></span>--}%
%{--                                    </a>--}%
%{--                                    <ul class="dropdown-menu">--}%
%{--                                        <li class="btn"--}%
%{--                                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'css/baget/growthFactor.css')">growthFactor.css</li>--}%
%{--                                    </ul>--}%
%{--                                </div>--}%
%{--                            </div>--}%



%{--                        </div>--}%

%{--                    </div>--}%



                    <div class="row">

                        <div class="col-md-2">


                        </div>

                        <div class="col-md-8">

                            <div id="growthFactorPlotCountries"></div>

                            <div class="col-md-2"></div>

                        </div>

                    </div>
                </div>
            </div>
            <div class="tab-pane fade coreObject" id="states" style="text-align: left">

%{--                <div class="tab-pane fade active in" id="country">--}%
                    <div class="row">
                        <div class="col-sm-12 dataChoosingSection">
                            <div class="sectionDescription">
                                Data we will analyze
                            </div>
                            <div class="row">
                                <div class="col-sm-6 clickOnSectionsWeWant">
                                    <div>
                                        <input type="checkbox" class="custom-control-input displayControl" checked
                                               onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'includeTopLevelGroups')">
                                        <label class="custom-control-label">Include data for individual countries</label>
                                    </div>
%{--                                    <div>--}%
%{--                                        <input type="checkbox" class="custom-control-input" id="includeCombinations"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">--}%
%{--                                        <label class="custom-control-label" for="includeCombinations">Include county combinations</label>--}%
%{--                                    </div>--}%
%{--                                    <div>--}%
%{--                                        <input type="checkbox" class="custom-control-input" id="includeCategories"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">--}%
%{--                                        <label class="custom-control-label" for="includeCategories">Include other categories of data</label>--}%
%{--                                    </div>--}%
%{--                                    <div>--}%
%{--                                        <input type="checkbox" class="custom-control-input" id="includeNewAdditions"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">--}%
%{--                                        <label class="custom-control-label" for="includeNewAdditions">Include countries that we have been tracking for less than 10 days</label>--}%
%{--                                    </div>--}%
                                    <div>
                                        <p>
                                            <label for="stateAmount">Date range:</label>
                                            <input type="text" id="stateAmount" class="amount" style="border: 0; color: #f6931f; font-weight: bold;" size="100"/>
                                        </p>

                                        <div class="dateSlider"></div>
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
                                <div class="col-sm-4 clickOnSectionsWeWant">
                                    <div>
                                        <input type="checkbox" class="custom-control-input"
                                               onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'showGroupsWithoutInflectionPoints')">
                                        <label class="custom-control-label">Include states that have NOT reached an inflection point</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" class="custom-control-input"  checked
                                               onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'showGroupsWithInflectionPoints')">
                                        <label class="custom-control-label">Include states that have reached an inflection point</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" class="custom-control-input"  checked
                                               onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this,'showGroupsWithInsufficientData')">
                                        <label class="custom-control-label">Include states with insufficient data for analysis</label>
                                    </div>
                                </div>
                                <div class="col-sm-4 clickOnSectionsWeWant">
                                    <div>
                                        <input type="text" class="spinner movingAverageWindow"/>
                                        <label class="custom-control-label" >Moving average window</label>
                                    </div>
                                    <div>
                                        <input type="text" class="spinner daysOfNonExponentialGrowthRequired"/>
                                        <label class="custom-control-label">days of declining growth required</label>
                                    </div>

                                </div>
                                <div class="col-sm-4 displayTheSectionsWeWant">
                                    <div class="pull-right">
                                        <input type="checkbox" class="custom-control-input" id="logVersusLinearStates" checked onclick="mpgSoftware.growthFactorLauncher.logVersusLinear (this)">
                                        <label class="custom-control-label" for="logVersusLinearStates">Linear scale</label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="row">
                        <span  class="pull-right"><button onclick="mpgSoftware.growthFactorLauncher.buildThePlotWithRememberedData('country')">refresh data</button></span>
                    </div>

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

                                <div id="growthFactorPlotStates"></div>

                                <div class="col-md-2"></div>

                            </div>

                        </div>
                    </div>




%{--                </div>--}%

        </div>
    </div>




</div>




<script>
    $( window ).ready(function() {

        // you might also consider https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

            mpgSoftware.growthFactorLauncher.prepareDisplay("https://covidtracking.com/api/v1/states/daily.csv",
            function(d) {
                const dateString  = d["date"];
                const currentDay = +dateString.substring (6, 8);
                const currentMonth = +dateString.substring (4, 6);
                const currentYear = +dateString.substring (0, 4);
                const currentDate = new Date (currentYear,currentMonth,currentDay);

                return {countryName: d["state"],
                    code: d["state"],
                    date: ""+months[currentDate.getMonth()-1]+" "+currentDate.getDate()+ ", "+currentDate.getFullYear(),
                    y:+d["death"]};
            },
                "states",
                "growthFactorPlotStates",
            window);




        %{--mpgSoftware.growthFactorLauncher.prepareDisplay("${createLink(controller: 'growthFactor', action:'infectionDataPerCountry')}",--}%
        %{--    function(d) {--}%


        %{--        return {countryName: d["Entity"],--}%
        %{--            code: d["Code"],--}%
        %{--            date: d["Date"],--}%
        %{--            // y:+d["Total confirmed deaths (deaths)"],--}%
        %{--            y:+d[" (deaths)"],--}%
        %{--            x:+d["Days since the 5th total confirmed death"]};--}%

        %{--    },--}%
        %{--    "country",--}%
        %{--    "growthFactorPlotCountries",--}%
        %{--    window);--}%
        mpgSoftware.growthFactorLauncher.prepareDisplay("https://covid.ourworldindata.org/data/owid-covid-data.csv",
            function(d) {
                const dateString  = d["date"];
                const currentDay = +dateString.substring (8, 10);
                const currentMonth = +dateString.substring (5, 7);
                const currentYear = +dateString.substring (0, 4);
                const currentDate = new Date (currentYear,currentMonth,currentDay);


                return {countryName: d["location"],
                    //code: d["iso_code"],
                    code: d["location"],
                    date: ""+months[currentDate.getMonth()-1]+" "+currentDate.getDate()+ ", "+currentDate.getFullYear(),
                    // y:+d["Total confirmed deaths (deaths)"],
                    y:+d["total_deaths"]};

            },
            "country",
            "growthFactorPlotCountries",
            window);





        %{--mpgSoftware.growthFactorLauncher.prepareDisplay("${createLink(controller: 'growthFactor', action:'infectionDataPerCountry')}",--}%
        %{--    "${createLink(controller: 'growthFactor', action:'infectionDataPerState')}",--}%
        %{--    window);--}%
    });
</script>

</body>
</html>
