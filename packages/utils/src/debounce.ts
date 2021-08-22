function debounce(func: Function, time: number) {
  let timer: any;
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
    }, time);
  };
}

export default debounce;
