var mpgSoftware = mpgSoftware || {};




mpgSoftware.growthFactorLauncher = (function () {


    let height = 600;
    let width = 1000;
    // let startDate = new Date ();
    // let endDate = new Date ();


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
         showCountries =  true;
         showCombinations =  false;
         showCategories =  false;
         useLinearNotLog = true;
         rememberData = [];
         height = 600;
         width = 1000;
         startDate = new Date ();
         endDate = new Date ();
        movingAverageWindow = 5;
        daysOfNonExponentialGrowthRequired = 4;
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

    const setUpInteractiveDisplay = function (){
        const spinnerAverage1 = $('#country input.spinner.movingAverageWindow');
        spinnerAverage1.spinner({
            step: 2,
            min: 1,
            max: 99,
            stop: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"movingAverageWindow", spinnerAverage1.val ());
                buildThePlotWithRememberedData (identifier);
            }
        });
        spinnerAverage1.spinner( "value", 5 );
        const spinnerAverage = $('#states input.spinner.movingAverageWindow');
        spinnerAverage.spinner({
            step: 2,
            min: 1,
            max: 99,
            stop: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"movingAverageWindow", spinnerAverage.val ());
                buildThePlotWithRememberedData (identifier);
            }
        });
        spinnerAverage.spinner( "value", 5 );
        const spinnerThreshold1 = $('#country input.spinner.daysOfNonExponentialGrowthRequired');
        spinnerThreshold1.spinner({
            step: 1,
            min: 1,
            max: 100,
            stop: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"daysOfNonExponentialGrowthRequired",spinnerThreshold1.val());
                buildThePlotWithRememberedData (identifier);
            }

        });
        spinnerThreshold1.spinner( "value", 7 );
        const spinnerThreshold = $('#states input.spinner.daysOfNonExponentialGrowthRequired');
        spinnerThreshold.spinner({
            step: 1,
            min: 1,
            max: 100,
            stop: function (event, ui){
                const identifier = $(event.target).closest("div.coreObject").attr('id');
                setData(identifier,"daysOfNonExponentialGrowthRequired", spinnerThreshold.val());
                buildThePlotWithRememberedData (identifier);
            }

        });
        spinnerThreshold.spinner( "value", 7 );

    }


    const logVersusLinear= function (callingObject){
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        const callingObjectCoreParents = $(callingObject).closest("div.coreObject");
        setData(callingObjectCoreParents.attr('id'),"useLinearNotLog", callingObjectIsChecked);
        // useLinearNotLog = callingObjectIsChecked;
        buildThePlotWithRememberedData (callingObjectCoreParents.attr('id'));
    };
    const changeWhatIsDisplayed = function (callingObject){
        const identifier = $(callingObject).closest("div.coreObject").attr('id');
        const callingObjectId = $(callingObject).attr('id');
        const callingObjectIsChecked = $(callingObject).prop("checked") === true;
        if (callingObjectId==="includeCountries"){
            setData(identifier,"showCountries", callingObjectIsChecked);
        }else if (callingObjectId==="includeCategories"){
            setData(identifier,"showCategories", callingObjectIsChecked);
         }else if (callingObjectId==="includeCombinations"){
            setData(identifier,"showCombinations", callingObjectIsChecked);
        }else if (callingObjectId==="includeInflectedCountries" ){
            setData(identifier,"showGroupsWithInflectionPoints", callingObjectIsChecked);
        }else if (callingObjectId==="includeNotInflectedCountries"){
            setData(identifier,"showGroupsWithoutInflectionPoints", callingObjectIsChecked);
        }else if (callingObjectId==="includeNotInflectedStates"){
            setData(identifier,"showGroupsWithoutInflectionPoints", callingObjectIsChecked);
        }else if (callingObjectId==="includeInflectedStates" ){
            setData(identifier,"showGroupsWithInflectionPoints", callingObjectIsChecked);
        }else if (callingObjectId==="includeNewAdditions"){


        }
        buildThePlotWithRememberedData (identifier);
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


    const preFilterToGenerateListOfGroups = function (identifier){
        let orFilterArray = [];
        let andFilterArray = [];
       if (retrieveData (identifier, "showCountries")){
            //the world has a code, though otherwise only countries have codes. Exclude the world specifically from the country search
            orFilterArray.push (datum => (datum.code.length > 0) &&
                (!(datum.countryName.search('World')>=0))
            );
        }
        if (retrieveData (identifier, "showCategories")){
            orFilterArray.push (datum => datum.code.length === 0);
        }
        if (retrieveData (identifier, "showCombinations")){
            orFilterArray.push (datum => ((datum.countryName.search('World')>=0)||
                (datum.countryName.search('Europe')>=0)||
                (datum.countryName.search('Asia')>=0)));
        }

        const startDate = retrieveData (identifier, "startDate");
        const endDate = retrieveData (identifier, "endDate");
        andFilterArray.push (datum => (((new Date(datum.date).getTime() / 1000)>=(new Date(startDate).getTime() / 1000))  &&
            ((new Date(datum.date).getTime() / 1000)<=(new Date(endDate).getTime() / 1000))));

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

    };
    const filterOnlyOnListOfGroups = function (identifier){

        let andFilterArray = [];
        const selectedGroups = _.map ($("#" + identifier +" div.everyGroupToDisplay input.displayControl:checked").next("label"),d=>$(d).text());
        andFilterArray.push (datum => _.includes (selectedGroups,datum.countryName ));

        const startDate = retrieveData (identifier, "startDate");
        const endDate = retrieveData (identifier, "endDate");
        andFilterArray.push (datum => (((new Date(datum.date).getTime() / 1000)>=(new Date(startDate).getTime() / 1000))  &&
            ((new Date(datum.date).getTime() / 1000)<=(new Date(endDate).getTime() / 1000))));

        return function(data){
            return _.filter (data, function (oneRec){
                let finalAnswer = true;
                // first OR together attributes of things that we want to include

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


    };
    const filterBasedOnAnalysis = function (identifier){
        return function (data){
            if (retrieveData (identifier, "showGroupsWithInflectionPoints")&&
                !retrieveData (identifier, "showGroupsWithoutInflectionPoints")){
                return _.filter (data, datum => datum.values.type == 'inflection')
            } else if (!retrieveData (identifier, "showGroupsWithInflectionPoints")&&
                retrieveData (identifier, "showGroupsWithoutInflectionPoints")){
                return _.filter (data, datum => datum.values.type == 'noinflection')
            }else if (retrieveData (identifier, "showGroupsWithInflectionPoints")&&
                retrieveData (identifier, "showGroupsWithoutInflectionPoints")){
                return _.filter (data, datum => (datum.values.type == 'noinflection')||(datum.values.type == 'inflection'))
            }else if (!retrieveData (identifier, "showGroupsWithInflectionPoints")&&
                !retrieveData (identifier, "showGroupsWithoutInflectionPoints")){
                return _.filter (data, datum => datum.values.type === 'inflectionUndetermined')

            }

        }
    };





    const buildThePlot= function (idOfThePlaceToStoreData, initialize) {

        const allData = retrieveData (idOfThePlaceToStoreData,"rawData");
        const idOfThePlaceWhereThePlotGoes = retrieveData(idOfThePlaceToStoreData,'idOfThePlaceWhereThePlotGoes');
        const postAnalysisFilter = filterBasedOnAnalysis (idOfThePlaceToStoreData);
        let preAnalysisFilter;
        if (initialize){//pre-filter, and then update the list of groups
            preAnalysisFilter = preFilterToGenerateListOfGroups (idOfThePlaceToStoreData);
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
            preAnalysisFilter = filterOnlyOnListOfGroups(idOfThePlaceToStoreData);

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

        buildThePlot (idOfThePlaceToStoreData);
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
        logVersusLinear:logVersusLinear
    }

}());
