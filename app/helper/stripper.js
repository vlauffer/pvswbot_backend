const Graphemer = require('graphemer').default;
const splitter = new Graphemer();


/**
 * strips away potential whitespace (sometimes postman requests contain extra spaces)
 * @param  {string} emoji_content
 * @returns {string} emojiArray[0]
 */
var strip = (emoji_content) =>{
    var emojiArray = []
    var emojis = splitter.splitGraphemes(emoji_content);
                        
    //if character is emoji, then add it to the emojiArray
    if (emojis!=null ){
        emojis.forEach(emoji => {
            if(/\p{Extended_Pictographic}/u.test(emoji) || /\p{Emoji}/u.test(emoji) ){
                emojiArray.push(
                    emoji
                )
            }
        });
    }

    if (emojiArray.length==1)
        return emojiArray[0];
    else{
        console.log("ERROR: multiple emojis detected ")
        console.log(emojiArray)
        return emojiArray[0];

    }
}

module.exports = {strip}

