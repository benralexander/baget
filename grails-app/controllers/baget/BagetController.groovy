package baget

class BagetController {
    BagetService bagetService
    String tempDataStore = null


    def upload() {
        println('got a file')
        println('delete old one')
        new File('./tempStorage.txt').delete()
        def incomingFile = request.getFile('myFile')
        if (incomingFile.empty) {
            flash.message = 'file cannot be empty'
            render(view: 'bagetLandingPage')
            return
        }
        println('type='+incomingFile.getClass().name+'.')
        incomingFile.transferTo(new File('./tempStorage.txt'))
        println('transferred.')
        render(view: 'bagetLandingPage',model:[dataFileBased:1])
    }


    def returnToDefaultJsonData() {
        tempDataStore = null
        render(view: 'bagetLandingPage')
    }


def rawJson2 ="""
[{"x":26.34228106,"y":23.94754025},
{"x":27.49459123,"y":26.36647036},
{"x":29.10449594,"y":27.51177073},
{"x":29.42687326,"y":29.13700053},
{"x":29.62665464,"y":29.43430589},
{"x":30.47489589,"y":29.63260357},
{"x":34.64142481,"y":30.50544535},
{"x":38.68640247,"y":34.81375728},
{"x":39.31078875,"y":38.86888313},
{"x":42.25976852,"y":39.33404694},
{"x":42.51708537,"y":42.43004861},
{"x":43.25376936,"y":42.52264091},
{"x":45.22322083,"y":43.30459647},
{"x":48.64089475,"y":45.36763342},
{"x":49.04284794,"y":48.90629432},
{"x":49.69358772,"y":49.05472217},
{"x":51.43186355,"y":49.75293588},
{"x":52.16158005,"y":51.59791134},
{"x":53.37193494,"y":52.22074969},
{"x":53.99439882,"y":53.49984442},
{"x":54.07427328,"y":54.05241917},
{"x":55.54408109,"y":54.07697435},
{"x":57.03308683,"y":55.73472208},
{"x":59.95931379,"y":57.21013657},
{"x":60.58648446,"y":60.35205339},
{"x":60.98049431,"y":60.62151439},
{"x":61.68507601,"y":61.03652007},
{"x":61.99117999,"y":61.79065488},
{"x":62.16479741,"y":62.02518717},
{"x":62.94518632,"y":62.18943451},
{"x":63.43181464,"y":63.08381535},
{"x":64.39079293,"y":63.49810022},
{"x":64.69397256,"y":64.56719329},
{"x":65.5696348,"y":64.7199394},
{"x":66.20400265,"y":65.74987322},
{"x":66.3955989,"y":66.3036896},
{"x":66.75272939,"y":66.41646175},
{"x":67.73967959,"y":66.83160698},
{"x":69.2634288,"y":67.95964749},
{"x":70.67095269,"y":69.58937413},
{"x":71.27783428,"y":70.9498503},
{"x":71.55369578,"y":71.3650199},
{"x":72.76433639,"y":71.60537134},
{"x":73.19286643,"y":73.09122397},
{"x":73.57437715,"y":73.22237553},
{"x":73.93272911,"y":73.67952049},
{"x":74.01272573,"y":74.01051216},
{"x":74.23256508,"y":74.01342475},
{"x":75.13482544,"y":74.30367684},
{"x":75.83901539,"y":75.41187497},
{"x":76.23990324,"y":75.98521781},
{"x":77.28075905,"y":76.32938731},
{"x":77.74387351,"y":77.62377063},
{"x":78.25329672,"y":77.78829512},
{"x":78.50324546,"y":78.42967664},
{"x":78.57825018,"y":78.53185556},
{"x":78.73957853,"y":78.59674314},
{"x":79.43395727,"y":78.79791975},
{"x":79.94619628,"y":79.70010063},
{"x":80.48162883,"y":80.05166584},
{"x":81.7498564,"y":80.67031762},
{"x":82.91390248,"y":82.23486658},
{"x":84.63577467,"y":83.22615987},
{"x":85.39735536,"y":85.29912281},
{"x":85.50692805,"y":85.44465252},
{"x":85.72264267,"y":85.53760108},
{"x":85.82619761,"y":85.81585911},
{"x":85.90328923,"y":85.83152351},
{"x":86.09029162,"y":85.9410895},
{"x":86.54317069,"y":86.17063122},
{"x":86.93822048,"y":86.7482118},
{"x":87.39897272,"y":87.04510036},
{"x":87.68432044,"y":87.60237966},
{"x":88.63999189,"y":87.73244439},
{"x":89.21355232,"y":89.18452039},
{"x":89.65977615,"y":89.23134608},
{"x":90.02493804,"y":89.92798034},
{"x":90.52373186,"y":90.08692738},
{"x":92.13143303,"y":90.80891826},
{"x":93.17019394,"y":93.01310955},
{"x":93.49220007,"y":93.27711693},
{"x":93.79187996,"y":93.64166463},
{"x":93.95819568,"y":93.89844297},
{"x":94.25922316,"y":94.00146488},
{"x":94.53725912,"y":94.44974014},
{"x":94.86377773,"y":94.6032822},
{"x":95.12142095,"y":95.06433623},
{"x":95.48512607,"y":95.16627323},
{"x":95.96865355,"y":95.74078284},
{"x":96.89994002,"y":96.15509322},
{"x":97.79754112,"y":97.5217846},
{"x":98.2750352,"y":98.03244481},
{"x":98.50959255,"y":98.4858848},
{"x":98.9270266,"y":98.5306164},
{"x":99.33575561,"y":99.28568345},
{"x":99.73456791,"y":99.38197607},
{"x":100.0889996,"y":100.0666204},
{"x":100.1862453,"y":100.1105012},
{"x":100.5714731,"y":100.2604895},
{"x":100.9042455,"y":100.8824567},
{"x":101.9191838,"y":100.9264745},
{"x":103.426775,"y":102.9524118},
{"x":103.9572632,"y":103.9304803},
{"x":104.0882878,"y":103.9862779},
{"x":104.3191649,"y":104.2010355},
{"x":104.7577828,"y":104.4523745},
{"x":105.1626634,"y":105.1091664},
{"x":105.2754609,"y":105.2254642},
{"x":105.5531718,"y":105.3353471},
{"x":105.9189885,"y":105.8194019},
{"x":106.1073459,"y":106.0431919},
{"x":106.1902312,"y":106.1889965},
{"x":106.5495451,"y":106.1918349},
{"x":107.8242677,"y":107.0237191},
{"x":109.1038722,"y":108.9073627},
{"x":109.4105137,"y":109.3752424},
{"x":109.7517975,"y":109.4602336},
{"x":110.3298427,"y":110.1713652},
{"x":110.6674654,"y":110.5626676},
{"x":110.8855837,"y":110.824662},
{"x":111.5276984,"y":110.9788942},
{"x":112.6816743,"y":112.3860846},
{"x":113.3514049,"y":113.1538501},
{"x":113.9018564,"y":113.6737312},
{"x":114.3017422,"y":114.282065},
{"x":114.6079156,"y":114.3352466},
{"x":115.1074878,"y":115.082285},
{"x":115.1765502,"y":115.1522927},
{"x":115.2664484,"y":115.2206238},
{"x":115.8182017,"y":115.3515512},
{"x":116.8253428,"y":116.7041613},
{"x":117.1727391,"y":117.0605774},
{"x":117.402395,"y":117.3953883},
{"x":117.6141205,"y":117.4166207},
{"x":118.0544554,"y":118.0243125},
{"x":118.1422111,"y":118.1185093},
{"x":118.2723059,"y":118.1937531},
{"x":118.6101033,"y":118.4471493},
{"x":119.284568,"y":118.9814246},
{"x":120.3289674,"y":119.9919025},
{"x":121.4599193,"y":121.1344955},
{"x":122.2973398,"y":122.2566464},
{"x":122.4145219,"y":122.3994303},
{"x":122.5589123,"y":122.4533288},
{"x":122.8706719,"y":122.8372691},
{"x":123.3408749,"y":122.9609833},
{"x":124.563707,"y":124.3945365},
{"x":125.0901382,"y":125.0451923},
{"x":125.2932534,"y":125.2214508},
{"x":125.8437984,"y":125.5086612},
{"x":126.9856319,"y":126.8765681},
{"x":127.7736187,"y":127.3310008},
{"x":129.2499285,"y":129.2144814},
{"x":129.6420852,"y":129.3685995},
{"x":130.635173,"y":130.5840917},
{"x":130.9042956,"y":130.8162797},
{"x":131.5735736,"y":131.2256562},
{"x":133.0587637,"y":132.8824058},
{"x":133.8836581,"y":133.7426884},
{"x":134.792284,"y":134.4475368},
{"x":136.229682,"y":136.2154713},
{"x":136.3001827,"y":136.2902642},
{"x":136.4347863,"y":136.3438778},
{"x":137.1390636,"y":136.8489251},
{"x":138.5660038,"y":138.5068593},
{"x":139.07366,"y":138.854768},
{"x":140.4792637,"y":140.1813862},
{"x":142.0599541,"y":142.0431207},
{"x":142.4038035,"y":142.1517235},
{"x":143.8987659,"y":143.8322566},
{"x":144.3005941,"y":144.2909411},
{"x":144.6703308,"y":144.3598909},
{"x":146.6919829,"y":146.6594455},
{"x":147.033959,"y":146.9097329},
{"x":147.9544178,"y":147.9035413},
{"x":148.514583,"y":148.3275119},
{"x":150.1818514,"y":149.954217},
{"x":152.1136455,"y":152.0236206},
{"x":152.9004418,"y":152.8810004},
{"x":153.1081558,"y":153.0754143},
{"x":153.5056656,"y":153.4200612},
{"x":154.646275,"y":154.371221},
{"x":157.7016458,"y":157.6071502},
{"x":158.8228451,"y":158.7883443},
{"x":159.4061527,"y":159.2483547},
{"x":161.5065374,"y":161.5026113},
{"x":161.6056827,"y":161.5630132},
{"x":162.4888173,"y":162.2741723},
{"x":166.2191855,"y":166.1768076},
{"x":167.0655758,"y":167.0243652},
{"x":167.9698241,"y":167.9401559},
{"x":168.8339777,"y":168.6818605},
{"x":173.1539895,"y":173.0280642},
{"x":177.3489237,"y":177.2255754},
{"x":182.2417165,"y":183.1595059},
{"x":186.3663879,"y":188.2700355},
{"x":192.7598263,"y":194.6935286},
{"x":199.475598,"y":209.3233018},
{"x":229.7825427,"y":235.7825427}]
"""

