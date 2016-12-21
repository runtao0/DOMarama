/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);

	const _functionQueue = [];
	let _docReady = false;

	// basic JQuery selector function
	window.$l = function (obj) {
	  switch(typeof(obj)) {
	    case "function":
	      return handleDocCallback(obj);
	    case "string":
	      if (containsTags(obj)) {
	        const newTag = parseElement(obj);
	        const newDOM = document.createElement(newTag);
	        // works for elements that are nested once only...for now
	        newDOM.innerHTML += parseInner(obj, newTag.length);
	        return new DOMNodeCollection([newDOM]);
	      } else {
	        const selected = document.querySelectorAll(obj);
	        // selected is a NodeList and not a real array,
	        // so must call Array.prototype.slice on the selected
	        const selectedArray = Array.prototype.slice.call(selected);

	        return new DOMNodeCollection(selectedArray);
	      }
	      break;
	    case "object":
	      if (obj instanceof HTMLElement) {
	        return new DOMNodeCollection([obj]);
	      }
	  }
	};

	$l.extend = function (base, ...objs) {
	  objs.forEach(obj => {
	    Object.keys(obj).forEach(key => {
	      base[key] = obj[key];
	    });
	  });
	  return base;
	};

	$l.ajax = function (options) {
	  const defaultObj = {
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    method: "GET",
	    url: "",
	    success: () => {},
	    error: () => {},
	    data: {},
	  };

	  options = $l.extend(defaultObj, options);
	  options.method = options.method.toUpperCase();
	  if ((options.method === "GET") && !(isObjEmpty(options.data))) {
	    options.url += "?" + toQueryString(options.data);
	  }
	  return requestPromise(options.method, options.url, options.data).then(options.success, options.error);
	};

	const requestPromise = (method, url, data) => {
	  return new Promise((resolve, reject) => {
	    const xhr = new XMLHttpRequest();
	    xhr.open(options.method, options.url);

	    xhr.onload = event => {
	      if (xhr.status >= 200 && xhr.status < 300) {
	        return resolve(xhr.response);
	      } else {
	        reject({
	          status: xhr.status,
	          statusText: xhr.statusText
	        });
	      }
	    };

	    xhr.onerror = function () {
	      reject({
	        status: xhr.status,
	        statusText: xhr.statusText
	      });
	    };

	    xhr.send(JSON.stringify(options.data));
	  });
	};

	function toQueryString (obj) {
	  let result = "";
	  for (let prop in obj) {
	    if (obj.hasOwnProperty(prop)) {
	      result += prop + "=" +obj[prop] + "&";
	    }
	  }
	  return result.substring(0, result.length -1);
	}

	function handleDocCallback(funct) {
	  if (!_docReady) {
	    _functionQueue.push(funct);
	  } else {
	    funct();
	  }
	}

	function isObjEmpty(obj) {
	  return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	function containsTags(string) {
	  return (string[0] === "<") && (string[string.length - 1] === ">");
	}

	function parseElement(string) {
	  const firstGreaterThan = string.indexOf(">");
	  return string.slice(1, firstGreaterThan);
	}

	function parseInner(string, tagLength) {
	  return string.slice(tagLength + 2, string.length - (tagLength + 3));
	}

	window.parseElement = parseElement;

	document.addEventListener('DOMContentLoaded', () => {
	  console.log("ready");
	  _docReady = true;
	  _functionQueue.forEach(funct => funct());
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(HTMLNodeArray) {
	    this.HTMLNodeArray = HTMLNodeArray;
	  }

	  each(callback) {
	    this.HTMLNodeArray.forEach(callback);
	  }

	  html(string) {
	    if (typeof string === "string") {
	      this.each((HTMLNode, ind) => {
	        HTMLNode.innerHTML = string;
	      });
	    } else {
	      return this.HTMLNodeArray[0].innerHTML;
	    }
	  }

	  empty() {
	    this.html("");
	  }

	  append(obj) {
	    if (this.HTMLNodeArray.length === 0) {
	      return;
	    }

	    // wraps obj in DOMNodeCollection if it is not already
	    if (typeof obj === "object" && !(obj instanceof DOMNodeCollection)) {
	      obj = $l(obj);
	    }

	    if (typeof obj === 'string') {
	      this.each( (HTMLNode) => {
	        HTMLNode.appendChild(new Text(obj));
	      });
	    } else if (obj instanceof DOMNodeCollection) {
	      this.each( (HTMLNode) => {
	        obj.each(
	          objNode => { HTMLNode.appendChild(objNode.cloneNode(true)); }
	        );
	      });
	    }
	  }

	  attr(key, val) {
	    if (typeof val === "string") { //setter
	      this.each((HTMLNode) => {
	          HTMLNode.setAttribute(key, val);
	      });
	    } else { //getter
	      return this.HTMLNodeArray[0].getAttribute(key);
	    }
	  }

	  addClass(newClass) {
	    this.each(HTMLNode => HTMLNode.classList.add(newClass));
	  }

	  removeClass(oldClass) {
	    this.each(HTMLNode => HTMLNode.classList.remove(oldClass));
	  }

	  toggleClass(classToToggle) {
	    this.each(HTMLNode => HTMLNode.classList.toggle(classToToggle));
	  }

	  children() {
	    const childrens = [];
	    this.each(HTMLNode => {
	      for (let i = 0; i < HTMLNode.children.length; i++) {
	        childrens.push(HTMLNode.children[i]);
	      }
	    });
	    return new DOMNodeCollection(childrens);
	  }

	  parent() {
	    const parents = [];
	    this.each(HTMLNode => {
	      parents.push(HTMLNode.parentNode);
	    });
	    return new DOMNodeCollection(parents);
	  }

	  find(selector) {
	    let foundNodes = [];
	    this.each(HTMLNode => {
	      const nodeList = node.querySelectorAll(selector);
	      foundNodes = foundNodes.concat(Array.from(nodeList));
	    });
	    return foundNodes;
	  }

	  on(eventName, callback) {
	    this.each(HTMLNode => {
	      HTMLNode.addEventListener(eventName, callback);
	      //these steps are for the off function, it needs reference to the callback
	      const eventKey = `jqueryLiteEvents-${eventName}`;
	      if (typeof HTMLNode[eventKey] === "undefined") {
	        HTMLNode[eventKey] = [];
	      }
	      HTMLNode[eventKey].push(callback);
	    });
	  }

	  off(eventName) {
	    this.each(HTMLNode => {
	      const eventKey = `jqueryLiteEvents-${eventName}`;
	      if (HTMLNode[eventName]) {
	        node[eventKey].forEach(callback => {
	          HTMLNode.removeEventListener(eventName, callback);
	        });
	      }
	      HTMLNode[eventKey] = [];
	    });
	  }
	  
	}

	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);