
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

function init() {
	var books = [];
  localStorage.setObj('books', books);

  makeBook("Ender's Game", "Orson Scott Card", "242", true);
  makeBook("Game of Thrones", "George R R Martin", "242", false);
  updateBookLog();

}

function updateBookLog(){

  var ul = document.getElementById("bookLogList");

  while( ul.firstChild ){
  ul.removeChild( ul.firstChild );
  }

  var bList = localStorage.getObj('books');

	for (var i = (bList.length-1); i >= 0; i--) {

      var li = document.createElement("li");
      var name = bList[i].title;
      var status = bList[i].pgNumber;
      if(bList[i].finished){
        status = "Done"
      }
      li.appendChild(document.createTextNode(name+": "+status));
      ul.appendChild(li);
		}



}

function openForm() {
	document.getElementById("myForm").style.display = "block";
}

function closeForm() {
	document.getElementById("myForm").style.display = "none";
}

function submitLog() {
	var elem = document.getElementById("form-log").elements;
	var logForm = [];
	for (var i = 0, element; element = elem[i++];) {
		if (element.name == "title" || element.name == "author" || element.name == "curr_pg") {
			logForm.push(element.value);
		} else if (element.name == "finished") {
			logForm.push(element.checked);
		}

	}

	var existsFlag = false;
	var bList = localStorage.getObj('books');

	for (var i = 0; i < bList.length; i++) {
		if (logForm[0] == bList[i].title) {
			bList[i].pgNumber = logForm[2];
			bList[i].finished = logForm[3];
			existsFlag = true;
			// ADD SUMMARIES
		}
	}

	localStorage.setObj('books', bList);

	if(!existsFlag){
		makeBook(logForm[0], logForm[1], logForm[2], logForm[3]);
		//UPDATE FOR SUMMARIES
	}

   updateBookLog();

   return false;

}


function makeBook(title, author, pgNumber, finished) {
	var book = new Object();
	book.title = title;
	book.author = author;
	book.pgNumber = pgNumber;
	book.finished = finished;
	var bList = localStorage.getObj('books');
      bList.push(book);
	localStorage.setObj('books', bList);
}
