package baget

import groovy.json.JsonSlurper
import org.codehaus.groovy.grails.web.json.JSONArray

class GrowthFactorController {

    def index() {
        render(view: 'growthFactorPlot')
    }

    def growthFactorPlot() {
        render(view: 'growthFactorPlot')
    }

    def infectionDataPerCountry() {
        String csvDataAsString = new File('./web-app/WEB-INF/resources/covid-confirmed-deaths-since-5th-death.csv').text
//        String csvDataAsString = new File('./web-app/WEB-INF/resources/covid-confirmed-daily-deaths-epidemiological-trajectory.csv').text

        response.setHeader("Content-disposition", "attachment; filename=foo.csv");
        render(contentType: "text/csv", text: csvDataAsString);
//        render(status: 200, contentType: "text/csv") {
//            csvDataAsString
//        }
        return
    }
}
