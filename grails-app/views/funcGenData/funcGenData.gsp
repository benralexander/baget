<!DOCTYPE html>
<html xmlns:xlink="http://www.w3.org/1999/xlink">
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,multiTrack"/>
    <r:layoutResources/>

</head>
<body>
<g:javascript src="bootstrap.min.js" />
<div class="container">

    <div class="starter-template">
        <h1>Multiple tracks of functional data at genomic positions</h1>
        <h1 >
            <a onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/multiTrack.js')">multiTrack.js</a>
        </h1>
    </div>

</div>
<p class="standardEmphasisFont">
<div>
    <div  id="legend"></div>
    <div  id="chart1"></div>
</div>



<script type="text/javascript">
    $( document ).ready(function() {
        var correlationMatrix = [
            {'CHROM':'8',
                'START':117951200,
                'STOP':118295000,
                'source':'DuodenumMucosa',
                'element':'Quiescent-low_signal'},
            {'CHROM':'8',
                'START':118075200,
                'STOP':118499000,
                'source':'ColonicMucosa',
                'element':'Quiescent-low_signal'},
            {'CHROM':'8',
                'START':118184600,
                'STOP':118185000,
                'source':'ES-HUES6',
                'element':'Weak_enhancer'},
            {'CHROM':'8',
                'START':118155000,
                'STOP':118198200,
                'source':'Islets',
                'element':'Active_enhancer_'}
        ];
        var xlabels = [];
        var ylabels = ['DuodenumMucosa',
            'ColonicMucosa',
            'ES-HUES6',
            'Islets'];
        var margin = {top: 50, right: 50, bottom: 100, left: 150},
            width = 650 - margin.left - margin.right,
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
