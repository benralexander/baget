var baget = baget || {};  // encapsulating variable

baget.growthFactor = (function () {
    let x;
    let y;
    let xAxis;
    let yAxis;
    let height;
    let width;
    let margin = ({top: 100, right: 50, bottom: 35, left: 60});
    let growthFactorByCountry;
    let color ;
    let countryColorObject;
    let linearNotLog= true;
    let idOfThePlaceToStoreData;
    let instance = {};


    function halo(text) {
        text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 4)
            .attr("stroke-linejoin", "round");
    };
    function length(path) {
        return d3.create("svg:path").attr("d", path).node().getTotalLength();
    };
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
    let line;
    let path;


    function hover(svg, topLevelSvg) {

        const shiftPopUpMessage = 20;

        if ("ontouchstart" in document) svg
            .style("-webkit-tap-highlight-color", "transparent")
            .on("touchmove", moved)
            .on("touchstart", entered)
            .on("touchend", left)
        else svg
            .on("mousemove", moved)
            .on("mouseenter", entered)
            .on("mouseleave", left);

        const createInflectionPointPopUp = function(topLevelSvg,originatingObjectData, chooseValueFunction, title) {
            const labelHolder = topLevelSvg.selectAll("g.countryInflectionLabelHolder")
                .data([originatingObjectData.values]);

            labelHolder.enter()
                .append("g")
                .attr("class", "countryInflectionLabelHolder")
                .append("rect")
                .attr("x", function(d,i){
                    return x(chooseValueFunction (d).x)+shiftPopUpMessage-5;
                })
                .attr("y", function(d,i){
                    return y(chooseValueFunction (d).y)-shiftPopUpMessage-5;
                })
                .attr("width", 190)
                .attr("height", 43+(("Inflection point detected"===title)? 13:0) )
                .attr("fill", 'white')
            ;
            labelHolder
                .attr("x", function(d,i){
                    return x(chooseValueFunction (d).x)+shiftPopUpMessage-5;
                })
                .attr("y", function(d,i){
                    return y(chooseValueFunction (d).y)-shiftPopUpMessage-5;
                })
            labelHolder.exit()
                .remove ();

            const popUpLabelHolder = labelHolder.selectAll("text.countryInflectionLabel")
                .data([originatingObjectData.values]);

            const developingPopUpInformation  = popUpLabelHolder.enter()
                .append("text")
                .attr("class", "countryInflectionLabel titleLine")
                .attr("text-anchor", "last")
                .attr("alignment-baseline", "hanging")
                .attr("x", function(d,i){
                    return x(chooseValueFunction (d).x)+shiftPopUpMessage;
                })
                .attr("y", function(d,i){
                    return y(chooseValueFunction (d).y)-shiftPopUpMessage;
                })
                .text(function(d,i){
                    return title;
                })
                .append('tspan')
                .attr("class", "countryInflectionLabel")
                .attr("alignment-baseline", "hanging")
                .attr('dy', '1.2em')
                .attr("x", d=>x(chooseValueFunction (d).x)+shiftPopUpMessage)
                .text( d =>"in "+chooseValueFunction (d).countryName+' by day '+chooseValueFunction (d).x)
                .append('tspan')
                .attr("class", "countryInflectionLabel")
                .attr("alignment-baseline", "hanging")
                .attr('dy', '1.2em')
                .attr("x", function(d,i){
                    return x(chooseValueFunction (d).x)+shiftPopUpMessage;
                })
                .text( function(d,i){return "("+chooseValueFunction (d).date+")"});
            if ("Inflection point detected"===title){
                developingPopUpInformation
                    .append('tspan')
                    .attr("class", "countryInflectionLabel")
                    .text( function(d,i){return "eventual deaths predicted: "+(chooseValueFunction (d).y*2)})
                    .attr("alignment-baseline", "hanging")
                    .attr('dy', '1.2em')
                    .attr("x", function(d,i){
                        return x(chooseValueFunction (d).x)+shiftPopUpMessage;
                    });
            }
            popUpLabelHolder.exit()
                .remove ();

        };





        function moved() {
            d3.event.preventDefault();
            const ym = y.invert(d3.event.layerY);
            const xm = x.invert(d3.event.layerX);

            var coords = d3.mouse(this);
            // Normally we go from data to pixels, but here we're doing pixels to data
            var newData= {
                x: Math.round( x.invert(coords[0])),  // Takes the pixel number to convert to number
                y: Math.round( y.invert(coords[1]))
            };

            const circleToDescribe = d3.select(this).datum();
            // const classList = circleToDescribe
            //     .attr("class");
            // if (classList){
            //     const countryCode = classList.split (" ");
            //     if (countryCode.length > 1){
            //         let ountryRecord =  _.filter (growthFactorByCountry,
            //             function(element){
            //             return ((element.values.inflection)&&(element.values.inflection.code ===countryCode [0]))
            //         }
            //         );
            //         if (ountryRecord.length > 0){
            //             createInflectionPointPopUp (topLevelSvg,ountryRecord, d => d.inflection, "Inflection point detected" );
            //
            //         }else {
            //             let bestNoninflectionPoint =  _.filter (growthFactorByCountry,
            //                 function(element){
            //                     return ((element.values.noinflection)&&(element.values.noinflection.code ===countryCode [0]))
            //                 }
            //             );
            //             createInflectionPointPopUp(topLevelSvg,bestNoninflectionPoint,d => d.noinflection, "No inflection detected");
            //         }
            //     }
            // }
            if(circleToDescribe.values.inflection){
                createInflectionPointPopUp (topLevelSvg,circleToDescribe, d => d.inflection, "Inflection point detected" );
            }else {
                createInflectionPointPopUp(topLevelSvg,circleToDescribe,d => d.noinflection, "No inflection detected");
            }
        }

        function entered() {
          //  dotHolder.attr("display", null);
        }

        function left() {
            topLevelSvg.selectAll("g.countryInflectionLabelHolder")
                .data([])
                .exit()
                .remove();
        }
    };

    instance.resize = function () {
        width = widthAdjuster()- margin.left - margin.right;
        height = heightAdjuster() - margin.top - margin.bottom;
        mpgSoftware.growthFactorLauncher.buildThePlotWithRememberedData (idOfThePlaceToStoreData);

    };


const calculateGrowthFactorByCountry = function (data){

    let dataByCountry =d3.nest() // nest function to group by country
        .key(function(d) { return d.countryName;} )
        .entries(data);
    // additional processing by state
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
            modifiedDataByCountry.push({key:_.first(dataWithCalculatedXAddedIn).code,
                values:_.uniqBy(dataWithCalculatedXAddedIn,'x')});
        }
    });
    dataByCountry = modifiedDataByCountry;

    const filterTheDataWeCareAbout = function (values){return _.filter (values,d=>(d.y>0) &&(d.x>0) )};
    growthFactorByCountry = _.map(   dataByCountry,
        function (v){

            let differenceArray = [];
            let valuesWeCareAbout =filterTheDataWeCareAbout (v.values);


            _.forEach(valuesWeCareAbout,  function(value, index){
                if (valuesWeCareAbout.length < 2)return true;

                    if ((index > 2) && (index < valuesWeCareAbout.length-2)){
                    const v1 = _.map (_.slice(valuesWeCareAbout, index-2,index+1), o=>o.y);
                    const v2 = _.map (_.slice(valuesWeCareAbout, index-1,index+2), o=>o.y);

                    const n1 = mpgSoftware.growthFactorLauncher.calculateWeightedMovingAverage(v1);
                    const n2 = mpgSoftware.growthFactorLauncher.calculateWeightedMovingAverage(v2);

                    differenceArray.push (
                        {x:valuesWeCareAbout[index].x,
                            y:valuesWeCareAbout[index].y,
                            // difference: valuesWeCareAbout[index].y-valuesWeCareAbout[index-1].y,
                            difference: n2-n1,
                            code: valuesWeCareAbout[index].code,
                            countryName: valuesWeCareAbout[index].countryName}
                    );
                }

            });
            let growthRateArray = [];
            _.forEach(differenceArray,function(value, index){
                if ((index > 0) && (differenceArray[index-1].difference !==0)){
                    growthRateArray.push (
                        {   x:valuesWeCareAbout[index].x,
                            y:valuesWeCareAbout[index].y,
                            growthFactor:differenceArray[index].difference/differenceArray[index-1].difference,
                            code: valuesWeCareAbout[index].code,
                            countryName: valuesWeCareAbout[index].countryName});
                }
            });
            let analComplete = {inflection: null, noinflection: null  };
            const numberOfDays = 3;
            _.forEach(growthRateArray, function (rate, index){
                if(index > (numberOfDays-1)) {
                    if ((growthRateArray[index].growthFactor<= 1) &&
                        (growthRateArray[index-1].growthFactor <= 1)&&
                        (growthRateArray[index-2].growthFactor <= 1)) {
                        analComplete['inflection'] = {
                            index: index,
                            x: growthRateArray[index].x,
                            y: growthRateArray[index].y,
                            code: valuesWeCareAbout[index].code,
                            countryName: valuesWeCareAbout[index].countryName,
                            date:_.find(valuesWeCareAbout,d=>d.x===growthRateArray[index].x).date
                        };
                        return false;
                    } else {
                        analComplete['noinflection'] = {
                            index: index,
                            x: growthRateArray[index].x,
                            y: growthRateArray[index].y,
                            code: valuesWeCareAbout[index].code,
                            countryName: valuesWeCareAbout[index].countryName,
                            date:_.find(valuesWeCareAbout,d=>d.x===growthRateArray[index].x).date
                        };
                        return true;
                        l            }
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
        // if (v.values[0].code.length===0){
        //     v['type']='noncountry';
        // }else {
            const countryGrowthFactorRecord = _.find (growthFactorByCountry, d => d.key==v.values[0].countryName);
            if (countryGrowthFactorRecord.values.inflection){
                countryGrowthFactorRecord.values['type']='inflection';
                // countryGrowthFactorRecord.values['type']='inflection';
            }else if ((!countryGrowthFactorRecord.values.inflection) && (countryGrowthFactorRecord.values.noinflection)){
                countryGrowthFactorRecord.values['type']='noinflection';
            }else {
                if (countryGrowthFactorRecord.values.rawValues.length === 0){
                    countryGrowthFactorRecord.values['type']='noDataYet';
                }else {
                    countryGrowthFactorRecord.values['type']='inflectionUndetermined';
                }

            }
        // }
    });
    return growthFactorByCountry;
}

    const initializeCountryColoring = function (unfilteredData) {
         color = d3.scaleOrdinal(d3.schemeCategory10);
         countryColorObject = {};
        _.forEach(_.uniq(unfilteredData,'countryName'), d=>countryColor(d.countryName));
    } ;

    const countryColor = function (countryColorString){
        if ( typeof countryColorObject [countryColorString] !== 'undefined'){
            return countryColorObject [countryColorString];
        }else {
            return color ((countryColorString.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0) ) % 10);
        }
    };





    instance.buildGrowthFactorPlot = function (unfilteredData,
                                            preAnalysisFilter,
                                            postAnalysisFilter ) {
        const transitionTime = 1500;
        if (!linearNotLog) { // log functions prefer values > 0
            _.forEach(unfilteredData, function (rec) {
                if(rec.y<=0){
                    rec["y"] = 1;
                }
            })
        }
        initializeCountryColoring(unfilteredData);

        const data = preAnalysisFilter (unfilteredData);


        const growthFactorByCountry = postAnalysisFilter(calculateGrowthFactorByCountry (data));

        x = d3.scaleLinear()
            .domain(d3.extent(_.flatten(_.map(growthFactorByCountry,d=>d.values.rawValues)), d => +d.x)).nice()
            .range([margin.left, width - margin.right]);
        let [yLower,yUpper] = d3.extent(_.flatten(_.map(growthFactorByCountry,d=>d.values.rawValues)), d => +d.y);
        if (linearNotLog){
            y = d3.scaleLinear()
                .domain([yLower,yUpper]).nice()
                .range([height - margin.bottom, margin.top]);
        }else {
            y = d3.scaleLog()
                .domain([yLower,yUpper]).nice()
                .range([height - margin.bottom, margin.top]);
        }

        const timeParse = d3.timeParse("%b %e, %Y");
        const dateExtent = d3.extent(data, function(d){
            return timeParse(d.date);
        });




        xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", -height+margin.top)
                .attr("stroke-opacity", 0.1));

        yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, ".2f"))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1));

        var dynamicLineSelection = d3.select("#growthFactorPlot");

        dynamicLineSelection.selectAll("svg.growthFactorPlot")
            .data ([1])
            .enter()
            .append("svg")
            .attr("class","growthFactorPlot")
            .attr("viewBox", [0, 0, width, height]);
        const svg = dynamicLineSelection.select("svg.growthFactorPlot");

        xAxisRevise = g => g
            .call(d3.axisBottom(x).ticks(width / 80))
            .call(g => g.selectAll(".tick line")
                .attr("y2", -height+margin.top)
                .attr("stroke-opacity", 0.1));
        yAxisRevise = g => g
            .call(d3.axisLeft(y).ticks(null, ".2f"))
            .call(g => g.selectAll(".tick line")
                .attr("x2", width)
                .attr("stroke-opacity", 0.1));


            // build the axes
        const xaxis = svg.selectAll("g.xaxis").data([1]);

        xaxis.enter()
            .append("g")
            .attr("class",'xaxis')
            .call(xAxis);
        xaxis.transition().duration (transitionTime)
            .call(xAxisRevise);


        const yaxis = svg.selectAll("g.yaxis").data([1]);
        yaxis.enter()
            .append("g")
            .attr("class",'yaxis')
            .call(yAxis);
        yaxis
            .transition().duration (transitionTime)
            .call(yAxisRevise);

        // text label across the top of the plot
        const dateFormat = d3.timeFormat("%B %d, %Y");
        const printDateRange=svg
            .selectAll("text.describeDateRangeOfData")
            .data([dateExtent]);
        printDateRange.enter()
            .append("text")
            .attr("class", 'describeDateRangeOfData')
            .attr("x", function(d,i){
                return ((width-margin.right-margin.left)/5)*i;
            })
            .attr("y", 30)
            .text(function(d){
                return "data covers period from "+ dateFormat (d[0])+ " to "+ dateFormat (d[1]) +".";
            });
        printDateRange.transition().duration (transitionTime)
            .text(function(d){
                return "data covers period from "+ dateFormat (d[0])+ " to "+ dateFormat (d[1]) +".";
            });
        printDateRange.exit()
            .remove();

        // data lines for each country or category
        path =svg.selectAll("path.dataLine")
            .data(growthFactorByCountry,d=>d.key);

        path.enter()
            .append("path")
            .attr("class", d => (((d.values.rawValues[0].code.length> 0)? "countryLine":"categoryLine") + " dataLine "+d.type))
            .attr("fill", "none")
            .attr("stroke", function(d){ return countryColor(d.key) })
            .attr("stroke-width", 1)
            .attr("d", function(d,k){
                return d3.line()
                    .x(function(d) { return x(0); })
                    .y(function(d) { return y(yLower); })
                    (d.values.rawValues)
            })
            .transition().duration (transitionTime)
            .attr("d", function(d,k){
                return d3.line()
                    .x(function(d) { return x(+d.x); })
                    .y(function(d) { return y(+d.y); })
                    (d.values.rawValues)
            });

        path.transition().duration (transitionTime)
            .attr("d", function(d,k){
                return d3.line()
                    .x(function(d) { return x(+d.x); })
                    .y(function(d) { return y(+d.y); })
                    (d.values.rawValues)
            });

        path.exit()
            .remove();

        // data line label for each country or category
        const dataLineLabel = svg.selectAll("text.countryLabel")
            .data(growthFactorByCountry,d=>d.key);
        dataLineLabel.enter()
            .append("text")
           // .merge(dataLineLabel)
            .attr("class", d => "countryLabel ")
            .attr("text-anchor", "last")
            .text(function(d,i){
                return d.key;
            })
            .attr("x", function(d,i){
                return x(0);
            })
            .attr("y", function(d,i){
                return y(yLower);
            })
            .transition().duration (transitionTime)
            .attr("x", function(d,i){
                return x(_.last(d.values.rawValues,'x').x);
            })
            .attr("y", function(d,i){
                return y(_.last(d.values.rawValues,'y').y);
            });

        dataLineLabel.transition().duration (transitionTime)
            .attr("x", function(d,i){
                return x(_.last(d.values.rawValues,'x').x);
            })
            .attr("y", function(d,i){
                return y(_.last(d.values.rawValues,'y').y);
            })

        dataLineLabel.exit()
            .remove();

        // inflection point for each line, if it exists
        const inflectionPoint = svg.selectAll("circle.inflectionPoint")
            .data(_.filter (growthFactorByCountry,function(o){return o.values.inflection}),d=>d.key);
        inflectionPoint.enter()
            .append("circle")
            .attr("class",  d => d.values.inflection.code+" inflectionPoint "+d.type)
            .attr("r", 4)
            .attr("fill", function(d){ return countryColor(d.key) })
            .attr("stroke", 'black')
            .attr("stroke-width", 1)
            .attr("cx", d => x(0))
            .attr("cy", d => y(yLower))
            .transition().duration (transitionTime)
            .attr("cx", d => x(d.values.inflection.x))
            .attr("cy", d => y(d.values.inflection.y));
        inflectionPoint.transition().duration (transitionTime)
            .attr("cx", d => x(d.values.inflection.x))
            .attr("cy", d => y(d.values.inflection.y));
        inflectionPoint.exit()
            .remove()
        ;

        // a point to describe lack of inflection
        const noinflectionPoint = svg.selectAll("circle.noinflection")
            .data(_.filter (growthFactorByCountry,function(o){return ((o.values.noinflection)  && (!o.values.inflection))})
                ,d=>d.key);
        noinflectionPoint.enter()
            .append("circle")
            .attr("class",  d => d.values.noinflection.code+" noinflection "+d.type)
            .attr("r", 3)
            .attr("fill", function(d){ return countryColor(d.key) })
            .attr("cx", d => x(0))
            .attr("cy", d => y(yLower))
            .transition().duration (transitionTime)
            .attr("cx", d => x(d.values.noinflection.x))
            .attr("cy", d => y(d.values.noinflection.y));
        noinflectionPoint.transition().duration (transitionTime)
            .attr("cx", d => x(d.values.noinflection.x))
            .attr("cy", d => y(d.values.noinflection.y))
        noinflectionPoint.exit()
            .remove();

        // label the axes
        svg.append("text")
            .attr("class", "axisLabel")
            .attr("text-anchor", "middle")
            .attr("x", function(d,i){
                return (width-margin.right-margin.left)/2;
            })
            .attr("y", height-2 )
            .text('Days since 5th death');
        svg.append("text")
            .attr("class", "axisLabel")
            .attr("text-anchor", "middle")
            .attr("x", 10 )
            .attr("y", ((height-margin.top-margin.bottom)/2)+50 )
            .attr("transform", function(d) {
                return "rotate(-90,10,"+(((height-margin.top-margin.bottom)/2)+50) +")"
            })
            .text('Total deaths');



        svg.selectAll("circle.inflectionPoint").call(hover, svg);
        svg.selectAll("circle.noinflection").call(hover, svg);




        return instance;



    };

    instance.linearNotLog= function (x) {
        if (!arguments.length) return linearNotLog;
        linearNotLog = x;
        return instance;
    };

    instance.height= function (x) {
        if (!arguments.length) return height;
        height = x;
        return instance;
    };

    instance.width= function (x) {
        if (!arguments.length) return width;
        width = x;
        return instance;
    };
    instance.idOfThePlaceToStoreData= function (x) {
        if (!arguments.length) return idOfThePlaceToStoreData;
        idOfThePlaceToStoreData = x;
        return instance;
    };



    return instance;
    // return {
    //     resize:resize,
    //     buildGrowthFactorPlot: buildGrowthFactorPlot
    // }
})();
