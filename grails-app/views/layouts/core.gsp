<!DOCTYPE html>
<html>
<head>

    <title>Baget</title>

    <meta charset="utf-8">
    <title>QQ plot</title>
    <link rel="stylesheet" type="text/css" href="../css/styles.css"/>
    <script type="text/javascript" src="../js/d3.js"></script>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="ba">
    <link rel="icon" href="../../baget.ico">


    <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700,900,300italic,400italic,700italic,900italic'
          rel='stylesheet' type='text/css'>

    <g:layoutHead/>
</head>

<body>

<div id="spinner" class="spinner" style="display:none;">
</div>

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>

            </button>
            <a class="navbar-brand" href="<g:createLink controller='baget' action ='projectDescription'/>">BAGET project</a>
        </div>
        <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="<g:createLink controller='baget' action ='index'/>">QQ Plot</a></li>
            </ul>
        </div>
    </div>
</div>

<g:layoutBody/>

<div id="footer">
    <div class="container">
        <div class="separator"></div>
    </div>
</div>

<div id="belowfooter"></div>

</body>
</html>