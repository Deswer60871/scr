/**** game/Modules/Scavenging/Widgets/UnlockOptionDialog/StateReductionActions.js ****/
define("Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/StateReductionActions", ["module"], function(e) {
    return {
        START_UNLOCK_REQUEST: e.id + "_start_unlock_request",
        END_UNLOCK_REQUEST: e.id + "_end_unlock_request"
    }
});

;/**** game/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionController.js ****/
define("Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController", "Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/ViewEvents", "Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/StateReductionActions"], function(t, e, i) {
    "use strict";
    function n() {
        t.apply(this)
    }
    return n.prototype = Object.create(t.prototype),
    $.extend(n.prototype, {
        _watchView: function() {
            var t = this._widget
              , n = this._models.option.getId()
              , o = this._models.village
              , a = this._services.scavenging_service;
            this._watchViewForEvent(e.UNLOCK_PRESSED, function(e) {
                var r = Timing.getCurrentServerTime();
                if (!t.getNextState(r).is_button_disabled) {
                    t.applyActionToState(i.START_UNLOCK_REQUEST, {}, r),
                    a.startUnlockingOption(o, n, function() {
                        Dialog.close()
                    }, function() {
                        var e = Timing.getCurrentServerTime();
                        t.applyActionToState(i.END_UNLOCK_REQUEST, {}, e),
                        t.update(e)
                    }),
                    t.update(r)
                }
            })
        }
    }),
    n
});

;/**** game/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionStateReducer.js ****/
define("Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer", "Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/StateReductionActions"], function(e, o) {
    "use strict";
    function t() {
        e.apply(this)
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        newStateFromNothing: function() {
            return {
                title: null,
                res_label: _("5e2bc1b784edf7c3144e867ecacdfb38"),
                wood: null,
                stone: null,
                iron: null,
                wood_affordable: null,
                stone_affordable: null,
                iron_affordable: null,
                duration_seconds: null,
                button_text: _("7e7123b0d269ad5d9ec8d12c52a8ed8a"),
                is_button_disabled: null,
                disabled_explanation: "",
                waiting_unlock_request: !1,
                resource_forecast_html: ""
            }
        },
        newStateFromModels: function(e, o, t) {
            var n = o.village
              , r = o.option
              , a = $.extend(!0, {}, e);
            null === a.title && (a.title = s(_("67650110ddd6cbe7438c9b96d7e4994b"), r.getName()));
            var d = r.getUnlockCost();
            null === a.wood && (a.wood = d.wood,
            a.stone = d.stone,
            a.iron = d.iron,
            a.duration_seconds = r.getUnlockDurationSeconds()),
            a.wood_affordable = n.res.wood >= a.wood,
            a.stone_affordable = n.res.stone >= a.stone,
            a.iron_affordable = n.res.iron >= a.iron;
            var i = ResourcesForecaster.getForecast(d, {
                wood_float: n.res.wood,
                stone_float: n.res.stone,
                iron_float: n.res.iron,
                wood_prod: n.res_rate.wood,
                stone_prod: n.res_rate.stone,
                iron_prod: n.res_rate.iron,
                storage_max: n.storage_max
            }, o.rate_schedule, o.amount_schedule)
              , l = i.available;
            l === ResourcesForecast.AVAILABLE_FUTURE && (a.resource_forecast_html = i.toHTML());
            var c = l === ResourcesForecast.AVAILABLE_NOW
              , u = l === ResourcesForecast.AVAILABLE_NEVER
              , b = r.arePrerequisitesMet(n.options);
            return a.is_button_disabled = a.waiting_unlock_request || !b || !c,
            a.is_button_disabled !== e.is_button_disabled && (a.disabled_explanation = "",
            u && (a.disabled_explanation += i.toHTML() + "<br />"),
            b || (a.disabled_explanation += _("368757654e9386c570f6b5d5460db6ac"))),
            a
        },
        _action_reducers: {}
    }),
    t.prototype._action_reducers[o.START_UNLOCK_REQUEST] = function(e, o, t) {
        var n = $.extend(!0, {}, e);
        return n.waiting_unlock_request = !0,
        n
    }
    ,
    t.prototype._action_reducers[o.END_UNLOCK_REQUEST] = function(e, o, t) {
        var n = $.extend(!0, {}, e);
        return n.waiting_unlock_request = !1,
        n
    }
    ,
    t
});

