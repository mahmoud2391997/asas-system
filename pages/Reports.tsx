import React, { useState, useMemo } from 'react';
// FIX: Replaced non-existent 'Purchase' type with 'PurchaseInvoice'.
import { Sale, PurchaseInvoice, Product, Branch, Expense, Customer, FinancialAccount, ExpenseCategory, SaleItem, Supplier } from '../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard';
import { CurrencyDollarIcon, ShoppingCartIcon, ChartBarIcon, PrinterIcon, SparklesIcon, CubeIcon, DocumentTextIcon } from '../components/Icon';
import { getSalesForecastWithGemini } from '../services/geminiService';
import { useToasts } from '../components/Toast';

interface ReportsProps {
    sales: Sale[];
    purchases: PurchaseInvoice[];
    products: Product[];
    branches: Branch[];
    expenses: Expense[];
    customers: Customer[];
    financialAccounts: FinancialAccount[];
    activeReport: string;
    suppliers: Supplier[];
}

const getPastDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#6366f1'];
const SALES_COLOR = '#10b981';
const PURCHASES_COLOR = '#3b82f6';
const FORECAST_COLOR = '#8b5cf6';

const formatCurrency = (val: number) => `${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} د.ك`;


// Filter Bar Component
const FilterBar: React.FC<{
    filters: any;
    onFilterChange: (filters: any) => void;
    branches: Branch[];
    showBranchFilter: boolean;
    showDateFilter: boolean;
}> = ({ filters, onFilterChange, branches, showBranchFilter, showDateFilter }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onFilterChange({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="glass-pane" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>مرشحات التقرير</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {showDateFilter && (
                    <>
                        <input type="date" name="start" value={filters.start} onChange={handleInputChange} className="form-input" style={{width: '180px'}}/>
                        <span>إلى</span>
                        <input type="date" name="end" value={filters.end} onChange={handleInputChange} className="form-input" style={{width: '180px'}}/>
                    </>
                )}
                {showBranchFilter && (
                    <select name="branch" value={filters.branch} onChange={handleInputChange} className="form-select" style={{width: '220px'}}>
                        <option value="all">كل الفروع</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                )}
                 <button className="btn btn-ghost">
                    <PrinterIcon style={{width: '20px', height: '20px'}}/>
                    طباعة التقرير
                </button>
            </div>
        </div>
    );
};

// Brand Performance Report
const BrandPerformanceReport: React.FC<{sales: Sale[], filters: any}> = ({ sales, filters }) => {
    const brandData = useMemo(() => {
        const filteredSales = sales.filter(s => {
            const saleDate = new Date(s.date);
            const dateMatch = (!filters.start || saleDate >= new Date(filters.start)) && (!filters.end || saleDate <= new Date(filters.end));
            return dateMatch;
        });

        const data: { [key: string]: { totalSales: number; unitsSold: number; invoiceCount: number; } } = {
            'Arabiva': { totalSales: 0, unitsSold: 0, invoiceCount: 0 },
            'Generic': { totalSales: 0, unitsSold: 0, invoiceCount: 0 },
        };

        filteredSales.forEach(sale => {
            data[sale.brand].totalSales += sale.totalAmount;
            data[sale.brand].invoiceCount++;
            data[sale.brand].unitsSold += sale.items.reduce((sum, item) => sum + item.quantity, 0);
        });
        
        const arabiva = data['Arabiva'];
        const generic = data['Generic'];
        
        return {
            chartData: [
                { name: 'Arabiva', sales: arabiva.totalSales },
                { name: 'Generic', sales: generic.totalSales }
            ],
            tableData: [
                { brand: 'Arabiva', ...arabiva, avgSale: arabiva.invoiceCount > 0 ? arabiva.totalSales / arabiva.invoiceCount : 0 },
                { brand: 'Generic', ...generic, avgSale: generic.invoiceCount > 0 ? generic.totalSales / generic.invoiceCount : 0 },
            ]
        };
    }, [sales, filters]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div className="glass-pane" style={{ padding: '1.5rem', height: '400px' }}>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>مقارنة المبيعات بين العلامات التجارية</h3>
                 <ResponsiveContainer width="100%" height="calc(100% - 40px)">
                    <BarChart data={brandData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
                        <XAxis dataKey="name" stroke="var(--text-secondary)" />
                        <YAxis stroke="var(--text-secondary)" tickFormatter={val => formatCurrency(val as number)} />
                        <Tooltip contentStyle={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '12px' }} cursor={{fill: 'var(--highlight-hover)'}}/>
                        <Bar dataKey="sales" name="المبيعات" radius={[8, 8, 0, 0]}>
                            {brandData.chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                 </ResponsiveContainer>
            </div>
             <div className="glass-pane" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>تفاصيل أداء العلامات التجارية</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>العلامة التجارية</th><th>إجمالي المبيعات</th><th>عدد الوحدات المباعة</th><th>عدد الفواتير</th><th>متوسط قيمة الفاتورة</th></tr></thead>
                        <tbody>
                            {brandData.tableData.map(d => (
                                <tr key={d.brand}>
                                    <td style={{fontWeight: 600}}>{d.brand}</td>
                                    <td style={{color: 'var(--secondary-color)', fontWeight: 'bold'}}>{formatCurrency(d.totalSales)}</td>
                                    <td>{d.unitsSold.toLocaleString()}</td>
                                    <td>{d.invoiceCount.toLocaleString()}</td>
                                    <td>{formatCurrency(d.avgSale)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// Sales Report
const SalesReport: React.FC<{sales: Sale[], branches: Branch[], filters: any}> = ({ sales, branches, filters }) => {
    const filteredSales = useMemo(() => sales.filter(s => {
        const saleDate = new Date(s.date);
        const branchMatch = filters.branch === 'all' || s.branchId === filters.branch;
        const dateMatch = (!filters.start || saleDate >= new Date(filters.start)) && (!filters.end || saleDate <= new Date(filters.end));
        return branchMatch && dateMatch;
    }), [sales, filters]);

    const totalSales = useMemo(() => filteredSales.reduce((sum, s) => sum + s.totalAmount, 0), [filteredSales]);
    const invoiceCount = filteredSales.length;
    const avgInvoiceValue = invoiceCount > 0 ? totalSales / invoiceCount : 0;
    
    const salesByBranch = useMemo(() => {
        const data: { [key: string]: number } = {};
        filteredSales.forEach(s => {
            const branchName = branches.find(b => b.id === s.branchId)?.name || 'Unknown';
            data[branchName] = (data[branchName] || 0) + s.totalAmount;
        });
        return Object.entries(data).map(([name, sales]) => ({ name, sales }));
    }, [filteredSales, branches]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="إجمالي المبيعات للفترة" value={formatCurrency(totalSales)} icon={CurrencyDollarIcon} iconBg="linear-gradient(135deg, #10b981, #34d399)" />
                <StatCard title="عدد الفواتير" value={invoiceCount.toLocaleString('ar-EG')} icon={DocumentTextIcon} iconBg="linear-gradient(135deg, #3b82f6, #60a5fa)" />
                <StatCard title="متوسط قيمة الفاتورة" value={formatCurrency(avgInvoiceValue)} icon={ChartBarIcon} iconBg="linear-gradient(135deg, #8b5cf6, #a78bfa)" />
            </div>
            
            {filters.branch === 'all' && salesByBranch.length > 1 && (
                <div className="glass-pane" style={{ padding: '1.5rem', height: '400px' }}>
                     <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>المبيعات حسب الفرع</h3>
                     <ResponsiveContainer width="100%" height="calc(100% - 40px)">
                        <BarChart data={salesByBranch}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" tickFormatter={val => formatCurrency(val as number)} />
                            <Tooltip contentStyle={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '12px' }} cursor={{fill: 'var(--highlight-hover)'}} formatter={(value) => formatCurrency(value as number)} />
                            <Bar dataKey="sales" name="المبيعات" fill={SALES_COLOR} radius={[8, 8, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                </div>
            )}
             
             <div className="glass-pane" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>تفاصيل المبيعات</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>التاريخ</th>
                                <th>الفرع</th>
                                <th>العميل</th>
                                <th>المبلغ الإجمالي</th>
                                <th>حالة الدفع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map(s => (
                                <tr key={s.id}>
                                    <td>{s.invoiceNumber}</td>
                                    <td>{s.date}</td>
                                    <td>{branches.find(b => b.id === s.branchId)?.name}</td>
                                    <td>{s.customerName}</td>
                                    <td style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>{formatCurrency(s.totalAmount)}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '9999px',
                                            color: s.paymentStatus === 'Pending' ? '#111' : '#fff',
                                            background: s.paymentStatus === 'Paid' ? '#10b981' : s.paymentStatus === 'Pending' ? '#f59e0b' : '#ef4444'
                                        }}>
                                            {s.paymentStatus === 'Paid' ? 'مدفوع' : s.paymentStatus === 'Pending' ? 'قيد الانتظار' : 'متأخر'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// Branch Sales Report
const BranchSalesReport: React.FC<{sales: Sale[], branches: Branch[], products: Product[], filters: any}> = ({ sales, branches, products, filters }) => {
    const branchSalesData = useMemo(() => {
        const filteredSales = sales.filter(s => {
            const saleDate = new Date(s.date);
            const dateMatch = (!filters.start || saleDate >= new Date(filters.start)) && (!filters.end || saleDate <= new Date(filters.end));
            return dateMatch;
        });

        const dataByBranch: { [key: string]: { totalSales: number; invoiceCount: number; items: SaleItem[] } } = {};

        filteredSales.forEach(sale => {
            if (!dataByBranch[sale.branchId]) {
                dataByBranch[sale.branchId] = { totalSales: 0, invoiceCount: 0, items: [] };
            }
            dataByBranch[sale.branchId].totalSales += sale.totalAmount;
            dataByBranch[sale.branchId].invoiceCount++;
            dataByBranch[sale.branchId].items.push(...sale.items);
        });
        
        return Object.entries(dataByBranch).map(([branchIdStr, data]) => {
            const branchId = branchIdStr;
            const branch = branches.find(b => b.id === branchId);
            
            const productSales = data.items.reduce((acc: {[key: string]: number}, item) => {
                acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
                return acc;
            }, {});
            
            let topProduct = 'N/A';
            if (Object.keys(productSales).length > 0) {
                const topProductId = Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b);
                topProduct = products.find(p => p.id === topProductId)?.name || 'Unknown';
            }

            return {
                branchId: branchId,
                branchName: branch?.name || 'Unknown',
                totalSales: data.totalSales,
                invoiceCount: data.invoiceCount,
                avgInvoiceValue: data.invoiceCount > 0 ? data.totalSales / data.invoiceCount : 0,
                topProduct: topProduct,
            };
        }).sort((a, b) => b.totalSales - a.totalSales);

    }, [sales, branches, products, filters]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div className="glass-pane" style={{ padding: '1.5rem', height: '400px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>إجمالي المبيعات حسب الفرع</h3>
                <ResponsiveContainer width="100%" height="calc(100% - 40px)">
                    <BarChart data={branchSalesData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" />
                        <XAxis dataKey="branchName" stroke="var(--text-secondary)" />
                        <YAxis stroke="var(--text-secondary)" tickFormatter={val => formatCurrency(val as number)} />
                        <Tooltip contentStyle={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '12px' }} cursor={{fill: 'var(--highlight-hover)'}} formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="totalSales" name="إجمالي المبيعات" fill={SALES_COLOR} radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="glass-pane" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>تحليل مبيعات الفروع</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>الفرع</th>
                                <th>إجمالي المبيعات</th>
                                <th>عدد الفواتير</th>
                                <th>متوسط قيمة الفاتورة</th>
                                <th>المنتج الأكثر مبيعاً</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branchSalesData.map(b => (
                                <tr key={b.branchId}>
                                    <td style={{ fontWeight: 600 }}>{b.branchName}</td>
                                    <td style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{formatCurrency(b.totalSales)}</td>
                                    <td>{b.invoiceCount.toLocaleString()}</td>
                                    <td>{formatCurrency(b.avgInvoiceValue)}</td>
                                    <td>{b.topProduct}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// Purchases Report
const PurchasesReport: React.FC<{purchases: PurchaseInvoice[], branches: Branch[], filters: any, suppliers: Supplier[]}> = ({ purchases, branches, filters, suppliers }) => {
     const filteredPurchases = useMemo(() => purchases.filter(p => {
        const purchaseDate = new Date(p.date);
        const branchMatch = filters.branch === 'all' || p.branchId === filters.branch;
        const dateMatch = (!filters.start || purchaseDate >= new Date(filters.start)) && (!filters.end || purchaseDate <= new Date(filters.end));
        return branchMatch && dateMatch;
    }), [purchases, filters]);
    const totalPurchases = useMemo(() => filteredPurchases.reduce((sum, p) => sum + p.amount, 0), [filteredPurchases]);
     return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <StatCard title="إجمالي المشتريات للفترة المحددة" value={formatCurrency(totalPurchases)} icon={ShoppingCartIcon} iconBg="linear-gradient(135deg, #3b82f6, #60a5fa)" />
            <div className="glass-pane" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>تفاصيل المشتريات</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>المعرف</th><th>التاريخ</th><th>الفرع</th><th>المورد</th><th>المبلغ</th></tr></thead>
                        <tbody>
                             {filteredPurchases.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.date}</td>
                                    <td>{branches.find(b => b.id === p.branchId)?.name}</td>
                                    <td>{suppliers.find(s => s.id === p.supplierId)?.name || 'غير معروف'}</td>
                                    <td>{formatCurrency(p.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

// Product Sales Report
const ProductSalesReport: React.FC<{sales: Sale[], products: Product[], filters: any}> = ({ sales, products, filters }) => {
    const processedData = useMemo(() => {
        const filteredSales = sales.filter(s => {
            const saleDate = new Date(s.date);
            const branchMatch = filters.branch === 'all' || s.branchId === filters.branch;
            const dateMatch = (!filters.start || saleDate >= new Date(filters.start)) && (!filters.end || saleDate <= new Date(filters.end));
            return branchMatch && dateMatch;
        });

        const productData = filteredSales.flatMap(s => s.items).reduce((acc: { [key: string]: { quantity: number, revenue: number } }, item) => {
            if (!acc[item.productId]) {
                acc[item.productId] = { quantity: 0, revenue: 0 };
            }
            acc[item.productId].quantity += item.quantity;
            acc[item.productId].revenue += item.total;
            return acc;
        }, {} as { [key: string]: { quantity: number; revenue: number } });

        return Object.entries(productData).map(([productId, data]) => {
            const product = products.find(p => p.id === productId);
            const stats = data as { quantity: number; revenue: number };
            return {
                productId: productId,
                productName: product?.name || 'Unknown Product',
                productSku: product?.sku || 'N/A',
                totalQuantity: stats.quantity,
                totalRevenue: stats.revenue
            };
        }).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }, [sales, products, filters]);

    const totalUniqueProductsSold = processedData.length;

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <StatCard title="إجمالي المنتجات المباعة (الفريدة)" value={totalUniqueProductsSold.toString()} icon={CubeIcon} iconBg="linear-gradient(135deg, #8b5cf6, #a78bfa)" />
            <div className="glass-pane" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>تفاصيل مبيعات المنتجات</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>SKU</th>
                                <th>إجمالي الكمية المباعة</th>
                                <th>إجمالي الإيرادات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedData.map(p => (
                                <tr key={p.productId}>
                                    <td style={{fontWeight: 600}}>{p.productName}</td>
                                    <td>{p.productSku}</td>
                                    <td>{p.totalQuantity.toLocaleString()}</td>
                                    <td style={{fontWeight: 600, color: 'var(--secondary-color)'}}>{formatCurrency(p.totalRevenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Reports: React.FC<ReportsProps> = (props) => {
    const { activeReport, branches } = props;
    const [filters, setFilters] = useState({
        start: getPastDate(30),
        end: new Date().toISOString().split('T')[0],
        branch: 'all',
    });

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    const renderActiveReport = () => {
        switch(activeReport) {
            case 'Reports/BrandPerformance':
                return <BrandPerformanceReport sales={props.sales} filters={filters} />;
            case 'Reports/Sales':
            case 'Reports/Summary': // Default to Sales report for summary view
            case 'Reports':
                return <SalesReport sales={props.sales} branches={props.branches} filters={filters} />;
            case 'Reports/BranchSales':
                return <BranchSalesReport sales={props.sales} branches={props.branches} products={props.products} filters={filters} />;
            case 'Reports/Purchases':
                return <PurchasesReport purchases={props.purchases} branches={props.branches} filters={filters} suppliers={props.suppliers} />;
            case 'Reports/Products':
                return <ProductSalesReport sales={props.sales} products={props.products} filters={filters} />;
            // Add other cases here as components are built
            case 'Reports/Forecast':
            case 'Reports/Expenses':
            case 'Reports.Customers':
            case 'Reports/Accounts':
            default:
                return (
                    <div className="glass-pane" style={{ padding: '2rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>التقرير غير متاح</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>التقرير المطلوب قيد الإنشاء حالياً.</p>
                    </div>
                );
        }
    };
    
    // Some reports may not need all filters
    const showBranchFilter = ![].includes(activeReport);
    const showDateFilter = ![].includes(activeReport);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FilterBar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                branches={branches} 
                showBranchFilter={showBranchFilter}
                showDateFilter={showDateFilter}
            />
            {renderActiveReport()}
        </div>
    );
};

export default Reports;
