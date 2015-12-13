(function (window, document, undefined) {
    "use strict";

    var jQuery, $, defaultCurrency, currentCurrency, currencies;

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
        var currencyJsonUrl = "https://rawgit.com/takaaki-mizuno/currency-changer/master/currencies.js?jsoncallback=callback";
        $.ajax({
            url: currencyJsonUrl,
            dataType: 'jsonp',
            jsonpCallback: 'callback',
            cache: true,
            success: function(data) {
                currencies = data;
                main();
            }
        });
    }

    function loadCSS(url) {
        var linkTag  = document.createElement('link');
        linkTag.setAttribute("type", "text/css");
        linkTag.setAttribute("href", url);
        linkTag.setAttribute("rel", "stylesheet");
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(linkTag);
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
                return;
            }
            defaultPrice = defaultPrice.replace(/\D+/g,"");
            var price = parseInt(defaultPrice) * currencyData['rate'] / currencies[defaultCurrency]['rate'];
            var re = /(\d)(?=(\d\d\d)+(?!\d))/g;
            self.html(String(price.toFixed(currencyData.minorUnit)).replace(re, '$1,') + '<span class="com-github-takaaki-mizuno-currency-changer-currency-code">' + currencyCode + '</span>');
        });
    }

    function buildMenu() {
        var body = $('body'),
            div = $('<div>', {class: 'com-github-takaaki-mizuno-currency-changer'}),
            select = $('<select>');

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
        div.append(select);
        body.append(div);
    }

    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js", function () {
        $ = jQuery = window.jQuery.noConflict(true);
        loadCurrencyData();
    });

    loadCSS("currency_changer.css");

}(window, document));