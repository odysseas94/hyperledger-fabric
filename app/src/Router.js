const routerGetSingleItems = "single";
const routerGetCheckItem = "check";
const routerGetAlLItems = "all";
const routerSaveItem = "save";

export default class Router {
    express = null;

    constructor(express, hyperledger) {
        this.express = express;
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

        this.listenGet("/"+routerGetAlLItems, (request, response) => {

            this.hyperledger.getAllItems().then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });

    }

    listenSingleItems() {
        this.listenPost("/"+routerGetSingleItems, (request, response) => {
            let params = request.body;
            this.hyperledger.getItemsById(params, params?.id).then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });
    }

    listenSaveItem() {
        this.listenPost("/"+routerSaveItem, (request, response) => {
            let params = request.body;

            this.hyperledger.saveItem(params, params?.id).then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });
    }

    listenCheckItemsById() {
        this.listenPost("/"+routerGetCheckItem, (request, response) => {
            let params = request.body;
            this.hyperledger.checkItemsById(params, params?.id).then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });
    }


    listenDeleteSingle() {
        this.listenPost("/delete", (request, response) => {
            let params = request.body;
            this.hyperledger.getDeleteItemsById(params, params?.id).then((result) => {
                response.send(result);
            }).catch((e) => {
                response.send(JSON.stringify(e));
            })

        });
    }


}
