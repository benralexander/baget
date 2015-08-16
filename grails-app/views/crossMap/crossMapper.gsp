
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="core"/>
    <r:require modules="core,crossMap"/>
    <r:layoutResources/>
    <style>
    text.y {
        font-size: 12pt;
    }
    text.x {
        font-size: 12pt;
    }
    </style>
</head>
<body>

%{--<g:javascript src="bootstrap.min.js" />--}%
<div class="container">

    <div class="starter-template">
        <h1 style="font-weight: bold">Cross trait map</h1>
    </div>


    <div class="starter-template">
        <h2>Plot made with crossMap.js</h2>
    </div>

    <div>
        <h5>Author's note: that I'm currently experimenting, and trying to work out an alternate method for imposing a sort on the SNPs in
            the below graphic.   I've put a little gray rectangle to the right of each of the phenotype descriptions, and if you click that rectangle
            then all of the SNPs ( across all 25 phenotypes) will be sorted by the magnitude of the chosen phenotype.  I'm imagining
            that biologists might wish to easily identify a lead SNP, and to see if it tracks with other SNPs.  The problem is that by
            sorting on the basis of P value, I have to ignore the default sort (which is based on each SNP's genomic location).  Both
            methods of sorting are potentially useful, but going back and forth between them seems disruptive and confusing. What would be a better approach?
            Maybe using another graphics channel ( size, shape, color, direction)? or am I instead simply trying to take this graphic in an
            unnatural direction?  Any ideas or comments are welcome, and could come through the feedback mechanisms
            on my <a href="http://bovinecontemplation.org">bovinecontemplation.org</a> website.


        </h5>
    </div>

</div>
<style>

</style>


<div class="jumbotron">
    <div class="container">

        <div class="btn-toolbar">
            <div class="pull-left"></div>

            <div class="pull-right">
                <div class="btn-group">
                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                        JavaScript                                                         mean
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/sharedMethods.js')">sharedMethods.js</li>
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>', 'js/baget/crossMap.js')">crossMap.js</li>

                    </ul>
                </div>

                <div class="btn-group">
                    <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                        Stylesheets
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="btn"
                            onclick="UTILS.openTheWindow('<g:createLink controller='qqPlot' action ='index'/>',  'css/baget/crossMap.css')">crossMap.css</li>
                    </ul>
                </div>
            </div>
        </div>

    </div>



    <div class="row">

        <div class="col-md-2"></div>

        <div class="col-md-8">
            <div class="vis-container">

                <div id="vis"></div>

                <div id="tooltip" class="hidden">
                    <p><span id="value"></span></p>
                </div>
            </div>
            <div class="col-md-2"></div>

        </div>

    </div>
</div>
<script>
    var phenotypeListConstructor = function (inString) {
        var keyValue = {};
        var arrayHolder = [];
        var listOfPhenotypes = inString.split(",");
        for (var i = 0; i < listOfPhenotypes.length; i++) {
            var phenotypeAndKey = listOfPhenotypes[i].split(":");
            var reclaimedKey = phenotypeAndKey [0];
            var reclaimedLabel = phenotypeAndKey [1].replace(/\+/g, ' ');
            keyValue  [reclaimedKey] = reclaimedLabel;
            arrayHolder.push({key: reclaimedKey,
                val: reclaimedLabel});
        } ;
        return {phenotypeMap:keyValue,
                phenotypeArray:arrayHolder};
    }

    var loading = $('#spinner').show();
    $.ajax({
        cache:false,
        type:"get",
        url:"${createLink(controller:'crossMap', action:'crossData')}",
        async:true,
        success: function (data) {
            fillTraitVariantCross(data) ;
            loading.hide();
        },
        error: function(jqXHR, exception) {
            loading.hide();
            core.errorReporter(jqXHR, exception) ;
        }
    });
    var  phenotypeMap =  phenotypeListConstructor (decodeURIComponent("T2D%3Atype+2+diabetes%2CFastGlu%3Afasting+glucose%2CFastIns%3Afasting+insulin%2CProIns%3Afasting+proinsulin%2C2hrGLU_BMIAdj%3Atwo-hour+glucose%2C2hrIns_BMIAdj%3Atwo-hour+insulin%2CHOMAIR%3AHOMA-IR%2CHOMAB%3AHOMA-B%2CHbA1c%3AHbA1c%2CBMI%3ABMI%2CWHR%3Awaist-hip+ratio%2CHeight%3Aheight%2CTC%3Atotal+cholesterol%2CHDL%3AHDL+cholesterol%2CLDL%3ALDL+cholesterol%2CTG%3ATriglycerides%2CCAD%3Acoronary+artery+disease%2CCKD%3Achronic+kidney+disease%2CeGFRcrea%3AeGFR-creat+%28serum+creatinine%29%2CeGFRcys%3AeGFR-cys+%28serum+cystatin+C%29%2CUACR%3Aurinary+albumin-to-creatinine+ratio%2CMA%3Amicroalbuminuria%2CBIP%3Abipolar+disorder%2CSCZ%3Aschizophrenia%2CMDD%3Amajor+depressive+disorder" )) ;
    function fillTraitVariantCross (data)  {
        var margin = { top: 175, right: 100, bottom: 25, left: 10 },
                width = 1180 - margin.left - margin.right,
                height = 1050 - margin.top - margin.bottom;


        var crossMap = baget.crossMap()
                .width(width)
                .height (height)
                .margin (margin)
                .variantLinkUrl ('<g:createLink controller="variant" action="variantInfo" />')
                .phenotypeArray (phenotypeMap.phenotypeArray);

        crossMap.dataHanger("#vis",data)
                .render(-1);


    }

</script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
%{--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>--}%
<!-- Include all compiled plugins (below), or include individual files as needed -->
%{--<script src="../../../web-app/js/baget/bootstrap.min.js"></script>--}%
</body>
</html>