/***
 *               --------------QQplot--------------
 *
 * This JavaScript file should be sufficient for creating a QQplot. Combine this single module with other
 * modules to create a more fully featured interactive visualization.
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
            data = options.data,
            container = options.container,
            labelsData = options.labels,
            xlabelsData = options.xlabels,
            ylabelsData = options.ylabels,
            startColor = options.start_color,
            endColor = options.end_color,
            widthLegend = 100;

            // private variables
            instance = {};


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
                        var number = parseFloat(xAxisAccessor(d));
                        textToPresent = "Expected p = "+number.toPrecision(3) ;
                    }
                }
                return "<strong><span>" + textToPresent + "</span></strong> ";
            });



        // Now walk through the DOM and create the enrichment plot
        instance.render = function (currentSelection) {

           // svg = currentSelection.select('svg'); // get main holding DOM element
           // data = svg.selectAll('g.allGroups').data();   // get all data sets
           // var insideScatterGroup = svg.select('g.scatter');   // get all data sets
            if(!data){
                throw new Error('Please pass data');
            }

            if(!Array.isArray(data) || !data.length || !Array.isArray(data[0])){
                throw new Error('It should be a 2-D array');
            }

            var maxValue = d3.max(data, function(layer) { return d3.max(layer, function(d) { return d; }); });
            var minValue = d3.min(data, function(layer) { return d3.min(layer, function(d) { return d; }); });

            var numrows = data.length;
            var numcols = data[0].length;

            var svg = d3.select(container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var background = svg.append("rect")
                .style("stroke", "black")
                .style("stroke-width", "2px")
                .attr("width", width)
                .attr("height", height);

            var x = d3.scale.ordinal()
                .domain(d3.range(numcols))
                .rangeBands([0, width]);

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

            var cell = row.selectAll(".cell")
                .data(function(d) { return d; })
                .enter().append("g")
                .attr("class", "cell")
                .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

            cell.append('rect')
                .attr("width", x.rangeBand())
                .attr("height", y.rangeBand())
                .style("stroke-width", 0);

            cell.append("text")
                .attr("dy", ".32em")
                .attr("x", x.rangeBand() / 2)
                .attr("y", y.rangeBand() / 2)
                .attr("text-anchor", "middle")
                .style("fill", function(d, i) { return d >= maxValue/2 ? 'white' : 'black'; })
                .text(function(d, i) { return d; });

            row.selectAll(".cell")
                .data(function(d, i) { return data[i]; })
                .style("fill", colorMap);

            var labels = svg.append('g')
                .attr('class', "labels");

            var columnLabels = labels.selectAll(".column-label")
                .data(xlabelsData)
                .enter().append("g")
                .attr("class", "column-label")
                .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });

            columnLabels.append("line")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .attr("x1", x.rangeBand() / 2)
                .attr("x2", x.rangeBand() / 2)
                .attr("y1", 0)
                .attr("y2", 5);

            columnLabels.append("text")
                .attr("x", 0)
                .attr("y", y.rangeBand() / 2)
                .attr("dy", ".82em")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-60)")
                .text(function(d, i) { return d; });

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
                .attr("y1", y.rangeBand() / 2)
                .attr("y2", y.rangeBand() / 2);

            rowLabels.append("text")
                .attr("x", -8)
                .attr("y", y.rangeBand() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "end")
                .text(function(d, i) { return d; });

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

        // assign data to the DOM
        instance.assignData = function (x) {
            if (!arguments.length) return data;
            data = x;
            return instance;
        };


        /***
         * This is not a standard accessor.  The purpose of this method is to take a DOM element and to
         *  attach the data to it.  All further references to the data should come through that DOM element.
         * @param x
         * @returns {*}
         */
        instance.dataHanger = function (selectionIdentifier, data) {


            selection = d3.select(selectionIdentifier)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "scatter")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(tip)


            return instance;
        };




        return instance;
    };

})();