// Supabase REST API 配置
const SUPABASE_URL = 'https://jvxdtsltxlcdiisxdbgj.supabase.co';
const ANON_KEY = 'sb_publishable_QCtKFtDv6NY4TH8vAl9b6A_wfkmb4MU';

// 通用请求头
const headers = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

/**
 * 读取所有物品
 */
export async function fetchItems() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/items?select=*&order=created_at.desc`,
    { headers }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`读取失败(${res.status}): ${text}`);
  }
  return await res.json();
}

/**
 * 发布新物品
 */
export async function createItem(item) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/items`,
    {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify(item),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`发布失败(${res.status}): ${text}`);
  }
  return await res.json();
}

/**
 * 更新物品（部分字段）
 */
export async function updateItem(id, updates) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/items?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify(updates),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`更新失败(${res.status}): ${text}`);
  }
}

/**
 * 删除物品
 */
export async function deleteItemApi(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/items?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers,
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`删除失败(${res.status}): ${text}`);
  }
}
