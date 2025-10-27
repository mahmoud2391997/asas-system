import React, { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { useToasts } from '../components/Toast'

interface SupplyChainItem {
  id: number
  sku?: string
  gtin?: string
  batchNumber?: string
  serialNumber?: string
  productName: string
  quantity: number
  unit?: string
  manufacturer?: string
  originCountry?: string
  manufactureDate?: string
  expiryDate?: string
  currentStatus?: string
  transportMode?: string
}

const expectedColumns = [
  'المعرف',
  'رمز_SKU',
  'رمز_GTin',
  'رقم_الدفعة',
  'الرقم_التسلسلي',
  'اسم_المنتج',
  'الكمية',
  'الوحدة',
  'الشركة_المصنعة',
  'بلد_المنشأ',
  'تاريخ_التصنيع',
  'تاريخ_الانتهاء',
  'الحالة_الحالية',
  'وسيلة_النقل',
]

const SupplyChain: React.FC = () => {
  const { addToast } = useToasts()

  const [data, setData] = useState<SupplyChainItem[]>([])
  const [search, setSearch] = useState('')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newItem, setNewItem] = useState<SupplyChainItem>({
    id: Date.now(),
    productName: '',
    quantity: 1,
  })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (i) =>
        (i.sku || '').toLowerCase().includes(q) ||
        (i.gtin || '').toLowerCase().includes(q) ||
        i.productName.toLowerCase().includes(q)
    )
  }, [data, search])

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([], { header: expectedColumns })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'قالب_سلسلة_التوريد')
    XLSX.writeFile(wb, 'قالب_سلسلة_التوريد.xlsx')
    addToast('تم تحميل القالب بنجاح!', 'success')
  }

  const handleExportAll = () => {
    const rows = data.map((row) => ({
      [expectedColumns[0]]: row.id,
      [expectedColumns[1]]: row.sku || '',
      [expectedColumns[2]]: row.gtin || '',
      [expectedColumns[3]]: row.batchNumber || '',
      [expectedColumns[4]]: row.serialNumber || '',
      [expectedColumns[5]]: row.productName,
      [expectedColumns[6]]: row.quantity,
      [expectedColumns[7]]: row.unit || '',
      [expectedColumns[8]]: row.manufacturer || '',
      [expectedColumns[9]]: row.originCountry || '',
      [expectedColumns[10]]: row.manufactureDate || '',
      [expectedColumns[11]]: row.expiryDate || '',
      [expectedColumns[12]]: row.currentStatus || '',
      [expectedColumns[13]]: row.transportMode || '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows, { header: expectedColumns })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'بيانات_سلسلة_التوريد')
    XLSX.writeFile(wb, 'بيانات_سلسلة_التوريد.xlsx')
    addToast('تم تصدير كل البيانات بنجاح!', 'success')
  }

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr as string, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' })

        if (rows.length === 0) {
          addToast('الملف لا يحتوي على بيانات', 'error')
          return
        }

        const transformed: SupplyChainItem[] = rows.map((row, idx) => ({
          id: Number(row[expectedColumns[0]]) || Date.now() + idx,
          sku: row[expectedColumns[1]] || '',
          gtin: row[expectedColumns[2]] || '',
          batchNumber: row[expectedColumns[3]] || '',
          serialNumber: row[expectedColumns[4]] || '',
          productName: row[expectedColumns[5]] || `منتج ${idx + 1}`,
          quantity: Number(row[expectedColumns[6]]) || 0,
          unit: row[expectedColumns[7]] || '',
          manufacturer: row[expectedColumns[8]] || '',
          originCountry: row[expectedColumns[9]] || '',
          manufactureDate: row[expectedColumns[10]] || '',
          expiryDate: row[expectedColumns[11]] || '',
          currentStatus: row[expectedColumns[12]] || '',
          transportMode: row[expectedColumns[13]] || '',
        }))

        setData(transformed)
        addToast(`تم استيراد ${transformed.length} عنصر بنجاح!`, 'success')
      } catch (err) {
        addToast('خطأ في قراءة الملف', 'error')
      } finally {
        e.currentTarget.value = ''
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleAddItem = () => {
    if (!newItem.productName) {
      addToast('اسم المنتج مطلوب', 'error')
      return
    }
    setData((prev) => [{ ...newItem }, ...prev])
    addToast('تم إضافة العنصر بنجاح!', 'success')
    setIsAddOpen(false)
    setNewItem({ id: Date.now(), productName: '', quantity: 1 })
  }

  const handleDelete = (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return
    setData((prev) => prev.filter((i) => i.id !== id))
    addToast('تم حذف العنصر بنجاح!', 'success')
  }

  return (
    <div dir="rtl" className="page-wrapper">
      <div className="glass-pane" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>إدارة سلسلة التوريد</h2>
            <div className="text-muted" style={{ marginTop: '4px' }}>استيراد/تصدير Excel وإضافة عناصر</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={handleDownloadTemplate}>تحميل القالب</button>
            <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
              استيراد Excel
              <input type="file" accept=".xlsx,.xls" onChange={handleImport} style={{ display: 'none' }} />
            </label>
            <button className="btn" onClick={handleExportAll}>تصدير كل البيانات</button>
            <button className="btn btn-success" onClick={() => setIsAddOpen(true)}>إضافة عنصر</button>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            className="form-input"
            placeholder="البحث بـ SKU أو GTIN أو اسم المنتج"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{expectedColumns[0]}</th>
                  <th>{expectedColumns[1]}</th>
                  <th>{expectedColumns[2]}</th>
                  <th>{expectedColumns[5]}</th>
                  <th>{expectedColumns[6]}</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td className="font-mono">{row.sku || 'غير متوفر'}</td>
                    <td className="font-mono">{row.gtin || 'غير متوفر'}</td>
                    <td>{row.productName}</td>
                    <td>{row.quantity} {row.unit || ''}</td>
                    <td>
                      <button className="btn btn-warning" onClick={() => setNewItem(row) || setIsAddOpen(true)}>
                        تعديل
                      </button>
                      <button className="btn btn-danger" style={{ marginInlineStart: 8 }} onClick={() => handleDelete(row.id)}>
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>لا توجد بيانات. قم باستيراد ملف أو أضف عناصر جديدة.</div>
        )}
      </div>

      {isAddOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddOpen(false)}>
          <div className="modal-content glass-pane" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>عنصر سلسلة توريد</h2></div>
            <div className="modal-body">
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>اسم المنتج *</label>
                  <input className="form-input" value={newItem.productName} onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })} />
                </div>
                <div>
                  <label>الكمية</label>
                  <input type="number" className="form-input" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) || 0 })} />
                </div>
                <div>
                  <label>SKU</label>
                  <input className="form-input" value={newItem.sku || ''} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} />
                </div>
                <div>
                  <label>GTIN</label>
                  <input className="form-input" value={newItem.gtin || ''} onChange={(e) => setNewItem({ ...newItem, gtin: e.target.value })} />
                </div>
                <div>
                  <label>الوحدة</label>
                  <input className="form-input" value={newItem.unit || ''} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} />
                </div>
                <div>
                  <label>رقم الدفعة</label>
                  <input className="form-input" value={newItem.batchNumber || ''} onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })} />
                </div>
                <div>
                  <label>الرقم التسلسلي</label>
                  <input className="form-input" value={newItem.serialNumber || ''} onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })} />
                </div>
                <div>
                  <label>الشركة المصنعة</label>
                  <input className="form-input" value={newItem.manufacturer || ''} onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })} />
                </div>
                <div>
                  <label>بلد المنشأ</label>
                  <input className="form-input" value={newItem.originCountry || ''} onChange={(e) => setNewItem({ ...newItem, originCountry: e.target.value })} />
                </div>
                <div>
                  <label>تاريخ التصنيع</label>
                  <input type="date" className="form-input" value={newItem.manufactureDate || ''} onChange={(e) => setNewItem({ ...newItem, manufactureDate: e.target.value })} />
                </div>
                <div>
                  <label>تاريخ الانتهاء</label>
                  <input type="date" className="form-input" value={newItem.expiryDate || ''} onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })} />
                </div>
                <div>
                  <label>الحالة الحالية</label>
                  <input className="form-input" value={newItem.currentStatus || ''} onChange={(e) => setNewItem({ ...newItem, currentStatus: e.target.value })} />
                </div>
                <div>
                  <label>وسيلة النقل</label>
                  <input className="form-input" value={newItem.transportMode || ''} onChange={(e) => setNewItem({ ...newItem, transportMode: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setIsAddOpen(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={handleAddItem}>حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplyChain
