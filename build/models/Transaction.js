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
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTransactions = exports.getTransactionsFromLargeFile = void 0;
const fs_1 = require("fs");
const event_stream_1 = require("event-stream");
const utils_1 = require("utils");
const transactionsFilePath = __data_path + 'transactions.json';
const getTransactionsFromLargeFile = (sku) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let arr = [];
        return new Promise((resolve, reject) => {
            const dataStream = (0, fs_1.createReadStream)(transactionsFilePath, { encoding: 'utf8' });
            dataStream
                .pipe((0, event_stream_1.split)("},{"))
                .pipe((0, event_stream_1.mapSync)((line) => {
                let [t1, skuTransaction, t2, type, t3, qty] = line.split(/[:,\,,\",\[\{,\}\]]/g).filter(Boolean);
                if (sku == skuTransaction) {
                    arr.push({ sku, type, qty });
                }
            })).on("error", function (err) {
                console.log("An error occured ", err);
            }).on("end", function () {
                console.log("EOF ");
                resolve(arr);
            });
        });
    }
    catch (error) {
        console.log("An error occured while reading file in chunks ", error);
    }
    return [];
});
exports.getTransactionsFromLargeFile = getTransactionsFromLargeFile;
const allTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    let _self = this;
    try {
        const data = (0, fs_1.readFileSync)(transactionsFilePath, { encoding: 'utf8' });
        //Trying to parse if possible
        return ((0, utils_1.isJson)(data) || []);
    }
    catch (err) {
        console.log("Error occurred in Transaction Model :", err);
    }
    return [];
});
exports.allTransactions = allTransactions;
