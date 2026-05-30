import { create } from 'zustand';
import { fetchItems, createItem, updateItem, deleteItemApi } from '../lib/supabase';

const ADMIN_SECRET = 'admin123';

const useStore = create((set, get) => ({
  items: [],
  loading: true,
  error: null,

  // ========== 初始化：从 Supabase 拉数据 ==========
  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchItems();
      set({ items: data || [], loading: false, error: null });
    } catch (err) {
      console.error('获取失败:', err);
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

    // 先更新本地
    set((state) => ({ items: [newItem, ...state.items] }));

    // 写云端
    try {
      await createItem(newItem);
      set({ error: null });
    } catch (err) {
      console.error('发布到云端失败:', err);
      set({ error: '发布成功(本地)，云端同步失败: ' + err.message });
    }
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

    // 先更新本地
    set((s) => ({
      items: s.items.map((i) =>
        i.id === itemId ? { ...i, inquiries: updatedInquiries } : i
      ),
    }));

    // 写云端
    try {
      await updateItem(itemId, { inquiries: updatedInquiries });
    } catch (err) {
      console.error('询问保存失败:', err);
    }
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
            replies: [...(inq.replies || []), {
              author: reply.author,
              message: reply.message,
              time: Date.now(),
            }],
          }
        : inq
    );

    set((s) => ({
      items: s.items.map((i) =>
        i.id === itemId ? { ...i, inquiries: updatedInquiries } : i
      ),
    }));

    try {
      await updateItem(itemId, { inquiries: updatedInquiries });
    } catch (err) {
      console.error('回复保存失败:', err);
    }
  },

  // ========== 标记已售 ==========
  markSold: async (itemId) => {
    if (!get().isAdmin) return;

    set((s) => ({
      items: s.items.map((i) =>
        i.id === itemId ? { ...i, status: 'sold' } : i
      ),
    }));

    try {
      await updateItem(itemId, { status: 'sold' });
    } catch (err) {
      console.error('标记失败:', err);
    }
  },

  // ========== 删除物品 ==========
  deleteItem: async (itemId) => {
    if (!get().isAdmin) return;

    set((s) => ({
      items: s.items.filter((i) => i.id !== itemId),
    }));

    try {
      await deleteItemApi(itemId);
    } catch (err) {
      console.error('删除失败:', err);
    }
  },
}));

export default useStore;
