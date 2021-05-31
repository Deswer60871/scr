setInterval(function() {
    $(".trump-unit:not(.dead)").last().click();
    $(".button-new-battle").click();
    $(".button-continue").click();
}, 500);