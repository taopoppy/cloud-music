import { keyframes } from "styled-components"

// 扩大可点击区域
const extendClick = () => {
  return `
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: -10px; bottom: -10px; left: -10px; right: -10px;
    };
  `
}
// 一行文字溢出部分用... 代替
const noWrap = () => {
  return `
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `
}

export const backInDown = keyframes`
0% {
  transform: translateY(-1200px) scale(1);
  opacity: 0.7;
}

80% {
  transform: translateY(0px) scale(1);
  opacity: 0.7;
}

100% {
  transform: scale(1);
  opacity: 1;
}
`
export const backOutDown = keyframes`
0% {
  transform: scale(1);
  opacity: 1;
}

20% {
  transform: translateY(0px) scale(1);
  opacity: 0.7;
}

100% {
  transform: translateY(700px) scale(1);
  opacity: 0;
}
`

export default {
  'theme-color': '#d44439',
  'theme-color-shadow': 'rgba (212, 68, 57, .5)',
  'font-color-light': '#f1f1f1',
  'font-color-desc': '#2E3030',
  'font-color-desc-v2': '#bba8a8',// 略淡
  'font-size-ss': '10px',
  'font-size-s': '12px',
  'font-size-m': '14px',
  'font-size-l': '16px',
  'font-size-ll': '18px',
  "border-color": '#e4e4e4',
  'background-color': '#f2f3f4',
  'background-color-shadow': 'rgba (0, 0, 0, 0.3)',
  'highlight-background-color': '#fff',
  extendClick,
  noWrap
}