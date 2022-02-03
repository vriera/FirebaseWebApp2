const fs = require('fs');
const terminosPath = 'config/terminos.txt'
const campo51 = [
    "C07K16",
    "C07K2317",
    "A61K39",
    "C07K2319" , 
    "G01N33" , 
    "C07K14", 
    "A61K47", 
    "A61K38", 
    "A61P35" ,
    "A61K45" , 
    "A61K31", 
    "G01N2333", 
    ];
    

async function getTerminos( filename ){
    let terminosAux = await fs.readFileSync(filename).toString();
    terminosAux = terminosAux.split('\n');
    let terminosTrimmed = [];
    terminosAux.forEach( element => {
        terminosTrimmed.push(element.replace(/\r/g , "").trim());
    });
    return terminosTrimmed;
}


async function generateTerminosRegExp( terminos ){
   // console.log(terminos);
    let pattern = "([\\n ^](";
    let count = 0;
    for(let i = 0 ; i < terminos.length ; i++){
        if(count> 0)
            pattern = pattern.concat("|");
        count++
        pattern = pattern.concat(`${terminos[i]}`);

    }
    pattern = pattern.concat(")[\\n $])");
    console.log(pattern);
    return new RegExp(pattern , "i");
}

async function generateRegExp(terminos){
    let pattern = "("
    let count = 0;
    for( let i = 0 ; i < terminos.length ; i++){
        
        if (count > 0)
            pattern = pattern.concat("|");
        
        count++
        pattern = pattern.concat( `${terminos[i]}`);

    }
    pattern = pattern.concat(")")
    console.log(pattern);
    return new RegExp(pattern , "i");
}


async function getTerminosRegExp(){
    return await generateTerminosRegExp(await getTerminos(terminosPath));
}

async function getCampo51RegExp(){
    return await generateRegExp(campo51);
}


module.exports = { getTerminosRegExp , getCampo51RegExp}