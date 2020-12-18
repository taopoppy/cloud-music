import React, {useEffect, useRef, useState, memo} from 'react';
import styled from'styled-components';
import style from '../../assets/global-style';
import { prefixStyle } from '../../api/utils';

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 1px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`

function ProgressBar(props) {
  const { percentChange } = props // 进度条进度发生变化所要调用的父组件传递的回调函数

  const progressBar = useRef()
  const progress = useRef()
  const progressBtn = useRef()
  const [ touch, setTouch ] = useState({})

  const _changePercent = () => {
    const barWidth = progressBar.current.clientWidth; // 拿到纯进度条的长度
    const curPercent = progress.current.clientWidth/barWidth; // 新的进度百分比计算
    percentChange(curPercent);// 把新的进度传给回调函数并执行
  }



  // 根据偏移量修改进度条和按钮的位置
  const _offset = (offsetWidth) => {
    progress.current.style.width = `${offsetWidth}px` // 进度条的宽度随着参数变化
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  }

  // 手指触摸屏幕时触发的函数
  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiated = true;             //initial为true表示滑动动作开始了
    startTouch.startX = e.touches[0].pageX;  // 滑动开始时横向坐标
    startTouch.left = progress.current.clientWidth; // 当前progress长度
    setTouch(startTouch);
  }

  // 滑动触发的函数
  const progressTouchMove = (e) => {
    if (!touch.initiated) return;
    // 滑动距离
    const deltaX = e.touches[0].pageX - touch.startX;
    const barWidth = progressBar.current.clientWidth; // 进度部分的长度是包含了进度条的长度和按钮的长度，因为按钮本身是16px，按钮在最左边的时候会超出进度条左方向8px，按钮在最右边的时候hi超出进度条右方向8px，所以需要减去16px才能得到纯进度条的长度
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth); // 如果滑动超过了进度条，偏移量就取到进度条的最大值即可
    _offset(offsetWidth); // 根据偏移量修改进度条和按钮的位置
  }

  // 滑动结束触发的函数
  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch)); // 简单的深拷贝
    endTouch.initiated = false;
    setTouch(endTouch);

    // 通知父组件
    _changePercent()
  }


  // 进度条的点击事件
  const progressClick = (e) => {
    const rect = progressBar.current.getBoundingClientRect(); // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
    const offsetWidth = e.pageX - rect.left; // 计算出偏移量
    // 如果偏移量没有超过进度条的总长度，就可以继续进行
    if(offsetWidth <= rect.width) {
      _offset(offsetWidth);

      // 通知父组件
      _changePercent()
    }
  };

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress}></div> {/* 进度条 */}
        <div className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart} // touchstart 手指触摸屏幕时触发，即使已经有手指在屏幕上也会触发。
          onTouchMove={progressTouchMove} // touchmove 手指在屏幕滑动时触发。
          onTouchEnd={progressTouchEnd} // touchend 手指从屏幕时移开时触发。
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default memo(ProgressBar)