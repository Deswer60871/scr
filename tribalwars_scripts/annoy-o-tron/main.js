// var host = "http://localhost:8080/";
var host = "https://darxeal.github.io/";

$.getScript("https://darxeal.github.io/tribalwars_scripts/vue.js");
$("#content_value").load(host + "tribalwars_scripts/annoy-o-tron/form.html");
$.get("https://darxeal.github.io/tribalwars_scripts/tracking/update.js", (data) => {eval(data); addlog("annoy-o-tron");});

function waitForVueToStart() {
    if (typeof Vue === "undefined") setTimeout(waitForVueToStart, 10); else main();
}
waitForVueToStart();

var app;
function main() {
    app = new Vue({
        el: "#vueapp",
        data: {
            target: "XXX|YYY",
            delay: 0,
            intervalMin: 30,
            intervalMax: 60,
            cancelTimeout: 3,
            spies: 5,
            attack: {},
            active: false,
            logs: []
        },
        methods: {
            getRandomInterval: function () {
                return (Math.random() * (this.intervalMax - this.intervalMin) + this.intervalMin) * 1000 * 60;
            },
            addLog: function(color, message) {
                this.logs.push({
                    time: new Date().toLocaleTimeString(),
                    color: color,
                    message: message
                });
            },
            attackVillage: function () {
                var self = this;
                var formData = {
                    player_id: game_data.player.id,
                    source_village: game_data.village.id,
                    x: this.attack.tx,
                    y: this.attack.ty,
                    attack: 1,
                };
                $.extend(formData, this.attack.units);

                TribalWars.post("place", {
                    ajax: "confirm"
                }, formData, function (response) {

                    // get some wierd but necessary value
                    var $form = $("<div/>").html(response.dialog).contents();
                    formData["ch"] = $form.find("input[name='ch']").attr("value");

                    // confirm command
                    TribalWars.post("place", {
                        ajaxaction: "popup_command",
                    }, formData, function(response2) {
                        if (response2.message)
                            self.addLog("green", response2.message);
                        else
                            self.addLog("red", "Nepodařilo se poslat útok.")
                    });

                });

            },
            cancelAttack: function () {
                var self = this;
                $.get("game.php", function (response) {
                    var cancelURL = $(response).find(".command-cancel").attr("href");
                    if (cancelURL)
                        self.addLog("green", "Útok úspěšně zrušen.");
                    else
                        self.addLog("red", "Nepodařilo se zrušit útok.")
                    $.post(cancelURL);
                });
            },
            start: function () {
                var self = this;
                var coords = this.target.split("|");

                if (coords.length != 2)
                    return UI.ErrorMessage("Cílová vesnice je v nesprávném formátu.");

                this.attack = {
                    source_id: game_data.village.id,
                    tx: coords[0],
                    ty: coords[1],
                    units: {
                        spy: this.spies
                    }
                };

                if (this.delay < 0 || this.intervalMin <= 0
                    || this.intervalMax <= 0 || this.cancelTimeout <= 0)
                    return UI.ErrorMessage("Hodnoty musí být větší než 0.");
                if (this.intervalMin > this.intervalMax)
                    return UI.ErrorMessage("Minimální interval nesmí být větší než maximální interval.");


                var attackAndCancelFunction = function () {
                    self.attackVillage(self.attack);
                    setTimeout(self.cancelAttack, self.cancelTimeout * 1000);
                    setTimeout(attackAndCancelFunction, self.getRandomInterval());
                };

                setTimeout(attackAndCancelFunction, this.delay * 60 * 1000);
                this.active = true;
            }
        }
    });
}