import React from 'react';
import renderer from 'react-test-renderer';
import SearchForm from '../src/features/filters/Search/SearchForm'

test('SearchForm renders correctly', () => {
  const tree = renderer
    .create(<SearchForm />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
