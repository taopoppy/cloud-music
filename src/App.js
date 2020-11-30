import React from 'react';
// 引入样式配置
import { IconStyle } from './assets/iconfont/iconfont';
import { GlobalStyle } from './style';

// 引入路由配置
import { HashRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from './routes/index.js'

// 引入react-redux,store等状态管理相关
import { Provider } from 'react-redux'
import store from './store/index.js'

// 引入context全局
import { Data } from './application/Singers/data.js'

function App () {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        <Data>
          { renderRoutes(routes) }
        </Data>
      </HashRouter>
    </Provider>
  );
}

export default App