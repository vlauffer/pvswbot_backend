
//
var shorten = (rows) => {
    for(var i = 0; i<rows.length;i++){
        var baseText = rows[i].base;
        rows[i].base= baseText.substring(0, baseText.length-1);
    }

    return rows;
}

module.exports = {shorten}