
class Rules{

    constructor(table){
        this.table = table;
    }

    didWin(){
        if (this.checkHorizontal()) return true;
        if (this.checkVertical()) return true;
        if (this.checkMajorDiagonal()) return true;
        if (this.checkMinorDiagonal()) return true;
        return false
    }


    checkHorizontal(){
        for(let x = 0; x < 3; x++)
            if( this.table[(x*3)+0] === this.table[(x*3)+1] )
                if( this.table[(x*3)+1] === this.table[(x*3)+2] )
                    if( this.table[(x*3)+0] !== ' ' )
                        return true;
        return false;
    }

    checkVertical(){
        for(let y = 0; y < 3; y++)
            if( this.table[y] === this.table[3+y] )
                if( this.table[3 + y] === this.table[6+y] )
                    if( this.table[y] !== ' ' )
                        return true;
        return false;
    }

    checkMajorDiagonal(){
        if ( this.table[0] === this.table[4])
            if (this.table[4] === this.table[8])
                if (this.table[0] !== ' ')
                    return true;
        return false;
    }

    checkMinorDiagonal(){
        if ( this.table[2] === this.table[4])
            if (this.table[4] === this.table[6])
                if (this.table[2] !== ' ')
                    return true;
        return false;
    }

}

export default function winningMove (table){
    let result = new Rules(table)
    return result.didWin()
}