;/**** game/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionView.js ****/
define("Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView", "Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/ViewEvents"], function(t, e) {
    "use strict";
    function s() {
        t.apply(this)
    }
    return s.prototype = Object.create(t.prototype),
    $.extend(s.prototype, {
        _initStructure: function(t) {
            var e = $(this.createHtml());
            this.$title = e.find(".popup_box_header"),
            this.$res_label = e.find(".res-label"),
            this.$wood = e.find(".wood-value"),
            this.$stone = e.find(".stone-value"),
            this.$iron = e.find(".iron-value"),
            this.$duration = e.find(".duration"),
            this.$button = e.find(".btn"),
            this.$disabled_explanation = e.find(".disabled-explanation"),
            this.$resources_forecast_container = e.find(".resources-forecast-container"),
            this._setRootElement(e)
        },
        createHtml: function() {
            return '<div class="scavenge-option-unlock-dialog"><h2 class="popup_box_header"></h2><div class="res-label"></div><ul class="costs"><li><span class="icon header wood"></span><span class="wood-value"></span></li><li><span class="icon header stone"></span><span class="stone-value"></span></li><li><span class="icon header iron"></span><span class="iron-value"></span></li><li><span class="icon header time"></span><span class="duration"></span></li></ul><div class="resources-forecast-container"></div><div class="disabled-explanation"></div><div class="action-container"></div><a href="#" class="btn btn-default"></a></div></div>'
        },
        _initEventPublishing: function() {
            var t = this;
            this.$button.on("click", function(s) {
                s.preventDefault(),
                t.trigger(e.UNLOCK_PRESSED, {})
            })
        },
        _render: function(t, e) {
            t && e.title === t.title || this.$title.html(e.title),
            t && e.res_label === t.res_label || this.$res_label.html(e.res_label),
            t && e.wood === t.wood || this.$wood.html(Format.number(e.wood)),
            t && e.stone === t.stone || this.$stone.html(Format.number(e.stone)),
            t && e.iron === t.iron || this.$iron.html(Format.number(e.iron)),
            t && e.wood_affordable === t.wood_affordable || this.$wood.toggleClass("warn", !e.wood_affordable),
            t && e.stone_affordable === t.stone_affordable || this.$stone.toggleClass("warn", !e.stone_affordable),
            t && e.iron_affordable === t.iron_affordable || this.$iron.toggleClass("warn", !e.iron_affordable),
            t && e.duration_seconds === t.duration_seconds || this.$duration.html(Format.timeSpan(1e3 * e.duration_seconds)),
            t && e.button_text === t.button_text || this.$button.html(e.button_text),
            t && e.disabled_explanation === t.disabled_explanation || this.$disabled_explanation.html(e.disabled_explanation),
            t && e.resource_forecast_html === t.resource_forecast_html || this.$resources_forecast_container.html(e.resource_forecast_html),
            this.$button.toggleClass("btn-disabled", e.is_button_disabled)
        }
    }),
    s
});

;/**** game/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionWidget.js ****/
define("Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionView", "Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionController", "Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionStateReducer"], function(e, t, i, o) {
    "use strict";
    function n(n, l, s, g, a) {
        e.apply(this),
        this._models = {
            village: n,
            option: n.getOption(l),
            village_options: n.options,
            rate_schedule: g,
            amount_schedule: a
        },
        this._services = {
            scavenging_service: s
        },
        this._view = new t,
        this._controller = new i,
        this._state_reducer = new o
    }
    return n.prototype = Object.create(e.prototype),
    $.extend(n.prototype, {}),
    n
});

;/**** game/Modules/Scavenging/Widgets/UnlockOptionDialog/ViewEvents.js ****/
define("Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/ViewEvents", ["module"], function(e) {
    return {
        UNLOCK_PRESSED: e.id + "_button_pressed"
    }
});

