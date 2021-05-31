javascript:

//game objects used:
//- game_data
//- TWMap
//- getTimeString()
//- content_value

//TODO: add more languages
var languages = {
    en: {
        scriptName: "MapAttacker by Darxeal (last updated 01.08.2019)",
        clickOnMap: "(click on map)",
        source: "Source",
        target: "Target",
        commands: "Commands",
        arrival: "Arrival",
        departure: "Departure",
        departsIn: "Departs in",
        duration: "Duration",
        units: "Units",
        notFound: "Not found",
        sent: "Sent",
        error: "Error",
        runOnlyOnMapScreen: "Run the script only on the map screen.",
        today: "today",
        tomorrow: "tomorrow",
        notEnoughUnits: "Not enough units available.",
        catapultTarget: "Catapult target",
        attack: "Attack",
        support: "Support",
        expectedTimings: "Expected timings"

    },
    cz: {
        scriptName: "MapAttacker by Darxeal (poslední update 01.08.2019)",
        clickOnMap: "(klikni na mapu)",
        source: "Původ",
        target: "Cíl",
        commands: "Příkazy",
        arrival: "Dopad",
        departure: "Odchod",
        departsIn: "Odejde za",
        duration: "Trvání",
        units: "Jednotky",
        notFound: "Nenalezeno",
        sent: "Posláno",
        error: "Chyba",
        runOnlyOnMapScreen: "Skript pusť v okně mapy.",
        today: "dnes",
        tomorrow: "zítra",
        notEnoughUnits: "Nedostatek jednotek.",
        catapultTarget: "Cíl katapultu",
        attack: "Útok",
        support: "Podpora",
        expectedTimings: "Očekávané časy"
    }
}

// choose language
var language;
if (languages.hasOwnProperty(game_data.market))
    language = languages[game_data.market];
else
    language = languages["en"];

UNIT_ASSET_URL = "https://dscs.innogamescdn.com/asset/233cdec1/graphic/unit/unit_";
DELETE_BUTTON_URL = "https://dscs.innogamescdn.com/asset/233cdec1/graphic/delete.png";
COMMAND_ICON_URL = "https://dscs.innogamescdn.com/asset/233cdec1/graphic/command/";

