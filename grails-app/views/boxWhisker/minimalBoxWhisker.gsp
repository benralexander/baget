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
        <h1 style="font-weight: normal">Chart made with
            <a onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/boxWhiskerPlot.js')">boxWhiskerPlot.js</a>
        </h1>
    </div>

</div>
<p class="standardEmphasisFont">
<h2>Box whisker plot.</h2>
</p>



<div class="row">
    <div class="col-md-6">
        <div id='correlationPlotLayout'>
            <span id='plot'></span>
        </div>
    </div>

    <div class="col-md-4">
        <div class="boxWhiskerControls" style="height:220px">
            <div class="boxAround" style="height:210px; margin-bottom: 10px" >
                <div class="row">
                <div class="col-md-2">

                </div>
                <div class="col-md-8 boxWhiskerControllerLabel">
                    Box whisker controls
                </div>
                <div class="col-md-2">

                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-md-10">
                            <div class="boxAround">
                                <label class="checkboxHolder">
                                    <input type="checkbox" name="whiskers" class="checkbox style-2 pull-right" value="whiskers"
                                           aria-label="whiskers visible" onclick="setWhiskerToNothing()"
                                           checked>whiskers visible</input>
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2">
                            <span class="funcExtender">
                                <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"
                                      onclick="displaySlider()"></span>
                            </span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-10">
                            <div class="boxAround">
                                <label class="checkboxHolder">
                                    <input type="checkbox" name="outliers" class="checkbox style-2 pull-right" value="outliers"
                                           aria-label="outliers visible" onclick="setOutliersToNothing()"
                                           checked>Outliers visible</input>
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2">
                            <span class="funcExtender">
                                <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"
                                      onclick="displayRadiusAdjuster()"></span>
                            </span>
                        </div>

                    </div>

                    <div class="row">
                        <div class="col-md-10">
                            <div class="boxAround">
                                <label class="checkboxHolder">
                                    <input type="checkbox" name="histogram" class="checkbox style-2 pull-right"
                                           value="histogram" aria-label="histogram visible"
                                           onclick="setHistogramToNothing()">Histogram visible</input>
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2">
                            <span class="funcExtender">
                                <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"
                                      onclick="displayHistogramAdjuster()"></span>
                            </span>
                        </div>

                    </div>

                </div>

                <div class="col-md-4">
                    <div class="boxAround controlSwitcher" style="height: 150px">


                        <div id="outlierRelatedControls" style="display: none">
                            <div class='outlierRadiusLabel'>Outlier radius:</div>

                            <form id="outlierRadius">
                                <div class="row options">
                                    <div class="col-md-4">
                                        <input type="radio" name="outlierRadius" value="1">small</input>
                                    </div>

                                    <div class="col-md-4">
                                        <input type="radio" name="outlierRadius" value="3" checked>small</input>
                                    </div>

                                    <div class="col-md-4">
                                        <input type="radio" name="outlierRadius" value="6">large</input>
                                    </div>
                                </div>
                            </form>
                        </div>


                        <div id="whiskerRelatedControls" style="display: none">

                                <div class='whiskerRelatedLabel'>Whisker multiplier:</div>



                            <div id='slider'>
                            </div>
                        </div>


                        <div id="histogramRelatedControls" style="display: none">
                            <div class='histogramBarLabel'>Histogram bar size:</div>

                            <form id="histogramBar">
                                <div class="row options">
                                    <div class="col-md-4">
                                        <input type="radio" name="histogramBar" value="0.5">small</input>
                                    </div>

                                    <div class="col-md-4">
                                        <input type="radio" name="histogramBar" value="1.2" checked>medium</input>
                                    </div>

                                    <div class="col-md-4">
                                        <input type="radio" name="histogramBar" value="2.2">large</input>
                                    </div>
                                </div>
                            </form>


                        </div>
                    </div>
                </div>
                <div class="col-md-2">

                </div>

            </div>

        </div>

        </div>
    </div>
<div class="col-md-2"></div>
</div>


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
            onScreenEnd = 100,
            defaultHistogramBarSize = 1.1;

    var whiskerSlider;

    /***
     *   Initial data-independent initializations oof the box whisker plot.  Note that this initialization has to take place
     *   so that we have something to which we can connect the slider
     */
    var chart = baget.boxWhiskerPlot()
            .width(width)
            .height(height);


     var displaySlider  = function ()  {
         $('#histogramRelatedControls').hide();
         $('#outlierRelatedControls').hide();
         $('#whiskerRelatedControls').show();
     } ;
     var displayRadiusAdjuster  = function ()  {
         $('#histogramRelatedControls').hide();
         $('#whiskerRelatedControls').hide();
         $('#outlierRelatedControls').show();
     } ;
     var displayHistogramAdjuster  = function ()  {
         $('#outlierRelatedControls').hide();
         $('#whiskerRelatedControls').hide();
         $('#histogramRelatedControls').show()
     } ;




     var setWhiskerToNothing = function() {
         if ($('input:checkbox[name=whiskers]')[0].checked)  {
             chart.whiskers(chart.iqr(whiskerSlider.sliderLocation));
         }   else {
             chart.whiskers(chart.iqr(minimumInterquartileMultiplier));
         }
         d3.select('#plot')
                 .selectAll('svg')
                 .call(chart.boxWhisker);
     };

     var setOutliersToNothing = function() {
         if ($('input:checkbox[name=outliers]')[0].checked)  {
             var  integerOutlierRadius = parseInt( $('input:radio[name=outlierRadius]:checked').val());
             chart.outlierRadius(integerOutlierRadius);
         }   else {
             chart.outlierRadius(1e-6);
         }
         d3.select('#plot')
                 .selectAll('svg')
                 .call(chart.boxWhisker);
     };


     var setHistogramToNothing = function() {
         var  histogramBarSize,
          histogramBarSizeRadioButtonDomElement =  $('input:radio[name=histogram]:checked');
         if ( typeof histogramBarSizeRadioButtonDomElement=== 'undefined') {  // if the buttons aren't displayed this test comes back as empty so we need a default
             histogramBarSize = defaultHistogramBarSize;
         } else {
             histogramBarSize = parseFloat( $('input:radio[name=histogramBar]:checked').val());
         }
         chart.histogramBarMultiplier(histogramBarSize);
         d3.select('#plot')
                 .selectAll('svg')
                 .call(chart.boxWhisker);
     };



     /***
     *   Everything that has to do with the slider.  First we define it, then use the 'chart'
      *   variable to connect it to the box whisker plot
      */
     var createSliderAndConnectToBoxWhisker  = (function(chart) {
         // build a slider and attach the callback methods
         whiskerSlider = baget.slider(minimumInterquartileMultiplier,
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
                .whiskers(chart.iqr(defaultInterquartileMultiplier))  // adjust the whiskers so that they go to the right initial  position
                .histogramBarMultiplier(0);        // let's start with no histogram visible

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


     $("#histogramBar").click(function(d,x) {
         var  histogramBarSize = parseFloat( $('input:radio[name=histogramBar]:checked').val());
         chart.histogramBarMultiplier(histogramBarSize);
         d3.select('#plot')
                 .selectAll('svg')
                 .call(chart.boxWhisker);
     }) ;


     var v=[-10,10];
    var x=UTILS.distributionMapper(v,20);
    console.log('hi, binMap='+ x.binMap+".'");
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