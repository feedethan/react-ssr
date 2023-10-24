import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { fetchHomeData } from '../store/actions/home';

const Home = () => {
  const dispatch = useDispatch();
  // 获取store数据
  const homeData = useSelector((state) => state.home);

  console.log('home dispatch: ', dispatch);
  console.log('home data: ', homeData);

  useEffect(() => {
    // 传入的异步函数 需要配置thunk
    dispatch(fetchHomeData);
  }, []);

  // 提供给server端使用
  const renderHead = () => {
    return (
      <Helmet>
        <title>首页</title>
      </Helmet>
    );
  };

  const handleClick = () => {
    console.log('我被点击了！');
  };

  return (
    <div>
      {renderHead()}
      <h1>首页</h1>
      <ul>
        {homeData?.articles?.map((article) => (
          <li key={article?.id}>
            <p>文章标题：{article?.title}</p>
            <p>文章内容：{article?.content}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleClick}>点我</button>
    </div>
  );
};

// ssr初始获取数据 server端调用
Home.getInitialData = async (store) => {
  // 触发action 同上
  return store.dispatch(fetchHomeData);
};

export default Home;
