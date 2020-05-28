var baget = baget || {};  // encapsulating variable

baget.growthFactor = (function () {
    let x;
    let y;
    let xAxis;
    let yAxis;
    let height;
    let width;
    let margin = ({top: 100, right: 50, bottom: 35, left: 60});
    let color ;
    let countryColorObject; // remember what colors we're using for each line
    let linearNotLog= true;
    let idOfThePlaceToStoreData;
    let idOfThePlaceWhereThePlotGoes;
    let instance = {};
    let movingAverageWindow = 5;
    let daysOfNonExponentialGrowthRequired = 4;
    let collapseToCommonStart = true;
    // let xAxisLabel = "Days cents fifth death";
    // let yAxisLabel = "Total deaths";
    let countingTotalDeaths;
    let auxData = [];
    let [xValueAccessor,yValueAccessor] = [x =>x.x,y =>y.y];
    let [xAxisLabelAccessor,yAxisLabelAccessor] = [x =>'no X axis label',y =>'no Y axis label'];
    let [xTextAccessor,yTextAccessor] = [x =>'no X text accessor',y =>'no Y text accessor'];
    let textAccessor = function (x){return x};


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
    // let line;
    let path;

    const highlight = function (svg, topLevelSvg) {
        const allCountryLabels = svg.selectAll("text.countryLabel");
        const rememberTopLevelSvg = topLevelSvg;
        if ("ontouchstart" in document) svg
            .style("-webkit-tap-highlight-color", "transparent")
            .on("touchmove", moved)
            .on("touchstart", entered)
            .on("touchend", left)
        else svg
            .on("mousemove", moved)
            .on("mouseenter", entered)
            .on("mouseleave", left);

        function moved(d, i) {
            d3.select(this).select ("path.dataLine").attr('stroke-width', '3');
            d3.select(this).select ("text.countryLabel").style('font-size', '8pt');

        }

        function entered(d, i) {
            d3.select(this).select ("path.dataLine").attr('stroke-width', '3');
            d3.select(this).select ("text.countryLabel").style('font-size', '8pt');
        }

        function left(d, i) {
            const x = topLevelSvg.selectAll("g");
            d3.select(this).select ("path.dataLine").attr('stroke-width', '1');
            d3.select(this).select ("text.countryLabel").style('font-size', '6pt');

        }
    }




    const hover = function (svg, topLevelSvg,xValueAccess,yValue) {

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
                    return x(xValueAccessor (chooseValueFunction (d),auxData))+shiftPopUpMessage-5;
                })
                .attr("y", function(d,i){
                    return y(yValueAccessor (chooseValueFunction (d),auxData))-shiftPopUpMessage-5;
                })
                .attr("width", 190)
                .attr("height", 43+(("Inflection point detected"===title)? 13:0) )
                .attr("fill", 'white')
            ;
            labelHolder
                .attr("x", function(d,i){
                    return x(xValueAccessor(chooseValueFunction (d),auxData))+shiftPopUpMessage-5;
                })
                .attr("y", function(d,i){
                    return y(yValueAccessor (chooseValueFunction (d),auxData))-shiftPopUpMessage-5;
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
                    return x(xValueAccessor (chooseValueFunction (d),auxData))+shiftPopUpMessage;
                })
                .attr("y", function(d,i){
                    return y(yValueAccessor (chooseValueFunction (d),auxData))-shiftPopUpMessage;
                })
                .text(function(d,i){
                    return title;
                })
                .append('tspan')
                .attr("class", "countryInflectionLabel")
                .attr("alignment-baseline", "hanging")
                .attr('dy', '1.2em')
                .attr("x", d=>x(xValueAccessor (chooseValueFunction (d),auxData))+shiftPopUpMessage)
                .text( function(d){
                    if (typeof xValueAccessor(chooseValueFunction (d),auxData)==="number"){
                       return "in "+textAccessor (chooseValueFunction (d),auxData)+' by day '+Math.round (xValueAccessor(chooseValueFunction (d),auxData));
                    } else {
                        return "in "+textAccessor (chooseValueFunction (d),auxData)+' on '+d3.timeFormat("%B %d, %Y")(xValueAccessor(chooseValueFunction (d),auxData));
                    }

                })
                .append('tspan')
                .attr("class", "countryInflectionLabel")
                .attr("alignment-baseline", "hanging")
                .attr('dy', '1.2em')
                .attr("x", function(d,i){
                    return x(xValueAccessor (chooseValueFunction (d),auxData))+shiftPopUpMessage;
                })
                .text( function(d,i){return "("+mpgSoftware.growthFactorLauncher.dateConverterUtil.formatDateAsString(chooseValueFunction (d).date)+")"});
            // the old prediction, from back when I thought that inflection might occur when the cumulative death curve
            // was halfway to its eventual asymptote. Clearly that model was far too hopeful.
            // if ("Inflection point detected"===title){
            //     developingPopUpInformation
            //         .append('tspan')
            //         .attr("class", "countryInflectionLabel")
            //         .text( function(d,i){return "eventual deaths predicted: "+(chooseValueFunction (d).y*2)})
            //         .attr("alignment-baseline", "hanging")
            //         .attr('dy', '1.2em')
            //         .attr("x", function(d,i){
            //             return x(xValueAccessor (chooseValueFunction (d)),auxData)+shiftPopUpMessage;
            //         });
            // }
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

    instance.resize = function (replot) {
        width = widthAdjuster()- margin.left - margin.right;
        height = heightAdjuster() - margin.top - margin.bottom;
        if (replot){
            mpgSoftware.growthFactorLauncher.buildThePlotWithRememberedData (idOfThePlaceToStoreData, 3);
        }
    };



    const assignColorsToCurves = function (unfilteredData) {
         color = d3.scaleOrdinal(d3.schemeCategory10);
         countryColorObject = {};
        _.forEach(_.uniq(unfilteredData,'key'), d=>countryColor(d.key));
    } ;
    const assignColorsToCurvesUsingGroupedData = function (groupedData) {
        color = d3.scaleOrdinal(d3.schemeCategory10);
        countryColorObject = {};
        _.forEach(groupedData, d=>countryColor(d.key));
    } ;

    /***
     * Have we ever seen the string before? If so then use the same color. Otherwise give the string one of 10 colors.
     * @param countryColorString
     * @returns {*}
     */
    const countryColor = function (countryColorString){
        if ( typeof countryColorObject [countryColorString] !== 'undefined'){
            return countryColorObject [countryColorString];
        }else {
            return color ((countryColorString.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0) ) % 10);
        }
    };

    instance.buildGrowthFactorPlot = function (growthFactorByCountry ) {
        const transitionTime = 1500;
        assignColorsToCurvesUsingGroupedData (growthFactorByCountry);
        const flattenEverything = _.flatten(_.map(growthFactorByCountry,d=>d.values.rawValues));
        let [yLower,yUpper] = d3.extent(flattenEverything, d => yValueAccessor (d,auxData));
        if (linearNotLog){
            y = d3.scaleLinear()
                .domain([yLower,yUpper]).nice()
                .range([height - margin.bottom, margin.top]);
        }else {
            y = d3.scaleLog()
                .domain([yLower,yUpper]).nice()
                .range([height - margin.bottom, margin.top]);
        }
        let [xLower,xUpper] = [0, 0];
        if(collapseToCommonStart){
            [xLower,xUpper] = d3.extent(flattenEverything, d => +d.x);
            x = d3.scaleLinear([xLower,xUpper])
                .domain([xLower,xUpper]).nice()
                .range([margin.left, width - margin.right]);

        }else {
            [xLower,xUpper] = d3.extent(flattenEverything, d => d.date);
            x = d3.scaleTime()
                .domain([xLower,xUpper])
                .range([margin.left, width - margin.right]);
        }
        let dateExtentObject = [];
        if (growthFactorByCountry.length>0){
            dateExtentObject = [d3.extent(flattenEverything, d => d.date)];
        }





        xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", -height+margin.top)
                .attr("stroke-opacity", 0.1));

        yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, ".0f"))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1));

        var dynamicLineSelection = d3.select("#"+idOfThePlaceWhereThePlotGoes);

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
            .call(d3.axisLeft(y).ticks(null, ".0f"))
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
            .data(dateExtentObject);
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
        let groupHolder = svg.selectAll("g.gh");
        const rememberLastValue = {};
        _.forEach (groupHolder.data (),  function (element) {
            const lastValue = _.last (element.values.rawValues);
            if ( typeof lastValue === 'undefined') return true;
            rememberLastValue [element.key] = {x:xValueAccessor(lastValue,auxData),
                y:yValueAccessor (lastValue,auxData),
                date:lastValue.date,
                total_deaths_per_million:lastValue.total_deaths_per_million,
                len:element.values.rawValues.length };
        });
        groupHolder =groupHolder
            .data(growthFactorByCountry,d=>d.key);
        const groupHolderEnter = groupHolder.enter()
            .append("g")
            .attr("class",'gh');
        // add the path
        groupHolderEnter
            .append("path")
            .attr("class",  d=>" dataLine "+d.type)
            .attr("fill", "none")
            .attr("stroke", function(d){ return countryColor(d.key) })
            .attr("stroke-width", 1)
            .attr("d", function(d,k){
                return d3.line()
                    .x(function(d) { return x((rememberLastValue [d.key])?(xValueAccessor(rememberLastValue [d.key],auxData)):(xLower)); })
                    .y(function(d) { return y((rememberLastValue [d.key])?(yValueAccessor (rememberLastValue [d.key],auxData)):(yLower)); })
                    (d.values.rawValues)
            })
            .transition().duration (transitionTime)
            .attr("d", function(d,k){
                return d3.line()
                    .x(function(d) { return x(xValueAccessor (d,auxData)); })
                    .y(function(d) { return y(yValueAccessor(d,auxData)); })
                    (d.values.rawValues)
            });
        // add the text
        groupHolderEnter
            .append("text")
            .attr("class", d => "countryLabel ")
            .attr("text-anchor", "last")
            .text(function(d,i){
                return textAccessor (d,auxData);
            })
            .attr("x", function(d,i){
                return x(xLower);
            })
            .attr("y", function(d,i){
                return y(yLower);
            })
            .transition().duration (transitionTime)
            .attr("x", function(d,i){
                return x(xValueAccessor (_.last(d.values.rawValues,'x'),auxData));
            })
            .attr("y", function(d,i){
                return y(yValueAccessor(_.last(d.values.rawValues,'y'),auxData));
            });

