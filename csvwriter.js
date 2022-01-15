
const fs = require('fs');
let path;
let campos = [];
let initialized = false;
const {promisify} = require('util');
const append = promisify(fs.appendFile)

async function myAppend(string){
  await append(path , string , 'utf-8' );
}

async function generateHeader(){
  if(await !fs.existsSync(path) ){
    console.log(`the path does not exists, the fields are ${campos}`);
    
    let line = ""
    for(let i = 0 ; i < campos.length ; i++){
      if( i + 1 != campos.length){
       line = line.concat(`${campos[i]};` );
      }
      else{
        line = line.concat( `${campos[i]}\n` );
      }
    }
    await myAppend(line);
  }
}


async function initCSVWriter( filename , newCampos){
  path = `./out/${filename}`;
  campos = newCampos;
  campos.push('pdf');
  await generateHeader();
  initialized = true;
}

async function writeCSVpatente( patente  ){
  if ( !initialized ){
    console.log("CSV writer not initialized!");
    return;
  }
  console.log("writing");
    let line = "";
    for(let i = 0 ; i < campos.length ; i++){
      if( i + 1 != campos.length){
        if(patente[campos[i]]){
          line = line.concat(`${patente[campos[i]]};` );
        }else{
          line = line.concat( `;`);
        }
      }
      else{
        if(patente[campos[i]]){
          line = line.concat(`${patente[campos[i]]}\n` );
        }else{
          line = line.concat( `\n`);
        }
      }
    }
  await myAppend(line);
}

module.exports= { initCSVWriter , writeCSVpatente}