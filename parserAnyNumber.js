const MAYBE = 0;
const FOUND = 1;
const ERROR = 2;
const SAVING = 3;

class ParserAnyNumber{
    
    state;
    numberString = [];
    number;
    position;

    divisor;


    
    saved;
    saved_position;
    
    lines;

    constructor(){
        this.reset();
      //  console.log(target.length);
    }
    
    getSaved(){
        return this.saved.join("").replace(';' , ',')
    }
    
    feed(char){

        if(this.state == ERROR){
            return;
        }

        if(this.position == 0 && char == ' '){
            return;
        }
        
        if(this.position == 0 && char == '('){
            this.position++
            return;
        }
        if(this.position == 1 || this.position == 2 ){
            if( /[0-9]/.test(char)){
                this.position++;
                this.numberString.push(char);
            }else{
                this.state = ERROR
            }
            return;
        }
        if(this.position == 3 && char == ')'){
            this.position++;
            this.state = FOUND
            this.number = parseInt(this.numberString.join(""));
            return;
        }
        if( this.state == FOUND || this.state == SAVING){
            this.state = SAVING
            if(char == '\n'){
                char = ' ';
                this.lines++;
            }
            this.saved[this.saved_position] = char;
            this.saved_position++;
            return;
        }
    }
    reset(){
        this.position = 0;
        this.state = MAYBE;
        this.saved = [];
        this.saved_position = 0;
        this.lines = 0;
        this.number = null;
        this.numberString= [];
    }
}


function anyTester(){
    const any = new ParserAnyNumber('\n') 
    let strings = [ '(10) hola hola' , '(25)asdasd' , '    (10)'  ]
    for( let i = 0 ; i < strings.length ; i++){
        for( let j=0 ;j<strings[i].length ; j++){
            any.feed(strings[i].charAt(j))
            console.log( `String : ${strings[i]} , position : ${any.position} , letter : ${strings[i].charAt(j)} , state : ${any.state} , number:${any.number}`)
            console.log(`Adentro: ${any.getSaved()}`)
        }
       console.log('reset')
       any.reset()
    }
}

module.exports = {ParserAnyNumber, MAYBE , FOUND , ERROR , SAVING , anyTester}