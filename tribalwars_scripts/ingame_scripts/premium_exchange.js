var PremiumExchange;
!function() {
    "use strict";
    PremiumExchange = {
        TYPE_BUY: "buy",
        TYPE_SELL: "sell",
        data: {},
        errors: {},
        icons: {},
        graph: null,
        init: function() {
            $(".premium-exchange-input").on("keyup input", PremiumExchange.inputChanged),
            $("#premium_exchange_form").on("submit", PremiumExchange.beginBuy),
            setInterval(PremiumExchange.loadData, 1e4),
            $("#premium_exchange_help").on("click", function() {
                return Dialog.fetch("premium_exchange_help", "market", {
                    ajax: "exchange_help"
                }),
                !1
            }),
            this.graph && (this.graph.graph(),
            UI.onResizeEnd(window, function() {
                PremiumExchange.graph.graph()
            }))
        },
        beginBuy: function(e) {
            if (e.preventDefault(),
            Object.keys(PremiumExchange.errors).length)
                UI.ErrorMessage(PremiumExchange.errors[Object.keys(PremiumExchange.errors)[0]]);
            else {
                var a = $(this).attr("disabled", "disabled")
                  , r = $("#premium_exchange_form").serializeArray()
                  , t = {};
                $.each(r, function(e, a) {
                    a.value && (t[a.name] = parseInt(a.value))
                }),
                TribalWars.post("market", {
                    ajaxaction: "exchange_begin"
                }, t, function(e) {
                    a.removeAttr("disabled"),
                    PremiumExchange.showConfirmationDialog(e)
                }, function() {
                    a.removeAttr("disabled")
                })
            }
        },
        showConfirmationDialog: function(e) {
            var a = {}
              , r = 0
              , t = 0
              , c = 0
              , i = 0
              , n = []
              , m = s('<img src="%1" />', Format.image_src("resources/premium.png"))
              , u = '<div style="text-align: left">';
            u += '<h3 style="margin-top: 0">' + _("61a141a577b07aaea4618a4e3690f2c0") + '</h3><table class="vis" style="width: 100%"><tr><th>' + _("5238bd0d26ee4c221badd6e6c6475412") + "</th><th>" + _("077c2a977fca766982052f10bcf21cc2") + "</th></tr>",
            $.each(e, function(e, n) {
                a["rate_" + n.resource] = n.rate_hash,
                n.error ? c++ : (n.amount > 0 ? (a["buy_" + n.resource] = n.amount,
                t += n.cost) : (a["sell_" + n.resource] = Math.abs(n.amount),
                r += -n.cost),
                i += n.merchants_required);
                var o = n.amount > 0 ? _("886911e57fa3ee3994a663623a3b9d10") : _("bdbaf050407e81714408289ba3c6941b");
                n.error ? u += '<tr class="error">' : u += '<tr class="row_a">',
                u += s("<td>" + o + "</td>", s('<img src="%1" /> %2', Format.image_src("resources/" + n.resource + "_18x16.png"), Math.abs(n.original_amount)), s("%1 %2", m, Math.round(Math.abs(n.cost)))),
                u += s("<td>" + o + "</td>", s('<img src="%1" /> %2', Format.image_src("resources/" + n.resource + "_18x16.png"), Math.abs(n.amount)), s("%1 %2", m, Math.round(Math.abs(n.cost)))),
                u += "</tr>",
                n.error && (u += '<tr><td colspan="2" class="warn">' + n.error + "</td></tr>"),
                n.original_rate_hash && n.original_rate_hash !== n.rate_hash && (u += '<tr><td colspan="2" class="warn">' + _("51bff152db3085d061ab05ff18929d0e") + "</td></tr>")
            }),
            u += "</table>",
            i && (u += "<p>",
            u += _("1571a73d0961e52173c82da0df8035b8") + " " + i + "<br />",
            u += _("e206dc0ee33cef21157162c292bed800") + " " + Format.timeSpan(1e3 * PremiumExchange.data.duration),
            u += "</p>");
            var o = t;
            u += "<p>";
            var h = PremiumExchange.data.credit > t ? t : PremiumExchange.data.credit;
            t && r ? u += s(_("6069c7a2d0b5c182414b09705e179599"), m, t, r) : t ? u += s(_("c940e94d64f0ca5a359b0901b72f0087"), m, t) : r && (u += s(_("7e18147925200d1d4878df9d9e372167"), m, r)),
            u += "</p>",
            h && (u += "<p>",
            u += s(_("42544aa81540d049c6e3d824db1a0726"), m, h),
            (o = t - h) && (u += "<br />" + s(_("6da2e509a8b5e4f74e7d6f4409f9ea40"), m, o)),
            u += "</p>"),
            o > 0 && parseInt(game_data.player.pp) < o && (u += "<p>" + _("36eac82c264e62a0ae560f533928dbd7") + "</p>"),
            u += "</div>",
            o > 0 && parseInt(game_data.player.pp) < o ? n.push({
                text: _("de18d7ebba08f2bf851b460ac724b4ce"),
                callback: function() {
                    Premium.buy()
                },
                confirm: !0
            }) : c || n.push({
                text: _("70d9be9b139893aa6c69b5e77e614311"),
                callback: function(e) {
                    a.mb = e.hasOwnProperty("which") ? e.which : -1;
                    var r = e.originalEvent.hasOwnProperty("isTrusted") ? e.originalEvent.isTrusted ? 1 : 0 : 1;
                    TribalWars._ah = {
                        TribalWarsTE: r
                    },
                    PremiumExchange.confirmOrder(a)
                },
                confirm: !0
            }),
            UI.ConfirmationBox(u, n, "premium_exchange", null, !0)
        },
        confirmOrder: function(e) {
            Dialog.close(),
            TribalWars.post("market", {
                ajaxaction: "exchange_confirm"
            }, e, function(e) {
                if (e.data && PremiumExchange.receiveData(e.data),
                !0 === e.success)
                    return UI.SuccessMessage(_("42dbf2b07cb8e68771c8ab41737aa0ef")),
                    void $(".premium-exchange input").val("").each(function() {
                        PremiumExchange.inputChanged.call(this)
                    });
                PremiumExchange.showConfirmationDialog(e.transactions)
            })
        },
        loadData: function(e) {
            TribalWars.get("market", {
                ajax: "exchange_data"
            }, function(a) {
                PremiumExchange.receiveData(a),
                e && e()
            })
        },
        receiveData: function(e) {
            PremiumExchange.data = e,
            PremiumExchange.updateUI()
        },
        updateUI: function() {
            $.each(PremiumExchange.data.stock, function(e, a) {
                var r = $("#premium_exchange_stock_" + e).text(a);
                a >= PremiumExchange.data.capacity[e] ? r.addClass("warn") : r.removeClass("warn"),
                $("#premium_exchange_buy_" + e).find("input[name='buy_" + e + "']").prop("disabled", a < 1),
                $("#premium_exchange_sell_" + e).find("input[name='sell_" + e + "']").prop("disabled", a >= PremiumExchange.data.capacity[e])
            }),
            $.each(PremiumExchange.data.capacity, function(e, a) {
                $("#premium_exchange_capacity_" + e).text(a)
            }),
            $.each(PremiumExchange.data.rates, function(e, a) {
                $("#premium_exchange_rate_" + e).children().eq(0).html(window.s('<img src="%1" alt="" /> %2', Format.image_src("resources/" + e + "_18x16.png"), PremiumExchange.calculateRateForOnePoint(e)))
            }),
            $("#market_merchant_available_count").text(PremiumExchange.data.merchants),
            $("#market_status_bar").replaceWith(PremiumExchange.data.status_bar),
            $(".premium-exchange-input").each(function() {
                "" !== $(this).val() && PremiumExchange.inputChanged.call(this)
            })
        },
        inputChanged: function() {
            var e, a, r = $(this), t = r.data("resource"), c = r.data("type"), i = (c === PremiumExchange.TYPE_BUY ? PremiumExchange.TYPE_SELL : PremiumExchange.TYPE_BUY,
            r.val()), n = $("#premium_exchange_" + c + "_" + t + " .cost-container");
            if (!i)
                return PremiumExchange.updateUI(),
                n.find(".icon").show(),
                n.find(".cost").text("0"),
                void (PremiumExchange.errors.hasOwnProperty(t) && delete PremiumExchange.errors[t]);
            if ($(".premium-exchange-input:not([name=" + r.attr("name") + "])").attr("disabled", "disabled"),
            i = parseInt(i),
            isNaN(i) && (i = 0),
            c === PremiumExchange.TYPE_BUY ? (a = PremiumExchange.validateBuyAmount(t, i),
            e = Math.ceil(PremiumExchange.calculateCost(t, i))) : (a = PremiumExchange.validateSellAmount(t, i),
            e = Math.abs(Math.floor(PremiumExchange.calculateCost(t, -i)))),
            !0 === a)
                n.find(".icon").show(),
                n.find(".cost").text(e),
                PremiumExchange.errors.hasOwnProperty(t) && delete PremiumExchange.errors[t],
                window.mobile && r.parents("table").eq(0).find(".premium-exchange-error").hide();
            else {
                var m = $('<img src="%1" alt="" class="tooltip" />').attr("src", Format.image_src("error.png")).attr("title", a);
                n.find(".icon").hide(),
                n.find(".cost").html(m),
                UI.ToolTip(n.find(".tooltip")),
                PremiumExchange.errors[t] = a,
                window.mobile && r.parents("table").eq(0).find(".premium-exchange-error").show().find("td").text(a)
            }
        },
        validateBuyAmount: function(e, a) {
            return a <= 0 ? _("7221852782e515e01af552806f0fc5a3") : window.game_data.village.storage_max < a ? _("90f92270724ba1b89f8e243c44e2513f") : !(a > PremiumExchange.data.stock[e]) || _("01ac228f8bc0b2ba1dc93594270c40fe")
        },
        validateSellAmount: function(e, a) {
            return a <= 0 ? _("7221852782e515e01af552806f0fc5a3") : window.game_data.village[e] < a ? _("7f0a8636061a93e0516ae14b94cf9a2c") : !(a + PremiumExchange.data.stock[e] > PremiumExchange.data.capacity[e]) || _("0e1d9c5e4f6152d5cab2fff4aa5b0d22")
        },
        calculateCost: function(e, a) {
            var r = PremiumExchange.data.stock[e]
              , t = PremiumExchange.data.capacity[e];
            return (1 + (a >= 0 ? PremiumExchange.data.tax.buy : PremiumExchange.data.tax.sell)) * (PremiumExchange.calculateMarginalPrice(r, t) + PremiumExchange.calculateMarginalPrice(r - a, t)) * a / 2
        },
        calculateMarginalPrice: function(e, a) {
            var r = PremiumExchange.data.constants;
            return r.resource_base_price - r.resource_price_elasticity * e / (a + r.stock_size_modifier)
        },
        calculateRateForOnePoint: function(e) {
            for (var a = PremiumExchange.data.stock[e], r = PremiumExchange.data.capacity[e], t = (PremiumExchange.data.tax.buy,
            PremiumExchange.calculateMarginalPrice(a, r)), c = Math.floor(1 / t), i = PremiumExchange.calculateCost(e, c), n = 0; i > 1 && n < 50; )
                c--,
                n++,
                i = PremiumExchange.calculateCost(e, c);
            return c
        },
        robertReadableRate: function(e, a) {
            var r = Market.getPremiumRate(a, 1)
              , t = this.icons[e] + r.resources
              , c = this.icons.premium + r.premium;
            return s("%1 = %2", t, c)
        }
    }
}();
