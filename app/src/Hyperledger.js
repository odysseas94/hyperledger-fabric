import {Gateway, Wallets} from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import path from 'path';
import {buildCAClient, registerAndEnrollUser, enrollAdmin} from './fabric/CAUtil.js';
import {buildCCPOrg1, buildWallet} from './fabric/AppUtil.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default class Hyperledger {

    channelName = 'mychannel';
    chaincodeName = 'basic';
    mspOrg1 = 'Org1MSP';
    walletPath = path.join(__dirname, 'wallet');
    org1UserId = 'appUser';

    constructor() {
    }

    async init() {

        this.ccp = buildCCPOrg1();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration

         this.caClient = buildCAClient(FabricCAServices, this.ccp, 'ca.org1.example.com');

        // setup the wallet to hold the credentials of the application user
        this.wallet = await buildWallet(Wallets, this.walletPath);

        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(this.caClient,this.wallet, this.mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(this.caClient, wallet, this.mspOrg1, this.org1UserId, 'org1.department1');
    }
}