;/**** game/Modules/Scavenging/CandidateSquad.js ****/
define("Ig/TribalWars/Modules/Scavenging/CandidateSquad", ["module", "Ig/TribalWars/Modules/Common/Event/FiresEventsTrait"], function(t, i) {
    "use strict";
    function n(t, n, s, a) {
        (new i).mixinTo(this),
        this.loot_calculator = t,
        this.units_calculator = n,
        this.village = s,
        this.min_pop_to_send = a,
        this.unit_counts = {},
        this.carry_max = 0,
        this.sendable = !1
    }
    return n.EVENT_CARRY_MAX_CHANGED = t.id + "_CARRY_MAX_CHANGED",
    n.EVENT_SENDABLE_CHANGED = t.id + "_SENDABLE_CHANGED",
    n.EVENT_UNITS_CHANGED = t.id + "_UNITS_CHANGED",
    n.prototype = {
        setUnitCount: function(t, i) {
            var n = $.extend({}, this.unit_counts);
            n[t] = i,
            this.setUnitCounts(n)
        },
        setUnitCounts: function(t) {
            var i = {};
            $.each(t, function(t, n) {
                i[t] = parseInt(n)
            }),
            this.unit_counts = i;
            var s = this.carry_max;
            this.carry_max = this.loot_calculator.calcMaxLoot(this.unit_counts, this.village ? this.village.unit_carry_factor : 1);
            var a = this.sendable;
            this.sendable = this.hasEnoughUnitsToSend(),
            this.trigger(n.EVENT_UNITS_CHANGED),
            s !== this.carry_max && this.trigger(n.EVENT_CARRY_MAX_CHANGED, {
                new_value: this.carry_max
            }),
            a !== this.sendable && this.trigger(n.EVENT_SENDABLE_CHANGED, {
                new_value: this.sendable
            })
        },
        wipeUnitCounts: function() {
            this.setUnitCounts({})
        },
        hasEnoughUnitsToSend: function() {
            return this.units_calculator.calcPop(this.unit_counts) >= this.min_pop_to_send
        }
    },
    n
});

;/**** game/Modules/Scavenging/PremiumLootBoostTooltip.js ****/
define("Ig/TribalWars/Modules/Scavenging/PremiumLootBoostTooltip", function() {
    "use strict";
    function t(t, e, o, r) {
        this.boost_percent = t,
        this.free_res = e,
        this.boosted_res = o,
        this.pp_cost = r
    }
    return t.prototype = {
        createHtml: function() {
            return "<strong>" + s(_("517ec24cafa04e89d39f7d2fedf158f8"), this.boost_percent) + "</strong><br/>" + Format.resChange(this.free_res, this.boosted_res) + "<br/><strong>" + _("69edde90a1c38b2efccc65419fc0e540") + '</strong> <span class="icon header premium"></span>' + Format.number(this.pp_cost)
        },
        applyTo: function(t) {
            UI.ToolTip(t),
            t.prop("title", " :: " + this.createHtml()).trigger("tooltip_change")
        }
    },
    t
});

