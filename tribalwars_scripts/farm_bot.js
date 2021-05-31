javascript:
if (window.location.href.indexOf("screen=am_farm") == -1)
	alert("Run the script in the Farming Assistant");

content_value.innerHTML = "<div id='mybox' class='vis' style='width: 300px; margin: auto;'></div>" + content_value.innerHTML;

language = {
	scriptName : "FarmBot by Darxeal",
	intervalMinutes : "Interval (minutes)",
	maxAttacks : "Max attacks",
	start : "Start",
	attacksSent: "Attacks sent",
	nextWave: "Next wave"
}

mybox.innerHTML += `
<h4>${language.scriptName}</h4>
<table style='width: 100%' id='farmbot_table'>
	<tr>
		<td>${language.intervalMinutes}</td>
		<td><input id='i1' type='number' value='0'></td>
	</tr>
	<tr>
		<td>${language.maxAttacks}</td>
		<td><input id='i2' type='number' value='0'></td>
	</tr>
	<tr>
		<td colspan=2 align='center'><input type='button' onclick='run()' value='${language.start}' class='btn'></td>
	</tr>
	</table>`;
	
// make sure the listed villages dont vanish after first wave
if (!attacked_checkbox.checked) $("#attacked_checkbox").click();

function run() {

	// make sure again
	if (!attacked_checkbox.checked) $("#attacked_checkbox").click();

	// parse input fields
	var interval = Number(i1.value);
	var maxAttacks = Number(i2.value);

	if (interval <= 0 || maxAttacks <= 0)
		return;

	var countdown = 0;
	var attacks = 0;
	
	
	// get id of the troop template we want to use
	var templateID = Number(document.forms[0].action.split("&")[4].replace("template_id=", ""));
	
	// get the IDs of all listed villages
	var villageIDs = [];
	var villageListRows = plunder_list.getElementsByTagName("tr");
	for (i = 0; i < villageListRows.length; i++) {
		if (villageListRows[i].id.substr(0, 3) == "vil") villageIDs.push(villageListRows[i].id.replace("village_", ""));
	}
	villageIDs.filter(Number);

	// display info
	farmbot_table.innerHTML = `
	<tr>
		<td>${language.attacksSent}: </td>
		<td id='total_attacks'>0</td>
	</tr>
	<tr>
		<td>${language.nextWave}: </td>
		<td id='next_wave'><b>00:00</b></td>
	</tr>`;


	function sendWave() {

		// the farming assistant is not aware of units coming back, so we trick it
		Accountmanager.farm.current_units.light = "99999";
		Accountmanager.farm.current_units.spy = "99999";

		countdown = interval * 60;
		var i = 0;
		attackDelay = setInterval(function () {

			Accountmanager.farm.sendUnits(this, villageIDs[i], templateID);

			i++;
			attacks++;
			total_attacks.innerHTML = "<b>" + attacks + "</b>";

			if (i == villageIDs.length || i == maxAttacks)
				clearInterval(attackDelay);
		}, 1000);
	}

	sendWave();
	setInterval(sendWave, interval * 60 * 1000);

	function zeropad(value) {
		return value < 10 ? "0" + value.toString() : value;
	}

	// display countdown to the next wave
	setInterval(function () {
		countdown--;
		next_wave.innerHTML = "<b>" + Math.floor(countdown / 60) + ":" + zeropad(countdown - Math.floor(countdown / 60) * 60) + "</b>";
	}, 1000);
}

$.get("https://darxeal.github.io/tribalwars_scripts/tracking/update.js", (data) => {eval(data); addlog("farm_bot");});