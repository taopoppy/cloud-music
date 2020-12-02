import styled, { keyframes } from'styled-components';
import style from '../../assets/global-style';


const lightSpeedInRight = keyframes`
 from {
    transform: translate3d(-100%, 0, 0) skewX(30deg);
    opacity: 0;
  }

  60% {
    transform: skewX(-20deg);
    opacity: 1;
  }

  80% {
    transform: skewX(5deg);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`

const lightSpeedOutRight = keyframes`
 	from {
    opacity: 1;
  }

  to {
    transform: translate3d(100%, 0, 0) skewX(30deg);
    opacity: 0;
  }
`

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: ${style["background-color"]};;
  transform-origin: right bottom;
  &.fly-enter-active, &.fly-appear-active {
		animation-name: ${lightSpeedInRight};
		animation-timing-function: ease-out;
		animation-duration: 500ms;
  }
  &.fly-exit-active {
		animation-name: ${lightSpeedOutRight};
		animation-timing-function: ease-in;
		animation-duration: 500ms;
  }
`