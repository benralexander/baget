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

<div class="container" style="width: 100%">




    <div class="starter-template">
        <h2>Comparing growth factors for Covid-19 </h2>
    </div>

    <div class="container" style="width: 100%">

        <ul class="nav nav-tabs" role="tablist">
            <li class="active">
                <a href="#country" role="tab" data-toggle="tab">
                    <icon class="fa fa-country"></icon>COVID-19 by country
                </a>
            </li>
            <li><a href="#states" role="tab" data-toggle="tab">
                <i class="fa fa-user"></i>COVID-19 by US States
            </a>
            </li>

        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <div class="tab-pane fade active in" id="country">
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
                                    <input type="checkbox" class="custom-control-input" id="includeNotInflectedCountries"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                                    <label class="custom-control-label" for="includeNotInflectedCountries">Include states that have NOT reached an inflection point</label>
                                </div>
                                <div>
                                    <input type="checkbox" class="custom-control-input" id="includeInflectedCountries" checked onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                                    <label class="custom-control-label" for="includeInflectedCountries">Include groups that have reached an inflection point</label>
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

                            <div id="growthFactorPlotCountries"></div>

                            <div class="col-md-2"></div>

                        </div>

                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="states">

%{--                <div class="tab-pane fade active in" id="country">--}%
                    <div class="row">
                        <div class="col-sm-12 dataChoosingSection">
                            <div class="sectionDescription">
                                Data we will analyze
                            </div>
                            <div class="row">
                                <div class="col-sm-6 clickOnSectionsWeWant">
                                    <div>
                                        <input type="checkbox" class="custom-control-input includeCountries" checked onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                                        <label class="custom-control-label" for="includeCountries">Include data for individual countries</label>
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
%{--                                    <div>--}%
%{--                                        <p>--}%
%{--                                            <label for="amount">Date range:</label>--}%
%{--                                            <input type="text" id="amount" style="border: 0; color: #f6931f; font-weight: bold;" size="100"/>--}%
%{--                                        </p>--}%

%{--                                        <div id="dateSlider"></div>--}%
%{--                                    </div>--}%
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
                                        <input type="checkbox" class="custom-control-input" id="includeNotInflectedStates"  onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                                        <label class="custom-control-label" for="includeNotInflectedStates">Include states that have NOT reached an inflection point</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" class="custom-control-input" id="includeInflectedStates" checked onclick="mpgSoftware.growthFactorLauncher.changeWhatIsDisplayed (this)">
                                        <label class="custom-control-label" for="includeInflectedStates">Include states that have reached an inflection point</label>
                                    </div>
                                </div>
                                <div class="col-sm-6 displayTheSectionsWeWant">
                                    <div class="pull-right">
                                        <input type="checkbox" class="custom-control-input" id="logVersusLinearStates" checked onclick="mpgSoftware.growthFactorLauncher.logVersusLinear (this)">
                                        <label class="custom-control-label" for="logVersusLinear">Linear scale</label>
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
//"https://covid.ourworldindata.org/data/owid-covid-data.csv"
//         iso_code,location,date,total_cases,new_cases,total_deaths,new_deaths,total_cases_per_million,new_cases_per_million,total_deaths_per_million,new_deaths_per_million,total_tests,new_tests,total_tests_per_thousand,new_tests_per_thousand,tests_units
//         ABW,Aruba,2020-03-13,2,2,0,0,18.733,18.733,0.0,0.0,,,,,
//             ABW,Aruba,2020-03-20,4,2,0,0,37.465,18.733,0.0,0.0,,,,,

            mpgSoftware.growthFactorLauncher.prepareDisplay("https://covidtracking.com/api/v1/states/daily.csv",
            function(d) {
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
        mpgSoftware.growthFactorLauncher.prepareDisplay("${createLink(controller: 'growthFactor', action:'infectionDataPerCountry')}",
            function(d) {


                return {countryName: d["Entity"],
                    code: d["Code"],
                    date: d["Date"],
                    // y:+d["Total confirmed deaths (deaths)"],
                    y:+d[" (deaths)"],
                    x:+d["Days since the 5th total confirmed death"]};

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
