"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "QueryBuilder", {
  enumerable: true,
  get: function get() {
    return _App.QueryBuilder;
  }
});

var _i18n = _interopRequireDefault(require("./i18n/i18n"));

var _App = require("./App");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_i18n.default.options.resources) {
  console.log('Translations loaded');
}