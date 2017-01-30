/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var DOMNodeCollection = __webpack_require__(1);
	
	var _functionQueue = [];
	var _docReady = false;
	
	// basic DOM selector/creator function
	window.$l = function (obj) {
	  switch (typeof obj === "undefined" ? "undefined" : _typeof(obj)) {
	    case "function":
	      return _handleDocCallback(obj);
	    case "string":
	      if (_containsTags(obj)) {
	        var newTag = _parseElement(obj);
	        var newDOM = document.createElement(newTag);
	        // works for elements that are nested once only...for now
	        newDOM.innerHTML += _parseInner(obj, newTag.length);
	        return new DOMNodeCollection([newDOM]);
	      } else {
	        var selected = document.querySelectorAll(obj);
	        var selectedArray = Array.prototype.slice.call(selected);
	
	        return new DOMNodeCollection(selectedArray);
	      }
	      break;
	    case "object":
	      if (obj instanceof HTMLElement) {
	        return new DOMNodeCollection([obj]);
	      }
	  }
	};
	
	$l.extend = function (base) {
	  for (var _len = arguments.length, objs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    objs[_key - 1] = arguments[_key];
	  }
	
	  objs.forEach(function (obj) {
	    Object.keys(obj).forEach(function (key) {
	      base[key] = obj[key];
	    });
	  });
	  return base;
	};
	
	$l.ajax = function (options) {
	  var defaultObj = {
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    method: "GET",
	    url: "",
	    success: function success() {},
	    error: function error() {},
	    data: {}
	  };
	
	  options = $l.extend(defaultObj, options);
	  options.method = options.method.toUpperCase();
	  if (options.method === "GET" && !_isObjEmpty(options.data)) {
	    options.url += "?" + _toQueryString(options.data);
	  }
	  return _requestPromise(options.method, options.url, options.data).then(options.success, options.error);
	};
	
	var _requestPromise = function _requestPromise(method, url, data) {
	  return new Promise(function (resolve, reject) {
	    var xhr = new XMLHttpRequest();
	    xhr.open(method, url);
	
	    xhr.onload = function (event) {
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
	
	    xhr.send(JSON.stringify(data));
	  });
	};
	
	function _toQueryString(obj) {
	  var result = "";
	  for (var prop in obj) {
	    if (obj.hasOwnProperty(prop)) {
	      result += prop + "=" + obj[prop] + "&";
	    }
	  }
	  return result.substring(0, result.length - 1);
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
	  return string[0] === "<" && string[string.length - 1] === ">";
	}
	
	function _parseElement(string) {
	  var firstGreaterThan = string.indexOf(">");
	  return string.slice(1, firstGreaterThan);
	}
	
	function _parseInner(string, tagLength) {
	  return string.slice(tagLength + 2, string.length - (tagLength + 3));
	}
	
	document.addEventListener('DOMContentLoaded', function () {
	  console.log("ready");
	  _docReady = true;
	  _functionQueue.forEach(function (funct) {
	    return funct();
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DOMNodeCollection = function () {
	  function DOMNodeCollection(HTMLNodeArray) {
	    _classCallCheck(this, DOMNodeCollection);
	
	    this.HTMLNodeArray = HTMLNodeArray;
	    // this.length = this.HTMLNodeArray.length;
	  }
	
	  _createClass(DOMNodeCollection, [{
	    key: "each",
	    value: function each(callback) {
	      this.HTMLNodeArray.forEach(callback);
	    }
	  }, {
	    key: "html",
	    value: function html(string) {
	      if (typeof string === "string") {
	        this.each(function (HTMLNode, ind) {
	          HTMLNode.innerHTML = string;
	        });
	      } else {
	        return this.HTMLNodeArray[0].innerHTML;
	      }
	    }
	  }, {
	    key: "empty",
	    value: function empty() {
	      this.html("");
	    }
	  }, {
	    key: "append",
	    value: function append(obj) {
	      if (this.HTMLNodeArray.length === 0) return;
	
	      if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && !(obj instanceof DOMNodeCollection)) obj = $l(obj);
	
	      if (typeof obj === 'string') {
	        this.each(function (HTMLNode) {
	          HTMLNode.appendChild(new Text(obj));
	        });
	      } else if (obj instanceof DOMNodeCollection) {
	        this.each(function (HTMLNode) {
	          obj.each(function (objNode) {
	            HTMLNode.appendChild(objNode.cloneNode(true));
	          });
	        });
	      }
	    }
	  }, {
	    key: "attr",
	    value: function attr(key, val) {
	      if (typeof val === "string") {
	        //setter
	        this.each(function (HTMLNode) {
	          HTMLNode.setAttribute(key, val);
	        });
	      } else {
	        //getter
	        return this.HTMLNodeArray[0].getAttribute(key);
	      }
	    }
	  }, {
	    key: "addClass",
	    value: function addClass(newClass) {
	      this.each(function (HTMLNode) {
	        return HTMLNode.classList.add(newClass);
	      });
	    }
	  }, {
	    key: "removeClass",
	    value: function removeClass(oldClass) {
	      this.each(function (HTMLNode) {
	        return HTMLNode.classList.remove(oldClass);
	      });
	    }
	  }, {
	    key: "toggleClass",
	    value: function toggleClass(classToToggle) {
	      this.each(function (HTMLNode) {
	        return HTMLNode.classList.toggle(classToToggle);
	      });
	    }
	  }, {
	    key: "children",
	    value: function children() {
	      var childrens = [];
	      this.each(function (HTMLNode) {
	        for (var i = 0; i < HTMLNode.children.length; i++) {
	          childrens.push(HTMLNode.children[i]);
	        }
	      });
	      return new DOMNodeCollection(childrens);
	    }
	  }, {
	    key: "parents",
	    value: function parents() {
	      var parents = [];
	      this.each(function (HTMLNode) {
	        parents.push(HTMLNode.parentNode);
	      });
	      return new DOMNodeCollection(parents);
	    }
	  }, {
	    key: "find",
	    value: function find(selector) {
	      var foundNodes = [];
	      this.each(function (HTMLNode) {
	        var nodeList = HTMLNode.querySelectorAll(selector);
	        foundNodes = foundNodes.concat(Array.from(nodeList));
	      });
	      return foundNodes;
	    }
	  }, {
	    key: "on",
	    value: function on(eventName, callback) {
	      this.each(function (HTMLNode) {
	        HTMLNode.addEventListener(eventName, callback);
	        var eventKey = "DOMaramaEvents-" + eventName;
	        if (typeof HTMLNode[eventKey] === "undefined") {
	          HTMLNode[eventKey] = [];
	        }
	        HTMLNode[eventKey].push(callback);
	      });
	    }
	  }, {
	    key: "off",
	    value: function off(eventName) {
	      this.each(function (HTMLNode) {
	        var eventKey = "DOMaramaEvents-" + eventName;
	        if (HTMLNode[eventName]) {
	          HTMLNode[eventKey].forEach(function (callback) {
	            HTMLNode.removeEventListener(eventName, callback);
	          });
	        }
	        HTMLNode[eventKey] = [];
	      });
	    }
	  }]);
	
	  return DOMNodeCollection;
	}();
	
	module.exports = DOMNodeCollection;

/***/ }
/******/ ]);
//# sourceMappingURL=DOMarama.js.map