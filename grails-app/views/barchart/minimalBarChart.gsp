<!DOCTYPE html>
<html xmlns:xlink="http://www.w3.org/1999/xlink">
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,barchart"/>
    <r:layoutResources/>

</head>
<body>
<g:javascript src="bootstrap.min.js" />
<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">Bar chart</h1>
        <h1 style="font-weight: normal">All charts made with
            <a
                onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/barchart.js')">barchart.js</a>

    </div>

</div>
<p class="standardEmphasisFont">
    <h2>Simple bar chart with labels</h2></p>
<table style="width:900px">
    <tbody>
        <tr>
            <td class="barchartFormatter">
                <div id="chart">

                </div>
            </td>
            <td class="significanceDescriptorFormatter">
                <div class="significantDifference">
                    <div class="significantDifferenceText">
                        <p>significant difference</p>

                        <p>p=0.126</p>

                        <p>OR=1.4</p>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</table>

<hr width="100%">
<hr width="100%">
<p class="standardEmphasisFont">
<h2>Use explicit vertical positioning to allow bar groups</h2></p>
<div style="width:1000px">
    <div id="chart2"></div>
</div>


<hr width="100%">
<hr width="100%">
<p class="standardEmphasisFont">
<h2>Example with customization and a legend (less general/more flexible)</h2>
</p>
<div style="width:1000px">
    <div id="chart3"></div>
</div>




<script type="text/javascript">
    var data = [
                { value: 0.124,
                    barname: 'Have T2D',
                    barsubname: '(cases)',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '(8 out of 6469)'},
                {value: 0.891,
                    barname: 'Do not have T2D',
                    barsubname: '(controls)',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '(60 out of 6364)'}
            ],
            roomForLabels = 120,
            maximumPossibleValue = 1,
            labelSpacer = 10;

    var margin = {top: 0, right: 20, bottom: 0, left: 70},
            width = 800 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;


    d3.json("../barChart/barChartData", function (error, json) {

        var barChart = baget.barChart()
                .selectionIdentifier("#chart")
                .width(width)
                .height(height)
                .margin(margin)
                .roomForLabels (roomForLabels)
                .maximumPossibleValue (1)
                .labelSpacer (labelSpacer)
                .assignData(data);
        barChart.render();


    });

</script>





<script type="text/javascript">
    (function(){
    var data2 = [
                { value: 0.84,
                    position: 2,
                    barname: 'African-American',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: ''},
                {value: 0.72,
                    position: 4,
                    barname: 'Hispanic',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: ''},
                { value: 1.62,
                    position: 6,
                    barname: 'East Asian',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: ''},
                {  value: 4.52,
                    position:  8,
                    barname: 'European',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: ''},
                { value: 3.91,
                    position: 9,
                    barname: ' ',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '(exome sequence)'}

            ],
            roomForLabels = 120,
            maximumPossibleValue = 5,
            labelSpacer = 10;

    var margin = {top: 0, right: 20, bottom: 0, left: 70},
            width = 800 - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;


    d3.json("../barChart/barChartData", function (error, json) {

        var barChart = baget.barChart()
                .selectionIdentifier("#chart2")
                .width(width)
                .height(height)
                .margin(margin)
                .roomForLabels (roomForLabels)
                .maximumPossibleValue (5)
                .labelSpacer (labelSpacer)
                .assignData(data2);
        barChart.render();


    });
    })();

</script>









<script type="text/javascript">
(function(){
    var data3 = [
                { value: 1,
                    position: 1,
                    barname: 'Cases',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '(total 6253)',
                    inset: 1 },
                { value:  9,
                    position: 2,
                    barname: ' ',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '',
                    legendText: '2 copies (homozygous)'},
                {value: 295,
                    position: 3,
                    barname: '  ',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '',
                    legendText: '1 copy (heterozygous)'},
                { value: 5949,
                    position: 4,
                    barname: '   ',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '',
                    legendText: '0 copies'},
                {  value: 1,
                    position:  6,
                    barname: 'Controls',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '(total 6498)',
                    inset: 1 },
                {  value: 8,
                    position:  7,
                    barname: '    ',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: ''},
                { value: 211,
                    position: 8,
                    barname: '     ',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: ''},
                { value: 6279,
                    position: 9,
                    barname: '      ',
                    barsubname: '',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: ''}

            ],
            roomForLabels = 120,
            maximumPossibleValue = 7000,
            labelSpacer = 10;

    var margin = {top: 140, right: 20, bottom: 0, left: 70},
            width = 800 - margin.left - margin.right,
            height = 520 - margin.top - margin.bottom;


    d3.json("../barChart/barChartData", function (error, json) {

        var barChart = baget.barChart()
                .selectionIdentifier("#chart3")
                .width(width)
                .height(height)
                .margin(margin)
                .roomForLabels (roomForLabels)
                .maximumPossibleValue (7000)
                .labelSpacer (labelSpacer)
                .assignData(data3)
                .integerValues(1)
                .logXScale(1)
                .customBarColoring(1)
                .customLegend(1);
        barChart.render();


    });

})();

</script>




</body>
</html>