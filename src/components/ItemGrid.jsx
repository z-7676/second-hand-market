import { useState, useMemo } from 'react';
import ItemCard from './ItemCard';
import { CATEGORIES } from '../lib/utils';

export default function ItemGrid({ items, onSelectItem, searchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('newest');

  const filtered = useMemo(() => {
    let result = items.filter((item) => item.status !== 'sold');

    // Category filter
    if (selectedCategory !== '全部') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'expensive') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [items, selectedCategory, sortBy, searchQuery]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">排序：</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white text-gray-600 outline-none cursor-pointer focus:border-gray-400"
          >
            <option value="newest">最新发布</option>
            <option value="cheapest">价格从低到高</option>
            <option value="expensive">价格从高到低</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <div key={item.id} style={{ animationDelay: `${i * 50}ms` }}>
              <ItemCard item={item} onClick={onSelectItem} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">暂无找到相关物品</h3>
          <p className="text-gray-400">试试其他关键词或分类</p>
        </div>
      )}

      {/* Count */}
      <div className="mt-8 text-center text-sm text-gray-400">
        共 {filtered.length} 件在售物品
      </div>
    </div>
  );
}
