window.onload = function () {
    show_score();
    _template();

    canv = document.querySelector("#gc");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    //var interval = setInterval(game,1000/10);
};

    px = py = 10;
    gs = tc = 20;
    ax = ay = 15;
    xv = yv = 0;
    trail = [];
    tail = 5;
    score = 0;
    var counter = 500;
    var sec = 0;
    var t;
    var oneHour = 60 * 60 * 1000;
    var maxChrono = oneHour * 8;

    var game = function () {
        clearInterval(interval);
        interval = setInterval(game, counter);

        px += xv;
        py += yv;

        if (px < 0) {
            px = tc - 1;
        }
        if (px > tc - 1) {
            px = 0;
        }
        if (py < 0) {
            py = tc - 1;
        }
        if (py > tc - 1) {
            py = 0;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height);
        ctx.fillStyle = "lime";

        for (var i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
            if (trail[i].x == px && trail[i].y == py) {

                if (tail > 5) {
                    _addScore(score);
                    console.log("dead");
                    score = 0;
                    counter = 500;
                    var score_span = document.querySelector('#score');
                    score_span.innerHTML = score;
                }

                tail = 5;
            }
        }

        trail.push({ x: px, y: py });

        while (trail.length > tail) {
            trail.shift();
        }

        if (ax == px && ay == py) {
            tail++;

            score++;
            counter -= 100 / score;
            var score_span = document.querySelector('#score');
            score_span.innerHTML = score;

            ax = Math.floor(Math.random() * tc);
            ay = Math.floor(Math.random() * tc);
        }

        ctx.fillStyle = "red";
        ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
    }

    function keyPush(evt) {
        switch (evt.keyCode) {
            case 37:
                xv = -1;yv = 0;
                break;
            case 38:
                xv = 0;yv = -1;
                break;
            case 39:
                xv = 1;yv = 0;
                break;
            case 40:
                xv = 0;yv = 1;
                break;
        }
    }

    function _template() {
        var template = document.createElement("div");
        var h1 = document.createElement("h1");

        var element = document.querySelector('#main');

        element.appendChild(template);
    }

    function addChrono(timer, timerHidden) {
        var total = _countChrono(button);

        var currentTimer = Number(timerHidden.value);
        var totalTimeLeft = maxChrono - total;
        var timeLeft = totalTimeLeft + currentTimer;
        var maxValue =  _convertMillisecondToHour(timeLeft);

        if (total < maxChrono) {
            // Increment every second;
            timerHidden.value = parseInt(timerHidden.value) + 1000;
            timer.value = _convertMillisecondToHour(timerHidden.value);
            timer.max = maxValue;

        } else {
            var diff = total - maxChrono;
            if (diff >= 0) timerHidden.value -= diff;
            timer.value = _convertMillisecondToHour(timerHidden.value);
            timer.max = timeDefault;
            _limit(button);
        }
    }

    function _timer(timer, timerHidden) {
        t = setInterval(addChrono, 1000, timer, timerHidden);
    }

    function _countChrono(button) {
        // span
        var duration = document.querySelector("#" + dayId + " #duration");
        var durationLeft = document.querySelector("#" + dayId + " #durationLeft");

        var chrono = [];

        timerInputHidden.forEach(function(timer) {
            chrono.push(Number(timer.value));
        });

        var total = chrono.reduce(function(memo, val) {
            return memo + val;
        });

        var timeLeft = maxChrono - total;

        duration.innerHTML = "Total de temps passé : <strong>" + _convertMillisecondToHour(total) + "</strong>";
        durationLeft.innerHTML = "Total restant : <strong>" + _convertMillisecondToHour(timeLeft) + "</strong>";

        return total;
    }

    function _convertMillisecondToHour(duration) {
        // conversion time from millisecond to hour and minute
        var min = parseInt((duration / (1000 * 60)) % 60);
        var h = parseInt((duration / (1000 * 60 * 60)) % 24);

        var hours = (h < 10) ? "0" + h : h;
        var minutes = (min < 10) ? "0" + min : min;

        return hours + ":" + minutes;
    }

    function _convertHourToMillisecond(duration) {
        // conversion time from hour and minute to millisecond
        var hour = Number(duration.split(":")[0]) * oneHour;        
        var min = Number(duration.split(":")[1]) * 60 * 1000;

        return hour + min;
    }


    function _addScore(score) {

        var login = prompt("Quel est votre pseudo ?");

        if (localStorage.getItem('scores') === null) {
            var scores = [];
            scores[0] = { 'login': login, 'score': score };
            localStorage.setItem("scores", JSON.stringify(scores));
        } else {
            scores = JSON.parse(localStorage.getItem("scores"));
            scores[scores.length] = { 'login': login, 'score': score };
            localStorage.setItem("scores", JSON.stringify(scores));
        }

        show_score();
    }

    function show_score() {
        document.querySelector('#scores').innerHTML = "";

        if (localStorage.getItem('scores') !== null) {

            var sorted_score = JSON.parse(localStorage.getItem("scores")).sort((a, b) => a.score > b.score ? -1 : 1);

            if (localStorage.getItem('scores') !== null) {
                sorted_score.forEach(function (score) {

                    var p = document.createElement('p');
                    p.innerHTML = score.login + ' : ' + score.score;

                    document.querySelector('#scores').appendChild(p);
                });
            }
        }
    }

var interval = setInterval(game, counter);