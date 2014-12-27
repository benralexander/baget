<!DOCTYPE html>
<html xmlns:xlink="http://www.w3.org/1999/xlink">
<meta charset="utf-8">
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,boxwhisker"/>
    <r:layoutResources/>
</head>
<body>
<g:javascript src="bootstrap.min.js" />
<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">Bar chart</h1>
        <h1 style="font-weight: normal">All charts made with
            <a onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/boxWhiskerPlot.js')">boxWhiskerPlot.js</a>
        </h1>
    </div>

</div>
<p class="standardEmphasisFont">
<h2>Simple bar chart with labels</h2></p>
<table style='margin-top: 50px; border-top: 50px;'>
    <tr>
        <td id='correlationPlotLayout'>
            <span id='plot'></span>
        </td>
        <td id='correlationPlotControllers'>
            <div class='iqmLabel'>
                Interquartile multiplier
            </div>
            %{--<div id='slider'--}%
            %{--style="border: 2px outset #ad0000;--}%
            %{--">                          --}%
            <div id='slider'>
                %{--<span style="margin-left: -35px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; text-decoration: underline">--}%
                %{--<nobr>Interquartile multiplier</nobr>--}%
                %{--</span>--}%
            </div>

            %{--<div id="outlierRadiusDiv" style="border: 2px outset red; width: 131px;margin-left: 10px;">--}%
            %{--<div class='outlierRadiusLabel' style="font-size: 10pt; margin-left:5px;padding-top:10px;  text-decoration : underline">Outlier radius:</div>--}%

            <div id='outlierRadiusDiv' >
                <div class='outlierRadiusLabel'>Outlier radius:</div>
                <form id="outlierRadius">
                    <table class='options'>
                        <tr>
                            <td>
                                <input type="radio"  name="outlierRadius" value="1">tiny</input>
                            </td>
                            <td>
                                <input type="radio"  name="outlierRadius" value="2">small</input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="radio"  name="outlierRadius" value="4">medium</input>
                            </td>
                            <td>
                                <input type="radio"  name="outlierRadius" value="6" checked>large</input>
                            </td>
                        </tr>
                    </table>

                </form>
            </div>

        </td>
        <td style='margin-right: 0px;'></td>
    </tr>





</table>
</p>

<div id='imageHolder'></div>
<script>
    // for stub only
    var compound = {compound_id:123456,
        compound_name:'benzaldehyde' };

    $('#imageHolder').data('compound',compound);
</script>


<script>

    var
    // these sizes referred to each individual bar in the bar whisker plot
            margin = {top: 50, right: 50, bottom: 20, left: 50},
            width = 420 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom,
            globalMinimum = Infinity,
            globalMaximum = -Infinity;

    // initial value of the interquartile multiplier. Note that this value
    //  is adjustable via a UI slider
    var defaultInterquartileMultiplier = 1.5,
            maximumInterquartileMultiplier = 3,
            minimumInterquartileMultiplier = 0,
            onScreenStart = 0,
            onScreenEnd = 100;

    // build those portions of the box whisker plot that are data independent
    var chart = baget.boxWhiskerPlot()
            .width(width)
            .height(height)
            .boxWhiskerName ('3,4,5-trimethoxy benzaldehyde');


    // build a slider and attach the callback methods
    var slider = baget.slider(minimumInterquartileMultiplier,
            maximumInterquartileMultiplier,
            onScreenStart,
            onScreenEnd,
            'vertical',defaultInterquartileMultiplier,onBrushMoveDoThis,onBrushEndDoThis) ;
    onBrushMoveDoThis(minimumInterquartileMultiplier);

    // get your data
    d3.json("<g:createLink controller='boxWhisker' action='retrieveMultiBoxData'/>", function (error, data) {


        chart.selectionIdentifier('#plot')
                .initData(data);

        function respondToScatterData(data)  {
            var margin = {top: 80, right: 20, bottom: 50, left: 70},
                    width = 400 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;
            cbbo.scatterPlot()
                    .selectionIdentifier("#scatterPlot1")
                    .width (width)
                    .height (height)
                    .margin(margin)
                    .assignData (data)
                    .xAxisLabel ('Navitoclax AUC')
                    .yAxisLabel ('BCL2 expression level')
                    .yAxisAccessor(function(d){return d.value})
                    .xAxisAccessor(function(d){return d.cpd_auc})
                    .clickCallback(function(){console.log('stub clickCallback')})
                    .render() ;

        }



        var clickCallback = function (compoundId, geneName) {
            var regObj = new Object();
            regObj.cpd_id = compoundId;
            regObj.gene_primary_name = geneName;


            var res = $.ajax({
                url: './correlationPoints',
                type: 'post',
                context: document.body,
                data: JSON.stringify(regObj),
                contentType: 'application/json',
                async: true,
                success: function (data) {
                    var obj = (JSON.parse(data));
                    respondToScatterData(obj.results);
                },
                error: function () {
                    alert('Contact message failed');
                }
            });
        } ;

        chart
                .whiskers(iqr(defaultInterquartileMultiplier))
                .scatterDataCallback( respondToScatterData )
                .retrieveCorrelationData(clickCallback);



        d3.select('#plot')
                .selectAll('svg')
                .call(chart.render);



    });






    //  The adjustment we should make every time the slider moves a little
    function onBrushMoveDoThis (value)  {
        chart.whiskers(iqr(value));
    }

    //  What to do when the slider has stopped moving
    function onBrushEndDoThis () {

        d3.select('#plot')
                .selectAll('svg')
                .call(chart.render);


        //chart.render();
    }

    // Returns a function to compute the interquartile range, which is represented
    // through the whiskers attached to the quartile boxes.  Without this function the
    // whiskers will expand to cover the entire data range. With it they will
    // shrink to cover a multiple of the interquartile range.  Set the parameter
    // two zero and you'll get a box with no whiskers
    function iqr(k) {
        return function(d, i) {
            var q1 = d.quartiles[0],
                    q3 = d.quartiles[2],
                    iqr = (q3 - q1) * k,
                    i = -1,
                    j = d.length;
            while ((d[++i].v) < q1 - iqr);
            while ((d[--j].v) > q3 + iqr);
            return [i, j];
        };
    }

    $("#outlierRadius").click(function(d,x) {
        var  integerOutlierRadius = parseInt( $('input:radio[name=outlierRadius]:checked').val());
        chart.outlierRadius(integerOutlierRadius);
        d3.select('#plot')
                .selectAll('svg')
                .call(chart.render);
    }) ;

</script>
<div class="messagepop pop" id="examineCorrelation">
    <form method="post" id="new_message" action="/messages">
        <div id='scatterPlot1'></div>
        <p><a id='scatterPlotCloser' class='close' href='/'>Close window</a></p>
    </form>
</div>

<script>

</script>



</body>
</html>