import path from 'path'
global.__data_path = path.join(__dirname+'/../data/');
import { getTransactionsFromLargeFile , allTransactions  , Transaction } from './models/Transaction';
import { getStockFromLargeFile , allStocks , createStockHashMap } from './models/Stock';
import { getFilesizeInBytes } from 'utils';

const calculateStockQuantityHelperForSmallFiles = async (sku: string) : Promise<{ sku: string, qty: number }> => {
  let qty = 0;
  // console.log("Whats in SKU request" , sku );
  try{
      if( (sku || '').trim().length < 1){
          throw "Invalid sku #"+sku;
      }
      getTransactionsFromLargeFile('LTV719449/39/39');

      let promiseArr : Array<Promise<any>> = [];
      //Extract Transactions
      promiseArr.push(allStocks());

      //Extract Quantity
      promiseArr.push(allTransactions());

      //Waiting for data from all files
      let finalDataArr = await Promise.all(promiseArr);

      //Creating custom variables
      let stockData = finalDataArr[0] || [];
      let transactionDataArr = finalDataArr[1] || [];
      
      //Extract a mapping of stock data
      let stockObjMapped = createStockHashMap(stockData)
      
      //What if this sku does not exist in stock at all
      if(!stockObjMapped[sku])
      {
          throw "Stock does not exist for sku#"+sku;
      }

      //Starting stock
      qty = ~~stockObjMapped[sku];

      //Keeping record if there exists a single transaction for this sku
      let isSomeTransactionFound = false;

      for (let index = 0; index < transactionDataArr.length; index++) {
          const transaction : Transaction = transactionDataArr[index];
          
          //Make sure the sku is our desired one
          //If its not then skip
          if(transaction.sku == sku){
              isSomeTransactionFound = true;

              //We have to do the calculations on the stock
              let transactionQty =  ~~transaction.qty;

              if(transaction.type == 'order'){
                  //Decrease the quantity
                  qty-=transactionQty;
              }else if(transaction.type == 'refund'){
                  //Increase the quantity
                  qty+=transactionQty;
              }
          }
      }
      if(!isSomeTransactionFound){
          throw "Seems like no transaction for sku #"+sku+" found";
      }

      // console.log("Files Read Final data " , stockData  , " ::::: " , transactionDataArr); 
  }catch(error){
      console.log("An error occured while extracting information " , error )
  } 
  return {sku  , qty };
}

//  By using streams no matter how big our data set is our app is capable of handling
const calculateStockQuantityHelperForLargeFiles = async (sku: string) : Promise<{ sku: string, qty: number }> => {
  let _self = this;
  let qty = 0;
  console.log("Whats in SKU request" , sku );
  try{
      if( (sku || '').trim().length < 1){
          throw "Invalid sku #"+sku;
      }
      
      //Extract Stock Info
      let stockData = await allStocks();
      
      //Extract a mapping of stock data
      let stockObjMapped = createStockHashMap(stockData)
      
      //What if this sku does not exist in stock at all
      if(!stockObjMapped[sku])
      {
          throw "Stock does not exist for sku#"+sku;
      }

      //Extracting transactions even if the file is of size terabytes
      let transactions : Array<Transaction> = await getTransactionsFromLargeFile(sku);
      console.log("All Transactions " , transactions );
      
      //Make sure transactions exist
      if(transactions.length == 0){
          throw "Seems like no transaction for sku #"+sku+" found";
      }

      //Starting stock
      qty = ~~stockObjMapped[sku];
           
      //We have to do the calculations on the stock
      let transactionAcc = transactions.reduce((prev:number , curr : Transaction)=>{
          if(curr.type == 'order'){
              return prev+(~~curr.qty) 
          }
          if(curr.type == "refund"){
              return prev-(~~curr.qty) 
          }
          return  0;
      }, 0)
      
      qty -= transactionAcc;    
  }catch(error){
      console.log("An error occured while extracting information " , error )
  } 
  return {sku  , qty };
}
export const calculateStockQuantity = async (sku : string )=>{
    let objToReturn = { sku  , qty : 0};
    try{
        let stocksFileDimensions = getFilesizeInBytes(__data_path+'stock.json');
        let transactionFileDimensions = getFilesizeInBytes(__data_path+'transactions.json');

        //Check if one of the files exceed the one GB criterion
        let oneGB = 1024*1024*1024;
        let filesAreLarge = (stocksFileDimensions > oneGB) || (transactionFileDimensions > oneGB);

        if(filesAreLarge){
            return calculateStockQuantityHelperForLargeFiles(sku);
        }else{
            return calculateStockQuantityHelperForSmallFiles(sku);
        }
    }catch(error){
        console.log("An error occured " , error )
    }
    return objToReturn;
}
// (async function () {
//     let data = await calculateStockQuantity("SXV420098/71/68");
//     console.log(data)
// })()