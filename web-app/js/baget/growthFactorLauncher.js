var mpgSoftware = mpgSoftware || {};




mpgSoftware.growthFactorLauncher = (function () {

    let showCountriesWithInflectionPoints =  true;
    let showCountriesWithoutInflectionPoints =  false;
    let showCountries =  true;
    let showCombinations =  false;
    let showCategories =  false;

    let rememberData = [];



    const logVersusLinear= function (callingObject){

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
            let filterArray = [];
            if (showCountries){
                //the world has a code, though otherwise only countries have codes. Exclude the world specifically from the country search
                filterArray.push (datum => (datum.code.length > 0) &&
                    (!(datum.countryName.search('World')>=0))
                );
            }
            if (showCategories){
                filterArray.push (datum => datum.code.length === 0);
            }
            if (showCombinations){
                filterArray.push (datum => ((datum.countryName.search('World')>=0)||
                    (datum.countryName.search('Europe')>=0)||
                    (datum.countryName.search('Asia')>=0)));
            }


            return function(data){
                return _.filter (data, function (oneRec){
                    // let finalAnswer = true;
                    // _.forEach(filterArray,function(oneFilter){
                    //     if (!oneFilter(oneRec)){
                    //         finalAnswer = false;
                    //         return false;
                    //     }
                    // });
                    let finalAnswer = false;
                    _.forEach(filterArray,function(oneFilter){
                        if (oneFilter(oneRec)){
                            finalAnswer = true;
                            return false;
                        }
                    });
                    return finalAnswer;
                })
            }
        }else {

        }


    }


    const buildThePlot= function (allData) {
        const thingsToDisplay = filterTheData (allData, true);
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
        // startTheGroup.append('<ul>');
        //
        // _.forEach(_.uniqBy(thingsToDisplay(allData),'countryName'),function (v,k){
        //     startTheGroup.append('<li>'+((v)?v.countryName:"")+'</li>');
        // });
        startTheGroup.append(listOfGroups);
        var growthFactorPlot = baget.growthFactor.buildGrowthFactorPlot(allData,
            thingsToDisplay,
            function (data){
                if (showCountriesWithInflectionPoints&&!showCountriesWithoutInflectionPoints){
                    return _.filter (data, datum => datum.values.type == 'inflection')
                } else if (!showCountriesWithInflectionPoints&&showCountriesWithoutInflectionPoints){
                    return _.filter (data, datum => datum.values.type == 'noinflection')
                }else if (showCountriesWithInflectionPoints&&showCountriesWithoutInflectionPoints){
                    return _.filter (data, datum => (datum.values.type == 'noinflection')||(datum.values.type == 'inflection'))
                }else if (!showCountriesWithInflectionPoints&&!showCountriesWithoutInflectionPoints){
                    return _.filter (data, datum => datum.values.type !== 'noinflection' &&datum.values.type !== 'inflection' )
                }

            });
    };

    const buildThePlotWithRememberedData = function (){
        buildThePlot (rememberData);
    }


    const prepareDisplay = function(dataUrl,  window){
        try{
            const countryData = d3.csv(dataUrl,

                function(d) {
                    return {countryName: d["Entity"],
                            code: d["Code"],
                            date: d["Date"],
                    y:+d["Total confirmed deaths (deaths)"],
                    x:+d["Days since the 5th total confirmed death"]};
                    }

                );
            countryData.then(

                function (allData) {
                    rememberData = _.filter (allData,datum => (!(datum.countryName.search('excl.')>=0)));
                    buildThePlot(rememberData);
                    d3.select(window).on('resize', baget.growthFactor.resize);
                }

            );



        } catch(e){
            console.log('f');
        }
    }


// public routines are declared below
    return {
        buildThePlotWithRememberedData:buildThePlotWithRememberedData,
        prepareDisplay:prepareDisplay,
        calculateWeightedMovingAverage:calculateWeightedMovingAverage,
        changeWhatIsDisplayed:changeWhatIsDisplayed,
        changeGroupCheckbox:changeGroupCheckbox,
        logVersusLinear:logVersusLinear
    }

}());
