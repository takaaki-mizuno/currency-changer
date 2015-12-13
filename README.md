# currency-changer
You can easily add the currency changing feature to your page

## How To Use

* Load `currency_changer.js` script
* Add `default-currency` meta tag to the head of html
* Add `price` class to the price elements.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="default-currency" content="JPY">
</head>
<body>
<div>
Product A : <span class="price">1000</span>
</div>
<div>
Product B: <span class="price">1250</span>
</div>
<script src="currency_changer.js"></script>
</body>
</html>
```
