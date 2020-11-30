import React, { useEffect, memo} from 'react';
import Slider from '../../components/slider/';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list/';
import Scroll from '../../baseUI/scroll/index';
import { Content } from './style';
import { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading/index'

function Recommend(props) {
  const { bannerList, recommendList, enterLoading} = props
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
    <Content>
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
    </Content>
	)
}

const mapStateToProps = (state) => ({
  // 这里没有使用toJS，不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
  bannerList: state.getIn(['recommend','bannerList']),
  recommendList: state.getIn(['recommend','recommendList']),
  enterLoading: state.getIn(['recommend','enterLoading'])
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