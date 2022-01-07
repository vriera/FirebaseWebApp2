//variables de entorno
require('dotenv').config();
//lector de pdf
const pdfparse = require('pdf-parse');
//app de firebase
const { writePatente } = require('./app')
//mi parser a mano
const {Parser , MAYBE , FOUND , ERROR , SAVING} = require('./parser');

const fs = require('fs')
const dir = './data_small'
const files = fs.readdirSync(dir);

console.log('found files are:');
console.log(files)

const campos = [ 10 , 21 ,22, 29 , 30 , 41 , 51 , 54 , 57 , 61 , 62 , 71 , 72 , 74 , 84 ];

let target_found = 0
//files.forEach( (filename) => console.log(filename));

//
customParserApp();
async function customParserApp(){
    await Promise.all(files.map( async (filename) => {
        let file = fs.readFileSync(`${dir}/${filename}`);
        data = await pdfparse(file)
        let text = data.text;
        //console.log(text , text.text_len);
        target_found += await  masterParser(text, text.length , filename);
    }));
    console.log(`Se encontraron ${target_found}  39/40`);
}

function resetAll(parserMap){
    for ( let i = 0 ; i < campos.length ; i++){
        parserMap.get(campos[i]).reset();
    }
}

function resetAllExcluding(parserMap , exclude){
    for ( let i = 0 ; i < campos.length ; i++){
        if(campos[i] != exclude){
        parserMap.get(campos[i]).reset();
        }
    }
}
function printSaved(parserMap){
    let aux;
    for ( let i = 0 ; i < campos.length ; i++){
        aux = parserMap.get(campos[i]);
        if(aux.state == SAVING){
            console.log(`el parser ${aux.target} tenia adentro lo siguiente: ${aux.getSaved()}`)
        }else{
            console.log(`el parser ${aux.target} estaba en el estado ${aux.state}`);
        }
    }
}

function whoFound(p){
    let aux;
    for ( let i = 0 ; i < campos.length ; i++){
        aux = p.get(campos[i]);
        if( aux.state == FOUND){
            return campos[i];
        }
    }
    return -1;
}

function whoFoundExcluding(p , exclude){
    let aux;
    for ( let i = 0 ; i < campos.length ; i++){
        aux = p.get(campos[i]);
        if( campos[i] != exclude && aux.state == FOUND){
            return campos[i];
        }
    }
    return -1;
}

function initParsersCampos(){
    const map = new Map();
    for( let i = 0 ; i < campos.length ; i++)
    {
        console.log(`(${campos[i]})`);
        map.set(campos[i] , new Parser(`(${campos[i]})` , '\n'));
    }
    return map
}


async function masterParser(text , text_len , filename){
    
    const p = initParsersCampos();
    let parserCode = new Parser('A61P', ',');
    
    let totalPatentes = 0;
    let targetLocal = 0;

    let count = 0;
    let enterCount = 0;
    let actual = -1;
    let newParser = -1;
    let auxParser;
    let buffer;

    let patenteActual = {};
    let patentes = [];

    for(let i = 0 ; i < text_len ; i++ ){
        c = text[i];
       // checkState(p);
        count++;

        for ( let i = 0 ; i <campos.length ; i++){
            p.get(campos[i]).feed(c);
        }
        
        if(p.get(10).state == FOUND){
            console.log('10 found');
            if(totalPatentes > 1 ){
                patentes.push(patenteActual);
                patenteActual = {};
            }
            totalPatentes++;
        }



      

        if(count == 4){
            //console.log(`haciendo el checko con el count en 4 , la letra actual es ${c} y estoy con el parser ${actual}`)
            if(actual != -1){
                newParser = whoFound(p);
                if(newParser != -1 ){
                    auxParser = p.get(actual);
                    buffer = auxParser.getSaved();
                    //console.log(buffer.substring(0 , buffer.length - 4));
                    patenteActual[actual] = buffer.substring(0 , buffer.length - 4);
                    actual = newParser;
                }
            }else{
                actual = whoFound(p);
            }
        }

        if(c == '\n'){

     
            if(actual == -1 ){ 
                actual = whoFound(p);
            }
           // console.log(count)
           // printSaved(p);
            enterCount++;
            count = 0;
            //doble enter
            if(enterCount == 2 ){
                newParser = whoFound(p);
                if( newParser != -1 ){
                auxParser = p.get(newParser);
                buffer = auxParser.getSaved();
                //console.log(buffer.substring(0 , buffer.length - 4));
                patenteActual[actual] = buffer.substring(0 , buffer.length - 4);
                }
                actual = -1;
            }
            //            
            if(actual == 41 && p.get(41).lines == 2 ){ 
               // console.log("overflow del campo 41");
              //  console.log(`Tenia adentro: ${p.get(41).getSaved()}`);
                auxParser =  p.get(41);
                patenteActual[41] = auxParser.getSaved();
                actual = -1;
            }
            resetAllExcluding(p, actual);
           // console.log(`reset con actual en ${actual}`);
        }else {
            enterCount = 0
            /*
            if(p.get(51).state == SAVING){
                if( c == ','){
                    if(parserCode.state== FOUND){
                        targetLocal+= 1;
                    }
                    parserCode.reset();
                }
                parserCode.feed(c);
            }*/
        }
       
    }
    patentes.push(patenteActual);
    console.log(`Se encontraron ${totalPatentes} con ${targetLocal} local en ${filename}`);
    console.log(patentes);
    for( let i = 0 ; i < patentes.length ; i++){
        await writePatente(patentes[i][10] , patentes[i])
    }
    return targetLocal;
}