    def rawJson = """
[{"x":-36.53621405,"y":1},
{"x":-27.73397927,"y":4},
{"x":-22.16777112,"y":6},
{"x":-17.99178059,"y":7},
{"x":-14.60302072,"y":7},
{"x":-11.72499342,"y":7},
{"x":-9.2067716,"y":8},
{"x":-6.956506316,"y":9},
{"x":-4.913948826,"y":9},
{"x":-3.03734171,"y":9},
{"x":-1.296494898,"y":10},
{"x":0.331161791,"y":11},
{"x":1.862967483,"y":11},
{"x":3.312546898,"y":11},
{"x":4.690812017,"y":12},
{"x":6.006645888,"y":12},
{"x":7.267382744,"y":13},
{"x":8.479153382,"y":13},
{"x":9.647138926,"y":13},
{"x":10.77576075,"y":13},
{"x":11.86882501,"y":14},
{"x":12.92963419,"y":14},
{"x":13.96107444,"y":14},
{"x":14.96568467,"y":14},
{"x":15.9457119,"y":16},
{"x":16.90315594,"y":16},
{"x":17.8398059,"y":16},
{"x":18.75727016,"y":16},
{"x":19.65700129,"y":18},
{"x":20.54031673,"y":18},
{"x":21.40841632,"y":18},
{"x":22.26239701,"y":18},
{"x":23.10326543,"y":19},
{"x":23.93194863,"y":20},
{"x":24.74930331,"y":20},
{"x":25.55612382,"y":20},
{"x":26.35314908,"y":20},
{"x":27.14106863,"y":21},
{"x":27.92052794,"y":21},
{"x":28.69213308,"y":21},
{"x":29.45645485,"y":21},
{"x":30.21403243,"y":22},
{"x":30.96537668,"y":23},
{"x":31.71097303,"y":23},
{"x":32.45128414,"y":23},
{"x":33.18675228,"y":23},
{"x":33.91780148,"y":23},
{"x":34.6448395,"y":23},
{"x":35.36825965,"y":24},
{"x":36.08844244,"y":24},
{"x":36.80575712,"y":27},
{"x":37.52056314,"y":28},
{"x":38.23321147,"y":28},
{"x":38.94404589,"y":28},
{"x":39.6534042,"y":29},
{"x":40.36161935,"y":30},
{"x":41.06902058,"y":30},
{"x":41.77593451,"y":31},
{"x":42.48268618,"y":32},
{"x":43.18960011,"y":32},
{"x":43.89700134,"y":32},
{"x":44.60521649,"y":34},
{"x":45.31457479,"y":35},
{"x":46.02540922,"y":35},
{"x":46.73805755,"y":36},
{"x":47.45286357,"y":36},
{"x":48.17017825,"y":37},
{"x":48.89036104,"y":37},
{"x":49.61378119,"y":39},
{"x":50.34081921,"y":39},
{"x":51.07186841,"y":40},
{"x":51.80733655,"y":41},
{"x":52.54764766,"y":44},
{"x":53.29324401,"y":44},
{"x":54.04458826,"y":44},
{"x":54.80216584,"y":45},
{"x":55.56648761,"y":45},
{"x":56.33809275,"y":46},
{"x":57.11755206,"y":47},
{"x":57.90547161,"y":48},
{"x":58.70249687,"y":49},
{"x":59.50931738,"y":50},
{"x":60.32667206,"y":52},
{"x":61.15535526,"y":59},
{"x":61.99622368,"y":59},
{"x":62.85020437,"y":61},
{"x":63.71830396,"y":63},
{"x":64.6016194,"y":64},
{"x":65.50135053,"y":64},
{"x":66.41881479,"y":65},
{"x":67.35546475,"y":66},
{"x":68.31290879,"y":71},
{"x":69.29293602,"y":73},
{"x":70.29754625,"y":73},
{"x":71.3289865,"y":76},
{"x":72.38979568,"y":77},
{"x":73.48285994,"y":78},
{"x":74.61148176,"y":78},
{"x":75.77946731,"y":79},
{"x":76.99123795,"y":80},
{"x":78.2519748,"y":82},
{"x":79.56780867,"y":84},
{"x":80.94607379,"y":85},
{"x":82.39565321,"y":85},
{"x":83.9274589,"y":89},
{"x":85.55511559,"y":91},
{"x":87.2959624,"y":96},
{"x":89.17256952,"y":97},
{"x":91.21512701,"y":97},
{"x":93.46539229,"y":108},
{"x":95.98361411,"y":110,"u":"http://www.ncbi.nlm.nih.gov/snp/?term=rs104893892"},
{"x":98.86164141,"y":115,"u":"http://www.ncbi.nlm.nih.gov/snp/?term=rs104893892"},
{"x":102.2504013,"y":118,"p":"rs79716074","u":"http://www.ncbi.nlm.nih.gov/snp/?term=rs79716074"},
{"x":106.4263918,"y":122,"p":"rs104893897","u":"http://www.ncbi.nlm.nih.gov/snp/?term=rs104893897"},
{"x":111.9926,"y":135,"p":"rs79716074","u":"http://www.ncbi.nlm.nih.gov/snp/?term=rs79716074"},
{"x":120.7948347,"y":168,"p":"rs104893892","u":"http://www.ncbi.nlm.nih.gov/snp/?term=rs104893892"}
]
"""

    def rawCompoundData ="""[
${rawJson},
${rawJson2}
]"""


    def index() {
        render(view: 'bagetLandingPage')
    }




    def qqplot() {
        render(view:'bagetLandingPage',model:[dataFileBased:0])
    }
    def qqPlotData(){
        String dataFileBased = params.id
        response.setContentType("application/json")
        if (!dataFileBased) {
            render(rawCompoundData)
        } else {
            File readFileOfDisk = new File('./tempStorage.txt')
            int howManyLines =  bagetService.howManyLines(readFileOfDisk)
            tempDataStore = bagetService.convertFileToJson (readFileOfDisk,howManyLines)
            render(tempDataStore)
        }

    }




}