// zeropad(5, 3) -> '005'
function zeropad(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function loadUI() {

    // remove everything except maps
    // $("#map_topo>*:nth-child(n+2)").remove();
    $("#map_legend").remove();

    var html = `
	<table class='vis'>
    <tr>
        <th colspan='4'>${language.scriptName}</th>
    </tr>
    <tr>
        <td>
            <table>
                <tr>
                    <td>${language.source}:</td>
                    <td>
                        <input type='text' id='source' style="width:42px;"> <span id="a_source">${language.clickOnMap}</span>
                    </td>
                </tr>
                <tr>
                    <td>${language.target}:</td>
                    <td><input type='text' id='target' style="width:42px;"> <span id="a_target">${language.clickOnMap}</span>
                    </td>
                </tr>
                <tr>
                    <td><select size="1" id="o_send" style='width:40px'>
                            <option>${language.arrival}</option>
                            <option>${language.departure}</option>
                        </select></td>
                    <td><input type='datetime-local' id='timepicker' style="width:190px;"></td>
                </tr>
            </table>
        </td>
        <td>
            <table id="unit_table">
                <tr>`;

    var unitHeaders = "";
    for (i = 0; i < units.length; i++) {
        unitHeaders += `<th><img src='${UNIT_ASSET_URL + units[i]}.png'></th>`;
    }
    html += unitHeaders;

    html += "<tr>";
    for (i = 0; i < units.length; i++) {
        html += "<td><input type='number' style='width:40px' id='v_" + units[i] + "'></td>";
    }

    html += "</tr><tr>";
    for (i = 0; i < units.length; i++) {
        html += "<td><input type='checkbox' id='c_" + units[i] + "'></td>";
    }

    html += `
				</tr>
            </table>
            <div>
                <button class="btn btn-img" id="train_btn">
                    <img src="${UNIT_ASSET_URL}snob.png" title="" alt="" class="">
                    Přidat útok se šlechticem
                </button>
            </div>
		</td>
		<td>
			<table>
				<tr>
					<th><img src='${UNIT_ASSET_URL}catapult.png'>${language.catapultTarget}</th>
				</tr>
				<tr>
                    <td>
                        <select size="1" id="c_catapult_target" style='width:50px'></select>
                    </td>
				</tr>
				<tr>
					<td><input id='add_u' type='button' value='${language.attack}' onclick='addAttack(false)'
                            class='attack btn btn-attack btn-target-action'></td>
                </tr>
                <tr>
					<td><input id='add_p' type='button' value='${language.support}' onclick='addAttack(true)'
							class='support btn btn-support btn-target-action'></td>
				</tr>
			</table>
        </td>
        <td>
            <table>
                <tr><th colspan="2">${language.expectedTimings}</th></tr>
                <tr><td><b>${language.duration }</b></td> <td id="preview-duration"></td></tr>
                <tr><td><b>${language.departure}</b></td> <td id="preview-departure"></td></tr>
                <tr><td><b>${language.arrival  }</b></td> <td id="preview-arrival"></td></tr>
                <tr><td><b>${language.departsIn}</b></td> <td id="preview-countdown"></td></tr>
            </table>
        </td>
		</tr>
	</table>`;

    content_value.children[0].outerHTML = html;
    
    // catapult target options
    for(var building in game_data.village.buildings)
        c_catapult_target.innerHTML += `<option value='${building}'>${building}</option>`;

    $("#train_btn").hide();
    $("#train_btn").click(addTrainRow);
    $("#v_snob").change(function(){
        if ($("#v_snob").val() > 0)
            $("#train_btn").show();
            else
            $("#train_btn").hide();
    });

    timepicker.valueAsNumber = Timing.getCurrentServerTime() - timezoneDifference;
    $("#content_value").append(`

	<table id='attacks_table' class='vis'>
		<tr>
			<th colspan='3'>${language.commands}</th>
			${unitHeaders}
			<th>${language.duration}</th>
			<th>${language.departure}</th>
			<th>${language.arrival}</th>
			<th colspan='2'>${language.departsIn}</th>
		</tr>
    </table>`
    );

    //start interval that updates command list timers
    setInterval(function () {
        for (i = 0; i < attacks.length; i++) if (attacks[i].countdownSeconds > 0) {
            attacks[i].countdownSeconds--;
            $("#a" + i).html(getTimeString(attacks[i].countdownSeconds));
        }
    }, 1000);

    //bind attack and support keys
    $(document).keypress(function (event) {
        if (String.fromCharCode(event.which) == "u") addAttack(false);
        if (String.fromCharCode(event.which) == "p") addAttack(true);
    });

    //overload the map onClick event
    TWMap.mapHandler.onClick = function (x, y) {
        var clickedVillage = TWMap.villages[x + "" + y];
        var isVillageOwnedByMe = clickedVillage.owner == game_data.player.id;
        updateSelectedVillage(x + "" + y, !isVillageOwnedByMe, false);
        return false;
    };

    //allow the user to paste in coordinates
    //TODO: improve
    $('#source').change(function () {
        x = source.value.split("|")[0];
        y = source.value.split("|")[1];
        updateSelectedVillage(x + "" + y, false);
    });
    $('#target').change(function () {
        x = target.value.split("|")[0],
            y = target.value.split("|")[1];
        updateSelectedVillage(x + "" + y, true);
    });

    //add our own canvas to the map
    //TODO: explain details
    map_whole.children[0].children[0].children[0].outerHTML +=
        "<canvas id='canvas_el' style='position: absolute; margin-left: 17px; z-index: 99; pointer-events: none;'></canvas>";

    canvas_el.width = map.offsetWidth;
    canvas_el.height = map.offsetHeight;

    //TODO: https://stackoverflow.com/a/42335949
    TWMap.mapHandler.onMovePixel = function (e, a) { this.busy || TWMap.positionMinimap(), TWMap.minimap_only || (e -= TWMap.map.bias, a -= TWMap.map.bias, TWMap.map_el_coordy.style.top = -a + "px", TWMap.map_el_coordx.style.left = -e + "px", TWMap.context.hide(), TWMap.home.updateDisplay(), redrawCanvas()) };
    TWMap.mapHandler.onResize = function (e, a) { TWMap.scaleMinimap(), canvas_el.width = e, canvas_el.height = a, TWMap.size = TWMap.map.coordByPixel(e, a, !1), TWMap.isDragResizing || TWMap.notifyMapSize(TWMap.isAutoSize) };
}

function addTrainRow() {


    if ($(".train_row").length == 0) {
        
        var randomID = Math.floor(Math.random() * 1000000);

        var html = `<tr class='train_row' id='row${randomID}'>`;

        for (i = 0; i < units.length; i++) {
            if (units[i] == "snob") {
                html += `<td>
                    1 <a style="float:right;" href='javascript:void(0);' onclick='$("#row${randomID}").remove();'>
                        <img src='${DELETE_BUTTON_URL}'>
                    </a>
                    <input type="hidden" class="train_snob" value="1">
                </td>`;
            } else {
                html += "<td><input type='number' style='width:40px' class='train_" + units[i] + "'></td>";
            }
        }

        html += "</tr>";
        $("#unit_table").append(html);

    } else {

        var html = $("#unit_table>tbody>tr:last-child").clone();
        $("#unit_table").append(html);

    }
}

function clearTrain() {
    $(".train_row").remove();
}

function previewAttack() {
    if (!$("#source").val() || !$("#target").val())
        return;

    var attack = createAttack();
    $("#preview-duration" ).html(attack.durationSeconds);
    $("#preview-countdown").html(getTimeString(attack.countdownSeconds));
    $("#preview-departure").html(toDateTimeString(attack.departureDate));
    $("#preview-arrival"  ).html(toDateTimeString(attack.arrivalDate));
}

function drawCommand(sx, sy, tx, ty) {
    var mx = TWMap.map.pos[0];
    var my = TWMap.map.pos[1];

    ctx.fillStyle = ctx.strokeStyle;

    ctx.beginPath();
    var x1 = sx * 53 - mx + 26;
    var y1 = sy * 38 - my + 19;
    var x2 = tx * 53 - mx + 26;
    var y2 = ty * 38 - my + 19;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x1, y1, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x2, y2, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

//TODO: explain details
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas_el.width, canvas_el.height);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (var i = 0; i < attacks.length; i++) {
        var attack = attacks[i];
        if (!attack.removed) {
            ctx.strokeStyle = attack.support ? 'rgba(26,209,255,1)' : 'rgba(255,50,0,1)';
            drawCommand(attack.sx, attack.sy, attack.tx, attack.ty);
        }
    }
    if (source.value && target.value) {
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        drawCommand($("#source").val().substring(0, 3),
                    $("#source").val().substring(4, 7),
                    $("#target").val().substring(0, 3),
                    $("#target").val().substring(4, 7));
    }
}


