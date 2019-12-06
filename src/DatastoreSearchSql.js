import React from 'react';
import {Formik, Form, FieldArray, Field} from 'formik'
import DatePicker from 'react-date-picker'


function DatastoreSearchSql(props) {
  const resource = JSON.parse(JSON.stringify(props.resource))

  const dateField = resource.schema.fields.find(field => field.type && field.type.includes('date'))
  const otherFields = resource.schema.fields.filter(field => !(field.type && field.type.includes('date')))

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
    let sqlQueryString = `SELECT COUNT(*) OVER (), * FROM "${resource.id}" WHERE `
    if (!clonedValues.startDate && !clonedValues.endDate && clonedValues.rules.length === 0) { // No filters given so alert about that
      alert('Please, provide at least one rule.')
    } else {
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
          sqlQueryString += `"${rule.field}" ${rule.operator} '${rule.value}'`
        } else { // If we have >1 rule we will need 'AND', 'OR' combinators
          sqlQueryString += ` ${rule.combinator.toUpperCase()} "${rule.field}" ${rule.operator} '${rule.value}'`
        }
      })
      // Set a limit of 100 rows as we don't need more for previewing...
      sqlQueryString += ` LIMIT 100`
    }
    // Build a datastore URL with SQL string
    const datastoreUrl = encodeURI(props.apiUrl + `datastore_search_sql?sql=${sqlQueryString}`)
    // Trigger Redux action
    resource.api = datastoreUrl
    props.action(resource)
  }

  return (
    <Formik
      initialValues={{ rules: [], startDate: null, endDate: null }}
      onSubmit={values =>
        handleSubmit(values)
      }
      render={({ values, setFieldValue }) => (
        <Form className="form-inline">
          {dateField ? (
            <div>
              <DatePicker
                value={values.startDate}
                clearIcon='X'
                onChange={val => setFieldValue(`startDate`, val)}
                format='yyyy-MM-dd'
                maxDate={new Date()} />
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              <DatePicker
                  value={values.endDate}
                  clearIcon='X'
                  onChange={val => setFieldValue(`endDate`, val)}
                  returnValue='end'
                  format='yyyy-MM-dd'
                  minDate={values.startDate}
                  maxDate={new Date()} />
            </div>
          ) : (
            ''
          )}
          <FieldArray
            name='rules'
            render={arrayHelpers => (
              <div className="dq-rule-container">
                <div className="dq-heading"></div>
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
                        onClick={() => arrayHelpers.insert(index, {combinator: 'AND', field: otherFields[0].name, operator: '=', value: ''})} // insert an empty rule at a position
                      >
                        +
                      </button>
                    </div>
                  ))
                ) : (
                  <button type="button" className="btn btn-default dq-rule-add" onClick={() => arrayHelpers.push({combinator: 'AND', field: otherFields[0].name, operator: '=', value: ''})}>
                    {/* show this when user has removed all rules from the list */}
                    Add a rule
                  </button>
                )}
                </div>
                <div className="dq-rule-submit dq-footer">
                  <button type="submit" className="btn btn-primary">Submit</button>
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
