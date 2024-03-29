import React, { Component } from 'react';

export default class Layout extends Component {
  render() {
    return <html>
      <head>
        <title>{this.props.title || '前端日志监控系统'}</title>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"></meta>
        <meta name="keywords" content={this.props.keywords}></meta>
        <meta name="description" content={this.props.description}></meta>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"></link>
        {/* eslint-disable react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: `window.__API_CONFIG__ = ${JSON.stringify(this.props.apiConfig)}` }} />
        {/* eslint-enable react/no-danger */}
      </head>
      <body><div id="app">{this.props.children}</div></body>
    </html>;
  }
}
