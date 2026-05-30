import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ItemGrid from './components/ItemGrid';
import PostForm from './components/PostForm';
import InquirySection from './components/InquirySection';
import useStore from './store/useStore';
import { formatPrice, timeAgo } from './lib/utils';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    items, loading, error, fetchItems, isAdmin,
    addItem, addInquiry, addReply,
    markSold, deleteItem,
    adminLogin, adminLogout,
  } = useStore();

  // 页面启动时从云端拉数据
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId),
    [items, selectedItemId]
  );

  const navigateTo = (target) => {
    setPage(target);
    if (target === 'home') {
      setSelectedItemId(null);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItemId(id);
    setPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePost = async (itemData) => {
    await addItem(itemData);
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (page === 'detail') {
      setSelectedItemId(null);
      setPage('home');
    } else {
      setPage('home');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNavigate={navigateTo}
        currentPage={page}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        isAdmin={isAdmin}
        onAdminLogin={adminLogin}
        onAdminLogout={adminLogout}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Home Page */}
        {page === 'home' && (
          <>
            {/* Hero */}
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
                发现闲置好物
              </h1>
              <p className="text-gray-500 max-w-md mx-auto">
                在这里买卖二手物品，让闲置流动起来。简单、安全、无中介费。
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">加载中...</p>
              </div>
            ) : (
              <ItemGrid
                items={items}
                onSelectItem={handleSelectItem}
                searchQuery={searchQuery}
              />
            )}
          </>
        )}

        {/* Post Modal */}
        {page === 'post' && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPage('home')} />
            <div className="relative w-full max-w-2xl my-8">
              <PostForm onSubmit={handlePost} onCancel={() => setPage('home')} />
            </div>
          </div>
        )}

        {/* Detail Page */}
        {page === 'detail' && selectedItem && (
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">返回列表</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Images + Info */}
              <div className="lg:col-span-3 space-y-6">
                {/* Image */}
                <div className="aspect-[4/3] bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                  {selectedItem.images && selectedItem.images[0] ? (
                    <img
                      src={selectedItem.images[0]}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-300">
                      <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>暂无图片</span>
                    </div>
                  )}
                </div>

                {/* Image thumbnails */}
                {selectedItem.images && selectedItem.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedItem.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0" />
                    ))}
                  </div>
                )}

                {/* Title & Description */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm animate-slide-up">
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
                        {selectedItem.title}
                      </h1>
                      <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-gray-100 rounded-full text-xs">
                          {selectedItem.category}
                        </span>
                        <span>{selectedItem.condition}</span>
                        <span>{timeAgo(new Date(selectedItem.created_at).getTime())}</span>
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 shrink-0">
                      {formatPrice(selectedItem.price)}
                    </span>
                  </div>

                  <div className="border-t border-gray-50 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">物品描述</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Seller Info */}
                  <div className="border-t border-gray-50 pt-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">卖家信息</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedItem.seller.avatar}</span>
                      <div>
                        <p className="font-medium text-gray-900">{selectedItem.seller.name}</p>
                        <p className="text-sm text-gray-500 break-words">联系方式：{selectedItem.seller.contact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons — 仅管理员可见 */}
                  {isAdmin && selectedItem.status !== 'sold' && (
                    <div className="border-t border-gray-50 pt-4 mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => markSold(selectedItem.id)}
                        className="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        标记为已售
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除这个物品吗？此操作不可撤销。')) {
                            deleteItem(selectedItem.id);
                            setPage('home');
                          }
                        }}
                        className="px-5 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        删除物品
                      </button>
                    </div>
                  )}

                  {selectedItem.status === 'sold' && (
                    <div className="border-t border-gray-50 pt-4 mt-4">
                      <span className="inline-block px-4 py-1.5 bg-gray-200 text-gray-500 rounded-full text-sm font-medium">
                        已售出
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Inquiry Section */}
              <div className="lg:col-span-2">
                <InquirySection
                  inquiries={selectedItem.inquiries}
                  onAddInquiry={(inquiry) => addInquiry(selectedItem.id, inquiry)}
                  onAddReply={(inquiryId, reply) => addReply(selectedItem.id, inquiryId, reply)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 连接状态 */}
      {!loading && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-full text-xs font-medium shadow-lg z-40 ${
          error ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
        }`}>
          {error ? '⚠️ 云端未连接' : '🟢 云端同步中'}
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-sm text-gray-400">
        <p>二手集市 — 让闲置找到新主人</p>
      </footer>
    </div>
  );
}
