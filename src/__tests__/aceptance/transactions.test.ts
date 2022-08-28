import { existsSync , readFile , readFileSync , access , constants as fsConstants} from "fs";
import { join } from 'path';
import * as request from 'supertest';
const transactionsRelativePath = __dirname+'/../../../data/transactions.json';

const isJson = (str : string ) => {
  try {
      let obj : any = JSON.parse(str)
      return obj;
  } catch (e) {

  }
  return false;
}
const fileReadable = async (fileName :  string ) : Promise<Boolean> => {
  let isFileReadable = false;
  try{ 
    // check if file is readable
    let isAccessable = await access(fileName, fsConstants.R_OK , (error : any )=>{});

    isFileReadable = true;
  }catch(error){
    console.log("An error occured while testing for file readability of file #"+fileName );

  }
  return isFileReadable;
}
const fileExists = async (fileName :  string ) : Promise<Boolean> => {
  try{
    if (existsSync(fileName)) {
      return true;
    }
  }catch(error){
    console.log("An error occured while testing for file existence of file #"+fileName )
  }
  return false;
}


it('Should transactions file exists', async() => {
  let checkFileExistence = await fileExists(transactionsRelativePath);
  expect(checkFileExistence).toBe(true)

  // const response = await request(app).get('/users');
  // expect(response.statusCode).toBe(200);
  // expect(response.body).toEqual([]);
});

it('Should transactions file readable', async() => {
  let checkFileReadable = await fileReadable(transactionsRelativePath);
  expect(checkFileReadable).toBe(true)

  // const response = await request(app).get('/users');
  // expect(response.statusCode).toBe(200);
  // expect(response.body).toEqual([]);
});
it('Should transactions file json', async() => {
  const data = readFileSync( transactionsRelativePath , { encoding: 'utf8' } );

  //Trying to parse if possible
  expect(isJson(data)).not.toEqual(false)

  // const response = await request(app).get('/users');
  // expect(response.statusCode).toBe(200);
  // expect(response.body).toEqual([]);
});

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
