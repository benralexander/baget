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
     /***
      * Start with all the user adjustable variables.
      */
    var margin = {top: 50, right: 50, bottom: 20, left: 50},
            width = 420 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    // initial value of the interquartile multiplier. Note that this value
    //  is adjustable via a UI slider
    var defaultInterquartileMultiplier = 1.5,
            maximumInterquartileMultiplier = 3,
            minimumInterquartileMultiplier = 0,
            onScreenStart = 0,
            onScreenEnd = 100;


    /***
     *   Initial data-independent initializations oof the box whisker plot.  Note that this initialization has to take place
     *   so that we have something to which we can connect the slider
     */
    var chart = baget.boxWhiskerPlot()
            .width(width)
            .height(height);

     /***
     *   Everything that has to do with the slider.  First we define it, then use the 'chart'
      *   variable to connect it to the box whisker plot
      */
     var createSliderAndConnectToBoxWhisker  = (function(chart) {
         // build a slider and attach the callback methods
         baget.slider(minimumInterquartileMultiplier,
                 maximumInterquartileMultiplier,
                 onScreenStart,
                 onScreenEnd,
                 'vertical',defaultInterquartileMultiplier,onBrushMoveDoThis,onBrushEndDoThis) ;
         onBrushMoveDoThis(minimumInterquartileMultiplier);

         //  The adjustment we should make every time the slider moves a little
         function onBrushMoveDoThis (value)  {
             chart.whiskers(chart.iqr(value));
         }

         //  What to do when the slider has stopped moving
         function onBrushEndDoThis () {
             d3.select('#plot')
                     .selectAll('svg')
                     .call(chart.boxWhisker);
         }

     });
     createSliderAndConnectToBoxWhisker(chart);



     /***
     *  Now it's time to get the data
      */
    d3.json("<g:createLink controller='boxWhisker' action='retrieveMultiBoxData'/>", function (error, data) {


        chart.selectionIdentifier('#plot') // the Dom element from which we will hang the plot
                .initData(data)            // the information that goes into the plot
                .whiskers(chart.iqr(defaultInterquartileMultiplier));   // adjust the whiskers so that they go to the right initial  position

        //  Now we are ready to actually launch the box whisker plot
        d3.select('#plot')
                .selectAll('svg')
                .call(chart.boxWhisker);



    });



    $("#outlierRadius").click(function(d,x) {
        var  integerOutlierRadius = parseInt( $('input:radio[name=outlierRadius]:checked').val());
        chart.outlierRadius(integerOutlierRadius);
        d3.select('#plot')
                .selectAll('svg')
                .call(chart.boxWhisker);
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