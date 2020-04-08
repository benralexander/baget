var mpgSoftware = mpgSoftware || {};




mpgSoftware.growthFactorLauncher = (function () {

    const priorAllelicVariance =  0.042;

    var widthAdjuster = function ()  {
        var returnValue;
        var browserWidth =   $(window).width();
        returnValue = (browserWidth > 200) ?  browserWidth : 200;
        returnValue = (returnValue < 1000) ?  returnValue : 1000;
        return   returnValue;
    }
    var heightAdjuster = function ()  {
        var returnValue;
        var browserHeight =   $(window).height()-3200;
        returnValue = (browserHeight > 300) ?  browserHeight : 350;
        returnValue = (returnValue < 1000) ?  returnValue : 1000;
        return   returnValue;
    }


    var margin = {top: 30, right: 20, bottom: 50, left: 70},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        sliderOnScreenTop = 10,
        sliderOnScreenBottom = 200;


    var qqPlot;

    var width = 960,
        height = 500;

    var chart = d3.select("#manhattanPlot1")
        .attr("width", width)
        .attr("height", height);

    const calculatePositionMultipliers = function (length){

        return _.fill(Array(length), 1);
    }


const calculateWeightedMovingAverage = function (dataVector){
    const vectorLength = dataVector.length;
    const positionMultipliers = calculatePositionMultipliers (vectorLength);
    let developingAverage = 0;
    _.forEach(dataVector, function (element, index){
        developingAverage += (element*positionMultipliers [index]);
    });
return developingAverage /vectorLength;
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
                    var growthFactorPlot = baget.growthFactor.buildGrowthFactorPlot(_.filter(allData,function (o){
                        return (o.x)
                            && (!_.startsWith(o.countryName,'World'))
                            && (o.countryName!=='Europe')
                            && (o.countryName!=='North America')}));
                    // d3.select(window).on('resize', baget.growthFactor.resize);
                }

            );

            // var promise =  $.ajax({
            //     cache: false,
            //     type: "post",
            //     url: dataUrl,
            //     data: { },
            //     async: true
            // });
            // const priorAllelicVariance = priorAllelicVarianceVar || 0.0462;
            // promise.done(
            //     function (dataForGene) {
            //         var dynaline = baget.growthFactor.buildGrowthFactorPlot(arrayOfPlotElements,dataForGene);
            //         d3.select(window).on('resize', baget.growthFactor.resize);
            //     }
            //
            // );

        } catch(e){
            console.log('f');
        }
    }


// public routines are declared below
    return {
        prepareDisplay:prepareDisplay,
        calculateWeightedMovingAverage:calculateWeightedMovingAverage
    }

}());
