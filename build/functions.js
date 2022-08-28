"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesizeInBytes = exports.file_exists = exports.isJson = void 0;
const fs = require('fs');
const existsSync = fs.existsSync;
const statSync = fs.statSync;
// import { existsSync, statSync } from "fs";
const isJson = (str) => {
    try {
        let obj = JSON.parse(str);
        return obj;
    }
    catch (e) {
    }
    return false;
};
exports.isJson = isJson;
const file_exists = (path) => {
    let _self = this;
    if (existsSync(path)) {
        return true;
    }
    return false;
};
exports.file_exists = file_exists;
const getFilesizeInBytes = (filename) => {
    let stats = statSync(filename);
    return stats.size;
};
exports.getFilesizeInBytes = getFilesizeInBytes;
