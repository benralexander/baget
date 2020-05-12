var mpgSoftware = mpgSoftware || {};




mpgSoftware.growthFactorLauncher = (function () {


    let height = 600;
    let width = 1000;
    const displayOrganizer = {
        country: [{
            id:"country",
            initialClasses:"active in",
            dataChoosersTitle: "Include data for:",
            dataChoosers: [
                {
                    title:"individual countries",
                    methodCallBack:"changeWhatIsDisplayed",
                    identifier:"includeTopLevelGroups",
                    checked: "checked"
                },
                {
                    title:"the world",
                    methodCallBack:"changeWhatIsDisplayed",
                    identifier:"includeSummaryGroups",
                    checked: ""
                }
            ],
            dataFilters: [1],
            specificDeactivators: [
                {
                    title: "Countries"
                }
            ],
            analysisSelectionTitle:"Include countries that:",
            analysisSelection: [
                {
                    title:"have NOT reached an inflection point",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithoutInflectionPoints",
                    checked: ""

                },
                {
                    title:"have reached an inflection point",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithInflectionPoints",
                    checked: "checked"

                },
                {
                    title:"have insufficient data for analysis",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithInsufficientData",
                    checked: "checked"

                }
            ],
            calculationAdjustmentTitle: "For inflection, # of days:",
            calculationAdjustment: [
                {
                    className:"movingAverageWindow",
                    title:"in moving average"
                },
                {
                    className:"daysOfNonExponentialGrowthRequired",
                    title:"of declining growth"
                }
            ],
            displayAdjustment: [
                {
                    methodCallBack:"logVersusLinear",
                    title:"Log scale"
                },
                {
                    methodCallBack:"collapseToCommonStart",
                    title:" Date dependent"
                },
                {
                    methodCallBack:"deathsIndependentOfPopulation",
                    title:"Deaths per million"
                }
            ],
            displayAdjustmentSlim:"slim",
            plotGoesHere: [{"id":"growthFactorPlotCountries"}],
            tabDescription: "COVID-19 by country",
            tabActive: "active"

        }],
        states: [{
            id:"states",
            initialClasses:"",
            dataChoosersTitle: "Include data for:",
            dataChoosers: [
                {
                    title:"individual states",
                    methodCallBack:"changeWhatIsDisplayed",
                    identifier:"includeTopLevelGroups",
                    checked: "checked"
                }
            ],
            dataFilters: [1],
            specificDeactivators: [
                {
                    title: "States"
                }
            ],
            analysisSelectionTitle:"Include states that:",
            analysisSelection: [
                {
                    title:"have NOT reached an inflection point",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithoutInflectionPoints",
                    checked: ""

                },
                {
                    title:"have reached an inflection point",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithInflectionPoints",
                    checked: "checked"

                },
                {
                    title:"with insufficient data for analysis",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithInsufficientData",
                    checked: "checked"

                }
            ],
            calculationAdjustmentTitle: "For inflection, # of days:",
            calculationAdjustment: [
                {
                    className:"movingAverageWindow",
                    title:"in moving average"
                },
                {
                    className:"daysOfNonExponentialGrowthRequired",
                    title:"of declining growth"
                }
            ],
            displayAdjustment: [
                {
                    methodCallBack:"logVersusLinear",
                    title:"Log scale"
                },
                {
                    methodCallBack:"collapseToCommonStart",
                    title:" Date dependent"
                }
            ],
            plotGoesHere: [{"id":"growthFactorPlotStates"}],
            tabDescription: "COVID-19 by state",
            tabActive: ""
        }],
        county: [{
            id:"county",
            initialClasses:"",
            dataChoosersTitle: "Include data for:",
            dataChoosers: [
                {
                    title:"individual counties",
                    methodCallBack:"changeWhatIsDisplayed",
                    identifier:"includeTopLevelGroups",
                    checked: "checked"
                }
            ],
            dataFilters: [1],
            specificDeactivators: [
                {
                    title: "US counties"
                }
            ],
            analysisSelectionTitle:"Include counties that:",
            analysisSelection: [
                {
                    title:"have NOT reached an inflection point",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithoutInflectionPoints",
                    checked: ""

                },
                {
                    title:"have reached an inflection point",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithInflectionPoints",
                    checked: "checked"

                },
                {
                    title:"with insufficient data for analysis",
                    methodCallBack:"changeFormOfAnalysis",
                    identifier:"showGroupsWithInsufficientData",
                    checked: "checked"

                }
            ],
            calculationAdjustmentTitle: "For inflection, # of days:",
            calculationAdjustment: [
                {
                    className:"movingAverageWindow",
                    title:"in moving average"
                },
                {
                    className:"daysOfNonExponentialGrowthRequired",
                    title:"of declining growth"
                }
            ],
            displayAdjustment: [
                {
                    methodCallBack:"logVersusLinear",
                    title:"Log scale"
                },
                {
                    methodCallBack:"collapseToCommonStart",
                    title:"Date dependent"
                }
            ],
            plotGoesHere: [{"id":"growthFactorPlotCounties"}],
            tabDescription: "COVID-19 by county",
            tabActive: ""

        }],


    };
    const tabHeaderOrganizer = {
        topSection:[
            {
            headers: [
                displayOrganizer.country,
                displayOrganizer.states,
                displayOrganizer.county
            ]
            }
        ]

    };

    const filterBasedOnDataSelectionAndDate = 1;
    const filterDateAndListOfGroups = 2;
    const filterOnlyOnListOfGroups = 3;
    const filterBasedOnAnalysis = 4;


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
         movingAverageWindow = 7;
         daysOfNonExponentialGrowthRequired = 7;
         collapseToCommonStart = true;
        deathsIndependentOfPopulation = true;
         changesRequiringDataInitialization = function (dataChanged){
             let initializationRequired = false;
             switch(buildThePlot){
                 case 'includeTopLevelGroups':
                 case 'includeSummaryGroups':
                     initializationRequired = false;
                     break;
                 default:
                     initializationRequired = false;
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
                buildThePlotWithRememberedData (identifier,filterBasedOnDataSelectionAndDate);
            }
        });
        spinnerAverage.spinner( "value", 7 );
        const spinnerThreshold = $('input.spinner.daysOfNonExponentialGrowthRequired');
        spinnerThreshold.spinner({
            step: 1,
            min: 1,
            max: 100,
            spin: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"daysOfNonExponentialGrowthRequired", ui.value);
                buildThePlotWithRememberedData (identifier,filterBasedOnDataSelectionAndDate);
            }
            // ,
            // change: function (event, ui){
            //     const identifier = $(event.target).closest("div.coreObject").attr('id');
            //     setData(identifier,"daysOfNonExponentialGrowthRequired", $(this).spinner('value'));
            //     buildThePlotWithRememberedData (identifier);
            // }

        });
        spinnerThreshold.spinner( "value", 7 );

    };
    const modifyAllCheckboxes = function (callingObject){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const clickAllTheBoxes = $(callingObject).text () === "ALL";
        $('#'+identifier+' div.everyGroupToDisplay div.item input.displayControl').prop("checked", clickAllTheBoxes);
        buildThePlot (identifier,  filterOnlyOnListOfGroups);
    };



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
        const changeToLinear = $(callingObject).text () === "Linear scale";
        if (changeToLinear){
            $(callingObject).text ("Log scale");
        } else {
            $(callingObject).text ("Linear scale");
        }
        setData(identifier,"useLinearNotLog", changeToLinear);
        buildThePlot(identifier,filterOnlyOnListOfGroups);
    };
    const collapseToCommonStart= function (callingObject){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const shallWeCollapseToCommonStart = $(callingObject).text () === "Shared start";
        if (shallWeCollapseToCommonStart){
            $(callingObject).text ("Date dependent");
        } else {
            $(callingObject).text ("Shared start");
        }
        setData(identifier,"collapseToCommonStart", shallWeCollapseToCommonStart);
        buildThePlot(identifier,filterOnlyOnListOfGroups);
    };
    const deathsIndependentOfPopulation= function (callingObject){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const shallWeShowDeathsIndependentOfPopulation= $(callingObject).text () === "Total deaths";
        if (shallWeShowDeathsIndependentOfPopulation){
            $(callingObject).text ("Deaths per million");
        } else {
            $(callingObject).text ("Total deaths");
        }
        setData(identifier,"deathsIndependentOfPopulation", shallWeShowDeathsIndependentOfPopulation);
        buildThePlot(identifier,filterOnlyOnListOfGroups);
    };

    const changeWhatIsDisplayed = function (callingObject,callingObjectId){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        setData(identifier,callingObjectId, callingObjectIsChecked);
        buildThePlot (identifier,filterBasedOnDataSelectionAndDate);
    };
    const changeFormOfAnalysis = function (callingObject,callingObjectId){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        setData(identifier,callingObjectId, callingObjectIsChecked);
        buildThePlot (identifier,filterOnlyOnListOfGroups);
    };
    const changeGroupCheckbox = function (callingObject, identifier){
        buildThePlot (identifier, filterOnlyOnListOfGroups);
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
                buildThePlot (identifier, filterBasedOnDataSelectionAndDate);

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
                    if ((orFilterArray.length === 0 ) && (andFilterArray.length === 0 )) { // we have no filters at all. Simply pass everything
                        finalAnswer = true;
                    }else {
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

                    }
                    return finalAnswer;
                })
            };
        };

        const noFilterAtAll = function (identifier) {
            let orFilterArray = [];
            let andFilterArray = [];
            return andOrFilterModule (orFilterArray,andFilterArray);
        }

        const filterBasedOnDataSelectionAndDate = function (identifier){
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
        const filterDateAndListOfGroups = function (identifier){

            let andFilterArray = [];
            const selectedGroups = _.map ($("#" + identifier +" div.everyGroupToDisplay input.displayControl:checked").next("label"),d=>$(d).text());
            andFilterArray.push (datum => _.includes (selectedGroups,datum.countryName ));

            const startDate = retrieveData (identifier, "startDate");
            const endDate = retrieveData (identifier, "endDate");
            andFilterArray.push (datum => (((new Date(datum.date).getTime() / 1000)>=(new Date(startDate).getTime() / 1000))  &&
                ((new Date(datum.date).getTime() / 1000)<=(new Date(endDate).getTime() / 1000))));

            return andOrFilterModule ([],andFilterArray);


        };
        const filterOnlyOnListOfGroups = function (identifier){

            let andFilterArray = [];
            const selectedGroups = _.map ($("#" + identifier +" div.everyGroupToDisplay input.displayControl:checked").next("label"),d=>$(d).text());
            andFilterArray.push (datum => _.includes (selectedGroups,datum.countryName ));

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
            noFilterAtAll:noFilterAtAll,
            filterBasedOnDataSelectionAndDate:filterBasedOnDataSelectionAndDate,
            filterDateAndListOfGroups:filterDateAndListOfGroups,
            filterOnlyOnListOfGroups:filterOnlyOnListOfGroups,
            filterBasedOnAnalysis:filterBasedOnAnalysis
        }
    } ());




    const fillTheMainEntitySelectionBox = function(idOfThePlaceToStoreData){
        const allData = retrieveData (idOfThePlaceToStoreData,"rawData");
        let preAnalysisFilter = filterModule.filterBasedOnDataSelectionAndDate (idOfThePlaceToStoreData);
        $('#' +idOfThePlaceToStoreData +' div.everyGroupToDisplay').empty ();
        const startTheGroup = $('#' +idOfThePlaceToStoreData +' div.everyGroupToDisplay');
        let listOfGroups = '<div>';
        _.forEach(_.uniqBy(_.orderBy(preAnalysisFilter(allData),'countryName'),'countryName'),function (v,k){
            listOfGroups+='<div class="item checkboxHolder active">'+
                '<input type="checkbox" class="custom-control-input  displayControl"  checked onclick="mpgSoftware.growthFactorLauncher.changeGroupCheckbox (this,\'' +idOfThePlaceToStoreData +'\')">' +
                '<label class="custom-control-label  displayControl" >'+((v)?v.countryName:"")+'</label>'+
                '</div>';
        });
        listOfGroups+='</div>'
        startTheGroup.append(listOfGroups);
        return preAnalysisFilter;
    };

    const adjustTheMainSelectionBox = function (idOfThePlaceToStoreData){
        const allData = retrieveData (idOfThePlaceToStoreData,"rawData");
        const preAnalysisFilter = filterModule.filterBasedOnDataSelectionAndDate (idOfThePlaceToStoreData);
        const everyoneWhoMadeItThroughTheTimeFilter = _.map(_.uniqBy(_.orderBy(preAnalysisFilter(allData),'countryName'),'countryName'),function (d) {
            return  d.countryName;
        });
        const everybodyInTheExistingList = _.map($('#'+idOfThePlaceToStoreData+' div.everyGroupToDisplay div.item label.displayControl'),function (d) {
            return  {name:$(d).text(),node:$(d).parent()};
        });
        _.forEach(everybodyInTheExistingList,function(d){
            $(d.node).removeClass('active');
            $(d.node).removeClass('passive');
            if (_.includes(everyoneWhoMadeItThroughTheTimeFilter,d.name)){
                $(d.node).addClass('active');
            } else {
                (d.node).addClass('passive');
            }
        });
    }



    const buildThePlot= function (idOfThePlaceToStoreData, dataFilteringChoice) {

        const allData = retrieveData (idOfThePlaceToStoreData,"rawData");
        const idOfThePlaceWhereThePlotGoes = retrieveData(idOfThePlaceToStoreData,'idOfThePlaceWhereThePlotGoes');
        let postAnalysisFilter = filterModule.filterBasedOnAnalysis (idOfThePlaceToStoreData);
        let preAnalysisFilter;
        switch (dataFilteringChoice){
            case filterBasedOnDataSelectionAndDate:
                preAnalysisFilter = fillTheMainEntitySelectionBox(idOfThePlaceToStoreData);
                break;
            case filterDateAndListOfGroups:
                preAnalysisFilter = filterModule.filterDateAndListOfGroups(idOfThePlaceToStoreData);
                adjustTheMainSelectionBox(idOfThePlaceToStoreData);
                break;
            case filterOnlyOnListOfGroups:
                preAnalysisFilter = filterModule.filterOnlyOnListOfGroups(idOfThePlaceToStoreData);
                break;
            case filterBasedOnAnalysis:
                preAnalysisFilter = filterModule.filterOnlyOnListOfGroups(idOfThePlaceToStoreData);
                postAnalysisFilter = filterModule.filterBasedOnAnalysis (idOfThePlaceToStoreData);
                break;
            default:
                alert('data filtering ='+dataFilteringChoice);
                break;
        }
        // if (filterBasedOnAnalysis){//pre-filter, and then update the list of groups
        //     preAnalysisFilter = fillTheMainEntitySelectionBox(idOfThePlaceToStoreData);
        // }else if (chooseOnlyFromCheckboxes) {
        //     preAnalysisFilter = filterModule.filterOnlyOnListOfGroups(idOfThePlaceToStoreData);
        // }else {
        //     preAnalysisFilter = adjustTheMainSelectionBox(idOfThePlaceToStoreData);
        // }


        var growthFactorPlot = baget.growthFactor
            .linearNotLog(retrieveData (idOfThePlaceToStoreData, "useLinearNotLog"))
            .height (height)
            .width(width)
            .idOfThePlaceToStoreData (idOfThePlaceToStoreData)
            .idOfThePlaceWhereThePlotGoes (idOfThePlaceWhereThePlotGoes)
            .movingAverageWindow(retrieveData(idOfThePlaceToStoreData,'movingAverageWindow'))
            .daysOfNonExponentialGrowthRequired (retrieveData(idOfThePlaceToStoreData,'daysOfNonExponentialGrowthRequired'))
            .collapseToCommonStart (retrieveData(idOfThePlaceToStoreData,'collapseToCommonStart'))
            .deathsIndependentOfPopulation(retrieveData(idOfThePlaceToStoreData,'deathsIndependentOfPopulation'))
            .buildGrowthFactorPlot(allData,
                preAnalysisFilter,
                postAnalysisFilter
            );
    };

    const buildThePlotWithRememberedData = function (idOfThePlaceToStoreData){

        buildThePlot (idOfThePlaceToStoreData, filterBasedOnDataSelectionAndDate);
    }




    const prepareToDisplay = function(dataUrl, dataAssignmentFunction,  idOfThePlaceToStoreData,idOfThePlaceWhereThePlotGoes, window){
        setData (idOfThePlaceToStoreData, "dataRetrieved",false);

        setData (idOfThePlaceToStoreData, "dataUrl",dataUrl);
        setData (idOfThePlaceToStoreData, "dataAssignmentFunction",dataAssignmentFunction);
        setData (idOfThePlaceToStoreData, "idOfThePlaceWhereThePlotGoes",idOfThePlaceWhereThePlotGoes);
        if (displayOrganizer[idOfThePlaceToStoreData][0].tabActive=== "active"){
            displayPlotRetrievingIfNecessary(idOfThePlaceToStoreData);
        }

    };

    const displayPlotRetrievingIfNecessary = function(idOfThePlaceToStoreData){
        const dataRetrieved = retrieveData  (idOfThePlaceToStoreData, "dataRetrieved");
        if (!dataRetrieved){
            const dataUrl = retrieveData (idOfThePlaceToStoreData, "dataUrl");
            const dataAssignmentFunction = retrieveData (idOfThePlaceToStoreData, "dataAssignmentFunction");
            const idOfThePlaceWhereThePlotGoes = retrieveData (idOfThePlaceToStoreData, "idOfThePlaceWhereThePlotGoes");
            try{
                const countryData = d3.csv(dataUrl,dataAssignmentFunction

                );
                countryData.then(

                    function (allData) {
                        setUpInteractiveDisplay ();
                        const rememberData = _.filter (allData,datum => ((!(datum.countryName.search('excl.')>=0)))&&
                            (!isNaN(datum.y)));
                        setData (idOfThePlaceToStoreData, "rawData",rememberData);
                        setData (idOfThePlaceToStoreData, "idOfThePlaceWhereThePlotGoes",idOfThePlaceWhereThePlotGoes);
                        setData (idOfThePlaceToStoreData, "startDate",new Date(_.minBy(allData,d=>new Date(d.date).getTime()).date));
                        setData (idOfThePlaceToStoreData, "endDate",new Date(_.maxBy(allData,d=>new Date(d.date).getTime()).date));
                        const allData2 = retrieveData (idOfThePlaceToStoreData,"rawData");
                        baget.growthFactor.resize(false);
                        buildThePlot(idOfThePlaceToStoreData, filterBasedOnDataSelectionAndDate);
                        //d3.select(window).on('resize', baget.growthFactor.resize);
                        initializeDateSlider (idOfThePlaceToStoreData);
                        baget.growthFactor.resize();
                        setData (idOfThePlaceToStoreData, "dataRetrieved",true);

                    }

                );



            } catch(e){
                console.log('f');
            }
        }


    }




    const initializePageToHoldDisplay  = function (headerSection,sectionSelector, window){

        $(headerSection).prepend(Mustache.render( $('#headerSectionAboveControls')[0].innerHTML,tabHeaderOrganizer));
        _.forEach(tabHeaderOrganizer.topSection[0].headers,function(element){
            $(sectionSelector).append(Mustache.render( $('#tabContainingControlsAndPlot')[0].innerHTML,element));
        });
        d3.select(window).on('resize', baget.growthFactor.resize);
        jQuery.noConflict();
        $('ul.nav-tabs a').on('show.bs.tab', function(event){
            displayPlotRetrievingIfNecessary ($(event.target).attr('href').substring(1));
        });

    }


// public routines are declared below
    return {
        setWidth:setWidtth,
        setHeight:setHeight,
        buildThePlotWithRememberedData:buildThePlotWithRememberedData,
        prepareToDisplay:prepareToDisplay,
        calculateWeightedMovingAverage:calculateWeightedMovingAverage,
        changeWhatIsDisplayed:changeWhatIsDisplayed,
        changeGroupCheckbox:changeGroupCheckbox,
        changeFormOfAnalysis:changeFormOfAnalysis,
        logVersusLinear:logVersusLinear,
        modifyAllCheckboxes:modifyAllCheckboxes,
        collapseToCommonStart:collapseToCommonStart,
        deathsIndependentOfPopulation:deathsIndependentOfPopulation,
        toggleDisplayOfSelectableElements:toggleDisplayOfSelectableElements,
        initializePageToHoldDisplay:initializePageToHoldDisplay
    }

}());
