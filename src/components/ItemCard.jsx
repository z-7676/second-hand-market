import { formatPrice, timeAgo } from '../lib/utils';

export default function ItemCard({ item, onClick }) {
  return (
    <div
      onClick={() => onClick(item.id)}
      className="card-hover bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer group animate-fade-in"
    >
      {/* Image Placeholder */}
      <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {item.images && item.images[0] ? (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">暂无图片</span>
          </div>
        )}
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600 shadow-sm">
          {item.category}
        </span>
        {/* Sold Overlay */}
        {item.status === 'sold' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-xl tracking-widest border-2 border-white px-4 py-2 rounded-lg">
              已售
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(item.price)}
          </span>
          <span className="text-xs text-gray-400">{timeAgo(item.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
            {item.condition}
          </span>
          <span className="text-xs text-gray-400">
            {item.seller.avatar} {item.seller.name}
          </span>
          {item.inquiries.length > 0 && (
            <span className="text-xs text-gray-400 ml-auto">
              💬 {item.inquiries.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
