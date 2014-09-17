<!DOCTYPE html>
<html xmlns:xlink="http://www.w3.org/1999/xlink">
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core"/>
    <r:layoutResources/>
    <style>
    body {
        font: 12px Arial;
    }
    text.shadow {
        stroke: #fff;
        stroke-width: 2.5px;
        opacity: 0.9;
    }
    text.barChartLabel  {
        font-family: 'Lato';
        font-weight: normal;
        font-size: 18pt;
    }
    text.barSubChartLabel  {
        font-family: 'Lato';
        font-weight: normal;
        font-size: 12pt;
        stroke: #aaaaaa;
        fill: #aaaaaa;
    }
    text.valueLabels  {
        font-family: 'Lato';
        font-weight: normal;
        font-size: 18pt;
        color: #4682b4;
        stroke: steelblue;
        fill: steelblue;
    }
    text.valueQualifiers  {
        font-family: 'Lato';
        font-weight: normal;
        font-size: 14pt;
        stroke: #909090;
        fill: #909090;
    }
    text.clickableQuestionMark  {
        font-family: 'Arial';
        font-weight: bold;
        font-size: 14pt;
        stroke: #ff0000;
        fill: #ff0000;
    }
    .xaxis  {
        font-family: 'Lato';
        font-weight: lighter;
        font-size: 14pt;
        stroke: #aaaaaa;
        fill: #aaaaaa;
    }
    p   *.intro{
        color: green;
        font-family: 'Arial Black';
        font-size: 5em;
    }
    p:hover{
        color: purple;
        font-family: 'Arial Black';
        font-size: 2em;
    }
    rect.h-bar {
        stroke: white;
        fill: steelblue;
    }
    #xaxis text text {
        font-size: 12px;
    }
</style>

</head>
<body>
<script src="/baget/js/baget/bootstrap.min.js"></script>
<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">Bar chart</h1>

    </div>

</div>
<div id="chart"></div>

<script type="text/javascript">
    var data = [
                { value: 12,
                    barname: 'Have T2D',
                    barsubname: '(cases)',
                    inbar: '',
                    quantifier: '12%',
                    descriptor: '(8 out of 6469)'},
                {value: 33,
                    barname: 'Do not have T2D',
                    barsubname: '(controls)',
                    inbar: '',
                    quantifier: '12%',
                    descriptor: '(21 out of 6364)'}
            ],
            roomForLabels = 120,
            maximumPossibleValue = 100,
            labelSpacer = 10;

    var margin = {top: 30, right: 20, bottom: 50, left: 70},
            width = 800 - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;

    function render(data) {
        var x, y;
        var chart =  d3.select("#chart")
                .append('svg')
                .attr('class', 'chart')
                .attr('width', width*3)
                .attr('height', height*2);

        x = d3.scale.linear()
                .domain([0,maximumPossibleValue ])
                .range([margin.left+roomForLabels, width+roomForLabels]);

        var names=[];
        data.map(function(d){names.push(d.barname)});
        y = d3.scale.ordinal()
                .domain(names)
                .rangeBands([margin.top, height]);

        var	xAxis = d3.svg.axis();

                 xAxis
                .orient('bottom')
                .scale(x)
                .tickSize(2)
                .tickValues([0,25,50,75,100]);

        var x_xis = chart.append('g')
                .attr("transform", "translate(0,"+(height+40)+")")
                .attr('class','xaxis')
                .call(xAxis);



        // the bars in the bar chart
        var bars = chart.selectAll("rect")
                .data(data,function(d,i){return d.barname;});

                bars.enter().append("rect")
                .attr('class','h-bar')
                .attr("x", x(0))
                .attr("y", function(d, i){
                    return y(d.barname) + y.rangeBand()/2;
                } )
                .attr("width", function(d,i){
                    return (0)
                })
                .attr("height", y.rangeBand()/4);

        // perform the animation
        bars.transition()
            .delay(100).duration(1400)
                .attr("width", function(d,i){
                    return (x( d.value)-x(0))
                });

        // get rid of any extra data in case we've done this before
        bars.exit().transition().selectAll("rect").remove();



        // these are tics, without labels
        var bar_height = 25;
        var  gap=5;

        // labels to the left
        var textLeading = (90 - (data.length*5))/100;
        chart.selectAll("text.barChartLabel")
                .data(data)
                .enter().append("text")
                .attr("x",  margin.left+roomForLabels-labelSpacer)
                .attr("y", function(d, i){
                    return y(d.barname) + y.rangeBand()/2;
                } )
                .attr("dy", ""+textLeading+"em")
                .attr("text-anchor", "end")
                .attr('class', 'barChartLabel')
                .text(function(d,i){return d.barname;});

         // sub labels, just below the main labels above
        chart.selectAll("text.barChartSubLabel")
                .data(data)
                .enter().append("text")
                .attr("x",  margin.left+roomForLabels-labelSpacer)
                .attr("y", function(d, i){
                    return y(d.barname) + y.rangeBand()/2;
                } )
                .attr("dy", ""+(1.5+textLeading)+"em")
                .attr("dx", "-1em")
                .attr("text-anchor", "end")
                .attr('class', 'barSubChartLabel')
                .text(function(d,i){return d.barsubname;});

        // labels to the right
        chart.selectAll("text.valueLabels")
                .data(data)
                .enter().append("text")
                .attr("x", function(d){
                    return (x(d.value));
                })
                .attr("y", function(d){
                    return y(d.barname) + y.rangeBand()/2;
                } )
                .attr("dx", 20)
                .attr("dy", ""+textLeading+"em")
                .attr("text-anchor", "start")
                .attr('class', 'valueLabels')
                .text(function(d,i){return ""+d.value+ "%";});

        // labels to the right of the right hand labels
        chart.selectAll("text.valueQualifiers")
                .data(data)
                .enter().append("text")
                .attr("x", function(d){
                    return (x(d.value));
                })
                .attr("y", function(d){
                    return y(d.barname) + y.rangeBand()/2;
                } )
                .attr("dx", 80)
                .attr("dy", ""+textLeading+"em")
                .attr("text-anchor", "start")
                .attr('class', 'valueQualifiers')
                .text(function(d,i){return ""+d.descriptor+ "%";});


    chart.selectAll("text.clickableQuestionMark")
            .data(data)
            .enter()
            .append("text")
            .attr("x",  margin.left+roomForLabels-labelSpacer)
            .attr("y", function(d, i){
                return y(d.barname) + y.rangeBand()/2;
            } )
            .attr("dy", ""+(1.2+textLeading)+"em")
            .attr("text-anchor", "end")
            .attr('class', 'clickableQuestionMark')
            .text("?")
            .on("click",function(){alert('foo')});

    //.attr("xlink:href", "file:///D:/d3js_projects/refresh.png")

    }

    render(data);


</script>

</body>
</html>