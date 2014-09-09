<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>QQ plot</title>
    <link rel="stylesheet" type="text/css" href="../css/styles.css"/>
    <script type="text/javascript" src="../js/d3.js"></script>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="ba">
    <link rel="icon" href="../../baget.ico">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>

<link media="all" rel="stylesheet" href="../css/baget/baget.css">
<link media="all" rel="stylesheet" href="../css/baget/bootstrap.min.css">
<link media="all" rel="stylesheet" href="../css/baget/ie-emulation-modes-warning.js">
<link media="all" rel="stylesheet" href="../css/baget/ie10-viewport-bug-workaround.js">
<script src="../js/d3.js"></script>
<script src="../js/baget/sharedMethods.js"></script>
<script src="../js/baget/qqplot.js"></script>
<script src="../js/baget/d3tooltip.js"></script>
<script src="../js/baget/slider.js"></script>
<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-53398031-1', 'auto');
    ga('send', 'pageview');

</script>
<script>
    var displaySignificanceIndicator = function () {
        if (d3.select('.qqcontrols').style('display') === 'block') {
            d3.select('.qqcontrols').style('display', 'none');
            qqPlot.displaySignificanceLine(false).render();
        } else {
            d3.select('.qqcontrols').style('display', 'block');
            qqPlot.displaySignificanceLine(true).render();
            var significanceLineValue = qqPlot.significanceLineValue();
            if (typeof(slider.sliderLocation) !== 'undefined') {
                slider.sliderLocation(significanceLineValue);
            }
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
            qqPlot.displayIdentityLine(false).render();
        }else {
            qqPlot.displayIdentityLine(true).render();
        }
    };

  var openTheWindow = function (url,desiredPath){
       var initialUrl = url;
       var rootUrl =  initialUrl.substring(0,initialUrl.length-11);
      var urlExtension = rootUrl + desiredPath;
       window.open (urlExtension);
    }

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

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">BAGET project</a>
        </div>
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="<g:createLink controller='baget' action ='index'/>">Home</a></li>
                <li class="active"><a onclick="openTheWindow('<g:createLink controller='baget' action ='index'/>','css/baget/baget.css')">baget.css</a></li>
                <li class="active"><a onclick="openTheWindow('<g:createLink controller='baget' action ='index'/>','js/baget/qqplot.js')">qqplot.js</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</div>

<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">QQ Plot</h1>
        <p class="lead">Product of the <span class="bagetTitle">Broad Accumulated Graphical Elements Team (BAGET)</span><br></p>
    </div>

</div><!-- /.container -->

<div class="jumbotron">
    <div class="container">

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
    d3.json("../baget/qqPlotData?id=1", function (error, json) {
    </g:if>
    <g:else>
    d3.json("../baget/qqPlotData", function (error, json) {
    </g:else>

        var dataRange = UTILS.extractDataRange(json);


        qqPlot=baget.qqPlot()
                .selectionIdentifier("#scatterPlot1")
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
                .assignData(json);
        qqPlot.render();


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
            qqPlot.render();
        }
    };






</script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="../js/baget/bootstrap.min.js"></script>
</body>
</html>