$.get("https://darxeal.github.io/tribalwars_scripts/utils.js", (d) => {
    eval(d);
    function storableResources(resource) {
        return Math.floor(game_data.village.storage_max - game_data.village[resource]
            - game_data.village[resource + '_prod'] * PremiumExchange.data.duration);
    }
    Darxeal.loadScript({
        name: "auto_trader",
        template: "auto_trader/form.html",
        el: $(".graph").parent(),
        vue: {
            el: "#vueapp",
            data: {
                host: host,
                active: false,
                resources: ["wood", "stone", "iron"],
                activeResources: {
                    wood: false,
                    stone: false,
                    iron: false
                },
                resourceMinimums: {
                    wood: PremiumExchange.calculateRateForOnePoint("wood"),
                    stone: PremiumExchange.calculateRateForOnePoint("stone"),
                    iron: PremiumExchange.calculateRateForOnePoint("iron")
                },
                resourceLimits: {
                    wood: storableResources("wood"),
                    stone: storableResources("stone"),
                    iron: storableResources("iron")
                },
                completedExchanges: [],
                pendingConfirmationExchange: null,
                interval: null
            },
            methods: {
                image_src: function (image) {
                    return image_base + image;
                },
                resource_image: function (resource) {
                    return this.image_src('resources/' + resource + '_21x18.png');
                },
                /*
                 * Fire an event on a DOM element.
                 * Example: `eventFire("#someid", "click");`
                 * 
                 * I have to use this, because $().click() doesn't behave the same as
                 * a mouse click. This does.
                 */
                eventFire: function (selector, event) {
                    var el = $(selector)[0];
                    if (el.fireEvent) {
                        el.fireEvent('on' + event);
                    } else {
                        var evObj = document.createEvent('Events');
                        evObj.initEvent(event, true, false);
                        el.dispatchEvent(evObj);
                    }
                },
                addCompletedExchange: function (resource, amount, cost) {
                    this.completedExchanges.push({
                        resource: resource,
                        amount: amount,
                        cost: cost,
                        time: new Date().toLocaleTimeString()
                    });
                },
                totalExchangedResources: function (resource) {
                    var sum = 0;
                    for (let i = 0; i < this.completedExchanges.length; i++) {
                        if (this.completedExchanges[i].resource == resource)
                            sum += this.completedExchanges[i].amount;
                    }
                    return sum;
                },
                limitReached: function (resource) {
                    return this.totalExchangedResources(resource) >= this.resourceLimits[resource];
                },
                interceptConfirmationDialogData: function (data) {
                    this.pendingConfirmationExchange = {
                        resource: data.resource,
                        amount: data.amount,
                        cost: data.cost,
                        time: new Date().toLocaleTimeString()
                    };
                },
                exchange: function (resource, amount) {
                    $(".premium-exchange-input").val(''); // clear all other inputs
                    $(`input[name='buy_${resource}']`).val(amount); // set resource amount

                    var self = this;
                    setTimeout(function () { // wait a few millis to let the input fill
                        $(".btn-premium-exchange-buy").click(); // click the exchange button

                        setTimeout(function () { // wait for the game ajax request
                            $(".premium-exchange-input").val(''); // clear all inputs

                            // if the confirm button isn't on screen, abort
                            if (!$(".btn-confirm-yes").is(":visible")) {
                                console.log("exchange failed before it even began");
                                return;
                            }

                            self.eventFire(".btn-confirm-yes", "click"); // click the confirm button

                            setTimeout(function () { // wait a moment
                                // if there is a 'cancel' button, something went wrong
                                // and we need to click it to get rid of the dialog
                                if ($(".btn-confirm-no").is(":visible")) {
                                    self.eventFire(".btn-confirm-no", "click");
                                    self.pendingConfirmationExchange = null;
                                    console.log("too late");
                                } else {
                                    self.completedExchanges.push(self.pendingConfirmationExchange);
                                    console.log("successfully exchanged", resource, amount);
                                }
                            }, 500);

                        }, 500);
                    }, 50);
                },
                /**
                 * This runs when the 'Activate' button is pressed
                 */
                activate: function () {
                    // check if atleast one resource is active
                    this.active = false;
                    this.resources.forEach(key => {
                        if (this.activeResources[key]) this.active = true;
                    });
                    if (!this.active) return UI.ErrorMessage("Select atleast one resource.");

                    // inject our data intercept function into the PremiumExchange object
                    var old = PremiumExchange.showConfirmationDialog;
                    var self = this;
                    PremiumExchange.showConfirmationDialog = function (data) {
                        self.interceptConfirmationDialogData(data[0]);
                        old(data);
                    };

                    this.interval = setInterval(this.tick, 3000);
                },
                checkForExchangableResources: function () {
                    for (let i = 0; i < 3; i++) {
                        var resource = this.resources[i];

                        var inStock = PremiumExchange.data.stock[resource];
                        var storable = game_data.village.storage_max - game_data.village[resource];
                        var minimum = this.resourceMinimums[resource];
                        var alreadyExchanged = this.totalExchangedResources(resource);
                        var totalLimit = this.resourceLimits[resource];
                        var rate = PremiumExchange.calculateRateForOnePoint(resource);
                        var missingToLimit = totalLimit - alreadyExchanged + rate;

                        var amount = Math.min(storable, inStock, missingToLimit);
                        var roundedAmount = Math.floor(amount / rate) * rate;

                        if (this.activeResources[resource] && roundedAmount >= minimum) {
                            this.exchange(resource, roundedAmount);
                            break;
                        }
                    }
                },
                tick: function () {
                    PremiumExchange.loadData();
                    setTimeout(this.checkForExchangableResources, 500);
                },
                stop: function () {
                    this.active = false;
                    clearInterval(this.interval);
                }
            },
            computed: {
                allLimitsReached: function () {
                    for (let i = 0; i < this.resources.length; i++) {
                        const resource = this.resources[i];
                        if (this.activeResources[resource] && !this.limitReached(resource))
                            return false;
                    }
                    return true;
                },
                spentPremiumPoints: function () {
                    var sum = 0;
                    for (let i = 0; i < this.completedExchanges.length; i++) {
                        sum += this.completedExchanges[i].cost;
                    }
                    return sum;
                }
            }
        }
    });
});