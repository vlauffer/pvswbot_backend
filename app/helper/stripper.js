const Graphemer = require('graphemer').default;
const splitter = new Graphemer();

//strips away potential whitespace (sometimes postman requests contain extra spaces)
var strip = (string) =>{
    var emojiArray = []
    var emojis = splitter.splitGraphemes(string);
                        
        //if character is emoji, then add it to the emojiArray
        if (emojis!=null ){
            emojis.forEach(emoji => {
                if(/\p{Extended_Pictographic}/u.test(emoji)){
                    emojiArray.push(
                        emoji
                    )
                }
            });
        }

    if (emojiArray.length==1)
        return emojiArray[0];
    else{
        console.log("ERROR: multiple emojis detected in single reaction")
        console.log(emojiArray)
        return emojiArray[0];

    }

    return emojiArray

}

module.exports = {strip}

