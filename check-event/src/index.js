import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Route, Switch} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import {ConfigProvider, LocaleProvider} from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import en_US from "antd/lib/locale-provider/en_US";

ReactDOM.render(
  <BrowserRouter>
      <ConfigProvider locale={zh_CN}>
          <Switch>
              <Route path="/" component={App} />
          </Switch>
      </ConfigProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
