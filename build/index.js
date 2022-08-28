"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStockQuantity = void 0;
const path_1 = __importDefault(require("path"));
global.__data_path = path_1.default.join(__dirname + '/../data/');
const Transaction_1 = require("./models/Transaction");
const Stock_1 = require("./models/Stock");
const functions_1 = require("./functions");
const calculateStockQuantityHelperForSmallFiles = (sku) => __awaiter(void 0, void 0, void 0, function* () {
    let qty = 0;
    // console.log("Whats in SKU request" , sku );
    try {
        if ((sku || '').trim().length < 1) {
            throw "Invalid sku #" + sku;
        }
        (0, Transaction_1.getTransactionsFromLargeFile)('LTV719449/39/39');
        let promiseArr = [];
        //Extract Transactions
        promiseArr.push((0, Stock_1.allStocks)());
        //Extract Quantity
        promiseArr.push((0, Transaction_1.allTransactions)());
        //Waiting for data from all files
        let finalDataArr = yield Promise.all(promiseArr);
        //Creating custom variables
        let stockData = finalDataArr[0] || [];
        let transactionDataArr = finalDataArr[1] || [];
        //Extract a mapping of stock data
        let stockObjMapped = (0, Stock_1.createStockHashMap)(stockData);
        //What if this sku does not exist in stock at all
        if (!stockObjMapped[sku]) {
            throw "Stock does not exist for sku#" + sku;
        }
        //Starting stock
        qty = ~~stockObjMapped[sku];
        //Keeping record if there exists a single transaction for this sku
        let isSomeTransactionFound = false;
        for (let index = 0; index < transactionDataArr.length; index++) {
            const transaction = transactionDataArr[index];
            //Make sure the sku is our desired one
            //If its not then skip
            if (transaction.sku == sku) {
                isSomeTransactionFound = true;
                //We have to do the calculations on the stock
                let transactionQty = ~~transaction.qty;
                if (transaction.type == 'order') {
                    //Decrease the quantity
                    qty -= transactionQty;
                }
                else if (transaction.type == 'refund') {
                    //Increase the quantity
                    qty += transactionQty;
                }
            }
        }
        if (!isSomeTransactionFound) {
            throw "Seems like no transaction for sku #" + sku + " found";
        }
        // console.log("Files Read Final data " , stockData  , " ::::: " , transactionDataArr); 
    }
    catch (error) {
        //   console.log("An error occured while extracting information " , error )
    }
    return { sku, qty };
});
//  By using streams no matter how big our data set is our app is capable of handling
const calculateStockQuantityHelperForLargeFiles = (sku) => __awaiter(void 0, void 0, void 0, function* () {
    let _self = this;
    let qty = 0;
    console.log("Whats in SKU request", sku);
    try {
        if ((sku || '').trim().length < 1) {
            throw "Invalid sku #" + sku;
        }
        //Extract Stock Info
        let stockData = yield (0, Stock_1.allStocks)();
        //Extract a mapping of stock data
        let stockObjMapped = (0, Stock_1.createStockHashMap)(stockData);
        //What if this sku does not exist in stock at all
        if (!stockObjMapped[sku]) {
            throw "Stock does not exist for sku#" + sku;
        }
        //Extracting transactions even if the file is of size terabytes
        let transactions = yield (0, Transaction_1.getTransactionsFromLargeFile)(sku);
        console.log("All Transactions ", transactions);
        //Make sure transactions exist
        if (transactions.length == 0) {
            throw "Seems like no transaction for sku #" + sku + " found";
        }
        //Starting stock
        qty = ~~stockObjMapped[sku];
        //We have to do the calculations on the stock
        let transactionAcc = transactions.reduce((prev, curr) => {
            if (curr.type == 'order') {
                return prev + (~~curr.qty);
            }
            if (curr.type == "refund") {
                return prev - (~~curr.qty);
            }
            return 0;
        }, 0);
        qty -= transactionAcc;
    }
    catch (error) {
        //   console.log("An error occured while extracting information " , error )
    }
    return { sku, qty };
});
const calculateStockQuantity = (sku) => __awaiter(void 0, void 0, void 0, function* () {
    let objToReturn = { sku, qty: 0 };
    try {
        let stocksFileDimensions = (0, functions_1.getFilesizeInBytes)(__data_path + 'stock.json');
        let transactionFileDimensions = (0, functions_1.getFilesizeInBytes)(__data_path + 'transactions.json');
        //Check if one of the files exceed the one GB criterion
        let oneGB = 1024 * 1024 * 1024;
        let filesAreLarge = (stocksFileDimensions > oneGB) || (transactionFileDimensions > oneGB);
        if (filesAreLarge) {
            return calculateStockQuantityHelperForLargeFiles(sku);
        }
        else {
            return calculateStockQuantityHelperForSmallFiles(sku);
        }
    }
    catch (error) {
        // console.log("An error occured " , error )
    }
    return objToReturn;
});
exports.calculateStockQuantity = calculateStockQuantity;
// (async function () {
//     let data = await calculateStockQuantity("SXV420098/71/68");
//     console.log(data)
// })()