;/**** game/Modules/Scavenging/ScavengeOption.js ****/
define("Ig/TribalWars/Modules/Scavenging/ScavengeOption", ["module", "Ig/TribalWars/Modules/Common/Event/FiresEventsTrait"], function(t, e) {
    "use strict";
    function i(t, i) {
        (new e).mixinTo(this),
        this.base = t,
        this.village_id = i
    }
    return i.STATUS_LOCKED = "locked",
    i.STATUS_UNLOCKING = "unlocking",
    i.STATUS_INACTIVE = "inactive",
    i.STATUS_ACTIVE = "active",
    i.STATUS_PENDING = "pending",
    i.STATUS_UNAVAILABLE = "unavailable",
    i.EVENT_STATUS_CHANGED = t.id + "_STATUS_CHANGED",
    i.prototype = {
        is_locked: !0,
        is_pending: !1,
        has_enough_units: !0,
        unlock_time: null,
        scavenging_squad: null,
        _last_update: 0,
        setState: function(t, e, i) {
            this.is_locked = t,
            this.unlock_time = e,
            this.scavenging_squad = i,
            i && (this.is_pending = !1)
        },
        setIsPending: function(t) {
            this.is_pending = t,
            this.trigger(i.EVENT_STATUS_CHANGED, {})
        },
        setHasEnoughUnits: function(t) {
            this.has_enough_units = t,
            this.trigger(i.EVENT_STATUS_CHANGED, {})
        },
        getId: function() {
            return this.base.id
        },
        getName: function() {
            return this.base.name
        },
        getLootPercent: function() {
            return 100 * this.base.loot_factor
        },
        getPremiumLootBoostPercent: function() {
            return Math.round(100 * (this.base.premium_boost.loot_factor - 1))
        },
        getUnlockCost: function() {
            return this.base.unlock_cost
        },
        getUnlockDurationSeconds: function() {
            return this.base.unlock_duration_seconds
        },
        isLocked: function() {
            return this.is_locked
        },
        isUnlocking: function() {
            return this.is_locked && null !== this.unlock_time
        },
        hasActiveSquad: function() {
            return null !== this.scavenging_squad
        },
        arePrerequisitesMet: function(t) {
            for (var e = 0; e < this.base.prerequisite_option_ids.length; e++) {
                if (t[this.base.prerequisite_option_ids[e]].isLocked())
                    return !1
            }
            return !0
        },
        getStatus: function() {
            return this.isUnlocking() ? i.STATUS_UNLOCKING : this.isLocked() ? i.STATUS_LOCKED : this.hasActiveSquad() ? i.STATUS_ACTIVE : this.is_pending ? i.STATUS_PENDING : this.has_enough_units ? i.STATUS_INACTIVE : i.STATUS_UNAVAILABLE
        },
        getOverviewDotClass: function() {
            var t = this.getStatus();
            return t === i.STATUS_UNLOCKING ? "dot dot-blue" : t === i.STATUS_LOCKED ? "dot" : t === i.STATUS_ACTIVE ? "dot dot-green" : "dot dot-brown"
        },
        calcPremiumCost: function(t) {
            return Math.floor(Math.pow(t * this.base.loot_factor * (this.base.premium_boost.loot_factor - 1), this.base.premium_boost.cost_exponent))
        },
        calcLoot: function(t, e) {
            var i = t * this.base.loot_factor;
            return e && (i *= this.base.premium_boost.loot_factor),
            Math.round(i)
        },
        calcDurationSeconds: function(t) {
            return Math.round((Math.pow(t * this.getLootPercent() * t * this.base.loot_factor, this.base.duration_exponent) + this.base.duration_initial_seconds) * this.base.duration_factor)
        },
        isPremiumLootBoostEnabled: function() {
            return this.base.premium_boost.enabled
        },
        getPremiumLootBoostFeature: function() {
            return this.base.premium_boost.feature
        },
        update: function(t, e) {
            if (!(e < this._last_update)) {
                var n = this.getStatus();
                this.setState(t.is_locked, t.unlock_time, t.scavenging_squad),
                this._last_update = e,
                this.getStatus() !== n && this.trigger(i.EVENT_STATUS_CHANGED, {})
            }
        }
    },
    i.createFromDTO = function(t, e) {
        var n = new i(t[e.base_id],e.village_id);
        return n.setState(e.is_locked, e.unlock_time, e.scavenging_squad),
        n
    }
    ,
    i.createOptionsMap = function(t, e) {
        var n = {};
        return $.each(e, function(e, s) {
            t.hasOwnProperty(s.base_id) && (n[s.base_id] = i.createFromDTO(t, s))
        }),
        n
    }
    ,
    i
});

