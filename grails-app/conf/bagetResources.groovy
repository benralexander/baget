modules = {

    tooltip{
        resource url: 'js/baget/d3tooltip.js'
    }
    bootstrap {
        resource url: 'http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'
        resource url: 'http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css'
        resource url: 'http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js'
    }
    core {
        dependsOn "bootstrap"

        resource url: 'css/baget/baget.css'

        resource url: 'js/jquery-1.11.0.min.js'
        resource url: 'js/d3.min.js'
        resource url: 'js/baget/ie10-viewport-bug-workaround.js'
        resource url: 'js/baget/ie-emulation-modes-warning.js'
        resource url: 'js/baget/sharedMethods.js'
        resource url: 'js/baget/qqplot.js'
        resource url: 'js/baget/barchart.js'

        resource url: 'js/baget/sharedMethods.js'
        resource url: 'js/baget/slider.js'
    }

}

