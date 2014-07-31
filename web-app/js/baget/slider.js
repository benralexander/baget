var baget = baget || {};

(function () {
    baget.slider = function (domainStart,
                             domainEnd,
                             rangeStart,
                             rangeEnd,
                             orientation/*must be either 'vertical' or 'horizontal'*/,
                             initialSliderValue,
                             onBrushMoveDoThis,
                             onBrushEndDoThis) {
        // public variables
        var

        // private variables
            instance = {},
            scale = {} ,
            svg = {} ,
            brush = {} ,
            handle = {} ,
            slider = {};

        var ctor = function (domainStart, domainEnd, rangeStart, rangeEnd) {
            scale = d3.scale.linear()
                .domain([domainStart, domainEnd])
                .range([rangeStart, rangeEnd])
                .clamp(true);

            // build the brush.  Horizontal and vertical brushes are different
            if (orientation === 'horizontal') {
                brush = d3.svg.brush()
                    .x(scale);
            } else {
                brush = d3.svg.brush()
                    .y(scale);
            }
            brush.extent([rangeEnd, rangeEnd])
                .on("brush", brushed)
                .on("brushend", brushEnded);

            // TODO: make this approach more flxible
            // no more than one
            var oldSliders =  d3.select("#sliderHolder");
            if (oldSliders){
                oldSliders.remove();
            }


            // Define the SVG area and place the slider in the UI.  The translate call is only there to make sure
            // that the top (in the case of a vertical slider) or the left (in the case of a horizontal)
            // isn't sitting off the edge of the visible region.
            if (orientation === 'horizontal') {
                svg = d3.select("#slider").append("svg").attr('id','sliderHolder')
                    .attr("width", rangeEnd + 20).attr("height", "50")
                    .append("g")
                    .attr("transform", "translate(10,10)");
            } else {
                svg = d3.select("#slider").append("svg").attr('id','sliderHolder')
                    .attr("width", "50").attr("height", rangeEnd + 20)
                    .append("g")
                    .attr("transform", "translate(10,10)");

            }


            // build the track along which the slider will slide.  Move it down
            // 20 pixels just to give it a little space
            if (orientation === 'horizontal') {

                svg.append("g")
                    .attr("class", "slider axis")
                    .attr("transform", "translate(0,20)")
                    .call(d3.svg.axis()
                        .scale(scale)
                        .orient("bottom")
                        .tickFormat(function (d) {
                            return d;
                        })
                        .tickSize(0)
                        .tickPadding(12));

            } else {
                svg.append("g")
                    .attr("class", "slider axis")
                    .attr("transform", "translate(20,0)")
                    .call(d3.svg.axis()
                        .scale(scale)
                        .orient("left")
                        .tickFormat(function (d) {
                            return d;
                        })
                        .tickSize(0)
                        .tickPadding(12));

            }

            //This appears to be part of draggable elements. I cribbed this from Bostock and to be honest
            // I don't know exactly what it does. I'll leave it alone for now.
            svg
                .select(".domain")
                .select(function () {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "halo");

            // Attach the brush to our developing slider
            slider = svg.append("g")
                .attr("class", "slider")
                .call(brush);

            // Specify the size of the area over which we are watching the cursor
            if (orientation === 'horizontal') {
                slider.select(".background")
                    .attr("height", 30);
            } else {
                slider.select(".background")
                    .attr("width", 30);
            }

            // Attach a visual representation to the slider
            if (orientation === 'horizontal') {
                handle = slider.append("circle")
                    .attr("class", "handle")
                    .attr("transform", "translate(0,20)")
                    .attr("r", 9);
            } else {
                handle = slider.append("circle")
                    .attr("class", "handle")
                    .attr("transform", "translate(20,0)")
                    .attr("r", 9);
            }
            brushed();
            return instance;

            function brushed() {
                var value;

                if (orientation === 'horizontal') {
                    value = brush.extent()[0];
                } else {
                    value = brush.extent()[1];
                }

                if (d3.event == null) { // this happens only if brushed is called programmatically with no event
                    brush.extent([initialSliderValue, initialSliderValue]);
                    if (orientation === 'horizontal') {
                        handle.attr("cx", scale(initialSliderValue));
                    } else {
                        handle.attr("cy", scale(1.5));
                    }
                    value = 1.5;
                }
                else if (d3.event.sourceEvent) { // not a programmatic event
                    if (orientation === 'horizontal') {
                        value = scale.invert(d3.mouse(this)[0]);
                        brush.extent([value, value]);
                        handle.attr("cx", scale(value));
                    } else {
                        value = scale.invert(d3.mouse(this)[1]);
                        brush.extent([value, value]);
                        handle.attr("cy", scale(value));
                    }


                }

                if (!isNaN(value)) {
                    if (typeof onBrushMoveDoThis !== "undefined") {
                        onBrushMoveDoThis(value);
                    }

                }
            }

            function brushEnded() {
                if (typeof onBrushEndDoThis !== "undefined") {
                    onBrushEndDoThis();
                }

            }


        };

        ctor(domainStart, domainEnd, rangeStart, rangeEnd);


        instance.render = function () {
            // slider.call(brush.event);
        };

        instance.sliderLocation = function (value) {
            if (!arguments.length) return brush.extent()[0];
           // value = scale.invert(d3.mouse(this)[1]);
            brush.extent([value, value]);
            handle.attr("cy", scale(value));
            return instance;
        };
        return instance;

    };

    function defaultSliderEvent(value) {
        return;
    }


})();

