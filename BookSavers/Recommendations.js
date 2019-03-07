Storage.prototype.setObj = function(key, obj) {

  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}

function init() {
  var books = [];

  if (localStorage.getObj('books') === null) {
    localStorage.setObj('books', books);


    makeBook("Game of Thrones", "George R R Martin", "242", "6", true, "test summary");
    makeBook("Ender's Game", "Orson Scott Card", "242", "1.5", false, "");

    localStorage.setObj('sums', "");
  }

  if (localStorage.getObj('bookLib') === null) {
    localStorage.setObj('bookLib', books);

    var similarB = [];

    makeBookForLib("Game of Thrones", "George R R Martin", "4", "Love it", ["Ender's Game", "Harry Potter", "Lord of the Rings"]);
    makeBookForLib("Ender's Game", "Orson Scott Card", "5", "Best book ever", ["Game of Thrones"]);
    makeBookForLib("Harry Potter", "J K Rowling", "3", "!!!!!!", ["Game of Thrones", "Lord of the Rings"]);
    makeBookForLib("Lord of the Rings", "Tolkien", "5", "BEST BOOK EVR", ["Game of Thrones"]);
    makeBookForLib("Ender's Shadow", "Orson Scott Card", "4", "Great if you love Ender's Game", ["Ender's Game", "Ender's Shadow"]);
    makeBookForLib("Ender in Exile", "Orson Scott Card", "3", "Wonderful sequel, must read Ender's Game first", ["Ender's Game", "Ender's Shadow"]);

  }

  updateOptions();
  updateBookLib();
  loadDropdown();

}


function loadDropdown(){
	var dd = document.getElementById("title-dropdown");
	var bList = localStorage.getObj('books');
	
	for (var i = (bList.length-1); i >= 0; i--) {
		var o = document.createElement("option");
		o.setAttribute("value", bList[i].title);
		o.innerHTML = bList[i].title;
		dd.appendChild(o);
	}
}
	
function updateOptions() {


  var ul = document.getElementById("reviewDropdown");

  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  var bList = localStorage.getObj('books');

  for (var i = (bList.length - 1); i >= 0; i--) {
    var name = bList[i].title;

    var dropdown = document.getElementById("reviewDropdown");
    var option = document.createElement("OPTION");
    option.innerHTML = name;
    option.value = name;
    dropdown.options.add(option);

  }


}

function updateLibDropdown() {



  var bList = localStorage.getObj('bookLib');
  var dropdown = document.getElementById("lib-list");
  for (var i = (bList.length - 1); i >= 0; i--) {
    var name = bList[i].title;
    var option = document.createElement("OPTION");
    option.innerHTML = name;
    option.value = name;
    dropdown.appendChild(option);

  }


}

function takeAmazon(title){
	var fp = "https://www.amazon.com/s?k=";
	var end = "&i=stripbooks"
	var target = fp + title + end;
	var win = window.open(target, '_blank');
	win.focus();
}

function subUpdateSim(title) {
  var dl = document.getElementById("lib-list");
  var selectedTitle = dl[dl.selectedIndex].value;
  var bList = localStorage.getObj('bookLib');
  for (var i = (bList.length - 1); i >= 0; i--) {
	  if(bList[i].title == selectedTitle){
		  var sim = bList[i].similar;
		  sim.push(title);
		  bList[i].similar = sim;
	  }
  }
  
  localStorage.setObj('bookLib', bList);
  updateBookLib();
	
}

