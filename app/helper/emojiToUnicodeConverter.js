const emojiUnicode = require("emoji-unicode");


//converts any emoji into their unicode value, accounting for invisible escape characters
var emojiToUnicode = (emoji) => {
    var ucode = emojiUnicode(emoji);
    ucode = ucode.replaceAll(" ", "_");
    if(ucode.length<11){
        ucode = ucode.replaceAll("_fe0f", "")
    }
    if (ucode.length<3 || ucode.split("_")[0].length<3 ){
        ucode = "00"+ucode 
    }

    return ucode;
}

module.exports= {emojiToUnicode}