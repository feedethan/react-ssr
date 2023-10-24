// 服务端
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';

import createStoreInstance from './store';
import { Helmet } from 'react-helmet';
import Routes, { routesConfig } from './routes';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('dist/public'));

app.get('*', (req, res) => {
  const store = createStoreInstance();

  // server端判断组件有getInitialData的话初始获取数据
  const promises = routesConfig?.map((route) => {
    const component = route?.component;
    if (route?.path === req?.url && component?.getInitialData) {
      return component?.getInitialData(store);
    } else {
      return null;
    }
  });

  Promise.all(promises).then(() => {
    // 初始store的数据挂载window上 注入脱水数据
    const preloadedState = store.getState();

    // 组件渲染成字符串
    const content = renderToString(
      // server端store注入
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <Routes />
        </StaticRouter>
      </Provider>
    );

    // 从page取到
    const helmet = Helmet.renderStatic();

    // 脱水 将组件树序列化成静态的 HTML 片段，能直接看到初始视图，不过已经无法与之交互， 引入client打包js
    const html = `
      <html>
        <head>
          ${helmet?.title?.toString()}
        </head>
        <body>
          <div id="root">${content}</div>
          <script>
          window.__PRELOAD_STATE__=${JSON.stringify(preloadedState)}
          </script>
          <script src="bundle_client.js"></script>
        </body>
      </html>
    `;

    res.writeHead(200, {
      'content-type': 'text/html;charset=utf8',
    });
    //返回html
    res.end(html);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
