/**** game/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadController.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/ViewEvents", "Ig/TribalWars/Modules/Scavenging/CandidateSquad", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/StateReductionActions", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadStateReducer"], function(e, i, n, o, d) {
    "use strict";
    function t() {
        e.apply(this)
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        _watchModels: function() {
            var t = this._widget
              , e = this._models.candidate_squad;
            this._watchModelForEvent(e, n.EVENT_CARRY_MAX_CHANGED, function(e) {
                t.update(Timing.getCurrentServerTime())
            })
        },
        _watchView: function() {
            var a = this._models.candidate_squad
              , r = this._models.village
              , t = this._models.sendable_units
              , n = this._widget;
            this._watchViewForEvent(i.USER_STARTED_EDITING, function(e) {
                var t = Timing.getCurrentServerTime();
                n.applyActionToState(o.USER_EDIT_MODE_ENTER, {}, t)
            }),
            this._watchViewForEvent(i.USER_STOPPED_EDITING, function(e) {
                var t = Timing.getCurrentServerTime();
                n.applyActionToState(o.USER_EDIT_MODE_EXIT, {}, t)
            }),
            this._watchViewForEvent(i.UNIT_COUNT_EDITED, function(e) {
                var t = Timing.getCurrentServerTime();
                a.setUnitCount(e.unit_type, e.new_count),
                n.update(t)
            }),
            this._watchViewForEvent(i.FILL_AVAILABLE_PRESSED, function(e) {
                var t = a.unit_counts[e.unit_type]
                  , i = r.unit_counts_home[e.unit_type]
                  , n = $.extend({}, a.unit_counts);
                n[e.unit_type] = t === i ? 0 : i,
                a.setUnitCounts(n)
            }),
            this._watchViewForEvent(i.FILL_ALL_PRESSED, function(e) {
                if (n.getNextState(Timing.getCurrentServerTime()).fill_all_mode === d.FILL_ALL_MODE_INSERT) {
                    var i = {};
                    $.each(t, function(e, t) {
                        i[e] = r.unit_counts_home[e]
                    }),
                    a.setUnitCounts(i)
                } else
                    a.wipeUnitCounts();
                n.applyActionToState(o.FILL_ALL_MODE_TOGGLE, {})
            })
        }
    }),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/StateReductionActions"], function(e, t) {
    "use strict";
    function n() {
        e.apply(this)
    }
    return n.FILL_ALL_MODE_INSERT = "insert",
    n.FILL_ALL_MODE_ERASE = "erase",
    n.prototype = Object.create(e.prototype),
    $.extend(n.prototype, {
        newStateFromNothing: function() {
            return {
                sendable_units: null,
                unit_counts: {},
                unit_counts_available: {},
                carry_max: null,
                is_user_editing: !1,
                fill_all_mode: n.FILL_ALL_MODE_INSERT
            }
        },
        newStateFromModels: function(e, t, n) {
            var a = t.candidate_squad
              , _ = $.extend(!0, {}, e);
            return null === _.sendable_units && (_.sendable_units = {},
            $.each(t.sendable_units, function(e, t) {
                _.sendable_units[e] = {
                    name: t.name,
                    image: t.image
                }
            })),
            _.unit_counts = $.extend({}, a.unit_counts),
            t.village && (_.unit_counts_available = $.extend({}, t.village.unit_counts_home)),
            _.carry_max = a.carry_max,
            _
        }
    }),
    n.prototype._action_reducers[t.USER_EDIT_MODE_ENTER] = function(e, t, n) {
        var a = $.extend(!0, {}, e);
        return a.is_user_editing = !0,
        a
    }
    ,
    n.prototype._action_reducers[t.USER_EDIT_MODE_EXIT] = function(e, t, n) {
        var a = $.extend(!0, {}, e);
        return a.is_user_editing = !1,
        a
    }
    ,
    n.prototype._action_reducers[t.FILL_ALL_MODE_TOGGLE] = function(e, t, a) {
        var _ = n.FILL_ALL_MODE_INSERT
          , i = n.FILL_ALL_MODE_ERASE
          , r = $.extend(!0, {}, e);
        return r.fill_all_mode = r.fill_all_mode === _ ? i : _,
        r
    }
    ,
    n
});

;/**** game/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/ViewEvents"], function(t, a) {
    "use strict";
    function e() {
        t.apply(this)
    }
    return e.MAX_DIGITS_FOR_UNIT_COUNT = 5,
    e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        _initStructure: function(t) {
            var a = $(this.createHtml(t.sendable_units, t.unit_counts));
            this.$carry_max = a.find(".carry-max");
            var e = {};
            $.each(t.sendable_units, function(t, n) {
                e[t] = a.find("[name='" + t + "']")
            }),
            this.unit_inputs = e;
            var n = {};
            a.find(".units-entry-all").each(function() {
                var t = $(this);
                n[t.data("unit")] = t
            }),
            this.fill_available_buttons = n,
            this.$fill_all_button = a.find(".fill-all"),
            UnitPopup.initDescendantLinks(a),
            this._setRootElement(a)
        },
        createHtml: function(t, a) {
            return mobile ? this.createHtmlForMobile(t, a) : this.createHtmlForDesktop(t, a)
        },
        createHtmlForDesktop: function(t, a) {
            var e = this;
            return '<table class="candidate-squad-widget vis"><tr>' + Object.keys(t).map(function(a) {
                return "<th>" + e.createUnitIconHtml(t, a) + "</th>"
            }).join("") + '<th class="squad-village-required">' + _("b1c94ca2fbc3e78fc30069c8d0f01680") + '</th><th><span class="icon header res"></span></th></tr><tr>' + Object.keys(t).map(function(t) {
                return "<td>" + e.createUnitInputHtml(a, t) + "</td>"
            }).join("") + '<td class="squad-village-required"><a class="fill-all" href="#">' + _("abbc6cfbb90686218af7504917388601") + '</a></td><td class="carry-max"></td></tr></table>'
        },
        createHtmlForMobile: function(t, a) {
            var e = this;
            return '<table class="candidate-squad-widget vis">' + Object.keys(t).map(function(n) {
                return "<tr><td>" + e.createUnitIconHtml(t, n) + e.createUnitInputHtml(a, n) + "</td></tr>"
            }).join("") + '<tr class="squad-village-required"><td><a class="fill-all" href="#">&raquo; ' + _("abbc6cfbb90686218af7504917388601") + '</a></td></tr><tr><td><span class="icon header res"></span><span class="carry-max"></span></td></tr></table>'
        },
        createUnitIconHtml: function(t, a) {
            var e = t[a];
            return '<a href="#" class="unit_link" data-unit="' + a + '"><img src="' + Format.image_src(e.image) + '" title="' + e.name + '"/></a>'
        },
        createUnitInputHtml: function(t, a) {
            var n = mobile ? "number" : "text"
              , i = Math.pow(10, e.MAX_DIGITS_FOR_UNIT_COUNT) - 1;
            return '<input name="' + a + '" type="' + n + '" value="' + t[a] + '" maxlength="' + e.MAX_DIGITS_FOR_UNIT_COUNT + '" max="' + i + '" class="unitsInput input-nicer"><a href="#" class="units-entry-all squad-village-required" data-unit="' + a + '"></a>'
        },
        _initEventPublishing: function() {
            var t = this;
            $.each(this.unit_inputs, function(n, i) {
                i.on("keydown", function() {
                    t.trigger(a.USER_STARTED_EDITING, {})
                }),
                i.on("keyup focusout", function() {
                    t.trigger(a.USER_STOPPED_EDITING, {})
                }),
                i.on("change keyup", function() {
                    t.trigger(a.UNIT_COUNT_EDITED, {
                        unit_type: n,
                        new_count: parseInt(i.val().substr(0, e.MAX_DIGITS_FOR_UNIT_COUNT)) || 0
                    })
                })
            }),
            $.each(this.fill_available_buttons, function(e, n) {
                n.on("click", function(n) {
                    n.preventDefault(),
                    t.trigger(a.FILL_AVAILABLE_PRESSED, {
                        unit_type: e
                    })
                })
            }),
            this.$fill_all_button.on("click", function(e) {
                e.preventDefault(),
                t.trigger(a.FILL_ALL_PRESSED, {})
            })
        },
        _render: function(t, a) {
            t && a.carry_max === t.carry_max || this.$carry_max.html(Format.number(a.carry_max)),
            a.is_user_editing || $.each(this.unit_inputs, function(t, e) {
                e.val(a.unit_counts[t] || "")
            }),
            $.each(this.fill_available_buttons, function(e, n) {
                void 0 !== a.unit_counts_available[e] && (t && void 0 !== t.unit_counts_available[e] && a.unit_counts_available[e] === t.unit_counts_available[e] || n.html("(" + a.unit_counts_available[e] + ")"))
            })
        }
    }),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadView", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadStateReducer"], function(i, n, r, l) {
    "use strict";
    function e(e, a, t, d) {
        i.apply(this),
        this._models = {
            village: e,
            sendable_units: t,
            candidate_squad: a,
            report_units: d
        },
        this._services = {},
        this._view = new n,
        this._controller = new r,
        this._state_reducer = new l
    }
    return e.prototype = Object.create(i.prototype),
    $.extend(e.prototype, {}),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/StateReductionActions.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/StateReductionActions", ["module"], function(e) {
    return {
        USER_EDIT_MODE_ENTER: e.id + "_user_edit_mode_enter",
        USER_EDIT_MODE_EXIT: e.id + "_user_edit_mode_exit",
        FILL_ALL_MODE_TOGGLE: e.id + "fill_all_mode_toggle"
    }
});

;/**** game/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/ViewEvents.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/ViewEvents", ["module"], function(e) {
    return {
        UNIT_COUNT_EDITED: e.id + "_unit_count_edited",
        USER_STARTED_EDITING: e.id + "_user_started_editing",
        USER_STOPPED_EDITING: e.id + "_user_stopped_editing",
        FILL_AVAILABLE_PRESSED: e.id + "_fill_available_pressed",
        FILL_ALL_PRESSED: e.id + "_fill_all_pressed"
    }
});

;/**** game/Modules/VillagePlace/ScavengeScreen/MainWidget/MainStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/MainWidget/MainStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer"], function(e) {
    "use strict";
    function t() {
        e.apply(this)
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        newStateFromNothing: function() {
            return {
                explanatory_text: _("75370026f13f56961bf45966807119e0")
            }
        },
        newStateFromModels: function(e, t, n) {
            var a = $.extend(!0, {}, e);
            return a.hide_candidate_squad_widget = t.village.areAllOptionsLocked(),
            a
        }
    }),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/MainWidget/MainView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/MainWidget/MainView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView"], function(t) {
    "use strict";
    function e() {
        t.apply(this)
    }
    return e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        _initStructure: function(t) {
            var e = $(this.createHtml());
            this.$explanatory_text = e.find(".explanatory-text"),
            this.$candidate_squad_container = e.find(".candidate-squad-container"),
            this.$options_container = e.find(".options-container"),
            this._setRootElement(e)
        },
        createHtml: function() {
            return '<div class="scavenge-screen-main-widget"><p class="explanatory-text"></p><div class="candidate-squad-container"></div><div class="options-container"></div></div>'
        },
        _render: function(t, e) {
            t && e.explanatory_text === t.explanatory_text || this.$explanatory_text.html(e.explanatory_text),
            t && e.hide_candidate_squad_widget === t.hide_candidate_squad_widget || this.$candidate_squad_container.toggle(!e.hide_candidate_squad_widget)
        }
    }),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/MainWidget/MainWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/MainWidget/MainWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/MainWidget/MainView", "Ig/TribalWars/Modules/Common/Widget/NullController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/MainWidget/MainStateReducer", "Ig/TribalWars/Modules/Scavenging/ScavengeOption", "Ig/TribalWars/Modules/Scavenging/ScavengingService", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionWidget"], function(e, i, a, t, s, n, d, l) {
    "use strict";
    function r(s, n, d, l, r, o, g) {
        e.apply(this),
        this._models = {
            village: s,
            candidate_squad: l,
            loot_calculator: r,
            sendable_units: o,
            report_units: g
        },
        this._services = {
            scavenging_service: n,
            dialog_launcher: d
        },
        this._view = new i,
        this._controller = new a,
        this._state_reducer = new t
    }
    return r.prototype = Object.create(e.prototype),
    $.extend(r.prototype, {
        _did_sub_widgets_init: !1,
        _initSubWidgets: function(e, i, a) {
            if (!this._did_sub_widgets_init) {
                var t = this
                  , s = this._models.candidate_squad
                  , n = this._models.loot_calculator
                  , r = this._models.village
                  , o = this._services.scavenging_service
                  , g = this._services.dialog_launcher;
                this._addSubWidget("candidate_squad", new d(r,s,this._models.sendable_units,this._models.report_units), this._view.$candidate_squad_container);
                var c = this._view.$options_container;
                $.each(this._models.village.options, function(e, i) {
                    var d = "option_" + e
                      , _ = new l(r,i,o,g,s,n);
                    t._addSubWidget(d, _, c, !1, a)
                }),
                this._did_sub_widgets_init = !0
            }
        }
    }),
    r
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer"], function(e) {
    "use strict";
    function t() {
        e.apply(this)
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        newStateFromNothing: function() {
            return {
                res_label: _("c5407b61c34b810d7adf6ce8ddb4e939"),
                free_button_label: _("a6122a65eaa676f700ae68d393054a37"),
                premium_boost_percent: null,
                premium_button_label: null,
                premium_button_hide: null,
                wood: null,
                stone: null,
                iron: null,
                seconds_remaining: null,
                overdue: !1
            }
        },
        newStateFromModels: function(e, t, o) {
            var n = $.extend(!0, {}, e)
              , r = t.option;
            if (!r.hasActiveSquad())
                return n;
            var i = r.scavenging_squad;
            return null === n.premium_boost_percent && (n.premium_boost_percent = r.getPremiumLootBoostPercent()),
            null === n.premium_button_label && (n.premium_button_label = s("+%1%", n.premium_boost_percent)),
            null === n.premium_button_hide && (n.premium_button_hide = !r.isPremiumLootBoostEnabled()),
            n.wood = i.loot_res.wood,
            n.stone = i.loot_res.stone,
            n.iron = i.loot_res.iron,
            n.seconds_remaining = i.return_time - o / 1e3,
            n.seconds_remaining < -3 && (n.overdue = !0),
            n
        }
    }),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView"], function(e) {
    "use strict";
    function n() {
        e.apply(this)
    }
    return n.prototype = Object.create(e.prototype),
    $.extend(n.prototype, {
        _initStructure: function(e) {
            var n = $(this.createHtml());
            this.$res_label = n.find(".res-label"),
            this.$wood = n.find(".wood-value"),
            this.$stone = n.find(".stone-value"),
            this.$iron = n.find(".iron-value"),
            this.$return_countdown = n.find(".return-countdown"),
            this._setRootElement(n)
        },
        createHtml: function() {
            return '<div class="active-view"><div class="res-label"></div><ul class="preview"><li><span class="icon header wood"></span><span class="wood-value"></span></li><li><span class="icon header stone"></span><span class="stone-value"></span></li><li><span class="icon header iron"></span><span class="iron-value"></span></li><li><span class="icon header time"></span><span class="return-countdown"></span></li></ul></div>'
        },
        _initEventPublishing: function() {},
        _render: function(e, n) {
            e && n.res_label === e.res_label || this.$res_label.html(n.res_label),
            e && n.wood === e.wood || this.$wood.html(Format.number(n.wood)),
            e && n.stone === e.stone || this.$stone.html(Format.number(n.stone)),
            e && n.iron === e.iron || this.$iron.html(Format.number(n.iron)),
            n.overdue ? e && n.overdue === e.overdue || this.$return_countdown.html(Format.overdueAnchor()) : e && n.seconds_remaining === e.seconds_remaining || this.$return_countdown.html(Format.timeSpan(Math.max(0, 1e3 * n.seconds_remaining)))
        }
    }),
    n
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveView", "Ig/TribalWars/Modules/Common/Widget/NullController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveStateReducer"], function(e, t, i, o) {
    "use strict";
    function a(a, l, r, c, n) {
        e.apply(this),
        this._models = {
            option: a,
            candidate_squad: c,
            loot_calculator: n
        },
        this._services = {
            scavenging_service: l,
            dialog_launcher: r
        },
        this._view = new t,
        this._controller = new i,
        this._state_reducer = new o
    }
    return a.prototype = Object.create(e.prototype),
    $.extend(a.prototype, {}),
    a
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveController.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/ViewEvents", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/StateReductionActions", "Ig/TribalWars/Modules/Scavenging/CandidateSquad", "Ig/TribalWars/Modules/Scavenging/SendSquadRequest"], function(e, t, u, n, d) {
    "use strict";
    function i() {
        e.apply(this)
    }
    return i.prototype = Object.create(e.prototype),
    $.extend(i.prototype, {
        _watchModels: function() {
            var t = this._widget
              , e = this._models.candidate_squad;
            this._watchModelForEvent(e, n.EVENT_CARRY_MAX_CHANGED, function(e) {
                t.update(Timing.getCurrentServerTime())
            })
        },
        _watchView: function() {
            var o = this._widget
              , r = this._models.option
              , s = this._models.candidate_squad
              , c = this._services.scavenging_service
              , l = this._models.village
              , i = function(e) {
                var t = Timing.getCurrentServerTime();
                if (!o.getNextState(t).are_buttons_disabled) {
                    var n = function() {
                        var e = Timing.getCurrentServerTime();
                        o.applyActionToState(u.END_SEND_SQUAD_REQUEST, {}, e),
                        o.update(e)
                    }
                      , i = n
                      , a = new d(l,s,r.getId(),e);
                    a.successCallback = function() {
                        UI.SuccessMessage(_("21aaf80b8e000e8bc2836cc00594dfbd")),
                        s.setUnitCounts({})
                    }
                    ,
                    a.errorCallback = function(e) {
                        UI.ErrorMessage(e)
                    }
                    ,
                    o.applyActionToState(u.START_SEND_SQUAD_REQUEST, {}, t),
                    o.update(t),
                    c.sendSquads([a], function(e) {
                        e.length && console.log("there were invalid villages but i dont know what to do about it", e),
                        n()
                    }, i)
                }
            };
            this._watchViewForEvent(t.FREE_SEND_TROOPS_PRESSED, function(e) {
                i(!1)
            }),
            this._watchViewForEvent(t.PREMIUM_SEND_TROOPS_PRESSED, function(e) {
                var t = o.getNextState(Timing.getCurrentServerTime())
                  , n = {
                    createContentHtml: function(e) {
                        return e + "<br/><br/>" + Format.resChange(t.res, t.res_boosted)
                    }
                };
                Premium.check(r.getPremiumLootBoostFeature(), t.pp_cost_boost, function() {
                    i(!0)
                }, null, null, n)
            })
        }
    }),
    i
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/StateReductionActions"], function(e, t) {
    "use strict";
    function o() {
        e.apply(this)
    }
    return o.prototype = Object.create(e.prototype),
    $.extend(o.prototype, {
        newStateFromNothing: function() {
            return {
                free_button_label: _("113e916e256ff77c93e2c59d693840a3"),
                premium_boost_percent: null,
                premium_button_label: null,
                premium_button_hide: null,
                squad_capacity: null,
                res: {
                    wood: 0,
                    stone: 0,
                    iron: 0
                },
                res_boosted: {
                    wood: 0,
                    stone: 0,
                    iron: 0
                },
                pp_cost_boost: null,
                duration_seconds: null,
                are_buttons_disabled: !1,
                waiting_send_squad_request: !1
            }
        },
        newStateFromModels: function(e, t, o) {
            var a = t.option
              , n = $.extend(!0, {}, e);
            if (null === n.premium_boost_percent && (n.premium_boost_percent = a.getPremiumLootBoostPercent()),
            null === n.premium_button_label && (n.premium_button_label = s("+%1%", n.premium_boost_percent)),
            null === n.premium_button_hide && (n.premium_button_hide = !a.isPremiumLootBoostEnabled()),
            n.squad_capacity !== t.candidate_squad.carry_max) {
                n.squad_capacity = t.candidate_squad.carry_max;
                var r = a.calcLoot(n.squad_capacity, !1);
                n.res = t.loot_calculator.calcResDistribution(r);
                var i = a.calcLoot(n.squad_capacity, !0);
                n.res_boosted = t.loot_calculator.calcResDistribution(i),
                n.duration_seconds = a.calcDurationSeconds(n.squad_capacity),
                n.pp_cost_boost = a.calcPremiumCost(n.squad_capacity)
            }
            return n
        },
        _action_reducers: {}
    }),
    o.prototype._action_reducers[t.START_SEND_SQUAD_REQUEST] = function(e, t, o) {
        var a = $.extend(!0, {}, e);
        return a.waiting_send_squad_request = !0,
        a.are_buttons_disabled = !0,
        a
    }
    ,
    o.prototype._action_reducers[t.END_SEND_SQUAD_REQUEST] = function(e, t, o) {
        var a = $.extend(!0, {}, e);
        return a.waiting_send_squad_request = !1,
        a.are_buttons_disabled = !1,
        a
    }
    ,
    o
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/ViewEvents", "Ig/TribalWars/Modules/Scavenging/PremiumLootBoostTooltip"], function(e, i, n) {
    "use strict";
    function t() {
        e.apply(this)
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        _initStructure: function(e) {
            var t = $(this.createHtml());
            this.$squad_preview_container = t.find(".squad_preview_container"),
            this.$free_button = t.find(".free_send_button"),
            this.$premium_button = t.find(".premium_send_button"),
            this._setRootElement(t)
        },
        createHtml: function() {
            return '<div class="inactive-view"><div class="squad_preview_container"></div><div class="action-container"><a href="#" class="btn btn-default free_send_button"></a><a href="#" class="btn btn-pp premium_send_button"></a></div></div>'
        },
        _initEventPublishing: function() {
            var t = this;
            this.$free_button.on("click", function(e) {
                e.preventDefault(),
                t.trigger(i.FREE_SEND_TROOPS_PRESSED, {})
            }),
            this.$premium_button.on("click", function(e) {
                e.preventDefault(),
                t.trigger(i.PREMIUM_SEND_TROOPS_PRESSED, {})
            })
        },
        _render: function(e, t) {
            var i = !1;
            e && t.res.wood === e.res.wood || (i = !0),
            e && t.res.stone === e.res.stone || (i = !0),
            e && t.res.iron === e.res.iron || (i = !0),
            i && new n(t.premium_boost_percent,t.res,t.res_boosted,t.pp_cost_boost).applyTo(this.$premium_button),
            e && t.free_button_label === e.free_button_label || this.$free_button.html(t.free_button_label),
            e && t.premium_button_label === e.premium_button_label || this.$premium_button.html(t.premium_button_label),
            e && t.premium_button_hide === e.premium_button_hide || this.$premium_button.toggle(!t.premium_button_hide),
            this.$free_button.toggleClass("btn-disabled", t.are_buttons_disabled),
            this.$premium_button.toggleClass("btn-disabled", t.are_buttons_disabled)
        }
    }),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveView", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveStateReducer", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewWidget"], function(d, l, o, c, n) {
    "use strict";
    function e(e, i, t, a, n, s) {
        d.apply(this),
        this._models = {
            village: e,
            option: i,
            candidate_squad: n,
            loot_calculator: s
        },
        this._services = {
            scavenging_service: t,
            dialog_launcher: a
        },
        this._view = new l,
        this._controller = new o,
        this._state_reducer = new c
    }
    return e.prototype = Object.create(d.prototype),
    $.extend(e.prototype, {
        _did_sub_widgets_init: !1,
        _initSubWidgets: function(e, i, t) {
            if (!this._did_sub_widgets_init) {
                var a = new n(this._models.option,this._models.candidate_squad,this._models.loot_calculator);
                this._addSubWidget("squad_preview", a, this._view.$squad_preview_container, !0, t),
                this._did_sub_widgets_init = !0
            }
        }
    }),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/StateReductionActions.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/StateReductionActions", ["module"], function(e) {
    return {
        START_SEND_SQUAD_REQUEST: e.id + "_start_send_squad_request",
        END_SEND_SQUAD_REQUEST: e.id + "_end_send_squad_request"
    }
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/ViewEvents.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/ViewEvents", ["module"], function(e) {
    return {
        FREE_SEND_TROOPS_PRESSED: e.id + "_free_send_troops_pressed",
        PREMIUM_SEND_TROOPS_PRESSED: e.id + "_premium_send_troops_pressed"
    }
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedController.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/ViewEvents"], function(e, o) {
    "use strict";
    function t() {
        e.apply(this)
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        _watchView: function() {
            var e = this._models.option
              , t = this._services.dialog_launcher;
            this._watchViewForEvent(o.UNLOCK_PRESSED, function() {
                t.openUnlockOptionDialog(e.getId())
            })
        }
    }),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer"], function(e) {
    "use strict";
    function t() {
        e.apply(this)
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        newStateFromNothing: function() {
            return {
                unlock_button_text: _("7e7123b0d269ad5d9ec8d12c52a8ed8a")
            }
        },
        newStateFromModels: function(e, t, o) {
            t.option;
            return $.extend(!0, {}, e)
        }
    }),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/ViewEvents"], function(t, n) {
    "use strict";
    function e() {
        t.apply(this)
    }
    return e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        _initStructure: function(t) {
            var e = $(this.createHtml());
            this.$squad_preview_container = e.find(".squad_preview_container"),
            this.$unlock_button = e.find(".unlock-button"),
            this._setRootElement(e)
        },
        createHtml: function() {
            return '<div class="locked-view"><div class="lock"></div><div class="action-container"><a href="#" class="btn btn-default unlock-button"></a></div></div>'
        },
        _initEventPublishing: function() {
            var e = this;
            this.$unlock_button.on("click", function(t) {
                t.preventDefault(),
                e.trigger(n.UNLOCK_PRESSED, {})
            })
        },
        _render: function(t, e) {
            t && e.unlock_button_text === t.unlock_button_text || this.$unlock_button.html(e.unlock_button_text)
        }
    }),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedView", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedStateReducer", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewWidget"], function(c, l, r, n, e) {
    "use strict";
    function t(e, t, i, o, a) {
        c.apply(this),
        this._models = {
            option: e,
            candidate_squad: o,
            loot_calculator: a
        },
        this._services = {
            scavenging_service: t,
            dialog_launcher: i
        },
        this._view = new l,
        this._controller = new r,
        this._state_reducer = new n
    }
    return t.prototype = Object.create(c.prototype),
    $.extend(t.prototype, {}),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/ViewEvents.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/ViewEvents", ["module"], function(e) {
    return {
        UNLOCK_PRESSED: e.id + "_unlock_pressed"
    }
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer"], function(e) {
    "use strict";
    function n() {
        e.apply(this)
    }
    return n.prototype = Object.create(e.prototype),
    $.extend(n.prototype, {
        newStateFromNothing: function() {
            return {
                seconds_remaining: null,
                overdue: !1
            }
        },
        newStateFromModels: function(e, n, t) {
            var o = n.option
              , r = $.extend(!0, {}, e);
            return r.seconds_remaining = o.unlock_time - t / 1e3,
            r.seconds_remaining < -3 && (r.overdue = !0),
            r
        }
    }),
    n
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView"], function(n) {
    "use strict";
    function t() {
        n.apply(this)
    }
    return t.prototype = Object.create(n.prototype),
    $.extend(t.prototype, {
        _initStructure: function(n) {
            var t = $(this.createHtml());
            this.$unlock_countdown_text = t.find(".unlock-countdown-text"),
            this._setRootElement(t)
        },
        createHtml: function() {
            return '<div class="unlocking-view"><div class="lock"></div><div class="unlock-countdown"><span class="unlock-countdown-icon"></span><span class="unlock-countdown-text"></span></div></div>'
        },
        _render: function(n, t) {
            t.overdue ? n && t.overdue === n.overdue || this.$unlock_countdown_text.html(Format.overdueAnchor()) : n && t.seconds_remaining === n.seconds_remaining || this.$unlock_countdown_text.html(Format.timeSpan(Math.max(0, 1e3 * t.seconds_remaining)))
        }
    }),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingView", "Ig/TribalWars/Modules/Common/Widget/NullController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingStateReducer"], function(e, i, t, n) {
    "use strict";
    function o(o, l, a, r, c) {
        e.apply(this),
        this._models = {
            option: o,
            candidate_squad: r,
            loot_calculator: c
        },
        this._services = {
            scavenging_service: l,
            dialog_launcher: a
        },
        this._view = new i,
        this._controller = new t,
        this._state_reducer = new n
    }
    return o.prototype = Object.create(e.prototype),
    $.extend(o.prototype, {}),
    o
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer"], function(t) {
    "use strict";
    function e() {
        t.apply(this)
    }
    return e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        newStateFromNothing: function() {
            return {
                title: null,
                option_status: null,
                is_locked: null,
                portrait_url: null,
                show_portrait: null
            }
        },
        newStateFromModels: function(t, e, r) {
            var o = e.option
              , n = $.extend(!0, {}, t);
            if (null === n.title && (n.title = o.getName()),
            n.is_locked = o.is_locked,
            !t || n.locked !== t.is_locked) {
                var i = "scavenging/options/";
                o.is_locked && (i += "gray/"),
                n.portrait_url = Format.image_src(i + o.getId() + ".png"),
                n.portrait_url_transparent = Format.image_src(i + o.getId() + "_transparent.png")
            }
            return n.show_portrait = !!e.village,
            n.option_status = o.getStatus(),
            n
        }
    }),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView"], function(t) {
    "use strict";
    function i() {
        t.apply(this)
    }
    return i.prototype = Object.create(t.prototype),
    $.extend(i.prototype, {
        _initStructure: function(t) {
            var i = $(this.createHtml(t));
            this.$portrait = i.find(".portrait"),
            this.$title = i.find(".title"),
            this.$status_specific = i.find(".status-specific"),
            this._setRootElement(i)
        },
        createHtml: function(t) {
            return '<div class="scavenge-option border-frame-gold-red"><div class="portrait"></div><div class="title"></div><div class="status-specific"></div></div>'
        },
        _render: function(t, i) {
            t && i.title === t.title || this.$title.html(i.title),
            t && i.portrait_url === t.portrait_url || this.$portrait.css({
                "background-image": "url(" + i.portrait_url + ")"
            }),
            i.show_portrait || t && i.portrait_url_transparent === t.portrait_url_transparent || this.$status_specific.css({
                "background-image": "url(" + i.portrait_url_transparent + ")"
            }),
            this.$portrait.toggle(i.show_portrait)
        }
    }),
    i
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionView", "Ig/TribalWars/Modules/Common/Widget/NullController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionStateReducer", "Ig/TribalWars/Modules/Scavenging/ScavengeOption", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionLockedWidget/OptionLockedWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionUnlockingWidget/OptionUnlockingWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionInactiveWidget/OptionInactiveWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionActiveWidget/OptionActiveWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassWidget"], function(e, t, i, a, n, s, o, c, l, r) {
    "use strict";
    function g(n, s, o, c, l, r) {
        e.apply(this),
        this._models = {
            village: n,
            option: s,
            candidate_squad: l,
            loot_calculator: r
        },
        this._services = {
            scavenging_service: o,
            dialog_launcher: c
        },
        this._view = new t,
        this._controller = new i,
        this._state_reducer = new a
    }
    return g.STATUS_SPECIFIC_SUBWIDGET_KEY = "status_specific",
    g.prototype = Object.create(e.prototype),
    $.extend(g.prototype, {
        _getObsoleteSubWidgetKeys: function(e, t) {
            return t.option_status !== e.option_status ? [g.STATUS_SPECIFIC_SUBWIDGET_KEY] : []
        },
        _initSubWidgets: function(e, t, i) {
            if (!e || t.option_status !== e.option_status) {
                var a = this.createStatusSpecificWidget(t.option_status);
                this._addSubWidget(g.STATUS_SPECIFIC_SUBWIDGET_KEY, a, this._view.$status_specific, !1, i)
            }
        },
        createStatusSpecificWidget: function(e) {
            var t = this._models.village
              , i = this._models.option
              , a = this._models.candidate_squad
              , g = this._models.loot_calculator
              , d = this._services.scavenging_service
              , u = this._services.dialog_launcher;
            if (!t)
                return new r(i,a,g);
            switch (e) {
            default:
            case n.STATUS_LOCKED:
                return new s(i,d,u,a,g);
            case n.STATUS_UNLOCKING:
                return new o(i,d,u,a,g);
            case n.STATUS_INACTIVE:
                return new c(t,i,d,u,a,g);
            case n.STATUS_ACTIVE:
                return new l(i,d,u,a)
            }
        }
    }),
    g
});

;/**** game/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewController.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController", "Ig/TribalWars/Modules/Scavenging/CandidateSquad"], function(e, r) {
    "use strict";
    function t() {
        e.apply(this)
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        _watchModels: function() {
            var t = this._widget
              , e = this._models.candidate_squad;
            this._watchModelForEvent(e, r.EVENT_CARRY_MAX_CHANGED, function(e) {
                t.update(Timing.getCurrentServerTime())
            }),
            this._watchModelForEvent(e, r.EVENT_SENDABLE_CHANGED, function(e) {
                t.update(Timing.getCurrentServerTime())
            })
        }
    }),
    t
});

;/**** game/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer"], function(a) {
    "use strict";
    function e() {
        a.apply(this)
    }
    return e.prototype = Object.create(a.prototype),
    $.extend(e.prototype, {
        newStateFromNothing: function() {
            return {
                res_label: _("434f83bf5c25bb6490453374be345f97"),
                squad_capacity: null,
                res: {
                    wood: 0,
                    stone: 0,
                    iron: 0
                },
                duration_seconds: null,
                hide_duration: !0
            }
        },
        newStateFromModels: function(a, e, t) {
            var c = e.option
              , r = $.extend(!0, {}, a);
            if (r.squad_capacity !== e.candidate_squad.carry_max) {
                r.squad_capacity = e.candidate_squad.carry_max;
                var n = c.calcLoot(r.squad_capacity, !1);
                r.res = e.loot_calculator.calcResDistribution(n),
                r.duration_seconds = c.calcDurationSeconds(r.squad_capacity)
            }
            return r.hide_duration = !e.candidate_squad.sendable,
            r
        }
    }),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView"], function(e) {
    "use strict";
    function s() {
        e.apply(this)
    }
    return s.prototype = Object.create(e.prototype),
    $.extend(s.prototype, {
        _initStructure: function(e) {
            var s = $(this.createHtml());
            this.$res_label = s.find(".res-label"),
            this.$wood = s.find(".wood-value"),
            this.$stone = s.find(".stone-value"),
            this.$iron = s.find(".iron-value"),
            this.$duration = s.find(".duration"),
            this.$duration_section = s.find(".duration-section"),
            this._setRootElement(s)
        },
        createHtml: function() {
            return '<div class="squad-preview"><div class="res-label"></div><ul class="preview"><li><span class="icon header wood"></span><span class="wood-value"></span></li><li><span class="icon header stone"></span><span class="stone-value"></span></li><li><span class="icon header iron"></span><span class="iron-value"></span></li><li class="duration-section"><span class="icon header time"></span><span class="duration"></span></li></ul></div>'
        },
        _render: function(e, s) {
            e && s.res_label === e.res_label || this.$res_label.html(s.res_label),
            e && s.res.wood === e.res.wood || this.$wood.html(Format.number(s.res.wood)),
            e && s.res.stone === e.res.stone || this.$stone.html(Format.number(s.res.stone)),
            e && s.res.iron === e.res.iron || this.$iron.html(Format.number(s.res.iron)),
            e && s.duration_seconds === e.duration_seconds || this.$duration.html(Format.timeSpan(1e3 * s.duration_seconds)),
            e && s.hide_duration === e.hide_duration || this.$duration_section.toggle(!s.hide_duration)
        }
    }),
    s
});

;/**** game/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewView", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewStateReducer"], function(r, t, l, d) {
    "use strict";
    function e(e, a, i) {
        r.apply(this),
        this._models = {
            option: e,
            candidate_squad: a,
            loot_calculator: i
        },
        this._services = {},
        this._view = new t,
        this._controller = new l,
        this._state_reducer = new d
    }
    return e.prototype = Object.create(r.prototype),
    $.extend(e.prototype, {}),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/DialogLauncher.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/DialogLauncher", ["Ig/TribalWars/Modules/Scavenging/Widgets/UnlockOptionDialog/UnlockOptionWidget"], function(e) {
    function i(e, i, n, t) {
        this.village = e,
        this.scavenging_service = i,
        this.rate_schedule = n,
        this.amount_schedule = t
    }
    return i.prototype = {
        openUnlockOptionDialog: function(i, n) {
            var t = "unlock-option-" + i
              , l = new e(this.village ? this.village : n,i,this.scavenging_service,this.rate_schedule,this.amount_schedule);
            Dialog.openWidget(t, l)
        }
    },
    i
});

;/**** game/Modules/VillagePlace/ScavengeScreen/ScavengeScreen.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/ScavengeScreen", ["Ig/TribalWars/Modules/Scavenging/ScavengeOption", "Ig/TribalWars/Modules/Scavenging/ScavengingService", "Ig/TribalWars/Modules/Scavenging/ScavengeVillage", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/MainWidget/MainWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/DialogLauncher", "Ig/TribalWars/Modules/Scavenging/ScavengeVillageSynchronizer", "Ig/TribalWars/Modules/Farming/LootCalculator", "Ig/TribalWars/Modules/Units/UnitsCalculator", "Ig/TribalWars/Modules/Scavenging/CandidateSquad"], function(e, r, c, i, o, n, g, u, h) {
    "use strict";
    function a(e, i, n, a, t, s, l) {
        this.village = i instanceof c ? i : c.createFromDTO(e, i),
        this.scavenging_service = new r,
        this.rate_schedule = ResourcesForecaster.Factory.createResourcesSchedule(t),
        this.amount_schedule = ResourcesForecaster.Factory.createResourcesInVillageSchedule(s),
        this.dialog_launcher = new o(this.village,this.scavenging_service,this.rate_schedule,this.amount_schedule),
        this.sendable_units = n,
        this.loot_calculator = new g(n),
        this.units_calculator = new u(n),
        this.report_units = l,
        this.candidate_squad = new h(this.loot_calculator,this.units_calculator,this.village,a)
    }
    return a.prototype = {
        village_synchronizer: null,
        init: function() {
            this.initVillageSynchronization(),
            this.initUI()
        },
        initVillageSynchronization: function() {
            var e = this;
            this.village.on(c.EVENT_RALLY_POINT_DESTROYED, function() {
                e.redirectBecauseScreenIsInvalid()
            }),
            this.initVillageSynchronizer()
        },
        initVillageSynchronizer: function() {
            var e = {};
            e[this.village.village_id] = this.village,
            this.village_synchronizer = new n(e,this.scavenging_service);
            var i = this;
            $(TribalWars).on("global_tick.scavenge_screen", function() {
                i.village_synchronizer.processTiming(),
                i.village_synchronizer.updateFromGameVillage(game_data.village)
            }),
            this.village_synchronizer.on(n.EVENT_DETECTED_LOST_VILLAGES, function(e) {
                i.redirectBecauseScreenIsInvalid()
            })
        },
        initUI: function() {
            var e = new i(this.village,this.scavenging_service,this.dialog_launcher,this.candidate_squad,this.loot_calculator,this.sendable_units,this.report_units);
            e.init($("#scavenge_screen")),
            $(TribalWars).on("global_tick.scavenge_screen", function() {
                e.update(Timing.getCurrentServerTime())
            })
        },
        unload: function() {
            $(TribalWars).off("global_tick.scavenge_screen")
        },
        redirectBecauseScreenIsInvalid: function() {
            console.log("redirecting because screen is invalid"),
            setTimeout(function() {
                TribalWars.redirect("place")
            }, 2e3)
        },
        updateInputs: function() {
            var a = this;
            $(".unitsInput").each(function(e, i) {
                var n = i.name;
                $(i).val(a.report_units[n]),
                $(i).trigger("keyup")
            })
        }
    },
    a
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassController.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController", "Ig/TribalWars/Modules/Scavenging/CandidateSquad"], function(e, t) {
    "use strict";
    function n() {
        e.apply(this)
    }
    return n.prototype = Object.create(e.prototype),
    $.extend(n.prototype, {
        _watchModels: function() {
            var e = this._widget
              , n = this._models.candidate_squad;
            this._watchModelForEvent(n, t.EVENT_CARRY_MAX_CHANGED, function(t) {
                e.update(Timing.getCurrentServerTime())
            })
        },
        _watchView: function() {},
        _watchSubWidgets: function() {},
        _eventNamesToAlwaysBubble: function() {
            return []
        }
    }),
    n
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer"], function(t) {
    "use strict";
    function e() {
        t.apply(this)
    }
    return e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        newStateFromNothing: function() {
            return {
                premium_boost_percent: null,
                premium_button_label: null,
                premium_button_hide: null,
                squad_capacity: null,
                res: {
                    wood: 0,
                    stone: 0,
                    iron: 0
                },
                res_boosted: {
                    wood: 0,
                    stone: 0,
                    iron: 0
                },
                pp_cost_boost: null,
                duration_seconds: null
            }
        },
        newStateFromModels: function(t, e, o) {
            var a = e.option
              , c = $.extend(!0, {}, t);
            if (null === c.premium_button_hide && (c.premium_button_hide = !a.isPremiumLootBoostEnabled()),
            null === c.premium_boost_percent && (c.premium_boost_percent = a.getPremiumLootBoostPercent()),
            c.squad_capacity !== e.candidate_squad.carry_max) {
                c.squad_capacity = e.candidate_squad.carry_max;
                var r = a.calcLoot(c.squad_capacity, !1);
                c.res = e.loot_calculator.calcResDistribution(r);
                var n = a.calcLoot(c.squad_capacity, !0);
                c.res_boosted = e.loot_calculator.calcResDistribution(n),
                c.duration_seconds = a.calcDurationSeconds(c.squad_capacity),
                c.pp_cost_boost = a.calcPremiumCost(c.squad_capacity)
            }
            return c
        },
        _action_reducers: {}
    }),
    e
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassView", ["Ig/TribalWars/Modules/Common/Widget/AbstractView", "Ig/TribalWars/Modules/Scavenging/PremiumLootBoostTooltip"], function(e, i) {
    "use strict";
    function o() {
        e.apply(this)
    }
    return o.prototype = Object.create(e.prototype),
    $.extend(o.prototype, {
        _initStructure: function(e) {
            var i = $(this.createHtml());
            this.$squad_preview_container = i.find(".squad_preview_container"),
            this.$premium_info = i.find(".scav-premium-info"),
            this._setRootElement(i)
        },
        createHtml: function() {
            return '<div class="mass-view"><div class="squad_preview_container"></div><div class="action-container"><img src="' + Format.image_src("/premium/coinbag_18x18.png") + '" class="scav-premium-info" /></div></div>'
        },
        _initEventPublishing: function() {},
        _render: function(e, o) {
            var t = !1;
            e && o.res.wood === e.res.wood || (t = !0),
            e && o.res.stone === e.res.stone || (t = !0),
            e && o.res.iron === e.res.iron || (t = !0),
            console.log(o),
            t && (e && (o.res.wood > 0 || o.res.stone > 0 || o.res.iron > 0) ? this.$premium_info.show() : this.$premium_info.hide(),
            new i(o.premium_boost_percent,o.res,o.res_boosted,o.pp_cost_boost).applyTo(this.$premium_info))
        }
    }),
    o
});

;/**** game/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassView", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassController", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionMassWidget/OptionMassStateReducer", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/SquadPreviewWidget/SquadPreviewWidget"], function(e, i, t, s, a) {
    "use strict";
    function d(a, d, n) {
        e.apply(this),
        this._models = {
            option: a,
            candidate_squad: d,
            loot_calculator: n
        },
        this._services = {},
        this._view = new i,
        this._controller = new t,
        this._state_reducer = new s
    }
    return d.prototype = Object.create(e.prototype),
    $.extend(d.prototype, {
        _did_sub_widgets_init: !1,
        _initSubWidgets: function(e, i, t) {
            if (!this._did_sub_widgets_init) {
                var s = new a(this._models.option,this._models.candidate_squad,this._models.loot_calculator);
                this._addSubWidget("squad_preview", s, this._view.$squad_preview_container, !0, t),
                this._did_sub_widgets_init = !0
            }
        }
    }),
    d
});

;/**** game/Modules/VillagePlace/CallScreen.js ****/
define("Ig/TribalWars/Modules/VillagePlace/CallScreen", function() {
    "use strict";
    var e = function() {};
    return e.prototype = {
        $form: null,
        $table_container: null,
        selected_units: null,
        were_all_selected_with_single_click: !1,
        init: function() {
            var i = this;
            this.$table_container = $("#village_troup_list"),
            this.$table_container.on("change", ".troop-request-selector", function() {
                i.setRowSelected($(this).data("village-id"), $(this).is(":checked"))
            }),
            $(".evt-button-fill").on("click", function() {
                var e = $("select[name=template] > option:selected");
                return e.val() && i.fillFromTemplate(JSON.parse(e.val())),
                !1
            }),
            $("#place_call_select_all").on("change", function() {
                var e = $(this).is(":checked");
                i.selectAllVillages(e),
                i.were_all_selected_with_single_click = e
            }),
            i.$form = $("#place_call_form"),
            $("#place_call_form_submit").on("click", function(e) {
                if (i.were_all_selected_with_single_click) {
                    e.preventDefault();
                    var t = _("1c62a7ed80d0aa705fd06385a51e083d")
                      , l = [{
                        text: _("70d9be9b139893aa6c69b5e77e614311"),
                        callback: function() {
                            i.$form.submit()
                        },
                        confirm: !0
                    }];
                    UI.ConfirmationBox(t, l, "confirmation-box-place-call-selected-all", !1, !1, !0)
                }
            }),
            this.initSelectedUnits()
        },
        initSelectedUnits: function() {
            var e = $.cookie("call_troops_checkboxes");
            this.selected_units = e ? e.split("|") : window.game_data.units,
            $.each(this.selected_units, function() {
                $("#checkbox_" + this).attr("checked", !0)
            });
            var t = this;
            $(".unit_checkbox").change(function() {
                t.selected_units = $(".unit_checkbox:checked").map(function() {
                    return this.id.replace("checkbox_", "")
                }).get(),
                $.cookie("call_troops_checkboxes", t.selected_units.join("|"))
            })
        },
        selectAllVillages: function(e) {
            this.$table_container.find(".troop-request-selector").prop("checked", e).trigger("change")
        },
        setRowSelected: function(e, t) {
            var l = this.$table_container.find("#call_village_" + e);
            t ? (l.addClass("selected"),
            this.autoFillVillage(l)) : (l.removeClass("selected"),
            l.find(".call-unit-box").attr("disabled", "disabled"))
        },
        getDynamicAmount: function(e, t) {
            e = parseInt(e),
            t = parseInt(t);
            var l = 0 <= e ? e : t + e;
            return Math.max(0, Math.min(t, l))
        },
        autoFillVillage: function(e, c) {
            var a = this;
            c = c || {
                use_all: []
            },
            e.find("td").each(function() {
                var e = $(this)
                  , t = e.data("unit");
                if (t) {
                    var l = parseInt(e.data("count"))
                      , i = e.find(".call-unit-box");
                    if (0 < l && (i.removeAttr("disabled"),
                    a.isUnitSelected(t))) {
                        var n = c.hasOwnProperty(t) ? a.getDynamicAmount(c[t], l) : l;
                        -1 < c.use_all.indexOf(t) && (n = l),
                        e.find(".call-unit-box").val(Math.min(l, n))
                    }
                }
            })
        },
        getSelectedRows: function() {
            return this.$table_container.find("tr.selected")
        },
        isUnitSelected: function(e) {
            return -1 !== $.inArray(e, this.selected_units)
        },
        fillFromTemplate: function(t) {
            var l = this
              , e = this.getSelectedRows();
            e.length ? e.each(function() {
                var e = $(this);
                l.autoFillVillage(e, t)
            }) : UI.ErrorMessage(_("e2de3e69a94ab69d559db6811b57dcde"))
        }
    },
    e
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainController.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesView", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainView", "Ig/TribalWars/Modules/Scavenging/SendSquadRequest", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/StateReductionActions"], function(e, t, i, a, n) {
    "use strict";
    function s() {
        e.apply(this)
    }
    return s.prototype = Object.create(e.prototype),
    $.extend(s.prototype, {
        _watchModels: function() {},
        _watchView: function() {
            var e = this
              , s = Timing.getCurrentServerTime();
            e._watchViewForEvent(i.VIEW_EVENT_SEND, function(i) {
                var c = [];
                if ($.each(e._models.villages, function(t, n) {
                    $.each(n.options, function(t, s) {
                        s.is_pending && c.push(new a(n,e._models.candidate_squad,s.getId(),i.premium))
                    })
                }),
                0 !== c.length) {
                    var r = function() {
                        e._widget.applyActionToState(n.START_SEND_SQUAD_REQUEST, {}, s),
                        e._widget.update(s, !0),
                        e._services.scavenging_service.sendSquads(c, function(i) {
                            UI.SuccessMessage(_("21aaf80b8e000e8bc2836cc00594dfbd")),
                            e._models.candidate_squad.setUnitCounts({}),
                            e._widget.applyActionToState(n.END_SEND_SQUAD_REQUEST, {}, s),
                            e._widget.update(s, !0),
                            e._widget._sub_widgets.villages._view.trigger(t.VIEW_EVENT_UNITS_SENT)
                        }, function() {
                            e._widget.applyActionToState(n.END_SEND_SQUAD_REQUEST, {}, s),
                            e._widget.update(s, !0)
                        })
                    };
                    if (i.premium) {
                        var d = Object.values(e._models.villages).reduce(function(t, i) {
                            return t + i.calcPremiumCostOfPendingoptions(e._models.candidate_squad.carry_max)
                        }, 0);
                        Premium.check("ScavengingSquadLoot", d, r)
                    } else
                        r()
                }
            })
        },
        _watchSubWidgets: function() {
            var e = this
              , i = function() {
                e._widget.update(Timing.getCurrentServerTime(), !0)
            };
            this._watchSubWidgetsForEvent(t.VIEW_EVENT_CHECKBOX, i),
            this._watchSubWidgetsForEvent(t.VIEW_EVENT_CHECK_ROW, i),
            this._watchSubWidgetsForEvent(t.VIEW_EVENT_CHECK_COL, i)
        }
    }),
    s
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/StateReductionActions"], function(e, t) {
    "use strict";
    function n() {
        e.apply(this)
    }
    return n.prototype = Object.create(e.prototype),
    $.extend(n.prototype, {
        newStateFromNothing: function() {
            return {
                allow_sending: !1,
                send_in_progress: !1,
                premium_button_label: null,
                premium_button_hide: null,
                premium_boost_percent: null,
                squad_capacity: 0,
                villages: null
            }
        },
        newStateFromModels: function(e, t, n) {
            var i = $.extend(!0, {}, e);
            if (i.allow_sending = !1,
            $.each(t.villages, function(e, t) {
                if (t.getPendingOptionCount() > 0)
                    return i.allow_sending = !0,
                    !1
            }),
            null === i.villages && (i.villages = t.villages),
            null === i.premium_button_hide && Object.keys(t.villages).length > 0) {
                var r = t.villages[Object.keys(t.villages)[0]].options[1];
                i.premium_boost_percent = r.getPremiumLootBoostPercent(),
                i.premium_button_hide = !r.isPremiumLootBoostEnabled(),
                i.premium_button_label = s("+%1%", i.premium_boost_percent)
            }
            return i.squad_capacity = t.candidate_squad.carry_max,
            i
        }
    }),
    n.prototype._action_reducers[t.START_SEND_SQUAD_REQUEST] = function(e, t, n) {
        var i = $.extend(!0, {}, e);
        return i.send_in_progress = !0,
        i
    }
    ,
    n.prototype._action_reducers[t.END_SEND_SQUAD_REQUEST] = function(e, t, n) {
        var i = $.extend(!0, {}, e);
        return i.send_in_progress = !1,
        i
    }
    ,
    n
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainView", ["module", "Ig/TribalWars/Modules/Common/Widget/AbstractView"], function(t, e) {
    "use strict";
    function n() {
        e.apply(this)
    }
    return n.prototype = Object.create(e.prototype),
    n.VIEW_EVENT_SEND = t + "_EVENT_SEND",
    $.extend(n.prototype, {
        _initStructure: function(t) {
            var e = $(this.createHtml());
            this.$candidate_squad_container = e.find(".candidate-squad-container"),
            this.$options_container = e.find(".options-container"),
            this.$villages_container = e.find(".villages-container"),
            this.$send_button = e.find(".btn-send"),
            this.$send_premium_button = e.find(".btn-send-premium"),
            this._setRootElement(e)
        },
        createHtml: function() {
            return '<div class="scavenge-screen-main-widget"><div class="candidate-squad-container"></div><div class="options-container"></div><div class="buttons-container"><a href="#" class="btn btn-default btn-send">' + _("94966d90747b97d1f0f206c98a8b1ac3") + '</a><a href="#" class="btn btn-pp btn-send-premium"></a></div><div class="villages-container"></div></div>'
        },
        _initEventPublishing: function() {
            var t = this;
            this.$send_button.on("click", function() {
                return t.trigger(n.VIEW_EVENT_SEND, {
                    premium: !1
                }),
                !1
            }),
            this.$send_premium_button.on("click", function() {
                return t.trigger(n.VIEW_EVENT_SEND, {
                    premium: !0
                }),
                !1
            }),
            UI.ToolTip(this.$send_premium_button, {
                bodyHandler: function() {
                    var e = Object.values(t.state.villages).reduce(function(e, n) {
                        return e + n.calcPremiumCostOfPendingoptions(t.state.squad_capacity)
                    }, 0);
                    return _("69edde90a1c38b2efccc65419fc0e540") + ' <img style="vertical-align: -4px" src="' + Format.image_src("/premium/coinbag_18x18.png") + '" /> ' + e
                }
            })
        },
        _render: function(t, e) {
            this.$send_button.attr("disabled", !e.allow_sending || e.send_in_progress),
            this.$send_premium_button.attr("disabled", !e.allow_sending || e.send_in_progress),
            this.$send_premium_button.toggle(!e.premium_button_hide),
            t && t.premium_button_label === e.premium_button_label || this.$send_premium_button.text(e.premium_button_label)
        }
    }),
    n
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainView", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainController", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainStateReducer", "Ig/TribalWars/Modules/Scavenging/ScavengeOption", "Ig/TribalWars/Modules/Scavenging/ScavengingService", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/CandidateSquadWidget/CandidateSquadWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/OptionWidget/OptionWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesWidget"], function(e, i, a, s, t, n, l, d, o) {
    "use strict";
    function g(t, n, l, d, o, g, r) {
        e.apply(this),
        this._models = {
            villages: t,
            village_order: n,
            candidate_squad: o,
            sendable_units: r,
            option_bases: l,
            loot_calculator: g
        },
        this._services = {
            scavenging_service: d
        },
        this._view = new i,
        this._controller = new a,
        this._state_reducer = new s
    }
    return g.prototype = Object.create(e.prototype),
    $.extend(g.prototype, {
        _did_sub_widgets_init: !1,
        _initSubWidgets: function(e, i, a) {
            if (!this._did_sub_widgets_init) {
                var s = this;
                this._addSubWidget("candidate_squad", new l(null,this._models.candidate_squad,this._models.sendable_units), this._view.$candidate_squad_container);
                var n = t.createOptionsMap(s._models.option_bases, Object.keys(s._models.option_bases).map(function(e) {
                    return {
                        base_id: e,
                        village_id: 0
                    }
                }))
                  , g = this._view.$options_container;
                $.each(n, function(e, i) {
                    var t = "option_" + e
                      , n = new d(null,i,null,null,s._models.candidate_squad,s._models.loot_calculator);
                    s._addSubWidget(t, n, g, !1, a)
                }),
                s._addSubWidget("villages", new o(s._models.villages,s._models.village_order,s._models.option_bases,s._services.scavenging_service,s._models.candidate_squad), s._view.$villages_container),
                this._did_sub_widgets_init = !0
            }
        }
    }),
    g
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/MainWidget/StateReductionActions.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/StateReductionActions", ["module"], function(e) {
    return {
        START_SEND_SQUAD_REQUEST: e.id + "_start_send_squad_request",
        END_SEND_SQUAD_REQUEST: e.id + "_end_send_squad_request"
    }
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/StateReductionActions.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/StateReductionActions", ["module"], function(e) {
    return {
        UPDATE_LAST_UNITS_SENT: e.id + "_update_last_units_sent"
    }
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesController.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesView", "Ig/TribalWars/Modules/Scavenging/CandidateSquad", "Ig/TribalWars/Modules/Scavenging/ScavengeOption", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/StateReductionActions", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/DialogLauncher"], function(e, t, a, i, n, s) {
    "use strict";
    function o() {
        e.apply(this)
    }
    return o.prototype = Object.create(e.prototype),
    $.extend(o.prototype, {
        _watchModels: function() {
            var e = this._widget
              , t = this._models.candidate_squad
              , i = this._models.villages;
            this._watchModelForEvent(t, a.EVENT_UNITS_CHANGED, function(e) {
                $.each(i, function(e, a) {
                    a.updateSquadAffordCount(t.unit_counts)
                })
            }),
            this._watchModelForEvent(t, a.EVENT_SENDABLE_CHANGED, function(t) {
                e.update(Timing.getCurrentServerTime())
            })
        },
        _watchView: function() {
            var e = this;
            this._watchViewForEvent(t.VIEW_EVENT_UNLOCK, function(t) {
                var a = e._models.villages[t.village_id];
                ResourcesForecaster.fetchSchedules(t.village_id, function(i) {
                    new s(a,e._services.scavenging_service,i.rates,i.amounts).openUnlockOptionDialog(t.option_id)
                })
            }),
            this._watchViewForEvent(t.VIEW_EVENT_CHECKBOX, function(t) {
                var a = e._models.villages[t.village_id];
                a.getOption(t.option_id).setIsPending(t.checked),
                a.updateSquadAffordCount(e._models.candidate_squad.unit_counts)
            }),
            this._watchViewForEvent(t.VIEW_EVENT_CHECK_ROW, function(t) {
                var a = e._models.villages[t.village_id];
                $.each(Object.values(a.options).reverse(), function(n, s) {
                    s.getStatus() === i.STATUS_INACTIVE && t.checked ? (s.setIsPending(!0),
                    a.updateSquadAffordCount(e._models.candidate_squad.unit_counts)) : s.getStatus() !== i.STATUS_PENDING || t.checked || (s.setIsPending(!1),
                    a.updateSquadAffordCount(e._models.candidate_squad.unit_counts))
                })
            }),
            this._watchViewForEvent(t.VIEW_EVENT_CHECK_COL, function(t) {
                var a = t.option_id;
                $.each(e._models.villages, function(n, s) {
                    $.each(Object.values(s.options).reverse(), function(n, o) {
                        a && a !== o.getId() || (o.getStatus() === i.STATUS_INACTIVE && t.checked ? (o.setIsPending(!0),
                        s.updateSquadAffordCount(e._models.candidate_squad.unit_counts)) : o.getStatus() !== i.STATUS_PENDING || t.checked || (o.setIsPending(!1),
                        s.updateSquadAffordCount(e._models.candidate_squad.unit_counts)))
                    })
                })
            }),
            this._watchViewForEvent(t.VIEW_EVENT_UNITS_SENT, function(t) {
                e._widget.applyActionToState(n.UPDATE_LAST_UNITS_SENT, {}, Timing.getCurrentServerTime()),
                e._widget.update()
            })
        },
        _eventNamesToAlwaysBubble: function() {
            return [t.VIEW_EVENT_CHECKBOX, t.VIEW_EVENT_CHECK_ROW, t.VIEW_EVENT_CHECK_COL]
        }
    }),
    o
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesStateReducer.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesStateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/StateReductionActions"], function(e, t) {
    "use strict";
    function l() {
        e.apply(this)
    }
    return l.prototype = Object.create(e.prototype),
    $.extend(l.prototype, {
        newStateFromNothing: function() {
            return {
                villages: null,
                village_order: null,
                option_bases: null,
                last_send: null
            }
        },
        newStateFromModels: function(e, t, l) {
            var n = $.extend(!0, {}, e);
            return null === n.option_bases && (n.option_bases = t.option_bases),
            null === n.villages && (n.villages = t.villages),
            null === n.village_order && (n.village_order = t.village_order),
            n.sendable = t.candidate_squad.sendable,
            n.send_units = t.candidate_squad.unit_counts,
            n
        }
    }),
    l.prototype._action_reducers[t.UPDATE_LAST_UNITS_SENT] = function(e, t, l) {
        var n = $.extend(!0, {}, e);
        return n.last_send = Timing.getCurrentServerTime(),
        n
    }
    ,
    l
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesView.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesView", ["module", "Ig/TribalWars/Modules/Common/Widget/AbstractView", "Ig/TribalWars/Modules/Scavenging/ScavengeOption"], function(t, e, a) {
    "use strict";
    function i() {
        e.apply(this)
    }
    return i.prototype = Object.create(e.prototype),
    i.VIEW_EVENT_UNLOCK = t + "_EVENT_UNLOCK",
    i.VIEW_EVENT_CHECKBOX = t + "_EVENT_CHECKBOX",
    i.VIEW_EVENT_CHECK_ROW = t + "_EVENT_CHECK_ROW",
    i.VIEW_EVENT_CHECK_COL = t + "_EVENT_CHECK_COL",
    i.VIEW_EVENT_UNITS_SENT = t + "_EVENT_UNITS_SENT",
    $.extend(i.prototype, {
        _initStructure: function(t) {
            var e = $(this.createHtml(t));
            this.$table_head = e.find("thead"),
            this.$table_body = e.find("tbody"),
            this._setRootElement(e)
        },
        createHtml: function(t) {
            return '<table class="vis mass-scavenge-table"><thead><tr><th>' + _("abc63490c815af81276f930216c8d92b") + '</th><th class="option-1"></th><th class="option-2"></th><th class="option-3"></th><th class="option-4"></th><th></th></tr></thead><tbody><tr><td><strong>' + _("4c41e0bd957698b58100a5c687d757d9") + '</strong></td><td><input type="checkbox" class="select-all-col" data-option="1" /></td><td><input type="checkbox" class="select-all-col" data-option="2" /></td><td><input type="checkbox" class="select-all-col" data-option="3" /></td><td><input type="checkbox" class="select-all-col" data-option="4" /></td><td><input type="checkbox" class="select-all-col" data-option="" /></td></tr></tbody></table>'
        },
        createRowHTML: function(t) {
            var e = '<input type="checkbox" class="status-inactive" /><img src="' + Format.image_src("/icons/report_scavenging.png") + '" class="status-active" /><img src="' + Format.image_src("/icons/block_icon.png") + '" class="status-unavailable" /><a href="#" class="status-locked"><img src="' + Format.image_src("/scavenging/lock_mini.png") + '" /></a><a href="#" class="status-unlocking"><img src="' + Format.image_src("/scavenging/unlock_mini.png") + '" /></a>';
            return '<tr id="scavenge_village_' + t.village_id + '" data-id="' + t.village_id + '"><td><a href="' + TribalWars.buildURL("GET", "place", {
                mode: "scavenge",
                village: t.village_id
            }) + '">' + t.village_name + '</a></td><td class="option option-1" data-id="1">' + e + '</td><td class="option option-2" data-id="2">' + e + '</td><td class="option option-3" data-id="3">' + e + '</td><td class="option option-4" data-id="4">' + e + '</td><td><input type="checkbox" class="select-all-row" /></td></tr>'
        },
        getTooltipBody: function(t, e) {
            var i = t.options[e];
            if (i.getStatus() === a.STATUS_LOCKED) {
                var n = "<strong>" + _("d0f2e5376298c880665077b565ffd7dd") + "</strong><br />";
                return n += this.getResFragment(i.getUnlockCost()) + ' <span class="icon header time"></span>' + Format.timeSpan(1e3 * i.getUnlockDurationSeconds()),
                i.arePrerequisitesMet(t.options) || (n += '<br /><span class="red">' + _("368757654e9386c570f6b5d5460db6ac") + "</span>"),
                n
            }
            if (i.getStatus() === a.STATUS_UNLOCKING)
                return "<strong>" + s(_("e98abff26f106973edac94193806cacf"), '<span class="scavenging-timer" data-endtime="' + i.unlock_time + '"></span>') + "</strong>";
            if (i.getStatus() === a.STATUS_INACTIVE)
                return "<strong>" + _("78945de8de090e90045d299651a68a9b") + "</strong>";
            if (i.getStatus() === a.STATUS_UNAVAILABLE)
                return "<strong>" + _("c75b1ece3513bda34926a03d7bfa60e5") + "</strong>";
            if (i.getStatus() === a.STATUS_ACTIVE) {
                n = "<strong>" + _("af28073c7fd2f2f0f9cfdad262bc3f69") + "</strong><br />";
                return n += this.getResFragment(i.scavenging_squad.loot_res),
                n += "<br />" + s(_("6b3d1468951e41d4f249465fd9192d3a"), '<span class="scavenging-timer" data-endtime="' + i.scavenging_squad.return_time + '"></span>')
            }
        },
        getResFragment: function(t) {
            return ["wood", "stone", "iron"].map(function(e) {
                return '<span class="icon header ' + e + '"></span>' + Format.number(t[e])
            }).join(" ")
        },
        doInitialRender: function(t) {
            var e = this;
            $.each(t.option_bases, function(t, a) {
                var i = '<img src="' + Format.image_src("/scavenging/options/" + a.id + ".png") + '" />';
                e.$table_head.find(".option-" + t).prepend(i)
            });
            var i = "";
            $.each(t.village_order, function(n, o) {
                var s = t.villages[o];
                i += e.createRowHTML(s);
                var c = s;
                $.each(s.options, function(t, i) {
                    var n = i.getId();
                    i.on(a.EVENT_STATUS_CHANGED, function(t) {
                        e.updateVillageOptionState(c, c.getOption(n))
                    })
                })
            }),
            e.$table_body.append(i),
            UI.ToolTip(".option a, .option img", {
                bodyHandler: function() {
                    var a = $(this).parents("td")
                      , i = a.parents("tr")
                      , n = t.villages[i.data("id")]
                      , o = a.data("id");
                    return e.getTooltipBody(n, o)
                }
            }),
            $(".option a, .option img").on("mouseover", function() {
                Timing.tickHandlers.timers.initTimers("scavenging-timer", null)
            })
        },
        updateVillageState: function(t) {
            var e = this;
            $.each(t.options, function(a, i) {
                e.updateVillageOptionState(t, i)
            })
        },
        updateVillageOptionState: function(t, e) {
            var i = this.$table_body.find("#scavenge_village_" + t.village_id).find(".option-" + e.getId())
              , n = ["option", "option-" + e.getId()];
            e.getStatus() === a.STATUS_PENDING && (n.push("option-inactive"),
            i.find("input[type=checkbox]").prop("checked", !0)),
            e.getStatus() === a.STATUS_INACTIVE ? (n.push("option-inactive"),
            i.find("input[type=checkbox]").prop("checked", !1)) : e.getStatus() === a.STATUS_UNAVAILABLE ? n.push("option-unavailable") : e.getStatus() === a.STATUS_ACTIVE ? n.push("option-active") : e.getStatus() === a.STATUS_LOCKED ? n.push("option-locked") : e.getStatus() === a.STATUS_UNLOCKING && n.push("option-unlocking"),
            i.attr("class", n.join(" "))
        },
        _initEventPublishing: function() {
            var t = this;
            this.$table_body.on("click", ".status-locked", function(e) {
                return t.trigger(i.VIEW_EVENT_UNLOCK, {
                    village_id: $(this).parents("tr").data("id"),
                    option_id: $(this).parents("td").data("id")
                }),
                !1
            }),
            this.$table_body.on("change", ".option input[type=checkbox]", function(e) {
                var a = $(this);
                t.trigger(i.VIEW_EVENT_CHECKBOX, {
                    village_id: a.parents("tr").data("id"),
                    option_id: a.parents("td").data("id"),
                    checked: this.checked
                })
            }),
            this.$table_body.on("change", ".select-all-row", function(e) {
                var a = $(this);
                t.trigger(i.VIEW_EVENT_CHECK_ROW, {
                    village_id: a.parents("tr").data("id"),
                    checked: this.checked
                })
            }),
            this.$table_body.on("change", ".select-all-col", function(e) {
                var a = $(this);
                t.trigger(i.VIEW_EVENT_CHECK_COL, {
                    option_id: a.data("option"),
                    checked: this.checked
                })
            })
        },
        _render: function(t, e) {
            var a = this;
            t || (a.doInitialRender(e),
            $.each(e.villages, function(t, i) {
                a.updateVillageState(i, e.send_units)
            })),
            t && t.sendable === e.sendable || (a.$table_body.find("input[type=checkbox]").prop("disabled", !e.sendable),
            a.$table_head.find("input[type=checkbox]").prop("disabled", !e.sendable)),
            t && t.last_send !== e.last_send && a.$table_body.find(".select-all-row, .select-all-col").prop("checked", !1)
        }
    }),
    i
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesWidget.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesWidget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesView", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesController", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/VillagesWidget/VillagesStateReducer"], function(e, l, i, a) {
    "use strict";
    function s(s, t, g, r, n) {
        e.apply(this),
        this._models = {
            villages: s,
            village_order: t,
            option_bases: g,
            candidate_squad: n
        },
        this._services = {
            scavenging_service: r
        },
        this._view = new l,
        this._controller = new i,
        this._state_reducer = new a
    }
    return s.prototype = Object.create(e.prototype),
    $.extend(s.prototype, {
        _initSubWidgets: function(e, l, i) {}
    }),
    s
});

