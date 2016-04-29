/*
## Write Something here

You can write guides for users here
*/
import React, { Component } from 'react';

export default class Advanced extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        console.log(arguments);
        alert('So easy!');
    }

    render() {
        return <div onClick={this.onClick}>Click here!</div>;
    }
}
