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

// c=  chromosome number, y=-1og P, x= location in chromosome, n= name
    def rawJson = """
[{"x":100,"y":1,"c":1,"n":"rs1234567"},
{"x":10000000,"y":3,"c":1,"n":"rs1234567"},
{"x":90000000,"y":2,"c":1,"n":"rs1234567"},
{"x":2253000,"y":1,"c":2,"n":"rs1234567"},
{"x":6012000,"y":1,"c":3,"n":"rs1234567"},
{"x":1147000,"y":9,"c":4,"n":"rs1234567"},
{"x":3000000,"y":8,"c":4,"n":"rs1234567"},
{"x":999000,"y":8,"c":4,"n":"rs1234567"},
{"x":666000,"y":2,"c":5,"n":"rs1234567"},
{"x":221000,"y":1,"c":6,"n":"rs1234567"},
{"x":635000,"y":3,"c":7,"n":"rs1234567"},
{"x":16179100,"y":2,"c":9,"n":"rs1234567"},
{"x":6748300,"y":3,"c":10,"n":"rs1234567"},
{"x":4689800,"y":2,"c":10,"n":"rs1234567"},
{"x":1201700,"y":3,"c":11,"n":"rs1234567"},
{"x":5888000,"y":2,"c":12,"n":"rs1234567"},
{"x":744000,"y":3,"c":14,"n":"rs1234567"},
{"x":53382000,"y":2,"c":14,"n":"rs1234567"},
{"x":39892600,"y":3,"c":15,"n":"rs1234567"},
{"x":9975000,"y":2,"c":16,"n":"rs1234567"},
{"x":28501000,"y":1,"c":17,"n":"rs1234567"},
{"x":38419000,"y":1,"c":17,"n":"rs1234567"},
{"x":17844400,"y":1,"c":18,"n":"rs1234567"},
{"x":88467000,"y":2,"c":19,"n":"rs1234567"},
{"x":78119000,"y":2,"c":20,"n":"rs1234567"},
{"x":189900,"y":1.5,"c":1,"n":"rs1234567"},
{"x":10000000,"y":3.5,"c":1,"n":"rs1234567"},
{"x":90000000,"y":2.5,"c":1,"n":"rs1234567"},
{"x":22053000,"y":1.5,"c":2,"n":"rs1234567"},
{"x":60012000,"y":1.5,"c":3,"n":"rs1234567"},
{"x":11047000,"y":9.5,"c":4,"n":"rs1234567"},
{"x":30000000,"y":8.5,"c":4,"n":"rs1234567"},
{"x":9099000,"y":8.5,"c":4,"n":"rs1234567"},
{"x":6066000,"y":2.5,"c":5,"n":"rs1234567"},
{"x":2201000,"y":1.5,"c":6,"n":"rs1234567"},
{"x":6035000,"y":3.5,"c":7,"n":"rs1234567"},
{"x":16179100,"y":2.5,"c":9,"n":"rs1234567"},
{"x":67048300,"y":3.5,"c":10,"n":"rs1234567"},
{"x":46089800,"y":2.5,"c":10,"n":"rs1234567"},
{"x":12001700,"y":3.5,"c":11,"n":"rs1234567"},
{"x":58088000,"y":2.5,"c":12,"n":"rs1234567"},
{"x":7404000,"y":3.5,"c":14,"n":"rs1234567"},
{"x":53032000,"y":2.5,"c":14,"n":"rs1234567"},
{"x":38992600,"y":3.5,"c":15,"n":"rs1234567"},
{"x":7995000,"y":2.5,"c":16,"n":"rs1234567"},
{"x":2901000,"y":1.5,"c":17,"n":"rs1234567"},
{"x":3419000,"y":1.5,"c":17,"n":"rs1234567"},
{"x":9744400,"y":1.5,"c":18,"n":"rs1234567"},
{"x":9467000,"y":2.5,"c":19,"n":"rs1234567"},
{"x":7919000,"y":2.5,"c":20,"n":"rs1234567"},

{"x":5594000,"y":3,"c":21,"n":"rs1234567"},
{"x":59000,"y":2,"c":21,"n":"rs1234567"},
{"x":701600,"y":2,"c":22,"n":"rs1234567"},
{"x":1290000,"y":3,"c":"X","n":"rsXX1234567"}]""".toString()


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