import {Gateway, Wallets} from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import path from 'path';
import {buildCAClient, registerAndEnrollUser, enrollAdmin} from './fabric/CAUtil.js';
import {buildCCPOrg1, buildWallet} from './fabric/AppUtil.js';
import {fileURLToPath} from 'url';
import QueryParser from "./instances/QueryParser.js";
import {re} from "@babel/core/lib/vendor/import-meta-resolve.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default class Hyperledger {

    channelName = 'mychannel';
    chaincodeName = 'basic';
    mspOrg1 = 'Org1MSP';
    walletPath = path.resolve(__dirname, 'assets', 'wallet');
    org1UserId = 'adminUser';
    gateway = null;
    network = null;
    contract = null;

    constructor() {
    }

    async init() {
        console.log(this.walletPath);

        this.ccp = buildCCPOrg1();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration

        this.caClient = buildCAClient(FabricCAServices, this.ccp, 'ca.org1.example.com');

        // setup the wallet to hold the credentials of the application user
        this.wallet = await buildWallet(Wallets, this.walletPath);

        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(this.caClient, this.wallet, this.mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(this.caClient, this.wallet, this.mspOrg1, this.org1UserId, 'org1.department1');
        try {
            await this.initContract();
        } catch (e) {
            console.log(e);
        }

    }


    async initContract() {
        this.gateway = new Gateway();

        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await this.gateway.connect(this.ccp, {
                wallet: this.wallet,
                identity: this.org1UserId,
                discovery: {enabled: true, asLocalhost: true} // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            this.network = await this.gateway.getNetwork(this.channelName);

            // Get the contract from the network.
            this.contract = this.network.getContract(this.chaincodeName);
        } catch (e) {
            throw e;
        }
    }

    async checkItemsById(query) {


        let data = QueryParser.getParams(query, true);

        if (data?.id) {
            let result = [];
            for (let ob in data.id) {
                let asset = data.id[ob];

                let item = (await this.contract.evaluateTransaction('AssetExists', asset)).toString();
                result.push({
                    id: asset,
                    value: item,
                });
            }
            return {"success": result};
        }
        return {error: "Requires ID "};

    }


    async saveItem(query) {


        if (query.id && query.productId && query.productName && query.buyerId && query.buyerUsername && query.sellerId && query.sellerUsername && query.productAmount && query.productPrice && query.transactionType && query.transactionIdDatabase && query.dateCreated) {
            let item = await this.contract.submitTransaction('CreateAsset',
                query.id , query.productId ,query.productName , query.buyerId , query.buyerUsername , query.sellerId , query.sellerUsername , query.productAmount , query.productPrice , query.transactionType ,query.transactionIdDatabase , query.dateCreated);

            if(item){
                return {success: item}
            }
            return {error: item}
        }
        console.log("didnt save")

        return {error: "Required id, productId, productName, buyerId, buyerUsername, sellerId, sellerUsername, productAmount, productPrice, transactionType,transactionIdDatabase, dateCreated"}

    }

    async getItemsById(query) {

        let data = QueryParser.getParams(query, true);

        if (data?.id) {
            let result = [];
            for (let ob in data.id) {
                let asset = data.id[ob];

                let item = (await this.contract.evaluateTransaction('ReadAsset', asset)).toString();
                result.push({
                    id: asset,
                    value: item,
                });
            }
            return {"success": result};
        }

        return {error: "Requires ID "};

    }

    async getAllItems() {
        let result = (await this.contract.evaluateTransaction('GetAllAssets')).toString();

        return {success: result};

    }


}
