function debounce(func: Function, time: number) {
  let timer: number | null;
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = window.setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
    }, time);
  };
}

export default debounce;
