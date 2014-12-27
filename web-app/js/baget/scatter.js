var cbbo = cbbo || {};

(function () {

    cbbo.scatterPlot = function () {

        // the variables we intend to surface
        var
            width = 1,
            height = 1,
            margin = {},
            selectionIdentifier = '',
            data = {},
            xAxisLabel = '',
            yAxisLabel = '',
            xAxisAccessor,
            yAxisAccessor,
            clickCallback = function (d, i) {
                var cmpd = $('#imageHolder').data('compound'),
                    compoundId = cmpd.compound_id,
                    cellId = d.cell_sample_id;
                setWaitCursor();
                DTGetDoseResponsePoints(compoundId, cellId, function (data) {
                    var chart = d3.doseResponse()
                        .displayGridLines(false)
                        .xAxisLabel('log [' + cmpd.compound_name + ']')
                        .yAxisLabel('Viability')
                        .width('355')
                        .height('360')
                        .title(data.cell_primary_name)
                        .selectionIdentifier('#doseResponseCurve')
                        .autoScale(false)
                        .areaUnderTheCurve([5, 13])
                        .x(d3.scale.log().domain([0.0001, 40]))
                        .y(d3.scale.linear().domain([0, 1.5]));
                    d3.select('.messagepop').style('width', '800px');
                    d3.select('#doseResponseCurve').style('display', 'block');
                    var curves = [data];
                    curves.forEach(function (series) {
                        chart.addSeries(series);
                    });

                    chart.render();
                    removeWaitCursor();
                });
            },


        // private variables
            instance = {},
            selection = {},
            x,
            y,
            color,
            xAxis,
            yAxis,
            svg,

        //  private variable
            tip = d3.tip()
                .attr('class', 'd3-tip scatter-tip')
                .style('z-index', 51)
                .offset([-10, 0])
                .html(function (d) {
                    var textToPresent = "";
                    if (d) {
                        if (d.cell_primary_name) {
                            textToPresent = "CCLE: " + d.cell_primary_name.toString();
                        }
                        else {
                            textToPresent = "CCLE: " + d.toString();
                        }
                    }
                    return "<strong><span>" + textToPresent + "</span></strong> ";
                });


        // assign data to the DOM
        instance.assignData = function (x) {
            if (!arguments.length) return data;
            data = x;
            return instance;
        };


        // Now walk through the DOM and create the enrichment plot
        instance.render = function (g) {

            x = d3.scale.linear()
                .range([0, width]);

            y = d3.scale.linear()
                .range([height, 0]);

            color = d3.scale.category10();

            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var previouslyExistingScatterPlot = selection.selectAll("svg");
            if (previouslyExistingScatterPlot) {
                previouslyExistingScatterPlot.remove();
            }

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

            x.domain(d3.extent(data, xAxisAccessor)).nice();
            y.domain(d3.extent(data, yAxisAccessor)).nice();

            svg.append("g")
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

            svg.append("g")
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

            svg.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .on('click', clickCallback)

                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return x(xAxisAccessor(d));
                })
                .attr("cy", function (d) {
                    return y(yAxisAccessor(d));
                })
                .style("fill", function (d) {
                    return color(d.primary_site[0]);
                });

            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + ((i * 20) - margin.top) + ")";
                });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });

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

        instance.selectionIdentifier = function (x) {
            if (!arguments.length) return selectionIdentifier;
            selectionIdentifier = x;
            selection = d3.select(selectionIdentifier);
            return instance;
        };

        return instance;
    };

})();