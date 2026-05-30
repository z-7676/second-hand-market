import { useState } from 'react';

export default function Header({ onNavigate, currentPage, onSearch, searchQuery, isAdmin, onAdminLogin, onAdminLogout }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = () => {
    const ok = onAdminLogin(password);
    if (ok) {
      setShowLogin(false);
      setPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 shrink-0 cursor-pointer group"
        >
          <span className="text-2xl">🔄</span>
          <span className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors hidden sm:inline">
            二手集市
          </span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              searchFocused
                ? 'border-gray-400 bg-white shadow-sm'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索物品..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-700 min-w-0"
            />
            {searchQuery && (
              <button
                onClick={() => onSearch('')}
                className="text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              currentPage === 'home'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            浏览
          </button>
          <button
            onClick={() => onNavigate('post')}
            className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'post'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">发布</span>
          </button>

          {/* Admin Button */}
          {isAdmin ? (
            <button
              onClick={onAdminLogout}
              className="px-3 py-2 rounded-full text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer flex items-center gap-1"
              title="管理员模式 — 点击退出"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="hidden sm:inline">管理</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-3 py-2 rounded-full text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              title="管理员登录"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          )}
        </nav>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowLogin(false); setLoginError(false); setPassword(''); }} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-1">管理员登录</h3>
            <p className="text-sm text-gray-500 mb-4">输入密码以管理物品</p>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
              placeholder="请输入密码"
              className={`input-minimal w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm mb-2 ${loginError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
            {loginError && <p className="text-red-500 text-xs mb-2">密码错误，请重试</p>}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleLogin}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
              >
                登录
              </button>
              <button
                onClick={() => { setShowLogin(false); setLoginError(false); setPassword(''); }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
