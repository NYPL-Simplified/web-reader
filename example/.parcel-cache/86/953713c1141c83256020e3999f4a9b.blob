"use strict";

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.url");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("./utils/core");

var _request = _interopRequireDefault(require("./utils/request"));

var _mime = _interopRequireDefault(require("../libs/mime/mime"));

var _path = _interopRequireDefault(require("./utils/path"));

var _jszip = _interopRequireDefault(require("jszip/dist/jszip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Handles Unzipping a requesting files from an Epub Archive
 * @class
 */
class Archive {
  constructor() {
    this.zip = undefined;
    this.urlCache = {};
    this.checkRequirements();
  }
  /**
   * Checks to see if JSZip exists in global namspace,
   * Requires JSZip if it isn't there
   * @private
   */


  checkRequirements() {
    try {
      this.zip = new _jszip.default();
    } catch (e) {
      throw new Error("JSZip lib not loaded");
    }
  }
  /**
   * Open an archive
   * @param  {binary} input
   * @param  {boolean} [isBase64] tells JSZip if the input data is base64 encoded
   * @return {Promise} zipfile
   */


  open(input, isBase64) {
    return this.zip.loadAsync(input, {
      "base64": isBase64
    });
  }
  /**
   * Load and Open an archive
   * @param  {string} zipUrl
   * @param  {boolean} [isBase64] tells JSZip if the input data is base64 encoded
   * @return {Promise} zipfile
   */


  openUrl(zipUrl, isBase64) {
    return (0, _request.default)(zipUrl, "binary").then(function (data) {
      return this.zip.loadAsync(data, {
        "base64": isBase64
      });
    }.bind(this));
  }
  /**
   * Request a url from the archive
   * @param  {string} url  a url to request from the archive
   * @param  {string} [type] specify the type of the returned result
   * @return {Promise<Blob | string | JSON | Document | XMLDocument>}
   */


  request(url, type) {
    var deferred = new _core.defer();
    var response;
    var path = new _path.default(url); // If type isn't set, determine it from the file extension

    if (!type) {
      type = path.extension;
    }

    if (type == "blob") {
      response = this.getBlob(url);
    } else {
      response = this.getText(url);
    }

    if (response) {
      response.then(function (r) {
        let result = this.handleResponse(r, type);
        deferred.resolve(result);
      }.bind(this));
    } else {
      deferred.reject({
        message: "File not found in the epub: " + url,
        stack: new Error().stack
      });
    }

    return deferred.promise;
  }
  /**
   * Handle the response from request
   * @private
   * @param  {any} response
   * @param  {string} [type]
   * @return {any} the parsed result
   */


  handleResponse(response, type) {
    var r;

    if (type == "json") {
      r = JSON.parse(response);
    } else if ((0, _core.isXml)(type)) {
      r = (0, _core.parse)(response, "text/xml");
    } else if (type == "xhtml") {
      r = (0, _core.parse)(response, "application/xhtml+xml");
    } else if (type == "html" || type == "htm") {
      r = (0, _core.parse)(response, "text/html");
    } else {
      r = response;
    }

    return r;
  }
  /**
   * Get a Blob from Archive by Url
   * @param  {string} url
   * @param  {string} [mimeType]
   * @return {Blob}
   */


  getBlob(url, mimeType) {
    var decodededUrl = window.decodeURIComponent(url.substr(1)); // Remove first slash

    var entry = this.zip.file(decodededUrl);

    if (entry) {
      mimeType = mimeType || _mime.default.lookup(entry.name);
      return entry.async("uint8array").then(function (uint8array) {
        return new Blob([uint8array], {
          type: mimeType
        });
      });
    }
  }
  /**
   * Get Text from Archive by Url
   * @param  {string} url
   * @param  {string} [encoding]
   * @return {string}
   */


  getText(url, encoding) {
    var decodededUrl = window.decodeURIComponent(url.substr(1)); // Remove first slash

    var entry = this.zip.file(decodededUrl);

    if (entry) {
      return entry.async("string").then(function (text) {
        return text;
      });
    }
  }
  /**
   * Get a base64 encoded result from Archive by Url
   * @param  {string} url
   * @param  {string} [mimeType]
   * @return {string} base64 encoded
   */


  getBase64(url, mimeType) {
    var decodededUrl = window.decodeURIComponent(url.substr(1)); // Remove first slash

    var entry = this.zip.file(decodededUrl);

    if (entry) {
      mimeType = mimeType || _mime.default.lookup(entry.name);
      return entry.async("base64").then(function (data) {
        return "data:" + mimeType + ";base64," + data;
      });
    }
  }
  /**
   * Create a Url from an unarchived item
   * @param  {string} url
   * @param  {object} [options.base64] use base64 encoding or blob url
   * @return {Promise} url promise with Url string
   */


  createUrl(url, options) {
    var deferred = new _core.defer();

    var _URL = window.URL || window.webkitURL || window.mozURL;

    var tempUrl;
    var response;
    var useBase64 = options && options.base64;

    if (url in this.urlCache) {
      deferred.resolve(this.urlCache[url]);
      return deferred.promise;
    }

    if (useBase64) {
      response = this.getBase64(url);

      if (response) {
        response.then(function (tempUrl) {
          this.urlCache[url] = tempUrl;
          deferred.resolve(tempUrl);
        }.bind(this));
      }
    } else {
      response = this.getBlob(url);

      if (response) {
        response.then(function (blob) {
          tempUrl = _URL.createObjectURL(blob);
          this.urlCache[url] = tempUrl;
          deferred.resolve(tempUrl);
        }.bind(this));
      }
    }

    if (!response) {
      deferred.reject({
        message: "File not found in the epub: " + url,
        stack: new Error().stack
      });
    }

    return deferred.promise;
  }
  /**
   * Revoke Temp Url for a achive item
   * @param  {string} url url of the item in the archive
   */


  revokeUrl(url) {
    var _URL = window.URL || window.webkitURL || window.mozURL;

    var fromCache = this.urlCache[url];
    if (fromCache) _URL.revokeObjectURL(fromCache);
  }

  destroy() {
    var _URL = window.URL || window.webkitURL || window.mozURL;

    for (let fromCache in this.urlCache) {
      _URL.revokeObjectURL(fromCache);
    }

    this.zip = undefined;
    this.urlCache = {};
  }

}

var _default = Archive;
exports.default = _default;