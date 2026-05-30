import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// 管理员密码
const ADMIN_SECRET = 'admin123';

const useStore = create((set, get) => ({
  // ========== 数据 ==========
  items: [],
  loading: true,

  // ========== 初始化：从 Supabase 拉数据 ==========
  fetchItems: async () => {
    set({ loading: true });

    console.log('🔄 正在从 Supabase 拉取数据...');

    // 1. 先从 Supabase 拉数据
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase 获取失败:', error.message, error);
      // 回退：尝试读 localStorage
      const oldData = localStorage.getItem('second-hand-market');
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData);
          const oldItems = parsed?.state?.items || [];
          if (oldItems.length > 0) {
            console.log('⚠️ 使用本地缓存数据');
            set({ items: oldItems, loading: false });
            return;
          }
        } catch (e) {}
      }
      set({ items: [], loading: false, error: error.message });
      return;
    }

    console.log(`✅ Supabase 返回 ${data ? data.length : 0} 条数据`);

    // 2. 如果 Supabase 为空，尝试从旧 localStorage 迁移数据
    if (!data || data.length === 0) {
      const oldData = localStorage.getItem('second-hand-market');
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData);
          const oldItems = parsed?.state?.items || [];
          if (oldItems.length > 0) {
            console.log(`📦 正在迁移 ${oldItems.length} 件旧数据到云端...`);
            const migrated = oldItems.map((item) => ({
              ...item,
              created_at: item.created_at || new Date(item.createdAt || Date.now()).toISOString(),
            }));
            const { error: insertError } = await supabase.from('items').insert(migrated);
            if (insertError) {
              console.error('❌ 迁移失败:', insertError.message);
            } else {
              console.log('✅ 迁移成功');
              localStorage.removeItem('second-hand-market');
              const { data: freshData } = await supabase
                .from('items')
                .select('*')
                .order('created_at', { ascending: false });
              set({ items: freshData || migrated, loading: false });
              return;
            }
          }
        } catch (e) {
          console.log('没有旧数据需要迁移');
        }
      }
    }

    // 3. 合并本地备份数据
    let merged = data || [];
    try {
      const backup = JSON.parse(localStorage.getItem('s2m_backup') || '[]');
      if (backup.length > 0) {
        const existingIds = new Set(merged.map((i) => i.id));
        const newBackupItems = backup.filter((i) => !existingIds.has(i.id));
        if (newBackupItems.length > 0) {
          merged = [...newBackupItems, ...merged];
          console.log(`📦 合并了 ${newBackupItems.length} 条本地备份数据`);
        }
      }
    } catch (e) {}

    set({ items: merged, loading: false });
  },

  // ========== 管理员 ==========
  isAdmin: false,

  adminLogin: (password) => {
    if (password === ADMIN_SECRET) {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },

  adminLogout: () => set({ isAdmin: false }),

  // ========== 发布物品 ==========
  addItem: async (itemData) => {
    const newItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title: itemData.title,
      description: itemData.description,
      price: itemData.price,
      category: itemData.category,
      condition: itemData.condition,
      images: itemData.images || [],
      seller: itemData.seller,
      status: 'active',
      inquiries: [],
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('items').insert(newItem);
    if (error) {
      console.error('❌ Supabase 发布失败:', error.message);
      // 失败时保存到 localStorage 作为备份
      try {
        const backup = JSON.parse(localStorage.getItem('s2m_backup') || '[]');
        backup.unshift(newItem);
        localStorage.setItem('s2m_backup', JSON.stringify(backup));
        console.log('⚠️ 已保存到本地备份');
      } catch (e) {}
    }

    // 更新本地列表
    set((state) => ({ items: [newItem, ...state.items] }));
    return true;
  },

  // ========== 添加询问 ==========
  addInquiry: async (itemId, inquiry) => {
    const state = get();
    const item = state.items.find((i) => i.id === itemId);
    if (!item) return;

    const newInquiry = {
      id: Date.now().toString(36),
      author: inquiry.author,
      message: inquiry.message,
      time: Date.now(),
      replies: [],
    };

    const updatedInquiries = [...(item.inquiries || []), newInquiry];

    const { error } = await supabase
      .from('items')
      .update({ inquiries: updatedInquiries })
      .eq('id', itemId);

    if (error) {
      console.error('添加询问失败:', error);
      return;
    }

    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, inquiries: updatedInquiries } : i
      ),
    }));
  },

  // ========== 添加回复 ==========
  addReply: async (itemId, inquiryId, reply) => {
    const state = get();
    const item = state.items.find((i) => i.id === itemId);
    if (!item) return;

    const updatedInquiries = (item.inquiries || []).map((inq) =>
      inq.id === inquiryId
        ? {
            ...inq,
            replies: [
              ...(inq.replies || []),
              {
                author: reply.author,
                message: reply.message,
                time: Date.now(),
              },
            ],
          }
        : inq
    );

    const { error } = await supabase
      .from('items')
      .update({ inquiries: updatedInquiries })
      .eq('id', itemId);

    if (error) {
      console.error('添加回复失败:', error);
      return;
    }

    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, inquiries: updatedInquiries } : i
      ),
    }));
  },

  // ========== 标记已售（仅管理员） ==========
  markSold: async (itemId) => {
    if (!get().isAdmin) return;

    const { error } = await supabase
      .from('items')
      .update({ status: 'sold' })
      .eq('id', itemId);

    if (error) {
      console.error('标记已售失败:', error);
      return;
    }

    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, status: 'sold' } : i
      ),
    }));
  },

  // ========== 删除物品（仅管理员） ==========
  deleteItem: async (itemId) => {
    if (!get().isAdmin) return;

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('删除失败:', error);
      return;
    }

    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    }));
  },
}));

export default useStore;
