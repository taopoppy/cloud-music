import React, { useEffect, memo} from 'react';
import Slider from '../../components/slider/';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list/';
import Scroll from '../../baseUI/scroll/index';
import { Content } from './style';
import { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading/index'
import { renderRoutes } from 'react-router-config'

function Recommend(props) {
  const { bannerList, recommendList, enterLoading, songsCount} = props
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props

  useEffect(()=> {
    if(!bannerList.size) {
      getBannerDataDispatch()
    }
    if(!recommendList.size) {
      getRecommendListDataDispatch()
    }
    // eslint-disable-next-line
  },[])


  const bannerListJS = bannerList ? bannerList.toJS(): []
  const recommendListJS = recommendList ? recommendList.toJS() : []

	return(
    <Content play={songsCount}>
      <Scroll
        className="list"
        onScroll={forceCheck}
      >
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      { enterLoading? <Loading /> : null}
      { renderRoutes(props.route.routes) }
    </Content>
	)
}

const mapStateToProps = (state) => ({
  // 这里没有使用toJS，不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
  bannerList: state.getIn(['recommend','bannerList']),
  recommendList: state.getIn(['recommend','recommendList']),
  enterLoading: state.getIn(['recommend','enterLoading']),
  // 根据当前playList的长度来判断底部bottom是否要给mini播放器腾出位置
  songsCount: state.getIn(['player','playList']).size
})

const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList())
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(memo(Recommend))