import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Plus,
  PencilSimple,
  Trash,
  ToggleLeft,
  ToggleRight,
  MagnifyingGlass,
  X,
  Warning,
  CaretDown,
  FloppyDisk,
} from '@phosphor-icons/react';
import { sellerProductService } from '../../services/sellerProductService';

// ─── STATUS HELPERS ───────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    Active: { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Đang bán' },
    Draft: { cls: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Nháp' },
    OutOfStock: { cls: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Hết hàng' },
    Banned: { cls: 'bg-red-100 text-red-700 border-red-200', label: 'Bị cấm' },
  };
  const s = map[status] || { cls: 'bg-gray-100 text-gray-500', label: status };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>{s.label}</span>;
};

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

// ─── ADD / EDIT PRODUCT MODAL ──────────────────────────────────
function ProductModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product;

  const [form, setForm] = useState({
    categoryId: product?.categoryId || '',
    name: product?.name || '',
    description: product?.description || '',
    unit: product?.unit || '',
    basePrice: product?.basePrice || '',
  });

  const [variants, setVariants] = useState(
    product?.variants?.length
      ? product.variants.map((v) => ({ name: v.name, price: v.price, sku: v.sku, images: v.images || '' }))
      : [{ name: '', price: '', sku: '', images: '' }]
  );

  const [attributes, setAttributes] = useState(
    product?.attributes?.length
      ? product.attributes.map((a) => ({ attrName: a.attrName, attrValue: a.attrValue }))
      : []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // ── Variants helpers
  const addVariant = () => setVariants((p) => [...p, { name: '', price: '', sku: '', images: '' }]);
  const removeVariant = (i) => setVariants((p) => p.filter((_, idx) => idx !== i));
  const setVariantField = (i, key, val) =>
    setVariants((p) => p.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)));

  // ── Attributes helpers
  const addAttribute = () => setAttributes((p) => [...p, { attrName: '', attrValue: '' }]);
  const removeAttribute = (i) => setAttributes((p) => p.filter((_, idx) => idx !== i));
  const setAttrField = (i, key, val) =>
    setAttributes((p) => p.map((a, idx) => (idx === i ? { ...a, [key]: val } : a)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Tên sản phẩm không được trống');
    if (!form.categoryId) return setError('Vui lòng chọn danh mục');
    if (!form.unit.trim()) return setError('Đơn vị không được trống');
    if (!form.basePrice || Number(form.basePrice) <= 0) return setError('Giá phải lớn hơn 0');

    // Validate variants
    for (const v of variants) {
      if (!v.name.trim() || !v.sku.trim() || !v.price || Number(v.price) <= 0) {
        return setError('Vui lòng điền đầy đủ tên, SKU và giá cho mỗi biến thể');
      }
    }

    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      basePrice: Number(form.basePrice),
      variants: variants.map((v) => ({
        name: v.name.trim(),
        price: Number(v.price),
        sku: v.sku.trim(),
        images: v.images || null,
      })),
      attributes: attributes
        .filter((a) => a.attrName.trim() && a.attrValue.trim())
        .map((a) => ({ attrName: a.attrName.trim(), attrValue: a.attrValue.trim() })),
    };

    setLoading(true);
    try {
      let result;
      if (isEdit) {
        result = await sellerProductService.updateProduct(product.id, payload);
      } else {
        result = await sellerProductService.createProduct(payload);
      }
      onSaved(result);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full bg-white border border-[#D1DDD4] rounded-lg px-3 py-2 text-sm text-[#1A2E1F] placeholder-[#9EAFA3] focus:outline-none focus:border-[#5A8A6A] focus:ring-1 focus:ring-[#5A8A6A] transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-white rounded-2xl border border-[#D1DDD4] w-full max-w-3xl mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D1DDD4]">
          <h3 className="font-bold text-lg text-[#1A2E1F]">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <button onClick={onClose} className="text-[#6B7F70] hover:text-[#1A2E1F]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm flex gap-2 items-center">
              <Warning size={16} /> {error}
            </div>
          )}

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1A2E1F] mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} className={inputCls} placeholder="VD: Bơ sáp Đắk Lắk" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A2E1F] mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                  <option value="">— Chọn danh mục —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7F70] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A2E1F] mb-1">
                Đơn vị <span className="text-red-500">*</span>
              </label>
              <input value={form.unit} onChange={(e) => setField('unit', e.target.value)} className={inputCls} placeholder="VD: kg, hộp, túi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A2E1F] mb-1">
                Giá gốc (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input type="number" min="0" value={form.basePrice} onChange={(e) => setField('basePrice', e.target.value)} className={inputCls} placeholder="50000" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#1A2E1F] mb-1">Mô tả</label>
              <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Mô tả chi tiết sản phẩm..." />
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#1A2E1F]">Biến thể (khối lượng, giá)</h4>
              <button type="button" onClick={addVariant} className="text-xs text-[#5A8A6A] hover:text-[#4a7257] font-semibold flex items-center gap-1">
                <Plus size={14} /> Thêm biến thể
              </button>
            </div>
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="bg-[#F0F7F2] rounded-xl p-3 border border-[#D1DDD4]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <input value={v.name} onChange={(e) => setVariantField(i, 'name', e.target.value)} className={inputCls} placeholder="Tên (VD: 1kg)" />
                    <input type="number" min="0" value={v.price} onChange={(e) => setVariantField(i, 'price', e.target.value)} className={inputCls} placeholder="Giá (VNĐ)" />
                    <input value={v.sku} onChange={(e) => setVariantField(i, 'sku', e.target.value)} className={inputCls} placeholder="SKU" />
                    <div className="flex gap-2">
                      <input value={v.images} onChange={(e) => setVariantField(i, 'images', e.target.value)} className={`${inputCls} flex-1`} placeholder="URL ảnh (tuỳ chọn)" />
                      {variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600 shrink-0 p-1">
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attributes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#1A2E1F]">Thuộc tính (vùng trồng, thành phần...)</h4>
              <button type="button" onClick={addAttribute} className="text-xs text-[#5A8A6A] hover:text-[#4a7257] font-semibold flex items-center gap-1">
                <Plus size={14} /> Thêm thuộc tính
              </button>
            </div>
            {attributes.length === 0 ? (
              <p className="text-sm text-[#9EAFA3] italic">Chưa có thuộc tính nào. Bấm "Thêm thuộc tính" để bổ sung.</p>
            ) : (
              <div className="space-y-2">
                {attributes.map((a, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={a.attrName} onChange={(e) => setAttrField(i, 'attrName', e.target.value)} className={`${inputCls} flex-1`} placeholder="Tên (VD: Vùng trồng)" />
                    <input value={a.attrValue} onChange={(e) => setAttrField(i, 'attrValue', e.target.value)} className={`${inputCls} flex-1`} placeholder="Giá trị (VD: Đắk Lắk)" />
                    <button type="button" onClick={() => removeAttribute(i)} className="text-red-400 hover:text-red-600 shrink-0 p-1">
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#D1DDD4]">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#D1DDD4] text-[#6B7F70] hover:bg-[#F0F7F2] text-sm font-medium transition-colors">
            Huỷ
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[#5A8A6A] hover:bg-[#4a7257] text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <FloppyDisk size={16} />
            {loading ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────
export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [prods, cats] = await Promise.all([
        sellerProductService.getMyProducts(),
        sellerProductService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleToggleStatus = async (product) => {
    setActionLoading(product.id);
    try {
      const updated = await sellerProductService.toggleStatus(product.id);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Xác nhận xoá sản phẩm "${product.name}"?`)) return;
    setActionLoading(product.id);
    try {
      await sellerProductService.deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleProductSaved = (saved) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists) return prev.map((p) => (p.id === saved.id ? saved : p));
      return [saved, ...prev];
    });
  };

  const openCreate = () => { setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => { setEditProduct(p); setShowModal(true); };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getCatName = (id) => categories.find((c) => c.id === id)?.name || '';
  const totalStock = (variants) => variants?.reduce((s, v) => s + v.stock, 0) || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2E1F]">Quản lý sản phẩm</h1>
          <p className="text-[#6B7F70] text-sm mt-1">Thêm, sửa, bật/tắt hiển thị sản phẩm</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-[#5A8A6A] hover:bg-[#4a7257] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} weight="bold" /> Thêm sản phẩm
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5 bg-white border border-[#D1DDD4] rounded-xl p-1">
          {['', 'Active', 'Draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s ? 'bg-[#5A8A6A] text-white' : 'text-[#6B7F70] hover:text-[#1A2E1F]'
              }`}
            >
              {s === '' ? 'Tất cả' : s === 'Active' ? 'Đang bán' : 'Nháp'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9EAFA3]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full bg-white border border-[#D1DDD4] rounded-xl pl-9 pr-4 py-2 text-sm text-[#1A2E1F] placeholder-[#9EAFA3] focus:outline-none focus:border-[#5A8A6A]"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex gap-2 items-center">
          <Warning size={16} /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#D1DDD4] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D1DDD4] text-[#6B7F70] text-left">
                <th className="px-5 py-3.5 font-medium">Sản phẩm</th>
                <th className="px-5 py-3.5 font-medium">Danh mục</th>
                <th className="px-5 py-3.5 font-medium text-right">Giá gốc</th>
                <th className="px-5 py-3.5 font-medium text-center">Biến thể</th>
                <th className="px-5 py-3.5 font-medium text-center">Tồn kho</th>
                <th className="px-5 py-3.5 font-medium text-center">Đã bán</th>
                <th className="px-5 py-3.5 font-medium text-center">Trạng thái</th>
                <th className="px-5 py-3.5 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#D1DDD4]">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-[#F0F7F2] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-[#9EAFA3]">
                    <Package size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-medium">Chưa có sản phẩm nào</p>
                    <p className="text-xs mt-1">Bấm "Thêm sản phẩm" để bắt đầu bán hàng</p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-b border-[#D1DDD4] last:border-0 hover:bg-[#F0F7F2]/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A8A6A] to-[#A8D5B5] flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {product.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[#1A2E1F] line-clamp-1">{product.name}</p>
                          <p className="text-xs text-[#9EAFA3]">ID #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#6B7F70]">{getCatName(product.categoryId) || '—'}</td>
                    <td className="px-5 py-4 text-right font-semibold text-[#1A2E1F]">{fmtPrice(product.basePrice)}</td>
                    <td className="px-5 py-4 text-center text-[#6B7F70]">{product.variants?.length || 0}</td>
                    <td className="px-5 py-4 text-center text-[#6B7F70]">{totalStock(product.variants)}</td>
                    <td className="px-5 py-4 text-center text-[#6B7F70]">{product.totalSold}</td>
                    <td className="px-5 py-4 text-center">{statusBadge(product.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle status */}
                        <button
                          onClick={() => handleToggleStatus(product)}
                          disabled={actionLoading === product.id || product.status === 'Banned'}
                          title={product.status === 'Active' ? 'Tắt sản phẩm' : 'Bật sản phẩm'}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                            product.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {product.status === 'Active' ? <ToggleRight size={18} weight="fill" /> : <ToggleLeft size={18} />}
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(product)}
                          title="Chỉnh sửa"
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <PencilSimple size={16} />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={actionLoading === product.id}
                          title="Xoá sản phẩm"
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-[#D1DDD4] text-xs text-[#9EAFA3]">
            Hiển thị {filtered.length} / {products.length} sản phẩm
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSaved={handleProductSaved}
        />
      )}
    </div>
  );
}
