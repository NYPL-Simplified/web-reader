"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("./utils/core");

/**
 * Open DisplayOptions Format Parser
 * @class
 * @param {document} displayOptionsDocument XML
 */
class DisplayOptions {
  constructor(displayOptionsDocument) {
    this.interactive = "";
    this.fixedLayout = "";
    this.openToSpread = "";
    this.orientationLock = "";

    if (displayOptionsDocument) {
      this.parse(displayOptionsDocument);
    }
  }
  /**
   * Parse XML
   * @param  {document} displayOptionsDocument XML
   * @return {DisplayOptions} self
   */


  parse(displayOptionsDocument) {
    if (!displayOptionsDocument) {
      return this;
    }

    const displayOptionsNode = (0, _core.qs)(displayOptionsDocument, "display_options");

    if (!displayOptionsNode) {
      return this;
    }

    const options = (0, _core.qsa)(displayOptionsNode, "option");
    options.forEach(el => {
      let value = "";

      if (el.childNodes.length) {
        value = el.childNodes[0].nodeValue;
      }

      switch (el.attributes.name.value) {
        case "interactive":
          this.interactive = value;
          break;

        case "fixed-layout":
          this.fixedLayout = value;
          break;

        case "open-to-spread":
          this.openToSpread = value;
          break;

        case "orientation-lock":
          this.orientationLock = value;
          break;
      }
    });
    return this;
  }

  destroy() {
    this.interactive = undefined;
    this.fixedLayout = undefined;
    this.openToSpread = undefined;
    this.orientationLock = undefined;
  }

}

var _default = DisplayOptions;
exports.default = _default;