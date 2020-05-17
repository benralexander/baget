/***
 *               --------------multiTrack--------------
 *
 * This JavaScript file should be sufficient for plotting multitrack genomic data.
 *
 * @type {baget|*|{}}
 */



var baget = baget || {};  // encapsulating variable

(function () {

    /***
     * The
     * @returns {{}}
     */

    baget.matrix = function (options) {

        // the variables we intend to surface
        var
            margin = {top: 50, right: 50, bottom: 100, left: 100},
            width = 350,
            height = 350,
            data,// array of arrays of objects
            container, // text for a CSS selector
            xlabelsData,// dataform = ['xlab1','xlab2'],
            ylabelsData,// dataform = ['ylab1','ylab2'],
            startColor = '#ffffff',
            endColor = '#3498db',
            renderCellText = 1;

        // private variables
        var instance = {};


        // Now walk through the DOM and create the enrichment plot
        instance.render = function (currentSelection) {

            /// check the data
            if(!data){
                throw new Error('multiTrack expects data');
            }

            if( !Array.isArray(data) ){
                throw new Error('multiTrack expects array data, even if length 0');
            }

            var numrows = data.length;

            var minValue = d3.min(data, function(layer) { return d3.max(layer, function(f) { return f.START; }); });
            var maxValue = d3.max(data, function(layer) { return d3.max(layer, function(f) { return f.STOP; }); });

            var svg = d3.select(container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('class','trackHolder')
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // gives us an outline around the drawing area
            var background = svg.append("rect")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("fill", "white")
                .attr("width", width)
                .attr("height", height)

            var xDomain = [minValue,maxValue];
            var x = d3.scaleLinear()
                .domain(xDomain)
                .range([0, width]);

            var yDomain = d3.range(numrows);
            var y = d3.scaleOrdinal()
                .domain(yDomain)
                .rangeBands([0, height]);

            var row = svg.selectAll(".row")
                .data(data)
                .enter().append("g")
                .attr("class", "row")
                .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

            var element = row.selectAll(".element")
                .data(function(d) { return d; })
                .enter().append("g")
                .attr("class", "element")
                .attr("transform", function(d, i) { return "translate(" + x(d.START) + ", 0)"; });

            element.append('rect')
                .attr("width", function(v){
                    return x(v.STOP)-x(v.START);})
                .attr("height", y.rangeBand()/2)
                .style("stroke-width", 1)
                .style("stroke", "black")
                .style("fill",endColor)

            var labels = svg.append('g')
                .attr('class', "labels");

            // x-axis
            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 35)
                .attr("text-anchor", "start")
                .attr("transform", "rotate(60)");


            // label those tissues on the y-axis
            if (typeof ylabelsData !== 'undefined'){
                var rowLabels = labels.selectAll(".row-label")
                    .data(ylabelsData)
                    .enter().append("g")
                    .attr("class", "row-label")
                    .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

                rowLabels.append("line")
                    .style("stroke-width", "1px")
                    .attr("x1", 0)
                    .attr("x2", -5)
                    .attr("y1", (1*y.rangeBand() / 4))
                    .attr("y2", (1*y.rangeBand() / 4));

                rowLabels.append("text")
                    .attr("x", -8)
                    .attr("y", (1*y.rangeBand() / 4))
                    .attr("dy", ".32em")
                    .attr("text-anchor", "end")
                    .text(function(d, i) { return d; });
            }

            // build a crosshair attached to the pointer
            var label = labels.append("text")
                .attr("x", width - 5)
                .attr("y", height - 5)
                .attr("class", "mouseReporter")
                .style("text-anchor", "end");
            var xScale = x;
            var crosshair = svg.append("g")
                .attr("class", "line");
            crosshair.append("line")
                .attr("id", "crosshairX")
                .attr("class", "crosshair");
            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() {
                    crosshair.style("display", null);
                })
                .on("mouseout", function() {
                    crosshair.style("display", "none");
                    label.text("");
                })
                .on("mousemove", function() {
                    var mouse = d3.mouse(this);
                    var x = mouse[0];
                    crosshair.select("#crosshairX")
                        .attr("x1", mouse[0])
                        .attr("y1", 0)
                        .attr("x2", mouse[0])
                        .attr("y2", height);
                    label.text(function() {
                        return "position = "+Math.round(xScale.invert(mouse[0]));
                    });
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

        instance.xlabelsData = function (x) {
            if (!arguments.length) return xlabelsData;
            xlabelsData = x;
            return instance;
        };
        instance.ylabelsData = function (x) {
            if (!arguments.length) return ylabelsData;
            ylabelsData = x;
            return instance;
        };
        instance.startColor = function (x) {
            if (!arguments.length) return startColor;
            startColor = x;
            return instance;
        };
        instance.endColor = function (x) {
            if (!arguments.length) return endColor;
            endColor = x;
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

        instance.margin = function (x) {
            if (!arguments.length) return margin;
            margin = x;
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

        instance.renderCellText = function (x) {
            if (!arguments.length) return renderCellText;
            renderCellText = x;
            return instance;
        };

        instance.clickCallback = function (x) {
            if (!arguments.length) return clickCallback;
            clickCallback = x;
            return instance;
        };


        /***
         * This is not a standard accessor.  The purpose of this method is to take a DOM element and to
         *  attach the data to it.  All further references to the data should come through that DOM element.
         * @param x
         * @returns {*}
         */
        instance.dataHanger = function (selectionIdentifier, dataPasser) {

            container = selectionIdentifier;
            data = dataPasser;
            return instance;
        };




        return instance;
    };

})();