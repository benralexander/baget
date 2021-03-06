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
        response.setHeader("Content-disposition", "attachment; filename=foo.csv");
        render(contentType: "text/csv", text: csvDataAsString);
        return
    }
    def infectionDataPerState() {
        String csvDataAsString = new File('./web-app/WEB-INF/resources/daily.csv').text
        response.setHeader("Content-disposition", "attachment; filename=foo.csv");
        render(contentType: "text/csv", text: csvDataAsString);
        return
    }
    def populationPerState() {
        String csvDataAsString =  new File(grailsApplication.mainContext.getResource("/WEB-INF/resources/StatePopulationAndAbbrev.csv").file.toString()).text;
        response.setHeader("Content-disposition", "attachment; filename=foo.csv");
        render(contentType: "text/csv", text: csvDataAsString);
        return
    }


}
