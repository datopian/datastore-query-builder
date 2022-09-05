import './i18n/i18n'
import React, { useState } from 'react';
import { Tabs, TabLink, TabContent } from 'react-tabs-redux'
import Highlight from 'react-highlight'
import {useTranslation} from "react-i18next"



function QueryBuilder(props) {
  const { t } = useTranslation();

  const queryString = props.queryString
  const [copyButton, setcopyButton] = useState('Copy');

  const apiUrl = props.apiUrl
  const datastoreUrl = encodeURI(apiUrl + `datastore_search_sql?sql=${queryString}`)

  const snippetSets = [{
    lang: 'cUrl',
    format: 'bash',
    snippet: `curl -L -s "${datastoreUrl}"`
  }, {
    lang: 'Python',
    format: 'python',
    snippet: `import requests
from urllib import parse

sql_query =  '''SELECT COUNT(*) OVER () AS _count, * FROM "0b2b7ce6-d7b8-41dc-a549-1b8598ca6c9d" WHERE "index" = 'high' ORDER BY "_id" ASC LIMIT 100'''
params = {'sql': sql_query}

try:
    resposne = requests.get('https://ckan-dev.nationalgrid.dev.datopian.com/api/3/action/datastore_search_sql', 
							  params = parse.urlencode(params))
    data = resposne.json()["result"]
    print(data) # Printing data
except requests.exceptions.RequestException as e:
    print(e.response.text)`
  },
  {
    lang: 'Javascript',
    format: 'javascript',
    snippet: `const sql_query = \`${queryString}\`

fetch('${apiUrl}datastore_search_sql?sql=' + encodeURI(sql_query))
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data['result']);
  })
  .catch((error) => {
    console.error('Error:', error);
  });`
  },
  {
    lang: 'R',
    format: 'r',
    snippet:
      `library(jsonlite)

encoded_query <- '${datastoreUrl}'
returned  <- fromJSON(encoded_query)

df <- returned$result$records
print(df)`
  },
  {
    lang: 'Pandas',
    format: 'python',
    snippet: `# Install pandas python package
# pip install pandas

# Get data and convert into dataframe
import pandas as pd
import requests
from urllib import parse

sql_query =  '''SELECT COUNT(*) OVER () AS _count, * FROM "0b2b7ce6-d7b8-41dc-a549-1b8598ca6c9d" WHERE "index" = 'high' ORDER BY "_id" ASC LIMIT 100'''
params = {'sql': sql_query}

try:
    resposne = requests.get('https://ckan-dev.nationalgrid.dev.datopian.com/api/3/action/datastore_search_sql', 
                params = parse.urlencode(params))
    data_dict = resposne.json()["result"]
    df = pd.DataFrame(data_dict['records'])
    print(df) # Dataframe
except requests.exceptions.RequestException as e:
    print(e.response.text)`
  }]

  function handleCopy(snippet) {
    navigator.clipboard.writeText(snippet)
    setcopyButton('Copied');
  }

  function onTabChange() {
    setcopyButton('Copy');
  }

  return (
    <div className="dq-querybuilder">
      <h3>{t('Integrate into your tools')}</h3>
      <Tabs>
        {snippetSets.map((item, key) => {
          return <TabLink onClick={onTabChange} to={item.lang} key={key} className={`mr-4 tab-${item.lang}`}>{item.lang}</TabLink>
        })}

        {snippetSets.map((item, key) => {
          return <TabContent key={key} for={item.lang}>
            <button className="snippet-copy" style={{ float: 'right' }}
              onClick={() => handleCopy(item.snippet)}>{copyButton}</button>
            <Highlight language={item.format} className={`language-${item.format}`}>
              {item.snippet}
            </Highlight>
          </TabContent>
        })}
      </Tabs>
    </div>
  )
}
export default QueryBuilder