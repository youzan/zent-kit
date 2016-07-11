import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';

let PageComponent = require('./examples/' + window.Component + '.js').default;

ReactDOM.render(<PageComponent />, document.getElementById('react-component-container'));

window.Perf = Perf;
