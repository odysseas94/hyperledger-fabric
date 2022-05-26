import Router from "./Router.js";

export default class Server{
    express=null;
    port=null;
    router=null;

    constructor(express,port) {
        this.express=express;
        this.port=port;

        this.init();




    }


    init(){


        this.router=new Router(this.express)
        this.start();



    }

    start(){
        this.express.listen(this.port, () => {
            console.log(`Running on port ${this.port}`)
        })
    }












}