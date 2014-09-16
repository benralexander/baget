package baget

class BarChartController {
    BagetService bagetService


    def index() {
        render(view: 'minimalBarChart')
    }


}
