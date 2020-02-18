"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryBuilder = void 0;

var _react = _interopRequireDefault(require("react"));

require("./App.css");

var _DatastoreSearchSql = _interopRequireDefault(require("./DatastoreSearchSql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QueryBuilder = function QueryBuilder(props) {
  var resource = JSON.parse(JSON.stringify(props.resource));

  if (resource.schema) {
    var apiUrl = resource.proxy || resource.api || resource.path;
    apiUrl = new URL(apiUrl).origin + '/api/3/action/';
    return _react.default.createElement("div", {
      className: "App"
    }, _react.default.createElement(_DatastoreSearchSql.default, {
      resource: resource,
      apiUrl: apiUrl,
      action: props.filterBuilderAction
    }));
  } else {
    return _react.default.createElement("div", {
      className: "no-filters"
    });
  }
};

exports.QueryBuilder = QueryBuilder;