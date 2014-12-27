package baget

class BoxWhiskerController {

    def index() {
        render(view: 'minimalBoxWhisker')
    }


    def dataInJsonForm = """
[
{
\t"d":"MYC",
\t"v": 0.850
},
{
\t"d":"MYC",
\t"v": 0.740
},
{
\t"d":"MYC",
\t"v": 0.900
},
{
\t"d":"MYC",
\t"v": 0.070
},
{
\t"d":"MYC",
\t"v": 0.30
},
{
\t"d":"MYC",
\t"v": 0.50
},
{
\t"d":"MYC",
\t"v": 0.50
},
{
\t"d":"MYC",
\t"v": 0.80
},
{
\t"d":"MYC",
\t"v": 0.80
},
{
\t"d":"MYC",
\t"v": 0.80
},
{
\t"d":"MYC",
\t"v": 1.000
},
{
\t"d":"MYC",
\t"v": 0.80
},
{
\t"d":"MYC",
\t"v": 0.30
},
{
\t"d":"MYC",
\t"v": -0.50
},
{
\t"d":"MYC",
\t"v": -0.60
},
{
\t"d":"MYC",
\t"v": -0.10
},
{
\t"d":"MYC",
\t"v": -0.30
},
{
\t"d":"MYC",
\t"v": -1.000
},
{
\t"d":"MYC",
\t"v": -0.960
},
{
\t"d":"MYC",
\t"v": -0.660
},
{
\t"d":"BRCA2",
\t"v": 0.960
},
{
\t"d":"BRCA2",
\t"v": -0.540
},
{
\t"d":"BRCA2",
\t"v": -0.260
},
{
\t"d":"BRCA2",
\t"v": -0.140
},
{
\t"d":"BRCA2",
\t"v": 0.80
},
{
\t"d":"BRCA2",
\t"v": 0.00
},
{
\t"d":"BRCA2",
\t"v": -0.50
},
{
\t"d":"BRCA2",
\t"v": 0.80
},
{
\t"d":"BRCA2",
\t"v": 0.200
},
{
\t"d":"BRCA2",
\t"v": 0.40
},
{
\t"d":"BRCA2",
\t"v": -0.30
},
{
\t"d":"BRCA2",
\t"v": 0.70
},
{
\t"d":"BRCA2",
\t"v": 0.30
},
{
\t"d":"BRCA2",
\t"v": 0.20
},
{
\t"d":"BRCA2",
\t"v": -0.30
},
{
\t"d":"BRCA2",
\t"v": -0.20
},
{
\t"d":"BRCA2",
\t"v": 0.00
},
{
"d":"BRCA2",
"v": 0.70
},
{
"d":"BRCA2",
"v": -0.60
},
{
"d":"BRCA2",
"v": 0.0800
},
{
"d":"STAT6",
"v": -0.10
},
{
"d":"STAT6",
"v": 0.10
},
{
"d":"STAT6",
"v": 0.880
},
{
"d":"STAT6",
"v": 0.860
},
{
"d":"STAT6",
"v": 0.720
},
{
"d":"STAT6",
"v": 0.720
},
{
"d":"STAT6",
"v": 0.620
},
{
"d":"STAT6",
"v": 0.860
},
{
"d":"STAT6",
"v": 0.970
},
{
"d":"STAT6",
"v": 0.950
},
{
"d":"STAT6",
"v": 0.880
},
{
"d":"STAT6",
"v": 0.910
},
{
"d":"STAT6",
"v": 0.850
},
{
"d":"STAT6",
"v": 0.870
},
{
"d":"STAT6",
"v": 0.840
},
{
"d":"STAT6",
"v": 0.840
},
{
"d":"STAT6",
"v": 0.850
},
{
"d":"STAT6",
"v": 0.840
},
{
"d":"STAT6",
"v": 0.840
},
{
"d":"STAT6",
"v": 0.840
}
]
"""





