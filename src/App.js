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

function App () {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        { renderRoutes(routes) }
      </HashRouter>
    </Provider>
  );
}

export default App