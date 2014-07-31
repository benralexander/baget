var baget = baget || {};

(function () {

    baget.qqPlot = function () {

        // the variables we intend to surface
        var
            width = 1,
            height = 1,
            margin = {},
            selectionIdentifier = '',  // string to identify the Dom object that will serve as our route
            data = {},
            xAxisLabel = 'expected',  // default X axis label
            yAxisLabel = 'observed',  // default Y axis label
            xAxisAccessor = function (d) {
                return d.x;   //    default key name for the JSON field holding X values
            },
            yAxisAccessor = function (d) {
                 return d.y;    //    default key name for the JSON field holding Y values
            },
            tooltipAccessor = function (d) {
                 return d.p;      //    default key name for the JSON field holding tooltip values
            },
            externalLinkAccessor = function (d) {
                return d.u;      //    default key name for the JSON field holding tooltip values
            },
            displayIdentityLine = true,// By default we will display the identity line
            displaySignificanceLine = false,  // By default we will not display the Significance line
            significanceLineValue,            // There is no default significance line value
            clickCallback = function (d, i) {
                if (( typeof(d) !==  "undefined") &&
                    ( typeof(externalLinkAccessor) !==  "undefined")  &&
                    ( typeof(externalLinkAccessor(d)) !==  "undefined")){
                    window.open(externalLinkAccessor(d))
                }  else {
                    console.log ('default callback function for dot click. Missing external link or else link accessor is incorrectly defined.')
                }

            },


        // private variables
            instance = {},// this is our self identifier object.  Sort of like a 'this'
            selection, // the Dom object from which we are rooted
            dataDots,
            x,
            y,
            color,
            legendColor = d3.scale.category10(),
            xAxis,
            yAxis,
            svg,
            groupHolder,
            globalMinimum,
            globalMaximum,

        //  private variable
            tip = d3.tip()
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
                            var number = parseFloat(xAxisAccessor(d));
                            textToPresent = "Expected p = "+number.toPrecision(3) ;
                        }
                    }
                    return "<strong><span>" + textToPresent + "</span></strong> ";
                });


        function zoomed() {

            selection.select(".x.axis").call(xAxis);
            selection.select(".y.axis").call(yAxis);
            selection.selectAll(".dot").attr("cx",function(d,i) {
                return x(xAxisAccessor(d));
            }).attr("cy",function(d,i) {
                return y(yAxisAccessor(d));
            });

            selection.selectAll(".significanceLine").attr("x1",function(d,i) {
                return x(x.domain()[0]);
            })
            .attr("x2",function(d,i) {
                return x(x.domain()[1]);
            })
            .attr("y1",function(d,i) {
                return y(d);
            })
            .attr("y2",function(d,i) {
                return y(d);
            });

            selection.select('#identityLine')
                .attr("x1", function (d) {
                    return x(d.min)
                })
                .attr("y1",function (d) {
                    return y(d.min)
                })
                .attr("x2",  function (d) {
                    return x(d.max)
                })
                .attr("y2",  function (d) {
                    return y(d.max)
                });
        }


        function defineBodyClip(svg,xStart,yStart,xEnd,yEnd) {
            var padding = 5,

            bodyClip = svg.select('#groupHolder').selectAll('#body-clip')
                .data([{}]);

            bodyClip.enter().append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", xStart)
                .attr("y", yStart)
                .attr("width", xEnd)
                .attr("height", yEnd);

          }



        // Now walk through the DOM and create the enrichment plot
        instance.render = function (g) {

            x = d3.scale.linear()
                .range([0, width]);

            y = d3.scale.linear()
                .range([height, 0]);

            color = function (d){
                if ((displaySignificanceLine)  && (typeof(significanceLineValue) !=="undefined")) {
                    if (yAxisAccessor (d) > significanceLineValue){
                        return d3.rgb("#ff00ff");
                    } else {
                        return d3.rgb("#ffffff");
                    }
                } else {
                    return d3.rgb("#ffffff");
                }
            }


            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            if (!svg) {
                svg = selection
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("class", "scatter")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .call(tip);
            }

            groupHolder = svg.selectAll('#groupHolder')
                .data([{}])
                .enter()
                .append('g')
                .attr('id','groupHolder')
                .attr("clip-path", "url(#body-clip)");



            // find the maximum in the minimums in order to scale the plot
            x.domain(d3.extent(data, xAxisAccessor)).nice();
            y.domain(d3.extent(data, yAxisAccessor)).nice();

            if (displayIdentityLine){
                // The identity line we want to draw should fit inside the axes defined
                //  by the set of points that constitute a queue queue plot. Therefore
                //  we establish the minimum/maximum values for each axis, and then compare
                //  those extremes against one another to generate 'the minimum of the maximums'
                //  and 'the maximum of the minimums'.  These points defined the identity line
                //  in the qqplot
                globalMinimum = (x.domain()[0] > y.domain()[0])? x.domain()[0]:  y.domain()[0],
                globalMaximum = (x.domain()[1] < y.domain()[1])? x.domain()[1]:  y.domain()[1];

                identityLine = d3.select('#groupHolder').selectAll('#identityLine').data([{min:globalMinimum,max:globalMaximum}]);

                identityLine.enter().append("line")
                    .attr("id","identityLine")
                    .attr("x1", function (d) {
                        return x(d.min)
                    })
                    .attr("y1",function (d) {
                        return y(d.min)
                    })
                    .attr("x2",  function (d) {
                        return x(d.max)
                    })
                    .attr("y2",  function (d) {
                        return y(d.max)
                    })
                    .attr("stroke-width", 0)
                    .attr("stroke", "black");

                identityLine.transition()
                    .duration(500)
                    .attr("stroke-width", 1.5);

            } else {
                svg.selectAll("#identityLine").remove();
            }


            var zoom = d3.behavior.zoom()
                .x(x)
                .y(y)
                .scaleExtent([1, 100])
                .on("zoom", zoomed);

            selection.call(zoom);


            if ((displaySignificanceLine)  && (typeof(significanceLineValue) !=="undefined")){

                var significanceDifferentiator  =  d3.select('#groupHolder').selectAll(".significanceLine").data([significanceLineValue]);

                significanceDifferentiator.enter().append("line")
                    .attr("class", "significanceLine")
                    .attr("x1", x(x.domain()[0]))
                    .attr("y1", function(d){
                            return y(d);
                     })
                    .attr("x2", x(x.domain()[1]))
                    .attr("y2", function(d){
                        return y(d);
                    })
                    .attr("stroke-width", 2)
                    .attr("stroke", "red");

                significanceDifferentiator.transition()
                    .duration(1000)
                    .attr("y1", function(d){
                        return y(d);
                    })
                    .attr("y2", function(d){
                        return y(d);
                    });

                significanceDifferentiator.exit().remove();

            } else {
                svg.selectAll(".significanceLine").data([significanceLineValue]).remove();
            }

            svg.selectAll("#xAxis")
                .data([1])
                .enter()
                .append("g")
                .attr("id", "xAxis")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width / 2)
                .attr("y", 40)
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .text(xAxisLabel);

            svg.selectAll("#yAxis")
                .data([1])
                .enter()
                .append("g")
                .attr("id", "yAxis")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "-3em")
                .attr("x", -height / 2)
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .text(yAxisLabel);

            /***
             * data.handling
             */
            dataDots = d3.select('#groupHolder').selectAll(".dot")
                .data(data);

            dataDots.enter()
                .append("circle")
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .on('click', clickCallback)

                .attr("class", "dot")
                .attr("r", 3)
                .attr("cx", function (d) {
                    return x(xAxisAccessor(d));
                })
                .attr("cy", function (d) {
                    return y(yAxisAccessor(d));
                })
                .style("fill", function (d) {
                    return color(d);
                });


            dataDots.transition()
                .duration(1000)
                .style("fill", function (d) {
                    return color(d);
                });

            dataDots.exit().transition()
                .style("fill", function (d) {
                    return color(d);
                })
                .remove();


            /***
             * legend handling
             */
            var legend = svg.selectAll(".legend")
                .data(legendColor.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + ((i * 20) - margin.top) + ")";
                });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", legendColor);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });

            defineBodyClip(svg,x(x.domain()[0]),y(y.domain()[1]),x(x.domain()[1]),y(y.domain()[0]));

        };

        // assign data to the DOM
        instance.assignData = function (x) {
            if (!arguments.length) return data;
            data = x;
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

        instance.tooltipAccessor = function (x) {
            if (!arguments.length) return tooltipAccessor;
            tooltipAccessor = x;
            return instance;
        };

        instance.externalLinkAccessor = function (x) {
            if (!arguments.length) return externalLinkAccessor;
            externalLinkAccessor = x;
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


        instance.xAxisLabel = function (x) {
            if (!arguments.length) return xAxisLabel;
            xAxisLabel = x;
            return instance;
        };

        instance.yAxisLabel = function (x) {
            if (!arguments.length) return yAxisLabel;
            yAxisLabel = x;
            return instance;
        };

        instance.margin = function (x) {
            if (!arguments.length) return margin;
            margin = x;
            return instance;
        };

        instance.clickCallback = function (x) {
            if (!arguments.length) return clickCallback;
            clickCallback = x;
            return instance;
        };

        instance.displayIdentityLine = function (x) {
            if (!arguments.length) return displayIdentityLine;
            displayIdentityLine = x;
            return instance;
        };

        instance.displaySignificanceLine = function (x) {
            if (!arguments.length) return displaySignificanceLine;
            displaySignificanceLine = x;
            var newSignificanceValue;
            if (displaySignificanceLine) {
                newSignificanceValue =  (y.domain()[0] +  y.domain()[1])/2.0;
            }  else {
                newSignificanceValue =  undefined;
            }
            instance.significanceLineValue (newSignificanceValue); //significanceLineValue
            return instance;
        };

        instance.significanceLineValue = function (x) {
            if (!arguments.length) return significanceLineValue;
            significanceLineValue = x;
            return instance;
        };

        instance.selectionIdentifier = function (x) {
            if (!arguments.length) return selectionIdentifier;
            selectionIdentifier = x;
            selection = d3.select(selectionIdentifier);
            return instance;
        };

        return instance;
    };

})();