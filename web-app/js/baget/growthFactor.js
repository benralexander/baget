var baget = baget || {};  // encapsulating variable

baget.growthFactor = (function () {
    let x;
    let y;
    let xAxis;
    let yAxis;
    let height;
    let width;
    let margin;
    let growthFactorByCountry;

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

        const createInflectionPointPopUp = function(topLevelSvg,ountryRecord, chooseValueFunction, title) {
            const labelHolder = topLevelSvg.selectAll("g.countryInflectionLabelHolder")
                .data([1])
                .enter()
                .append("g")
                .attr("class", "countryInflectionLabelHolder");

            labelHolder.selectAll("rect.countryInflectionLabelHolder")
                .data([ountryRecord[0].values])
                .enter()
                .append("rect")
                .attr("class", "countryInflectionLabelHolder")
                .attr("x", function(d,i){
                    return x(chooseValueFunction (d).x)+shiftPopUpMessage;
                })
                .attr("y", function(d,i){
                    return y(chooseValueFunction (d).y)-shiftPopUpMessage;
                })
                .attr("width", 190)
                .attr("height", 100)
                .attr("fill", 'white')
            ;

            const popUpLabelHolder = labelHolder.selectAll("text.countryInflectionLabel")
                .data([ountryRecord[0].values])
                .enter()
                .append("text");
            popUpLabelHolder
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
                .text( d =>"Country ="+chooseValueFunction (d).countryName)
                .attr("alignment-baseline", "hanging")
                .attr('dy', '1.2em')
                .attr("x", d=>x(chooseValueFunction (d).x)+shiftPopUpMessage)
                .append('tspan')
                .attr("class", "countryInflectionLabel")
                .text( function(d,i){return "day ="+chooseValueFunction (d).x})
                .attr("alignment-baseline", "hanging")
                .attr('dy', '1.2em')
                .attr("x", function(d,i){
                    return x(chooseValueFunction (d).x)+shiftPopUpMessage;
                });
            if ("Inflection point detected"===title){
                popUpLabelHolder
                    .append('tspan')
                    .text( function(d,i){return " total predicted deaths ="+(chooseValueFunction (d).y*2)})
                    .attr("alignment-baseline", "hanging")
                    .attr('dy', '1.2em')
                    .attr("x", function(d,i){
                        return x(chooseValueFunction (d).x)+shiftPopUpMessage;
                    });
            }

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

            const circleToDescribe = d3.select(this);
            const classList = circleToDescribe
                .attr("class");
            if (classList){
                const countryCode = classList.split (" ");
                if (countryCode.length > 1){
                    let ountryRecord =  _.filter (growthFactorByCountry,
                        function(element){
                        return ((element.values.inflection)&&(element.values.inflection.code ===countryCode [0]))
                    }
                    );
                    if (ountryRecord.length > 0){
                        createInflectionPointPopUp (topLevelSvg,ountryRecord, d => d.inflection, "Inflection point detected" );

                    }else {
                        let bestNoninflectionPoint =  _.filter (growthFactorByCountry,
                            function(element){
                                return ((element.values.noinflection)&&(element.values.noinflection.code ===countryCode [0]))
                            }
                        );
                        createInflectionPointPopUp(topLevelSvg,bestNoninflectionPoint,d => d.noinflection, "No inflection detected");
                    }
                }
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

    const resize = function () {
        width = widthAdjuster()- margin.left - margin.right;
        height = heightAdjuster() - margin.top - margin.bottom;
        var extractedData  = d3.selectAll('#groupHolder').selectAll('g.allGroups').data();
        var dataRange = UTILS.extractDataRange(extractedData);
        d3.select("#scatterPlot1").selectAll('svg').remove();
        qqPlot.width(width)
            .height(height)
            .dataHanger ("#scatterPlot1", extractedData);
        d3.select("#scatterPlot1").call(qqPlot.render);
    };



    const buildGrowthFactorPlot = function (data) {

        height = 600;
        width = 1000;
        margin = ({top: 100, right: 50, bottom: 35, left: 60});

        const dataByCountry =d3.nest() // nest function to group by country
            .key(function(d) { return d.countryName;} )
            .entries(data);

        growthFactorByCountry = _.map(dataByCountry,function (v){
            //let returnObject = [];
            let differenceArray = [];
            _.forEach(v.values,  function(value, index){
                if (v.values.length < 2)return true;
                if ((index > 0) && (index < 3)){
                    differenceArray.push (
                        {
                            x: v.values[index].x,
                            y: v.values[index].y,
                            difference: v.values[index].y - v.values[index - 1].y,
                            code: v.values[index].code,
                            countryName: v.values[index].countryName
                        });
                }else if ((index > 2) && (index < v.values.length-2)){
                    const v1 = _.map (_.slice(v.values, index-2,index+1), o=>o.y);
                    const v2 = _.map (_.slice(v.values, index-1,index+2), o=>o.y);

                    const n1 = mpgSoftware.growthFactorLauncher.calculateWeightedMovingAverage(v1);
                    const n2 = mpgSoftware.growthFactorLauncher.calculateWeightedMovingAverage(v2);

                    differenceArray.push (
                        {x:v.values[index].x,
                            y:v.values[index].y,
                            // difference: v.values[index].y-v.values[index-1].y,
                            difference: n2-n1,
                            code: v.values[index].code,
                            countryName: v.values[index].countryName}
                    );
                }else if ((index > 1) &&(index === v.values.length-2)){
                    const v1 = _.map (_.slice(v.values, index-2,index), o=>o.y);
                    const v2 = _.map (_.slice(v.values, index-1,index+1), o=>o.y);

                    const n1 = mpgSoftware.growthFactorLauncher.calculateWeightedMovingAverage(v1);
                    const n2 = mpgSoftware.growthFactorLauncher.calculateWeightedMovingAverage(v2);

                    differenceArray.push (
                        {x:v.values[index].x,
                            y:v.values[index].y,
                            difference: n2-n1,
                            code: v.values[index].code,
                            countryName: v.values[index].countryName}
                    );
                }else if ((index > 1)&&(index === v.values.length-1)){
                    const v1 = _.map (_.slice(v.values, index-2,index-1), o=>o.y);
                    const v2 = _.map (_.slice(v.values, index-1,index), o=>o.y);

                    const n1 = mpgSoftware.growthFactorLauncher.calculateWeightedMovingAverage(v1);
                    const n2 = mpgSoftware.growthFactorLauncher.calculateWeightedMovingAverage(v2);

                    differenceArray.push (
                        {x:v.values[index].x,
                            y:v.values[index].y,
                            difference: n2-n1,
                            code: v.values[index].code,
                            countryName: v.values[index].countryName}
                    );
                }
            });
            let growthRateArray = [];
            _.forEach(differenceArray,function(value, index){
                if ((index > 0) && (differenceArray[index-1].difference !==0)){
                    growthRateArray.push (
                        {   x:v.values[index].x,
                            y:v.values[index].y,
                            growthFactor:differenceArray[index].difference/differenceArray[index-1].difference,
                            code: v.values[index].code,
                            countryName: v.values[index].countryName});
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
                           code: v.values[index].code,
                           countryName: v.values[index].countryName
                       };
                       return false;
                   } else {
                       analComplete['noinflection'] = {
                           index: index,
                           x: growthRateArray[index].x,
                           y: growthRateArray[index].y,
                           code: v.values[index].code,
                           countryName: v.values[index].countryName
                       };
                       return true;
                   }
                } else {
                    return true;
                }
                   });
;
            return {key:v.key,
                values:analComplete}
        });
        const dataFilter = function (data){
            return _.filter (data, datum => datum.code.length > 0)
        }
        x = d3.scaleLinear()
           .domain(d3.extent(dataFilter (data), d => +d.x)).nice()
            .range([margin.left, width - margin.right]);
        y = d3.scaleLinear()
            .domain(d3.extent(dataFilter (data), d => +d.y)).nice()
            .range([height - margin.bottom, margin.top])
        xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", -height+margin.top)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", width - 4)
                .attr("y", -4)
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text(data.x)
                .call(halo));
        yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, ".2f"))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 4)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .text(data.y)
                .call(halo));

        line = d3.line()
            .curve(d3.curveCatmullRom)
            .x(d => x(d.x))
            .y(d => y(d.y));

        var dynamicLineSelection = d3.select("#dynamicLine");

        const svg = dynamicLineSelection.append("svg")
            .attr("viewBox", [0, 0, width, height]);

        const l = length(line(data));
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        countryColorObject = {};
        const countryColor = function (countryColorString){
            if ( typeof countryColorObject [countryColorString] !== 'undefined'){
                return countryColorObject [countryColorString];
            }else {
                return color ((countryColorString.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0) ) % 10);
            }
        };
        // add a field to describe the category for these data
        _.forEach(dataByCountry, function (v,k) {
            if (v.values[0].code.length===0){
                v['type']='noncountry';
            }else {
                const countryGrowthFactorRecord = _.find (growthFactorByCountry, d => d.key==v.values[0].countryName);
                if (countryGrowthFactorRecord.values.inflection){
                    countryGrowthFactorRecord.values['type']=v['type']='inflection';
                    // countryGrowthFactorRecord.values['type']='inflection';
                }else if ((!countryGrowthFactorRecord.values.inflection) && (countryGrowthFactorRecord.values.noinflection)){
                    countryGrowthFactorRecord.values['type']=v['type']='noinflection';
                }else {
                    countryGrowthFactorRecord.values['type']=v['type']='inflectionUndetermined';
                }
            }
        });

            // build the axes
        svg.append("g")
            .call(xAxis);
        svg.append("g")
            .call(yAxis);
        path =svg.selectAll("path.dataLine")
            .data(dataByCountry)
            .enter()
            .append("path")
            .attr("class", d => (((d.values[0].code.length> 0)? "countryLine":"categoryLine") + " dataLine "+d.type))
            .attr("fill", "none")
            .attr("stroke", function(d){ return countryColor(d.key) })
            .attr("stroke-width", 1)
            .attr("d", function(d,k){
                return d3.line()
                    .x(function(d) { return x(+d.x); })
                    .y(function(d) { return y(+d.y); })
                    (d.values)
            });
        // const everyPoint = svg.selectAll("circle")
        //     .data(dataByCountry)
        //     .enter()
        //     .append("circle")
        //     .attr("class",  d => d.values.code+"everyPoint")
        //     .attr("r", 1.5)
        //     .attr("fill", function(d){ return countryColor(d.key) })
        //     .attr("cx", d => x(d.values.x))
        //     .attr("cy", d => y(d.values.y));
        svg.selectAll(".text")
            .data(dataByCountry)
            .enter()
            .append("text")
            .attr("class", d => "countryLabel "+d.type)
            .attr("text-anchor", "last")
            .attr("x", function(d,i){
                return x(_.last(d.values,'x').x);
            })
            .attr("y", function(d,i){
                return y(_.last(d.values,'y').y);
            })
            .text(function(d,i){
                return d.key;
            });
        const inflectionPoint = svg.selectAll("circle")
            .data(_.filter (growthFactorByCountry,function(o){return o.values.inflection}))
            .enter()
            .append("circle")
            .attr("class",  d => d.values.inflection.code+" inflectionPoint")
            .attr("r", 4)
            .attr("fill", function(d){ return countryColor(d.key) })
            .attr("cx", d => x(d.values.inflection.x))
            .attr("cy", d => y(d.values.inflection.y))
            .attr("stroke", 'black')
            .attr("stroke-width", 1);

        const noinflectionPoint = svg.selectAll("circle")
            .data(_.filter (growthFactorByCountry,function(o){return ((o.values.noinflection)  && (!o.values.inflection))}))
            .enter()
            .append("circle")
            .attr("class", "noinflection")
            .attr("class",  d => d.values.noinflection.code+" noinflection")
            .attr("r", 3)
            .attr("fill", function(d){ return countryColor(d.key) })
            .attr("cx", d => x(d.values.noinflection.x))
            .attr("cy", d => y(d.values.noinflection.y));

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

        // build the identity line
        const identityLine = svg.append("g");
        identityLine.append("line")
            .attr("class", "identity")
            .style("stroke", "blue")
            .attr("stroke-opacity", 0.3)
            .style("stroke-width", 1.5)
            .attr("x1", d => x(0))
            .attr("y1", d => y(0))
            .attr("x2", d => x(1))
            .attr("y2", d => y(1));
        identityLine.append("circle")
            .attr("r", 2)
            .attr("fill", "blue")
            .attr("class", "identityStart")
            .attr("cx", d => x(0))
            .attr("cy", d => y(0));
        identityLine.append("circle")
            .attr("r", 2)
            .attr("fill", "blue")
            .attr("class", "identityEnd")
            .attr("cx", d => x(1))
            .attr("cy", d => y(1));



        inflectionPoint.call(hover, svg);
        noinflectionPoint.call(hover, svg);
       // everyPoint.call(hover, svg);



        return svg.node();



    }

    return {
        resize:resize,
        buildGrowthFactorPlot: buildGrowthFactorPlot
    }
})();
