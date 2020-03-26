//// ROLL ANIMATION (thanks to https://stackoverflow.com/a/15191130)
$.fn.animateRotate = function(angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
        $.style(e, 'transform', 'rotate(' + now + 'deg)');
            if (step) return step.apply(e, arguments);
        };

        $({deg: 0}).animate({deg: angle}, args);
    });
};

var total = 0;
var sound = false;
var rollSound = document.createElement("audio");
rollSound.src = "sounds/roll.ogg";
rollSound.load();

function toggleSound(){
    sound = !sound;
    $("#sound-toggle").css(
        "background-image",
        sound
            ? "url(img/icon-sound-on.png)"
            : "url(img/icon-sound-off.png)");
}

function playRollSound(){
    rollSound.pause();
    rollSound.fastSeek(0);
    rollSound.play();
}

function resetDieValues(){
    $(".die").each(function(){
        $(this).find(".rotatable > .die-value").first().text($(this).attr("data-type"));
    });
}

//// INITIALIZE
$(function() {
    //// GENERAL CONSTANTS
    const imgDirPath = "img/";
    const imgNamePrefix = "d";
    const imgNameSuffix = ".png";

    //// TEMPLATE ELEMENTS
    const templateDie = $("#templates > .die").first();

    //// ADD DIE FUNCTION
    const addDie = function(type) {
        let die = templateDie.clone();

        // set data attribute
        die.attr("data-type", type);

        // set image
        die.find(".rotatable > .die-image").first().css(
            "background-image",
            "url(" + imgDirPath + imgNamePrefix + type + imgNameSuffix + ")"
        );

        // set initial value text
        die.find(".rotatable > .die-value").first().text(type);

        // button functionality: SELECT
        die.click(function(e) {
            e.stopPropagation();
            die.toggleClass("active");
        });

        // button functionality: ROLL
        die.find(".die-buttons > .btn-roll").first().click(function(e) {
            // prevent click event bubbling up
            event.stopPropagation();
            //play sound
            if (sound) playRollSound();
            //reset total
            total = 0;
            $("#total").text("?").animateRotate(720, 1000, "swing");
            //reset all dice to their natural max value
            resetDieValues();
            // roll this and all active dice
            let toRoll = die.hasClass("active") ? $(".active").add(die) : die;
            toRoll.each(function(){
                let currentDie = $(this);
                currentDie.find(".rotatable > .die-value").first().text("?");
                currentDie.children(".rotatable").first().animateRotate(
                    720,
                    1000,
                    "swing",
                    function() {
                        let result = Math.floor(Math.random() * parseInt(currentDie.attr("data-type"))) + 1;
                        total += parseInt(result);
                        currentDie.find(".rotatable > .die-value").first().text(result);
                        $("#total").text(total);
                    }
                );
            });
        });

        // button functionality: REMOVE
        die.find(".die-buttons > .btn-remove").first().click(function(e) {
            // prevent click event bubbling up
            event.stopPropagation();
            die.remove();
        });

        // hide buttons
        die.children(".die-buttons").first().hide(0);
        die.mouseenter(function() {
            die.children(".die-buttons").first().show(100);
            die.children(".die-select").first().show(100);
        });
        die.mouseleave(function() {
            die.children(".die-buttons").first().hide(100);
            die.children(".die-select").first().hide(100);
        });

        // add die to table
        $("#table").append(die);
    };

    //// INIT UI

    // init stock dice
    $("#stock > .die-stock").each(function(i) {
        // index
        $(this).attr("data-index", i);
        // title
        $(this).attr(
            "title",
            "Add d" + $(this).attr("data-type") + " to the table"
        );
        // bg image
        $(this).css(
            "background-image",
            "url(" +
                imgDirPath +
                imgNamePrefix +
                $(this).attr("data-type") +
                imgNameSuffix +
                ")"
        );
        // label
        $(this).append($(this).attr("data-type"));
        // click handler
        $(this).click(function(e) {
            e.stopPropagation();
            addDie(parseInt($(this).attr("data-type")));
        });
    });

    // EVENT: deselect all dice
    $("html").click(function(e) {
        e.stopPropagation();
        $(".die").removeClass("active");
        resetDieValues();
    });

    // EVENT: toggle sound
    $("#sound-toggle").click(function(e){
        e.stopPropagation();
        toggleSound();
    });
});
