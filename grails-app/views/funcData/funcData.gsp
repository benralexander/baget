<!DOCTYPE html>
<html xmlns:xlink="http://www.w3.org/1999/xlink">
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,matrix"/>
    <r:layoutResources/>

</head>
<body>
<g:javascript src="bootstrap.min.js" />
<div class="container">

    <div class="starter-template">
        <h1>Simple binary heat map</h1>
        <h1 >
            <a onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/simpleBinHeatmap.js')">barchart.js</a>
        </h1>
    </div>

</div>
<p class="standardEmphasisFont">
<div>
    <div style="display:inline-block;" id="legend"></div>
    <div style="display:inline-block; float:left" id="container"></div>
    <div  id="chart1"></div>
</div>



<script type="text/javascript">
    $( document ).ready(function() {
        var data = [
                {
                    value: 0.124,
                    barname: 'Have T2D',
                    barsubname: '(cases)',
                    barsubnamelink: 'http://www.google.com',
                    inbar: '',
                    descriptor: '(8 out of 6469)'
                },
                {
                    value: 0.891,
                    barname: 'Do not have T2D',
                    barsubname: '(controls)',
                    barsubnamelink: 'http://www.google.com',
                    inbar: '',
                    descriptor: '(60 out of 6364)'
                }
            ],
            roomForLabels = 120,
            maximumPossibleValue = 1,
            labelSpacer = 10;
        var correlationMatrix = [
            [1, 0.3, 0, 0.8, 0, 0.2, 1, 0.5, 0, 0.75],
            [0.3, 1, 0.5, 0.2, 0.4, 0.3, 0.8, 0.1, 1, 0],
            [0, 0.5, 1, 0.4, 0, 0.9, 0, 0.2, 1, 0.3],
            [0.8, 0.2, 0.4, 1, 0.3, 0.4, 0.1, 1, 0.2, 0.9],
            [0, 0.4, 0, 0.3, 1, 0.1, 0.4, 0, 0.6, 0.7],
            [0.2, 0.3, 0.9, 0.4, 0.1, 1, 0, 0.1, 0.4, 0.1],
            [1, 0.8, 0, 0.1, 0.4, 0, 1, 0.5, 0, 1],
            [0.5, 0.1, 0.2, 1, 0.1, 0, 0.5, 1, 0, 0.4],
            [0, 1, 1, 0.2, 0.6, 0.4, 0, 0, 1, 0.6],
            [0.75, 0, 0.3, 0.9, 0.7, 0.1, 1, 0.4, 0.6, 1]
        ];

        var xlabels = ['Adipose',
            'AnteriorCaudate',
            'CD34-PB',
            'CingulateGyrus',
            'ColonicMucosa',
            'DuodenumMucosa',
            'ES-HUES6',
            'ES-HUES64',
            'GM12878',
            'H1',
            'hASC-t1',
            'hASC-t2'];
        var ylabels = ['1_Active_TSS',
            '2_Weak_TSS',
            '3_Flanking_TSS',
            '5_Strong_transcription',
            '6_Weak_transcription',
            '8_Genic_enhancer',
            '9_Active_enhancer_1',
            '10_Active_enhancer_2',
            '11_Weak_enhancer',
            '14_Bivalent/poised_TSS',
            '16_Repressed_polycomb'];
        var labels = ['Var 1', 'Var 2', 'Var 3', 'Var 4', 'Var 5', 'Var 6', 'Var 7', 'Var 8', 'Var 9', 'Var 10'];
        var margin = {top: 50, right: 50, bottom: 100, left: 150},
            width = 550 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        var matrix = baget.matrix({
            container: '#container',
            data: correlationMatrix,
            labels: labels,
            xlabels:xlabels,
            ylabels:ylabels,
            start_color: '#ffffff',
            end_color: '#3498db'
        }).height(height)
            .width(width)
            .margin(margin)
            .dataHanger("#chart1", correlationMatrix);
        d3.select("#chart1").call(matrix.render);
    });


</script>





<script type="text/javascript">
    (function(){
//        var data2 = [
//                { value: 1.3,
//                    position: 2,
//                    barname: 'African-American',
//                    barsubname: '',
//                    barsubnamelink:'',
//                    inbar: '',
//                    descriptor: ''},
//                {value: 0.72,
//                    position: 4,
//                    barname: 'Hispanic',
//                    barsubname: '',
//                    barsubnamelink:'',
//                    inbar: '',
//                    descriptor: ''},
//                { value: 1.62,
//                    position: 6,
//                    barname: 'East Asian',
//                    barsubname: '',
//                    barsubnamelink:'',
//                    inbar: '',
//                    descriptor: ''},
//                {  value: 4.52,
//                    position:  8,
//                    barname: 'European',
//                    barsubname: '',
//                    barsubnamelink:'',
//                    inbar: '',
//                    descriptor: ''},
//                { value: 3.91,
//                    position: 9,
//                    barname: ' ',
//                    barsubname: '',
//                    barsubnamelink:'http://www.google.com',
//                    inbar: '',
//                    descriptor: '(exome sequence)'}
//
//            ],
//            roomForLabels = 120,
//            maximumPossibleValue = 5,
//            labelSpacer = 10;
//
//        var margin = {top: 0, right: 20, bottom: 0, left: 70},
//            width = 800 - margin.left - margin.right,
//            height = 250 - margin.top - margin.bottom;
//
//
//        d3.json("../barChart/barChartData", function (error, json) {
//
//            var barChart = baget.barChart()
//                .width(width)
//                .height(height)
//                .margin(margin)
//                .roomForLabels (roomForLabels)
//                .maximumPossibleValue (5)
//                .labelSpacer (labelSpacer)
//                .dataHanger("#chart2",data2);
//            d3.select("#chart2").call(barChart.render);
//
//
//
//        });
    })();

</script>
