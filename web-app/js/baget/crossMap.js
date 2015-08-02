/***
 *               --------------cross trait--------------
 *
 * This JavaScript file should be sufficient for creating a cross trait plot.    The idea is to take
 * a number of different phenotypes, and for each one display all variants  for which we have P value
 * information describing the impact on a phenotype.  Presumably the information we are given
 * to display will already have been filtered down, so that we don't receive huge numbers of
 * variants with P values close to 1.
 *
 * From a technical perspective the chief challenge to confront in the construction of this plot
 * is that we are given long lists of variants which will be categorized as describing a particular
 * phenotype.  Since we are looking for a plot in the end which has genomic position along one axis
 * and phenotype along another, we are therefore required to invert the data twice.  That is, identify
 * all of the unique phenotypes, then identify all of the unique genomic positions, and use these two
 * variables to build the axes. With the axes in place we can then run through the list and drop
 * the variants onto the resulting two-dimensional matrix one by one.  This manipulation takes place
 * in a method below called "buildInternalRepresentation", and most of the processing/looping
 * is done with the D3 nest command.
 *
 */



var baget = baget || {};  // encapsulating variable

(function () {
    "use strict";

    baget.crossMap = function () {

        // the variables we intend to surface
        var
            height = 1,
            margin = { top: 250, right: 100, bottom: 100, left: 100 },
               width = 1080 - margin.left - margin.right,
            variantLinkUrl = '',
            phenotypeArray = [],
            spaceForPhenotypeLabels  = 100;



        /***
         * private functions
         * @param assoc
         * @returns {number}
         */
        var instance = {},
            svg,
            xScale,
            yScale,
            xAxis,
            yAxis,
            orgData,
            maximumArrowSize=16,
            legendHolderBoxWidth = 150;


        // indicate significance level with size
        var arrowSize = function (node) {
            if (node.p > .05) return maximumArrowSize/4;
            else if (node.p > .0001) return maximumArrowSize/2;
            else if (node.p > 5e-8) return (maximumArrowSize*3)/4;
            else return maximumArrowSize;
        };

        // indicate direction of effect with color
        var iconClass = function (assoc) {
            var c = '';
            if (assoc.d == 'down') c += 'assoc-down';
            else if (assoc.d == 'up') c += 'assoc-up';
            else c += 'assoc-none';

            if (assoc.p > .05) c += ' assoc-none';
            else if (assoc.p > .0001) c += ' assoc-sm';
            else if (assoc.p > 5e-8) c += ' assoc-med';
            else c += ' assoc-lg';


            return c;
        } ;


        /***
         * Take our input data and convert it into a form that we can use to build the graphic.  We are forced to run through
         * the data twice:  the first time to pull out all of the variants and traits, which we then use to determine the extents
         * of the axes.  With these extents in hand we then run through the data again, and in the second run we can place the
         * individual variants where they should go with respect to row and column. The first run is performed with a
         * method called "extractUniqueLists", while the second run uses a method called "extractCompoundList".
         * @param inArray
         * @returns {{variantNameArray: *, traitNameArray: *, variantArrayOfArrayVariantPointers: *, positionExtent: {max: undefined, min: undefined}, getTraitNameByTraitNumber: getTraitNameByTraitNumber}}
         */
        var buildInternalRepresentation = function (inArray,sortChoice) {
            var positionExtent = {max: d3.max(inArray,function(d){return d.POS}),
                                  min: d3.min(inArray,function(d){return d.POS})} ;
            // determine the genomic positions and traits
            var uniqueVariants;
            var extractUniqueLists = function (dd) {
                if (sortChoice>-1)  {
                    uniqueVariants=d3.nest()
                        .key(function(d) {
                            return d.ID;
                        })
//                        .sortValues(function(a,b) {
//                            return a.PVALUE - b.PVALUE;
//                         })
                        .rollup(function(d) {return d[0].DBSNP_ID;})
                        .entries(dd)
                        .map(function(d){
                            return {'id':d.key,
                                'rsname':d.values}
                        });
                } else {
                    uniqueVariants=d3.nest()
                        .key(function(d) {
                            return d.ID;
                        })
                        .sortKeys(function(a,b) {
                            return a.POS - b.POS;
                        })
                        .rollup(function(d) {return d[0].DBSNP_ID;})
                        .entries(dd)
                        .map(function(d){
                            return {'id':d.key,
                                'rsname':d.values}
                        });
                }
                var uniqueTraits=d3.nest()
                    .key(function(d) {return d.TRAIT;})
                    .sortKeys(d3.ascending)
                    .rollup(function(d) {
                        return phenotypeMap.phenotypeMap[d[0].TRAIT];
                    })
                    .entries(dd)
                    .map(function(d){
                        return {'id':d.key,
                            'name':d.values}
                    });
                return {traits: uniqueTraits,
                    variants: uniqueVariants};
            };
            // create an array of arrays where the first array describes the trait (1 per row),
            //  and the second array describes individual variants within that trait
            var extractCompoundList = function (dd,traitMap,variantMap) {
                var storeVariant = function(variant){
                    return (
                    {
                        v: variantMap[variant.ID],
                        t: traitMap [variant.TRAIT],
                        i: variant.ID,
                        p: variant.PVALUE,
                        d: variant.DIR,
                        o: variant.ODDS_RATIO,
                        dbsnp: variant.DBSNP_ID,
                        chr: variant.CHROM,
                        pos: variant.POS,
                        b: variant.BETA,
                        z: variant.ZSCORE
                    });
                } ;
                var variantsPerTrait;
                variantsPerTrait = d3.nest()
                    .key(function (d) {
                        return d.TRAIT;
                    })
                    .sortKeys(d3.ascending)
                    .rollup(function (d) {
                        return (d.map(storeVariant));
                    })
                    .entries(dd)
                    .map(function (d) {
                        return {'id': d.key,
                            'name': d.values}
                    });

                return {
                    variantsPerTrait:variantsPerTrait};
            };
            var createAMap = function (allTraitsArray) {
                var retval = {};
                for (var i = 0; i < allTraitsArray.length; i++) {
                    retval[allTraitsArray[i]] = i;
                }
                return retval;
            };

            //  Here are the steps that actually process the data, and therefore serve as the
            //   constructor for the graphic.
            var uniqueArrays = extractUniqueLists(inArray),
              variantIdArray =  uniqueArrays.variants.map(function (d){return d.id}),
              variantNameArray = uniqueArrays.variants.map(function (d){return d.rsname}),
              traitIdArray =  uniqueArrays.traits.map(function (d){return d.id}),
              traitNameArray = uniqueArrays.traits.map(function (d){return d.name}),
              traitMap = createAMap(traitIdArray),
              variantMap = createAMap(variantIdArray),
              compoundArrays = extractCompoundList(inArray,traitMap,variantMap),
              variantArrayOfArrayVariantPointers =  compoundArrays.variantsPerTrait.map(function (d){return d.name}),
              getTraitNameByTraitNumber = function (traitNumber) {
                return traitNameArray[traitNumber];
            };

            return {
                //  public variables
                variantNameArray:  variantNameArray,
                traitNameArray:  traitNameArray,
                variantArrayOfArrayVariantPointers: variantArrayOfArrayVariantPointers,
                positionExtent:positionExtent,
                // public methods
                getTraitNameByTraitNumber: getTraitNameByTraitNumber
            }

        };



        var defineBodyClip = function (bodyClip,id,xStart,yStart,xEnd,yEnd) {

            var defHolder = bodyClip.append("defs");

            defHolder.append("clipPath")
                .attr("id", id)
                .append("rect")
                .attr("x", xStart)
                .attr("y", yStart)
                .attr("width", xEnd)
                .attr("height", yEnd);

        };


        var drawLegend  = function(parent,data,legendPosX,legendPosY,spaceBetweenLegendEntries,set2) {
            // add legend
            var legendTextYPosition = 15,
                spaceBetweenLegendColorAndLegendText = 30,
                legendHolderBoxHeight = 120,
                legendTitleYPositioning = 18,
                legMapShift =  60;


            var legend = parent.append("g")
                .attr("class", "legendHolder")
                .attr("x", legendPosX)
                .attr("y", legendPosY)
                .attr("height", 100)
                .attr("width", 100) ;


            legend.selectAll('rect')
                .data([0])
                .enter()
                .append("rect")
                .attr("x", legendPosX)
                .attr("y", legendPosY)
                .attr("width", legendHolderBoxWidth)
                .attr("height", legendHolderBoxHeight)
                .attr("class", "legendHolder");

            legend.selectAll('text.legendTitle')
                .data([0])
                .enter()
                .append("text")
                .attr("class", "legendTitle")
                .attr("x", legendPosX + (legendHolderBoxWidth / 2))
                .attr("y", legendPosY+legendTitleYPositioning)
                .attr("class", "legendTitle")
                .text('Legend');

            legend.selectAll('text.legendStylingCat')
                .data([0])
                .enter()
                .append("text")
                .attr("class", "legendStylingCat")
                .attr("x", legendPosX+5)
                .attr("y", (legendPosY+(3*(spaceBetweenLegendEntries + legendTextYPosition))/2)-7)
                .text('Direction');
            legend.selectAll('text.legendStylingCat2')
                .data([0])
                .enter()
                .append("text")
                .attr("class", "legendStylingCat2")
                .attr("x", legendPosX+5)
                .attr("y", (legendPosY+(3*(spaceBetweenLegendEntries + legendTextYPosition))/2)+7)
                .text('(color)');


            legend.selectAll('rect')
                .data(data)
                .enter()
                .append("rect")
                .attr("x", legMapShift+legendPosX + 10)
                .attr("y", function (d, i) {
                    return legendPosY+(i * spaceBetweenLegendEntries + legendTextYPosition);
                })
                .attr("width", 10)
                .attr("height", 10)
                .attr("class", function (d, i) {
                    return 'legendStyling' + i;
                })

            legend.selectAll('text.elements1')
                .data(data)
                .enter()
                .append("text")
                .attr("class", "elements1")
                .attr("x", legMapShift+legendPosX + spaceBetweenLegendColorAndLegendText)
                .attr("y", function (d, i) {
                    return legendPosY+(i * spaceBetweenLegendEntries + legendTextYPosition + 9);
                })
                .attr("class", "legendStyling")
                .text(function (d) {
                    if (typeof d.legendText !== 'undefined') {
                        return d.legendText;
                    } else {
                        return '';
                    }
                });

            legend.selectAll('text.legendStylingSig')
                .data([0])
                .enter()
                .append("text")
                .attr("class", "legendStylingSig")
                .attr("x", legendPosX+5)
                .attr("y", (legendPosY+(6*(spaceBetweenLegendEntries + legendTextYPosition))/2)-15)
                .text('Significance');
            legend.selectAll('text.legendStylingSig2')
                .data([0])
                .enter()
                .append("text")
                .attr("class", "legendStylingSig2")
                .attr("x", legendPosX+5)
                .attr("y", legendPosY+(6*(spaceBetweenLegendEntries + legendTextYPosition))/2)
                .text('(size)');

            legend.selectAll('text.elements2')
                .data(set2)
                .enter()
                .append("text")
                .attr("class", "elements2")
                .attr("x", legMapShift/2+legendPosX + spaceBetweenLegendColorAndLegendText+10)
                .attr("y", function (d, i) {
                    return legendPosY+((i+5) * spaceBetweenLegendEntries/2 + legendTextYPosition + 9);
                })
                .attr("class", "legendStyling")
                .text(function (d) {
                    if (typeof d.legendText !== 'undefined') {
                        return d.legendText;
                    } else {
                        return '';
                    }
                });


        } ;



        var createAxes = function (axisGroup,orgData,gridSize,xScale,yScale, width, sortChoice) {
            // draw the x axis

            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('right')
                .tickFormat(d3.requote(""));

            axisGroup.append('g')
                .attr('id', 'yaxis')
              .attr('transform', 'translate(' + (width) + ',0)')
                .attr('class', 'main axis pValue')
                .call(yAxis);

            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('top')
                .ticks(4);


            var xAxisDecoration = axisGroup.append('g')
                .attr('id', 'xaxis')
                .attr('transform', 'translate(0,0)')
                .attr('class', 'main axis chromosome')
                .call(xAxis);

            if (sortChoice !== -1){
                xAxisDecoration
                    .selectAll("text")
                    .attr("dx", "0.5em")
                    .attr("dy", "0em")
                    .style("text-anchor", "start")
                    .attr("transform", function(d) {
                        return "rotate(-65)"
                    });
            }

        };


        var onMouseOver = function(d){
            var buildToolTip =   function (d)   {
                var text = '<div class="header">' +orgData.getTraitNameByTraitNumber(d.t) + '</div>';
                text += d.dbsnp + '<br/>';
                text += 'chr' + d.chr + ':' + d.pos + '<br/>';
                text += 'p-value: <strong>' + d.p.toPrecision(3) + '</strong><br/>';
                if (d.o) text += 'odds ratio: <strong>' + d.o.toPrecision(3) + '</strong><br/>';
                if (d.b) text += 'beta: <strong>' + d.b.toPrecision(3) + '</strong><br/>';
                if (d.z) text += 'z-score: <strong>' + d.z.toPrecision(3) + '</strong><br/>';
                return text;
            };
            d3.selectAll(".traitlabel").classed("text-highlight", function (r, ri) {
                var oneWeWant = (ri == (d.t));
                return  oneWeWant;
            });
            d3.selectAll(".variantlabel").classed("text-highlight", function (r, ri) {
                var oneWeWant = (ri == (d.v));
                if (oneWeWant){
                    $('.variantlabel.r'+ d.v).text(d.dbsnp);
                }
                return  oneWeWant;
            });
            d3.select("#tooltip")
                .style("left", (d3.event.layerX + 20) + "px")
                .style("top", (d3.event.layerY - 20) + "px")
                .select("#value")
                .html(buildToolTip(d));
            d3.select("#tooltip").classed("hidden", false);

        };



        var onClick = function(d){
            var remCol = d3.selectAll('line.chosen');
            remCol.remove();
            var remRow = d3.selectAll('.rowHighlight');
            remRow.style('opacity',0)
                .style('fill-opacity',0) ;
            var holdingRow =  d3.select('.b_'+d.t);
            holdingRow.select('.bg').style('opacity',0.1)
                .style('fill-opacity',1)
                .classed('rowHighlight',true) ;
            d3.selectAll(".traitlabel").classed("traitChosen", function (r, ri) {
                var oneWeWant = (ri == (d.t));
                return  oneWeWant;
            });
            holdingRow.selectAll('line.chosen')
                .data([d])
                .enter()
                .append("line")
                .attr("class", "chosen")
                .attr("x1", function (d, i) {
                    return xScale(d.pos);
                })
                .attr("y1", function (d, i) {
                    return 1 ;
                })
                .attr("x2", function (d, i) {
                    return xScale(d.pos);
                })
                .attr("y2", function (d, i) {
                    return height-margin.top-margin.bottom ;
                })
                .attr('stroke-width', 2)

        };




        var drawIcon  = function(parent,sortChoice){
            var grid_size = Math.floor((height-margin.top-margin.bottom) / 25);
            var drawnIcon = parent
                .attr("x1", function (d, i) {
                    if (sortChoice > -1)   {
                        return xScale(d.dbsnp);
                    }   else {
                        return xScale(d.pos);
                    }
                })
                .attr("y1", function (d, i) {
                    return (maximumArrowSize/2)+(d.t * grid_size)-(arrowSize(d)/2) ;
                })
                .attr("x2", function (d, i) {
                    if (sortChoice > -1)   {
                        return xScale(d.dbsnp);
                    }   else {
                        return xScale(d.pos);
                    }                    })
                .attr("y2", function (d, i) {
                    return (maximumArrowSize/2)+(d.t * grid_size)+arrowSize(d) ;
                })
                .attr('stroke-width', 1)
                .attr('class', function (d, i) {
                    return iconClass(d);
                });
            if (typeof sortChoice > -1){
                drawnIcon.on("mouseover", function (d) {
                    onMouseOver(d);
                })
                    .on("mouseout", function (d) {
                        d3.select("#tooltip").classed("hidden", true);
                        d3.selectAll(".traitlabel").classed("text-highlight", false);
                        d3.selectAll(".variantlabel").classed("text-highlight", false).text('');
                    })
                    .on("click", function (d) {
                        onClick(d);
                    })

            }
             ;
        };



        var zoomed = function (local) {

            d3.select("#xaxis").call(xAxis);
            d3.selectAll('.cellr').selectAll('line')
                .call(drawIcon);
        };







        instance.render = function (sortChoice) {

            if (typeof sortChoice === 'undefined') {
                sortChoice = -1; // Mark as ordered by genomic position
            }
            var data = svg.data()[0].variants;


            var grid_size = Math.floor((height-margin.top-margin.bottom) / 25);

            //orgData = buildInternalRepresentation(data,sortChoice);
            orgData = buildInternalRepresentation(data,-1);

            // create the scales
            if ((sortChoice === -1)||(true)) {
                xScale = d3.scale.linear()
                    .domain([orgData.positionExtent.min,orgData.positionExtent.max])
                    .range([ margin.left, width-spaceForPhenotypeLabels ]);
            }  else {
                if (typeof orgData.variantArrayOfArrayVariantPointers[sortChoice] !== 'undefined')  {
                    var variantArray =  orgData.variantArrayOfArrayVariantPointers[sortChoice].sort(function(a,b){return (b.p-a.p)}).map(function(d){return d.dbsnp});
                        xScale = d3.scale.ordinal()
                            .domain(variantArray)
                            .rangeBands([ margin.left, width-spaceForPhenotypeLabels ]);

                }
            }


            yScale = d3.scale.ordinal()
                .domain([0,orgData.traitNameArray])
                .range([ 0,(height-margin.top-margin.bottom)]);

            if ((sortChoice === -1)||(true)) {
                var zoom = d3.behavior.zoom()
                    .x(xScale)
                    .scaleExtent([1, 100])
                    .on("zoom", zoomed);

                svg.call(zoom, drawIcon);
            }

            svg
                .selectAll('g.bodyClip')
                .data([1])
                .enter()
                .append('g')
                .attr('class', 'bodyClip')
                .call(defineBodyClip ,"bodyClip",margin.left,0,width-margin.left-spaceForPhenotypeLabels,height+margin.top);


            var group = svg
                .selectAll('g.axesHolder')
                 .data([1]);
            group.enter()
                .append('g')
                .attr('class', 'axesHolder')
                .attr('transform', 'translate('+margin.left+','+margin.top+')')
                .call(createAxes ,orgData,grid_size,xScale,yScale,width-spaceForPhenotypeLabels, -1);

            var legCol1 = [{legendText:''},
                {legendText:'positive'},
                {legendText:'negative'}] ;
            var legCol2 = [{legendText:''},
                {legendText:'p> .05= [none]'},
                {legendText:'p< .05=small'},
                {legendText:'p< .0001=med'},
                {legendText:'p< 10E-8=big'}
            ] ;

            var wig=function(d,i){
                console.log("d"+d+","+i);
                instance.render(i) ;
            }
            svg
                .selectAll('g.legend')
                .data([1])
                .enter()
                .append('g')
                .attr('class', 'legend')
                .call(drawLegend,legCol1,  25,3,20, legCol2);

            //label traits down the right side
            var traitLabels = group.append('g')
                .selectAll(".row-g")
                .data(orgData.traitNameArray)
                .enter();

            traitLabels.append('text').attr("class", function (d, i) {
                    return "traitlabel  r" + i;
                })
                .text(function (d) {
                    return d;
                })
                .attr("x", width-spaceForPhenotypeLabels+8 )
                .attr("y", function (d, i) {
                    return i * grid_size + 15;
                })
                .style("text-anchor", "start").on("click", wig);

            var dataHolder = group
                .selectAll('g.dataHolder')
                .data([1])
                .enter()
                .append('g')
                .attr('class', 'dataHolder');


            // All variants for each trait
            var rows = dataHolder.selectAll('g.cellr')
                .data(orgData.variantArrayOfArrayVariantPointers)
                .enter()
                .append('g')
                .attr('class', function(d,i){
                    return 'cellr b_'+i;
                }) ;

            var allRows = rows.selectAll('rect.bg').data([1]);

            allRows.enter()
                .append('rect')
                .attr('class','bg')
                .attr("x", 0)
                .attr("y",  function (d, i) {
                    var row=parseInt(this.parentNode.classList[1].split('_')[1]);
                    return row * grid_size;
                })
                .attr("width", width-spaceForPhenotypeLabels)
                .attr("height", grid_size);


            // Now draw something for each trait
            var eachRow = rows.selectAll('line.cg')
                .data(function (d, i) {
                    return d
                });

            eachRow.enter()
                .append('line')
                .attr('class','cg')
                .attr("clip-path", "url(#bodyClip)")
                .call(drawIcon,-1);


                if (sortChoice !== -1){
                    if (typeof orgData.variantArrayOfArrayVariantPointers[sortChoice] !== 'undefined')  {
                        var variantArray =  orgData.variantArrayOfArrayVariantPointers[sortChoice].sort(function(a,b){return (b.p-a.p)}).map(function(d){return d.dbsnp});
                        xScale = d3.scale.ordinal()
                            .domain(variantArray)
                            .rangeBands([ margin.left, width-spaceForPhenotypeLabels ]);

                    }


                    eachRow.transition()
                        .delay(2000)
                        .duration(3000)
                        .call(drawIcon,sortChoice);

                }


        };


        // Now walk through the DOM and create the enrichment plot
        instance.dataHanger = function (selectionIdentifier, data) {

            var buildSvgContainer = function(parent, width, margin){
                if (typeof parent !== 'undefined'){
                    parent.attr("height", height + margin.top + margin.bottom)
                        .attr("width",width + margin.left + margin.right);
                 }
            };


            svg = d3.select(selectionIdentifier)
                .selectAll('svg.cross')
                .data ([data])
                .enter()
                .append("svg")
                .attr('class', 'cross')
                .call(buildSvgContainer,width,margin);

            return instance;
        };


        instance.phenotypeArray = function (x) {
            if (!arguments.length) return phenotypeArray;
            phenotypeArray = x;
            return instance;
        };

        instance.variantLinkUrl = function (x) {
            if (!arguments.length) return variantLinkUrl;
            variantLinkUrl = x;
            return instance;
        };

        instance.margin = function (x) {
            if (!arguments.length) return margin;
            margin = x;
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


        return instance;
    };

})();