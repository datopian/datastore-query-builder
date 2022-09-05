"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./i18n/i18n");

var _react = _interopRequireWildcard(require("react"));

var _reactTabsRedux = require("react-tabs-redux");

var _reactHighlight = _interopRequireDefault(require("react-highlight"));

var _reactI18next = require("react-i18next");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function QueryBuilder(props) {
  var _useTranslation = (0, _reactI18next.useTranslation)(),
      t = _useTranslation.t;

  var queryString = props.queryString;

  var _useState = (0, _react.useState)('Copy'),
      _useState2 = _slicedToArray(_useState, 2),
      copyButton = _useState2[0],
      setcopyButton = _useState2[1];

  var apiUrl = props.apiUrl;
  var datastoreUrl = encodeURI(apiUrl + "datastore_search_sql?sql=".concat(queryString));
  var snippetSets = [{
    lang: 'cUrl',
    format: 'bash',
    snippet: "curl -L -s \"".concat(datastoreUrl, "\"")
  }, {
    lang: 'Python',
    format: 'python',
    snippet: "import requests\nfrom urllib import parse\n\nsql_query =  '''SELECT COUNT(*) OVER () AS _count, * FROM \"0b2b7ce6-d7b8-41dc-a549-1b8598ca6c9d\" WHERE \"index\" = 'high' ORDER BY \"_id\" ASC LIMIT 100'''\nparams = {'sql': sql_query}\n\ntry:\n    resposne = requests.get('https://ckan-dev.nationalgrid.dev.datopian.com/api/3/action/datastore_search_sql', \n\t\t\t\t\t\t\t  params = parse.urlencode(params))\n    data = resposne.json()[\"result\"]\n    print(data) # Printing data\nexcept requests.exceptions.RequestException as e:\n    print(e.response.text)"
  }, {
    lang: 'Javascript',
    format: 'javascript',
    snippet: "const sql_query = `".concat(queryString, "`\n\nfetch('").concat(apiUrl, "datastore_search_sql?sql=' + encodeURI(sql_query))\n  .then((response) => response.json())\n  .then((data) => {\n    console.log('Success:', data['result']);\n  })\n  .catch((error) => {\n    console.error('Error:', error);\n  });")
  }, {
    lang: 'R',
    format: 'r',
    snippet: "library(jsonlite)\n\nencoded_query <- '".concat(datastoreUrl, "'\nreturned  <- fromJSON(encoded_query)\n\ndf <- returned$result$records\nprint(df)")
  }, {
    lang: 'Pandas',
    format: 'python',
    snippet: "# Install pandas python package\n# pip install pandas\n\n# Get data and convert into dataframe\nimport pandas as pd\nimport requests\nfrom urllib import parse\n\nsql_query =  '''SELECT COUNT(*) OVER () AS _count, * FROM \"0b2b7ce6-d7b8-41dc-a549-1b8598ca6c9d\" WHERE \"index\" = 'high' ORDER BY \"_id\" ASC LIMIT 100'''\nparams = {'sql': sql_query}\n\ntry:\n    resposne = requests.get('https://ckan-dev.nationalgrid.dev.datopian.com/api/3/action/datastore_search_sql', \n                params = parse.urlencode(params))\n    data_dict = resposne.json()[\"result\"]\n    df = pd.DataFrame(data_dict['records'])\n    print(df) # Dataframe\nexcept requests.exceptions.RequestException as e:\n    print(e.response.text)"
  }];

  function handleCopy(snippet) {
    navigator.clipboard.writeText(snippet);
    setcopyButton('Copied');
  }

  function onTabChange() {
    setcopyButton('Copy');
  }

  return _react.default.createElement("div", {
    className: "dq-querybuilder"
  }, _react.default.createElement("h3", null, t('Integrate into your tools')), _react.default.createElement(_reactTabsRedux.Tabs, null, snippetSets.map(function (item, key) {
    return _react.default.createElement(_reactTabsRedux.TabLink, {
      onClick: onTabChange,
      to: item.lang,
      key: key,
      className: "mr-4 tab-".concat(item.lang)
    }, item.lang);
  }), snippetSets.map(function (item, key) {
    return _react.default.createElement(_reactTabsRedux.TabContent, {
      key: key,
      for: item.lang
    }, _react.default.createElement("button", {
      className: "snippet-copy",
      style: {
        float: 'right'
      },
      onClick: function onClick() {
        return handleCopy(item.snippet);
      }
    }, copyButton), _react.default.createElement(_reactHighlight.default, {
      language: item.format,
      className: "language-".concat(item.format)
    }, item.snippet));
  })));
}

var _default = QueryBuilder;
exports.default = _default;