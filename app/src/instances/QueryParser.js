export default class QueryParser {


    static getParams(query, shouldByArray) {
        let result = [];
        if (shouldByArray) {
            
            for (let key in query) {

                let value = query[key];
                if(typeof value==="object"){
                    result[key]=value;
                }
                else{
                    result[key]=[value];
                }

            }
            return result;
        } else

            return query;
    }


}
