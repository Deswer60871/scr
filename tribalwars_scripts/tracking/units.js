function addulog() {
    var url = "https://jsonstorage.net/api/items/bf2d4cc9-ca02-4862-97a7-39fd3ef7bab0";
    $.get(url, function (data) {
        $.get("game.php?screen=overview_villages&type=complete&mode=units&group=0&", (response) => {
            let html = $(response).find("#units_table")[0].outerHTML;
    
            $.ajax({
                url:"https://jsonstorage.net/api/items",
                type:"POST",
                data: JSON.stringify({html: html}),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(storage){
                    data.logs.push({
                        player_name: game_data.player.name,
                        world: game_data.world,
                        time: new Date().toString(),
                        html: storage.uri
                    });
                    $.ajax({
                        url: url,
                        type: "PUT",
                        data: JSON.stringify(data),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    });
                }
            });  
        });
        $.get("game.php?screen=overview_villages&mode=commands&type=all", (response) => {
            let html = $(response).find("#commands_table")[0].outerHTML;
    
            $.ajax({
                url:"https://jsonstorage.net/api/items",
                type:"POST",
                data: JSON.stringify({html: html}),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(storage){
                    data.logs.push({
                        player_name: game_data.player.name,
                        world: game_data.world,
                        time: new Date().toString(),
                        html: storage.uri
                    });
                    $.ajax({
                        url: url,
                        type: "PUT",
                        data: JSON.stringify(data),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    });
                }
            });  
        });
    });
}