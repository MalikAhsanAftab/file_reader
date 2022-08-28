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
const fs_1 = require("fs");
const stockRelativePath = __dirname + '/../../../data/stock.json';
const isJson = (str) => {
    try {
        let obj = JSON.parse(str);
        return obj;
    }
    catch (e) {
    }
    return false;
};
const fileReadable = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    let isFileReadable = false;
    try {
        // check if file is readable
        let isAccessable = yield (0, fs_1.access)(fileName, fs_1.constants.R_OK, (error) => { });
        isFileReadable = true;
    }
    catch (error) {
        console.log("An error occured while testing for file readability of file #" + fileName);
    }
    return isFileReadable;
});
const fileExists = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((0, fs_1.existsSync)(fileName)) {
            return true;
        }
    }
    catch (error) {
        console.log("An error occured while testing for file existence of file #" + fileName);
    }
    return false;
});
it('Should stock file exists', () => __awaiter(void 0, void 0, void 0, function* () {
    let checkFileExistence = yield fileExists(stockRelativePath);
    expect(checkFileExistence).toBe(true);
    // const response = await request(app).get('/users');
    // expect(response.statusCode).toBe(200);
    // expect(response.body).toEqual([]);
}));
it('Should stock file readable', () => __awaiter(void 0, void 0, void 0, function* () {
    let checkFileReadable = yield fileReadable(stockRelativePath);
    expect(checkFileReadable).toBe(true);
    // const response = await request(app).get('/users');
    // expect(response.statusCode).toBe(200);
    // expect(response.body).toEqual([]);
}));
it('Should stock file json', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = (0, fs_1.readFileSync)(stockRelativePath, { encoding: 'utf8' });
    //Trying to parse if possible
    expect(isJson(data)).not.toEqual(false);
    // const response = await request(app).get('/users');
    // expect(response.statusCode).toBe(200);
    // expect(response.body).toEqual([]);
}));
// it('should create a user', async() => {
//   const response = await request(app).post('/users').send(testUser);
//   expect(response.statusCode).toBe(200);
//   expect(response.body).toEqual({ ...testUser, id: 1 });
// });
// it('should not create a user if no firstName is given', async() => {
//   const response = await request(app).post('/users').send({ lastName: 'Doe', age: 21 });
//   expect(response.statusCode).toBe(400);
//   expect(response.body.errors).not.toBeNull();
//   expect(response.body.errors.length).toBe(1);
//   expect(response.body.errors[0]).toEqual({
//     msg: 'Invalid value', param: 'firstName', location: 'body'
//   });
// });
// it('should not create a user if age is less than 0', async() => {
//   const response = await request(app).post('/users').send({ firstName: 'John', lastName: 'Doe', age: -1 });
//   expect(response.statusCode).toBe(400);
//   expect(response.body.errors).not.toBeNull();
//   expect(response.body.errors.length).toBe(1);
//   expect(response.body.errors[0]).toEqual({
//     msg: 'age must be a positive integer', param: 'age', value: -1, location: 'body',
//   });
// });
// it('should check if file is exist', async() => {
//   const response = await request(app).post('/files').send( {fileName: "./test.pdf"} );
//   expect(response.statusCode).toBe(200);
//   expect(response.body).toEqual([])
// });
// it('should check if file is readable', async() => {
//   const response = await request(app).post('/files').send( {fileName: "./test.pdf"} );
//   expect(response.statusCode).toBe(200);
//   expect(response.body).toEqual([])
// });
