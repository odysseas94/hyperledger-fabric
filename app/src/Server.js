import Router from "./Router.js";
import Hyperledger from "./Hyperledger.js";
import BodyParser from 'body-parser';
import express from "express";

export default class Server{
    express=null;
    port=null;
    router=null;
    hyperledger=null;

    constructor(express,port) {
        this.express=express;
        this.app=express();
        this.port=port;

        this.init();




    }


    init(){

        this.hyperledger = new Hyperledger();
        this.router=new Router(this.app,this.hyperledger)

        this.start();

        this.hyperledger.init().then(function () {
            console.log('all good ');
        }).catch((e)=>{
            console.log("error", e);
        });





    }




    start(){

        this.app.use(
            this.express.urlencoded({
                extended: true,
            })
        );
        this.app.use(this.express.json());

        this.router.init();
        this.app.listen(this.port, () => {
            console.log(`Running on port ${this.port}`)
        })
    }












}