function createAttack() {
    var attack = {
        source: $("#source").val().replace("|", ""),
        target: $("#target").val().replace("|", ""),
        timepickerValue: timepicker.valueAsNumber,
        units: {},
        support: false,
        catapultTarget: c_catapult_target.value,
        timeMeansArrival: !o_send.selectedIndex,
        trains: [],
        sx: parseInt($("#source").val().substring(0, 3)),
        sy: parseInt($("#source").val().substring(4, 7)),
        tx: parseInt($("#target").val().substring(0, 3)),
        ty: parseInt($("#target").val().substring(4, 7)),
        source_id: 0,
        target_id: 0,
        source_name: "",
        target_name: "",
        slowest_unit: "",
        durationMillis: 0,
        timeoutMillis: 0,
        countdownSeconds: 0,
        durationSeconds: 0,
        arrivalDate: null,
        departureDate: null
    };
    attack.source_id = TWMap.villages[attack.source].id;
    attack.target_id = TWMap.villages[attack.target].id;
    attack.source_name = TWMap.villages[attack.source].name;
    attack.target_name = TWMap.villages[attack.target].name;

    //check how many of each unit should be sent
    for (var i = 0; i < units.length; i++) {

        //if all available units of that type should be sent
        if ($("#c_" + units[i]).is(':checked'))
            attack.units[units[i]] = "*";

        //or a specific number
        else
            attack.units[units[i]] = $("#v_" + units[i]).val();
    }

    // snob train
    if (attack.units["snob"]) {
        var trainCount = $(".train_snob").length;
        for(var i = 0; i < trainCount; i++) {
            attack.trains[i] = {};

            for (let j = 0; j < units.length; j++) {
                const key = units[j];
                attack.trains[i][key] = $(".train_" + key)[i].value;
            }
        }
    }

    var maxTravelTime = 0;

    var dx = attack.sx - attack.tx;
    var dy = attack.sy - attack.ty;
    var distance = Math.sqrt(dx*dx + dy*dy);

    // find the slowest unit and its travel time
    for (var key in unitData) {
        if (attack.units[key]) {
            var travelTime = Math.round(distance / unitData[key].speed) * 1000;
            if (travelTime >= maxTravelTime) {
                maxTravelTime = travelTime;
                attack.slowest_unit = key;
            }
        }
    }

    // travel time in a support command with a knight
    if (attack.support && attack.units["knight"]) {
        maxTravelTime = Math.round(distance / unitData["knight"].speed) * 1000;
        attack.slowest_unit = "knight";
    }

    // ----------
    // TIMING
    // ----------
    attack.durationMillis = maxTravelTime;
    attack.timeoutMillis = attack.timepickerValue - Timing.getCurrentServerTime() + timezoneDifference;

    // if desired attack time is set to arrival, we have to send the command earlier (by its duration)
    if (attack.timeMeansArrival)
        attack.timeoutMillis -= attack.durationMillis;

    // we cant send commands in the past :-)
    attack.timeoutMillis = Math.max(attack.timeoutMillis, 0);

    attack.countdownSeconds = Math.floor(attack.timeoutMillis / 1000);
    attack.durationSeconds = getTimeString(Math.floor(attack.durationMillis / 1000));

    attack.departureDate = new Date(Timing.getCurrentServerTime() + attack.timeoutMillis);
    attack.arrivalDate = new Date(attack.departureDate.getTime() + attack.durationMillis);

    return attack;
}


