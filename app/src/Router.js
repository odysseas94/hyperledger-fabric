export default class Router {
    express = null;

    constructor(express) {
        this.express = express;
        this.init();


    }

    listen(url, callback=()=>{}) {
        this.express.get(url, (req, res) => {
            callback(req, res);
        })

    }

    init() {
        this.listen("/", (req, res) => {
            res.send('Hello World!')
        })

        this.listenAll();


    }

    listenAll(){

        this.listen("/all", (request, response) => {

            console.log(request.query);
            response.send(JSON.stringify(request.query));
        });

    }


}