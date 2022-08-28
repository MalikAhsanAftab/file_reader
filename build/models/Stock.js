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
exports.createStockHashMap = exports.allStocks = exports.getStockFromLargeFile = void 0;
const fs_1 = require("fs");
const event_stream_1 = require("event-stream");
const utils_1 = require("utils");
const stockFilePath = __data_path + 'stock.json';
const getStockFromLargeFile = (sku) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const dataStream = (0, fs_1.createReadStream)(stockFilePath, { encoding: 'utf8' });
            dataStream
                .pipe((0, event_stream_1.split)("},{"))
                .pipe((0, event_stream_1.mapSync)((line) => {
                let [t1, sku, t2, stock] = line.split(/[:,\,,\",\[\{,\}\]]/g).filter(Boolean);
                // console.log(" Line :" , sku , stock )
                if (sku == sku) {
                    resolve(~~stock);
                }
            })).on("error", function (err) {
                console.log("An error occured ", err);
            }).on("end", function () {
                console.log("EOF");
            });
        });
    }
    catch (error) {
        console.log("An error occured while reading file in chunks ", error);
    }
    return 0;
});
exports.getStockFromLargeFile = getStockFromLargeFile;
const allStocks = () => __awaiter(void 0, void 0, void 0, function* () {
    let _self = this;
    try {
        const data = (0, fs_1.readFileSync)(stockFilePath, { encoding: 'utf8' });
        //Trying to parse if possible
        return ((0, utils_1.isJson)(data) || []);
    }
    catch (err) {
        console.log("Error occurred in Stock Model :", err);
    }
    return [];
});
exports.allStocks = allStocks;
//Creating a map to get record by sku directly using key i.e sku
const createStockHashMap = (stockArr) => {
    let objToReturn = [];
    stockArr.map((s) => objToReturn[s.sku] = s.stock);
    return objToReturn;
};
exports.createStockHashMap = createStockHashMap;
