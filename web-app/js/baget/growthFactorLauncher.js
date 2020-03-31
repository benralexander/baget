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




    const priorPosteriorArray = function(beta,se, priorAllelicVariance){
        const variance = se*se;
        const multiplier =  Math.sqrt(variance / (variance+priorAllelicVariance));
        const numerator = priorAllelicVariance*beta*beta;
        const denominator = (2*variance)*(variance+priorAllelicVariance);
        const bayesFactor = multiplier * Math.exp(numerator/denominator);
        const rangeOfPossiblePriors = _.map(_.range(101),function(rangeElement){return rangeElement/100.0});
        return _.map(rangeOfPossiblePriors,function(prior){
            let posterior;
            if (prior<1) {
                const po = (prior/(1-prior))*bayesFactor;
                posterior = po/(1+po);
            } else {
                posterior = 1;
            }
            po = (prior/(1-prior))*bayesFactor;
            return {x:prior,
                y:posterior,
                name:'',
                orient:'bottom'};
        });
    }



    const prepareDisplay = function(dataUrl,  window){
        try{
            const countryData = d3.csv(dataUrl,

                function(d) {
                    return {countryName: d["Entity"],
                            code: d["Code"],
                            date: d["Date"],
                    y:d ["Total confirmed deaths due to COVID-19 (deaths)"],
                    x:d ["Days since the total confirmed deaths of COVID-19 reached 5"]};
                    }

                );
            countryData.then(
                function (allData) {
                    var growthFactorPlot = baget.growthFactor.buildGrowthFactorPlot(_.filter(allData,'x'));
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
        prepareDisplay:prepareDisplay
    }

}());
