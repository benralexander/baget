
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="covidOverAll"/>
    <r:require modules="updatedCore,growthFactor"/>
%{--    <r:layoutResources/>--}%

</head>
<body>



<div class="container" style="width: 95%">




    <div class="starter-template">
        <h2>Growth factor analysis of Covid-19</h2>
    </div>

    <div class="container" id="headerSection" style="width: 100%">

        <!-- Tab panes -->
        <div class="tab-content">

        </div>
    </div>




%{--</div>--}%
</div>




<script>
    $( window ).ready(function() {

        mpgSoftware.growthFactorLauncher.initializePageToHoldDisplay ("#headerSection","div.tab-content", window);

// state population from https://worldpopulationreview.com/states/
        mpgSoftware.growthFactorLauncher.prepareToDisplay("states",
            [new mpgSoftware.growthFactorLauncher.DataFromAServer ('primary',
                "https://covidtracking.com/api/v1/states/daily.csv",
                function(d) {
                    return {countryName: d["state"],
                        code: d["state"],
                        date: mpgSoftware.growthFactorLauncher.dateConverterUtil.yyyymmddNoDash (d["date"]),
                        y:+d["death"]};
                },
                function(rawData){
                    return rawData;
                }),
                new mpgSoftware.growthFactorLauncher.DataFromAServer ('statePopulation',
                    "${createLink(controller: 'growthFactor', action:'populationPerState')}",
                    function(d) {
                        return d;
                    },
                    function(rawData){
                        return rawData;
                    })
            ]
        );

        mpgSoftware.growthFactorLauncher.prepareToDisplay(
            "country",
            [new mpgSoftware.growthFactorLauncher.DataFromAServer ('primary',
                "https://covid.ourworldindata.org/data/owid-covid-data.csv",
                function(d) {
                    return {countryName: d["location"],
                        total_cases: d["total_cases"],
                        total_deaths_per_million: d["total_deaths_per_million"],
                        total_tests_per_thousand: d["total_tests_per_thousand"],
                        code: d["location"],
                        date: mpgSoftware.growthFactorLauncher.dateConverterUtil.yyyymmddDash (d["date"]),
                        y:+d["total_deaths"]};

                },
                function(rawData){
                    return  _.filter (rawData,datum => ((!(datum.countryName.search('International')>=0)))&&
                        (!isNaN(datum.y)));;
                })
            ]
        );


        mpgSoftware.growthFactorLauncher.prepareToDisplay(
            "county",
            [new mpgSoftware.growthFactorLauncher.DataFromAServer ('primary',
                "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv",
                function(d) {
                    return {countryName: d["county"],
                        code: d["county"],
                        date: mpgSoftware.growthFactorLauncher.dateConverterUtil.yyyymmddDash (d["date"]),
                        y:+d["deaths"]};
                },
                function(rawData){
                    return rawData;
                })
            ]
        );




    });
</script>

<g:render template="growthFactorTemplate"></g:render>


</body>
</html>
