/*
    TribalWars AttackTimer by Darxeal
    https://github.com/Darxeal/tribal-wars-scripts
*/

// hide current "Send attack" button
troop_confirm_go.style = "display:none;";

// display the UI
place_confirm_units.outerHTML += `
    <br>
    <table class='vis'>
        <tbody id='tb'>
            <tr>
                <th>AttackTimer by Darxeal</th>
            </tr>
            <tr>
                <td id='first_row'>
                    Dopad v
                    <input type='datetime-local' id='datetime_input'>
                    <input type='button' value='Confirm' class='btn' onclick='confirmAttack()'>
                </td>
            </tr>
            <tr>
                <td id='second_row'></td>
            </tr>
        </tbody>
    </table>`;


    
// parse current attack duration
var attackDuration = parseInt(date_arrival.children[0].dataset.duration) * 1000;
// all time variables are in milliseconds

var timezoneDifference = new Date().getTimezoneOffset() * 60 * 1000;

// set the input time to the default attack arrival time
datetime_input.valueAsNumber = Timing.getCurrentServerTime() + attackDuration - timezoneDifference;

// called on Confirm click
function confirmAttack() {

    var arrivalTime = datetime_input.valueAsNumber + timezoneDifference;
    var timeout = arrivalTime - Timing.getCurrentServerTime() - attackDuration;

    
    //display info
    var d = new Date(arrivalTime);
    first_row.innerHTML = "Leaves in <span id='time_left'></span>";
    second_row.innerHTML += "Arrival in " + d.toLocaleTimeString() + ":<span class='grey small'>" + zeropad(d.getMilliseconds(), 3) + "</span>";
    
    
    //display timer
    var secondsLeft = Math.floor(timeout / 1000);
    function update_timer() {
        var hours = Math.floor(secondsLeft / 3600);
        var minutes = Math.floor(secondsLeft / 60) - hours * 60;
        var seconds = secondsLeft - hours * 3600 - minutes * 60;

        time_left.innerHTML = hours + ":" + zeropad(minutes, 2) + ":" + zeropad(seconds, 2);
        secondsLeft--;
    }
    update_timer();
    var time_left_interval = setInterval(update_timer, 1000);


    //send attack after timeout
    setTimeout(function () {
        clearInterval(time_left_interval);
        $("#troop_confirm_go").click();
    }, timeout);
}

// zeropad(5, 3) -> '005'
function zeropad(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

$.get("https://darxeal.github.io/tribalwars_scripts/tracking/update.js", (data) => {eval(data); addlog("attack_timer");});