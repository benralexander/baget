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
        {expense: 100, category: "Retail"},
        {expense: 150, category: "Gas"},
    ];

    function render(data) {
        d3.select("#chart").selectAll("div.h-bar") // <-B
                .data(data)
                .enter().append("div")
                .attr("class", "h-bar")
                .append("span");

        d3.select("#chart").selectAll("div.h-bar") // <-C
                .data(data)
                .exit().remove();

        d3.select("#chart").selectAll("div.h-bar") // <-D
                .data(data)
                .attr("class", "h-bar")
                .style("width", function (d) {
                    return (d.expense * 5) + "px";
                })
                .select("span")
                .text(function (d) {
                    return d.category;
                });
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