// 检查数据是否越界
export default function checkData(data: number, min: number, max: number) {
  if (data > max) {
    return max;
  } else if (data < min) {
    return min;
  }
  return data;
}
