export const getCount = (count) => {
  if (count < 0) return;
  if (count < 10000) {
    return count;
  } else if (Math.floor (count / 10000) < 10000) {
    return Math.floor (count/1000)/10 + "万";
  } else  {
    return Math.floor (count / 10000000)/ 10 + "亿";
  }
}

// 防抖函数
export const debounce = (func, delay) => {
  let timer;
  console.log("debouse => this", this)
  return function (...args) {
    console.log("niming => this", this)
    if (timer) {
      console.log("time")
      clearTimeout(timer);
    }
    timer = setTimeout (() => {
      console.log("setTime => this", this)
      func(...args)
      clearTimeout(timer);
    }, delay);
  }
}