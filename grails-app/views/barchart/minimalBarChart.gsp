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

    </div>

</div>
<p class="standardEmphasisFont">
    Carriers of at least one copy of one of these variants</p>
<table style="width:900px">
    <tr>
        <td class="barchartFormatter"><div id="chart"></div></td>
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
</table>


<script type="text/javascript">
    var data = [
                { value: 0.124,
                    barname: 'Have T2D',
                    barsubname: '(cases)',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '(8 out of 6469)'},
                {value: 0.126,
                    barname: 'Do not have T2D',
                    barsubname: '(controls)',
                    barsubnamelink:'http://www.google.com',
                    inbar: '',
                    descriptor: '(21 out of 6364)'}
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
                .maximumPossibleValue (maximumPossibleValue)
                .labelSpacer (labelSpacer)
                .assignData(data);
        barChart.render();


    });

</script>

</body>
</html>