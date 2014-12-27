var baget = baget || {};

(function () {
    "use strict";

    var instance; // object that retains the box whisker across instantiations.  We use a
    //  singleton-based approach, so there is never more than one box whisker.

    baget.boxWhiskerPlot = function () {

        /***
         * Publicly accessible data goes here
         */
        var boxWhiskerData,  // All the points the box whisker plot represents ( outliers or boxed )
            selectionIdentifier = '', // String defining Dom element where the plot will hang
            selection = {}, // DOM element inside D3 wrapper
            min = Infinity,  // min y value.  Autoscale if not set
            max = -Infinity,  // max y value.  Autoscale if not set
            whiskers = boxWhiskers, // function to set the whiskers
            boxWhiskerName = '', // little text label under b/w
            outlierRadius = 2,  // size of outlier dots on screen
            scatterDataCallback,

        // Private variables, which can be surfaced as necessary
            duration = 500,  // How many milliseconds to animations require
            quartiles = boxQuartiles, // function describing how quartiles are calculated
            value = Number,
            tickFormat = null,


        // the callback which retrieves the correlation data. Note that this callback
        // also assigns a second callback ( scatterDataCallback ) which it uses to
        // actually launch the scatter plot
        //
        // also note: I externalize this callback to support inserting a stub in the test harness.
        // During regular usage, however, this default value should be perfectly adequate
            retrieveCorrelationData = function (compoundId, geneName, dataSet) {
                setWaitCursor();
                var filter = collectFilterStrings();
                DTGetCorrelationPoints(compoundId, geneName, dataSet, filter, function (data) {
                    if (typeof scatterDataCallback !== "undefined") {
                        scatterDataCallback(data, geneName, compoundId);
                    }
                    removeWaitCursor();
                });
            },


        // these sizes referred to each individual bar in the bar whisker plot
            margin = {top: 50, right: 70, bottom: 20, left: 80},
            width = 350 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,

            cleanUpAfterYourself = function (comprehensiveCleanup) {

                // Previous incarnations of this plot can interfere with new ones so clear out the DOM
                var previouslyExistingScatterPlot = d3.select("#scatterPlot1").selectAll("svg");
                if (previouslyExistingScatterPlot) {
                    previouslyExistingScatterPlot.remove();
                }

                // if we are getting rid of the scatter plot then we'd best also clear out any lingering dose response curves
                var previouslyExistingdoseResponseCurve = d3.select('#doseResponseCurve').selectAll("svg");
                if (previouslyExistingdoseResponseCurve) {
                    previouslyExistingdoseResponseCurve.remove();
                }

                if (comprehensiveCleanup === true) {
                    d3.selectAll('svg.box').remove()
                    d3.select("#examineCorrelation").classed('scatterIsUp', false);
                    d3.select("#examineCorrelation").style('display', 'none');
                }
            };


        /***
         * Begin the code for the box whisker plot (everything up to this point includes only variable definitions,
         * and nothing that is immediately executed).
         */


        // First step, and enforce that this object is initialized with a 'new'.  If not then we will impose one.
        if (!(this instanceof baget.boxWhiskerPlot)) {
            return new baget.boxWhiskerPlot();
        }


        // Enforce that there is only ever one of these objects (Singleton pattern).  We presume
        //  that calling a boxwhisker that already exists should imply that we reinitialize the plot,
        //  so we call a clean up before returning the pointer.
        if (typeof instance === "object") {
            cleanUpAfterYourself(true);
            return instance;
        } else {
            instance = {};
        }


        /***
         *  This module adds a handler for clicks on the outlier elements in the
         *  box whisker plot, and then retrieves the data necessary to insert
         *  a scatter plot into a common div.  We use prototype definition tricks
         *  JQuery here, so make sure those libraries are available.
         */
        var clickHandling = (function () {

            /***
             *  deselect: this method will unselect any outliers that might be selected, mark the scatterplot
             *  as not visible, and remove the underlying SVG representation of the data
             */
            var deselect = function () {
                    visuallyUnidentifyAllDots();

                    cleanUpAfterYourself(false);

                    scatterIsUp(false);

                    d3.select(".pop").style('display', 'block')
                        .style('height', '445px')
                        .transition()
                        .style('height', '5px')
                        .style('display', 'none');


                },


                /***
                 * Mark an outlier point as selected
                 */
                visuallyIdentifyDot = function (currentDot) {
                    d3.select(currentDot).select('circle').classed('selectedCircle', true).classed('outlier', false);
                },


                /***
                 * Make sure that all outlier points are deselected
                 */
                visuallyUnidentifyAllDots = function () {
                    d3.selectAll('.selectedCircle').classed('outlier', true).classed('selectedCircle', false);
                },

                /***
                 * This method is a mixed getter setter. With the parameter we set the specified ID as
                 * either having or not having a class that tells us the scatterplot is in place.  Without
                 * a parameter we return a truth value answering the question of whether the scatterplot
                 * is in place
                 */
                scatterIsUp = function (trueOrFalse) {
                    var retval = false;
                    if (!arguments.length) {
                        if (!d3.select("#examineCorrelation").empty()) {
                            retval = d3.select("#examineCorrelation").classed('scatterIsUp');
                        }
                        return retval;
                    }
                    d3.select("#examineCorrelation").classed('scatterIsUp', trueOrFalse);
                },

                /***
                 * Is this outlier point already selected? We behave differently if we hit a selected point
                 * ( simply bring down the scatterplot) then if we select a new point ( bring down the old
                 * scatterplot and put up a new one).
                 */
                thisDotIsAlreadySelected = function (currentDot) {
                    var retval = false;
                    if (!d3.select(currentDot).select('circle').empty()) {
                        retval = d3.select(currentDot).select('circle').classed('selectedCircle');
                    }
                    return retval;
                };


            /***
             * Encapsulate the logic of the clickHandling module. The majority of this logic is held within
             * a callback that is activated when the user clicks on outlier point
             */
            $(function () {

                $(document.body).on('click', '.clickable', function () {

                    if (thisDotIsAlreadySelected(this)) {

                        deselect();

                    } else {

                        visuallyUnidentifyAllDots();
                        if (scatterIsUp()) {
                            deselect();
                        }

                        visuallyIdentifyDot(this);

                        var genePrimaryName = $(this).attr('gpn');

                        var cmpd = $('#imageHolder').data('compound'),
                            correlationDataType = $('input:radio[name=correlationChoice]:checked').val();

                        d3.select('#doseResponseCurve').style('display', 'none');
                        d3.select('.messagepop').style('width', '400px');

                        retrieveCorrelationData(cmpd,
                            genePrimaryName,
                            correlationDataType);
                        scatterIsUp(true);
                        d3.select(".pop").style('display', 'block')
                            .style('height', '5px')
                            .transition()
                            .style('height', '445px');

                    }
                    return false;
                });


                // there is only one close label so we only need to establish the callback once
                $(document.body).on('click', '.close', function () {
                    deselect();
                    d3.select("#examineCorrelation").classed('scatterIsUp', false);
                    d3.select("#examineCorrelation").style('display', 'none');

                    return false;
                });

            });


            return {
                // public variables and methods.  Current none are necessary
            };

        }());


        /***
         *  jitter module provides an offset so that points that would be near
         *  to one another along the y-axis are offset in the x-axis to keep
         *  points from overlaying one another
         *
         *  Assumption: this method requires the data to be monotonic in descending order
         */
        var jitter = (function () {
            var lastX = null,
                lastY = null,
                centralXPosition = null,
                lastAxialPoint = null,
                shiftLeftNext = true,
                currentX = 0,

                determinePositioning = function (xValue, yValue) {
                    if ((lastX === null) && (lastY === null)) {  // this is our first time through
                        lastX = 0;
                        centralXPosition = xValue;
                        lastAxialPoint = yValue;
                        lastY = yValue;
                        shiftLeftNext = true;
                    }
                    else {  // this is not our first time
                        if (yValue > (lastAxialPoint - (2 * outlierRadius))) { // potential overlap. Shift it.
                            if (shiftLeftNext) {    // let's shift to the left.  expand on left shifts only
                                if (lastX < 0) {
                                    lastX = (0 - lastX);
                                }
                                lastX += (2 * outlierRadius);
                                shiftLeftNext = false;
                            } else {  // we are shifting to the right. Change sign.
                                lastX = (0 - lastX);
                                shiftLeftNext = true;
                            }
                        } else { // no overlap possible. Return to center
                            lastX = 0;
                            lastAxialPoint = yValue;
                            shiftLeftNext = true;
                        }
                        lastY = yValue;
                    }
                    currentX = (centralXPosition + lastX);
                },
                shiftedX = function (xValue, yValue) {
                    if (yValue > lastY) {
                        initialize();
                    }
                    determinePositioning(xValue, yValue);
                    return currentX;
                },
                shiftedY = function (xValue, yValue) {
                    if (yValue > lastY) {
                        initialize();
                    }
                    determinePositioning(xValue, yValue);
                    return lastY;
                },
                initialize = function () {
                    lastX = null;
                    lastY = null;
                };

            return {
                // public variables

                // public methods
                currentX: shiftedX,
                currentY: shiftedY,
                initialize: initialize
            };

        }());


        //  private variable
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                var nodeData = d3.select(this.parentNode).data()[0].data[d];
                var valueToDisplay = new Number(nodeData.v);
                return "<strong></strong> <span style='color:#00ff00'>Gene: " + nodeData.d + "<br/>" +
                    "Correlation: " + valueToDisplay.toPrecision(3) + "</span>";
            });

        /***
         * publicly available method.  The data are changing, so clean up any residual on-screen data elements
         */
        instance.launchCleanup = function (thoroughCleanup) {
            cleanUpAfterYourself(thoroughCleanup);
            return instance;
        };


        // For each small multiple…
        instance.render = function (currentSelection) {
            var xAxis,
                yAxis,
                boxWhiskerObjects,
                numberOfBoxes,
                boxWidth,
                centerForBox,
                leftEdgeOfBox,
                rightEdgeOfBox;

            boxWhiskerObjects  = currentSelection.selectAll('g.boxHolder');
            numberOfBoxes  = boxWhiskerObjects[0].length;
            boxWidth = width/(1.5*(numberOfBoxes +0.5));
            boxWhiskerObjects
                .each(function (d, i) {      // d3 each: d=datum, i=index
                    leftEdgeOfBox =  boxWidth*(1.5*(i +0.5)) ;
                    centerForBox =  leftEdgeOfBox+(boxWidth/2) ;
                    rightEdgeOfBox = leftEdgeOfBox+boxWidth;

                    var g = d3.select(boxWhiskerObjects[0][i]);

                        g.call(tip);//.class('boxHolder',true);
                    var d2 = d.data.sort(function (a, b) {
                        return a.v - b.v;
                    });
                    var n = d2.length;

                    // Compute quartiles. Must return exactly 3 elements.
                    var quartileData = d2.quartiles = quartiles(d2);

                    // Compute whiskers. Must return exactly 2 elements, or null.
                    var whiskerIndices = whiskers && whiskers.call(this, d2, i),
                        whiskerData = whiskerIndices && whiskerIndices.map(function (i) {
                            return d2[i].v;
                        });

                    // Compute outliers. If no whiskers are specified, all data are "outliers".
                    // We compute the outliers as indices, so that we can join across transitions!
                    var outlierIndices = whiskerIndices
                        ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
                        : d3.range(n);

                    // Compute the new x-scale.
                    var xScale = d3.scale.linear()
                        .domain([0, 1])
                        .range([boxWidth + margin.right + margin.left, 0]);


                    // Compute the new y-scale.
                    var yScale = d3.scale.linear()
                        .domain([min - ((max - min) * 0.05), max + ((max - min) * 0.05)])
                        .range([height , 0]);

                    // Retrieve the old x-scale, if this is an update.
                    var yScaleOld = this.__chart__ || d3.scale.linear()
                        .domain([min - ((max - min) * 0.05), max + ((max - min) * 0.05)])
                        .range([height/* + margin.bottom + margin.top*/, 0]);


                    // Stash the new scale.
                    this.__chart__ = yScale;


                    xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom");

                    yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");


                    // Note: the box, median, and box tick elements are fixed in number,
                    // so we only have to handle enter and update. In contrast, the outliers
                    // and other elements are variable, so we need to exit them! Variable
                    // elements also fade in and out.

                    // Update center line: the vertical line spanning the whiskers.
                    var center = g.selectAll("line.center")
                        .data(whiskerData ? [whiskerData] : []);

                    center.enter().append("line", "rect")
                        .attr("class", "center")
                        .attr("x1", centerForBox)
                        .attr("y1", function (d) {
                            return yScaleOld(d[0]);
                        })
                        .attr("x2", centerForBox)
                        .attr("y2", function (d) {
                            return yScaleOld(d[1]);
                        })
                        .style("opacity", 1e-6)
                        .transition()
                        .duration(duration)
                        .style("opacity", 1)
                        .attr("y1", function (d) {
                            return yScale(d[0]);
                        })
                        .attr("y2", function (d) {
                            return yScale(d[1]);
                        });

                    center.transition()
                        .duration(duration)
                        .style("opacity", 1)
                        .attr("y1", function (d) {
                            return yScale(d[0]);
                        })
                        .attr("y2", function (d) {
                            return yScale(d[1]);
                        });

                    center.exit().transition()
                        .duration(duration)
                        .style("opacity", 1e-6)
                        .attr("y1", function (d) {
                            return yScale(d[0]);
                        })
                        .attr("y2", function (d) {
                            return yScale(d[1]);
                        })
                        .remove();

                    // Update innerquartile box.
                    var box = g.selectAll("rect.box")
                        .data([quartileData]);

                    box.enter().append("rect")
                        .attr("class", "box")
                        .attr("x", leftEdgeOfBox)
                        .attr("y", function (d) {
                            return yScaleOld(d[2]);
                        })
                        .attr("width", boxWidth)
                        .attr("height", function (d) {
                            return yScaleOld(d[0]) - yScaleOld(d[2]);
                        })
                        .transition()
                        .duration(duration)
                        .attr("y", function (d) {
                            return yScale(d[2]);
                        })
                        .attr("height", function (d) {
                            return yScale(d[0]) - yScale(d[2]);
                        });

                    box.transition()
                        .duration(duration)
                        .attr("y", function (d) {
                            return yScale(d[2]);
                        })
                        .attr("height", function (d) {
                            return yScale(d[0]) - yScale(d[2]);
                        });

                    box.exit().remove();

                    // Update median line.
                    var medianLine = g.selectAll("line.median")
                        .data([quartileData[1]]);

                    medianLine.enter().append("line")
                        .attr("class", "median")
                        .attr("x1", leftEdgeOfBox)
                        .attr("y1", yScaleOld)
                        .attr("x2", rightEdgeOfBox)
                        .attr("y2", yScaleOld)
                        .transition()
                        .duration(duration)
                        .attr("y1", yScale)
                        .attr("y2", yScale);

                    medianLine.transition()
                        .duration(duration)
                        .attr("y1", yScale)
                        .attr("y2", yScale);

                    medianLine.exit().remove();

                    // Update whiskers. These are the lines outside
                    //  of the boxes, but not including text or outliers.
                    var whisker = g.selectAll("line.whisker")
                        .data(whiskerData || []);

                    whisker.enter().append("line", "circle, text")
                        .attr("class", "whisker")
                        .attr("x1", leftEdgeOfBox)
                        .attr("y1", yScaleOld)
                        .attr("x2", rightEdgeOfBox)
                        .attr("y2", yScaleOld)
                        .style("opacity", 1e-6)
                        .transition()
                        .duration(duration)
                        .attr("y1", yScale)
                        .attr("y2", yScale)
                        .style("opacity", 1);

                    whisker.transition()
                        .duration(duration)
                        .attr("y1", yScale)
                        .attr("y2", yScale)
                        .style("opacity", 1);

                    whisker.exit().transition()
                        .duration(duration)
                        .attr("y1", yScale)
                        .attr("y2", yScale)
                        .style("opacity", 1e-6)
                        .remove();

                    // Update outliers.  These are the circles that Mark data outside of the whiskers.
                    var outlier = g.selectAll("circle.outlier")
                        .data(outlierIndices || [], Number);


                    outlier.enter()
                        .append("a")
                        .attr("class", "clickable")
                        .attr("gpn", function (i) {
                            return d2[i].description;
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .append("circle", "text")
                        .attr("class", "outlier")
                        .attr("r", function (d) {
                            return outlierRadius;
                        })
                        .attr("cx", function (i) {
                            return jitter.currentX(centerForBox, yScaleOld(d2[i].v));
                        })
                        .attr("cy", function (i) {
                            return jitter.currentY(centerForBox, yScaleOld(d2[i].v));
                        })
                        .style("opacity", 1e-6)

                        .transition()
                        .duration(duration)
                        .attr("r", function (d) {
                            return outlierRadius;
                        })
                        .attr("cx", function (i) {
                            return jitter.currentX(centerForBox, yScaleOld(d2[i].v));
                        })
                        .attr("cy", function (i) {
                            return jitter.currentY(centerForBox, yScaleOld(d2[i].v));
                        })
                        .style("opacity", 1)
                    ;

                    outlier.transition()
                        .duration(duration)
                        .attr("r", function (d) {
                            return outlierRadius;
                        })
                        .attr("cx", function (i) {
                            return jitter.currentX(centerForBox, yScaleOld(d2[i].v));
                        })
                        .attr("cy", function (i) {
                            return jitter.currentY(centerForBox, yScaleOld(d2[i].v));
                        })
                        .style("opacity", 1);

                    outlier.exit()
                        .transition()
                        .duration(duration)
                        .attr("r", function (d) {
                            return 0;
                        })
                        .remove();

                    // Compute the tick format.
                    var format = tickFormat || yScale.tickFormat(8);

                    // Update box ticks. These are the numbers on the
                    //     sides of the box
                    var boxTick = g.selectAll("text.box")
                        .data(quartileData);

                    boxTick.enter().append("text")
                        .attr("class", "box")
                        .attr("dy", ".3em")
                        .attr("dx", function (d, i) {
                            return i & 1 ? 6 : -6;
                        })
                        .attr("x", function (d, i) {
                            return i & 1 ? rightEdgeOfBox : leftEdgeOfBox ;
                        })
                        .attr("y", yScaleOld)
                        .attr("text-anchor", function (d, i) {
                            return i & 1 ? "start" : "end";
                        })
                        .text(format)
                        .transition()
                        .duration(duration)
                        .attr("y", yScale);

                    boxTick.transition()
                        .duration(duration)
                        .text(format)
                        .attr("y", yScale);

                    // Update whisker ticks. These are the numbers on the side of the whiskers.
                    //
                    // These are handled separately from the box
                    // ticks because they may or may not exist, and we want don't want
                    // to join box ticks pre-transition with whisker ticks post-.
                    var whiskerTick = g.selectAll("text.whisker")
                        .data(whiskerData || []);

                    whiskerTick.enter().append("text")
                        .attr("class", "whisker")
                        .attr("dy", ".3em")
                        .attr("dx", 6)
                        .attr("x", rightEdgeOfBox)
                        .attr("y", yScaleOld)
                        .text(format)
                        .style("opacity", 1e-6)
                        .transition()
                        .duration(duration)
                        .attr("y", yScale)
                        .style("opacity", 1);

                    whiskerTick.transition()
                        .duration(duration)
                        .text(format)
                        .attr("y", yScale)
                        .style("opacity", 1);

                    whiskerTick.exit().transition()
                        .duration(duration)
                        .attr("y", yScale)
                        .style("opacity", 1e-6)
                        .remove();


                    //
                    // provide a single label underneath each box whisker
                    //
                    var boxWhiskerLabel = g.selectAll("text.boxWhiskerLabel")
                        .data(['X'] || []);

                    boxWhiskerLabel.enter().append("text")
                        .attr("class", "boxWhiskerLabel")
                        .attr("x", centerForBox)
                        .attr("y", height )
                        .style("text-anchor", "middle")
                        .style("font-weight", "bold")
                        .text(d.name)
                        .style("opacity", 1e-6)
                        .transition()
                        .duration(duration)
                        .style("opacity", 1);

                    boxWhiskerLabel.transition()
                        .duration(duration)
                        .style("opacity", 1);

                    boxWhiskerLabel.exit().transition()
                        .duration(duration)
                        .style("opacity", 1)
                        .remove();





                    // y axis
                    selection
                        .select("svg").selectAll("g.y").data([1]).enter()
                        .append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(32,0)")
                        .call(yAxis)
                        .append("text")
                        .attr("class", "label")
                        .attr("x", 0)
                        .attr("y", height / 2 + margin.top + margin.bottom)
                        .style("text-anchor", "middle")
                        .style("font-weight", "bold")
                        .text('');

                    // x axis
//                    selection
//                        .select("svg").selectAll("g.x").data([1]).enter()
//                        .append("g")
//                        .attr("class", "x axis")
//                        .attr("transform", "translate(0," + (height) + ")")
//                        .call(xAxis)
//                        .append("text")
//                        .attr("class", "label")
//                        .attr("x", (width + margin.left + margin.right) / 2)
//                        .attr("y", margin.bottom)
//                        .style("text-anchor", "middle")
//                        .style("font-weight", "bold")
//                        .text(boxWhiskerName);


                });
            d3.timer.flush();
        };


        // Note:  this method will assign data to the DOM
        instance.initData = function (x) {
            if (!arguments.length) return boxWhiskerData;
            boxWhiskerData = x;
            var bwHolderLength,
                valueToConsider;
            var bwPlot = selection
                .append("svg")
                .attr("class", "box")
                .attr("width", "470px")
                .attr("height", "500px")
                .selectAll("g")
                .data(boxWhiskerData)
                .enter()
                .append('g')
                .attr("class", "boxHolder") ;
               // .attr("transform", "translate(" + margin.left + ",0)");

            // calculate the maximum and min.  The user can override these
            // if they like.
            min = Infinity;
            max = -Infinity;
            for ( var i = 0 ; i < boxWhiskerData.length ; i++ ) {
                bwHolderLength =  boxWhiskerData[i].data.length;
                for ( var j = 0 ; j < bwHolderLength ; j++)   {
                    valueToConsider=boxWhiskerData[i].data[j].v;
                    if (valueToConsider > max) { max = valueToConsider; }
                    if (valueToConsider < min) { min = valueToConsider; }
                }
            }

            return instance;
        };

        // Note:  this method will assign data to the DOM
        instance.assignData = function (x) {
            if (!arguments.length) return boxWhiskerData;
            boxWhiskerData = x;
            var bwPlot = selection
                .selectAll("svg")
                .data(boxWhiskerData);

            var bwPlotExt = bwPlot.enter()
                .append("svg")
                .attr("class", "box")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.bottom + margin.top);


            bwPlotExt.append("g")
                .attr("class", "boxHolder")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(tip);

            return instance;
        };

        instance.width = function (x) {
            if (!arguments.length) return width;
            width = x;
            return instance;
        };


        instance.min = function (x) {
            if (!arguments.length) return min;
            min = x;
            return instance;
        };

        instance.max = function (x) {
            if (!arguments.length) return max;
            max = x;
            return instance;
        };

        instance.height = function (x) {
            if (!arguments.length) return height;
            height = x;
            return instance;
        };

        instance.tickFormat = function (x) {
            if (!arguments.length) return tickFormat;
            tickFormat = x;
            return instance;
        };

        instance.value = function (x) {
            if (!arguments.length) return value;
            value = x;
            return instance;
        };


        instance.whiskers = function (x) {
            if (!arguments.length) return whiskers;
            whiskers = x;
            return instance;
        };

        instance.outlierRadius = function (x) {
            if (!arguments.length) return outlierRadius;
            outlierRadius = x;
            return instance;
        };

        // identify the dominant element upon which we will hang this graphic
        instance.selectionIdentifier = function (x) {
            if (!arguments.length) return selectionIdentifier;
            selectionIdentifier = x;
            selection = d3.select(selectionIdentifier);
            return instance;
        };

        instance.boxWhiskerName = function (x) {
            if (!arguments.length) return boxWhiskerName;
            boxWhiskerName = x;
            return instance;
        };

        // Methods to be activated to create the scatter plot
        instance.scatterDataCallback = function (x) {
            if (!arguments.length) return scatterDataCallback;
            scatterDataCallback = x;
            return instance;
        };


        // Methods used to retrieve data in response to a box whisker outlier click.  Necessary only if the default won't  suit you
        instance.retrieveCorrelationData = function (x) {
            if (!arguments.length) return retrieveCorrelationData;
            retrieveCorrelationData = x;
            return instance;
        };

        return instance;
    };

    function boxWhiskers(d) {
        return [0, d.length - 1];
    }

    function boxQuartiles(d) {
        var accumulator = [];
        d.forEach(function (x) {
            accumulator.push(x.v);
        });
        return [
            d3.quantile(accumulator, .25),
            d3.quantile(accumulator, .5),
            d3.quantile(accumulator, .75)
        ];
    }

})();
