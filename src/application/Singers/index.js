import React, {useState, useEffect, useCallback, memo} from 'react';
import Horizen from '../../baseUI/horizen-item';
import { singerType, singerArea, alphaTypes } from '../../api/config';
import {
  NavContainer,
  ListContainer,
  List,
  ListItem,
} from "./style";
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList
} from './store/actionCreators';
import  LazyLoad, {forceCheck} from 'react-lazyload';
import Scroll from './../../baseUI/scroll/index';
import {connect} from 'react-redux';
import Loading from '../../baseUI/loading';

function Singers(props) {
  let [singertype, setSingerType] = useState('');
  let [singerarea, setSingerArea] = useState('');
  let [alpha, setAlpha] = useState('');

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props;

  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

  useEffect(() => {
    getHotSingerDispatch();
    // eslint-disable-next-line
  }, []);

  // 选择了字母的处理函数
  let handleUpdateAlpha = useCallback((val) => {
    setAlpha(val);
    updateDispatch(singertype, singerarea, val);
    // eslint-disable-next-line
  },[setAlpha]);

  // 选择了地区的处理函数
  let handleUpdateSingerArea = useCallback((val) => {
    setSingerArea(val);
    updateDispatch(singertype, val, alpha);
    // eslint-disable-next-line
  }, [setSingerArea]);

  // 选择了歌手类型的处理函数
  let handleUpdateSingerType = useCallback((val) => {
    setSingerType(val);
    updateDispatch(val,singerarea, alpha);
    // eslint-disable-next-line
  }, [setSingerType])

  // 底部上拉加载更多
  const handlePullUp = () => {
    let temp_hot = (singertype === '' && singerarea === '' && alpha === '')
    pullUpRefreshDispatch(singertype, singerarea, alpha, temp_hot, pageCount);
  };

  // 顶部下拉重新加载
  const handlePullDown = () => {
    pullDownRefreshDispatch(singertype, singerarea, alpha);
  };

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS(): [];
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music"/>}>
                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };

  return (
    <div>
      <NavContainer>
        <Horizen list={singerType} title={"歌手分类:"} handleClick={ handleUpdateSingerType} oldVal={singertype}></Horizen>
        <Horizen list={singerArea} title={"地区分类:"} handleClick={handleUpdateSingerArea} oldVal={singerarea}></Horizen>
        <Horizen list={alphaTypes} title={"首字母:"} handleClick={handleUpdateAlpha} oldVal={alpha}></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={ handlePullUp } // 上拉加载逻辑
          pullDown = { handlePullDown } // 下拉加载逻辑
          pullUpLoading = { pullUpLoading } // 显示上拉loading动画与否
          pullDownLoading = { pullDownLoading } // 显示下拉loading动画与否
          onScroll={forceCheck}
        >
          { renderSingerList() }
        </Scroll>
        <Loading show={enterLoading}></Loading>
      </ListContainer>
    </div>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.singers.get('singerList'),
  enterLoading: state.singers.get('enterLoading'),
  pullUpLoading: state.singers.get('pullUpLoading'),
  pullDownLoading: state.singers.get('pullDownLoading'),
  pageCount: state.singers.get('pageCount')
});

const mapDispatchToProps = (dispatch) => {
  return {
    // 进入页面第一次加载热门歌手
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
    },

    // 进入页面第一次加载有类型的歌手
    updateDispatch(type, area, alpha) {
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList(type, area, alpha));
    },

    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(type, area, alpha, hot, count) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count+1));
      if(hot){
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList(type, area, alpha));
      }
    },

    //顶部下拉刷新
    pullDownRefreshDispatch(type, area, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0)); // 重头开始请求
      if(type === '' && area === '' && alpha === ''){
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList(type, area, alpha));
      }
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Singers));