// research
TribalWars.post("smith", {ajaxaction: "research"}, {tech_id: "spy", source: game_data.village.id});

// train
TribalWars.post("train", {ajaxaction: "train", mode: "train"}, {
    units: {
        axe: 50
    }
});

// build
TribalWars.post("main", {ajaxaction: "upgrade_building", type: "main"}, {
    id: "storage", // building
    force: 1, // ??
    destroy: 0,
    source: game_data.village.id
});

// get outgoing command ids
TribalWars.post("place", {ajax: "commands"}, {
    type: "outgoing",
    village_id: game_data.village.id
}, (response) => {
    var ids = [];
    $(response).find(".quickedit-out").each((i, el) => {
        ids.push(el.data("id"));
    });
    console.log(ids);
});

// command
var data =  {
    x: 518,
    y: 494,
    source_village: game_data.village.id,
    axe: 50, // troops
    // building: "main", // catapult target
    // train: [ // noble train
    //     {
    //         axe: 50
    //         // ...
    //     }
    // ],
    // support: 1,
    attack: 1
};
TribalWars.post("place", {ajax: "confirm"}, data, (response) => {
    data["ch"] = $(response.dialog).find("input[name='ch']").val();
    TribalWars.post("place", {ajaxaction: "popup_command"}, data, (response) => console.log(response));
});

// all my village ids
$.get("game.php", {screen:"overview_villages", mode: "combined"}, (response) => {
	$(response).find(".quickedit-vn").each((i, el) => console.log($(el).data("id")))
});

// notifications
Connection.registerHandler("building_complete", (data) => console.log(data));
Connection.registerHandler("attack", (data) => console.log(data));
Connection.registerHandler("report", (data) => console.log(data));
Connection.registerHandler("mail", (data) => console.log(data));
Connection.registerHandler("village_gained", (data) => console.log(data));

// captcha
$(".g-recaptcha").is(":visible")
// {"response":false,"bot_protect":"forced_dialog"}

// intercept response error
var old  = TribalWars.handleResponse;
TribalWars.handleResponse = function(a, e, t) {
	if (a.error) console.error(a.error);
	old(a, e, t);
};