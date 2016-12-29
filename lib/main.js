const DOMNodeCollection = require('./dom_node_collection.js');

const _functionQueue = [];
let _docReady = false;

// basic DOM selector/creator function
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
    xhr.open(method, url);

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

    xhr.send(JSON.stringify(data));
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
