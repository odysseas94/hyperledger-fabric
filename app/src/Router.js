const routerGetSingleItems = "single";
const routerGetCheckItem = "check";
const routerGetAlLItems = "all";
const routerSaveItem = "save";

export default class Router {
    express = null;


    constructor(express, hyperledger) {
        this.express = express;
        this.init();
        this.hyperledger = hyperledger;


    }


    _callback(req, res, callback) {

        res.setHeader('Content-Type', 'application/json');
        callback(req, res);
    }

    listenGet(url, callback = () => {
    }) {
        this.express.get(url, (req, res) => {
            this._callback(req, res, callback);
        })

    }

    listenPost(url, callback = () => {
    }) {

        this.express.post(url, (req, res) => {
            this._callback(req, res, callback);
        })

    }


    init() {
        this.listenGet("/", (req, res) => {
            res.send('API')
        })

        this.listenAll();
        this.listenSingleItems();
        this.listenCheckItemsById();
        this.listenSaveItem();

    }


    listenAll() {

        this.listenPost("/"+routerGetAlLItems, (request, response) => {

            this.hyperledger.getAllItems().then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });

    }

    listenSingleItems() {
        this.listenPost("/"+routerGetSingleItems, (request, response) => {
            this.hyperledger.getItemsById(request.query, request.query?.id).then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });
    }

    listenSaveItem() {
        this.listenPost("/"+routerSaveItem, (request, response) => {
            this.hyperledger.saveItem(request.query, request.query?.id).then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });
    }

    listenCheckItemsById() {
        this.listenPost("/"+routerGetCheckItem, (request, response) => {
            console.log(request.body)
            this.hyperledger.checkItemsById(request.query, request.query?.id).then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });
    }


    listenDeleteSingle() {
        this.listenPost("/delete", (request, response) => {
            this.hyperledger.getDeleteItemsById(request.query, request.query?.id).then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });
    }


}
