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
            <a onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/simpleBinHeatmap.js')">simpleHeatMap.js</a>
        </h1>
    </div>

</div>
<p class="standardEmphasisFont">
<div>
    <div style="display:inline-block;" id="legend"></div>
    <div  id="chart1"></div>
</div>



<script type="text/javascript">
    $( document ).ready(function() {
        var correlationMatrix = [
            [1, 1, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
            [0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 1, 1, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 1]
        ];

        var xlabels = ['Adipose',
            'AnteriorCaudate',
            'CD34-PB',
            'CingulateGyrus',
            'ColonicMucosa',
            'DuodenumMucosa',
            'ES-HUES6',
            'ES-HUES64',
            'hASC-t1',
            'hASC-t2'];
        var ylabels = ['1_Active_TSS',
            '2_Weak_TSS',
            '3_Flanking_TSS',
            '5_Strong_transcription',
            '6_Weak_transcription',
            '8_Genic_enhancer',
            '9_Active_enhancer_1',
            '11_Weak_enhancer',
            '14_Bivalent/poised_TSS',
            '16_Repressed_polycomb'];
        var margin = {top: 50, right: 50, bottom: 100, left: 150},
            width = 550 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        var matrix = baget.matrix()
            .height(height)
            .width(width)
            .margin(margin)
            .renderLegend(0)
            .renderCellText(0)
            .xlabelsData(xlabels)
            .ylabelsData(ylabels)
            .startColor('#ffffff')
            .endColor('#3498db')
            .dataHanger("#chart1", correlationMatrix);
        d3.select("#chart1").call(matrix.render);
    });


</script>





<script type="text/javascript">
    (function(){
    })();

</script>
