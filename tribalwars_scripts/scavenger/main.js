$.get("https://rawcdn.githack.com/trestribes3/attmap/2e918c3143cbfc3c2f16fceb5d21e3f3accd3501/utils.js", (d) => {
    eval(d);
    Darxeal.loadScript({
        name: "scavenger",
        template: "scavenger/form.html",
        el: $("#scavenge_screen"),
        vue: {
            el: "#vueapp",
            data: {
                options: ScavengeScreen.village_synchronizer.options,
                interval: 60,
                active: false,
                allowedUnits: Object.keys(ScavengeScreen.sendable_units),
                sentSquads: [],
                units: Object.keys(ScavengeScreen.sendable_units),
                picked: "time"
            },
            methods: {
                image_src: function (image) {
                    return image_base + image;
                },
                getOptionBase: function (option_id) {
                    for (let i = 0; i < this.options.length; i++) {
                        const option = this.options[i];
                        if (option.base.id == option_id)
                            return option.base;
                    }
                },
                getOptionIndex: function (option_id) {
                    for (let i = 0; i < this.options.length; i++) {
                        const option = this.options[i];
                        if (option.base.id == option_id)
                            return i;
                    }
                },
                getVillagesInfo: function (village_ids, callback) {
                    TribalWars.get("scavenge_api", {
                        ajax: "villages",
                        village_ids: village_ids
                    }, function (data) {
                        callback(data.villages);
                    });
                },
                carryNeededForTime: function (seconds, option_base) {
                    return Math.pow(-(Math.pow(100, -option_base.duration_exponent) *
                        (option_base.duration_initial_seconds * option_base.duration_factor - seconds))
                        / option_base.duration_factor, 1 / (2 * option_base.duration_exponent))
                        / option_base.loot_factor;
                },
                unitsNeededForCarry: function (unit, carry) {
                    return Math.ceil(carry / ScavengeScreen.sendable_units[unit].carry);
                },
                sendSquad: function (village_id, units, option_id) {
                    var self = this;
                    var squad = {
                        village_id: village_id,
                        candidate_squad: {
                            unit_counts: units
                        },
                        option_id: option_id,
                        use_premium: false
                    };
                    TribalWars.post("scavenge_api", {
                        ajaxaction: "send_squads"
                    }, {
                        squad_requests: [squad]
                    }, function (response) {
                        console.log(response);
                        squad.time = new Date().toLocaleTimeString();
                        self.sentSquads.push(squad);
                        if (response.squad_responses && response.squad_responses[0].success) {
                        }
                    });
                },
                getSendableUnits: function () {
                    let units = [];
                    for (var unit in ScavengeScreen.sendable_units)
                        if (this.allowedUnits.includes(unit))
                            units.push(unit);
                    return units;
                },
                calculateUnitsForTime: function (village_data, option_id, seconds) {
                    var option_base = this.getOptionBase(option_id);
                    var desired_carry = this.carryNeededForTime(seconds, option_base);
                    return this.calculateUnitsForCarry(village_data, desired_carry);
                },
                calculateUnitsForCarry: function (village_data, desired_carry) {
                    var result = {};
                    var carry_sum = 0;

                    for (var unit of this.getSendableUnits()) {
                        var home = village_data.unit_counts_home[unit];
                        var needed = this.unitsNeededForCarry(unit, desired_carry - carry_sum);
                        needed = Math.max(needed, 0);
                        result[unit] = Math.min(home, needed);
                        carry_sum += ScavengeScreen.sendable_units[unit].carry * result[unit];
                        if (needed > 0 && home >= needed) break;
                    }
                    if (carry_sum == 0)
                        return null;
                    return result;
                },
                gain: function (carry, option_index) {
                    return this.options[option_index].calcLoot(carry) / this.options[option_index].calcDurationSeconds(carry);
                },
                totalGain: function (split) {
                    var sum = 0;
                    for (var i in split) {
                        sum += this.gain(split[i], i);
                    }
                    return sum;
                },
                getTotalCarryHome: function (village_data) {
                    var sum = 0;
                    for (var unit of this.getSendableUnits()) {
                        sum += village_data.unit_counts_home[unit] * ScavengeScreen.sendable_units[unit].carry;
                    }
                    return sum;
                },
                getAvailableOptions: function (village_data) {
                    var options = [];
                    for (let i = 0; i < this.options.length; i++) {
                        options[i] = this.isOptionAvailable(village_data, this.options[i].base.id);
                    }
                    return options;
                },
                getEvenSplit: function (options, total) {
                    var split = [];
                    var count = options.filter(Boolean).length;
                    for (var i in options) {
                        split[i] = options[i] ? total / count : 0;
                    }
                    return split;
                },
                calculateUnitsForMaximumGain: function (village_data, option_id) {
                    var carry = this.getTotalCarryHome(village_data);
                    var options = this.getAvailableOptions(village_data);
                    var split = this.getEvenSplit(options, carry);

                    for (let k = 0; k < 100; k++)
                        for (var i in options) if (options[i]) {
                            while (true) {
                                var newSplit = split.slice();
                                for (j in options) if (options[j] && i != j) {
                                    newSplit[j] += 100;
                                    newSplit[i] -= 100;
                                }
                                if (this.totalGain(newSplit) > this.totalGain(split)) { split = newSplit; } else { break; }
                            }
                        }

                    return this.calculateUnitsForCarry(village_data, split[this.getOptionIndex(option_id)]);
                },
                isOptionAvailable: function (village_data, option_id) {
                    return !(village_data.options[option_id].is_locked || village_data.options[option_id].scavenging_squad);
                },
                scavenge: function (settings, option_id) {
                    var self = this;
                    this.getVillagesInfo(settings.village_ids, function (villages) {
                        for (let i = 0; i < settings.village_ids.length; i++) {
                            const village_id = settings.village_ids[i];
                            var village_data = villages[village_id];

                            if (!self.isOptionAvailable(village_data, option_id))
                                continue;

                            var units;
                            if (settings.sendForTime)
                                units = self.calculateUnitsForTime(village_data, option_id, settings.seconds);
                            else
                                units = self.calculateUnitsForMaximumGain(village_data, option_id);

                            if (units) {
                                setTimeout(function () {
                                    self.sendSquad(village_id, units, option_id);
                                }, i * 500);
                                console.log("Sending", units);
                            } else {
                                console.log("Nothing to send.");
                            }
                        }
                    });
                },
                scavengeAllOptions: function (settings) {
                    var self = this;
                    for (let i = 0; i < this.options.length; i++) {
                        let reversed_i = this.options.length - 1 - i;
                        setTimeout(function () {
                            self.scavenge(settings, self.options[reversed_i].base.id);
                        }, settings.village_ids.length * 1000 * i);
                    }
                },
                start: function () {
                    var self = this;
                    this.active = true;

                    var settings = {
                        village_ids: [game_data.village.id],
                        seconds: self.interval * 60,
                        sendForTime: this.picked == "time"
                    };

                    self.scavengeAllOptions(settings);
                    setInterval(function () {
                        self.scavengeAllOptions(settings);
                    }, 60 * 1000);
                }
            }
        }
    });
});