;/**** game/Modules/VillagePlace/ScavengeMassScreen/ScavengeMassScreen.js ****/
define("Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/ScavengeMassScreen", ["Ig/TribalWars/Modules/Scavenging/ScavengeOption", "Ig/TribalWars/Modules/Scavenging/ScavengingService", "Ig/TribalWars/Modules/Scavenging/ScavengeVillage", "Ig/TribalWars/Modules/VillagePlace/ScavengeMassScreen/MainWidget/MainWidget", "Ig/TribalWars/Modules/VillagePlace/ScavengeScreen/DialogLauncher", "Ig/TribalWars/Modules/Scavenging/ScavengeVillageSynchronizer", "Ig/TribalWars/Modules/Farming/LootCalculator", "Ig/TribalWars/Modules/Units/UnitsCalculator", "Ig/TribalWars/Modules/Scavenging/CandidateSquad"], function(i, e, a, n, l, s, t, r, c) {
    "use strict";
    function g(i, n, l, s) {
        this.scavenging_service = new e,
        this.sendable_units = n,
        this.loot_calculator = new t(n),
        this.units_calculator = new r(n),
        this.candidate_squad = new c(this.loot_calculator,this.units_calculator,null,l),
        this.villages = {},
        this.village_order = [];
        var g = this;
        $.each(s, function(e, n) {
            g.villages[n.village_id] = a.createFromDTO(i, n),
            g.village_order.push(n.village_id)
        }),
        this.option_bases = i
    }
    return g.prototype = {
        village_synchronizer: null,
        init: function() {
            this.initVillageSynchronization(),
            this.initUI()
        },
        initVillageSynchronization: function() {
            this.initVillageSynchronizer()
        },
        initVillageSynchronizer: function() {
            var i = this;
            this.village_synchronizer = new s(this.villages,this.scavenging_service),
            $(TribalWars).on("global_tick.scavenge_screen", function() {
                i.village_synchronizer.processTiming()
            })
        },
        initUI: function() {
            new n(this.villages,this.village_order,this.option_bases,this.scavenging_service,this.candidate_squad,this.loot_calculator,this.sendable_units).init($("#scavenge_mass_screen"))
        },
        unload: function() {}
    },
    g
});

;