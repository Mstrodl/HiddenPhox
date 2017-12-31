module.exports = class {
    constructor(titles) {
        this._rows = [titles];
        this._widths = [];
        for(let i=0;i<this._rows.length;i++){
            for(let _i=0;_i<this._rows[i].length;_i++){
                this._widths.push(this._rows[i][_i].length);
            }
        }
    }

    _updateWidth(row){
        for(let index in row){
            let entry = row[index];
            let width = entry.length;
            if(width > this._widths[index]){
                this._widths[index] = width;
            }
        }
    }

    addRow(row){
        this._rows.push(row);
        this._updateWidth(row);
    }

    render(){
        function drawRow(row){
            let columns = [];

            for(let index in row){
                let field = row[index];
                if(!isNaN(parseInt(field))){
                    columns.push(field.padStart(this._widths[index]));
                }else{
                    columns.push(field.padEnd(this._widths[index]));
                }
            }

            return columns.join("|");
        }

        let trows = [];
        for(let index in this._rows[0]){
            let field = this._rows[0][index];
            let out = field;
            let width = this._widths[0][index];
            out=out.padStart(Math.floor((width-field.length)/2));
            out=out.padEnd(width-Math.floor((width-field.length)/2));
            trows.push(out);
        }

        let title_row = trows.join("|");

        let seperator_row = "";
        for(let width in this._widths){
            seperator_row += "-".repeat(width+2);
            if(width != this._widths.length-1){
                seperator_row += "+";
            }
        }

        let drawn = [title_row, seperator_row];
        this._rows = this._rows.splice(1,this._rows);
        for(let row in this._rows){
            row = drawRow(row);
            drawn.push(row);
        }

        return drawn.join("\n");
    }
}