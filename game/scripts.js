//setting the page language to Hebrew by default
var pagelang = 'he';
//a function that switches the page language
var setLanguage = (language) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    //if xml got the json response
    if (this.readyState == 4 && this.status == 200) {
        //sets a variable to the json
        var myObj = JSON.parse(this.responseText);
        //if language is not hebrew its switches to Left to Right yes this is kinda weird
        if(language == 'he') {
            document.getElementById('playerOneContent').dir = 'rtl';
            document.getElementById('playerTwoContent').dir = 'rtl';
            document.getElementById('results').dir = 'rtl';
        } else {
            document.getElementById('playerOneContent').dir = 'ltr';
            document.getElementById('playerTwoContent').dir = 'ltr';
            document.getElementById('results').dir = 'ltr';
        }
        //sets the page language to the current
        pagelang = language;
        //gets all elements with the tag 'data-tag' into an array
        var dtarr = document.querySelectorAll('[data-tag]');
        //for loop for changing every element language
        for (const elem of dtarr){
            //gets element label id from the tag specified
            var label = elem.getAttribute('data-tag');
            //another array for changing all elements with the same label id
            var dtmultarr = document.querySelectorAll(`[data-tag="${label}"]`);
            for(const elems of dtmultarr){
                //finally changes the element language
                elems.innerHTML = myObj[label];
            }
        }
    }
    };
    //call get to the json by language
    xmlhttp.open("GET", `../game/language/${language}`, true);
    xmlhttp.send();
}
//money of the players
var p1money = 1000;
var p2money = 1000;
//the bank variable
var bank = 100;
//array of the random numbers
var num = [];
//checks if multiplayer mode is on
var comp = false;
//check sync for the GET method from random.org
var sync = false;
//function for getting 1 to 6 number from random.org
var setNum = () => {
    sync = false;
    $.ajax({
        "type": "GET",
        "url": "http://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new",
        "timeout": 10000,
        "async": true,
        "success": function (data, status, xhr) {
            //push the new random number into an array
            num.push(parseInt(data));
            //sets sync to true
            sync = true;
        }
    });
}
//get the first num to start with
setNum();
//a function that updates the bank sum on html
var upBank = () => {
    document.getElementById('bank').innerHTML = bank;
}
if(comp) {
    document.getElementById('playerTwoBet').readOnly = true;
    document.getElementById('playerTwoR').readOnly = true;
}
//function for displaying the plus or minus from the money values
var pom = (id, n, plus) => {
    //the plus argument is used for checking if it's plus or minus that we want to display
    if (plus) {
        //setting the span to visable and gives it the number value and color as specified
        document.getElementById(id).style.opacity = 1;
        document.getElementById(id).style.color = "lime";
        document.getElementById(id).style.display = "inline";
        document.getElementById(id).innerHTML = '+' + n;
        //for displaying the span for half a second (500 miliseconds)
        setTimeout(() => {
            //fading out the span in sequence of 10 miliseconds
            var fadeTarget = document.getElementById(id);
            var fadeEffect = setInterval(function () {
                if (!fadeTarget.style.opacity) {
                    fadeTarget.style.opacity = 1;
                }
                if (fadeTarget.style.opacity > 0) {
                    fadeTarget.style.opacity -= 0.01;
                } else {
                    clearInterval(fadeEffect);
                }
            }, 10);
            document.getElementById(id).style.display = "none";
        }, 500);
    } else {
        //setting the span to visable and gives it the number value and color as specified
        document.getElementById(id).style.opacity = 1;
        document.getElementById(id).style.color = "red";
        document.getElementById(id).style.display = "inline";
        document.getElementById(id).innerHTML = '-' + n;
        //for displaying the span for half a second (500 miliseconds)
        setTimeout(() => {
            //fading out the span in sequence of 10 miliseconds
            var fadeTarget = document.getElementById(id);
            var fadeEffect = setInterval(function () {
                if (!fadeTarget.style.opacity) {
                    fadeTarget.style.opacity = 1;
                }
                if (fadeTarget.style.opacity > 0) {
                    fadeTarget.style.opacity -= 0.01;
                } else {
                    clearInterval(fadeEffect);
                }
            }, 10);
            document.getElementById(id).style.display = "none";
        }, 500);
    }
}
//counter for the random numbers array
var i = 0;
//when the players hit start button
var start = () => {
    //function that wait for the number to reach from random.org and then runs the game turn
    (function wait() {
        //if sync is true that means if the number has reached
        if (sync) {
            //increase the counter for the num array by 1
            i++;
            //I don't know why but this is how it's works you have to call setNum unless the sync flag will never be true I don't know how it's in the if
            setNum();
            //get the results div id
            var result = document.getElementById('whowon');
            //check if someone's money all gone then display suitable text
            if (p1money <= 0 && p2money <= 0) {
                insert( result,'2plyrslos');
            } else if (p1money <= 0) {
                insert(result,'firstlos');
            } else if (p2money <= 0) {
                insert(result,'secondlos');
            } else {
                //if no one lost the game begins
                //getting bunch of elements :)
                var p1be = document.getElementById('playerOneBet');
                var p2be = document.getElementById('playerTwoBet');
                var p1r = document.getElementById('playerOneR');
                var p2r = document.getElementById('playerTwoR');
                var p1mo = document.getElementById('playerOneMoney');
                var p2mo = document.getElementById('playerTwoMoney');    
                if(comp){
                    p2be.value = Math.floor(Math.random() * 6) + 1;
                    let xo = Math.floor(Math.random() * p1money) + 1;
                    p2r.value = Math.floor(Math.random() * xo) + 1;
                }
                //setting some variables to the values of the elements above
                var p1b = p1be.value;
                var p2b = p2be.value;
                var p1g = p1r.value;
                var p2g = p2r.value;
                //if a player bet more then his money it's sets the bet to his money sum
                if (parseInt(p1b) > p1money) {
                    p1b = p1money;
                } else if (parseInt(p2b) > p2money) {
                    p2b = p2money;
                }
                //subtract the bet from the money and displays
                p1money = p1money - p1b;
                pom('plus1', p1b, false);
                p2money = p2money - p2b;
                pom('plus2', p2b, false);
                //set jet value that is the sum of both players's bets
                let jet = parseInt(p1b) + parseInt(p2b);
                //setting the default winner text to no one wins
                var datal = 'no1won';
                var p1won = false;
                var p2won = false;
                //now is checking for a winner
                if (p1g == p2g && p1g == num[i - 1]) {
                    p1won = true;
                    p2won = true;
                    //if both players wins so it's divides the bank evenly and so the jet
                    if (bank % 2 == 0 && parseInt(jet) % 2 == 0) {
                        //if bank and jet are even so it's divides by default
                        p1money = parseInt(p1money) + parseInt(jet) / 2 + bank / 2;
                        pom('plus1', parseInt(jet) / 2 + bank / 2, true);
                        p2money = parseInt(p2money) + parseInt(jet) / 2 + bank / 2;
                        pom('plus2', parseInt(jet) / 2 + bank / 2, true);
                    } else if (bank % 2 == 0 || parseInt(jet) % 2 == 0) {
                        //if the bank or the jet are not even it's give extra half to keep the numbers integers
                        p1money = parseInt(p1money) + parseInt(jet) / 2 + bank / 2 + 0.5;
                        pom('plus1', parseInt(jet) / 2 + bank / 2 + 0.5, true);
                        p2money = parseInt(p2money) + parseInt(jet) / 2 + bank / 2 + 0.5;
                        pom('plus2', parseInt(jet) / 2 + bank / 2 + 0.5, true);
                    } else {
                        //just for being sure maybe these lines are not necessary
                        p1money = parseInt(p1money) + parseInt(jet) / 2 + bank / 2;
                        pom('plus1', parseInt(jet) / 2 + bank / 2, true);
                        p2money = parseInt(p2money) + parseInt(jet) / 2 + bank / 2;
                        pom('plus2', parseInt(jet) / 2 + bank / 2, true);
                    }
                    //sets the winner text to both of the players and displays the earns
                    datal = 'bothwon';
                    pom('plusb', bank, false);
                    //we just gived the bank to the players so we should by logic to set the bank value to zero and then display
                    bank = 0;
                    upBank();
                } else if (p1g == num[i - 1]) {
                    //player one wins
                    p1won = true;
                    p1money = parseInt(p1money) + parseInt(jet) + parseInt(p1b) + bank;
                    pom('plus1', parseInt(jet) + parseInt(p1b) + bank, true);
                    pom('plusb', bank, false);
                    bank = 0;
                    upBank();
                    datal = '1won';
                } else if (p2g == num[i - 1]) {
                    //player two wins
                    p2won = true;
                    p2money = parseInt(p2money) + parseInt(jet) + parseInt(p2b) + bank;
                    pom('plus2', parseInt(jet) + parseInt(p2b) + bank, true);
                    pom('plusb', bank, false);
                    bank = 0;
                    upBank();
                    datal = '2won';
                } else {
                    //if no one won so the bank gets the jet
                    bank = bank + parseInt(jet);
                    pom('plusb', jet, true);
                    upBank();
                }
                //sets the money span of each player to the new value
                p1mo.innerHTML = p1money;
                p2mo.innerHTML = p2money;
                //sets the max of the range inputs to the amount of each player money
                p1be.max = p1money;
                p2be.max = p2money;
                //let results = `המספר היה: ${num[i-1]}, ניחושו של השחקן הראשון: ${p1g}, ניחושו של השחקן השני: ${p2g}, המנצח: ${winner}`;
                //eventully displays the results
                insertImg(p1g, 'playerOneDices',p1won);
                insertImg(p2g, 'playerTwoDices',p2won);
                insert(result ,datal);
                insertImg(num[i - 1], 'numre');
                //bank grows every turn by 100
                bank += 100;
                //the bank span is is plusb the value is 100 and its increase so it's true
                pom('plusb', 100, true);
                upBank();
            }
        } else {
            //if sync is false its wait for 10 miliseconds and then checks again
            setTimeout(wait, 10);
        }
    })();
}
//a function that insert text mainly for the results (winner text display)
var insert = (result, datas) => {
    result.dataset.tag = datas;
    //everytime that a text is inserted to the results the language resets in order to set the text by the language 
    setLanguage(pagelang);
}
//insert image to the document mainly for dice rolls to the results and so for the players to let them know which dices the rolled the previous turn
var insertImg = (srco, divId,won=null) => {
    //get the parent div id
    let div = document.getElementById(divId);
    //create div to contain the image
    let container = document.createElement("div");
    //sets the div class
    container.className = "conti";
    //creates an image
    let elem = document.createElement("img");
    //sets the image source to the desired one
    elem.src = '/game/img/dice' + srco;
    //creates a div to overlay the image if needed 
    let overlay = document.createElement("div");
    if (won) {
        //if player won the overlay set to green
        overlay.className = "green";
        div.appendChild(container);
        container.appendChild(elem);
        container.appendChild(overlay);
    } else if (won==null){
        //if it's for the results div its just add it to the container without overlay
        div.appendChild(elem);
    } else {
        //if player won the overlay set to red
        overlay.className = "red";
        div.appendChild(container);
        container.appendChild(elem);
        container.appendChild(overlay);
    }
}
//functions for updating elements values
var updateS1 = () => {
    let s1 = document.getElementById('playerOneBet').value;
    document.getElementById('s1v').innerHTML = s1;
    let s2 = document.getElementById('playerTwoBet').value;
    pom('plusb', s1, true);
    var banco = document.getElementById('bank');
    banco.innerHTML = bank + parseInt(s1) + parseInt(s2);
};
var updateS2 = () => {
    let s1 = document.getElementById('playerOneBet').value;
    let s2 = document.getElementById('playerTwoBet').value;
    document.getElementById('s2v').innerHTML = s2;
    pom('plusb', s2, true);
    var banco = document.getElementById('bank');
    banco.innerHTML = bank + parseInt(s1) + parseInt(s2);
};
var updateR1 = () => {
    var s = document.getElementById('playerOneR').value;
    let id = document.getElementById('playerOneR');
    document.getElementById('r1v').innerHTML = s;
    //set the dice slider imgaes when changes value
    id.classList.remove('dice1');
    id.classList.remove('dice2');
    id.classList.remove('dice3');
    id.classList.remove('dice4');
    id.classList.remove('dice5');
    id.classList.remove('dice6');
    switch (s) {
        case '1':
            id.classList.add('dice1');
            break;
        case '2':
            id.classList.add('dice2');
            break;
        case '3':
            id.classList.add('dice3');
            break;
        case '4':
            id.classList.add('dice4');
            break;
        case '5':
            id.classList.add('dice5');
            break;
        case '6':
            id.classList.add('dice6');
            break;
    }
};
var updateR2 = () => {
    var s = document.getElementById('playerTwoR').value;
    let id = document.getElementById('playerTwoR');
    document.getElementById('r2v').innerHTML = s;
    //set the dice slider imgaes when changes value
    id.classList.remove('dice1');
    id.classList.remove('dice2');
    id.classList.remove('dice3');
    id.classList.remove('dice4');
    id.classList.remove('dice5');
    id.classList.remove('dice6');
    switch (s) {
        case '1':
            id.classList.add('dice1');
            break;
        case '2':
            id.classList.add('dice2');
            break;
        case '3':
            id.classList.add('dice3');
            break;
        case '4':
            id.classList.add('dice4');
            break;
        case '5':
            id.classList.add('dice5');
            break;
        case '6':
            id.classList.add('dice6');
            break;
    }
};