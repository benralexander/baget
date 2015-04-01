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
            margin = {},
            selectionIdentifier = '',  // string to identify the Dom object that will serve as our route
            data = {},


        // private variables
            globalMinimum,
            globalMaximum;


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

         } ;

        instance.xAxisAccessor = function (x) {
            if (!arguments.length) return xAxisAccessor;
            xAxisAccessor = x;
            return instance;
        };



        return instance;
    };

})();