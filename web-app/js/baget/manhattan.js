/***
 *               --------------manhattan--------------
 *
 * This JavaScript file should be sufficient for creating a manhattan plot.
 *
 * @type {baget|*|{}}
 */



var baget = baget || {};  // encapsulating variable

(function () {

    /***
     * The
     * @returns {{}}
     */

    baget.manhattan = function () {

        // the variables we intend to surface
        var
            width = 1,
            height = 1,
            xAxisAccessor = {},
            yAxisAccessor = {},
            margin = {},
            selectionIdentifier = '',  // string to identify the Dom object that will serve as our route
            data = {},
            color = d3.scale.category10(),
            overrideXMinimum,overrideXMaximum,overrideYMinimum,overrideYMaximum,

            /***
             * Encapsulate functionality directly surrounding chromosomes
             */
            chromosomes = (function (color)  {

                // private variables
                var  chromosomeInfo = [{c:'0',l:0,p:0},
                    {c:'1',l:247249719,p:8.01}, //chromosome name, length, cumulative percentage of total
                    {c:'2',l:242951149,p:15.88},
                    {c:'3',l:199501827,p:24.309},
                    {c:'4',l:191273063,p:30.509},
                    {c:'5',l:180857866,p:36.366},
                    {c:'6',l:170899992,p:41.90},
                    {c:'7',l:158821424,p:47.042},
                    {c:'8',l:146274826,p:51.782},
                    {c:'9',l:140273252,p:56.327},
                    {c:'10',l:135374737,p:60.715},
                    {c:'11',l:134452384,p:65.073},
                    {c:'12',l:132349534,p:69.363},
                    {c:'13',l:114142980,p:73.065},
                    {c:'14',l:106368585,p:76.513},
                    {c:'15',l:100338915,p:79.764},
                    {c:'16',l:88827254,p:82.644},
                    {c:'17',l:78774742,p:85.20},
                    {c:'18',l:76117153,p:87.669},
                    {c:'19',l:63811651,p:89.736},
                    {c:'20',l:62435964,p:91.763},
                    {c:'21',l:46944323,p:93.281},
                    {c:'22',l:49691432,p:94.88},
                    {c:'X',l:154913754,p:99.8},
                    {c:'Y',l:57772954,p:99.9}],
                    chromosomeToIndex = {},
                    genomeLength = 3080419480,
                /***
                 * Convert a chromosome name and position within that chromosome  to and ordered location
                 * within the complete genome.
                 * @param chromosomeNumber
                 * @param position
                 * @param chromosomeInfo
                 */
                 convertALocation  = function(chromosomeName, position) {
                    var chromosomeIndex = chromosomeToIndex[chromosomeName];
                    var returnValue;
                    if (typeof chromosomeIndex !== 'undefined') {
                        var startingPosition = chromosomeInfo[chromosomeIndex-1].p;
                        returnValue =  (startingPosition*genomeLength/100.0)+position; // start of chromosome
                    }
                    return  Number(returnValue);
                },
                colorByChromosomeNumber = function (chromosomeName)  {
                    var chromosomeIndex = chromosomeToIndex[chromosomeName];
                    var returnValue = color(1);
                    if (typeof chromosomeIndex !== 'undefined') {
                        if ((chromosomeIndex % 2)  === 0){
                            returnValue = color(2);
                        }   else {
                            returnValue = color(4);
                        }
                    }
                    return  returnValue;
                }


                // initialization
                for( var i = 1 ; i < chromosomeInfo.length ; i++ ){
                    chromosomeToIndex[chromosomeInfo[i].c] = i;
                }

                return {
                    // public variables
                    chromosomeInfo:chromosomeInfo,
                    chromosomeToIndex:chromosomeToIndex,
                    genomeLength:genomeLength,
                    convertALocation:convertALocation,
                    colorByChromosomeNumber:colorByChromosomeNumber
                }
            }(color)),

            crossChromosomePlot = true,
            tooltipAccessor = function (d) {
                return d.p;      //    default key name for the JSON field holding tooltip values
            },


        // private variables
            instance = {};

        /***
         * use the data to determine the extents. However we can override with the parameters below
         *
         * @param allData
         * @param crossChromosomePlot -- plot the whole human chromosome. 23 autosomes plus X and Y
         * @param minimumXValueOverride -- forget the data, forget crossChromosomePlot --> use this X value minimum
         * @param maximumXValueOverride -- forget the data, forget crossChromosomePlot --> use this X value maximum
         * @param minimumYValueOverride -- forget the data --> use this Y value minimum
         * @param maximumYValueOverride -- forget the data --> use this Y value maximum
         */
        var determineDataExtents = function (allData, crossChromosomePlot,    // Boolean-- X extent equals entire human chromosome
                                             minimumXValueOverride,
                                             maximumXValueOverride,
                                             minimumYValueOverride,
                                             maximumYValueOverride) {
            // first do the X extents, which are much more complicated
            var minimumExtent, maximumExtent;
            if (crossChromosomePlot) {  // plot the whole genome, so we know the extents
                maximumExtent = chromosomes.genomeLength;
                minimumExtent = 0;
            } else {
                (function () {
                    // we need to know the max and min values. Do this work in an orderly way
                    //  inside and immediately executed function so that we can cleanup temporary
                    // variables when the work is done
                    var rememberExtents = [];
                    var numberOfExtents = allData.length;
                    for (var i = 0; i < numberOfExtents; i++) {
                        rememberExtents.push(chromosomes.convertALocation("" + allData[i].c, allData[i].x))
                    }
                    maximumExtent = d3.max(rememberExtents);
                    minimumExtent = d3.min(rememberExtents);
                })();
            }
            if (typeof minimumXValueOverride !== 'undefined') {
                minimumExtent =   minimumXValueOverride;
            }
            if (typeof maximumXValueOverride !== 'undefined') {
                maximumExtent =   maximumXValueOverride;
            }
            return { minimumXExtent: minimumExtent,
                maximumXExtent: maximumExtent,
                minimumYExtent: (typeof minimumYValueOverride !== 'undefined') ? minimumYValueOverride:d3.min(allData, function (d) {return d.y;}),
                maximumYExtent: (typeof maximumYValueOverride !== 'undefined') ? maximumYValueOverride:d3.max(allData, function (d) {return d.y;})  }
        };


        var createAxes = function (axisGroup,chromosomes,xScale,yScale, width, height, margin){
            // draw the x axis
            var v = [];
            for ( var i = 1 ; i < chromosomes.chromosomeInfo.length ; i++ )  {
                v.push(((chromosomes.chromosomeInfo[i-1].p+chromosomes.chromosomeInfo[i].p)*chromosomes.genomeLength)/200);
            }
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickValues(v)
                .tickFormat(function(d, i){
                    return ""+chromosomes.chromosomeInfo[i+1].c ;
                }) ;

            axisGroup.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "middle")
                .attr("y", 6)
                .attr("x", -height/2)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text("-log 10 p");

            axisGroup.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "middle")
                .attr("y", height+margin.bottom)
                .attr("x", width/2)
                .attr("dy", ".75em")
                .text("chromosome number");

            axisGroup.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .attr('class', 'main axis')
                .call(xAxis);

            // draw the y axis
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');

            axisGroup.append('g')
                .attr('transform', 'translate(' + margin.left + ',0)')
                .attr('class', 'main axis date')
                .call(yAxis);

           // return  axisGroup;
        };




        //  private variable
        var tip = d3.tip()
            .attr('class', 'd3-tip scatter-tip')
            .style('z-index', 51)
            .offset([-10, 0])
            .html(function (d) {
                var textToPresent = "";
                if (d) {
                    if ((typeof(tooltipAccessor) !== "undefined")&&
                        (typeof(tooltipAccessor(d)) !== "undefined")){
                        textToPresent = tooltipAccessor(d);
                    }  else {
                        textToPresent = d.n+'<br/>Chr='+d.c+', loc='+d.x+'<br/>('+chromosomes.convertALocation (""+d.c, d.x)+')' ;
                    }
                }
                return "<strong><span>" + textToPresent + "</span></strong> ";
            });


        // Now walk through the DOM and create the enrichment plot
        instance.render = function (currentSelection) {


            var margin = {top: 20, right: 15, bottom: 60, left: 60}
                , width = 960 - margin.left - margin.right
                , height = 500 - margin.top - margin.bottom;

            // work in the SVG we created to hold the data
            var chart = currentSelection.select('svg');

            // calculate data extents, allowing for manual overrides
            var dataExtent =  determineDataExtents(chart.data()[0],crossChromosomePlot,
                overrideXMinimum,overrideXMaximum,overrideYMinimum,overrideYMaximum);

            // create the scales
            var x = d3.scale.linear()
                .domain([dataExtent.minimumXExtent-((dataExtent.maximumXExtent-dataExtent.minimumXExtent)/50), dataExtent.maximumXExtent])
                .range([ margin.left, width ]);
            var y = d3.scale.linear()
                .domain([dataExtent.minimumYExtent,dataExtent.maximumYExtent])
                .range([ height, 0 ]);

            // create the axes
            var t = chart
                .selectAll('g.axesHolder')
                .data([1])
                .enter()
                .append('g')
                .attr('class', 'axesHolder')
            .call(createAxes ,chromosomes,x,y,width, height, margin);

            // add the data elements
            var g = chart.append("svg");


            var dots=g.selectAll('.dot')
                .data(chart.data()[0]);
            dots
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr("r", 3.5)
                .attr("cx", function(d){
                    return x(chromosomes.convertALocation (""+d.c, d.x));
                })
                .attr("cy", function(d){
                    return y(dataExtent.minimumYExtent);
                })
                .style("fill", function(d,i) {
                    return chromosomes.colorByChromosomeNumber(d.c);
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
             dots.transition()
                 .delay(100).duration(1400)
                 .attr("cy", function(d){
                     return y(d.y);
                 });
        } ;


        instance.dataHanger = function (selectionIdentifier, data) {

            selection = d3.select(selectionIdentifier)
                .selectAll('svg.mychart')
                .data([data])
                .enter()
                .append('svg')
                .attr('class', 'mychart')
                .attr('width', width*1.5)
                .attr('height', height*1.4)
                .call(tip);
            return instance;
        };


        instance.dataAppender = function (selectionIdentifier, data) {
            selection = d3.select(selectionIdentifier)
                .selectAll('svg.mychart')
                .data([data])
                .enter()
                .append('svg')
                .attr('class', 'mychart') ;
            return instance;
        };



        instance.width = function (x) {
            if (!arguments.length) return width;
            width = x;
            return instance;
        };

        instance.height = function (x) {
            if (!arguments.length) return height;
            height = x;
            return instance;
        };

        instance.xAxisAccessor = function (x) {
            if (!arguments.length) return xAxisAccessor;
            xAxisAccessor = x;
            return instance;
        };

        instance.yAxisAccessor = function (x) {
            if (!arguments.length) return yAxisAccessor;
            yAxisAccessor = x;
            return instance;
        };

        instance.overrideXMinimum = function (x) {
            if (!arguments.length) return overrideXMinimum;
            overrideXMinimum = x;
            return instance;
        };

        instance.overrideXMaximum = function (x) {
            if (!arguments.length) return overrideXMaximum
            overrideXMaximum = x;
            return instance;
        };

        instance.overrideYMinimum = function (x) {
            if (!arguments.length) return overrideYMinimum;
            overrideYMinimum = x;
            return instance;
        };

        instance.overrideYMaximum = function (x) {
            if (!arguments.length) return overrideYMaximum
            overrideYMaximum = x;
            return instance;
        };




        return instance;
    };

})();