    def dataInJsonForm2 = """
[
{
\t"d":"MYC",
\t"v": 1.850
},
{
\t"d":"MYC",
\t"v": 1.740
},
{
\t"d":"MYC",
\t"v": 1.900
},
{
\t"d":"MYC",
\t"v": 1.070
},
{
\t"d":"MYC",
\t"v": 1.30
},
{
\t"d":"MYC",
\t"v": 1.50
},
{
\t"d":"MYC",
\t"v": 1.50
},
{
\t"d":"MYC",
\t"v": 1.80
},
{
\t"d":"MYC",
\t"v": 1.80
},
{
\t"d":"MYC",
\t"v": 1.80
},
{
\t"d":"MYC",
\t"v": 1.000
},
{
\t"d":"MYC",
\t"v": 1.80
},
{
\t"d":"MYC",
\t"v": 1.30
},
{
\t"d":"MYC",
\t"v": -1.50
},
{
\t"d":"MYC",
\t"v": -0.60
},
{
\t"d":"MYC",
\t"v": -0.10
},
{
\t"d":"MYC",
\t"v": -0.30
},
{
\t"d":"MYC",
\t"v": -1.000
},
{
\t"d":"MYC",
\t"v": -0.960
},
{
\t"d":"MYC",
\t"v": -0.660
},
{
\t"d":"BRCA2",
\t"v": 0.960
},
{
\t"d":"BRCA2",
\t"v": -0.540
},
{
\t"d":"BRCA2",
\t"v": -0.260
},
{
\t"d":"BRCA2",
\t"v": -2.140
},
{
\t"d":"BRCA2",
\t"v": 0.80
},
{
\t"d":"BRCA2",
\t"v": 0.00
},
{
\t"d":"BRCA2",
\t"v": -0.50
},
{
\t"d":"BRCA2",
\t"v": 0.80
},
{
\t"d":"BRCA2",
\t"v": 0.200
},
{
\t"d":"BRCA2",
\t"v": 0.40
},
{
\t"d":"BRCA2",
\t"v": -1.30
},
{
\t"d":"BRCA2",
\t"v": 1.70
},
{
\t"d":"BRCA2",
\t"v": 1.30
},
{
\t"d":"BRCA2",
\t"v": 1.20
},
{
\t"d":"BRCA2",
\t"v": -1.30
},
{
\t"d":"BRCA2",
\t"v": -1.20
},
{
\t"d":"BRCA2",
\t"v": 1.00
},
{
"d":"BRCA2",
"v": 1.70
},
{
"d":"BRCA2",
"v": -1.60
},
{
"d":"BRCA2",
"v": 1.0800
},
{
"d":"STAT6",
"v": -1.10
},
{
"d":"STAT6",
"v": 1.10
},
{
"d":"STAT6",
"v": 1.880
},
{
"d":"STAT6",
"v": 1.860
},
{
"d":"STAT6",
"v": 1.720
},
{
"d":"STAT6",
"v": 1.720
},
{
"d":"STAT6",
"v": 1.620
},
{
"d":"STAT6",
"v": 1.860
},
{
"d":"STAT6",
"v": 0.970
},
{
"d":"STAT6",
"v": 0.950
},
{
"d":"STAT6",
"v": 0.880
},
{
"d":"STAT6",
"v": 0.910
},
{
"d":"STAT6",
"v": 0.850
},
{
"d":"STAT6",
"v": 0.870
},
{
"d":"STAT6",
"v": 0.840
},
{
"d":"STAT6",
"v": 0.840
},
{
"d":"STAT6",
"v": 0.850
},
{
"d":"STAT6",
"v": 0.840
},
{
"d":"STAT6",
"v": 0.840
},
{
"d":"STAT6",
"v": 0.840
}
]
"""




//
//    def duelingDataInJsonForm = """
//[{"name":"cmpd1",
//  "data": ${dataInJsonForm.toString()}},
//{"name":"cmpd2",
//  "data": ${dataInJsonForm2.toString()}},
//{"name":"cmpd3",
//  "data": ${dataInJsonForm.toString()}}]
//"""

    def duelingDataInJsonForm = """
[{"name":"compound one",
  "data": ${dataInJsonForm.toString()}},
{"name":"compound two",
  "data": ${dataInJsonForm2.toString()}}]
"""



    def retrieveBoxData(){
        render(dataInJsonForm) ;
    }



    def retrieveMultiBoxData(){
        render(duelingDataInJsonForm.toString()) ;
    }


    def minimalBarChart() {
        render(view: 'minimalBoxWhisker')
    }

    def rawJson = """
    [
    { value: 12,
        barname: 'Have T2D',
        barsubname: '(cases)',
        barsubnamelink:'http://www.google.com',
        inbar: '',
        descriptor: '(8 out of 6469)'},
    {value: 99,
        barname: 'Do not have T2D',
        barsubname: '(controls)',
        barsubnamelink:'http://www.google.com',
        inbar: '',
        descriptor: '(21 out of 6364)'}
    ]"""

    def boxWhiskerData(){
        String dataFileBased = params.id
        response.setContentType("application/json")
        render(rawJson)
    }

    def boxwhisk(){
        render (view:'minimalBoxWhisker')
    }


}
