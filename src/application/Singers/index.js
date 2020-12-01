import React, {useEffect, useCallback, memo, useContext, useRef} from 'react';
import Horizen from '../../baseUI/horizen-item';
import { singerType, singerArea, alphaTypes } from '../../api/config';
import {
  NavContainer,
  ListContainer,
  List,
  ListItem,
  BackTop,
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
import { CategoryDataContext, CHANGE_TYPE, CHANGE_AREA, CHANGE_ALPHA } from './data.js'

function Singers(props) {
  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props;

  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

  const { data, dispatch  } = useContext(CategoryDataContext)

  const { singertype, singerarea, singeralpha } = data.toJS()

  const scrollContaninerRef = useRef()

  useEffect(() => {
    if(!singerList.size) {
      getHotSingerDispatch();
    }
    // eslint-disable-next-line
  }, []);

  // 选择了字母的处理函数
  let handleUpdateAlpha = useCallback((val) => {
    dispatch({type: CHANGE_ALPHA, data: val})
    updateDispatch(singertype, singerarea, val);
    scrollContaninerRef.current.refresh()
    // eslint-disable-next-line
  },[dispatch,singertype, singerarea]);

  // 选择了地区的处理函数
  let handleUpdateSingerArea = useCallback((val) => {
    dispatch({type: CHANGE_AREA, data: val})
    updateDispatch(singertype, val, singeralpha);
    scrollContaninerRef.current.refresh()
    // eslint-disable-next-line
  }, [dispatch,singertype,singeralpha]);

  // 选择了歌手类型的处理函数
  let handleUpdateSingerType = useCallback((val) => {
    dispatch({type: CHANGE_TYPE, data: val})
    updateDispatch(val,singerarea, singeralpha);
    scrollContaninerRef.current.refresh()
    // eslint-disable-next-line
  }, [dispatch,singerarea,singeralpha])

  // 底部上拉加载更多
  const handlePullUp = () => {
    let temp_hot = (singertype === '' && singerarea === '' && singeralpha === '')
    pullUpRefreshDispatch(singertype, singerarea, singeralpha, temp_hot, pageCount);
  };

  // 动画回到顶部
  const goBackTop = useCallback(() => {
    scrollContaninerRef.current.backtopWithAnimition()
  }, [scrollContaninerRef])

  // 顶部下拉重新加载
  const handlePullDown = () => {
    pullDownRefreshDispatch(singertype, singerarea, singeralpha);
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
        <Horizen list={alphaTypes} title={"首字母:"} handleClick={handleUpdateAlpha} oldVal={singeralpha}></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll
          ref={scrollContaninerRef}
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
      <BackTop onClick={ goBackTop }><span>︽</span></BackTop>
    </div>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers','singerList']),
  enterLoading: state.getIn(['singers','enterLoading']),
  pullUpLoading: state.getIn(['singers','pullUpLoading']),
  pullDownLoading: state.getIn(['singers','pullDownLoading']),
  pageCount: state.getIn(['singers','pageCount'])
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