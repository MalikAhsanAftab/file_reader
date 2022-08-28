// const fs = require('fs');
// const existsSync = fs.existsSync;
// const statSync = fs.statSync;
import { existsSync, statSync } from "fs";

export const isJson = (str : string ) => {
    try {
        let obj : any = JSON.parse(str)
        return obj;
    } catch (e) {

    }
    return false;
}
export const file_exists = (path : string ) : Boolean => {
    let _self = this;
    if (existsSync(path)) {
        return true;
    }
    return false;
}
export const getFilesizeInBytes = (filename : string ) => {
    let stats = statSync(filename);
    return stats.size;
}