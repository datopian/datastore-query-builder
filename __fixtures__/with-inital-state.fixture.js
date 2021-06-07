

import { QueryBuilder } from '../src/App.js'

const resource = {
  "hash": "",
  "description": "",
  "format": "CSV",
  "api": "http://localhost:5000/api/3/action/datastore_search?filters=%7B%7D&resource_id=de67bb80-87e3-475d-b236-2e15bbe36fc6",
  "title": "vix-daily.csv",
  "package_id": "2814a157-cf8d-4802-9788-42c6d58d6b04",
  "mimetype_inner": null,
  "url_type": "upload",
  "date": {
    "startDate": null,
    "fieldName": "VIX Close",
    "endDate": null
  },
  "path": "http://localhost:5000/dataset/2814a157-cf8d-4802-9788-42c6d58d6b04/resource/de67bb80-87e3-475d-b236-2e15bbe36fc6/download/vix-daily.csv",
  "datastore_active": true,
  "id": "de67bb80-87e3-475d-b236-2e15bbe36fc6",
  "size": 132747,
  "mimetype": "text/csv",
  "cache_url": null,
  "name": "vix-daily.csv",
  "created": "2021-05-26T06:16:42.743586",
  "url": "http://localhost:5000/dataset/2814a157-cf8d-4802-9788-42c6d58d6b04/resource/de67bb80-87e3-475d-b236-2e15bbe36fc6/download/vix-daily.csv",
  "cache_last_updated": null,
  "rules": [
    {
      "operator": "=",
      "field": "VIX Low",
      "combinator": "AND",
      "value": ""
    }
  ],
  "state": "active",
  "last_modified": "2021-05-26T06:16:42.703839",
  "position": 0,
  "revision_id": "9aa66aa7-eea4-4e81-8503-81fdd69f11a6",
  "resource_type": null,
  "schema": {
    "fields": [
      {
        "type": "datetime",
        "name": "Date",
        "format": "any"
      },
      {
        "type": "number",
        "name": "VIX Open"
      },
      {
        "type": "number",
        "name": "VIX High"
      },
      {
        "type": "number",
        "name": "VIX Low"
      },
      {
        "type": "date",
        "name": "VIX Close"
      }
    ]
  }
}

const filterBuilderAction = (resource) => {
  alert(JSON.stringify(resource))
}

export default {
  component: QueryBuilder,
  props: { resource, filterBuilderAction }
};
