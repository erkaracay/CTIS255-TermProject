/* 
Problems: 
o Could not assign the new random values to the initial variables so sometimes 
  the new black cell overlaps with an already existing black cell.
o Could not check if the 10 second timer ended anywhere else but the initial
  timer function so all the ending animations are in the decTime function.   
*/
$(function() {
    // Separate Bar Timer
    var barTimer;
    var wid = 0;
    barTimer = setInterval(() => {
        wid += 5;
        $("#bar").css({"width": wid});
    }, 16);

    // Using persistent storage to store high score
    if (!(localStorage.getItem("hiScore") > 0)) {
        localStorage.setItem("hiScore", 0);
    }
    var score = parseInt($("#score").text());
    var hiScore = parseInt(localStorage.getItem("hiScore"));
    $("#hiScore").text(hiScore);

    // Opening countdown
    var timer = setInterval(decCounter, 1000);
    function decCounter() {
        let counter = parseInt($("#counter").text()) ;
        counter--;
        $("#counter").text(counter)
        
        if (counter === 0) {
            clearInterval(timer);
            $("#countdown").fadeOut(500);
            $(".bigContainer").delay(500).fadeIn(500);
            $("#startmsg").delay(1000).fadeOut(600);
        }
    }
    
    // 10 second counter
    var timer2 = setInterval(decTime, 1000);
    function decTime() {
        let time = parseInt($("#timer").text());
        $("#timer").text(--time);

        if (time === 0) {
            clearInterval(timer2);
            // (Could not do these anywhere else in the script)
            // Unbinding and emptying the cells. 
            $("tr").children().off();
            $("tr").children().animate({backgroundColor: "#FFF"});

            // High score case.
            var score = parseInt($("#score").text());
            var hiScore = parseInt($("#hiScore").text());
            if(score > hiScore) {
                $("#hsmsg").fadeIn(500);
                $.confetti.start();
                setTimeout(() => {
                $.confetti.stop();
                }, 3000)
            } else { // No high score case.
                $("#endmsg").fadeIn(500);
            }

            // Play again animation
            $("#playAgain").fadeIn(1000);

            // Updating High score
            if (score > hiScore) {
                hiScore = score;
                localStorage.setItem("hiScore", hiScore);
            }
        }
    }

    // Random generation of cells
    var n = Math.floor(Math.random() * 16);
    var m, k;
    do {
        m = Math.floor(Math.random() * 16); 
    } while (m === n);
    do { 
        k = Math.floor(Math.random() * 16);
    } while (k === n || k === m);

    function setCell() { // Function to assign new active cell
        let rand;
        do { 
            rand = Math.floor(Math.random() * 16);
        } while ($("td").eq(rand).hasClass("black"));
        
        $(this).css("background", "#AFA").animate({backgroundColor: "#FFF"}, 300).removeClass("black");
        $(this).off();
        
        $("td").eq(rand).animate({backgroundColor: "#000"});
        $("td").eq(rand).click(setCell).click(updateScore).addClass("black");
    }
    
    function updateScore() { // Function to update score
        let point;
        if (score === 0) {
            point = 10;
        } else {
            point = 10 - Math.floor(parseInt($("#bar").css("width")) / 30);
        }
        $(this).html(`<p class='points'>+${point}</p>`);
        $(".points").fadeOut(600);
        score = score + point;
        $("#score").text(score);
        wid = 0;
    }
    
    $("td").eq(n).css("background", "black").click(setCell).click(updateScore).addClass("black");
    $("td").eq(m).css("background", "black").click(setCell).click(updateScore).addClass("black");
    $("td").eq(k).css("background", "black").click(setCell).click(updateScore).addClass("black");
    
})