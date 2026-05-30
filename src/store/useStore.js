import { create } from 'zustand';
import { fetchItems, saveItems } from '../lib/github';

const ADMIN_SECRET = 'admin123';

const useStore = create((set, get) => ({
  items: [],
  loading: true,
  error: null,

  // ========== 初始化：从 GitHub 拉数据 ==========
  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchItems();
      set({ items: data || [], loading: false, error: null });
    } catch (err) {
      console.error('获取数据失败:', err);
      // 尝试读本地备份
      try {
        const backup = JSON.parse(localStorage.getItem('s2m_backup') || '[]');
        if (backup.length > 0) {
          set({ items: backup, loading: false, error: '⚠️ 显示本地备份 - ' + err.message });
          return;
        }
      } catch (e) {}
      set({ items: [], loading: false, error: err.message });
    }
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
    const state = get();
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

    const newItems = [newItem, ...state.items];

    // 先更新本地（即时显示）
    set({ items: newItems });

    // 保存到 GitHub
    try {
      await saveItems(newItems);
      // 本地备份
      localStorage.setItem('s2m_backup', JSON.stringify(newItems.slice(0, 50)));
    } catch (err) {
      console.error('保存失败:', err);
      // 回滚但保留在本地
      localStorage.setItem('s2m_backup', JSON.stringify(newItems.slice(0, 50)));
      set({ error: '发布成功(本地)，云端同步失败: ' + err.message });
    }
    return true;
  },

  // ========== 添加询问 ==========
  addInquiry: async (itemId, inquiry) => {
    const state = get();
    const items = [...state.items];
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx === -1) return;

    const newInquiry = {
      id: Date.now().toString(36),
      author: inquiry.author,
      message: inquiry.message,
      time: Date.now(),
      replies: [],
    };

    items[idx] = {
      ...items[idx],
      inquiries: [...(items[idx].inquiries || []), newInquiry],
    };

    set({ items });
    try {
      await saveItems(items);
    } catch (err) {
      console.error('保存询问失败:', err);
    }
  },

  // ========== 添加回复 ==========
  addReply: async (itemId, inquiryId, reply) => {
    const state = get();
    const items = [...state.items];
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx === -1) return;

    items[idx] = {
      ...items[idx],
      inquiries: (items[idx].inquiries || []).map((inq) =>
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
      ),
    };

    set({ items });
    try {
      await saveItems(items);
    } catch (err) {
      console.error('保存回复失败:', err);
    }
  },

  // ========== 标记已售（仅管理员） ==========
  markSold: async (itemId) => {
    if (!get().isAdmin) return;

    const state = get();
    const items = state.items.map((i) =>
      i.id === itemId ? { ...i, status: 'sold' } : i
    );

    set({ items });
    try {
      await saveItems(items);
    } catch (err) {
      console.error('标记已售失败:', err);
    }
  },

  // ========== 删除物品（仅管理员） ==========
  deleteItem: async (itemId) => {
    if (!get().isAdmin) return;

    const state = get();
    const items = state.items.filter((i) => i.id !== itemId);

    set({ items });
    try {
      await saveItems(items);
    } catch (err) {
      console.error('删除失败:', err);
    }
  },
}));

export default useStore;
