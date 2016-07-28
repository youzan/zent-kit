var React = require('react');
var ReactDOM = require('react-dom');
var Perf = require('react-addons-perf');

var PageComponent = require('./examples/' + window.Component + '.js');

ReactDOM.render(<PageComponent />, document.getElementById('react-component-container'));

window.Perf = Perf;
