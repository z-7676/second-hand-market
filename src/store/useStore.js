import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      items: [
        {
          id: '1',
          title: '极简台灯 - 桌面阅读灯',
          description: '使用半年，成色95新。磨砂质感灯罩，三档色温可调，Type-C充电，续航约8小时。',
          price: 89,
          category: '家居',
          condition: '几乎全新',
          images: [],
          seller: { name: '小明', avatar: '👤' },
          status: 'active',
          inquiries: [
            { id: 'i1', author: '买家甲', message: '还在吗？可以小刀吗？', time: Date.now() - 3600000, replies: [] }
          ],
          createdAt: Date.now() - 86400000,
        },
        {
          id: '2',
          title: '机械键盘 Keychron K2 84键',
          description: '红轴，RGB背光，蓝牙双模。包装配件齐全，使用不到3个月。',
          price: 299,
          category: '数码',
          condition: '轻微使用痕迹',
          images: [],
          seller: { name: '键盘侠', avatar: '⌨️' },
          status: 'active',
          inquiries: [],
          createdAt: Date.now() - 172800000,
        },
        {
          id: '3',
          title: '村上春树《挪威的森林》精装版',
          description: '全新未拆封，精装硬壳版，带书签。搬家清书架，低价出。',
          price: 25,
          category: '图书',
          condition: '全新',
          images: [],
          seller: { name: '读书人', avatar: '📚' },
          status: 'active',
          inquiries: [
            { id: 'i2', author: '书虫', message: '请问是哪个出版社的？', time: Date.now() - 7200000, replies: [
              { author: '读书人', message: '上海译文出版社，2023年版', time: Date.now() - 3600000 }
            ]}
          ],
          createdAt: Date.now() - 259200000,
        },
        {
          id: '4',
          title: 'iPad Air 5 64G 星光色',
          description: '全程贴膜戴壳，无磕碰划痕。电池健康92%，送原装充电器。M1芯片，性能强悍。',
          price: 2800,
          category: '数码',
          condition: '轻微使用痕迹',
          images: [],
          seller: { name: '果粉小张', avatar: '🍎' },
          status: 'active',
          inquiries: [],
          createdAt: Date.now() - 43200000,
        },
        {
          id: '5',
          title: '北欧风陶瓷花瓶 ×2',
          description: '宜家购入，一对出。莫兰迪色系，手工拉胚质感。适合客厅/卧室装饰。',
          price: 45,
          category: '家居',
          condition: '几乎全新',
          images: [],
          seller: { name: '家居控', avatar: '🏠' },
          status: 'active',
          inquiries: [],
          createdAt: Date.now() - 345600000,
        },
        {
          id: '6',
          title: 'Sony WH-1000XM4 降噪耳机',
          description: '黑色，降噪效果一流。耳罩轻微使用痕迹，音质完美。配件全齐（收纳盒、充电线、音频线）。',
          price: 850,
          category: '数码',
          condition: '轻微使用痕迹',
          images: [],
          seller: { name: '音乐人', avatar: '🎵' },
          status: 'active',
          inquiries: [
            { id: 'i3', author: '发烧友', message: '续航还能有多久？', time: Date.now() - 1800000, replies: [] }
          ],
          createdAt: Date.now() - 1209600000,
        },
      ],

      // Actions
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

      markSold: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, status: 'sold' } : item
          ),
        })),

      deleteItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
    }),
    { name: 'second-hand-market' }
  )
);

export default useStore;
