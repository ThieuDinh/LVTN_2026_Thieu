import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Plus, 
  MagnifyingGlass, 
  Eye, 
  Check,
  X, 
  Warning,
  Trash
} from '@phosphor-icons/react';
import { sellerOrderService } from '../../services/sellerOrderService';
import { sellerProductService } from '../../services/sellerProductService';

const statusMap = {
  Draft: { label: 'Bản nháp', cls: 'bg-gray-100 text-gray-700 border-gray-200' },
  Confirmed: { label: 'Đã nhập kho', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Cancelled: { label: 'Đã huỷ', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

// Modal Tạo Phiếu Nhập
function CreateImportModal({ onClose, onCreated }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    importCode: `IMP-${Date.now()}`,
    harvestSeason: '',
    supplierName: '',
    note: ''
  });

  const [items, setItems] = useState([
    { productId: '', variantId: '', batchCode: '', quantity: '', costPrice: '', manufacturedAt: '', expiredAt: '' }
  ]);

  useEffect(() => {
    sellerProductService.getMyProducts().then(setProducts).catch(e => console.error(e));
  }, []);

  const handleAddItem = () => {
    setItems(p => [...p, { productId: '', variantId: '', batchCode: '', quantity: '', costPrice: '', manufacturedAt: '', expiredAt: '' }]);
  };

  const handleRemoveItem = (idx) => setItems(p => p.filter((_, i) => i !== idx));

  const updateItem = (idx, key, val) => {
    setItems(p => p.map((it, i) => i === idx ? { ...it, [key]: val } : it));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.importCode.trim()) return setError("Mã phiếu nhập không được trống");
    
    for (const it of items) {
      if (!it.variantId || !it.batchCode || !it.quantity || !it.costPrice || !it.manufacturedAt || !it.expiredAt) {
        return setError("Vui lòng điền đầy đủ thông tin cho từng lô hàng (Sản phẩm, Mã lô, Số lượng, Giá nhập, Ngày SX, HSD).");
      }
    }

    const payload = {
      ...form,
      items: items.map(it => ({
        variantId: Number(it.variantId),
        batchCode: it.batchCode,
        quantity: Number(it.quantity),
        costPrice: Number(it.costPrice),
        manufacturedAt: new Date(it.manufacturedAt).toISOString(),
        expiredAt: new Date(it.expiredAt).toISOString(),
      }))
    };

    setLoading(true);
    try {
      await sellerOrderService.createImport(payload);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white border border-[#D1DDD4] rounded-lg px-3 py-2 text-sm text-[#1A2E1F] outline-none focus:border-[#5A8A6A]";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-white rounded-2xl border border-[#D1DDD4] w-full max-w-4xl mx-4 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D1DDD4]">
          <h3 className="font-bold text-lg text-[#1A2E1F]">Tạo phiếu nhập kho</h3>
          <button onClick={onClose} className="text-[#6B7F70] hover:text-[#1A2E1F]"><X size={20} /></button>
        </div>

        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm flex gap-2 items-center"><Warning size={16}/> {error}</div>}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Mã phiếu <span className="text-red-500">*</span></label>
              <input value={form.importCode} onChange={e => setForm(p => ({...p, importCode: e.target.value}))} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nhà cung cấp / Nguồn</label>
              <input value={form.supplierName} onChange={e => setForm(p => ({...p, supplierName: e.target.value}))} className={inputCls} placeholder="VD: Nông trại A" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mùa vụ</label>
              <input value={form.harvestSeason} onChange={e => setForm(p => ({...p, harvestSeason: e.target.value}))} className={inputCls} placeholder="VD: Mùa Thu 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <input value={form.note} onChange={e => setForm(p => ({...p, note: e.target.value}))} className={inputCls} />
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-[#1A2E1F]">Chi tiết nhập</h4>
            <button onClick={handleAddItem} className="text-xs text-[#5A8A6A] hover:text-[#4a7257] font-semibold flex items-center gap-1">
              <Plus size={14} /> Thêm lô hàng
            </button>
          </div>

          <div className="space-y-4">
            {items.map((it, idx) => {
              const selectedProd = products.find(p => p.id === Number(it.productId));
              return (
                <div key={idx} className="bg-[#F0F7F2] p-4 rounded-xl border border-[#D1DDD4] relative">
                  {items.length > 1 && (
                    <button onClick={() => handleRemoveItem(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                      <Trash size={16} />
                    </button>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Sản phẩm</label>
                      <select value={it.productId} onChange={e => { updateItem(idx, 'productId', e.target.value); updateItem(idx, 'variantId', ''); }} className={inputCls}>
                        <option value="">- Chọn sản phẩm -</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1">Phân loại (Biến thể)</label>
                      <select value={it.variantId} onChange={e => updateItem(idx, 'variantId', e.target.value)} disabled={!it.productId} className={inputCls}>
                        <option value="">- Chọn phân loại -</option>
                        {selectedProd?.variants?.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Mã lô hàng (Batch)</label>
                      <input value={it.batchCode} onChange={e => updateItem(idx, 'batchCode', e.target.value)} className={inputCls} placeholder="VD: L01" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Số lượng</label>
                      <input type="number" min="1" value={it.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} className={inputCls} placeholder="SL nhập" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Giá nhập (Cost)</label>
                      <input type="number" min="0" value={it.costPrice} onChange={e => updateItem(idx, 'costPrice', e.target.value)} className={inputCls} placeholder="VNĐ" />
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Ngày SX</label>
                      <input type="date" value={it.manufacturedAt} onChange={e => updateItem(idx, 'manufacturedAt', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Hạn sử dụng</label>
                      <input type="date" value={it.expiredAt} onChange={e => updateItem(idx, 'expiredAt', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-[#D1DDD4]">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#D1DDD4] text-[#6B7F70] hover:bg-[#F0F7F2] font-medium">Huỷ</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[#5A8A6A] text-white font-medium hover:bg-[#4a7257] disabled:opacity-50">
            {loading ? 'Đang tạo...' : 'Lưu phiếu nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SellerImportsPage() {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchImports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sellerOrderService.getImports();
      setImports(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImports(); }, [fetchImports]);

  const handleConfirm = async (id) => {
    if (!window.confirm("Xác nhận phiếu nhập này? (Tồn kho sản phẩm sẽ được cộng tự động)")) return;
    setActionLoading(true);
    try {
      await sellerOrderService.confirmImport(id);
      fetchImports();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2E1F]">Quản lý nhập kho</h1>
          <p className="text-[#6B7F70] text-sm mt-1">Tạo phiếu nhập, quản lý lô hàng FEFO (Hết hạn trước - Xuất trước)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#5A8A6A] hover:bg-[#4a7257] text-white rounded-xl text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} weight="bold" /> Tạo phiếu nhập
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm flex gap-2 items-center"><Warning size={16}/> {error}</div>}

      <div className="bg-white rounded-2xl border border-[#D1DDD4] overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F0F7F2]/50 text-[#6B7F70] border-b border-[#D1DDD4]">
            <tr>
              <th className="px-5 py-3.5 font-medium">Mã Phiếu</th>
              <th className="px-5 py-3.5 font-medium">Ngày tạo</th>
              <th className="px-5 py-3.5 font-medium">Nguồn/Mùa vụ</th>
              <th className="px-5 py-3.5 font-medium text-center">Tổng lô</th>
              <th className="px-5 py-3.5 font-medium text-right">Tổng chi phí</th>
              <th className="px-5 py-3.5 font-medium text-center">Trạng thái</th>
              <th className="px-5 py-3.5 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10">Đang tải...</td></tr>
            ) : imports.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16 text-[#9EAFA3]">Chưa có phiếu nhập nào</td></tr>
            ) : (
              imports.map(imp => (
                <tr key={imp.id} className="border-b border-[#D1DDD4] hover:bg-[#F0F7F2]/30">
                  <td className="px-5 py-4 font-bold text-[#1A2E1F]">{imp.importCode}</td>
                  <td className="px-5 py-4 text-[#6B7F70]">{new Date(imp.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-5 py-4 text-[#1A2E1F]">
                    {imp.supplierName || '—'} <br/><span className="text-xs text-[#9EAFA3]">{imp.harvestSeason || ''}</span>
                  </td>
                  <td className="px-5 py-4 text-center text-[#6B7F70]">{imp.totalQuantity}</td>
                  <td className="px-5 py-4 text-right font-semibold text-[#5A8A6A]">{fmtPrice(imp.totalCost)}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusMap[imp.status]?.cls}`}>
                      {statusMap[imp.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {imp.status === 'Draft' && (
                        <button 
                          onClick={() => handleConfirm(imp.id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-[#5A8A6A] text-white rounded-lg hover:bg-[#4a7257] transition-colors font-medium text-xs flex items-center gap-1"
                        >
                          <Check size={14} /> Xác nhận (Cộng kho)
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && <CreateImportModal onClose={() => setShowModal(false)} onCreated={fetchImports} />}
    </div>
  );
}
