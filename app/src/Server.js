import Router from "./Router.js";
import Hyperledger from "./Hyperledger.js";
import BodyParser from 'body-parser';

export default class Server{
    express=null;
    port=null;
    router=null;
    hyperledger=null;

    constructor(express,port) {
        this.express=express;
        this.port=port;

        this.init();




    }


    init(){

        this.hyperledger = new Hyperledger();
        this.router=new Router(this.express,this.hyperledger)

        this.start();

        this.hyperledger.init().then(function () {
            console.log('all good ');
        }).catch((e)=>{
            console.log("error", e);
        });





    }




    start(){

        this.express.use( BodyParser.json() );       // to support JSON-encoded bodies
        this.express.use(BodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true
        }));
        this.express.listen(this.port, () => {
            console.log(`Running on port ${this.port}`)
        })
    }












}
