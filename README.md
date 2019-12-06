This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage

Install it:

```
yarn add @datopian/datastore-query-builder
```

Basic usage in a React app:

```JavaScript
import React from 'react'
import { QueryBuilder } from 'datastore-query-builder'


export const MyComponent = props => {
  // `resource` is a resource descriptor that must have 'name', 'id' and
  // 'schema' properties.

  // `action` - this should be a Redux action that expects back the resource
  // descriptor with updated 'api' property. It is up to your app to fetch data.
  return (
    <QueryBuilder resource={resource} filterBuilderAction={action} />
  )
}
```

Note that this app doesn't fetch any data - it only builds API URI based on user
selection.

It's easier to learn by examples provided in the `/__fixtures__/` directory.

## Available Scripts

In the project directory, you can run:

### `yarn cosmos` or `npm run cosmos`

Runs dev server with the fixtures from `__fixtures__` directory. Learn more about `cosmos` - https://github.com/react-cosmos/react-cosmos

### `yarn start` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test` or `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build:package` or `npm run build:package`

Run this to compile your code so it is installable via yarn/npm.

### `yarn build` or `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
