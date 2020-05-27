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
            displayAdjustmentSlim:"slim",
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
                    methodCallBack:"countingTotalDeaths",
                    title:"Deaths per million"
                }
            ],
            labelAccessors: [   x =>'X axis label',
                                y =>'Y axis label'  ],
            valueAccessors:[   x =>x.x,
                y =>y.y  ],
            textAccessor: d =>d.key,
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
            displayAdjustmentSlim:"slim",
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
                    methodCallBack:"countingTotalDeaths",
                    title:"Deaths per million"
                }
            ],
            labelAccessors: [   x =>'X axis label',
                y =>'Y axis label'  ],
            valueAccessors:[   x =>x.x,
                y =>y.y  ],
            textAccessor: x =>x.key,
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
                    checked: ""

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
            labelAccessors: [   x =>'X axis label',
                y =>'Y axis label'  ],
            valueAccessors:[   x =>x.x,
                y =>y.y  ],
            textAccessor: d =>d.key,
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


    const FILTER_NONE = 0;
    const FILTER_BASED_ON_DATA_SELECTION_AND_DATE= 1;
    const FILTER_ADJUST_LIST_OF_GROUPS_BASED_ON_DATE = 2;
    const FILTER_BASED_ONLY_ON_LIST_OF_GROUPS = 3;
    const FILTER_BASED_ON_ANALYSIS = 4;
    const FILTER_UNWANTED_DATES_FROM_GROUPED_DATA = 5;
    const ONLY_CHANGE_DISPLAY_NO_FILTERING_DATA = 6;


    let [xAxisLabelAccessor,yAxisLabelAccessor] = [x =>'X axis label',
            y =>'Y axis label'];


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


    class DataFromAServer {

        constructor (name,dataUrl,dataAssignmentFunction,rawDataFilter){
            this.name = name;//how should we refer to this data set
            this.dataUrl = dataUrl;//where do we go for the data
            this.dataAssignmentFunction = dataAssignmentFunction;// assigned data fields to names we like
            this.rawDataFilter = rawDataFilter;//filter the raw data before we do anything else
            this.savedData ={};
            this.savedGroupedData ={};
        }
        set rawData (incomingRawData){
            this.savedData = this.rawDataFilter (incomingRawData);
        }
        get rawData (){
            return this.savedData;
        }
        set groupedData (incomingGroupedRawData){
            this.savedGroupedData = incomingGroupedRawData;
        }
        get groupedData (){
            return this.savedGroupedData;
        }

    }


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
        countingTotalDeaths = true;
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
        // }else if( typeof   dataGroupingHolder[fieldName] === 'undefined'){
        //     console.log('unexpected field name = '+fieldName);
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

    const synchronizeDataGroupingWithUi = function (identifier){
        setData (identifier, "labelAccessors",displayOrganizer [identifier][0].labelAccessors);
        setData (identifier, "valueAccessors",displayOrganizer [identifier][0].valueAccessors);
        setData (identifier, "textAccessor",displayOrganizer [identifier][0].textAccessor);
    }
    const adjustAccessors = function (identifier){
        //
        // set the X and Y label on the axes
        //
        const currentAccessors = retrieveData (identifier, "labelAccessors");
        let buildingXAxisLabel = "";
        let buildingYAxisLabel = "";
        if (retrieveData (identifier, "countingTotalDeaths")){
            buildingYAxisLabel += (buildingYAxisLabel.length=== 0)?"Total deaths":"total deaths";
        }else {
            buildingYAxisLabel += (buildingYAxisLabel.length=== 0)?"Deaths per million":"deaths per million";
        }
        if (retrieveData (identifier, "collapseToCommonStart")){
            buildingXAxisLabel = "Days since fifth death";
        }else {
            buildingXAxisLabel = "Date";
        }
        if (!retrieveData (identifier, "useLinearNotLog")){
            buildingYAxisLabel += " (log scale)";
        }
        currentAccessors [0] =  (x =>buildingXAxisLabel);
        currentAccessors [1] =  (y =>buildingYAxisLabel);
        setData(identifier,"labelAccessors", currentAccessors);

        //
        // set the text label that we give to each line on the plot
        //
        if(identifier ==='states') {
            setData(identifier, "textAccessor", function (d,auxData) {
                const conversion = _.find (auxData [0], {'Abbreviation':d.key});
                if( typeof conversion === 'undefined'){
                    return d.key
                }else {
                    return conversion.State;
                }

            });
        }

        //
        // set the values that we will use to access horizontal axis data. Note that we can use to datatypes, either numeric or date
        //
        const currentValueAccessors = retrieveData (identifier, "valueAccessors");
        let buildingXValueAccessor;
        let buildingYValueAccessor;
        if (retrieveData (identifier, "collapseToCommonStart")){
            buildingXValueAccessor = d => +d.x;
        }else {
            buildingXValueAccessor = d => new Date(d.date);
        }
        //
        // set the values that we will use to access vertical axis data.
        //
        if (retrieveData (identifier, "countingTotalDeaths")){
            buildingYValueAccessor = d => +d.y;
        }else {
            if((identifier ==='states')  && (retrieveData(identifier,"auxData").length>0)) {
                buildingYValueAccessor = function (d, auxData) {
                    const auxiliaryRecord = _.find(auxData[0], {Abbreviation: d.key});
                    if ((auxiliaryRecord) && (+auxiliaryRecord.Pop > 0)) {
                        return ((+d.y) * 1000000) / (+auxiliaryRecord.Pop);
                    }else {
                        return (+d.y);
                    }
                };
            }else  {
                buildingYValueAccessor = d =>+d.total_deaths_per_million;
            }
        }
        currentValueAccessors [0] =  buildingXValueAccessor;
        currentValueAccessors [1] =  buildingYValueAccessor;
        setData(identifier,"valueAccessors", currentValueAccessors);

    }

    /***
     * Set up the  moving window spinners
     */
    const setUpMovingWindowSpinner = function (identifier){
        const spinnerAverage = $('#' + identifier+' input.spinner.movingAverageWindow');
        spinnerAverage.spinner({
            step: 2,
            min: 1,
            max: 99,
            spin: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"movingAverageWindow", ui.value);
                buildThePlotWithRememberedData (identifier,FILTER_BASED_ON_ANALYSIS);
            }
        });
        spinnerAverage.spinner( "value", retrieveData(identifier,"movingAverageWindow"));
        const spinnerThreshold = $('#' + identifier+' input.spinner.daysOfNonExponentialGrowthRequired');
        spinnerThreshold.spinner({
            step: 1,
            min: 1,
            max: 100,
            spin: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"daysOfNonExponentialGrowthRequired", ui.value);
                buildThePlotWithRememberedData (identifier,FILTER_BASED_ON_ANALYSIS);
            }
            // ,
            // change: function (event, ui){
            //     const identifier = $(event.target).closest("div.coreObject").attr('id');
            //     setData(identifier,"daysOfNonExponentialGrowthRequired", $(this).spinner('value'));
            //     buildThePlotWithRememberedData (identifier);
            // }

        });
        spinnerThreshold.spinner( "value",  retrieveData(identifier,"daysOfNonExponentialGrowthRequired") );

    };
    const modifyAllCheckboxes = function (callingObject){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const clickAllTheBoxes = $(callingObject).text () === "ALL";
        $('#'+identifier+' div.everyGroupToDisplay div.item input.displayControl').prop("checked", clickAllTheBoxes);
        buildThePlot (identifier,  FILTER_ADJUST_LIST_OF_GROUPS_BASED_ON_DATE);
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
        buildThePlot(identifier,ONLY_CHANGE_DISPLAY_NO_FILTERING_DATA);
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
        buildThePlot(identifier,ONLY_CHANGE_DISPLAY_NO_FILTERING_DATA);
    };
    const countingTotalDeaths= function (callingObject){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const shallWeShowcountingTotalDeaths= $(callingObject).text () === "Total deaths";
        if (shallWeShowcountingTotalDeaths){
            $(callingObject).text ("Deaths per million");
        } else {
            $(callingObject).text ("Total deaths");
        }
        setData(identifier,"countingTotalDeaths", shallWeShowcountingTotalDeaths);
        buildThePlot(identifier,ONLY_CHANGE_DISPLAY_NO_FILTERING_DATA);
    };

    const changeWhatIsDisplayed = function (callingObject,callingObjectId){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        setData(identifier,callingObjectId, callingObjectIsChecked);
        buildThePlot (identifier,FILTER_BASED_ON_DATA_SELECTION_AND_DATE);
    };
    const changeFormOfAnalysis = function (callingObject,callingObjectId){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        setData(identifier,callingObjectId, callingObjectIsChecked);
        buildThePlot (identifier,FILTER_BASED_ON_ANALYSIS);
    };
    const changeGroupCheckbox = function (callingObject, identifier){
        buildThePlot (identifier, FILTER_BASED_ONLY_ON_LIST_OF_GROUPS);
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
            min: startDate.getTime() / 1000,
            max: endDate.getTime() / 1000,
            step: 86400,
            values: [ startDate.getTime() / 1000, endDate.getTime() / 1000 ],
            slide: function( event, ui ) {
                $( currentDateIndicator ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
                setData (identifier, "startDate",new Date(ui.values[ 0 ] *1000));
                setData (identifier, "endDate",new Date(ui.values[ 1 ] *1000));
                buildThePlot (identifier, FILTER_UNWANTED_DATES_FROM_GROUPED_DATA);

            }
        });
        $( currentDateIndicator ).val( (new Date($( currentDateSlider ).slider( "values", 0 )*1000).toDateString()) +
            " - " + (new Date($( currentDateSlider ).slider( "values", 1 )*1000)).toDateString());
    };






    const analysisModule = (function () {
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
        const calculateGrowthFactorByCountry = function (dataByCountry,movingAverageWindow,daysOfNonExponentialGrowthRequired){
            // let dataByCountry = _.map(_.groupBy(data,'code'), (v,k)=>({key:k,values:v}))
            // let dataByCountry =d3.nest() // nest function to group by country
            //     .key(function(d) { return d.code;} )
            //     .entries(data);

            // if X values don't exist then calculate them from the dates
            if (_.filter (dataByCountry,v=>_.filter (v.values,d=>(typeof d.x==='undefined')).length>0).length>0){
                let modifiedDataByCountry = [];
                _.forEach(dataByCountry,function (v, k){
                    const daysSinceFifthDeath = _.filter (v.values,d=>d.y>5);
                    if (daysSinceFifthDeath.length>0){
                        const sortedDaysSinceFifthDeath = _.orderBy (daysSinceFifthDeath,d=>new Date(d.date).getTime());
                        const firstDayAfterFifthDeath = _.first (sortedDaysSinceFifthDeath);
                        const dateAfterFifthDeath = new Date(firstDayAfterFifthDeath.date).getTime()/1000;
                        const dataWithCalculatedXAddedIn = _.map(sortedDaysSinceFifthDeath,function (d){
                            let tempRec = d;
                            tempRec['x']=((new Date(d.date).getTime()/1000)-dateAfterFifthDeath)/86400;
                            return tempRec;
                        });
                        modifiedDataByCountry.push({key:_.first(dataWithCalculatedXAddedIn).key,
                            values:_.uniqBy(dataWithCalculatedXAddedIn,'x')});
                    }
                });
                dataByCountry = modifiedDataByCountry;
            }

            const filterTheDataWeCareAbout = function   (values){return _.filter (values,d=>(d.y>0) &&(d.x>0) )};

            const halfMWindow = Math.floor(movingAverageWindow/2);
            var remainder = movingAverageWindow % 2;
            const growthFactorByCountry = _.map(   dataByCountry,
                function (v){

                    let differenceArray = [];
                    let valuesWeCareAbout =filterTheDataWeCareAbout (v.values);


                    _.forEach(valuesWeCareAbout,  function(value, index){
                        if (valuesWeCareAbout.length < halfMWindow)return true;

                        if ((index > 2) && (index < valuesWeCareAbout.length-2)){
                            const v1 = _.map (_.slice(valuesWeCareAbout, index-halfMWindow,index+halfMWindow-1), o=>o.y);
                            const v2 = _.map (_.slice(valuesWeCareAbout, index-halfMWindow+1,index+halfMWindow), o=>o.y);

                            const n1 = calculateWeightedMovingAverage(v1);
                            const n2 = calculateWeightedMovingAverage(v2);

                            differenceArray.push (
                                {x:valuesWeCareAbout[index].x,
                                    y:valuesWeCareAbout[index].y,
                                    // difference: valuesWeCareAbout[index].y-valuesWeCareAbout[index-1].y,
                                    difference: n2-n1,
                                    key: valuesWeCareAbout[index].key
                                }
                            );
                        }

                    });
                    let growthRateArray = [];
                    _.forEach(differenceArray,function(value, index){
                        if ((index > 0) && (differenceArray[index-1].difference !==0)){
                            growthRateArray.push (
                                {   x:valuesWeCareAbout[index].x,
                                    y:valuesWeCareAbout[index].y,
                                    total_deaths_per_million: valuesWeCareAbout[index].total_deaths_per_million,
                                    growthFactor:differenceArray[index].difference/differenceArray[index-1].difference,
                                    key: valuesWeCareAbout[index].key});
                        }
                    });
                    let analComplete = {inflection: null, noinflection: null  };

                    _.forEach(growthRateArray, function (rate, index){
                        if(index > (daysOfNonExponentialGrowthRequired-1)) {
                            let nonExponentialGrowthFactorMaintained = true;
                            _.forEach(_.range(0,daysOfNonExponentialGrowthRequired), function (windowIndex){
                                if(growthRateArray[index-windowIndex].growthFactor >  1){
                                    nonExponentialGrowthFactorMaintained = false
                                }
                            });
                            if (nonExponentialGrowthFactorMaintained) {
                                analComplete['inflection'] = {
                                    index: index,
                                    x: growthRateArray[index].x,
                                    y: growthRateArray[index].y,
                                    total_deaths_per_million: growthRateArray[index].total_deaths_per_million,
                                    key: valuesWeCareAbout[index].key,
                                    date:_.find(valuesWeCareAbout,d=>d.x===growthRateArray[index].x).date
                                };
                                return false;
                            } else {
                                analComplete['noinflection'] = {
                                    index: index,
                                    x: growthRateArray[index].x,
                                    y: growthRateArray[index].y,
                                    key: valuesWeCareAbout[index].key,
                                    date:_.find(valuesWeCareAbout,d=>d.x===growthRateArray[index].x).date
                                };
                                return true;
                            }
                        } else {
                            return true;
                        }
                    });
                    analComplete ["rawValues"] = valuesWeCareAbout;
                    ;
                    return {key:v.key,
                        values:analComplete}
                });

            _.forEach(dataByCountry, function (v,k) {

                const countryGrowthFactorRecord = _.find (growthFactorByCountry, d => d.key==v.values[0].key);
                if (countryGrowthFactorRecord.values.inflection){
                    countryGrowthFactorRecord.values['type']='inflection';
                }else if ((!countryGrowthFactorRecord.values.inflection) && (countryGrowthFactorRecord.values.noinflection)){
                    countryGrowthFactorRecord.values['type']='noinflection';
                }else {
                    if (countryGrowthFactorRecord.values.rawValues.length === 0){
                        countryGrowthFactorRecord.values['type']='noDataYet';
                    }else {
                        countryGrowthFactorRecord.values['type']='inflectionUndetermined';
                    }

                }

            });
            return growthFactorByCountry;
        };

    return {
            calculateGrowthFactorByCountry:calculateGrowthFactorByCountry
        }
    } ());


    const dateConverterUtil = (function (){

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

        const yyyymmddNoDash = function(dateString) {
            const currentDay = +dateString.substring (6, 8);
            const currentMonth = (+dateString.substring (4, 6))-1;
            const currentYear = +dateString.substring (0, 4);
            const currentDate = new Date (currentYear,currentMonth,currentDay);
            return ""+months[currentDate.getMonth()]+" "+currentDate.getDate()+ ", "+currentDate.getFullYear();

        };
        const yyyymmddDash = function(dateString) {
            const currentDay = +dateString.substring (8, 10);
            const currentMonth = (+dateString.substring (5, 7))-1;
            const currentYear = +dateString.substring (0, 4);
            const currentDate = new Date (currentYear,currentMonth,currentDay);
            return ""+months[currentDate.getMonth()]+" "+currentDate.getDate()+ ", "+currentDate.getFullYear();
        };
        return {
            yyyymmddNoDash:yyyymmddNoDash,
            yyyymmddDash:yyyymmddDash
        }
    }());


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
                orFilterArray.push (datum => !(_.includes (datum.key,'World')));
            }
            if (retrieveData (identifier, "includeSummaryGroups")){
                //the world has a code, though otherwise only countries have codes. Exclude the world specifically from the country search
                orFilterArray.push (datum => !(_.includes ('World')));
            }

            // In this case, if neither or filter is selected then we want the graft be blank. Therefore let's insert a fake and filter which will always fail
            if (orFilterArray.length === 0){
                andFilterArray.push (datum =>false);
            }


            const startDate = retrieveData (identifier, "startDate");
            const globalStartDate = retrieveData (identifier, "globalStartDate");
            const endDate = retrieveData (identifier, "endDate");
            const globalEndDate = retrieveData (identifier, "globalEndDate");
            if ((startDate ===globalStartDate) &&
                (endDate ===globalEndDate)){
                andFilterArray.push (datum =>true);
            }else {

                // andFilterArray.push (datum => (((new Date(datum.date).getTime() / 1000)>=(startDate.getTime() / 1000))  &&
                // ((new Date(datum.date).getTime() / 1000)<=(endDate.getTime() / 1000))));
                andFilterArray.push (function(datum){
                    // if ( typeof datum.values === 'undefined'){
                    //     return (((new Date(datum.date).getTime() / 1000)>=(startDate.getTime() / 1000))  &&
                    //         ((new Date(datum.date).getTime() / 1000)<=(endDate.getTime() / 1000)))
                    // }else {
                        const oneSuitableDate =   _.find(datum.values,
                            data=>(((new Date(data.date).getTime() / 1000)>=(startDate.getTime() / 1000))  &&
                                ((new Date(data.date).getTime() / 1000)<=(endDate.getTime() / 1000))))
                        return ( typeof oneSuitableDate !== 'undefined')
                    // }

                });

            }

            // _.flatten(_.map(groupedData,d=>d.values))


            return andOrFilterModule (orFilterArray,andFilterArray);

        };
        const filterDateAndListOfGroups = function (identifier){

            let andFilterArray = [];
            const textAccessor = retrieveData (identifier, "textAccessor");
            const auxData = retrieveData(identifier,"auxData");
            const selectedGroups = _.map ($("#" + identifier +" div.everyGroupToDisplay input.displayControl:checked").next("label"),d=>$(d).text());
            andFilterArray.push (datum => _.includes (selectedGroups,textAccessor (datum,auxData) ));

            const startDate = retrieveData (identifier, "startDate");
            const endDate = retrieveData (identifier, "endDate");
            andFilterArray.push ( function(datum) {
                const oneSuitableDate = _.find(datum.values,
                    data => (((new Date(data.date).getTime() / 1000) >= (startDate.getTime() / 1000)) &&
                        ((new Date(data.date).getTime() / 1000) <= (endDate.getTime() / 1000))))
                return (typeof oneSuitableDate !== 'undefined')
            }
            );

            return andOrFilterModule ([],andFilterArray);


        };
        const filterOnlyOnListOfGroups = function (identifier){

            let andFilterArray = [];
            const textAccessor = retrieveData (identifier, "textAccessor");
            const auxData = retrieveData(identifier,"auxData");
            const selectedGroups = _.map ($("#" + identifier +" div.everyGroupToDisplay input.displayControl:checked").next("label"),d=>$(d).text());
            andFilterArray.push (datum => _.includes (selectedGroups,textAccessor (datum,auxData) ));
            andFilterArray.push (function (datum ){
                return_.includes (selectedGroups,textAccessor (datum,auxData)
            )});

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

        const filterUnwantedDatesFromGroupedData = function (identifier){
            const startDate = retrieveData (identifier, "startDate");
            const globalStartDate = retrieveData (identifier, "globalStartDate");
            const endDate = retrieveData (identifier, "endDate");
            const globalEndDate = retrieveData (identifier, "globalEndDate");
            if ((startDate ===globalStartDate) &&
                (endDate ===globalEndDate)){
                return function (groupedData) {return groupedData};
            }else {
                return function (groupedData){
                    const revisedGroupData = [];
                    _.forEach(groupedData, function (eachGroup){
                        const dataPointsToSave = [];
                        _.forEach(eachGroup. values, function (eachDataPoint){
                            if(((new Date(eachDataPoint.date).getTime() / 1000)>=(startDate.getTime() / 1000))  &&
                                ((new Date(eachDataPoint.date).getTime() / 1000)<=(endDate.getTime() / 1000))){
                                dataPointsToSave.push (eachDataPoint);
                            }
                        });
                        if (dataPointsToSave.length > 0){
                            revisedGroupData.push ({key:eachGroup, values:dataPointsToSave})
                        }
                    });
                    return revisedGroupData;
                }

            }
        };




        return {
            noFilterAtAll:noFilterAtAll,
            filterBasedOnDataSelectionAndDate:filterBasedOnDataSelectionAndDate,
            filterDateAndListOfGroups:filterDateAndListOfGroups,
            filterOnlyOnListOfGroups:filterOnlyOnListOfGroups,
            filterBasedOnAnalysis:filterBasedOnAnalysis,
            filterUnwantedDatesFromGroupedData:filterUnwantedDatesFromGroupedData
        }
    } ());




    const confirmThereAreNoZerosBeforeALogPlot = function (identifier){
        const linearPlot = retrieveData (identifier, "useLinearNotLog");
        const currentValueAccessors = retrieveData (identifier, "valueAccessors");
        const yValueAccessor = currentValueAccessors[1];
        if (linearPlot){
            return function (groupedData) {return groupedData};
        }else {
            return function (groupedData){
                const revisedGroupData = [];
                const auxData = retrieveData(identifier,"auxData");
                _.forEach(groupedData, function (eachGroup){
                    const dataPointsToSave = [];
                    _.forEach(eachGroup. values, function (eachDataPoint){
                        if (yValueAccessor (eachDataPoint,auxData) <= 0) {
                            if (retrieveData(identifier, "countingTotalDeaths")) {
                                if (identifier === 'country') {
                                    eachDataPoint ['total_deaths_per_million'] = 0.1;
                                } else {
                                    eachDataPoint ['y'] = 1;
                                }
                            }else {
                                eachDataPoint ['y'] = 1;
                            }
                        }
                    });
                });
                return groupedData;
            }
        }
    };





    const fillTheMainEntitySelectionBox = function(identifier,filteredData){

        // const allData = _.first(retrieveData (identifier,"dataFromServerArray")).rawData;
        // const groupedData = _.first(retrieveData (identifier,"dataFromServerArray")).groupedData;

        //let preAnalysisFilter = filterModule.filterBasedOnDataSelectionAndDate (identifier);
        $('#' +identifier +' div.everyGroupToDisplay').empty ();
        const startTheGroup = $('#' +identifier +' div.everyGroupToDisplay');
        const textAccessor = retrieveData (identifier, "textAccessor");
        const auxData = retrieveData(identifier,"auxData");
        let listOfGroups = '<div>';
        _.forEach(_.uniqBy(_.orderBy(filteredData,'key'),'key'),function (v,k){
            listOfGroups+='<div class="item checkboxHolder active">'+
                '<input type="checkbox" class="custom-control-input  displayControl"  checked onclick="mpgSoftware.growthFactorLauncher.changeGroupCheckbox (this,\'' +identifier +'\')">' +
                '<label class="custom-control-label  displayControl" >'+textAccessor(v,auxData)+'</label>'+
                '</div>';
        });
        listOfGroups+='</div>'
        startTheGroup.append(listOfGroups);
        // return preAnalysisFilter;
    };

    const adjustTheMainSelectionBox = function (identifier,filteredData){
        // const allData = _.first(retrieveData (identifier,"dataFromServerArray")).rawData;
        // const groupedData = _.first(retrieveData (identifier,"dataFromServerArray")).groupedData;
        //
        // const preAnalysisFilter = filterModule.filterBasedOnDataSelectionAndDate (identifier);
        // const everyoneWhoMadeItThroughTheTimeFilter = _.map(_.uniqBy(_.orderBy(filteredData,'key'),'key'),function (d) {
        //     return  d.key;
        // });
        const everyoneWhoMadeItThroughTheTimeFilter =_.map(_.orderBy(filteredData,'key'),d=>d.key.key)
        const everybodyInTheExistingList = _.map($('#'+identifier+' div.everyGroupToDisplay div.item label.displayControl'),function (d) {
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



    const buildThePlot= function (identifier, dataFilteringChoice) {
        const allTheDataWeHaveAccumulated = retrieveData (identifier,"dataFromServerArray");
        const allData = _.first(allTheDataWeHaveAccumulated).rawData;
        const groupedData =  _.first(allTheDataWeHaveAccumulated).groupedData;

        const auxData =  _. map (allTheDataWeHaveAccumulated.slice (1,allTheDataWeHaveAccumulated.length), d => d.rawData);
        setData(identifier,"auxData", auxData);
        const idOfThePlaceWhereThePlotGoes  = _.find (tabHeaderOrganizer.topSection[0].headers,o =>o[0].id===identifier )[0].plotGoesHere[0].id;
        let postAnalysisFilter = filterModule.filterBasedOnAnalysis (identifier);
        let preAnalysisFilter;
        adjustAccessors (identifier);
       // const revisedGroupData = confirmThereAreNoZerosBeforeALogPlot (identifier)(groupedData );  //we should only do this once for each data set
        let analysisToPerform = data=>analysisModule.calculateGrowthFactorByCountry (data,
            retrieveData(identifier,'movingAverageWindow'),
            retrieveData(identifier,'daysOfNonExponentialGrowthRequired'));
        let dataAfterPreanalysisFiltering;
        switch (dataFilteringChoice){
            case FILTER_NONE:
                preAnalysisFilter = x=>x;
                dataAfterPreanalysisFiltering = groupedData;
                postAnalysisFilter = x=>x;
                analysisToPerform = x=>x;
            case FILTER_BASED_ON_DATA_SELECTION_AND_DATE:
                preAnalysisFilter = filterModule.filterBasedOnDataSelectionAndDate (identifier)
                dataAfterPreanalysisFiltering = preAnalysisFilter (groupedData);
                fillTheMainEntitySelectionBox(identifier,dataAfterPreanalysisFiltering);
                break;
            case FILTER_ADJUST_LIST_OF_GROUPS_BASED_ON_DATE:
                preAnalysisFilter = filterModule.filterDateAndListOfGroups(identifier);
                dataAfterPreanalysisFiltering = preAnalysisFilter (groupedData);
                adjustTheMainSelectionBox(identifier,dataAfterPreanalysisFiltering);
                break;
            case FILTER_BASED_ONLY_ON_LIST_OF_GROUPS:
                preAnalysisFilter = filterModule.filterDateAndListOfGroups(identifier);
                dataAfterPreanalysisFiltering = preAnalysisFilter (groupedData);
                break;
            case FILTER_BASED_ON_ANALYSIS:
                preAnalysisFilter = filterModule.filterDateAndListOfGroups(identifier);
                postAnalysisFilter = filterModule.filterBasedOnAnalysis (identifier);
                dataAfterPreanalysisFiltering = preAnalysisFilter (groupedData);
                break;
            case FILTER_UNWANTED_DATES_FROM_GROUPED_DATA:
                preAnalysisFilter = filterModule.filterUnwantedDatesFromGroupedData(identifier);
                dataAfterPreanalysisFiltering = preAnalysisFilter (groupedData);
                adjustTheMainSelectionBox(identifier,dataAfterPreanalysisFiltering);
                break;
            case ONLY_CHANGE_DISPLAY_NO_FILTERING_DATA:
                break;
            default:
                alert('data filtering ='+dataFilteringChoice);
                break;
        }

        if (dataFilteringChoice!==ONLY_CHANGE_DISPLAY_NO_FILTERING_DATA) {
            setData (identifier, "mostRecentDisplayableData", postAnalysisFilter (analysisToPerform (confirmThereAreNoZerosBeforeALogPlot (identifier)(dataAfterPreanalysisFiltering))));
        }


        var growthFactorPlot = baget.growthFactor
            .linearNotLog(retrieveData (identifier, "useLinearNotLog"))
            .height (height)
            .width(width)
            .idOfThePlaceToStoreData (identifier)
            .idOfThePlaceWhereThePlotGoes (idOfThePlaceWhereThePlotGoes)
            .movingAverageWindow(retrieveData(identifier,'movingAverageWindow'))
            .daysOfNonExponentialGrowthRequired (retrieveData(identifier,'daysOfNonExponentialGrowthRequired'))
            .collapseToCommonStart (retrieveData(identifier,'collapseToCommonStart'))
            .countingTotalDeaths(retrieveData(identifier,'countingTotalDeaths'))
            .labelAccessors(...retrieveData(identifier,'labelAccessors'))
            .valueAccessors(...retrieveData(identifier,'valueAccessors'))
            .textAccessor (retrieveData(identifier,'textAccessor'))
            .auxData(auxData)
            // .buildGrowthFactorPlot(allData,
            .buildGrowthFactorPlot(retrieveData(identifier,'mostRecentDisplayableData'),
                x=> alert(' should never be called'),
                x=> alert(' should never be called')
            );
    };

    const buildThePlotWithRememberedData = function (identifier){

        buildThePlot (identifier, FILTER_BASED_ON_DATA_SELECTION_AND_DATE);
    }




    const prepareToDisplay = function( identifier, //the name that all of these things will be associated with
                                       arrayOfDataFromServerObjects ) {
        setData (identifier, "dataFromServerArray",arrayOfDataFromServerObjects);
        if (displayOrganizer[identifier][0].tabActive=== "active"){
            displayPlotRetrievingIfNecessary(identifier);
        }

    };

    const displayPlotRetrievingIfNecessary = function(identifier){
        const dataRetrieved = retrieveData  (identifier, "dataRetrieved");
        if (!dataRetrieved){
            const dataFromServerArray = retrieveData (identifier, "dataFromServerArray");

            try{
                Promise.all (_.map (dataFromServerArray,
                        dataFromServer => d3.csv(dataFromServer.dataUrl,dataFromServer.dataAssignmentFunction)))
                .then(
                    function (dataFromAllRemoteCalls){

                        const dataFromServerArray = retrieveData (identifier, "dataFromServerArray");
                        if (dataFromServerArray.length !==dataFromServerArray.length){//sanity check
                            alert ("shouldn't these values always be the same?")
                        }else {
                            _.forEach(dataFromAllRemoteCalls, function (dataToSave, index){
                                dataFromServerArray[index].rawData = dataToSave;
                                if (index === 0){
                                    dataFromServerArray[index].groupedData =  d3.nest() // nest function to group by country
                                        .key(function(d) { return d.key;} )
                                        .entries(dataFromServerArray[index].rawData);
                                }

                            });
                        }

                        //
                        // deal with primary data
                        //
                        const allData = _.first (dataFromServerArray).rawData ;
                        const groupedData = _.first (dataFromServerArray).groupedData ;

                        // Now remember the data that we have, and calculate a universal start date and end date
                        // setData (identifier, "startDate",new Date(_.minBy(allData,d=>new Date(d.date).getTime()).date));
                        // setData (identifier, "endDate",new Date(_.maxBy(allData,d=>new Date(d.date).getTime()).date));
                        const [startDate,endDate]=d3.extent(_.flatten(_.map(groupedData,d=>d.values)), d => new Date(d.date));
                        setData (identifier, "startDate",startDate);
                        setData (identifier, "globalStartDate",startDate);
                        setData (identifier, "endDate",endDate);
                        setData (identifier, "globalEndDate",endDate);

                        initializeDateSlider (identifier);  //we can only do this after we have calculated the date range

                        synchronizeDataGroupingWithUi (identifier);

                        // all preparations are complete. Now we can build the plot
                        buildThePlot(identifier, FILTER_BASED_ON_DATA_SELECTION_AND_DATE);

                        // remember that we've retrieve data, so we don't need to do it again unless specifically requested
                        setData (identifier, "dataRetrieved",true);



                    }
                 );



            } catch(e){
                console.log('f');
            }
        }


    };




    const initializePageToHoldDisplay  = function (headerSection,sectionSelector, window){

        $(headerSection).prepend(Mustache.render( $('#headerSectionAboveControls')[0].innerHTML,tabHeaderOrganizer));
        _.forEach(tabHeaderOrganizer.topSection[0].headers,function(element){
            $(sectionSelector).append(Mustache.render( $('#tabContainingControlsAndPlot')[0].innerHTML,element));
            setData (element [0].id, "dataRetrieved",false);// note that we have no data, since we just built the display
            baget.growthFactor.resize(false);
            setUpMovingWindowSpinner (element [0].id);
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
        dateConverterUtil:dateConverterUtil,
        DataFromAServer:DataFromAServer,
        analysisModule:analysisModule,
        buildThePlotWithRememberedData:buildThePlotWithRememberedData,
        prepareToDisplay:prepareToDisplay,
        changeWhatIsDisplayed:changeWhatIsDisplayed,
        changeGroupCheckbox:changeGroupCheckbox,
        changeFormOfAnalysis:changeFormOfAnalysis,
        logVersusLinear:logVersusLinear,
        modifyAllCheckboxes:modifyAllCheckboxes,
        collapseToCommonStart:collapseToCommonStart,
        countingTotalDeaths:countingTotalDeaths,
        toggleDisplayOfSelectableElements:toggleDisplayOfSelectableElements,
        initializePageToHoldDisplay:initializePageToHoldDisplay
    }

}());
