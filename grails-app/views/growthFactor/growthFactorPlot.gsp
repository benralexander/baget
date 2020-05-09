
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,growthFactor"/>
    <r:layoutResources/>

</head>
<body>

<h2>Comparing growth factors for Covid-19 across countries</h2>

<div class="container" style="width: 95%">




    <div class="starter-template">
        <h2>Comparing growth factors for Covid-19 </h2>
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
        jQuery.noConflict();
        // $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        //
        //     alert(e.target.href);
        // })

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

        mpgSoftware.growthFactorLauncher.prepareToDisplay("https://covidtracking.com/api/v1/states/daily.csv",
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
                "growthFactorPlotStates");

        mpgSoftware.growthFactorLauncher.prepareToDisplay("https://covid.ourworldindata.org/data/owid-covid-data.csv",
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
            "growthFactorPlotCountries");

        mpgSoftware.growthFactorLauncher.prepareToDisplay("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv",
            function(d) {
                const dateString  = d["date"];
                const currentDay = +dateString.substring (8, 10);
                const currentMonth = +dateString.substring (5, 7);
                const currentYear = +dateString.substring (0, 4);
                const currentDate = new Date (currentYear,currentMonth,currentDay);


                return {countryName: d["county"],
                    code: d["county"],
                    date: ""+months[currentDate.getMonth()-1]+" "+currentDate.getDate()+ ", "+currentDate.getFullYear(),
                    y:+d["deaths"]};

            },
            "county",
            "growthFactorPlotCounties");



    });
</script>

<g:render template="growthFactorTemplate"></g:render>


</body>
</html>
