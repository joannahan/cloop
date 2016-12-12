var Controller = function() {
  // Create the object that we will return.
  var that = Object.create(Controller.prototype); 

  // The <input type="text"> containing the search term.
  var searchTermInput;

  // The <ul> containing the possible autocompletions.
  var resultsList;

  // Function to be called on every keyup event
  var autocompleteListener;

  /**
   * Registers a listener function to be called after each keypress. 
   * The listener will be passed a single String word as an argument
   * when invoked.
   *
   * @param {Function} listener - The function to be called. Function
   *   must accept a single String as an argument.
   */
  that.registerAutocompleteListener = function(listener) {
    autocompleteListener = listener;
  }

  /**
   * Appends a String value to the end of the search results list.
   *
   * @param {String} value - The text to append to the search list.
   */
  that.appendToSearchResults = function(value) {
    resultsList.appendChild(createListElement(value, onResultClick));
  }

  /**
   * Removes all entries existing in the search results.
   */
  that.clearSearchResults = function() {
    resultsList.innerHTML = '';
  }

  /**
   * Create an <li> that contains the given value and executes the given
   * handler when it is clicked.
   *
   * @param {String} value - The text to place inside the <li>.
   * @param {Function} onClick - The event handler to execute when the <li> is
   *  clicked.
   */
  var createListElement = function(value, onClick) {
    var li = document.createElement('li');
    var classForm = document.createElement('FORM');
    classForm.method = 'POST';
    classForm.action = 'group/user/enroll_class_by_name';

    var classInput = document.createElement('INPUT');
    classInput.type = 'text';
    classInput.name = 'className';
    classInput.value = value;
    classInput.readonly;

    classForm.appendChild(classInput);

    var submit = document.createElement('INPUT');
    submit.type = 'submit';
    submit.value = 'Join class';

    classForm.appendChild(submit);

    li.appendChild(classForm);
    return li;
  }

  /**
   * Handle the click of an autocompletion.
   *
   * @param {Object} event - The click event.
   */
  var onResultClick = function(event) {
    searchTermInput.value = event.target.innerHTML;
    that.clearSearchResults();
  }

  /**
   * Perform autocompletion each time a key is typed.
   */
  var onKeyUp = function() {

    that.clearSearchResults();
    // If there's a search term and a registered listener,
    // invoke the listener with the search term.
    var searchTerm = searchTermInput.value
    if (searchTerm.length > 0 && autocompleteListener != undefined) {
      autocompleteListener(searchTerm);
    }
  }

  // Grab handles to the HTML nodes when the page loads.
  var onLoad = function() {
    searchTermInput = document.getElementById('search-input');
    resultsList = document.getElementById('results-list');
    searchTermInput.addEventListener('keyup', onKeyUp, false);
  }

  if (document.readyState != 'loading'){
    onLoad();
  } else {
    document.addEventListener('DOMContentLoaded', onLoad);
  }

  // Freeze object to prevent modification.
  Object.freeze(that);

  return that;
};