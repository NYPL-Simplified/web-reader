"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pathWebpack = _interopRequireDefault(require("path-webpack"));

var _core = require("./utils/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Handles Parsing and Accessing an Epub Container
 * @class
 * @param {document} [containerDocument] xml document
 */
class Container {
  constructor(containerDocument) {
    this.packagePath = '';
    this.directory = '';
    this.encoding = '';

    if (containerDocument) {
      this.parse(containerDocument);
    }
  }
  /**
   * Parse the Container XML
   * @param  {document} containerDocument
   */


  parse(containerDocument) {
    //-- <rootfile full-path="OPS/package.opf" media-type="application/oebps-package+xml"/>
    var rootfile;

    if (!containerDocument) {
      throw new Error("Container File Not Found");
    }

    rootfile = (0, _core.qs)(containerDocument, "rootfile");

    if (!rootfile) {
      throw new Error("No RootFile Found");
    }

    this.packagePath = rootfile.getAttribute("full-path");
    this.directory = _pathWebpack.default.dirname(this.packagePath);
    this.encoding = containerDocument.xmlEncoding;
  }

  destroy() {
    this.packagePath = undefined;
    this.directory = undefined;
    this.encoding = undefined;
  }

}

var _default = Container;
exports.default = _default;