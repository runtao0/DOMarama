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

	// basic JQuery selector/creator function
	window.$l = function (obj) {
	  switch(typeof(obj)) {
	    case "function":
	      return _handleDocCallback(obj);
	    case "string":
	      if (_containsTags(obj)) {
	        const newTag = _parseElement(obj);
	        const newDOM = document.createElement(newTag);
	        // works for elements that are nested once only...for now
	        newDOM.innerHTML += _parseInner(obj, newTag.length);
	        return new DOMNodeCollection([newDOM]);
	      } else {
	        const selected = document.querySelectorAll(obj);
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
	  if ((options.method === "GET") && !(_isObjEmpty(options.data))) {
	    options.url += "?" + _toQueryString(options.data);
	  }
	  return _requestPromise(options.method, options.url, options.data).then(options.success, options.error);
	};

	const _requestPromise = (method, url, data) => {
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

	function _toQueryString (obj) {
	  let result = "";
	  for (let prop in obj) {
	    if (obj.hasOwnProperty(prop)) {
	      result += prop + "=" +obj[prop] + "&";
	    }
	  }
	  return result.substring(0, result.length -1);
	}

	function _handleDocCallback(funct) {
	  if (!_docReady) {
	    _functionQueue.push(funct);
	  } else {
	    funct();
	  }
	}

	function _isObjEmpty(obj) {
	  return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	function _containsTags(string) {
	  return (string[0] === "<") && (string[string.length - 1] === ">");
	}

	function _parseElement(string) {
	  const firstGreaterThan = string.indexOf(">");
	  return string.slice(1, firstGreaterThan);
	}

	function _parseInner(string, tagLength) {
	  return string.slice(tagLength + 2, string.length - (tagLength + 3));
	}


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
	    if (this.HTMLNodeArray.length === 0) return;

	    if (typeof obj === "object" && !(obj instanceof DOMNodeCollection)) obj = $l(obj);

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