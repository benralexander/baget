
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
        <h1>COVID-19</h1>
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
                    let temporaryHolder = d;
                    temporaryHolder ["key"] = d["state"];
                    temporaryHolder ["date"] =  mpgSoftware.growthFactorLauncher.dateConverterUtil.yyyymmddNoDash (d["date"]);
                    return temporaryHolder;
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

                        let temporaryHolder = d;
                        temporaryHolder ["key"] = d["location"];
                        temporaryHolder ["date"] =  mpgSoftware.growthFactorLauncher.dateConverterUtil.yyyymmddDash(d["date"]);
                        return temporaryHolder;

                },
                function(rawData){
                    return  _.filter (rawData,datum => ((!(datum.key.search('International')>=0)))&&
                        (!isNaN(datum.y)));;
                },
                function(rawData){
                    return rawData;
                })
            ]
        );


        mpgSoftware.growthFactorLauncher.prepareToDisplay(
            "county",
            [new mpgSoftware.growthFactorLauncher.DataFromAServer ('primary',
                "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv",
                function(d) {
                    let temporaryHolder = d;
                    temporaryHolder ["key"] = d["county"]+", "+d['state'];
                    temporaryHolder ["date"] =  mpgSoftware.growthFactorLauncher.dateConverterUtil.yyyymmddDash(d["date"]);
                    return temporaryHolder;
                },
                function(rawData){
                    return  _.filter (rawData,datum => ((!(datum.key.search('Unknown')>=0)))&&
                        (!isNaN(datum.y)));;
                })
            ]
        );




    });
</script>

<g:render template="growthFactorTemplate"></g:render>


</body>
</html>
