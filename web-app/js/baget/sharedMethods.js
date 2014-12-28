/***
 *  sharedMethods.js
 *
 *  Use this module to house all JavaScript functions that need to be called from more than one higher-level JavaScript function.
 *  Generally these would be utility methods, but it could also serve to hold any function that is called more than once. Over
 *  the long-term I could imagine having one of these sharedMethod files that is specific to a particular graphic
 *  ( say a qqPlot) and then a different file to hold general purpose utility methods that are used all over the place.
 *  In its current incarnation this file holds some methods from each category.
 *
 */

var UTILS = {

    /***
     * General-purpose utility that JavaScript ought to have.
     * @param map
     * @returns {{}}
     */
    invertMap: function (map) {
        var inv = {};
        var keys = Object.keys(map);
        for (var i = 0; i < keys.length; i++) {
            if (map[keys[i]]) {
                inv[map[keys[i]]] = keys[i];
            }
        }
        return inv;
    },

    /***
     * One of those things JavaScript ought to have. The only warning-- these maps must share no keys Or
     * else to lose  values
     * @param workingMap
     * @param mapFromWhichWeExtract
     * @returns Resulting concatenated map, though this is also available through the first input parameter
     */
    concatMap: function (workingMap, mapFromWhichWeExtract) {
        if (typeof(workingMap) === "undefined") {
            workingMap = {};
        }
        if (mapFromWhichWeExtract)
            var keys = Object.keys(mapFromWhichWeExtract);
        for (var i = 0; i < keys.length; i++) {
            workingMap[keys[i]] = mapFromWhichWeExtract [keys[i]];
        }
        return workingMap;
    },

    /***
     * Everyone seems to preferred three digits of precision in their display.
     * @param incoming
     * @returns {string}
     */
    realNumberFormatter: function (incoming) {
        var value = parseFloat(incoming);
        return value.toPrecision(3);
    },

    /***
     *  extractDataRange: takes a data file and extracts ranges across multiple sets.
     *
     *   We need to determine the range of the data, since a maximum and minimum value are essential
     *   to building the preliminary set of axes. Assume that data show up in the form of objects containing
     *   X/Y values, as in:
     *   { x: 47.0,
    *     y: 52.87 }
     *   These objects should be held inside arrays, with all objects in a single data set held within a single array.
     *   These arrays should then be packed inside a holding array, allowing us to pass multiple data sets in a single
     *   call. Therefore the final data structure is: arrays of arrays of objects.
     */
    extractDataRange: function (incoming) {
        var maxX, maxY, minX, minY, maxForThisLoop, minForThisLoop, overallMax, overallMin, median;
        if ((typeof(incoming) !== 'undefined') &&
            (Array.isArray(incoming))) {

            for (var i = 0; i < incoming.length; i++) {
                maxX = d3.max(incoming[i], function (d) {
                    return d.x
                });
                maxY = d3.max(incoming[i], function (d) {
                    return d.y
                });
                minX = d3.min(incoming[i], function (d) {
                    return d.x
                });
                minY = d3.min(incoming[i], function (d) {
                    return d.y
                });
                maxForThisLoop = d3.max([maxX, maxY]);
                minForThisLoop = d3.min([minX, minY]);

                if ((typeof(maxForThisLoop) !== 'undefined') &&
                    (typeof(minForThisLoop) !== 'undefined')) {
                    if (typeof(overallMax) === 'undefined') {
                        overallMax = maxForThisLoop;
                    } else {
                        overallMax = d3.max([maxForThisLoop, overallMax]);
                    }
                    if (typeof(overallMin) === 'undefined') {
                        overallMin = minForThisLoop;
                    } else {
                        overallMin = d3.min([minForThisLoop, overallMin]);
                    }
                }
            }
        }
        median = d3.median([overallMin, overallMax]);
        return { max: overallMax, min: overallMin, median: median }
    },
    openTheWindow: function (url, desiredPath) {
        var initialUrl = url;
        var rootUrl = initialUrl.substring(0, initialUrl.length - 12);
        var urlExtension = rootUrl + desiredPath;
        window.open(urlExtension);
    },
    // calculate the first, second, and third quartiles for a given array. Return these
    // numbers in a three membered array.
    boxQuartiles: function (d) {
        var accumulator = [];
        d.forEach(function (x) {
            accumulator.push(x.v);
        });
        return [
            d3.quantile(accumulator, .25),
            d3.quantile(accumulator, .5),
            d3.quantile(accumulator, .75)
        ];
    },
    distributionMapper: function (incomingArray,numberOfBinsRequested,accessor) {
        var defAcc = function (x){return x},
            sortedSet,
            numberOfElements,
            currentBin = 1,
            binWalker,
            returnValue = {binSize:0,binMap:d3.map()};  // indicate error state to begin with
        if (( typeof accessor !== 'undefined')){
            defAcc =  accessor;  // use custom accessor if requested
        }
        if ( ( typeof incomingArray !== 'undefined')    &&
             ( incomingArray.length > 0)    &&
             ( typeof numberOfBinsRequested !== 'undefined') &&
             ( numberOfBinsRequested  >  0)) {   //with all obvious error states ruled out we can start processing
            numberOfElements =  incomingArray.length;
            sortedSet =  incomingArray.sort (function (a,b){return (defAcc (a)-defAcc (b)); }); // sort in ascending order
            returnValue.min =  defAcc(sortedSet[0]);
            returnValue.max =  defAcc(sortedSet[numberOfElements-1]);
            if ((returnValue.max-returnValue.min) > 0){  // make sure ranges nonzero
                  // we are ready to count the elements in each bin
                returnValue.binSize =  (returnValue.max-returnValue.min)/numberOfBinsRequested;
                var curBinCounter = 0;
                binWalker = returnValue.min+(currentBin*returnValue.binSize);
                for ( var i = 0 ; i < numberOfElements ; i++ )   {
                    while (defAcc(incomingArray[i])>binWalker) {
                        returnValue.binMap.set(currentBin,curBinCounter);
                        curBinCounter = 0;
                        currentBin++;
                        binWalker = returnValue.min+(currentBin*returnValue.binSize);
                    } ;
                    curBinCounter++;
                }
                returnValue.binMap.set(numberOfBinsRequested,curBinCounter);
            }
        }
        return returnValue;
    }


}