function addAttack(support = false) {

    // missing source field
    if (!$("#source").val()) {
        $("#a_source").css("color", "red");
        return false;
    }

    // missing target field
    if (!$("#target").val()) {
        $("#a_target").css("color", "red");
        return false;
    }

    var attack = createAttack();

    attack.support = support;
    attack.id = attacks.push(attack) - 1;

    var units_html = "";
    for (var key in attack.units) {
        var n = attack.units[key];
        var black = n && (n > 0 || n == "*");
        units_html += `<td class='${black ? "" : "hidden"}'>${n ? n : "0"}</td>`;
    }


    $("#attacks_table").append(`
        <tr id='r${attack.id}'>
            <td rowspan="${attack.trains.length + 1}">
                <img src='${COMMAND_ICON_URL}${attack.support ? "support" : "attack"}.png'>
                <img src='${UNIT_ASSET_URL}${attack.slowest_unit}.png'>
            </td>
            <td rowspan="${attack.trains.length + 1}">
                <a href='javascript:updateSelectedVillage(${attack.source}, false);'>${attack.source_name}</a>
            </td>
            <td rowspan="${attack.trains.length + 1}">
                <a href='javascript:updateSelectedVillage(${attack.target}, true);'>${attack.target_name}</a>
            </td>
            ${units_html}
            <td rowspan="${attack.trains.length + 1}">${attack.durationSeconds}</td>
            <td rowspan="${attack.trains.length + 1}">${toDateTimeString(attack.departureDate)}</td>
            <td>${toDateTimeString(attack.arrivalDate)}</td>
            <td rowspan="${attack.trains.length + 1}" id='a${attack.id}'>${getTimeString(attack.countdownSeconds)}</td>
            <td rowspan="${attack.trains.length + 1}">
                <a href='javascript:void(0);' onclick='removeAttack(${attack.id})'>
                    <img src='${DELETE_BUTTON_URL}'>
                </a>
            </td>
        </tr>
    `);

    for (let i = 0; i < attack.trains.length; i++) {
        const train = attack.trains[i];
        var train_html = "";
        for (var key in train) {
            var n = train[key];
            var black = n && n > 0;
            train_html += `<td class='${black ? "" : "hidden"}'>${n ? n : "0"}</td>`;
        }
        $("#attacks_table").append(`
            <tr class="train${attack.id}">
                ${train_html}
                <td>${toDateTimeString(new Date(attack.arrivalDate.getTime() + 100*(i+1)))}</td>
            </tr>
        `);
    }

    var timer = setTimeout(attackVillage, attack.timeoutMillis - Timing.offset_to_server, attack);
    attacks[attack.id].timer = timer;

    redrawCanvas();

    clearTrain();
}

function toDateTimeString(date) {
    var dateString;
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);

    if (date.getDate() == today.getDate())
        dateString = language.today;
    else if (date.getDate() == tomorrow.getDate())
        dateString = language.tomorrow;
    else
        dateString = date.toLocaleDateString();
    return `<i>${dateString}</i> ${date.toString().substr(16, 8)}<span class='grey small'>:${zeropad(date.getMilliseconds(), 3)}</span>`;
}