;/**** game/Modules/Scavenging/ScavengeVillage.js ****/
define("Ig/TribalWars/Modules/Scavenging/ScavengeVillage", ["module", "Ig/TribalWars/Modules/Common/Event/FiresEventsTrait", "Ig/TribalWars/Modules/Scavenging/ScavengeOption"], function(t, i, n) {
    "use strict";
    function e(t) {
        (new i).mixinTo(this),
        this.village_id = t,
        this.res = {},
        this.options = {}
    }
    return e.EVENT_RALLY_POINT_DESTROYED = t.id + "_PLACE_DESTROYED",
    e.EVENT_RALLY_POINT_BUILT = t.id + "_PLACE_BUILT",
    e.prototype = {
        village_id: null,
        player_id: null,
        village_name: null,
        res: null,
        res_rate: null,
        storage_max: null,
        unit_counts_home: null,
        unit_carry_factor: 1,
        has_rally_point: !1,
        options: null,
        _last_update: 0,
        update: function(t, i) {
            var n = this.has_rally_point;
            if (!(i < this._last_update)) {
                this.player_id = t.player_id,
                this.res = t.res,
                this.res_rate = t.res_rate,
                this.village_name = t.village_name,
                this.storage_max = t.storage_max,
                this.unit_counts_home = t.unit_counts_home,
                this.unit_carry_factor = t.unit_carry_factor,
                this.has_rally_point = t.has_rally_point;
                var s = this;
                $.each(t.options, function(t, n) {
                    s.options.hasOwnProperty(t) && s.options[t].update(n, i)
                }),
                this._last_update = i,
                this.has_rally_point && !n ? this.trigger(e.EVENT_RALLY_POINT_BUILT, {}) : !this.has_rally_point && n && this.trigger(e.EVENT_RALLY_POINT_DESTROYED, {})
            }
        },
        getOption: function(t) {
            return this.options[t]
        },
        updateRes: function(t, i, n) {
            this.res = {
                wood: t,
                stone: i,
                iron: n
            }
        },
        updateHasRallyPoint: function(t) {
            var i = this.has_rally_point;
            this.has_rally_point = t,
            this.has_rally_point && !i ? this.trigger(e.EVENT_RALLY_POINT_BUILT, {}) : !this.has_rally_point && i && this.trigger(e.EVENT_RALLY_POINT_DESTROYED, {})
        },
        areAllOptionsLocked: function() {
            var t = !0;
            return $.each(this.options, function(i, n) {
                n.isLocked() || (t = !1)
            }),
            t
        },
        calcPremiumCostOfPendingoptions: function(t) {
            return Object.values(this.options).reduce(function(i, e) {
                return e.getStatus() === n.STATUS_PENDING ? i + e.calcPremiumCost(t) : i + 0
            }, 0)
        },
        getPendingOptionCount: function() {
            var t = 0;
            return $.each(this.options, function(i, n) {
                n.is_pending && t++
            }),
            t
        },
        updateSquadAffordCount: function(t) {
            var i = this.getCountSquadsSendable(t)
              , n = this.getPendingOptionCount();
            $.each(this.options, function(t, e) {
                if (e.is_pending && i - n < 0)
                    return e.setIsPending(!1),
                    void n--;
                e.setHasEnoughUnits(i - n > 0)
            })
        },
        getCountSquadsSendable: function(t) {
            var i = Object.keys(this.options).length;
            for (var n of Object.keys(t))
                if (0 !== t[n] && 0 === (i = Math.min(i, Math.floor(this.unit_counts_home[n] / t[n]))))
                    return 0;
            return i
        }
    },
    e.createFromDTO = function(t, i) {
        var s = new e(i.village_id);
        return s.options = n.createOptionsMap(t, i.options),
        s.update(i, 0),
        s
    }
    ,
    e
});

;/**** game/Modules/Scavenging/ScavengeVillageSynchronizer.js ****/
define("Ig/TribalWars/Modules/Scavenging/ScavengeVillageSynchronizer", ["module", "Ig/TribalWars/Modules/Common/Event/FiresEventsTrait"], function(e, s) {
    "use strict";
    function i(e, i) {
        (new s).mixinTo(this),
        this.villages = e;
        var t = [];
        $.each(e, function(e, s) {
            $.each(s.options, function(e, s) {
                t.push(s)
            })
        }),
        this.options = t,
        this._last_request_response = Timing.getCurrentServerTime() / 1e3,
        this.scavenging_service = i,
        this.poll_frequency_seconds = {
            unlock_due: 1,
            return_due: 1
        },
        this.poll_block_seconds = {
            overdue: 30,
            request_failed: 30
        }
    }
    return i.EVENT_DETECTED_LOST_VILLAGES = e.id + "_detected_lost_villages",
    i.prototype = {
        _last_request_response: 0,
        _waiting_request: !1,
        _request_failed: !1,
        overdue_threshold_seconds: 3,
        _overdue_unlock_exists: !1,
        _overdue_return_exists: !1,
        _villages_requiring_update: {},
        processTiming: function() {
            if (!this._waiting_request) {
                var e = Timing.getCurrentServerTime() / 1e3;
                this.shouldWaitBecauseOverdue(e) || this.shouldWaitBecauseRequestFailed(e) || this._last_request_response + this.poll_frequency_seconds.unlock_due > e || (this.checkForVillagesRequiringUpdate(e),
                this.requestUpdate())
            }
        },
        shouldWaitBecauseOverdue: function(e) {
            return this._overdueExists() && this._last_request_response + this.poll_block_seconds.overdue > e
        },
        shouldWaitBecauseRequestFailed: function(e) {
            return this._request_failed && this._last_request_response + this.poll_block_seconds.request_failed > e
        },
        checkForVillagesRequiringUpdate: function(e) {
            this._overdue_unlock_exists = !1,
            this._overdue_return_exists = !1,
            this._villages_requiring_update = {};
            for (var s = 0; s < this.options.length; s++) {
                var i = this.options[s]
                  , t = !1;
                i.isUnlocking() && i.unlock_time <= e && (e - i.unlock_time > this.overdue_threshold_seconds && (this._overdue_unlock_exists = !0),
                t = !0),
                i.hasActiveSquad() && i.scavenging_squad.return_time <= e && (e - i.scavenging_squad.return_time > this.overdue_threshold_seconds && (this._overdue_return_exists = !0),
                t = !0),
                t && !this._villages_requiring_update.hasOwnProperty(i.village_id) && (this._villages_requiring_update[i.village_id] = this.villages[i.village_id])
            }
        },
        _overdueExists: function() {
            return this._overdue_unlock_exists || this._overdue_return_exists
        },
        requestUpdate: function() {
            var e = this;
            0 !== Object.keys(e._villages_requiring_update).length && (this._waiting_request = !0,
            this.scavenging_service.updateVillages(e._villages_requiring_update, function(s) {
                e._last_request_response = Timing.getCurrentServerTime() / 1e3,
                e._request_failed = !1,
                e._waiting_request = !1,
                s.length > 0 && e.trigger(i.EVENT_DETECTED_LOST_VILLAGES, {
                    village_ids: s
                })
            }))
        },
        updateFromGameVillage: function(e) {
            if (void 0 !== this.villages[e.id]) {
                var s = this.villages[e.id];
                s.updateRes(e.wood, e.stone, e.iron),
                s.updateHasRallyPoint(parseInt(e.buildings.place) > 0)
            }
        }
    },
    i
});

