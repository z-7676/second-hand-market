// Format price in CNY
export function formatPrice(price) {
  return `¥${price.toLocaleString('zh-CN')}`;
}

// Format relative time
export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}天前`;
  return new Date(timestamp).toLocaleDateString('zh-CN');
}

// Category options
export const CATEGORIES = ['全部', '数码', '家居', '图书', '服饰', '运动', '其他'];

// Condition options
export const CONDITIONS = ['全新', '几乎全新', '轻微使用痕迹', '正常使用痕迹', '有明显瑕疵'];
