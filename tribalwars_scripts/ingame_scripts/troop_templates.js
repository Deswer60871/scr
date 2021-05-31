var TroopTemplates = {
    current: null,
    loadTemplate: null,
    deleteLink: null,
    currentTemplates: 0,
    maxTemplates: 2,
    init: function() {
        var e = $("#troop_template_units");
        e.find('input[type="checkbox"]').change(TroopTemplates.allTroopsCheckbox),
        document.location.hash && (TroopTemplates.loadTemplate = document.location.hash.substring(1)),
        TroopTemplates.currentTemplates >= TroopTemplates.maxTemplates ? TroopTemplates.loadTemplate || (TroopTemplates.loadTemplate = !0) : TroopTemplates.selectCreate(),
        TroopTemplates.updateTemplateList(),
        mobile || $("#troop_template_list").css("height", $("#troop_template_units").height() + "px"),
        $("#template_create").click(TroopTemplates.selectCreate),
        e.find("form").submit(TroopTemplates.validate),
        $("a.help-link").on("click", function(e) {
            e.preventDefault(),
            TribalWars.get(game_data.screen, {
                ajax: "templates_help"
            }, function(e) {
                Dialog.show("help", e.dialog)
            })
        })
    },
    allTroopsCheckbox: function() {
        var e = mobile ? "number" : "text";
        this.parentElement.querySelector('input[type="' + e + '"]').disabled = this.checked
    },
    resetSelect: function(e) {
        e.find("option:first").attr("selected", "selected").parent("select")
    },
    useTemplate: function(e) {
        if ("object" == typeof e && (e = $(e).find("option:selected").val()),
        e) {
            var l = TroopTemplates.current[e];
            $.each(l, function(e, t) {
                var a = $("#unit_input_" + e);
                a.length && (0 <= t ? a.val(Math.min(parseInt(a.data("all-count")), t)) : a.val(Math.max(0, parseInt(a.data("all-count")) + parseInt(t)))),
                -1 < l.use_all.indexOf(e) && a.val(a.data("all-count"))
            }),
            $("#template_id").val(e)
        }
        return !1
    },
    validate: function() {
        return $("#template_name").val().length < 1 ? (UI.ErrorMessage(_("8a583c14eb4afc2ea2ac98a38eabb744")),
        !1) : 50 < $("#template_name").val().length ? (UI.ErrorMessage(_("4d2c639afe61e71f27518ee7b952436a")),
        !1) : "" != $("#template_name").val().trim() || (UI.ErrorMessage(_("ad2e48bae3587249c07027ac3eb331a7")),
        !1)
    },
    updateTemplateList: function() {
        var n = $("#troop_template_list").find("ul")
          , r = 1;
        $.each(TroopTemplates.current, function(e, t) {
            t.sanitized_name = $("<a></a>").text(t.name).text(),
            t.display_name = "";
            for (var a = 0; a < t.sanitized_name.length; a++)
                t.display_name += t.sanitized_name.charAt(a) + "&shy;";
            var l = $('<li><a href="#' + t.id + '"></a></li>')
              , p = l.find("a");
            p.data("template-id", t.id),
            p.data("li-id", r),
            p.click(TroopTemplates.selectTemplate),
            p.html(t.display_name),
            n.append(l);
            var o = $('<img src="/graphic/delete_14.png" alt="" />').click(function(e) {
                e.stopPropagation(),
                document.location.replace(TroopTemplates.deleteLink + "&id=" + t.id)
            });
            p.prepend(o),
            t.id != TroopTemplates.loadTemplate && !0 !== TroopTemplates.loadTemplate || (TroopTemplates.selectTemplate.call(p),
            TroopTemplates.loadTemplate = 0),
            r++
        })
    },
    selectCreate: function(e) {
        if (void 0 !== e && e.preventDefault(),
        TroopTemplates.currentTemplates >= TroopTemplates.maxTemplates)
            return UI.ErrorMessage(_("c61cdbdae723805bf8dccf2bf9bcfec5")),
            !1;
        var t = $("#troop_template_units")
          , a = t.find('input[type="checkbox"]');
        a.prop("checked", !1),
        a.trigger("change");
        var l = mobile ? "number" : "text";
        t.find("input[type=" + l + "]").val(""),
        $("#template_id").val(0),
        $("#template_name").val(""),
        $("#template_button").val(_("f6da9639891b32492ee35a12286e301b")),
        TroopTemplates.setSelected(0)
    },
    selectTemplate: function() {
        var e = $(this)
          , t = e.data("template-id")
          , a = e.data("li-id")
          , p = TroopTemplates.current[t];
        TroopTemplates.setSelected(a),
        $("#template_id").val(p.id),
        $("#template_name").val(p.name),
        $("#template_button").val(_("2992dafa14a7361deb8459ad07659b12")),
        $.each(p, function(e, t) {
            var a = $("#unit_input_" + e)
              , l = a.parent().find('input[type="checkbox"]');
            a.length && a.val(t),
            l.prop("checked", -1 < p.use_all.indexOf(e)),
            l.trigger("change")
        })
    },
    setSelected: function(e) {
        var t = $("#troop_template_list").find("li");
        t.removeClass("selected"),
        t.eq(e).addClass("selected")
    }
};
