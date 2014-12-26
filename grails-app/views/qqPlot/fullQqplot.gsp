<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,qqplot"/>
    <r:layoutResources/>
</head>
<body>


<g:javascript src="bootstrap.min.js" />

<script>
    var displaySignificanceIndicator = function () {
        if (d3.select('.qqcontrols').style('display') === 'block') {
            d3.select('.qqcontrols').style('display', 'none');
            qqPlot.displaySignificanceLine(false);
            d3.select("#scatterPlot1").call(qqPlot.render);
        } else {
            d3.select('.qqcontrols').style('display', 'block');
            var significanceLineValue = qqPlot.significanceLineValue();
            if (typeof(slider.sliderLocation) !== 'undefined') {
                slider.sliderLocation(significanceLineValue);
            }
            qqPlot.displaySignificanceLine(true);
            d3.select("#scatterPlot1").call(qqPlot.render);
        }

    };
   var prepareForUpload  =  function ()  {
       if (d3.select('#uploadButtonHider').style('display')==='block') {
           d3.select('#uploadButtonHider').style('display','none');
           window.location.href = './baget/returnToDefaultJsonData';
       }  else {
           d3.select('#uploadButtonHider').style('display','block');
       }

   };

   var displayIdentityLine =  function () {
        if (qqPlot.displayIdentityLine()) {
            qqPlot.displayIdentityLine(false);
            d3.select("#scatterPlot1").call(qqPlot.render);
        }else {
            qqPlot.displayIdentityLine(true);
            d3.select("#scatterPlot1").call(qqPlot.render);
        }
    };
//
//  var openTheWindow = function (url,desiredPath){
//       var initialUrl = url;
//       var rootUrl =  initialUrl.substring(0,initialUrl.length-12);
//      var urlExtension = rootUrl + desiredPath;
//       window.open (urlExtension);
//    }
//
   data = [[
       {x:3.5,
           y:3.5,
           p:'rs79716074'
       },
       {x:4.9,
           y:4.99,
           p:'more useful information'
       },
       {x:7,
           y:8,
           p:'more information'
       }
   ]];

</script>

<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">QQ Plot</h1>
        <p class="lead">Fully interactive</p>
    </div>

</div><!-- /.container -->


    <div class="jumbotron">
    <div class="container">


        <div class="btn-toolbar">
            <div class="pull-left"> <a href="<g:createLink controller='qqPlot' action ='minimalQq'/>">Minimal example</a></div>
            <div class="pull-right">
        <div class="btn-group">
            <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                JavaScript
                <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <li class="btn" onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>','js/baget/sharedMethods.js')">sharedMethods.js</li>
                <li class="btn" onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>','js/baget/qqplot.js')">qqplot.js</li>
                <li class="btn" onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>','js/baget/d3tooltip.js')">d3tooltip.js</li>
                <li class="btn" onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>','js/baget/slider.js')">slider.js</li>
            </ul>
        </div>
        <div class="btn-group">
            <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                Stylesheets
                <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <li class="btn" onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>','css/baget/baget.css')">baget.css</li>
            </ul>
        </div>
            </div>
        </div>


        <div class="row">
            <div class="col-md-8"><div id="scatterPlot1"></div></div>
            <div class="col-md-1">
                <div id="uploadButtonHider" style="display:none">
                    <g:uploadForm action="upload">
                        <input type="file"  class="btn btn-default btn-sm" name="myFile" />
                        <input type="submit"   class="btn btn-default btn-sm" />
                    </g:uploadForm>
                </div>
             </div>
            <div class="col-md-1">
                <div class='buttonHolder' height="100%">
                <div id="btnmgr" class="btn-group-vertical" style="vertical-align: bottom">
                    <button type="button" class="btn btn-default btn-sm" onclick="displaySignificanceIndicator ()">significance indicator
                    </button>
                    <button type="button" class="btn btn-default btn-sm" onclick="displayIdentityLine ()">identity line
                    </button>
                    <button type="button" class="btn btn-default btn-sm" onclick="prepareForUpload ()">uploadFile
                    </button>
                </div>
                </div>
            </div>

            <div class="col-md-2"><div class='qqcontrols'><div id='slider'></div></div></div>
        </div>



    </div>
</div>
<script>

    var margin = {top: 30, right: 20, bottom: 50, left: 70},
            width = 700 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom,
            sliderOnScreenTop = 10,
            sliderOnScreenBottom = 200;



    var qqPlot ;
    <g:if test="${dataFileBased}">
    d3.json("../qqPlot/qqPlotData?id=1", function (error, json) {
    </g:if>
    <g:else>
    d3.json("../qqPlot/qqPlotData", function (error, json) {
    </g:else>

        var dataRange = UTILS.extractDataRange(json);


        qqPlot=baget.qqPlot()
                .width(width)
                .height(height)
                .margin(margin)
//                 .xAxisLabel('expected')
//                 .yAxisLabel('observed')
//                 .xAxisAccessor(function (d) {
//                     return d.x;
//                 })
//                 .yAxisAccessor(function (d) {
//                     return d.y;
//                 })
//                 .tooltipAccessor(function (d) {
//                     return d.popup
//                 })
                .displayIdentityLine (false)
                .displaySignificanceLine(false)
                .significanceLineValue (dataRange.median)
                .dataHanger ("#scatterPlot1", json);
        d3.select("#scatterPlot1").call(qqPlot.render);



        var slider = baget.slider(dataRange.max,
                dataRange.min,
                sliderOnScreenTop,
                sliderOnScreenBottom,
                'vertical',dataRange.median ,onBrushMoveDoThis,onBrushEndDoThis) ;
        slider.sliderLocation(dataRange.median);



    } );


    var onBrushMoveDoThis = function(d){
        if (typeof(qqPlot) !=="undefined") {
            qqPlot.significanceLineValue(d);
        }
    };
    var onBrushEndDoThis = function(){
        if (typeof(qqPlot) !=="undefined") {
            d3.select("#scatterPlot1").call(qqPlot.render);
        }

    };






</script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
%{--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>--}%
<!-- Include all compiled plugins (below), or include individual files as needed -->
%{--<script src="../../../web-app/js/baget/bootstrap.min.js"></script>--}%
</body>
</html>