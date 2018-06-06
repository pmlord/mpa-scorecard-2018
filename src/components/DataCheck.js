import React from 'react';
import withStore from '../services/legislators-store';
import map from 'lodash/map';

export default withStore(function DataCheck(props) {
  const { store } = props;

  if (store.get('yourLegislators').length === 0) return null;

  const data = store.get('dataCheck');
  const { normalizedInput, offices } = data;

  const renderedAddress = map(normalizedInput, (value, key) => {
    return <span key={key}>{key}: <b>{value}</b> </span>;
  });

  const renderedOffices = offices.map((office) => {
    const { districtName, officialName } = office;
    return <li key={districtName}>{districtName}: <b>{officialName}</b></li>;
  });

  return (
    <section className="container">
      <p><b>Interpretted address:</b></p>
      <ul>
        <li>{renderedAddress}</li>
      </ul>
      <p><b>Officials:</b></p>
      <ul>
        {renderedOffices}
      </ul>
    </section>
  )
})