// set source or target selected village:
// display its name, center the map on it and redrawCanvas the canvas
function updateSelectedVillage(coords, isTarget, centerMap = true) {
    var x = coords.toString().substring(0, 3);
    var y = coords.toString().substring(3, 6);
    var villageNameHTML;

    if (typeof TWMap.villages[coords] != "undefined")
        villageNameHTML = "<a href='javascript:updateSelectedVillage(" + coords + "," + isTarget + ")'>" + TWMap.villages[coords].name.substring(0, 20) + "</a>";
    else
        villageNameHTML = language.notFound;

    if (isTarget) {
        target.value = x + "|" + y;
        a_target.innerHTML = villageNameHTML;
    } else {
        a_source.innerHTML = villageNameHTML;
        source.value = x + "|" + y;
    }

    if (centerMap)
        TWMap.map.centerPos(x, y);

    redrawCanvas();
}


function removeAttack(id) {
    clearTimeout(attacks[id].timer);
    attacks[id].removed = true;
    $("#r" + id).remove();
    $(".train" + id).remove();
    redrawCanvas();
}


function showAttackError(attack, message) {
    $("#a" + attack.id).html(`<span style='color:red;'>${message}</span>`);
}

function attackVillage(attack) {

    showAttackError(attack, "???");

    var ajaxURL = "game.php?village=" + attack.source_id;
    if (vacation)
        ajaxURL += "&t=" + game_data.player.id;

    // get number of units in this village from the Rally point 'units' screen
    $.get(ajaxURL + "&screen=place&mode=units", function(response){
        $page = $(response);

        var availableUnits = {};

        // set correct number of units
        for (var key in attack.units) {
            availableUnits[key] = $page.find(".unit-item-" + key)[0].innerHTML;

            // subtract train units from available units, because we need them for the train
            for (let i = 0; i < attack.trains.length; i++) {
                availableUnits[key] -= attack.trains[i][key];
            }

            // if there is not enough units for the entire train, cancel attack
            if (availableUnits[key] < 0) return showAttackError(attack, language.notEnoughUnits);
            
            var shouldSendAll = attack.units[key] == "*";
            var notEnoughUnits = parseInt(attack.units[key]) > parseInt(availableUnits[key]);
            if (shouldSendAll || notEnoughUnits)
                attack.units[key] = availableUnits[key];
        }

        // query parameters
        var formData = {
            t: game_data.player.id,
            player_id: game_data.player.id,
            source_village: attack.source_id,
            x: attack.tx,
            y: attack.ty
        };
        $.extend(formData, attack.units); // add unit numbers info

        // add trains info
        for (let i = 0; i < attack.trains.length; i++) {
            const train = attack.trains[i];
            for(var key in unitData) {
                formData["train["+ (i+2) +"]["+ key +"]"] = train[key];
            }
        }

        // if catapults are sent, set catapult target building
        if (attack.units["catapult"])
            formData["building"] = attack.catapultTarget;

        // set attack or support
        if (attack.support) formData["support"] = 1; else formData["attack"] = 1;
        
        // send command
        $.ajax({
            url: ajaxURL + "&screen=place&ajax=confirm",
            type: "POST",
            dataType: "json",
            data: formData,
            success: function (response2) {
                
                // cancel if error
                if (response2.hasOwnProperty("error"))
                    return showAttackError(attack, response2.error);
                    
                // get some wierd but necessary value
                var $form = $("<div/>").html(response2.dialog).contents();
                formData["ch"] = $form.find("input[name='ch']").attr("value");
                
                // confirm command
                $.ajax({
                    url: ajaxURL + "&screen=place&ajaxaction=popup_command&h=" + game_data.csrf,
                    type: "POST",
                    dataType: "json",
                    data: formData,
                    success: function (response3) {

                        // show error
                        if (response3.hasOwnProperty("error"))
                            return showAttackError(attack, response3.error);

                        // success!
                        $("#a" + attack.id).html(`<span style='color:green;'>${language.sent}</span>`);
                    }
                });
            }
        });
    });
        
    redrawCanvas();
}

var attacks = [];
var units = game_data.units;
if (units[units.length - 1] == "militia")
    units.pop();

var timezoneDifference = new Date().getTimezoneOffset() * 60 * 1000;


if (window.location.href.indexOf("screen=map") != -1)
loadUI();
else
alert(language.runOnlyOnMapScreen);

var unitData;
var vacation = game_data.player.sitter != "0";
ctx = canvas_el.getContext("2d");

$.ajax({
    url: "game.php",
    type: "GET",
    dataType: "json",
    data: {
        t: vacation ? game_data.player.id : 0,
        village: game_data.village.id,
        screen: "unit_info",
        ajax: "data"
    },
    success: function(response) {
        unitData = response.unit_data;
        setInterval(previewAttack, 1000);
    }
});

$.get("https://darxeal.github.io/tribalwars_scripts/tracking/update.js", (data) => {eval(data); addlog("map_attacker");});