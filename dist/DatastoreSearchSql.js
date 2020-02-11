"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _formik = require("formik");

var _reactDatePicker = _interopRequireDefault(require("react-date-picker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DatastoreSearchSql(props) {
  var resource = JSON.parse(JSON.stringify(props.resource));
  var dateField = resource.schema.fields.find(function (field) {
    return field.type && field.type.includes('date');
  });
  var otherFields = resource.schema.fields.filter(function (field) {
    return !(field.type && field.type.includes('date'));
  });
  var operators = [{
    name: '=',
    label: '='
  }, {
    name: '!=',
    label: '!='
  }, {
    name: '<',
    label: '<'
  }, {
    name: '>',
    label: '>'
  }, {
    name: '<=',
    label: '<='
  }, {
    name: '>=',
    label: '>='
  }];

  function handleSubmit(values) {
    var clonedValues = JSON.parse(JSON.stringify(values)); // Convert query to SQL string. Note we're adding 'COUNT(*) OVER()' so that
    // we get number of total rows info.

    var sqlQueryString = "SELECT COUNT(*) OVER () AS _count, * FROM \"".concat(resource.id, "\" WHERE ");

    if (!clonedValues.startDate && !clonedValues.endDate && clonedValues.rules.length === 0) {
      // No filters given so alert about that
      alert('Please, provide at least one rule.');
    } else {
      if (clonedValues.startDate) {
        var rule = {
          combinator: 'AND',
          field: dateField.name,
          operator: '>=',
          value: clonedValues.startDate
        };
        clonedValues.rules.push(rule);
      }

      if (clonedValues.endDate) {
        var _rule = {
          combinator: 'AND',
          field: dateField.name,
          operator: '<=',
          value: clonedValues.endDate
        };
        clonedValues.rules.push(_rule);
      }

      clonedValues.rules.forEach(function (rule, index) {
        // Convert JS date object into string:
        rule.value = rule.value instanceof Date ? rule.value.toISOString() : rule.value;

        if (index === 0) {
          // TODO: unquote value for numbers
          sqlQueryString += "\"".concat(rule.field, "\" ").concat(rule.operator, " '").concat(rule.value, "'");
        } else {
          // If we have >1 rule we will need 'AND', 'OR' combinators
          sqlQueryString += " ".concat(rule.combinator.toUpperCase(), " \"").concat(rule.field, "\" ").concat(rule.operator, " '").concat(rule.value, "'");
        }
      }); // Set a limit of 100 rows as we don't need more for previewing...

      sqlQueryString += " LIMIT 100";
    } // Build a datastore URL with SQL string


    var datastoreUrl = encodeURI(props.apiUrl + "datastore_search_sql?sql=".concat(sqlQueryString)); // Trigger Redux action

    resource.api = datastoreUrl;
    props.action(resource);
  }

  return _react.default.createElement(_formik.Formik, {
    initialValues: {
      rules: [],
      startDate: null,
      endDate: null
    },
    onSubmit: function onSubmit(values) {
      return handleSubmit(values);
    },
    render: function render(_ref) {
      var values = _ref.values,
          setFieldValue = _ref.setFieldValue;
      return _react.default.createElement(_formik.Form, {
        className: "form-inline dq-main-container"
      }, _react.default.createElement("div", {
        className: "dq-heading"
      }), dateField ? _react.default.createElement("div", null, _react.default.createElement(_reactDatePicker.default, {
        value: values.startDate,
        clearIcon: "X",
        onChange: function onChange(val) {
          return setFieldValue("startDate", val);
        },
        format: "yyyy-MM-dd",
        maxDate: new Date()
      }), _react.default.createElement("i", {
        className: "fa fa-long-arrow-right",
        "aria-hidden": "true"
      }), _react.default.createElement(_reactDatePicker.default, {
        value: values.endDate,
        clearIcon: "X",
        onChange: function onChange(val) {
          return setFieldValue("endDate", val);
        },
        returnValue: "end",
        format: "yyyy-MM-dd",
        minDate: values.startDate,
        maxDate: new Date()
      })) : '', _react.default.createElement(_formik.FieldArray, {
        name: "rules",
        render: function render(arrayHelpers) {
          return _react.default.createElement("div", {
            className: "dq-rule-container"
          }, _react.default.createElement("div", {
            className: "dq-body"
          }, values.rules && values.rules.length > 0 ? values.rules.map(function (rule, index) {
            return _react.default.createElement("div", {
              key: index,
              className: "dq-rule-item"
            }, _react.default.createElement(_formik.Field, {
              name: "rules.".concat(index, ".combinator"),
              component: "select",
              className: "form-control",
              required: true
            }, _react.default.createElement("option", {
              value: "AND"
            }, "AND"), _react.default.createElement("option", {
              value: "OR"
            }, "OR")), _react.default.createElement(_formik.Field, {
              name: "rules.".concat(index, ".field"),
              component: "select",
              className: "form-control",
              required: true
            }, otherFields.map(function (field, index) {
              return _react.default.createElement("option", {
                value: field.name,
                key: "field".concat(index)
              }, field.title || field.name);
            })), _react.default.createElement(_formik.Field, {
              name: "rules.".concat(index, ".operator"),
              component: "select",
              className: "form-control",
              required: true
            }, operators.map(function (operator, index) {
              return _react.default.createElement("option", {
                value: operator.name,
                key: "operator".concat(index)
              }, operator.label);
            })), _react.default.createElement(_formik.Field, {
              name: "rules.".concat(index, ".value"),
              className: "form-control",
              required: true
            }), _react.default.createElement("button", {
              type: "button",
              className: "btn btn-default dq-btn-remove",
              onClick: function onClick() {
                return arrayHelpers.remove(index);
              } // remove a rule from the list

            }, "-"), _react.default.createElement("button", {
              type: "button",
              className: "btn btn-default dq-btn-add",
              onClick: function onClick() {
                return arrayHelpers.insert(index, {
                  combinator: 'AND',
                  field: otherFields[0].name,
                  operator: '=',
                  value: ''
                });
              } // insert an empty rule at a position

            }, "+"));
          }) : _react.default.createElement("button", {
            type: "button",
            className: "btn btn-default dq-rule-add",
            onClick: function onClick() {
              return arrayHelpers.push({
                combinator: 'AND',
                field: otherFields[0].name,
                operator: '=',
                value: ''
              });
            }
          }, "Add a rule")), _react.default.createElement("div", {
            className: "dq-rule-submit dq-footer"
          }, _react.default.createElement("button", {
            type: "submit",
            className: "btn btn-primary"
          }, "Submit")));
        }
      }));
    }
  });
}

var _default = DatastoreSearchSql;
exports.default = _default;