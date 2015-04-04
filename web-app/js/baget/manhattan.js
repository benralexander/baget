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


        // private variables
            instance = {},
            globalMinimum,
            globalMaximum;
        // private variables


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


            var margin = {top: 20, right: 15, bottom: 60, left: 60}
                , width = 960 - margin.left - margin.right
                , height = 500 - margin.top - margin.bottom;

            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.x; })])
                .range([ 0, width ]);

            var y = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.y; })])
                .range([ height, 0 ]);

            var chart = currentSelection
                .append('svg:svg')
                .attr('width', width + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .attr('class', 'chart')

            var main = chart.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'main')

            // draw the x axis
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            main.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .attr('class', 'main axis date')
                .call(xAxis);

            // draw the y axis
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            main.append('g')
                .attr('transform', 'translate(0,0)')
                .attr('class', 'main axis date')
                .call(yAxis);

            var g = main.append("svg:g");

            g.selectAll("scatter-dots")
                .data(data)
                .enter().append("svg:circle")
                .attr("cx", function (d,i) { return x(d.x); } )
                .attr("cy", function (d) { return y(d.y); } )
                .attr("r", 8);




        } ;


        instance.dataHanger = function (selectionIdentifier, data) {

            selection = d3.select(selectionIdentifier)
                .selectAll('svg.mychart')
                .data([1])
                .enter()
                .append('svg')
                .attr('class', 'mychart')
                .attr('width', width*1.5)
                .attr('height', height*1.4);
            selection
                .selectAll('.dot')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr("r", 3.5)
                .attr("cx", 50)
                .attr("cy", 100)
                .style("fill", function(d) { return color(4);})
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



        return instance;
    };

})();