function updateBookLib() {


  var ul = document.getElementById("RecommendationsList");

  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  var foundFlag = false;
  var numFound = 0;
  var foundArray = [];

  var bList = localStorage.getObj('bookLib');

  var selector = document.getElementById('reviewDropdown');
  var selectedTitle = selector[selector.selectedIndex].value;

  for (var i = (bList.length - 1); i >= 0; i--) {

    var similarBooks = bList[i].similar;

    if (similarBooks.includes(selectedTitle) && selectedTitle != bList[i].title) {

      numFound = numFound + 1;
      foundFlag = true;
      foundArray.push(bList[i].title);


      var li = document.createElement("li");
      var name = bList[i].title;
      var review = bList[i].review;
      var rating = bList[i].rating;
	  
	  
      var TN = document.createElement('p');
      TN.innerHTML = name + ": " + rating + "/5";
      TN.setAttribute("style", "margin-bottom: 0%; cursor: pointer; text-decoration: underline;");
	  
	  TN.onclick = (function() {
		  var title = name;
		  return function (){
			  takeAmazon(title);
		  }
	  })();



      li.appendChild(TN);

      var TN = document.createElement('p');
      TN.innerHTML = review;
      TN.setAttribute("style", "margin-bottom: 0%;");

      li.appendChild(TN);
      ul.appendChild(li);

    }
  }


	if(numFound == 0){
	  ul.setAttribute("style", "list-style-type: none;");
      var li = document.createElement("li");
	  var TN = document.createElement('p');
      TN.innerHTML = "No similar books have been found. Please add a connection.";
      TN.setAttribute("style", "margin-bottom: 0%;");
	  li.appendChild(TN);
      ul.appendChild(li);
	  var li = document.createElement("li");
	  var sel = document.createElement("select");

	  sel.setAttribute("id", "lib-list");

	  li.appendChild(sel);
	  ul.appendChild(li);  
	  updateLibDropdown();
	  
	  var li = document.createElement("li");
	  var sub = document.createElement("button");
	  sub.innerHTML = "Submit";
	  sub.onclick = (function() {
		  var name = selectedTitle;
		  return function (){
			  subUpdateSim(name);
		  }
	  })();
	  
	  li.appendChild(sub);
	  ul.appendChild(li);  
	  
	  
	  
	}

  // If not enough books are found

  if (numFound < 4) {

    for (var j = 0; j < foundArray.length; j++) {

      for (var i = (bList.length - 1); i >= 0; i--) {

        var similarBooks = bList[i].similar;

        if (similarBooks.includes(foundArray[j]) && !foundArray.includes(bList[i].title) && selectedTitle != bList[i].title) {

          numFound = numFound + 1;
          foundFlag = true;
          foundArray.push(bList[i].title);

          var li = document.createElement("li");
          var name = bList[i].title;
          var review = bList[i].review;
          var rating = bList[i].rating;
          var sum = document.createElement("button");
          sum.onclick = (function() {
            var curSum = i;
            return function() {
              displaySummary(curSum + '');
            }
          })();
          sum.setAttribute("style", "margin-top: 2%; margin-bottom: 2%;");
          sum.appendChild(document.createTextNode("Click to view summary."));

          var TN = document.createElement('p');
          TN.innerHTML = name + ": " + rating + "/5";
          TN.setAttribute("style", "margin-bottom: 0%; cursor: pointer; text-decoration: underline;");
		  TN.onclick = (function() {
		  var title = name;
		  return function (){
			  takeAmazon(title);
		  }
	  })();

          li.appendChild(TN);

          var TN = document.createElement('p');
          TN.innerHTML = review;
          TN.setAttribute("style", "margin-bottom: 0%;");

          li.appendChild(TN);
          ul.appendChild(li);

        }

        if (numFound >= 4) {
          break;
        }

      }

      if (numFound >= 4) {
        break;
      }

    }

  }



}


function displayPgUpdate(ind) {

    var bList = localStorage.getObj('books');
    var val = bList[ind].title;
    document.getElementById("pg-title").innerHTML = val;
    document.getElementById("update-pages").style.display = "block";
}

function closepgForm() {
    document.getElementById("update-pages").style.display = "none";
}

function pgSubmit() {
    closepgForm();
    var title =  document.getElementById("title-dropdown");
    var currPg = document.getElementById("curr_pg_new").value;
    var newTime = document.getElementById("time_spent_new").value;
    var fin = document.getElementById("finish_new").checked;

    var bList = localStorage.getObj('bookLib');

    for (var i = 0; i < bList.length; i++) {
        if (title == bList[i].title) {
            bList[i].pgNumber = currPg;
            var ts = parseFloat(bList[i].timeSpent) + parseFloat(newTime);
            bList[i].timeSpent = ts.toString();
        }
    }

    localStorage.setObj('bookLib', bList);
    updateBookLog();

}

function openForm() {

  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function summarySubmit() {
  closeForm()
  var sumText = document.getElementById("summary-text").value;

  localStorage.setObj('sums', sumText);
}

function submitLog() {
  var elem = document.getElementById("form-log").elements;
  var title = document.getElementById("title-dropdown").value;
  var review = document.getElementById("add-review-text").value;
  var dl = document.getElementById("rating");
  var rating = dl[dl.selectedIndex].value;

  
  var bList = localStorage.getObj('bookLib');

  for (var i = 0; i < bList.length; i++) {
		if (title == bList[i].title) {
			
			if(bList[i].review.length > 0){
				bList[i].review = bList[i].review + "<br />" + review;
			} else{
				bList[i].review = review;
			}
			
			bList[i].rating = (parseFloat(bList[i].rating) + parseFloat(rating))/ 2.0;
		}
	}

  localStorage.setObj('bookLib', bList);


  updateBookLib();
  document.getElementById("form-log").reset();
  document.getElementById("add-review-text").value = "";
  return false;

}


function makeBookForLib(title, author, rating, review, similarBooks) {

  var book = new Object();
  book.title = title;
  book.author = author;
  book.rating = rating;
  book.review = review;
  book.numReviews = 1;
  book.similar = similarBooks;
  var bList = localStorage.getObj('bookLib');
  console.log(book);
  bList.push(book);
  localStorage.setObj('bookLib', bList);
}

function makeBook(title, author, pgNumber, timeSpent, finished, summary) {
  var book = new Object();
  book.title = title;
  book.author = author;
  book.pgNumber = pgNumber;
  book.finished = finished;
  book.timeSpent = timeSpent;
  book.summary = summary;
  var bList = localStorage.getObj('books');
  bList.push(book);
  localStorage.setObj('books', bList);
}

