var mpgSoftware = mpgSoftware || {};




mpgSoftware.growthFactorLauncher = (function () {

    let showCountriesWithInflectionPoints =  true;
    let showCountriesWithoutInflectionPoints =  false;
    let showCountries =  true;
    let showCombinations =  false;
    let showCategories =  false;
    let useLinearNotLog = true;
    let rememberData = [];
    let height = 600;
    let width = 1000;
    let startDate = new Date ();
    let endDate = new Date ();


    const logVersusLinear= function (callingObject){
        const callingObjectId = $(callingObject).attr('id');
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        useLinearNotLog = callingObjectIsChecked;
        buildThePlotWithRememberedData ();
    };
    const changeWhatIsDisplayed = function (callingObject){
        const callingObjectId = $(callingObject).attr('id');
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        if (callingObjectId==="includeCountries"){
            showCountries = callingObjectIsChecked;
        }else if (callingObjectId==="includeCategories"){
            showCategories  = callingObjectIsChecked;

        }else if (callingObjectId==="includeCombinations"){
            showCombinations  = callingObjectIsChecked;
        }else if (callingObjectId==="include" +
            "Inflected"){
            showCountriesWithInflectionPoints  = callingObjectIsChecked;
        }else if (callingObjectId==="includeNotInflected"){
            showCountriesWithoutInflectionPoints  = callingObjectIsChecked;
        }else if (callingObjectId==="includeNewAdditions"){


        }
        buildThePlotWithRememberedData ();
    };
    const changeGroupCheckbox = function (callingObject){
        const callingObjectId = $(callingObject);
    };

    const calculatePositionMultipliers = function (length){
        return _.fill(Array(length), 1);
    };


    const setStartDate = function (currentStartDate){
        startDate = currentStartDate;
    };

    const setEndDate = function (currentEndDate){
        endDate = currentEndDate;
    };

    const setHeight = function (currentHeight){
        height = currentHeight;
    };

    const setWidtth = function (currentWidtth){
        width = currentWidtth;
    };

    const initializeDateSlider = function (){
        $( "#dateSlider" ).slider({
            range: true,
            min: new Date(startDate).getTime() / 1000,
            max: new Date(endDate).getTime() / 1000,
            step: 86400,
            values: [ new Date(startDate).getTime() / 1000, new Date(endDate).getTime() / 1000 ],
            slide: function( event, ui ) {
                $( "#amount" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
                setStartDate(new Date(ui.values[ 0 ] *1000));
                setEndDate(new Date(ui.values[ 1 ] *1000));
                buildThePlotWithRememberedData ();

            }
        });
        $( "#amount" ).val( (new Date($( "#dateSlider" ).slider( "values", 0 )*1000).toDateString()) +
            " - " + (new Date($( "#dateSlider" ).slider( "values", 1 )*1000)).toDateString());
    };

    const calculateWeightedMovingAverage = function (dataVector){
        const vectorLength = dataVector.length;
        const positionMultipliers = calculatePositionMultipliers (vectorLength);
        let developingAverage = 0;
        _.forEach(dataVector, function (element, index){
            developingAverage += (element*positionMultipliers [index]);
        });
    return developingAverage /vectorLength;
    };

    const filterTheData = function (dataToFilter,prefilter){
        if (prefilter){
            let orFilterArray = [];
            let andFilterArray = [];

            if (showCountries){
                //the world has a code, though otherwise only countries have codes. Exclude the world specifically from the country search
                orFilterArray.push (datum => (datum.code.length > 0) &&
                    (!(datum.countryName.search('World')>=0))
                );
            }
            if (showCategories){
                orFilterArray.push (datum => datum.code.length === 0);
            }
            if (showCombinations){
                orFilterArray.push (datum => ((datum.countryName.search('World')>=0)||
                    (datum.countryName.search('Europe')>=0)||
                    (datum.countryName.search('Asia')>=0)));
            }
            andFilterArray.push (datum => (((new Date(datum.date).getTime() / 1000)>=(new Date(startDate).getTime() / 1000))  &&
                ((new Date(datum.date).getTime() / 1000)<=(new Date(endDate).getTime() / 1000))));
            // &&
            //     ()))

            return function(data){
                return _.filter (data, function (oneRec){
                    let finalAnswer = false;
                    // first OR together attributes of things that we want to include
                    _.forEach(orFilterArray,function(oneFilter){
                        if (oneFilter(oneRec)){
                            finalAnswer = true;
                            return false;
                        }
                    });
                    // now strip out anything that we absolutely have to skip
                    if (!finalAnswer){return finalAnswer;}
                    _.forEach(andFilterArray,function(oneFilter){
                        if (!oneFilter(oneRec)){
                            finalAnswer = false;
                            return false;
                        }
                    });
                    return finalAnswer;
                })
            }
        }else {
            return function (data){
                if (showCountriesWithInflectionPoints&&!showCountriesWithoutInflectionPoints){
                    return _.filter (data, datum => datum.values.type == 'inflection')
                } else if (!showCountriesWithInflectionPoints&&showCountriesWithoutInflectionPoints){
                    return _.filter (data, datum => datum.values.type == 'noinflection')
                }else if (showCountriesWithInflectionPoints&&showCountriesWithoutInflectionPoints){
                    return _.filter (data, datum => (datum.values.type == 'noinflection')||(datum.values.type == 'inflection'))
                }else if (!showCountriesWithInflectionPoints&&!showCountriesWithoutInflectionPoints){
                    //return _.filter (data, datum => datum.values.type !== 'noinflection' &&datum.values.type !== 'inflection' )
                    return _.filter (data, datum => datum.values.type === 'inflectionUndetermined')

                }

            }
        }


    }


    const buildThePlot= function (allData) {
        const thingsToDisplay = filterTheData (allData, true);
        const postAnalysisFilter = filterTheData (allData, false);
        $('div.everyGroupToDisplay').empty ();
        const startTheGroup = $('div.everyGroupToDisplay');
        let listOfGroups = '<div>';
        _.forEach(_.uniqBy(thingsToDisplay(allData),'countryName'),function (v,k){
            listOfGroups+='<div>'+
                '<input type="checkbox" class="custom-control-input" id="includeNewAdditions"  checked onclick="mpgSoftware.growthFactorLauncher.changeGroupCheckbox (this)">' +
                '<label class="custom-control-label" for="includeNewAdditions">'+((v)?v.countryName:"")+'</label>'+
                '</div>';
        });
        listOfGroups+='</div>'
        startTheGroup.append(listOfGroups);
        var growthFactorPlot = baget.growthFactor
            .linearNotLog(useLinearNotLog)
            .height (height)
            .width(width)
            .buildGrowthFactorPlot(allData,
            thingsToDisplay,
                postAnalysisFilter
            );
    };

    const buildThePlotWithRememberedData = function (){
        buildThePlot (rememberData);
    }


    const prepareDisplay = function(dataByCountryUrl, dataByCountryState,  window){
        try{
            const countryData = d3.csv(dataByCountryState,

                // function(d) {
                //     return {countryName: d["Entity"],
                //             code: d["Code"],
                //             date: d["Date"],
                //         y:+d[" (deaths)"],
                //     x:+d["Days since the 5th total confirmed death"]};
                //     }
                //
                // );
            function(d) {
                const dateString  = d["date"];
                const currentDay = +dateString.substring (6, 8);
                const currentMonth = +dateString.substring (4, 6);
                const currentYear = +dateString.substring (0, 4);
                const currentDate = new Date (currentYear,currentMonth,currentDay);
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
                ]
                return {countryName: d["state"],
                    code: d["state"],
                    date: ""+months[currentDate.getMonth()-1]+" "+currentDate.getDate()+ ", "+currentDate.getFullYear(),
                    y:+d["death"]};
            }

        );
            countryData.then(

                function (allData) {
                    rememberData = _.filter (allData,datum => ((!(datum.countryName.search('excl.')>=0)))&&
                        (!isNaN(datum.y)));
                    setStartDate(new Date(_.minBy(allData,d=>new Date(d.date).getTime()).date));
                    setEndDate(new Date(_.maxBy(allData,d=>new Date(d.date).getTime()).date));
                    buildThePlot(rememberData);
                    d3.select(window).on('resize', baget.growthFactor.resize);
                    initializeDateSlider ();
                }

            );



        } catch(e){
            console.log('f');
        }
    }


// public routines are declared below
    return {
        setWidth:setWidtth,
        setHeight:setHeight,
        setEndDate:setEndDate,
        setStartDate:setStartDate,
        buildThePlotWithRememberedData:buildThePlotWithRememberedData,
        prepareDisplay:prepareDisplay,
        calculateWeightedMovingAverage:calculateWeightedMovingAverage,
        changeWhatIsDisplayed:changeWhatIsDisplayed,
        changeGroupCheckbox:changeGroupCheckbox,
        logVersusLinear:logVersusLinear
    }

}());
