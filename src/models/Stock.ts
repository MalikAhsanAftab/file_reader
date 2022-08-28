import { createReadStream, readFileSync  } from "fs";
import { split , mapSync } from "event-stream";
import { isJson } from 'utils';
const stockFilePath : string = __data_path+'stock.json';

export interface Stock{
    sku: string ,
    stock : number
}
export const getStockFromLargeFile = async (sku : string ) : Promise<number> => {
    try{
        return new Promise((resolve , reject )=>{
            const dataStream  = createReadStream( stockFilePath , { encoding: 'utf8' } );

            dataStream
                .pipe(split("},{"))
                .pipe(mapSync((line : string )=>{
                    let [t1 , sku , t2 , stock ] = line.split(/[:,\,,\",\[\{,\}\]]/g).filter(Boolean);
                    // console.log(" Line :" , sku , stock )
                    if(sku == sku ){
                        resolve(~~stock);
                    }
                })).on("error" , function (err){
                    console.log("An error occured " , err )
                }).on("end" , function(){
                    console.log("EOF");
                })

        })
    }catch(error){
        console.log("An error occured while reading file in chunks " , error )
    }
    return 0;
}
export const allStocks = async () : Promise<Array<Stock>> => {
    let _self = this;
    try {
        const data  = readFileSync( stockFilePath , { encoding: 'utf8' } );
        //Trying to parse if possible
        return (isJson(data) || []);
    } catch (err) {
        console.log("Error occurred in Stock Model :" , err);
    }
    return [];
}
//Creating a map to get record by sku directly using key i.e sku
export const createStockHashMap = (stockArr : Array<Stock>) => {
  let objToReturn : any = [];
  stockArr.map( (s : Stock)=>objToReturn[s.sku] = s.stock );
  return objToReturn;
}