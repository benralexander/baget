<!DOCTYPE html>
<html>
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
    h1 p {
        font-family: 'Gravitas One','Arial Black';
        color: #666666;
        font-weight: normal;
        font-size: 3em;
        margin: 0;
    }
    h2{
        font-family: 'Gravitas One','Arial Black';
        color: #b1967c;
        font-weight: normal;
        font-size: 2.3em;
        margin: 0;
    }
    .barChartLabel  {
        font-family: 'Lato';
        font-weight: bold;
        font-size: 16pt;
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
    p.intro{
        color: yellow;
        font-family: 'Arial Black';
        font-size: 5em;
    }
    rect.h-bar {
        stroke: white;
        fill: steelblue;
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
    var data = [ // <-A
                {value: 100, barname: 'Have T2D',  inbar: '', quantifier: '12%', descriptor:'(8 out of 6469)'},
                {value: 150, barname: 'Do not have T2D', inbar: '', quantifier: '12%', descriptor:'(8 out of 6469)'},
                {value: 100, barname: 'Have ',  inbar: '', quantifier: '12%', descriptor:'(8 out of 6469)'},
                {value: 150, barname: 'Do have T2D', inbar: '', quantifier: '12%', descriptor:'(8 out of 6469)'},
                {value: 100, barname: 'Have T2Da',  inbar: '', quantifier: '12%', descriptor:'(8 out of 6469)'},
                {value: 150, barname: 'Do not have T2Db', inbar: '', quantifier: '12%', descriptor:'(8 out of 6469)'},
                {value: 100, barname: 'Have T2Dc',  inbar: '', quantifier: '12%', descriptor:'(8 out of 6469)'},
                {value: 150, barname: 'Do not have T2Dd', inbar: '', quantifier: '12%', descriptor:'(8 out of 6469)'}
            ],
            roomForLabels = 100;

    var margin = {top: 30, right: 20, bottom: 50, left: 70},
            width = 900 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

    function render(data) {
        var x, y;
        var chart =  d3.select("#chart")
                .append('svg')
                .attr('class', 'chart')
                .attr('width', width)
                .attr('height', height*2);

        x = d3.scale.linear()
                .domain([0, d3.max(data, function (d){return d.value})])
                .range([margin.left, width]);

        var names=[];
        data.map(function(d){names.push(d.barname)});
        y = d3.scale.ordinal()
                .domain(names)
                .rangeBands([margin.top, height]);

//        chart.selectAll("div.h-bar")
//                .data(data)
//                .enter().append("div")
//                .attr("class", "h-bar")
//                .append("span");
//
//        chart.selectAll("div.h-bar")
//                .data(data)
//                .exit().remove();

        chart.selectAll("rect")
                .data(data,function(d,i){return d.barname;})
                .enter().append("rect")
                .attr('class','h-bar')
                .attr("x", margin.left+roomForLabels)
                .attr("y", function(d, i){
                    return y(d.barname) + y.rangeBand()/2;
                } )
                .attr("width", function(d,i){return d.value+roomForLabels})
                .attr("height", y.rangeBand()/4);
//        chart.selectAll("rect.h-bar")
//                .data(data)
//                .attr("class", "h-bar")
//                .style("width", function (d) {
//                    return (d.value * 5) + "px";
//                })
//                .select("span")
//                .text(function (d) {
//                    return d.inbar;
//                });







        // these are tics, without labels
        var bar_height = 25;
        var  gap=5;
//        chart.selectAll("line")
//                .data(x.ticks(d3.max(data, function (d){return d.value})))
//                .enter().append("line")
//                .attr("x1", function(d) {
//                    return x(d) + 0;
//                })
//                .attr("x2", function(d) {
//                    return x(d) + 0;
//                })
//                .attr("y1", 0)
//                .attr("y2", (bar_height + gap * 2) * data.length);

        var left_width =20;

        chart.selectAll("text.barChartLabel")
                .data(data)
                .enter().append("text")
                .attr("x",  margin.left+roomForLabels)
                .attr("y", function(d, i){
                    return y(d.barname) + y.rangeBand()/2;
                } )
                .attr("dy", "0.85em")
                .attr("text-anchor", "end")
                .attr('class', 'barChartLabel')
                .text(function(d,i){return d.barname;});

    }

    render(data);

    function load(){ // <-E
        d3.json("/baget/straight/feedMeJson", function(error, json){ // <-F
            data = data.concat(json);
            render(data);
        });
    }

</script>

</body>
</html>