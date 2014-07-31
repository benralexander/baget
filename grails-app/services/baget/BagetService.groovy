package baget

import grails.transaction.Transactional

@Transactional
class BagetService {


    public int howManyLines(File f) {
        int count = 0
        f.eachLine{
            count++
        }
        return count
    }



    public String convertFileToJson(File f,int numberOfLines) {
        StringBuilder sb = new StringBuilder ()
        sb << "["
        int i = 0
        f.eachLine{
            if (i>0){
                String line="$it"
                List cols = line.split(",")
                if (cols.size() == 2)  {
                    sb << """{"x":${cols[0]},"y":${cols[1]}}""".toString()
                }  else if  (cols.size() == 3)  {
                    sb << """{"x":${cols[0]},"y":${cols[1]},"p":${cols[2]}}""".toString()
                } else if  (cols.size() == 4) {
                    sb << """{"x":${cols[0]},"y":${cols[1]},"p":${cols[2]},"u":${cols[3]}}""".toString()
                }
                if ( i < numberOfLines-1)  {
                    sb <<  ",\n"
                }
            }
            i++
        }
        sb << "]"
        return sb.toString()
    }
}
