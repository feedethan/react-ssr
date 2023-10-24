import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

// 工厂模式 server端和client都会调用
export default function createStoreInstance(preloadedState = {}) {
  return createStore(reducer, preloadedState, applyMiddleware(thunk));
}
