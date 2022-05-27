import Router from "./Router.js";
import Hyperledger from "./Hyperledger.js";

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
        this.express.listen(this.port, () => {
            console.log(`Running on port ${this.port}`)
        })
    }












}
