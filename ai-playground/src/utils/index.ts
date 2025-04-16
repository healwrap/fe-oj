/**
 * 格式化数字为更易读的形式
 * 1000+ -> 1k
 * 10000+ -> 1w
 * 1000000+ -> 1M
 *
 * @param num 要格式化的数字
 * @param digits 保留的小数位数
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number | string, digits: number = 1): string {
  // 转换为数字
  const value = typeof num === 'string' ? parseFloat(num) : num;

  // 处理非数字情况
  if (isNaN(value)) {
    return '0';
  }

  // 处理各种范围的数字
  if (Math.abs(value) >= 1000000) {
    // 大于等于100万，显示为M
    return (value / 1000000).toFixed(digits).replace(/\.0+$/, '') + 'M';
  } else if (Math.abs(value) >= 10000) {
    // 大于等于1万，显示为w
    return (value / 10000).toFixed(digits).replace(/\.0+$/, '') + 'w';
  } else if (Math.abs(value) >= 1000) {
    // 大于等于1千，显示为k
    return (value / 1000).toFixed(digits).replace(/\.0+$/, '') + 'k';
  } else {
    // 小于1千，直接显示
    return value.toString();
  }
}
