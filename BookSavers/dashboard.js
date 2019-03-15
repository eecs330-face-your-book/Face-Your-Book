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

    if (localStorage.getObj('bookLib') === null) {
        localStorage.setObj('bookLib', books);

        var similarB = [];

        makeBookForLib("Game of Thrones", "George R R Martin", "4", "Love it", ["Name of the Wind", "Harry Potter", "Lord of the Rings"]);
        makeBookForLib("Ender's Game", "Orson Scott Card", "5", "Best book ever", ["Ender's Shadow", "Ender in Exile"]);
        makeBookForLib("Harry Potter", "J K Rowling", "4", "!!!!!!", ["Game of Thrones", "Lord of the Rings", "Name of the Wind", "Cursed Child"]);
        makeBookForLib("Cursed Child", "J K Rowling", "3", "Intersting delve into the Harry Potter mythos", ["Harry Potter"]);
        makeBookForLib("Lord of the Rings", "Tolkien", "5", "B35T B00K 3VR", ["Game of Thrones", "Name of the Wind"]);
        makeBookForLib("Name of the Wind", "Patrick Rothfuss", "5", "One of the greatest fantasy novels ever", ["Lord of the Rings", "Game of Thrones"]);
        makeBookForLib("Ender's Shadow", "Orson Scott Card", "4", "Great if you love Ender's Game", ["Ender's Game", "Ender's Shadow", "So Long, and Thanks For All the Fish"]);
        makeBookForLib("Ender in Exile", "Orson Scott Card", "3", "Wonderful sequel, must read Ender's Game first", ["Ender's Game", "Ender's Shadow"]);
        makeBookForLib("Notorious RBG", "RBG", "5", "Wonderful read", ["Bossypants"]);
        makeBookForLib("Bossypants", "Tina Fey", "10", "Both witty and insightful", ["Notorious RBG"]);
        makeBookForLib("The Resturant at the End of the Universe", "Douglas Adams", "4.2", "Intersting book, acts mostly as a bridge bettween the prequel and sequel", ["Ender's Game", "So Long, and Thanks For All the Fish"]);
        makeBookForLib("So Long, and Thanks For All the Fish", "Douglas Adams", "4.2", "Funny and fascinating", ["Ender's Game", "The Resturant at the End of the Universe"]);

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

    viewSummaries();
    booksForYou();

    updatePointsToGo();
    updateChartThisWeek();

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


function updatePointsToGo() {
    var user = localStorage.getObj('user')[0];
    var pointsLeft = 100 - user.points;

    var span = document.getElementById("points-to-go");
    span.innerHTML = pointsLeft;
}


function takeAmazon(title) {
    var fp = "https://www.amazon.com/s?k=";
    var end = "&i=stripbooks"
    var target = fp + title + end;
    var win = window.open(target, '_blank');
    win.focus();
}

function booksForYou() {
    var bLib = localStorage.getObj('bookLib');
    var best = bestRatedBook();
    var simList = [];

    for (var i = 0; i < bLib.length; i++) {
        if (best == bLib[i].title) {
            simList = bLib[i].similar;
        }
    }

    updateBooksForYou(simList);
}

function updateBooksForYou(simList) {
    var ul = document.getElementById('RecommendationsList');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    ul.setAttribute("style", "margin-left: 1%; list-style-type: none;");
    for (var i = 0; i < simList.length; i++) {
        if (i < 3) {
            var li = document.createElement('li');
            li.setAttribute("style", "text-decoration: underline; cursor: pointer; margin-bottom: 1%;");
            var icon = document.createElement('i');
            icon.setAttribute("class", "material-icons md-6");
            icon.innerHTML = "shopping_cart";
            li.appendChild(icon);
            var span = document.createElement('span');
            span.innerHTML = simList[i];
            li.appendChild(span);

            li.onclick = (function() {
                var title = simList[i];
                return function() {
                    takeAmazon(title);
                }
            })();
            ul.appendChild(li);

            var rr = getRatingReview(simList[i]);
            var rating = rr[0];
            var review = rr[1];

            var li2 = document.createElement('li');
            li2.setAttribute("style", "margin-bottom: 1%;");
            var ratDiv = document.createElement('div');
            ratDiv.innerHTML = rating + "/5";
            li2.appendChild(ratDiv);
            var revDiv = document.createElement('div');
            revDiv.innerHTML = review;
            li2.appendChild(revDiv);
            ul.appendChild(li2);
        }
    }
}

function getRatingReview(title) {
    var bLib = localStorage.getObj('bookLib');
    var rr = [];
    for (var i = 0; i < bLib.length; i++) {
        if (bLib[i].title == title) {
            rr.push(bLib[i].rating);
            rr.push(bLib[i].review);
            return rr;
        }
    }

}

function bestRatedBook() {
    var bList = localStorage.getObj('books');
    var bLib = localStorage.getObj('bookLib');
    var ratingList = [];

    for (var i = 0; i < bList.length; i++) {
        var title = bList[i].title;
        var rating = -1;
        for (var j = 0; j < bLib.length; j++) {
            if (title == bLib[j].title) {
                rating = bLib[j].rating;
            }
        }
        ratingList.push(rating);
    }

    var maxRating = ratingList[0]
    var maxInd = 0;
    for (var i = 1; i < ratingList.length; i++) {
        if (ratingList[i] > maxRating) {
            maxRating = ratingList[i];
            maxInd = i;
        }
    }

    return bList[maxInd].title;

}

function viewSummaries() {
    var bList = localStorage.getObj('books');
    var title = document.getElementById("title-box");
    var sumArea = document.getElementById("last-summary-text");
    var ind = bList.length - 1;
    var name = bList[ind].title;
    title.innerHTML = name;
    var val = bList[ind].summary;
    var sums = "";
    if (val.length == 0) {
        sums = "No summary listed";
    } else if (emptyStrings(val)) {
        sums = "No summary listed";
    } else {
        for (var i = 0; i < val.length; i++) {
            sums += val[i];
            sums += "\n";
        }
    }
    sumArea.innerHTML = sums;

}

function emptyStrings(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] != "") {
            return false;
        }
    }
    return true;
}

