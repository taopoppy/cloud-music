import React, {useEffect,memo, useImperativeHandle, useRef, forwardRef } from 'react';
import styled from'styled-components';
import { prefixStyle } from './../../api/utils';
import style from '../../assets/global-style';

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(.62,-0.1,.86,.57);
    transform: translate3d(0, 0, 0);
    >div {
      transition: transform 1s;
    }
  }
`

const MusicNote = forwardRef((props, ref) => {
	const iconsRef = useRef()

	// 容器中有3个音符，也就是同时只能有3个音符下落
	const ICON_NUMBER = 3;

	const transform = prefixStyle("transform");

	// 原生DOM操作，返回一个DOM节点对象
	const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    let tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    return tempNode.firstChild;
	}

  useEffect (() => {
		// 只能同时制造三个音符
    for (let i = 0; i < ICON_NUMBER; i++){
      let node = createNode(`<div class="iconfont">&#xe642;</div>`);
      iconsRef.current.appendChild(node);
    }
    // iconsRef.current.children是一个HTMLCollection的类型，我们需要Array的类型
    let domArray = Array.from(iconsRef.current.children);
    domArray.forEach(item => {
			// running这个属性用来标识元素是否空闲
			item.running = false;
			// transitionend是过渡事件完成后触发，过渡完成后就消失
      item.addEventListener('transitionend', function(){
        this.style['display'] = 'none';
        this.style[transform] = `translate3d(0, 0, 0)`;
        this.running = false;

				// 通过createNode函数生成的DOM是<div class='icon_wrapper'><div class="iconfont">&#xe642;</div></div>
        let icon = this.querySelector('div');
        icon.style[transform] = `translate3d(0, 0, 0)`;
      }, false);
    });
    //eslint-disable-next-line
  }, []);

	const startAnimation = ({x, y}) => {
		for(let i = 0; i< ICON_NUMBER; i++ ) {
			let domArray = Array.from(iconsRef.current.children)
			let item = domArray[i]

			// 循环看看哪个音符现在是空闲的
			if(item.running === false) {
				item.style.left = x+"px"
				item.style.top = y+"px"
				item.style.display = "inline-block"
				setTimeout(() => {
					item.running = true;
					item.style[transform] = `translate3d(0, 750px, 0)`;
					let icon = item.querySelector("div");
					icon.style[transform] = `translate3d(-40px, 0, 0)`;
				}, 20)
				// 找到一个空闲的音符就跳出循环
				break
			}
		}
	}

	// 外界可以直接调用startAnimation方法，并传入动画开始的x,y坐标
	useImperativeHandle(ref, ()=> ({
		startAnimation
	}))

	return (
    <Container ref={iconsRef}>
    </Container>
  )
})


export default memo(MusicNote)