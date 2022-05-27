const routerGetSingleItems = "single";
const routerGetCheckItem = "check";
const routerGetAlLItems = "all";
const routerSaveItem = "save";

export default class Router {
    express = null;


    constructor(express,hyperledger) {
        this.express = express;
        this.init();
        this.hyperledger=hyperledger;


    }

    listen(url, callback=()=>{}) {
        this.express.get(url, (req, res) => {

            res.setHeader('Content-Type', 'application/json');
            callback(req, res);
        })

    }

    init() {
        this.listen("/", (req, res) => {
            res.send('API')
        })

        this.listenAll();
        this.listenSingleItems();
        this.listenCheckItemsById();
        this.listenSaveItem();

    }



    listenAll(){

        this.listen("/all", (request, response) => {

             this.hyperledger.getAllItems().then((result)=>{
                 response.send(result);
             }).catch((e)=>{
                 response.send(JSON.stringify(e));
             })

        });

    }

    listenSingleItems(){
        this.listen("/single", (request, response) => {
            this.hyperledger.getItemsById(request.query,request.query?.id).then((result)=>{
                response.send(result);
            }).catch((e)=>{
                response.send(JSON.stringify(e));
            })

        });
    }

    listenSaveItem(){
        this.listen("/save", (request, response) => {
            this.hyperledger.saveItem(request.query,request.query?.id).then((result)=>{
                response.send(result);
            }).catch((e)=>{
                response.send(JSON.stringify(e));
            })

        });
    }

    listenCheckItemsById(){
        this.listen("/check", (request, response) => {
            this.hyperledger.checkItemsById(request.query,request.query?.id).then((result)=>{
                response.send(result);
            }).catch((e)=>{
                response.send(JSON.stringify(e));
            })

        });
    }


    listenDeleteSingle(){
        this.listen("/delete", (request, response) => {
            this.hyperledger.getDeleteItemsById(request.query,request.query?.id).then((result)=>{
                response.send(result);
            }).catch((e)=>{
                response.send(JSON.stringify(e));
            })

        });
    }


}
