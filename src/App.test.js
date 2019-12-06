import React from 'react';
import ReactDOM from 'react-dom';
import {QueryBuilder} from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<QueryBuilder resource={{}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
