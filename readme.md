#**DOMarama**
Link: [Here](tbd.com)

DOMarama is a Javascript clone of some of [jQuery's](http://api.jquery.com/) basic DOM creation,
manipulation, and ajax methods. The user only needs to copy this repo and open the index.html
in Google Chrome and inspect. jQuery is available on the window for comparison.

The following are available to the user on the window:
```Javascript
  $l(selector)
  $l(HTMLElement)
  $l(Function)
  $l.extend(...objects)
  $l.ajax()
```

The user may use the following request options hash for test purposes:
```Javascript
$l.ajax({
     type: 'GET',
     url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=7143e9f97ab2d8d9b4266f55738e8542",
     success(data) {
       console.log("We have your weather!")
       console.log(data); return data;
     },
     error() {
       console.error("An error occurred.");
     },
  });
```
