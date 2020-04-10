/********************************
 * @file: home page
 *******************************/

import React, { Component } from "react";
import CaptchaInput from 'src/components/CaptchaInput'
export default class App extends Component {
  onChange(v) {
    console.log(v)
  }
  render() {
    return (
      <div className="column">
        <p>Hello world</p>
        <CaptchaInput getValue={this.onChange.bind(this)} />
      </div>
    );
  }
}
