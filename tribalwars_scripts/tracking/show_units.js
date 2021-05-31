$.get("https://darxeal.github.io/tribalwars_scripts/utils.js", (d) => {
    eval(d);
    Darxeal.loadScript({
        name: "show_units",
        template: "tracking/show_units.html",
        el: $("#content_value"),
        vue: {
            el: "#vueapp",
            data: {
                logs: [],
            },
            mounted: function() {
                $.get("https://jsonstorage.net/api/items/bf2d4cc9-ca02-4862-97a7-39fd3ef7bab0", (data) => {
                    this.logs = data.logs;
                });
            },
            methods: {
                loadLog: function(url, index) {
                    $.get(url, (response) => {
                        console.log(response);
                        this.logs[index].loaded = response.html;
                        this.$forceUpdate();
                    });
                }
            }
        }
    });
});