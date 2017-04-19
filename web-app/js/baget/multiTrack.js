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
            data,// array of arrays of real values
            container, // text for a CSS selector
            xlabelsData,// dataform = ['xlab1','xlab2'],
            ylabelsData,// dataform = ['ylab1','ylab2'],
            startColor = '#ffffff',
            endColor = '#3498db',
            widthLegend = 100,
            renderLegend = 1,
            renderCellText = 1;

        // private variables
        var instance = {};

        // build a legend
        var renderLegendNow = function ( legendSelector,
                                         widthLegend,
                                         height,
                                         margin,
                                         startColor,
                                         endColor,
                                         minValue,
                                         maxValue )  {
            var key = d3.select("#legend")
                .append("svg")
                .attr("width", widthLegend)
                .attr("height", height + margin.top + margin.bottom);

            var legend = key
                .append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "100%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            legend
                .append("stop")
                .attr("offset", "0%")
                .attr("stop-color", endColor)
                .attr("stop-opacity", 1);

            legend
                .append("stop")
                .attr("offset", "100%")
                .attr("stop-color", startColor)
                .attr("stop-opacity", 1);

            key.append("rect")
                .attr("width", widthLegend/2-10)
                .attr("height", height)
                .style("fill", "url(#gradient)")
                .attr("transform", "translate(0," + margin.top + ")");

            var y = d3.scale.linear()
                .range([height, 0])
                .domain([minValue, maxValue]);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("right");

            key.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(41," + margin.top + ")")
                .call(yAxis)

        };
        

        // Now walk through the DOM and create the enrichment plot
        instance.render = function (currentSelection) {

            /// check the data
            if(!data){
                throw new Error('Please pass data');
            }

            if( !Array.isArray(data) ){
                throw new Error('multiTrack expects array data, even if length 0');
            }

            var numrows = data.length;

            var minValue = d3.min(data, function(d) { return d.START; });
            var maxValue = d3.max(data, function(d) { return d.STOP; });

            var svg = d3.select(container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            var background = svg.append("rect")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("fill", "white")
                .attr("width", width)
                .attr("height", height)


            var x = d3.scale.linear()
                .domain([minValue,maxValue])
                .range([0, width]);

            var y = d3.scale.ordinal()
                .domain(d3.range(numrows))
                .rangeBands([0, height]);

            var colorMap = d3.scale.linear()
                .domain([minValue,maxValue])
                .range([startColor, endColor]);

            var row = svg.selectAll(".row")
                .data(data)
                .enter().append("g")
                .attr("class", "row")
                .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

            row.append('rect')
                .attr("x", function(v){
                    return x(v.START);
                })
                .attr("y", 0)
                .attr("width", function(v){
                    return x(v.STOP)-x(v.START);})
                .attr("height", y.rangeBand()/2)
                .style("stroke-width", 0)
                .style("fill",endColor)

            var labels = svg.append('g')
                .attr('class', "labels");

            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            // x-axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 35)
                .attr("text-anchor", "start")
                .attr("transform", "rotate(60)");

                // .append("text")
                // .attr("class", "label")
                // .attr("x", width)
                // .attr("y", -6)
                // .style("text-anchor", "end")
                // .text("Calories");



            if (typeof ylabelsData !== 'undefined'){
                var rowLabels = labels.selectAll(".row-label")
                    .data(ylabelsData)
                    .enter().append("g")
                    .attr("class", "row-label")
                    .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

                rowLabels.append("line")
                    .style("stroke", "black")
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


            if (renderLegend){
                renderLegendNow('#legend',
                    widthLegend,
                    height,
                    margin,
                    startColor,
                    endColor,
                    minValue,
                    maxValue);
            }

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

        instance.renderLegend = function (x) {
            if (!arguments.length) return renderLegend;
            renderLegend = x;
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