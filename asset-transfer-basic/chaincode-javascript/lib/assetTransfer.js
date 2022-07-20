/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const {Contract} = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                ID: "Asset1",
                ProductId: 1,
                ProductName: "Book",
                BuyerId: 1,
                BuyerUsername: "odysseastsakai",
                SellerId: 2,
                SellerUsername: "testuser",
                ProductAmount: 10,
                ProductPrice: 100,
                TransactionType: "Pending",
                TransactionIdDatabase: 1,
                DateCreated: "2022-05-03 09:51:19"
            },
            {
                ID: "Asset3",
                ProductId: 2,
                ProductName: "Bike",
                BuyerId: 1,
                BuyerUsername: "odysseastsakai",
                SellerId: 2,
                SellerUsername: "testuser",
                ProductAmount: 10,
                ProductPrice: 100,
                TransactionType: "Pending",
                TransactionIdDatabase: 2,
                DateCreated: "2022-05-03 10:51:19"
            },
            {
                ID: "Asset2",
                ProductId: 3,
                ProductName: "PC",
                BuyerId: 1,
                BuyerUsername: "odysseastsakai",
                SellerId: 2,
                SellerUsername: "testuser",
                ProductAmount: 10,
                ProductPrice: 100,
                TransactionType: "Pending",
                TransactionIdDatabase: 3,
                DateCreated: "2022-05-03 11:51:19"
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, id, productId, productName, buyerId, buyerUsername, sellerId, sellerUsername, productAmount, productPrice, transactionType,transactionIdDatabase, dateCreated) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }


        const asset = {
            ID: id,
            ProductId: productId,
            ProductName: productName,
            BuyerId: buyerId,
            BuyerUsername: buyerUsername,
            SellerId: sellerId,
            SellerUsername: sellerUsername,
            ProductAmount: productAmount,
            ProductPrice: productPrice,
            TransactionType: transactionType,
            TransactionIdDatabase: transactionIdDatabase,
            DateCreated: dateCreated
        };
        //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, productId, productName, buyerId, buyerUsername, sellerId, sellerUsername, productAmount, productPrice,transactionType, transactionIdDatabase, dateCreated) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            ProductId: productId,
            ProductName: productName,
            BuyerId: buyerId,
            BuyerUsername: buyerUsername,
            SellerId: sellerId,
            SellerUsername: sellerUsername,
            ProductAmount: productName,
            ProductPrice: productAmount,
            TransactionType:transactionType,
            TransactionIdDatabase: transactionIdDatabase,
            DateCreated: dateCreated
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner, sellerUsername) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.SellerId;
        asset.SellerId = newOwner;
        asset.SellerUsername = sellerUsername;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = AssetTransfer;
