package baget

class BarChartController {


    def index() {
        render(view: 'minimalBarChart')
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

    def barChartData(){
        String dataFileBased = params.id
        response.setContentType("application/json")
        render(rawJson)
    }

}
