var mpgSoftware = mpgSoftware || {};




mpgSoftware.growthFactorLauncher = (function () {


    let height = 600;
    let width = 1000;


    const rememberTheseData = function (identifier,dataToRemember){
        $( "#"+identifier ).data( "store", {dataToRemember:dataToRemember} );
    };

    const recallData = function (identifier){
        const storedDataObject = $( "#"+identifier ).data( "store");
        if ( typeof storedDataObject !== 'undefined'){
            return storedDataObject.dataToRemember;
        }else {

        }
    };


    class DataGrouping {
        constructor (identifier){
            rememberTheseData (identifier, this);
        }
         showGroupsWithInflectionPoints =  true;
         showGroupsWithoutInflectionPoints =  false;
         showGroupsWithInsufficientData = true;
         useLinearNotLog = true;
         rememberData = [];
         includeTopLevelGroups = true;
         includeSummaryGroups = false;
         height = 600;
         width = 1000;
         startDate = new Date ();
         endDate = new Date ();
         movingAverageWindow = 5;
         daysOfNonExponentialGrowthRequired = 4;
         changesRequiringDataInitialization = function (dataChanged){
             let initializationRequired = false;
             switch(buildThePlot){
                 case 'includeTopLevelGroups':
                 case 'includeSummaryGroups':
                     initializationRequired = true;
                     break;
                 default:
                     initializationRequired = true;
                     break;
             }
             return initializationRequired;
         }
    };
    const retrieveData = function (identifier,fieldName){
        const dataGroupingHolder = recallData (identifier);
        if( typeof  dataGroupingHolder !== 'object'){
            console.log('data group holder was missing');
        }else if( typeof   dataGroupingHolder[fieldName] === 'undefined'){
            console.log('unexpected field name = '+fieldName);
        }else {
            return dataGroupingHolder[fieldName];
        }
    };
    const setData = function (identifier,fieldName, value){
        let dataGroupingHolder = recallData (identifier);
        if( typeof  dataGroupingHolder !== 'object'){
            const dataGrouping = new DataGrouping(identifier);
            dataGroupingHolder = recallData (identifier);
        }
        dataGroupingHolder[fieldName] = value;


    };

    /***
     * Set up the  moving window spinners
     */
    const setUpInteractiveDisplay = function (){
        const spinnerAverage = $('input.spinner.movingAverageWindow');
        spinnerAverage.spinner({
            step: 2,
            min: 1,
            max: 99,
            spin: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"movingAverageWindow", ui.value);
                buildThePlotWithRememberedData (identifier);
            }
        });
        spinnerAverage.spinner( "value", 5 );
        const spinnerThreshold = $('input.spinner.daysOfNonExponentialGrowthRequired');
        spinnerThreshold.spinner({
            step: 1,
            min: 1,
            max: 100,
            spin: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"daysOfNonExponentialGrowthRequired", ui.value);
                buildThePlotWithRememberedData (identifier);
            }

        });
        spinnerThreshold.spinner( "value", 7 );

    }
    const toggleDisplayOfSelectableElements = function (callingObject){
        const identifier = $(callingObject).closest("div.everyGroupToDisplayHolder");
        const shallWeExpand = $(callingObject).text () === "Expand";
        if (shallWeExpand){
            $(callingObject).text ("Contract");
            $(identifier).removeClass('smaller');
            $(identifier).addClass('greater');
        } else {
            $(callingObject).text ("Expand");
            $(identifier).removeClass('greater');
            $(identifier).addClass('smaller');
        }
    };

    const logVersusLinear= function (callingObject){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const changeToLinear = $(callingObject).text () === "Change to linear scale";
        if (changeToLinear){
            $(callingObject).text ("Change to log scale");
        } else {
            $(callingObject).text ("Change to linear scale");
        }
        setData(identifier,"useLinearNotLog", changeToLinear);
        buildThePlot(identifier,retrieveData(identifier,'changesRequiringDataInitialization') ("useLinearNotLog"));
    };
    const changeWhatIsDisplayed = function (callingObject,callingObjectId){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        setData(identifier,callingObjectId, callingObjectIsChecked);
        buildThePlot (identifier,retrieveData(identifier,'changesRequiringDataInitialization') (callingObjectId));
    };
    const changeGroupCheckbox = function (callingObject, identifier){
        const callingObjectId = $(callingObject);
        buildThePlot (identifier, false);
    };

    const setHeight = function (currentHeight){
        height = currentHeight;
    };

    const setWidtth = function (currentWidtth){
        width = currentWidtth;
    };

    const initializeDateSlider = function (identifier){
        const startDate = retrieveData (identifier, "startDate");
        const endDate = retrieveData (identifier, "endDate");
        const currentDateSlider = '#' +identifier +' div.dateSlider';
        const currentDateIndicator = '#' +identifier +' input.amount';
        $( currentDateSlider ).slider({
            range: true,
            min: new Date(startDate).getTime() / 1000,
            max: new Date(endDate).getTime() / 1000,
            step: 86400,
            values: [ new Date(startDate).getTime() / 1000, new Date(endDate).getTime() / 1000 ],
            slide: function( event, ui ) {
                $( currentDateIndicator ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
                setData (identifier, "startDate",new Date(ui.values[ 0 ] *1000));
                setData (identifier, "endDate",new Date(ui.values[ 1 ] *1000));
                buildThePlot (identifier, false);

            }
        });
        $( currentDateIndicator ).val( (new Date($( currentDateSlider ).slider( "values", 0 )*1000).toDateString()) +
            " - " + (new Date($( currentDateSlider ).slider( "values", 1 )*1000)).toDateString());
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


    const filterModule = (function () {
        // private routine that builds up the filters as a callable function
        const andOrFilterModule = function (orFilterArray,andFilterArray){
            return function(data){
                return _.filter (data, function (oneRec){
                    let finalAnswer = false;
                    if(orFilterArray.length > 0 ){  // we have some OR filters to check
                        finalAnswer = false; // for OR filters, assume the answer is false, unless one or more of the filters is true
                        _.forEach(orFilterArray,function(oneFilter){
                            if (oneFilter(oneRec)){
                                finalAnswer = true;
                                return false;
                            }
                        });
                    }else{
                        if(andFilterArray.length > 0 ){// we didn't have OR filters. Do we have AND filters, or should we assume the answer is false
                            finalAnswer =true;
                        }else {
                            finalAnswer =false;
                        }
                    }
                    if (!finalAnswer){
                        return finalAnswer;
                    }
                    // for the AND filters, start with the assumption that the answer is true,but change the answer if any of the filters is false
                    _.forEach(andFilterArray,function(oneFilter){
                        if (!oneFilter(oneRec)){
                            finalAnswer = false;
                            return false;
                        }
                    });
                    return finalAnswer;
                })
            };
        };

        const preFilterToGenerateListOfGroups = function (identifier){
            let orFilterArray = [];
            let andFilterArray = [];

            if (retrieveData (identifier, "includeTopLevelGroups")){
                //the world has a code, though otherwise only countries have codes. Exclude the world specifically from the country search
                orFilterArray.push (datum => !(datum.countryName.search('World')>=0));
            }
            if (retrieveData (identifier, "includeSummaryGroups")){
                //the world has a code, though otherwise only countries have codes. Exclude the world specifically from the country search
                orFilterArray.push (datum => (datum.countryName.search('World')>=0));
            }

            // In this case, if neither or filter is selected then we want the graft be blank. Therefore let's insert a fake and filter which will always fail
            if (orFilterArray.length === 0){
                andFilterArray.push (datum =>false);
            }


            const startDate = retrieveData (identifier, "startDate");
            const endDate = retrieveData (identifier, "endDate");
            andFilterArray.push (datum => (((new Date(datum.date).getTime() / 1000)>=(new Date(startDate).getTime() / 1000))  &&
                ((new Date(datum.date).getTime() / 1000)<=(new Date(endDate).getTime() / 1000))));

            return andOrFilterModule (orFilterArray,andFilterArray);

        };
        const filterOnlyOnListOfGroups = function (identifier){

            let andFilterArray = [];
            const selectedGroups = _.map ($("#" + identifier +" div.everyGroupToDisplay input.displayControl:checked").next("label"),d=>$(d).text());
            andFilterArray.push (datum => _.includes (selectedGroups,datum.countryName ));

            const startDate = retrieveData (identifier, "startDate");
            const endDate = retrieveData (identifier, "endDate");
            andFilterArray.push (datum => (((new Date(datum.date).getTime() / 1000)>=(new Date(startDate).getTime() / 1000))  &&
                ((new Date(datum.date).getTime() / 1000)<=(new Date(endDate).getTime() / 1000))));

            return andOrFilterModule ([],andFilterArray);


        };
        const filterBasedOnAnalysis = function (identifier){
            let orFilterArray = [];
            let andFilterArray = [];
            if (retrieveData (identifier, "showGroupsWithInflectionPoints")){
                //the world has a code, though otherwise only countries have codes. Exclude the world specifically from the country search
                orFilterArray.push (datum => datum.values.type === 'inflection');
            }
            if (retrieveData (identifier, "showGroupsWithoutInflectionPoints")){
                orFilterArray.push (datum => datum.values.type == 'noinflection');
            }
            if (retrieveData (identifier, "showGroupsWithInsufficientData")){
                orFilterArray.push (datum => datum.values.type == 'inflectionUndetermined');
            }

            return andOrFilterModule (orFilterArray,andFilterArray);
        };


        return {
            preFilterToGenerateListOfGroups:preFilterToGenerateListOfGroups,
            filterOnlyOnListOfGroups:filterOnlyOnListOfGroups,
            filterBasedOnAnalysis:filterBasedOnAnalysis
        }
    } ());








    const buildThePlot= function (idOfThePlaceToStoreData, initialize) {

        const allData = retrieveData (idOfThePlaceToStoreData,"rawData");
        const idOfThePlaceWhereThePlotGoes = retrieveData(idOfThePlaceToStoreData,'idOfThePlaceWhereThePlotGoes');
        const postAnalysisFilter = filterModule.filterBasedOnAnalysis (idOfThePlaceToStoreData);
        let preAnalysisFilter;
        if (initialize){//pre-filter, and then update the list of groups
            preAnalysisFilter = filterModule.preFilterToGenerateListOfGroups (idOfThePlaceToStoreData);
            $('#' +idOfThePlaceToStoreData +' div.everyGroupToDisplay').empty ();
            const startTheGroup = $('#' +idOfThePlaceToStoreData +' div.everyGroupToDisplay');
            let listOfGroups = '<div>';
            _.forEach(_.uniqBy(_.orderBy(preAnalysisFilter(allData),'countryName'),'countryName'),function (v,k){
                listOfGroups+='<div class="item checkboxHolder">'+
                    '<input type="checkbox" class="custom-control-input  displayControl"  checked onclick="mpgSoftware.growthFactorLauncher.changeGroupCheckbox (this,\'' +idOfThePlaceToStoreData +'\')">' +
                    '<label class="custom-control-label  displayControl" >'+((v)?v.countryName:"")+'</label>'+
                    '</div>';
            });
            listOfGroups+='</div>'
            startTheGroup.append(listOfGroups);
        }else {
            // use the selected groups to filter the raw data
            preAnalysisFilter = filterModule.filterOnlyOnListOfGroups(idOfThePlaceToStoreData);

        }


        var growthFactorPlot = baget.growthFactor
            .linearNotLog(retrieveData (idOfThePlaceToStoreData, "useLinearNotLog"))
            .height (height)
            .width(width)
            .idOfThePlaceToStoreData (idOfThePlaceToStoreData)
            .idOfThePlaceWhereThePlotGoes (idOfThePlaceWhereThePlotGoes)
            .movingAverageWindow(retrieveData(idOfThePlaceToStoreData,'movingAverageWindow'))
            .daysOfNonExponentialGrowthRequired (retrieveData(idOfThePlaceToStoreData,'daysOfNonExponentialGrowthRequired'))
            .buildGrowthFactorPlot(allData,
                preAnalysisFilter,
                postAnalysisFilter
            );
    };

    const buildThePlotWithRememberedData = function (idOfThePlaceToStoreData){

        buildThePlot (idOfThePlaceToStoreData, false);
    }


    const prepareDisplay = function(dataUrl, dataAssignmentFunction,  idOfThePlaceToStoreData,idOfThePlaceWhereThePlotGoes, window){
        setUpInteractiveDisplay ();
        try{
            const countryData = d3.csv(dataUrl,dataAssignmentFunction

        );
            countryData.then(

                function (allData) {
                    rememberData = _.filter (allData,datum => ((!(datum.countryName.search('excl.')>=0)))&&
                        (!isNaN(datum.y)));
                    setData (idOfThePlaceToStoreData, "rawData",rememberData);
                    setData (idOfThePlaceToStoreData, "idOfThePlaceWhereThePlotGoes",idOfThePlaceWhereThePlotGoes);
                    setData (idOfThePlaceToStoreData, "startDate",new Date(_.minBy(allData,d=>new Date(d.date).getTime()).date));
                    setData (idOfThePlaceToStoreData, "endDate",new Date(_.maxBy(allData,d=>new Date(d.date).getTime()).date));
                    const allData2 = retrieveData (idOfThePlaceToStoreData,"rawData");

                    buildThePlot(idOfThePlaceToStoreData, true);
                    d3.select(window).on('resize', baget.growthFactor.resize);
                    initializeDateSlider (idOfThePlaceToStoreData);
                    baget.growthFactor.resize();

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
        // setEndDate:setEndDate,
        // setStartDate:setStartDate,
        buildThePlotWithRememberedData:buildThePlotWithRememberedData,
        prepareDisplay:prepareDisplay,
        calculateWeightedMovingAverage:calculateWeightedMovingAverage,
        changeWhatIsDisplayed:changeWhatIsDisplayed,
        changeGroupCheckbox:changeGroupCheckbox,
        logVersusLinear:logVersusLinear,
        toggleDisplayOfSelectableElements:toggleDisplayOfSelectableElements
    }

}());
