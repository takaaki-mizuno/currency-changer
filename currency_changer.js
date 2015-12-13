(function (window, document) {
    "use strict";

    var jQuery, $, defaultCurrency, currentCurrency,
        currencies = {
            "EUR": {rate: 0.909668, name: "Euro", minorUnit: 2},
            "HKD": {rate: 7.749832, name: "Hong Kong Dollar", minorUnit: 2},
            "IDR": {rate: 13952.166667, name: "Indonesia Rupiah", minorUnit: 2},
            "JPY": {rate: 120.9795, name: "Japanese Yen", minorUnit: 0},
            "SGD": {rate: 1.413415, name: "Singapore Dollar", minorUnit: 2},
            "THB": {rate: 36.10768, name: "Thai Baht", minorUnit: 0},
            "USD": {rate: 1, name: "U.S. Dollar", minorUnit: 2},
            "VND": {rate: 22484.833333, name: "Vietnam Dong", minorUnit: 0}
        };

    function loadScript(url, callback) {
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("src", url);
        if (typeof callback !== "undefined") {
            if (scriptTag.readyState) {
                scriptTag.onreadystatechange = function () {
                    if (this.readyState === 'complete' || this.readyState === 'loaded') {
                        callback();
                    }
                };
            } else {
                scriptTag.onload = callback;
            }
        }
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
    }

    function loadCurrencyData() {
        var currencyJsonUrl = "https://rawgit.com/takaaki-mizuno/currency-changer/master/currencies.json?jsoncallback=callback";
        $.getJSON(currencyJsonUrl, {})
            .done(function (data) {
                    currencies = data;
                    main();
                }
            );
    }


    function main() {
        defaultCurrency = currentCurrency = $("meta[name=default-currency]").attr("content");
        setDefaultCurrencyValue();
        buildMenu();
    }

    function setDefaultCurrencyValue() {
        $('.price').each(function (index) {
            var defaultPrice = $(this).text();
            $(this).attr('data-currency-changer-default-price', defaultPrice);
        });
    }

    function changeCurrency(currencyCode) {
        $('.price').each(function (index) {
            var defaultPrice = $(this).attr('data-currency-changer-default-price'),
                self = $(this),
                currencyData = currencies[currencyCode];
            if (currencyCode == defaultCurrency) {
                self.text(defaultPrice);
            }
            var price = parseInt(defaultPrice) * currencyData['rate'] / currencies[defaultCurrency]['rate'];
            self.html(price.toFixed(currencyData.minorUnit) + '<span class="com.github-takaaki-mizuno-currency-changer-currency-code">' + currencyCode + '</span>');
        });
    }

    function buildMenu() {
        var body = $('body'),
            select = $('<select>', {class: 'com.github-takaaki-mizuno-currency-changer'});

        for (var key in currencies) {
            var option = $('<option value="' + key + '">');
            option.text(currencies[key].name);
            if (defaultCurrency == key) {
                option.attr('selected', 'selected');
            }
            select.append(option);
        }
        select.on('change', function () {
            changeCurrency(this.value);
        });
        body.append(
            select
        );
    }

    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js", function () {
        $ = jQuery = window.jQuery.noConflict(true);
        loadCurrencyData();
    });

}(window, document));