function makeBook(title, author, pgNumber, timeSpent, finished, summary, review) {
    var book = new Object();
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


function makeBookForLib(title, author, rating, review, similarBooks) {

    var book = new Object();
    book.title = title;
    book.author = author;
    book.rating = rating;
    book.review = review;
    book.numReviews = 1;
    book.similar = similarBooks;
    var bList = localStorage.getObj('bookLib');
    bList.push(book);
    localStorage.setObj('bookLib', bList);
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
    point.name = name;
    point.points = points;

    var pList = localStorage.getObj('pointHist');
    pList.push(point);
    localStorage.setObj('pointHist', pList);

    var user = localStorage.getObj('user');
    user[0].points = user[0].points + points;
    if (user[0].points >= 100) {
        user[0].points = user[0].points - 100;
        user[0].lvl = user[0].lvl + 1;
        popupReward("LEVEL UP");
    }
    localStorage.setObj('user', user);
}

function addPastData(book, time, pages, day, month, year) {
    var dataPoint = new Object();
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

function numPagesForDay(day, month, year) {

    var dataList = localStorage.getObj('history');
    var pages = 0;

	console.log(typeof(day), month, year);

    for (var i = 0; i < dataList.length; i++) {
		console.log(typeof(dataList[i].day), typeof(day), typeof(dataList[i].month), typeof(month), typeof(dataList[i].year), typeof(year));
		console.log(dataList[i].month);
        if (dataList[i].day == day && dataList[i].month == month && dataList[i].year == year) {
			var pg = dataList[i].pages;
			
            pages = pages + pg;
        }

    }

    return pages;
}

function signout() {
    localStorage.clear();
    window.open("login.html", "_top");

}


