javascript:
$(".scavenging-row").each(function(index){
    var $dot = $(this).find(".dot:not(.dot-brown):not(.dot-blue)").first();
    
    setTimeout(($dotArg) => {
        $dotArg.trigger("click");
        
        setTimeout(() => {
            $(".scavenge-option-unlock-dialog .btn").click();
        }, 200);

    }, index * 500, $dot);
});