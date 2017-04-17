var React = require('react');
var ReactDOM = require('react-dom');

var PageComponent = require('./examples/' + window.Component + '.js');

ReactDOM.render(<PageComponent />, document.getElementById('react-component-container'));
