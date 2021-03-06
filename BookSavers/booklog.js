
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

function init() {
    var books = [];
    var badges = [];

    if (localStorage.getObj('books') === null) {
        localStorage.setObj('books', books);


        makeBook("Game of Thrones", "George R R Martin", "242", "6", true, ["test summary"], []);
        makeBook("Ender's Game", "Orson Scott Card", "242", "1.5", false, [], []);


        localStorage.setObj('sums', "");
    }

    if (localStorage.getObj('pointHist') === null) {
        localStorage.setObj('pointHist', badges);
        localStorage.setObj('user', badges);

        var usr = localStorage.getObj('username');
        var pw = localStorage.getObj('password');
        createUser(usr, 4, 0, pw);

        addPoints("Read 25 pages", 20);
        addPoints("Start a new book", 25);
        addPoints("3-day streak", 10);

    }

    if (localStorage.getObj('history') === null) {
        localStorage.setObj('history', badges);

        addPastData("Ender's Game", 2, 25, 14, 3, 2019);
        addPastData("Ender's Game", 2, 50, 13, 3, 2019);
        addPastData("Ender's Game", 2, 17, 13, 3, 2019);
        addPastData("Ender's Game", 2, 12, 11, 3, 2019);
        addPastData("Ender's Game", 2, 43, 10, 3, 2019);
        addPastData("Ender's Game", 2, 7, 9, 3, 2019);
        addPastData("Ender's Game", 2, 5, 8, 3, 2019);
        addPastData("Ender's Game", 2, 140, 8, 2, 2019);
        addPastData("Ender's Game", 2, 121, 8, 1, 2019);
        addPastData("Ender's Game", 2, 79, 8, 11, 2018);
        addPastData("Ender's Game", 2, 105, 8, 11, 2018);
        addPastData("Ender's Game", 2, 99, 8, 10, 2018);
        addPastData("Ender's Game", 2, 76, 8, 9, 2018);
        addPastData("Ender's Game", 2, 21, 8, 8, 2018);
        addPastData("Ender's Game", 2, 87, 8, 7, 2018);
        addPastData("Ender's Game", 2, 67, 8, 6, 2018);
        addPastData("Ender's Game", 2, 53, 8, 5, 2018);

    }

    var found = false;
    var user = localStorage.getObj('user');
    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");
    for (var i = 0; i < user.length; i++) {
        if (curUser == user[i].name) {
          found = true;
        }
    }
    if(!found){
      var pw = localStorage.getObj('password');
      createUser(curUser, 0, 0, pw);
    }

    updateBookLog();

}

function updateChartThisWeek() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    var label = [];
    var data = [];

    if ((dd - 6) < 1) {

        if (m == 1) {
            dd = 31 - Math.abs(dd - 7);
            mm = 12;
            yyyy = yyyy - 1;
        } else if (m == 2) {
            dd = 28 - Math.abs(dd - 7);
            mm = mm - 1;
        } else if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
            dd = 30 - Math.abs(dd - 7);
            mm = mm - 1;
        } else {
            dd = 31 - Math.abs(dd - 7);
            mm = mm - 1;
        }

    } else {
        dd = dd - 6;
    }

    for (var i = 0; i < 7; i++) {

        label.push(mm + '/' + dd + '/' + yyyy);
        data.push(numPagesForDay(dd, mm, yyyy));

        dd = dd + 1;
        if ((dd == 29 && mm == 2) || (dd == 31 && (mm == 4 || mm == 6 || mm == 9 || mm == 11)) || dd == 32) {
            dd = 1;
            mm = mm + 1;
            if (mm = 13) {
                mm = 1;
                yyyy = yyyy + 1;
            }
        }

    }

    var chart = document.getElementById("bookPlot").getContext('2d');

    Chart.defaults.global.defaultFontColor = 'black';

    let barChart = new Chart(chart, {
        type: 'bar', //bar, line
        data: {
            labels: label,
            datasets: [{
                label: 'Pages',
                data: data,
                backgroundColor: '#C4DBF6'

            }],
        },
        options: {
            title: {
                display: true,
                text: 'Pages Read This Week',
                fontSize: 20
            },
            legend: {
                display: false,
                position: 'right'
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true // minimum value will be 0.
                    }
                }]
            }


        }
    });

}

