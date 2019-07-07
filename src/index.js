import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { compileView } from 'datapackage-render'
const { Dataset } = require('data.js')


const instances = document.getElementsByClassName('react-me-datapackage-views')
function parseDatapackageIdentifier(stringOrJSON) {
  try {
    return JSON.parse(stringOrJSON)
  } catch (e) {
    return stringOrJSON
  }
}

for (const instance of instances) {
  const DP_ID = parseDatapackageIdentifier(instance.getAttribute('data-datapackage-json'))

  // Load Dataset object
  Dataset.load(DP_ID).then(dataset => {
    dataset.descriptor.views.forEach(view => {
      const compiledView = compileView(view, dataset.descriptor)
      // Render filters UI if data is in datastore
      if (compiledView.resources[0].datastore_active) {
        render(compiledView)
      }
    })
  })
  .catch((error) => {
    console.warn('Failed to load a Dataset from provided datapackage id\n' + error)
  })
}

function render(view) {
  ReactDOM.render(
    <App view={view} />,
    document.getElementById(`datapackage-filter-${view.id}`)
  )
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
