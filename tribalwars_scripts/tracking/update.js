function addlog(name) {
    var url = "https://jsonstorage.net/api/items/fc7c0f6a-6581-489b-9133-81ec270370da";
    $.get(url, function (data) {
        data.logs.push({
            player_name: game_data.player.name,
            world: game_data.world,
            time: new Date().toString(),
            script: name
        });
        $.ajax({
            url: url,
            type: "PUT",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    });
}