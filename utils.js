const campos = [ 10 , 21 , 29 , 30 , 41 , 51 , 54 , 57 , 61 , 62 , 71 , 72 , 83 ];
const {Parser , MAYBE , FOUND , ERROR , SAVING} = require('./parser');
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


function whoFound(p , any){
    let aux;
    
    for ( let i = 0 ; i < campos.length ; i++){
        aux = p.get(campos[i]);
        if( aux.state == FOUND){
            return campos[i];
        }
    }
    
    if(any.state == FOUND){
        return -any.number;
    }
    return -1;
}

function clearBuffers(p){
    for ( let i = 0 ; i < campos.length ; i++){
        p.get(campos[i]).emptyParser();
    }
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




function shouldAdd( number , array ){
    if(number <-1 ){
       // console.log(`Flipped: ${number}`)
        number = -number
    }
    if(number == 41 ){
        return true;
    }
   // console.log(`tengo el numero ${number}  y en el array tengo ${array}`)
    for(let i = 0 ; i < array.length ; i++){
        if( number < array[i] ){
            return false;
        }
    }
    return true;
}



module.exports = {resetAll , resetAllExcluding , whoFound , clearBuffers , whoFoundExcluding , shouldAdd }