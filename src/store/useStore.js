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
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ items: data, loading: false });
    } else {
      console.error('获取物品失败:', error);
      set({ loading: false });
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

    const { error } = await supabase.from('items').insert(newItem);
    if (error) {
      console.error('发布失败:', error);
      return false;
    }

    // 刷新列表
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
