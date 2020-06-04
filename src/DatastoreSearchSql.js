import "./i18n/i18n"

import React, { useState } from 'react';
import {Formik, Form, FieldArray, Field} from 'formik'
import DatePicker from 'react-date-picker'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {useTranslation} from "react-i18next"


function DatastoreSearchSql(props) {
  const [cleanedDatastoreUrl, setDatastoreUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const resource = JSON.parse(JSON.stringify(props.resource))

  const dateField = resource.schema.fields.find(field => field.type && field.type.includes('date'))
  const otherFields = resource.schema.fields.filter(field => !(field.type && field.type.includes('date')))

  const { t } = useTranslation();

  const operators = [
    {name: '=', label: '='},
    {name: '!=', label: '!='},
    {name: '<', label: '<'},
    {name: '>', label: '>'},
    {name: '<=', label: '<='},
    {name: '>=', label: '>='}
  ]

  function handleSubmit(values) {
    const clonedValues = JSON.parse(JSON.stringify(values))
    // Convert query to SQL string. Note we're adding 'COUNT(*) OVER()' so that
    // we get number of total rows info.
    const fieldNames = resource.schema.fields.map(field => field.name)
    let sqlQueryString = `SELECT COUNT(*) OVER () AS _count, "${fieldNames.join('", "')}" FROM "${resource.id}"`
    if (clonedValues.startDate) {
      const rule = {combinator: 'AND', field: dateField.name, operator: '>=', value: clonedValues.startDate}
      clonedValues.rules.push(rule)
    }
    if (clonedValues.endDate) {
      const rule = {combinator: 'AND', field: dateField.name, operator: '<=', value: clonedValues.endDate}
      clonedValues.rules.push(rule)
    }

    clonedValues.rules.forEach((rule, index) => {
      // Convert JS date object into string:
      rule.value = rule.value instanceof Date ? rule.value.toISOString() : rule.value
      if (index === 0) {
        // TODO: unquote value for numbers
        sqlQueryString += ` WHERE "${rule.field}" ${rule.operator} '${rule.value}'`
      } else { // If we have >1 rule we will need 'AND', 'OR' combinators
        sqlQueryString += ` ${rule.combinator.toUpperCase()} "${rule.field}" ${rule.operator} '${rule.value}'`
      }
    })

    // Set a limit of 100 rows as we don't need more for previewing...
    sqlQueryString += ` ORDER BY "${values.sort.fieldName}" ${values.sort.order} LIMIT 100`

    // Build a datastore URL with SQL string
    const datastoreUrl = props.apiUrl + `datastore_search_sql?sql=${sqlQueryString}`
    // Trigger Redux action
    resource.api = encodeURI(datastoreUrl)
    props.action(resource)
    setDatastoreUrl(datastoreUrl.replace('COUNT(*) OVER () AS _count, ', ''))
  }

  function handleReset() {
    // Initial api url should be `datastore_search` without any options.
    resource.api = props.apiUrl + `datastore_search?resource_id=${resource.id}&limit=100`
    props.action(resource)
    setDatastoreUrl(resource.api)
  }

  return (
    <Formik
      initialValues={{ rules: [], startDate: null, endDate: null, sort: {fieldName: resource.schema.fields[0].name, order: 'DESC'} }}
      onSubmit={values =>
        handleSubmit(values)
      }
      onReset={() =>
        handleReset()
      }
      render={({ values, setFieldValue, handleReset }) => (
        <Form className="form-inline dq-main-container">
          <div className="dq-heading">
            <div className="dq-heading-main"></div>
            <div className="dq-heading-total-rows">{props.totalRows}</div>
          </div>
          {dateField ? (
            <div className="dq-date-picker">
              <DatePicker
                value={values.startDate}
                clearIcon='X'
                onChange={val => setFieldValue(`startDate`, val)}
                format='yyyy-MM-dd' />
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              <DatePicker
                  value={values.endDate}
                  clearIcon='X'
                  onChange={val => setFieldValue(`endDate`, val)}
                  returnValue='end'
                  format='yyyy-MM-dd'
                  minDate={values.startDate} />
                <div className="datetime-field-name" style={{display: 'none'}}>
                  {dateField.title || dateField.name}
                </div>
            </div>
          ) : (
            ''
          )}
          <FieldArray
            name='rules'
            render={arrayHelpers => (
              <div className="dq-rule-container">
                <div className="dq-body">
                {values.rules && values.rules.length > 0 ? (
                  values.rules.map((rule, index) => (
                    <div key={index} className="dq-rule-item">
                      <Field name={`rules.${index}.combinator`} component="select" className="form-control" required>
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </Field>
                      <Field name={`rules.${index}.field`} component="select" className="form-control" required>
                        {otherFields.map((field, index) => (
                          <option value={field.name} key={`field${index}`}>{field.title || field.name}</option>
                        ))}
                      </Field>
                      <Field name={`rules.${index}.operator`} component="select" className="form-control" required>
                        {operators.map((operator, index) => (
                          <option value={operator.name} key={`operator${index}`}>{operator.label}</option>
                        ))}
                      </Field>
                      <Field name={`rules.${index}.value`} className="form-control" required />
                      <button
                        type="button"
                        className="btn btn-default dq-btn-remove"
                        onClick={() => arrayHelpers.remove(index)} // remove a rule from the list
                      >
                        -
                      </button>
                      <button
                        type="button"
                        className="btn btn-default dq-btn-add"
                        onClick={() => arrayHelpers.insert(index + 1, {combinator: 'AND', field: otherFields[0].name, operator: '=', value: ''})} // insert an empty rule at a position
                      >
                        +
                      </button>
                    </div>
                  ))
                ) : (
                  <button type="button" className="btn btn-default dq-rule-add" onClick={() => arrayHelpers.push({combinator: 'AND', field: otherFields[0].name, operator: '=', value: ''})}>
                    {/* show this when user has removed all rules from the list */}
                    {t('Add a rule')}
                  </button>
                )}
                </div>
                <div className="dq-rule-submit dq-footer">
                  <Field name={`sort.fieldName`} component="select" className="form-control">
                    {resource.schema.fields.map((field, index) => (
                      <option value={field.name} key={`field${index}`}>{field.title || field.name}</option>
                    ))}
                  </Field>
                  <Field name={`sort.order`} component="select" className="form-control">
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                  </Field>
                  <button type="submit" className="btn btn-primary submit-button">{t('Submit')}</button>
                  <button type="submit" className="btn btn-primary reset-button" onClick={handleReset}>{t('Reset')}</button>
                  <CopyToClipboard text={cleanedDatastoreUrl} onCopy={() => setCopied(true)}>
                    <button type="button" className="btn btn-primary copy-button">{copied ? "Copied" : "Copy API URI"}</button>
                  </CopyToClipboard>
                </div>
              </div>
            )}
          />
        </Form>
      )}
    />
  )
}

export default DatastoreSearchSql;