function updateChartThisMonth() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    var label = [];
    var data = [];

    mm = mm + 1;

    if (mm == 13) {
        mm = 1;
    } else {
        yyyy = yyyy - 1;
    }




    for (var i = 0; i < 12; i++) {

        label.push(mm + '/' + yyyy);
        data.push(numPagesForMonth(mm, yyyy));

        mm = mm + 1;

        if (mm == 13) {
            mm = 1;
            yyyy = yyyy + 1;
        }

    }

    var chart = document.getElementById("bookPlot").getContext('2d');

    Chart.defaults.global.defaultFontColor = 'black';

    let barChart = new Chart(chart, {
        type: 'line', //bar, line
        data: {
            labels: label,
            datasets: [{
                label: 'Pages',
                data: data,
                backgroundColor: '#C4DBF6'

            }],
        },
        options: {
            title: {
                display: true,
                text: 'Pages Read This Year',
                fontSize: 20
            },
            legend: {
                display: false,
                position: 'right'
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true // minimum value will be 0.
                    }
                }]
            }


        }
    });

}

function updateBookLog() {

    var ul = document.getElementById("bookLogList");

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    var bList = localStorage.getObj('books');
    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");

    for (var i = (bList.length - 1); i >= 0; i--) {

        if (curUser == bList[i].user) {
        found = true;

        var li = document.createElement("li");
        var name = bList[i].title;

        var status = bList[i].pgNumber;
        var time = bList[i].timeSpent;
        var sumtext = bList[i].summary;
        var sum = document.createElement("button");
        sum.onclick = (function() {
            var curSum = i;
            return function() {
                displaySummary(curSum + '');
            }
        })();
        sum.setAttribute("style", "margin-top: 2%; margin-bottom: 2%;");
        sum.appendChild(document.createTextNode("Click to view summary."));
        if (bList[i].finished) {
            status = "Done"
        } else {
            status = "Page " + status;
        }
        var TN = document.createElement('p');
        TN.innerHTML = name + ": " + status + ", " + time + " hours";
        TN.setAttribute("style", "margin-bottom: 0%; text-decoration: underline; cursor: pointer;");
        TN.onclick = (function() {
            var curInd = i;
            return function() {
                displayPgUpdate(curInd + '');
            }
        })();

        li.appendChild(TN);
        li.appendChild(sum);
        ul.appendChild(li);

      }
      }



    updateChartThisMonth();
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
    var title = document.getElementById("pg-title").innerHTML;
    var currPg = document.getElementById("curr_pg_new").value;
    var newTime = document.getElementById("time_spent_new").value;
    var fin = document.getElementById("finish_new").checked;
    var rev = document.getElementById("add-review-text2").value;
    var sums = localStorage.getObj('sums')

    var bList = localStorage.getObj('books');
    var newPages = 0;

    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");

    for (var i = 0; i < bList.length; i++) {
        if (title == bList[i].title) {
            if(curUser == bList[i].user){
            newPages = currPg - bList[i].pgNumber;
            bList[i].pgNumber = currPg;
            var ts = parseFloat(bList[i].timeSpent) + parseFloat(newTime);
            bList[i].timeSpent = ts.toString();
            bList[i].finished = fin;

            bList[i].summary.push(sums);
            var revs = bList[i].review;
            revs.push(rev);
            bList[i].review = revs;
            updateReviewLib(bList[i].title, rev);
          }
        }
    }

    if (sums.length > 0) {
        var msg = "Added a summary";
        addPoints(msg, 5);
        msg = msg + " +5"
        popupReward(msg);
    }

    var msg = "Read " + newPages + " pages";
    addPoints(msg, 20);
    addData(title, newPages, ts);
    msg = msg + " +20"
    popupReward(msg);

    localStorage.setObj('books', bList);
    updateBookLog();
    localStorage.setObj('sums', "");
    document.getElementById("reviewbox2").style.display = "none";
}

