import { QueryBuilder } from '../src/App.js'


const resource = {
  name: 'test',
  id: 'some-random-id',
  path: 'https://montreal-staging-site.ca/datastore/dump/some-random-id',
  api: 'https://montreal-staging-site.ca/api/3/action/datastore_search?resource_id=abcd',
  proxy: 'https://frontend.com/proxy/api/datastore_search?resource_id=abcd',
  schema: {
    fields: [
      {
        name: 'a',
        type: 'date'
      },
      {
        name: 'b',
        type: 'timestamp'
      },
      {
        name: 'c',
        type: 'string'
      }
    ]
  }
}

const filterBuilderAction = (resource) => {
  alert(JSON.stringify(resource))
}

export default {
  component: QueryBuilder,
  props: {resource, filterBuilderAction}
};
