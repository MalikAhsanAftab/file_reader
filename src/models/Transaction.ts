import { createReadStream, readFileSync  } from "fs";
import { split , mapSync } from "event-stream";
import { isJson } from 'utils';

const transactionsFilePath : string = __data_path+'transactions.json';

export interface Transaction{
    sku : string ,
    type : 'order' | 'refund' ,
    qty : number
}

export const getTransactionsFromLargeFile = async (sku : string ) : Promise<Array<Transaction>> => {
    try{
        let arr : any = [];
        return new Promise((resolve , reject )=>{
            const dataStream  = createReadStream( transactionsFilePath , { encoding: 'utf8' } );

            dataStream
                .pipe(split("},{"))
                .pipe(mapSync((line : string )=>{
                    let [t1 , skuTransaction , t2 , type , t3 , qty ] = line.split(/[:,\,,\",\[\{,\}\]]/g).filter(Boolean);
                    if(sku == skuTransaction ){
                        arr.push({ sku , type , qty })
                    }
                })).on("error" , function (err){
                    console.log("An error occured " , err )
                }).on("end" , function(){
                    console.log("EOF " );
                    resolve(arr)
                })

        })
    }catch(error){
        console.log("An error occured while reading file in chunks " , error )
    }
    return [];
}
export const allTransactions = async () : Promise<Array<Transaction>> => {
    let _self = this;
    try {
        const data = readFileSync( transactionsFilePath , { encoding: 'utf8' } );

        //Trying to parse if possible
        return (isJson(data) || []);
    } catch (err) {
        console.log("Error occurred in Transaction Model :" , err);
    }
    return [];
}