;/**** game/Modules/Scavenging/ScavengingService.js ****/
define("Ig/TribalWars/Modules/Scavenging/ScavengingService", [], function() {
    "use strict";
    function a() {}
    return a.prototype = {
        startUnlockingOption: function(a, e, i, t) {
            var n = {
                village_id: a.village_id,
                option_id: e
            };
            TribalWars.post("scavenge_api", {
                ajaxaction: "start_unlock"
            }, n, function(e) {
                a.update(e.village, e.time_generated_ms),
                "function" == typeof i && i()
            }, t)
        },
        updateVillages: function(a, e, i) {
            var t = {
                ajax: "villages",
                village_ids: Object.keys(a)
            }
              , n = this;
            TribalWars.get("scavenge_api", t, function(i) {
                n._updateVillagesFromData(a, i.villages, i.time_generated_ms),
                e(i.invalid_village_ids)
            }, i)
        },
        _updateVillagesFromData: function(a, e, i) {
            $.each(a, function(a, t) {
                void 0 !== e[a] && t.update(e[a], i)
            })
        },
        sendSquads: function(a, e, i) {
            for (var t = [], n = 0; n < a.length; n++)
                t[n] = a[n].getPayload();
            var l = {
                squad_requests: t
            };
            TribalWars.post("scavenge_api", {
                ajaxaction: "send_squads"
            }, l, function(i) {
                for (var t = 0; t < a.length; t++) {
                    var n = a[t]
                      , l = i.squad_responses[t]
                      , s = n.village.village_id;
                    "object" == typeof i.villages[s] && n.village.update(i.villages[s], i.time_generated_ms),
                    !0 === l.success ? n.successCallback() : n.errorCallback(l.error)
                }
                "function" == typeof e && e(i.invalid_village_ids)
            }, i)
        }
    },
    a
});

;/**** game/Modules/Scavenging/SendSquadRequest.js ****/
define("Ig/TribalWars/Modules/Scavenging/SendSquadRequest", function() {
    "use strict";
    function i(i, t, a, e) {
        this.village = i,
        this.candidate_squad = t,
        this.option_id = a,
        this.use_premium = e
    }
    return i.prototype = {
        successCallback: function() {},
        errorCallback: function(i) {},
        getPayload: function() {
            return {
                village_id: this.village.village_id,
                candidate_squad: {
                    unit_counts: this.candidate_squad.unit_counts,
                    carry_max: this.candidate_squad.carry_max
                },
                option_id: this.option_id,
                use_premium: this.use_premium
            }
        }
    },
    i
});

;