function displaySummary(ind) {
    var bList = localStorage.getObj('books');
    var val = bList[ind].summary;
    var sums = "";
    if (val.length == 0) {
        sums = "No summary listed";
    } else if (emptyStrings(val)) {
        sums = "No summary listed";
    } else {
        for (var i = 0; i < val.length; i++) {
            sums += val[i];
            sums += "</br>";
        }
    }
    document.getElementById("sumdisplay-text").innerHTML = sums;
    document.getElementById("sum-display").style.display = "block";
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeSummary() {
    document.getElementById("sum-display").style.display = "none";
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
        if (element.name == "title" || element.name == "author" || element.name == "curr_pg" || element.name == "time_spent" || element.name == "review") {
            logForm.push(element.value);
        } else if (element.name == "finished") {
            logForm.push(element.checked);
        }

    }

    var sums = localStorage.getObj('sums')
    logForm.push(sums)
    var existsFlag = false;
    var bList = localStorage.getObj('books');

    var newPages = 0;

    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");

    for (var i = 0; i < bList.length; i++) {
        if (logForm[0] == bList[i].title) {
          if(curUser == bList[i].user){
            if (logForm[2].length > 0) {
                newPages = logForm[2] - bList[i].pgNumber;
                bList[i].pgNumber = logForm[2];
            }
            if (logForm[3].length > 0) {
                var ts = parseFloat(bList[i].timeSpent) + parseFloat(logForm[3])
                bList[i].timeSpent = ts.toString();
            }

            bList[i].finished = logForm[4];

            bList[i].summary.push(logForm[6]);
            bList[i].review.push(logForm[5]);
            updateReviewLib(logForm[0], logForm[5]);

            existsFlag = true;
          }
        }
    }

    localStorage.setObj('books', bList);

    var sumArr = [];
    sumArr.push(logForm[6]);
    if (!existsFlag) {

        makeBook(logForm[0], logForm[1], logForm[2], logForm[3], logForm[4], sumArr, [logForm[5]]);
        updateReviewLib(logForm[0], logForm[5]);

        newPages = logForm[2];

        var msg = "Started new book";
        addPoints(msg, 25);
        msg = msg + " +25"
        popupReward(msg);


    }

    if (logForm[5].length > 0) {
        var msg = "Added a summary";
        addPoints(msg, 5);
        msg = msg + " +5"
        popupReward(msg);
    }


    var msg = "Read " + newPages + " pages";
    addPoints(msg, 20);
    addData(logForm[0], newPages, logForm[3]);
    msg = msg + " +20"
    popupReward(msg);

    updateBookLog();
    document.getElementById("form-log").reset();
    document.getElementById("summary-text").value = "";
    document.getElementById("reviewbox").style.display = "none";
    localStorage.setObj('sums', "");
    document.getElementById("pg-error").innerHTML = "";
    document.getElementById("time-error").innerHTML = "";
    return false;

}

