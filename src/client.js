// 客户端渲染
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import createStoreInstance from './store';
import Routes from './routes';

// 使用server端给的初始数据
const store = createStoreInstance(window?.__PRELOAD_STATE__);

console.log(window?.__PRELOAD_STATE__);
console.log('store: ', store);
console.log('store.state: ', store.getState());

// 注水 前端接管服务端返回来的页面
ReactDOM.hydrate(
  // client端store注入
  <Provider store={store}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>,
  // 同serverjs中的模板节点
  document.querySelector('#root')
);
