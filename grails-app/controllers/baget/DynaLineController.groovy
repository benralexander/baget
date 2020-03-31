package baget

import groovy.json.JsonSlurper
import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject

class DynaLineController {
    def index() {
        render(view: 'dynaLine', model: [dataFileBased: 0])
    }

    def dynaLine() {
        render(view: 'dynaLine', model: [dataFileBased: 0])
    }


    def functionalData() {
        render(view: 'dynaLine', model: [])
    }

    def bestGeneBurdenResults() {
        String jsonDataAsString = new File('./web-app/WEB-INF/resources/bestBurdenTest.json').text
        def slurper = new JsonSlurper()
        JSONArray jsonArray = slurper.parseText(jsonDataAsString)
        render(status: 200, contentType: "application/json") {
            jsonArray
        }
        return
    }

    def bestGeneBurdenResultsForGene() {
        String geneString = params.gene
        String jsonDataAsString = new File('./web-app/WEB-INF/resources/bestBurdenTest.json').text
        def slurper = new JsonSlurper()
        JSONArray jsonArray = slurper.parseText(jsonDataAsString)
        JSONObject jsonObject = jsonArray.find { a -> a.gene == geneString }
        render(status: 200, contentType: "application/json") {
            jsonObject
        }
        return
    }

}