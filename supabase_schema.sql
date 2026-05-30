-- 创建物品表
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT '其他',
  condition TEXT NOT NULL DEFAULT '轻微使用痕迹',
  images JSONB DEFAULT '[]'::jsonb,
  seller JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  inquiries JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 允许任何人读取
CREATE POLICY "允许所有人读取" ON items
  FOR SELECT USING (true);

-- 允许任何人发布
CREATE POLICY "允许所有人发布" ON items
  FOR INSERT WITH CHECK (true);

-- 允许任何人更新（管理员密码在应用层验证）
CREATE POLICY "允许更新" ON items
  FOR UPDATE USING (true);

-- 允许任何人删除（管理员密码在应用层验证）
CREATE POLICY "允许删除" ON items
  FOR DELETE USING (true);

-- 开启 RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
