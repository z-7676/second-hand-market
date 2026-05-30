import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 管理员密码 —— 改成你自己的密码！
const ADMIN_SECRET = 'admin123';

const useStore = create(
  persist(
    (set, get) => ({
      // ========== 物品数据 ==========
      items: [],

      // ========== 管理员状态 ==========
      isAdmin: false,

      adminLogin: (password) => {
        if (password === ADMIN_SECRET) {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },

      adminLogout: () => {
        set({ isAdmin: false });
      },

      // ========== 物品操作 ==========
      addItem: (item) =>
        set((state) => ({
          items: [
            {
              ...item,
              id: Date.now().toString(36) + Math.random().toString(36).slice(2),
              inquiries: [],
              status: 'active',
              createdAt: Date.now(),
            },
            ...state.items,
          ],
        })),

      addInquiry: (itemId, inquiry) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  inquiries: [
                    ...item.inquiries,
                    {
                      id: Date.now().toString(36),
                      ...inquiry,
                      time: Date.now(),
                      replies: [],
                    },
                  ],
                }
              : item
          ),
        })),

      addReply: (itemId, inquiryId, reply) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  inquiries: item.inquiries.map((inq) =>
                    inq.id === inquiryId
                      ? {
                          ...inq,
                          replies: [
                            ...inq.replies,
                            {
                              author: reply.author,
                              message: reply.message,
                              time: Date.now(),
                            },
                          ],
                        }
                      : inq
                  ),
                }
              : item
          ),
        })),

      markSold: (itemId) => {
        // 只有管理员可以标记已售
        if (!get().isAdmin) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, status: 'sold' } : item
          ),
        }));
      },

      deleteItem: (itemId) => {
        // 只有管理员可以删除
        if (!get().isAdmin) return;
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },
    }),
    { name: 'second-hand-market' }
  )
);

export default useStore;