function makeBook(title, author, pgNumber, timeSpent, finished, summary, review) {
    var book = new Object();

    var username = localStorage.getItem('username');
    book.user = username.replace(/"/g,"");
    book.title = title;
    book.author = author;
    book.pgNumber = pgNumber;
    book.finished = finished;
    book.timeSpent = timeSpent;
    book.summary = summary;
    book.review = review;
    var bList = localStorage.getObj('books');
    bList.push(book);
    localStorage.setObj('books', bList);
}

function makeBadge(name, points, descrip, progress) {
    var badge = new Object();
    badge.name = name;
    badge.points = points;
    badge.descrip = descrip;
    badge.progress = progress;

    var badges = localStorage.getObj('badges');
    badges.push(badge);
    localStorage.setObj('badges', badges);
}

function addPoints(name, points) {
    var point = new Object();
    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");
    var username = localStorage.getItem('username');
    point.name = name;
    point.points = points;
    point.user = username.replace(/"/g,"");;

    var pList = localStorage.getObj('pointHist');
    pList.push(point);
    localStorage.setObj('pointHist', pList);

    var user = localStorage.getObj('user');

      for (var i = 0; i < user.length; i++) {
          if (curUser == user[i].name) {
            user[i].points = user[i].points + points;
            if (user[i].points >= 100) {
                user[i].points = user[i].points - 100;
                user[i].lvl = user[i].lvl + 1;
                popupReward("LEVEL UP");
            }
          }
      }


    localStorage.setObj('user', user);
}

function addPastData(book, time, pages, day, month, year) {
    var dataPoint = new Object();
    var username = localStorage.getItem('username');
    username = username.replace(/"/g,"");
    dataPoint.user = username.replace(/"/g,"");
    dataPoint.book = book;
    dataPoint.time = time;
    dataPoint.pages = pages;
    dataPoint.day = day;
    dataPoint.month = month;
    dataPoint.year = year;

    var dataList = localStorage.getObj('history');
    dataList.push(dataPoint);
    localStorage.setObj('history', dataList);

}

function addData(book, time, pages) {
    var dataPoint = new Object();
    var username = localStorage.getItem('username');
    dataPoint.user = username.replace(/"/g,"");
    dataPoint.book = book;
    dataPoint.time = time;
    dataPoint.pages = pages;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    dataPoint.day = dd;
    dataPoint.week = mm;
    dataPoint.year = yyyy;

    var dataList = localStorage.getObj('history');
    dataList.push(dataPoint);
    localStorage.setObj('history', dataList);

}

function createUser(name, lvl, points, pw) {
    var user = new Object();
    user.name = name;
    user.lvl = lvl;
    user.points = points;
    user.pw = pw;

    var userList = localStorage.getObj('user');
    userList.push(user);
    localStorage.setObj('user', userList);
}

function popupReward(msg) {
    var popupList = document.getElementById("popupList");
    var popup = document.createElement("span");
    popup.setAttribute("class", "popuptext");
    popup.innerHTML = msg;
    popup.classList.toggle("show");
    popup.onclick = (function() {
        var popupElement = popup;
        return function() {
            popupElement.parentNode.removeChild(popupElement);
        }
    })();
    popupList.appendChild(popup);

}

function numPagesForDay(day, month, year) {

    var dataList = localStorage.getObj('history');
    var pages = 0;

    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");
    for (var i = 0; i < dataList.length; i++) {
          if (curUser == dataList[i].user) {
            if (dataList[i].day == day && dataList[i].month == month && dataList[i].year == year) {
			           var pg = dataList[i].pages;
                 pages = pages + pg;
               }
           }
    }


    return pages;
}

function numPagesForMonth(month, year) {

    var dataList = localStorage.getObj('history');
    var pages = 0;

    var curUser = localStorage.getItem('username');
    curUser = curUser.replace(/"/g,"");

    for (var i = 0; i < dataList.length; i++) {
      if (curUser == dataList[i].user) {
        if (dataList[i].month == month && dataList[i].year == year) {
            pages = pages + dataList[i].pages;
        }
      }
    }

    return pages;

}


function signout() {
    localStorage.clear();
    window.open("login.html", "_top");

}

function displayReview() {
    console.log("changed");
    var cb = document.getElementById("checkbox").checked;

    if (cb) {
        document.getElementById("reviewbox").style.display = "block";
    } else {
        document.getElementById("reviewbox").style.display = "none";
    }
}


function displayReview2() {
    console.log("changed");
    var cb = document.getElementById("finish_new").checked;

    if (cb) {
        document.getElementById("reviewbox2").style.display = "block";
    } else {
        document.getElementById("reviewbox2").style.display = "none";
    }
}

function updateReviewLib(title, review) {
    var bLib = localStorage.getObj('bookLib');

    for (var i = 0; i < bLib.length; i++) {
        if (bLib[i].title == title) {
            bLib[i].review = bLib[i].review + "</br>" + review;
        }
    }

    localStorage.setObj("bookLib", bLib);
}

function validatePg() {
    var pg = document.getElementById("curr_pg").value;
    var num = parseInt(pg);
    if (isNaN(num)) {
        var errBox = document.getElementById("pg-error");
        errBox.innerHTML = " Please only enter numbers";
    } else {
        document.getElementById("pg-error").innerHTML = "";
    }

}

function validateTime() {
    var pg = document.getElementById("time_spent").value;
    var num = parseInt(pg);
    if (isNaN(num)) {
        var errBox = document.getElementById("time-error");
        errBox.innerHTML = " Please only enter numbers";
    } else {
        document.getElementById("time-error").innerHTML = "";
    }

}

function validatePg2() {
    var pg = document.getElementById("curr_pg_new").value;
    var num = parseInt(pg);
    console.log("here");
    if (isNaN(num)) {
        var errBox = document.getElementById("pg_error2");
        errBox.innerHTML = " Please only enter numbers";
    } else {
        document.getElementById("pg_error2").innerHTML = "";
    }

}

function validateTime2() {
    var pg = document.getElementById("time_spent_new").value;
    var num = parseInt(pg);
    if (isNaN(num)) {
        var errBox = document.getElementById("time_error2");
        errBox.innerHTML = " Please only enter numbers";
    } else {
        document.getElementById("time_error2").innerHTML = "";
    }

}

function emptyStrings(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != "") {
            return false;
        }
    }
    return true;
}
