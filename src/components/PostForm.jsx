import { useState, useRef } from 'react';
import { CATEGORIES, CONDITIONS } from '../lib/utils';

const INITIAL_FORM = {
  title: '',
  description: '',
  price: '',
  category: '数码',
  condition: '轻微使用痕迹',
  sellerName: '',
  sellerContact: '',
  images: [],
};

export default function PostForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        setPreviews((prev) => [...prev, dataUrl]);
        setForm((prev) => ({ ...prev, images: [...prev.images, dataUrl] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = '请输入物品名称';
    if (!form.description.trim()) errs.description = '请输入物品描述';
    if (!form.price) errs.price = '请输入价格';
    if (Number(form.price) <= 0) errs.price = '价格必须大于 0';
    if (!form.sellerName.trim()) errs.sellerName = '请输入您的昵称';
    if (!form.sellerContact.trim()) errs.sellerContact = '请输入联系方式';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      condition: form.condition,
      images: form.images,
      seller: {
        name: form.sellerName.trim(),
        contact: form.sellerContact.trim(),
        avatar: '👤',
      },
    });

    setForm(INITIAL_FORM);
    setPreviews([]);
  };

  const inputClass = (field) =>
    `input-minimal w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto animate-slide-up">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">发布闲置物品</h2>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">物品图片（可选，最多 4 张）</label>
          <div className="flex flex-wrap gap-3">
            {previews.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {previews.length < 4 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs">添加图片</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">物品名称 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="例如：iPhone 15 Pro 256G 原色钛金属"
            className={inputClass('title')}
            maxLength={100}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">详细描述 *</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="描述物品的使用情况、新旧程度、配件是否齐全、购买时间等..."
            rows={4}
            className={inputClass('description')}
            maxLength={1000}
          />
          <div className="flex justify-between mt-1">
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            <span className="text-xs text-gray-400 ml-auto">{form.description.length}/1000</span>
          </div>
        </div>

        {/* Price + Category + Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">价格 (元) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className={inputClass('price') + ' pl-8'}
              />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="input-minimal w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            >
              {CATEGORIES.filter((c) => c !== '全部').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">新旧程度</label>
            <select
              value={form.condition}
              onChange={(e) => updateField('condition', e.target.value)}
              className="input-minimal w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Seller Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">您的昵称 *</label>
            <input
              type="text"
              value={form.sellerName}
              onChange={(e) => updateField('sellerName', e.target.value)}
              placeholder="让大家记住你"
              className={inputClass('sellerName')}
            />
            {errors.sellerName && <p className="text-red-500 text-xs mt-1">{errors.sellerName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">联系方式 *</label>
            <input
              type="text"
              value={form.sellerContact}
              onChange={(e) => updateField('sellerContact', e.target.value)}
              placeholder="微信 / QQ / 手机号"
              className={inputClass('sellerContact')}
            />
            {errors.sellerContact && <p className="text-red-500 text-xs mt-1">{errors.sellerContact}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors cursor-pointer"
          >
            发布物品
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            取消
          </button>
        </div>
      </div>
    </form>
  );
}

export { INITIAL_FORM };
