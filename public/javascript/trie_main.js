$(document).ready(function(){
  console.log('about to instantiate controller!');
  // document.addEventListener('DOMContentLoaded', function () {

    var controller = Controller();

//    Instantiate trie
    var trie = Trie();
    console.log("trie instantiated");

    //get all active, non archived classes from database with ajax
    $.ajax({
      url:'/group/nonuserclasses',
      type:'GET',
      success: function(data){

        //Add words to trie.
        data.classes.forEach(function(word) {
          trie.addWord(word);
        });

      },
      error: function(xhr, status, error){
        console.log("An error occurred: " + error);
      }
    });

    //Listener called every time a key press occurs
    controller.registerAutocompleteListener(function(prefix) {

      controller.clearSearchResults();

      // Populate autocompletions.
      trie.autocomplete(prefix).forEach(function(word) {
        controller.appendToSearchResults(word);
      });
    });
});