// GitHub API 配置
const OWNER = 'z-7676';
const REPO = 'second-hand-market';
const BRANCH = 'main';
const DATA_PATH = 'data/items.json';

// 公开读取地址（无需认证）
const RAW_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${DATA_PATH}`;

// API 写入地址
const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`;

// GitHub Token（仅用于写入操作）
const TOKEN = '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';

/**
 * 从 GitHub 读取 items（公开访问，无需认证）
 */
export async function fetchItems() {
  // 加时间戳避免缓存
  const res = await fetch(`${RAW_URL}?t=${Date.now()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`读取失败(${res.status}): ${text}`);
  }
  return await res.json();
}

/**
 * 写入 items 到 GitHub（需要认证）
 */
export async function saveItems(items) {
  // 1. 先获取当前文件的 SHA
  const getRes = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!getRes.ok) {
    const text = await getRes.text();
    throw new Error(`获取文件信息失败(${getRes.status}): ${text}`);
  }
  const fileInfo = await getRes.json();
  const sha = fileInfo.sha;

  // 2. 更新文件
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(items, null, 2))));
  const putRes = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: '更新物品数据',
      content,
      sha,
      branch: BRANCH,
    }),
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    throw new Error(`保存失败(${putRes.status}): ${text}`);
  }

  return true;
}
