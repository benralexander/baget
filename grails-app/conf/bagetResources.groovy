modules = {

    tooltip{
        resource url: 'js/baget/d3tooltip.js'
    }
    d3tooltip {
        resource url: 'js/baget/d3tooltip.js'
        resource url: 'css/baget/d3tooltip.css'
    }
    bootstrap {
        resource url: 'http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'
        resource url: 'http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css'
        resource url: 'http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js'
    }
    jquery {
        resource url: 'js/jquery-1.11.0.min.js'
    }
    core {
        dependsOn "jquery,bootstrap"

        resource url: 'css/baget/baget.css'


        resource url: 'js/d3.min.js'

        resource url: 'js/baget/ie10-viewport-bug-workaround.js'
        resource url: 'js/baget/ie-emulation-modes-warning.js'

        resource url: 'js/baget/sharedMethods.js'
        resource url: 'js/baget/slider.js'
    }
    qqplot {
        resource url: 'css/baget/qqplot.css'
        resource url: 'js/baget/qqplot.js'
    }
    manhattan {
        resource url: 'css/baget/manhattan.css'
        resource url: 'js/baget/manhattan.js'
    }
    crossMap {
        dependsOn "d3tooltip"

        resource url: 'css/baget/crossMap.css'
        resource url: 'js/baget/crossMap.js'
    }

    barchart {
          resource url: 'css/baget/barchart.css'
          resource url: 'js/baget/barchart.js'
    }
    boxwhisker {
        resource url: 'css/baget/boxWhiskerPlot.css'
        resource url: 'css/baget/clickablePopUp.css'
        resource url: 'css/baget/slider.css'
        resource url: 'css/baget/d3tooltip.css'
        resource url: 'css/baget/scatter.css'

        resource url: 'js/baget/boxWhiskerPlot.js'

    }

}

