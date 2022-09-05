import "./i18n/i18n"

import React, {useState} from 'react';
import {Formik, Form, FieldArray, Field} from 'formik'
import DatePicker from 'react-date-picker'
import {useTranslation} from "react-i18next"
import QueryBuilder from './QueryBuilder'


function DatastoreSearchSql(props) {
  const[showQueryBuilder, setShowQueryBuilder] = useState(false)
  const[query, setQuery] = useState(`SELECT * FROM  "${props.resource.id}" ORDER BY "_id" ASC LIMIT 100`)

  const resource = JSON.parse(JSON.stringify(props.resource))

  const dateFields = resource.schema.fields.filter(field => field.type && field.type.includes('date'))
  const defaultDateFieldName = dateFields.length > 0 ? dateFields[0].name : null
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

  function validate(values) {
    const clonedValues = JSON.parse(JSON.stringify(values))
    const errors = {}
    if (!clonedValues.date.startDate && !clonedValues.date.endDate && clonedValues.rules.length === 0) { // No filters given so alert about that
      errors.message = 'Please, provide at least one rule.'
    }
    return errors
  }

  function handleSubmit(values) {
    const clonedValues = JSON.parse(JSON.stringify(values))
    // Convert query to SQL string. Note we're adding 'COUNT(*) OVER()' so that
    // we get number of total rows info.
    let sqlQueryString = `SELECT COUNT(*) OVER () AS _count, * FROM "${resource.id}" WHERE `
    if (clonedValues.date.startDate) {
      const rule = { combinator: 'AND', field: clonedValues.date.fieldName, operator: '>=', value: clonedValues.date.startDate}
      let localDateTime = new Date(clonedValues.date.startDate);
      // Now, convert it into GMT considering offset
      let offset = localDateTime.getTimezoneOffset();
      localDateTime = new Date(localDateTime.getTime() - offset * 60 * 1000);
      rule.value = localDateTime.toISOString();
      clonedValues.rules.push(rule)
    }
    if (clonedValues.date.endDate) {
      const rule = { combinator: 'AND', field: clonedValues.date.fieldName, operator: '<=', value: clonedValues.date.endDate}
      let localDateTime = new Date(clonedValues.date.endDate);
      // Now, convert it into GMT considering offset
      let offset = localDateTime.getTimezoneOffset();
      localDateTime = new Date(localDateTime.getTime() - offset * 60 * 1000);
      rule.value = localDateTime.toISOString();
      clonedValues.rules.push(rule)
    }

    clonedValues.rules.forEach((rule, index) => {
      // Convert JS date object into string:
      rule.value = rule.value instanceof Date ? rule.value.toISOString() : rule.value
      if (index === 0) {
        // TODO: unquote value for numbers
        sqlQueryString += `"${rule.field}" ${rule.operator} '${rule.value}'`
      } else { // If we have >1 rule we will need 'AND', 'OR' combinators
        sqlQueryString += ` ${rule.combinator.toUpperCase()} "${rule.field}" ${rule.operator} '${rule.value}'`
      }
    })
    // Set a limit of 100 rows as we don't need more for previewing...
    sqlQueryString += ` ORDER BY "_id" ASC LIMIT 100`

    // Build a datastore URL with SQL string
    const datastoreUrl = encodeURI(props.apiUrl + `datastore_search_sql?sql=${sqlQueryString}`)
    // Trigger Redux action
    resource.api = datastoreUrl
    setQuery(sqlQueryString)
    props.action(resource)
  }

  function handleReset() {
    // Initial api url should be `datastore_search` without any options.
    resource.api = props.apiUrl + `datastore_search?resource_id=${resource.id}&limit=100`
    props.action(resource)
  }
  
  function QueryBuiderToggle() {
    setShowQueryBuilder(!showQueryBuilder)
  }

  return (
    <Formik
      initialValues={{
        rules: resource.rules || [],
        date: resource.date || {
          startDate: null,
          endDate: null,
          fieldName: defaultDateFieldName
        } 
      }}
      validate={values =>
        validate(values)
      }
      onSubmit={values =>
        handleSubmit(values)
      }
      onReset={() =>
        handleReset()
      }
      render={({ values, setFieldValue, handleReset }) => (
        <>
          <Form className="form-inline dq-main-container">
            <div className="dq-heading"></div>
            {defaultDateFieldName ? (
              <div className="dq-date-picker">
                <Field name={`date.fieldName`} component="select" className="form-control">
                  { dateFields.map((field, index) => (
                    <option value={field.name} key={`dateField${index}`}>{field.title || field.name}</option>
                  ))}
                </Field>
                <DatePicker
                  value={values.date.startDate}
                  clearIcon='X'
                  nativeInputAriaLabel="Start date input box"
                  dayAriaLabel="Start day"
                  monthAriaLabel="Start month"
                  yearAriaLabel="Start year"
                  onChange={val => setFieldValue(`date.startDate`, val)}
                  format='yyyy-MM-dd' />
                <span className="fa fa-long-arrow-right" aria-hidden="true"></span>
                <DatePicker
                    value={values.date.endDate}
                    clearIcon='X'
                    nativeInputAriaLabel="End date input box"
                    dayAriaLabel="End day"
                    monthAriaLabel="End month"
                    yearAriaLabel="End year"
                    onChange={val => setFieldValue(`date.endDate`, val)}
                    returnValue='end'
                    format='yyyy-MM-dd'
                    minDate={values.date.startDate} />
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
                        <Field name={`rules.${index}.combinator`} aria-label="Choose combinator: AND/OR" component="select" className="form-control" required>
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </Field>
                        <Field name={`rules.${index}.field`} aria-label="Choose field" component="select" className="form-control" required>
                          {otherFields.map((field, index) => (
                            <option value={field.name} key={`field${index}`}>{field.title || field.name}</option>
                          ))}
                        </Field>
                        <Field name={`rules.${index}.operator`} aria-label="Choose operator" component="select" className="form-control" required>
                          {operators.map((operator, index) => (
                            <option value={operator.name} key={`operator${index}`}>{operator.label}</option>
                          ))}
                        </Field>
                        <Field name={`rules.${index}.value`} aria-label="Input custom rule" className="form-control" required />
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
                          onClick={() => arrayHelpers.insert(index, {combinator: 'AND', field: otherFields[0].name, operator: '=', value: ''})} // insert an empty rule at a position
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
                    <button type="submit" className="btn btn-primary submit-button">{t('Submit')}</button>
                    <button type="submit" className="btn btn-primary reset-button" onClick={handleReset}>{t('Reset')}</button>
                    <button type='button' className={`btn btn-default query-builder-button ${showQueryBuilder?'active': ''}`} onClick={QueryBuiderToggle}>{t('Query Builder')}</button>
                  </div>
                </div>
              )}
            />
          </Form>
          {
            showQueryBuilder?<QueryBuilder apiUrl={props.apiUrl} queryString={query}/>:null
          }
        </>
      )}
    />
  )
}

export default DatastoreSearchSql;
