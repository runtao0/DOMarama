const DOMNodeCollection = require('./dom_node_collection.js');

const _functionQueue = [];
let _docReady = false;

// basic JQuery selector function
window.$l = function (obj) {
  switch(typeof(obj)) {
    case "function":
      return handleDocCallback(obj);
    case "string":
      const selected = document.querySelectorAll(obj);
      // selected is a NodeList and not a real array,
      // so must call Array.prototype.slice on the selected
      const selectedArray = Array.prototype.slice.call(selected);

      return new DOMNodeCollection(selectedArray);
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
  const xhr = new XMLHttpRequest();

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
  if (options.method === "GET") {
    options.url += "?" + toQueryString(options.data);
  }

  xhr.open(options.method, options.url);

  xhr.onload = event => {
    if (xhr.status === 200) {
      options.success(xhr.response);
    } else {
      options.error(xhr.response);
    }
  };

  xhr.send(JSON.stringify(options.data));
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

document.addEventListener('DOMContentLoaded', () => {
  console.log("ready");
  _docReady = true;
  _functionQueue.forEach(funct => funct());
});