// update the line
        groupHolder.select ("path.dataLine")
            .transition().duration (transitionTime)
            .attr("d", function(d,k){
                return d3.line()
                    .x(function(d, index) {
                        const lastValue = rememberLastValue [d.key];
                        return (lastValue && (index >= lastValue.len))?x(xValueAccessor (rememberLastValue [d.key],auxData)): x(xValueAccessor (d,auxData));
                    })
                    .y(function(d, index) {
                        const lastValue = rememberLastValue [d.key];
                        return (lastValue && (index >= lastValue.len))?y(yValueAccessor (rememberLastValue [d.key],auxData)):y(yValueAccessor (d,auxData));
                    })
                    (d.values.rawValues)
            })
            .transition().duration (transitionTime)
            .attr("d", function(d,k){
                return d3.line()
                    .x(function(d) { return x(xValueAccessor (d,auxData)); })
                    .y(function(d) { return y(yValueAccessor (d,auxData)); })
                    (d.values.rawValues)
            });

        // update the text
        groupHolder.select ("text.countryLabel")
            .transition().duration (transitionTime)
            .attr("x", function(d,i){
                return x(xValueAccessor (_.last(d.values.rawValues,'x'),auxData));
            })
            .attr("y", function(d,i){
                return y(yValueAccessor (_.last(d.values.rawValues,'y'),auxData));
            });

        groupHolder.exit()
            .remove();


        // inflection point for each line, if it exists
        const inflectionPoint = svg.selectAll("circle.inflectionPoint")
            .data(_.filter (growthFactorByCountry,function(o){return o.values.inflection}),d=>d.key);
        inflectionPoint.enter()
            .append("circle")
            .attr("class",  d => d.values.inflection.key+" inflectionPoint "+d.type)
            .attr("r", 4)
            .attr("fill", function(d){ return countryColor(d.key) })
            .attr("stroke", 'black')
            .attr("stroke-width", 1)
            .attr("cx", d => x(xLower))
            .attr("cy", d => y(yLower))
            .transition().duration (transitionTime)
            // .attr("cx", d => x(d.values.inflection.x))
            .attr("cx", d => x(xValueAccessor (d.values.inflection,auxData)))
            .attr("cy", d => y(yValueAccessor(d.values.inflection,auxData)));
        inflectionPoint.transition().duration (transitionTime)
            .attr("cx", d => x(xValueAccessor (d.values.inflection,auxData)))
            .attr("cy", d => y(yValueAccessor (d.values.inflection,auxData)));
        inflectionPoint.exit()
            .remove()
        ;

        // // a point to describe lack of inflection
        // const noinflectionPoint = svg.selectAll("circle.noinflection")
        //     .data(_.filter (growthFactorByCountry,function(o){return ((o.values.noinflection)  && (!o.values.inflection))})
        //         ,d=>d.key);
        // noinflectionPoint.enter()
        //     .append("circle")
        //     .attr("class",  d => d.values.noinflection.key+" noinflection "+d.type)
        //     .attr("r", 3)
        //     .attr("fill", function(d){ return countryColor(d.key) })
        //     .attr("cx", d => x(0))
        //     .attr("cy", d => y(yLower))
        //     .transition().duration (transitionTime)
        //     .attr("cx", d => x(d.values.noinflection.x))
        //     .attr("cy", d => y(d.values.noinflection.y));
        // noinflectionPoint.transition().duration (transitionTime)
        //     .attr("cx", d => x(d.values.noinflection.x))
        //     .attr("cy", d => y(d.values.noinflection.y))
        // noinflectionPoint.exit()
        //     .remove();

        // label the axes
        const xAxisLabelElement = svg.selectAll("text.axisLabel.xAxis")
            .data([xAxisLabelAccessor ()]);
        xAxisLabelElement.enter()
            .append("text")
            .attr("class", "axisLabel xAxis")
            .attr("text-anchor", "middle")
            .attr("x", function(d,i){
                return (width-margin.right-margin.left)/2;
            })
            .attr("y", height-2 )
            .text(d=>d);
        xAxisLabelElement.transition().duration (transitionTime/2)
            .attr("opacity", 0.1)
            .transition().duration (transitionTime/2)
            .attr("opacity", 1)
            .text(d=>d);
        xAxisLabelElement.exit()
            .remove()
        ;
        const yAxisLabelElement = svg.selectAll("text.axisLabel.yAxis")
            .data([yAxisLabelAccessor ()]);
        yAxisLabelElement.enter()
        .append("text")
            .attr("class", "axisLabel yAxis")
            .attr("text-anchor", "middle")
            .attr("x", 10 )
            .attr("y", ((height-margin.top-margin.bottom)/2)+50 )
            .attr("transform", function(d) {
                return "rotate(-90,10,"+(((height-margin.top-margin.bottom)/2)+50) +")"
            })
            .text(d=>d);
        yAxisLabelElement.transition().duration (transitionTime/2)
            .attr("opacity", 0.1)
            .transition().duration (transitionTime/2)
            .attr("opacity", 1)
            .text(d=>d);
        yAxisLabelElement.exit()
            .remove()
        ;


        svg.selectAll("circle.inflectionPoint").call(hover, svg, xValueAccessor,yValueAccessor);
        // svg.selectAll("circle.noinflection").call(hover, svg);
        svg.selectAll("g.gh").call (highlight, svg);



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
    instance.idOfThePlaceWhereThePlotGoes= function (x) {
        if (!arguments.length) return idOfThePlaceWhereThePlotGoes;
        idOfThePlaceWhereThePlotGoes = x;
        return instance;
    };
    instance.movingAverageWindow= function (x) {
        if (!arguments.length) return movingAverageWindow;
        movingAverageWindow = x;
        return instance;
    };
    instance.daysOfNonExponentialGrowthRequired= function (x) {
        if (!arguments.length) return daysOfNonExponentialGrowthRequired;
        daysOfNonExponentialGrowthRequired = x;
        return instance;
    };
    instance.auxData= function (x) {
        if (!arguments.length) return auxData;
        auxData = x;
        return instance;
    };
    instance.collapseToCommonStart= function (x) {
        if (!arguments.length) return collapseToCommonStart;
        collapseToCommonStart = x;
        return instance;
    };
    instance.countingTotalDeaths= function (x) {
        if (!arguments.length) return countingTotalDeaths;
        countingTotalDeaths = x;
        return instance;
    };
    instance.labelAccessors= function (x, y) {
        if (!arguments.length) return [xAxisLabelAccessor,yAxisLabelAccessor];
        [xAxisLabelAccessor,yAxisLabelAccessor] = [x, y];
        return instance;
    };
    instance.valueAccessors= function (x, y) {
        if (!arguments.length) return [xValueAccessor,yValueAccessor];
        [xValueAccessor,yValueAccessor] = [x, y];
        return instance;
    };

    instance.textAccessor= function (x) {
        if (!arguments.length) return textAccessor;
        textAccessor = x;
        return instance;
    };






    return instance;

})();
