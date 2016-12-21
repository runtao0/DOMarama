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
