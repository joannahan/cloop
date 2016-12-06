// Represents a node that will make up the autocomplete Trie
// children: dictionary connecting letters to child node objects
// No parent reference
var TNode = function(){
  //children is a dictionary, where the keys are letters of the alphabet
  //(strings of length 1), and the values are TNodes
  var children = {};
  var isWord = false;
  var that = Object.create(TNode.prototype);

  //Adds a word to the trie letter by letter, recursively
  //@param word: string to be added to the Trie
  that.addWordtoNode = function(word){
    if (word.length == 0){
      isWord = true;
    } else {
      //case sensitivity
      var first_letter = word.charAt(0).toLowerCase();
      var remainder = word.slice(1);
      if (!(first_letter in children)){
        children[first_letter] = TNode();
      }
      //recurses, slicing one letter off from the word at a time
      //and adding it to the tree
      children[first_letter].addWordtoNode(remainder);
    }
  }

// Helper/part of autocomplete functionality
// Given a prefix, travels as far down the tree as it can
// and returns that node. Returns an empty TNode if no such 
// prefix is part of the tree
// @param prefix: string to be recursed upon 
// @return node: furthest down node that represents prefix
  that.findPath = function(prefix){
    if (prefix.length != 0){
      var first_letter = prefix.charAt(0).toLowerCase();
      var remainder = prefix.slice(1);
      if(!(first_letter in children)){
        // empty node object
        return TNode();
      } else {
        //recurse on the remainder of the prefix, like in addWordtoNode
        return children[first_letter].findPath(remainder);
      }
    }
    else {
      //return self
      return that;
  }
}

  // Gets all valid words after the node it is called on, not
  // including the prefix
  // @return wordList: list of strings representing partially formed words
  that.getWordList = function(){
    var wordList = [];
    if (isWord){
      wordList.push('');
    }
    Object.keys(children).forEach(function (letter){//For each key get mapped Node
            children[letter].getWordList() // and get the list of Words it leads to recursively
            .map(function (suffix){ //combine each string in the resulting WordList to the parent node's letter
              return (letter + suffix)
              })
            .forEach(function (word){ //add each newly combined word to the final word list
              wordList.push(word)
            })
          });
    return wordList;
}

  Object.freeze(that);
  return that;
}

// Retrieval tree object
// Can add words and autocomplete them
var Trie = function(){
  var root_Node = TNode();
  var that = Object.create(Trie.prototype);

  //calls TNode's addWordtoNode
  //@param word: word to be added to trie
  that.addWord = function(word){
    root_Node.addWordtoNode(word);
  }

  //suggests 10 valid words sorted alphabetically that contain the prefix at the very beginning
  //@param prefix: beginning of words
  //@return final_word_list: list of 10 strings representing the result of autocomplete search of Trie
  that.autocomplete = function(prefix){
    var final_word_list = root_Node.findPath(prefix)
                          .getWordList()
                          //concatenates with prefix
                          .map(function(word){
                            return prefix + word;
                          })
                          .sort()
                          .slice(0, 10);

    return final_word_list;
  }

  Object.freeze(that);
  return that;
}