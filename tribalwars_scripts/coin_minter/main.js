$.get("https://darxeal.github.io/tribalwars_scripts/utils.js", (d) => {
    eval(d);
    $("#content_value").parent().before("<tr><td id='loadhere'></td></tr>")
    Darxeal.loadScript({
        name: "coin_minter",
        template: "coin_minter/form.html",
        el: $("#loadhere"),
        vue: {
            el: "#vueapp",
            data: {
                coinImg: image_base + "gold.png",
                coinRatio: [2.8, 3.0, 2.5],
                coinsMinted: 0,
                resourceBalanceMethod: "ratio",
                minCallInterval: 5,
                maxCallInterval: 10,
                minMintInterval: 30,
                maxMintInterval: 60,
                active: false
            },
            methods: {
                validDistribution: function(availableResources) {
                    for (let i = 0; i < availableResources.length; i++) {
                        let distribution = [];
                        let valid = true;
                        for (let j = 0; j < availableResources.length; j++) {
                            distribution[j] = Math.floor(availableResources[i] * this.coinRatio[j] / this.coinRatio[i]);
                            if (distribution[j] > availableResources[j]) valid = false;
                        }
                        if (valid)
                            return distribution;
                    }
                },
                setResourcesByRatio: function() {
                    $(".supply_location").each((i, el) => {
                        let availableResources = [];
                        let val = $(el).find(".hide_toggle").each((i, el) => {
                            availableResources.push(parseInt($(el).val()));
                        });
                        
                        let distribution = this.validDistribution(availableResources);
                        $(el).find(".hide_toggle").each((i, el) => {
                            $(el).val(distribution[i]);
                        });
                    });
                },
                sendResources: async function() {
                    var timeout = (Math.random() * (this.maxCallInterval - this.minCallInterval) + this.minCallInterval) * 60 * 1000;
                    setTimeout(this.sendResources, timeout);

                    partialReload();
                    await Darxeal.sleep(1000);
                    
                    if (!$("input[name='select-all']").is(":checked")) $("input[name='select-all']").click();
                    if (!$("#checkbox_wood").is(":checked")) $("#checkbox_wood").click();
                    if (!$("#checkbox_stone").is(":checked")) $("#checkbox_stone").click();
                    if (!$("#checkbox_iron").is(":checked")) $("#checkbox_iron").click();
                    await Darxeal.sleep(500);

                    if (this.resourceBalanceMethod == "ratio") {
                        this.setResourcesByRatio();
                        await Darxeal.sleep(500);
                    }

                    $(".btn[type='submit']").first().click();
                    UI.SuccessMessage("Suroviny poslány.");
                },
                mintMaxCoins: async function() {
                    var timeout = (Math.random() * (this.maxMintInterval - this.minMintInterval) + this.minMintInterval) * 1000;
                    setTimeout(this.mintMaxCoins, timeout);

                    let response = await $.get("game.php", {screen: "snob"});
                    let page = $(response);
                    let text = page.find("#coin_mint_fill_max").html();
                    if (!text) return;
                    
                    let coinCount = parseInt(text.slice(1, -1));
                    if (coinCount == 0) return;
                    
                    await Darxeal.mint(game_data.village.id, coinCount);
                    this.coinsMinted += coinCount;
                    UI.SuccessMessage("Vyraženo " + coinCount + " mincí.");
                },
                start: async function() {
                    await this.sendResources();
                    await this.mintMaxCoins();
                    this.active = true;
                }
            }
        }
    });
});