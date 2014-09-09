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
     * Everyone seems to use three digits of precision. I wonder why
     * @param incoming
     * @returns {string}
     */
    realNumberFormatter: function (incoming) {
        var value = parseFloat(incoming);
        return value.toPrecision(3);
    },
    /***
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
    }
}