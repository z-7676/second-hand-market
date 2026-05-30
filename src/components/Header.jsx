import { useState } from 'react';

export default function Header({ onNavigate, currentPage, onSearch, searchQuery }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 shrink-0 cursor-pointer group"
        >
          <span className="text-2xl">🔄</span>
          <span className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-gray-600 transition-colors">
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
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-700"
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              currentPage === 'home'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            浏览
          </button>
          <button
            onClick={() => onNavigate('post')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'post'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            发布
          </button>
        </nav>
      </div>
    </header>
  );
}
