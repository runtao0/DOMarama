#**DOMarama**
Link: [Here](tbd.com)

DOMarama is a Javascript clone of some of [jQuery's](http://api.jquery.com/) basic DOM creation,
manipulation, and ajax methods. The user only needs to copy this repo and open the index.html
in Google Chrome and inspect. jQuery is available on the window for comparison.

The following are available to the user on the window, and allow the user to create and select elements on the document:
```Javascript
  $l(selector)
  $l(HTMLElement)
  $l(Function)
  $l.ajax()
```

The **$l()** function has 3 functions, depending on the parameters passed in. For example,
```Javascript
const firstFiveLetters = $(".letters")
```
Selects all the elements with class name "letters" (the five list items A-E). **firstFiveLetters** is a DOMNodeCollection containing all five elements. A DOMNodeCollection object can hold any number of DOM elements. It is similar to a jQuery object and has several methods available to it.

If an HTMLElement is given as a parameter:
```Javascript
$(<div>)
```
will create a div element onto the HTML document while returning the HTMLElement wrapped in a DOMNodeCollection object. This can then be manipulated with the DOMNodeCollection methods (explained later).

Next:
```Javascript
$(() => document.appendChild(<h1> Hello world! <h1>)));
```
will add the anonymous function to a function queue, and execute the function after the document has loaded.


The user may also use the following request options hash for test purposes:
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
The user should expect to get back an object containing such information as temperature, humidity, and weather conditions etc. The user may also attach .then() clauses to the ajax request as the returns a promise.

***Methods***
There are several methods available to an element newly created or selected with **$l()**. These methods are available to all DOMNodeCollection objects.

**each(callback)**
This method iterates through all the DOM elements in a collection and executes a callback on each:
```Javascript
const firstFiveLetters = $l(".letters");
firstFiveLetters.each((ele) => console.log(ele.innerHTML));
```
expected logged result:
```HTML
<a href="#">A</a>
<a href="#">B</a>
<a href="#">C</a>
<a href="#">D</a>
<a href="#">E</a>
```

**html()**
This method sets the inner HTML of each element if passed a string (using firstFiveLetters from each()):
```Javascript
const firstFiveLetters = $l(".letters");
firstFiveLetters.html("hello world");
```
changes the following:
- A
- B
- C
- D
- E

into:
- hello world
- hello world
- hello world
- hello world
- hello world

If no argument is passed, the method returns the innerHTML of the first element in the collection:
```Javascript
const firstFiveLetters = $l(".letters");
firstFiveLetters.html();
```
returns:
```HTML
<a href="#">A</a>
```

**empty()**
This method deletes all text content in every element in the collection.
```Javascript
const firstPara = $l(".first-p");
firstPara.empty();
```
results in the deletion of text of the first paragraph. The HTML tags and attributes are still intact.

**append(obj)**
This method appends an element to all elements in the selected collection. If the parameter is a string, the element will be added as text. If the element is an HTMLElement or collection of HTMLElements, the entire element/collection will be added:
```Javascript
const secondPara = $l(".second-p");
secondPara.append(firstPara);
```
A copy of the first paragraph will be added within the second paragraph at the end.

**attr(key, val)**
If a val is provided as a string, this method will set the key attribute to that val. Otherwise, the method will get the current value of that key of the first selected element in the collection.
```Javascript
const firstPara = $l(".first-p");
firstPara.attr("class");
```
returns "p first-p orange" while:
```Javascript
const firstPara = $l(".first-p");
firstPara.attr("class", "green");
```
returns undefined but changes the class of the first paragraph only to "green"

**addClass(newClass)**
This method adds a new class attribute to the elements in the collection.
```Javascript
const thirdPara = $l(".third-p");
thirdPara.addClass("purple");
```
adds "purple" to the third paragraph class values.

**removeClass(oldClass)**
This method does the opposite of addClass().
```Javascript
const firstPara = $l(".first-p");
firstPara.removeClass("orange");
```
removes "orange" from the first paragraph class values.

**toggleClass(classToToggle)**
This method adds the class value to elements in the collection that do not currently have it and removes it from those that do:
```Javascript
const paragraphs = $l(".p");
paragraphs.toggleClass("orange");
```
adds "orange" to the second and third paragraphs and removes it from the first.

**children()**
This method returns the immediate children of each element in the selected collection in a DOMNodeCollection.
```Javascript
const list = $l(".list");
const letters = list.children();
```
returns a DOMNodeCollection object containing all the li children.

**parent()**
This method is similar to the children() method except it selects the immediate parents of the elements in the collection
```Javascript
const paragraphs = $l(".p");
paragraphs.parents();
```
returns a DOMNodeCollection containing the aside (class="sidebar random people blue"), article (class="content"), and div (class="more-content") elements, in that order.

**find(selector)**
This method returns a DOMNodeCollection of children of each element in the collection that match the given selector:
```Javascript
const list = $l(".list");
list.find(".vowel");
```
returns a DOMNodeCollection containing the "A" and "E" list items.

**on(eventName, callback)**
This method adds an EventListener to each element in the collection with eventName being the type of event, and callback being the callback that is executed when that event is triggered.
```Javascript
const firstFiveLetters = $l(".letters");
firstFiveLetters.on("click", () => alert("you have clicked on a letter"));
```

**off(eventName)**
This method removes EventListeners that have been added to elements with the on() method.
```Javascript
const firstFiveLetters = $l(".letters");
firstFiveLetters.on("click", () => alert("you have clicked on a letter"));
firstFiveLetters.off("click");
```
