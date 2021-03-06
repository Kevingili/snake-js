window.onload = function () {
    show_score();
    _template();

    canv = document.querySelector("#gc");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    //var interval = setInterval(game,1000/10);
};
    
    //player position
    px = py = 10;

    //grid size
    gs = tc = 20;

    //apple (le truc à manger)
    ax = ay = 15;

    //velocity
    xv = yv = 0;

    //dernière position de la pomme
    trail = [];

    //taille du serpent
    tail = 5;

    //score (logique)
    score = 0;

    //vitesse qui augmente progressivement
    var counter = 300;

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

        //Gestion du canvas
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

        //Retire l'emplacement de l'ancienne pomme du tableau
        while (trail.length > tail) {
            trail.shift();
        }


        //Quand on mange du pomme
        if (ax == px && ay == py) {
            tail++;

            score++;
            counter -= 100 / score;
            var score_span = document.querySelector('#score');
            score_span.innerHTML = score;

            //On positionne une pomme aléaroirement sur le terrain
            ax = Math.floor(Math.random() * tc);
            ay = Math.floor(Math.random() * tc);
        }

        ctx.fillStyle = "red";
        ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
    }

    //Déplacement
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

    //Ajout du score
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
    //Voir l'historique des scores
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