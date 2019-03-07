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
        similarB.push("Ender's Game");

        makeBookForLib("Game of Thrones", "George R R Martin", "4", "Love it", ["Game of Thrones", "Ender's Game"]);
        similarB.push("Game of Thrones");

        makeBookForLib("Ender's Game", "Orson Scott Card", "5", "Best book ever", ["Game of Thrones"]);
        makeBookForLib("Harry Potter", "J K Rowling", "3", " Meh", ["Game of Thrones"]);

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
		dd.appendChild(o)
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

function updateBookLib() {

    var ul = document.getElementById("RecommendationsList");

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var bList = localStorage.getObj('bookLib');

    var selector = document.getElementById('reviewDropdown');
    var selectedTitle = selector[selector.selectedIndex].value;

    for (var i = (bList.length - 1); i >= 0; i--) {

        var similarBs = bList[i].similar;
        console.log(similarBs);

        if (similarBs.includes(selectedTitle)) {

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
            TN.setAttribute("style", "margin-bottom: 0%; cursor: pointer;");


            li.appendChild(TN);

            var TN = document.createElement('p');
            TN.innerHTML = review;
            TN.setAttribute("style", "margin-bottom: 0%; cursor: pointer;");

            li.appendChild(TN);
            ul.appendChild(li);

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
    var logForm = [];
    for (var i = 0, element; element = elem[i++];) {
        if (element.name == "title" || element.name == "author" || element.name == "curr_pg" || element.name == "time_spent") {
            logForm.push(element.value);
        } else if (element.name == "finished") {
            logForm.push(element.checked);
        }

    }

    var sums = localStorage.getObj('sums')
    logForm.push(sums)
    var existsFlag = false;
    var bList = localStorage.getObj('books');

    for (var i = 0; i < bList.length; i++) {
        if (logForm[0] == bList[i].title) {
            if (logForm[2].length > 0) {
                bList[i].pgNumber = logForm[2];
            }
            if (logForm[3].length > 0) {
                var ts = parseFloat(bList[i].timeSpent) + parseFloat(logForm[3])
                bList[i].timeSpent = ts.toString();
            }
            bList[i].finished = logForm[4];
            if (bList[i].summary.length > 0) {
                bList[i].summary = bList[i].summary + "<br />" + logForm[5];
            } else {
                bList[i].summary = logForm[5];
            }
            existsFlag = true;
        }
    }

    localStorage.setObj('books', bList);

    if (!existsFlag) {
        makeBook(logForm[0], logForm[1], logForm[2], logForm[3], logForm[4], logForm[5]);
    }

    updateBookLog();
    document.getElementById("form-log").reset();
    document.getElementById("summary-text").value = "";
    localStorage.setObj('sums', "");
    return false;

}


function makeBookForLib(title, author, rating, review, similarBooks) {
    var book = new Object();
    book.title = title;
    book.author = author;
    book.rating = rating;
    book.review = review;
    book.similar = similarBooks;
    var bList = localStorage.getObj('bookLib');
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