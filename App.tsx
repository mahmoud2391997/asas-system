
import React, { useState, useMemo, useEffect } from 'react';
import { configureStore, createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import Dashboard from './pages/Dashboard';
import PurchaseInvoices from './pages/PurchaseInvoices';
import SalesInvoices from './pages/Sales';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UsersPage from './pages/UsersPage';
import Licenses from './pages/Licenses';
import Branches from './pages/Branches';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginScreen from './pages/LoginScreen';
import Attendance from './pages/Attendance';
import LeaveRequests from './pages/LeaveRequests';
import Salaries from './pages/Salaries';
import Customers from './pages/Customers';
import CustomerDetailPage from './pages/CustomerDetailPage';
import Expenses from './pages/Expenses';
import FinancialAccounts from './pages/FinancialAccounts';
import POS from './pages/POS';
import POSSessions from './pages/POSSessions';
import ManufacturingOrderPage from './pages/ManufacturingOrderPage';
import ProductionTasks from './pages/ProductionTasks';
import ChartOfAccountsPage from './pages/ChartOfAccountsPage';
import JournalEntriesPage from './pages/JournalEntriesPage';
import IntegrationsPage from './pages/IntegrationsPage';
import AIChatbot from './components/AIChatbot';
import EmployeePortal from './pages/EmployeePortal';
import AdvanceRequestsPage from './pages/AdvanceRequestsPage';
import GeneralRequestsPage from './pages/GeneralRequestsPage';
import ProductModal from './components/ProductModal';
import PermissionsViewModal from './components/PermissionsViewModal';
import Suppliers from './pages/Suppliers';
import PurchaseRequests from './pages/PurchaseRequests';
import RequestForQuotations from './pages/RequestForQuotations';
import PurchaseQuotations from './pages/PurchaseQuotations';
import PurchaseOrders from './pages/PurchaseOrders';
import PurchaseReturns from './pages/PurchaseReturns';
import DebitNotes from './pages/DebitNotes';
import SupplierPayments from './pages/SupplierPayments';
import SettingsPurchases from './pages/SettingsPurchases';
import SettingsSuppliers from './pages/SettingsSuppliers';
import SalesQuotations from './pages/SalesQuotations';
import SalesReturns from './pages/SalesReturns';
import CreditNotes from './pages/CreditNotes';
import RecurringInvoices from './pages/RecurringInvoices';
import CustomerPayments from './pages/CustomerPayments';
import SettingsSales from './pages/SettingsSales';
import AIDailyBriefingModal from './components/AIDailyBriefingModal';
import { getDailyBriefing } from './services/geminiService';
import InventoryVouchers from './pages/InventoryVouchers';
import InventoryRequisitions from './pages/InventoryRequisitions';
import InventoryMovementsPage from './pages/InventoryMovementsPage';
import SupplyChain from './pages/SupplyChain';

// FIX: AuthContext moved to types.ts to solve circular dependency. It's now imported here.
import { User, Role, PurchaseInvoice, Sale, EmployeeData, RenewableItem, Branch, Product, InventoryItem, LeaveRequest, AttendanceRecord, SalaryPayment, RequestStatus, Customer, Expense, FinancialAccount, POSSession, ManufacturingOrder, ChatbotDataContext, InventoryAdjustmentLog, AdjustmentReason, ProductionTask, Account, IntegrationSettings, AdvanceRequest, GeneralRequest, Supplier, PurchaseRequest, PurchaseOrder, PurchaseReturn, SupplierPayment, DebitNote, RequestForQuotation, PurchaseQuotation, SalesQuotation, SalesReturn, CreditNote, RecurringInvoice, CustomerPayment, DailyBriefingContext, InventoryVoucher, InventoryRequisition, PurchaseSettings, JournalVoucher, WhatsappLog, Permission, Project, Webhook, WebhookEvent, AuthContext } from './types';
import { ToastProvider, useToasts } from './components/Toast';

// ====================================================================================
// Static Configuration Data (Moved from constants.ts)
// ====================================================================================
const PERMISSIONS: Record<Role, Permission[]> = {
    [Role.SuperAdmin]: ['purchases:create', 'purchases:read', 'purchases:update', 'purchases:delete', 'sales:create', 'sales:read', 'sales:update', 'sales:delete', 'products:create', 'products:read', 'products:update', 'products:delete', 'employees:create', 'employees:read', 'employees:update', 'employees:delete', 'licenses:create', 'licenses:read', 'licenses:update', 'licenses:delete', 'branches:create', 'branches:read', 'branches:update', 'branches:delete', 'inventory:read', 'inventory:transfer', 'inventory:update', 'inventory:adjust', 'payroll:manage', 'payroll:read', 'reports:read:full', 'settings:manage', 'manufacturing:create', 'manufacturing:read', 'manufacturing:tasks:manage', 'integrations:manage', 'advances:manage', 'general_requests:manage'],
    [Role.Perfumer]: ['manufacturing:create', 'manufacturing:read', 'manufacturing:tasks:manage', 'inventory:read', 'products:read', 'advances:request', 'general_requests:request'],
    [Role.Accountant]: ['purchases:create', 'purchases:read', 'purchases:update', 'sales:read', 'employees:read', 'licenses:read', 'inventory:read', 'payroll:read', 'reports:read:limited', 'advances:request', 'general_requests:request'],
    [Role.BranchManager]: ['purchases:create', 'purchases:read', 'sales:create', 'sales:read', 'inventory:read', 'inventory:transfer', 'inventory:update', 'inventory:adjust', 'employees:read', 'manufacturing:create', 'manufacturing:read', 'manufacturing:tasks:manage', 'advances:manage', 'general_requests:manage'],
    [Role.ShopAssistant]: ['sales:create', 'sales:read', 'inventory:read', 'products:read', 'advances:request', 'general_requests:request'],
    [Role.EcommerceManager]: ['sales:create', 'sales:read', 'inventory:read', 'products:read', 'reports:read:limited', 'advances:request', 'general_requests:request'],
    [Role.Employee]: ['advances:request', 'general_requests:request'],
};

const PERMISSION_GROUPS: { [group: string]: { key: Permission, label: string }[] } = {
    'المبيعات': [ { key: 'sales:create', label: 'إنشاء' }, { key: 'sales:read', label: 'قراءة' }, { key: 'sales:update', label: 'تحديث' }, { key: 'sales:delete', label: 'حذف' }, ], 'المشتريات': [ { key: 'purchases:create', label: 'إنشاء' }, { key: 'purchases:read', label: 'قراءة' }, { key: 'purchases:update', label: 'تحديث' }, { key: 'purchases:delete', label: 'حذف' }, ], 'المنتجات': [ { key: 'products:create', label: 'إنشاء' }, { key: 'products:read', label: 'قراءة' }, { key: 'products:update', label: 'تحديث' }, { key: 'products:delete', label: 'حذف' }, ], 'الموظفين': [ { key: 'employees:create', label: 'إنشاء' }, { key: 'employees:read', label: 'قراءة' }, { key: 'employees:update', label: 'تحديث' }, { key: 'employees:delete', label: 'حذف' }, ], 'الرواتب': [ { key: 'payroll:manage', label: 'إدارة' }, { key: 'payroll:read', label: 'قراءة' }, ], 'طلبات السلف': [ { key: 'advances:request', label: 'تقديم طلب' }, { key: 'advances:manage', label: 'إدارة الطلبات' }, ], 'الطلبات العامة': [ { key: 'general_requests:request', label: 'تقديم طلب' }, { key: 'general_requests:manage', label: 'إدارة الطلبات' }, ], 'المخزون': [ { key: 'inventory:read', label: 'قراءة' }, { key: 'inventory:transfer', label: 'تحويل' }, { key: 'inventory:update', label: 'تحديث' }, { key: 'inventory:adjust', label: 'تعديل' }, ], 'التصنيع': [ { key: 'manufacturing:create', label: 'إنشاء' }, { key: 'manufacturing:read', label: 'قراءة' }, { key: 'manufacturing:tasks:manage', label: 'إدارة المهام' }, ], 'التجديدات': [ { key: 'licenses:create', label: 'إنشاء' }, { key: 'licenses:read', label: 'قراءة' }, { key: 'licenses:update', label: 'تحديث' }, { key: 'licenses:delete', label: 'حذف' }, ], 'الفروع': [ { key: 'branches:create', label: 'إنشاء' }, { key: 'branches:read', label: 'قراءة' }, { key: 'branches:update', label: 'تحديث' }, { key: 'branches:delete', label: 'حذف' }, ], 'التقارير': [ { key: 'reports:read:full', label: 'صلاحيات كاملة' }, { key: 'reports:read:limited', label: 'صلاحيات محدودة' }, ], 'الإعدادات': [ { key: 'settings:manage', label: 'إدارة الإعدادات' }, { key: 'integrations:manage', label: 'إدارة التكاملات' }, ],
};

const PROJECTS: Project[] = [
    { id: '1', name: 'Generic Perfumes' },
    { id: '2', name: 'Arabiva' },
];

const CHART_OF_ACCOUNTS: Account[] = [
    { id: '1', name: 'الأصول', type: 'Asset', children: [ { id: '1-1000', name: 'الأصول المتداولة', type: 'Asset', children: [ { id: '1-1100', name: 'النقدية وما يعادلها', type: 'Asset' }, { id: '1-1200', name: 'الذمم المدينة', type: 'Asset' }, { id: '1-1300', name: 'المخزون', type: 'Asset' }, ] }, { id: '1-2000', name: 'الأصول الثابتة', type: 'Asset', children: [ { id: '1-2100', name: 'المعدات والأجهزة', type: 'Asset' }, ] }, ] },
    { id: '2', name: 'الالتزامات', type: 'Liability', children: [ { id: '2-1000', name: 'الالتزامات المتداولة', type: 'Liability', children: [ { id: '2-1100', name: 'الذمم الدائنة', type: 'Liability' }, { id: '2-1200', name: 'مصاريف مستحقة', type: 'Liability' }, ] }, ] },
    { id: '3', name: 'حقوق الملكية', type: 'Equity', children: [ { id: '3-1000', name: 'رأس المال', type: 'Equity' }, { id: '3-2000', name: 'الأرباح المحتجزة', type: 'Equity' }, ] },
    { id: '4', name: 'الإيرادات', type: 'Revenue', children: [ { id: '4-1000', name: 'إيرادات المبيعات', type: 'Revenue', children: [ { id: '4-1100', name: 'مبيعات Arabiva', type: 'Revenue' }, { id: '4-1200', name: 'مبيعات Generic', type: 'Revenue' }, ] }, ] },
    { id: '5', name: 'المصروفات', type: 'Expense', children: [ { id: '5-1000', name: 'تكلفة البضاعة المباعة', type: 'Expense' }, { id: '5-2000', name: 'مصروفات تشغيلية', type: 'Expense' }, { id: '5-3000', name: 'مصروفات إدارية وعمومية', type: 'Expense' }, ] },
];


// ====================================================================================
// Redux Configuration
// ====================================================================================

const API_BASE_URL = 'https://perfume-commerce.vercel.app/api';

const transformResponse = (item: any) => {
    const { _id, ...rest } = item;
    return { ...rest, id: _id };
};

const transformInventoryResponse = (item: any) => {
    const { _id, branch, product, ...rest } = item;
    return { ...rest, id: _id, branchId: branch, productId: product };
};

const createApiThunks = <T extends { id: any }>(sliceName: string, endpoint?: string, transform?: (item: any) => T) => {
    const finalEndpoint = endpoint || sliceName;
    const transformer = transform || ((item: any) => transformResponse(item) as T);

    const fetchAll = createAsyncThunk<T[], void>(`${sliceName}/fetchAll`, async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${finalEndpoint}`);
            if (!response.ok) throw new Error(`Failed to fetch ${finalEndpoint}`);
            const result = await response.json();
            if (!result.success) throw new Error(result.message || `API error fetching ${finalEndpoint}`);
            return result.data.map(transformer);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    });

    const addNew = createAsyncThunk<T, Partial<T>>(`${sliceName}/addNew`, async (newItem, { rejectWithValue }) => {
        try {
            const { id, ...itemToSend } = newItem as any;
            const response = await fetch(`${API_BASE_URL}/${finalEndpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemToSend) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || `Failed to add ${finalEndpoint}`); }
            const result = await response.json();
            if (!result.success) throw new Error(result.message || `API error adding ${finalEndpoint}`);
            return transformer(result.data);
        } catch (error: any) { return rejectWithValue(error.message); }
    });

    const updateOne = createAsyncThunk<T, T>(`${sliceName}/updateOne`, async (itemToUpdate, { rejectWithValue }) => {
        try {
            const { id, ...itemToSend } = itemToUpdate as any;
            const response = await fetch(`${API_BASE_URL}/${finalEndpoint}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemToSend) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || `Failed to update ${finalEndpoint}`); }
            const result = await response.json();
            if (!result.success) throw new Error(result.message || `API error updating ${finalEndpoint}`);
            return transformer(result.data);
        } catch (error: any) { return rejectWithValue(error.message); }
    });

    const deleteOne = createAsyncThunk<string, string>(`${sliceName}/deleteOne`, async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${finalEndpoint}/${id}`, { method: 'DELETE' });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || `Failed to delete ${finalEndpoint}`); }
            const result = await response.json();
            if (!result.success) throw new Error(result.message || `API error deleting ${finalEndpoint}`);
            return id;
        } catch (error: any) { return rejectWithValue(error.message); }
    });

    return { fetchAll, addNew, updateOne, deleteOne };
};

const createGenericSlice = <T extends { id: any }>( sliceName: string, thunks: ReturnType<typeof createApiThunks<T>>) => {
    const adapter = createEntityAdapter<T>({ selectId: (entity) => entity.id });
    const slice = createSlice({
        name: sliceName,
        initialState: adapter.getInitialState({ status: 'idle', error: null as string | null }),
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(thunks.fetchAll.pending, (state) => { state.status = 'loading'; })
                .addCase(thunks.fetchAll.fulfilled, (state, action) => { state.status = 'succeeded'; adapter.setAll(state, action.payload); })
                .addCase(thunks.fetchAll.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string || null; })
                .addCase(thunks.addNew.fulfilled, adapter.addOne)
                .addCase(thunks.updateOne.fulfilled, (state, action) => { adapter.upsertOne(state, action.payload); })
                .addCase(thunks.deleteOne.fulfilled, adapter.removeOne);
        },
    });
    return { slice, adapter, thunks };
};

// --- Create all slices ---
const users = createGenericSlice<User>('users', createApiThunks<User>('users'));
const products = createGenericSlice<Product>('products', createApiThunks<Product>('products'));
const sales = createGenericSlice<Sale>('sales', createApiThunks<Sale>('sales'));
const purchases = createGenericSlice<PurchaseInvoice>('purchases', createApiThunks<PurchaseInvoice>('purchaseinvoices'));
const employees = createGenericSlice<EmployeeData>('employees', createApiThunks<EmployeeData>('employees'));
const customers = createGenericSlice<Customer>('customers', createApiThunks<Customer>('customers'));
const suppliers = createGenericSlice<Supplier>('suppliers', createApiThunks<Supplier>('suppliers'));
const branches = createGenericSlice<Branch>('branches', createApiThunks<Branch>('branches'));
const inventory = createGenericSlice<InventoryItem>('inventory', createApiThunks<InventoryItem>('inventory', 'inventory', transformInventoryResponse));
const expenses = createGenericSlice<Expense>('expenses', createApiThunks<Expense>('expenses'));
const financialAccounts = createGenericSlice<FinancialAccount>('financialAccounts', createApiThunks<FinancialAccount>('financialaccounts'));
const manufacturingOrders = createGenericSlice<ManufacturingOrder>('manufacturingOrders', createApiThunks<ManufacturingOrder>('manufacturing_orders'));
const stockAdjustments = createGenericSlice<InventoryAdjustmentLog>('stockAdjustments', createApiThunks<InventoryAdjustmentLog>('stockadjustments'));
const salesQuotations = createGenericSlice<SalesQuotation>('salesQuotations', createApiThunks<SalesQuotation>('salesquotations'));
const salesReturns = createGenericSlice<SalesReturn>('salesReturns', createApiThunks<SalesReturn>('salesreturns'));
const creditNotes = createGenericSlice<CreditNote>('creditNotes', createApiThunks<CreditNote>('creditnotes'));
const recurringInvoices = createGenericSlice<RecurringInvoice>('recurringInvoices', createApiThunks<RecurringInvoice>('recurringinvoices'));
const customerPayments = createGenericSlice<CustomerPayment>('customerPayments', createApiThunks<CustomerPayment>('customerpayments'));
const inventoryVouchers = createGenericSlice<InventoryVoucher>('inventoryVouchers', createApiThunks<InventoryVoucher>('inventoryvouchers'));
const inventoryRequisitions = createGenericSlice<InventoryRequisition>('inventoryRequisitions', createApiThunks<InventoryRequisition>('inventoryrequisitions'));
const communications = createGenericSlice<WhatsappLog>('communications', createApiThunks<WhatsappLog>('communications'));
const purchaseOrders = createGenericSlice<PurchaseOrder>('purchaseOrders', createApiThunks<PurchaseOrder>('purchaseorders'));


const store = configureStore({
    reducer: {
        users: users.slice.reducer, products: products.slice.reducer, sales: sales.slice.reducer, purchases: purchases.slice.reducer, employees: employees.slice.reducer, customers: customers.slice.reducer, suppliers: suppliers.slice.reducer, branches: branches.slice.reducer, inventory: inventory.slice.reducer, expenses: expenses.slice.reducer, financialAccounts: financialAccounts.slice.reducer, manufacturingOrders: manufacturingOrders.slice.reducer, stockAdjustments: stockAdjustments.slice.reducer, salesQuotations: salesQuotations.slice.reducer, salesReturns: salesReturns.slice.reducer, creditNotes: creditNotes.slice.reducer, recurringInvoices: recurringInvoices.slice.reducer, customerPayments: customerPayments.slice.reducer, inventoryVouchers: inventoryVouchers.slice.reducer, inventoryRequisitions: inventoryRequisitions.slice.reducer, communications: communications.slice.reducer, purchaseOrders: purchaseOrders.slice.reducer,
    },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector = <T,>(selector: (state: RootState) => T) => useSelector<RootState, T>(selector);

const entitySelectors = {
    users: users.adapter.getSelectors<RootState>(state => state.users), products: products.adapter.getSelectors<RootState>(state => state.products), sales: sales.adapter.getSelectors<RootState>(state => state.sales), purchases: purchases.adapter.getSelectors<RootState>(state => state.purchases), employees: employees.adapter.getSelectors<RootState>(state => state.employees), customers: customers.adapter.getSelectors<RootState>(state => state.customers), suppliers: suppliers.adapter.getSelectors<RootState>(state => state.suppliers), branches: branches.adapter.getSelectors<RootState>(state => state.branches), inventory: inventory.adapter.getSelectors<RootState>(state => state.inventory), expenses: expenses.adapter.getSelectors<RootState>(state => state.expenses), financialAccounts: financialAccounts.adapter.getSelectors<RootState>(state => state.financialAccounts), manufacturingOrders: manufacturingOrders.adapter.getSelectors<RootState>(state => state.manufacturingOrders), stockAdjustments: stockAdjustments.adapter.getSelectors<RootState>(state => state.stockAdjustments), salesQuotations: salesQuotations.adapter.getSelectors<RootState>(state => state.salesQuotations), salesReturns: salesReturns.adapter.getSelectors<RootState>(state => state.salesReturns), creditNotes: creditNotes.adapter.getSelectors<RootState>(state => state.creditNotes), recurringInvoices: recurringInvoices.adapter.getSelectors<RootState>(state => state.recurringInvoices), customerPayments: customerPayments.adapter.getSelectors<RootState>(state => state.customerPayments), inventoryVouchers: inventoryVouchers.adapter.getSelectors<RootState>(state => state.inventoryVouchers), inventoryRequisitions: inventoryRequisitions.adapter.getSelectors<RootState>(state => state.inventoryRequisitions), communications: communications.adapter.getSelectors<RootState>(state => state.communications), purchaseOrders: purchaseOrders.adapter.getSelectors<RootState>(state => state.purchaseOrders),
};

type Theme = 'light' | 'dark';

const AppContent: React.FC = () => {
    const { addToast } = useToasts();
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<User | null>(null);
    const [activeView, setActiveView] = useState('Dashboard');
    const [theme, setTheme] = useState<Theme>('dark');

    const allUsers = useAppSelector(entitySelectors.users.selectAll); const allProducts = useAppSelector(entitySelectors.products.selectAll); const allSales = useAppSelector(entitySelectors.sales.selectAll); const allPurchases = useAppSelector(entitySelectors.purchases.selectAll); const allEmployees = useAppSelector(entitySelectors.employees.selectAll); const allCustomers = useAppSelector(entitySelectors.customers.selectAll); const allSuppliers = useAppSelector(entitySelectors.suppliers.selectAll); const allBranches = useAppSelector(entitySelectors.branches.selectAll); const allInventory = useAppSelector(entitySelectors.inventory.selectAll); const allExpenses = useAppSelector(entitySelectors.expenses.selectAll); const allFinancialAccounts = useAppSelector(entitySelectors.financialAccounts.selectAll); const allManufacturingOrders = useAppSelector(entitySelectors.manufacturingOrders.selectAll); const allInventoryAdjustmentLogs = useAppSelector(entitySelectors.stockAdjustments.selectAll); const allSalesQuotations = useAppSelector(entitySelectors.salesQuotations.selectAll); const allSalesReturns = useAppSelector(entitySelectors.salesReturns.selectAll); const allCreditNotes = useAppSelector(entitySelectors.creditNotes.selectAll); const allRecurringInvoices = useAppSelector(entitySelectors.recurringInvoices.selectAll); const allCustomerPayments = useAppSelector(entitySelectors.customerPayments.selectAll); const allInventoryVouchers = useAppSelector(entitySelectors.inventoryVouchers.selectAll); const allInventoryRequisitions = useAppSelector(entitySelectors.inventoryRequisitions.selectAll); const allWhatsappLogs = useAppSelector(entitySelectors.communications.selectAll); const allPurchaseOrders = useAppSelector(entitySelectors.purchaseOrders.selectAll);
    
    const dataStatus = useAppSelector(state => ({ products: state.products.status, sales: state.sales.status, purchases: state.purchases.status }));
    const isLoading = Object.values(dataStatus).some(s => s === 'loading');
    const isInitialLoad = Object.values(dataStatus).some(s => s === 'idle');

    // State for data without API endpoints (initialized as empty)
    const [renewables, setRenewables] = useState<RenewableItem[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
    const [journalVouchers, setJournalVouchers] = useState<JournalVoucher[]>([]);
    const [posSessions, setPosSessions] = useState<POSSession[]>([]);
    const [productionTasks, setProductionTasks] = useState<ProductionTask[]>([]);
    const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>([]);
    const [generalRequests, setGeneralRequests] = useState<GeneralRequest[]>([]);
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [rfqs, setRfqs] = useState<RequestForQuotation[]>([]);
    const [purchaseQuotations, setPurchaseQuotations] = useState<PurchaseQuotation[]>([]);
    const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>([]);
    const [debitNotes, setDebitNotes] = useState<DebitNote[]>([]);
    const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>([]);

    const [chartOfAccounts] = useState<Account[]>(CHART_OF_ACCOUNTS);
    const [settings, setSettings] = useState({ salesTarget: 50000, renewalReminders: { days: [30, 15, 7, 3] } });
    const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({ openCart: { isEnabled: true, apiUrl: 'https://genericperfumes.com/api/v1', apiKey: 'test_key', apiSecret: 'test_secret', autoSyncCustomers: true, autoSyncSales: true, syncInterval: 60 }, wooCommerce: { isEnabled: false, apiUrl: '', apiKey: '', apiSecret: '', autoSyncCustomers: false, autoSyncSales: false, syncInterval: 60 }, myFatoorah: { isEnabled: true, apiKey: 'myfatoorah_test_key' }, whatsapp: { isEnabled: true, apiKey: 'whatsapp_test_key', phoneNumberId: '123456789' }, n8n: { isEnabled: false, webhooks: [ { event: 'sale.created', url: 'https://n8n.example.com/webhook/sale-created', isEnabled: true }, { event: 'customer.created', url: 'https://n8n.example.com/webhook/customer-created', isEnabled: false } ] as Webhook[] }, ai: { isEnabled: true, provider: 'Gemini' } });
    const [purchaseSettings, setPurchaseSettings] = useState<PurchaseSettings>({ defaultPaymentTermsDays: 30, defaultShippingPreference: 'Delivery', isApprovalWorkflowEnabled: true, approvalTiers: [ { id: 1, minAmount: 1000, approverRole: Role.BranchManager }, { id: 2, minAmount: 5000, approverRole: Role.Accountant } ] });
    
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [viewingPermissionsFor, setViewingPermissionsFor] = useState<User | null>(null);
    const [isBriefingOpen, setIsBriefingOpen] = useState(false);
    const [briefingContent, setBriefingContent] = useState<string | null>(null);
    const [isBriefingLoading, setIsBriefingLoading] = useState(false);

    useEffect(() => {
        // dispatch(users.thunks.fetchAll()); // No API yet
        dispatch(products.thunks.fetchAll());
        dispatch(sales.thunks.fetchAll());
        dispatch(purchases.thunks.fetchAll());
        dispatch(employees.thunks.fetchAll());
        dispatch(customers.thunks.fetchAll());
        dispatch(suppliers.thunks.fetchAll());
        dispatch(branches.thunks.fetchAll());
        dispatch(inventory.thunks.fetchAll());
        dispatch(expenses.thunks.fetchAll());
        dispatch(financialAccounts.thunks.fetchAll());
        dispatch(manufacturingOrders.thunks.fetchAll());
        // dispatch(stockAdjustments.thunks.fetchAll()); // No API yet
        // dispatch(salesQuotations.thunks.fetchAll()); // No API yet
        // dispatch(salesReturns.thunks.fetchAll()); // No API yet
        // dispatch(creditNotes.thunks.fetchAll()); // No API yet
        // dispatch(recurringInvoices.thunks.fetchAll()); // No API yet
        // dispatch(customerPayments.thunks.fetchAll()); // No API yet
        dispatch(inventoryVouchers.thunks.fetchAll());
        dispatch(inventoryRequisitions.thunks.fetchAll());
        // dispatch(communications.thunks.fetchAll()); // No API yet
        dispatch(purchaseOrders.thunks.fetchAll());
    }, [dispatch]);

    const activeSession = useMemo(() => posSessions.find(s => s.status === 'Open' && (!user?.branchId || s.branchId === user.branchId)), [posSessions, user]);
    
    useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
    useEffect(() => { const handleMouseMove = (e: MouseEvent) => { document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`); document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`); }; document.addEventListener('mousemove', handleMouseMove); return () => document.removeEventListener('mousemove', handleMouseMove); }, []);

    const authContextValue = useMemo(() => ({
        user,
        login: (role: Role) => {
            let loggedInUser = allUsers.find(u => u.role === role);
            // If no users from API, create a mock user for the selected role
            if (!loggedInUser) {
                loggedInUser = {
                    id: `mock-${role}`,
                    name: role,
                    username: role,
                    password: '',
                    role: role,
                    branchId: allBranches[0]?.id,
                    permissions: PERMISSIONS[role] || []
                };
            }
            setUser(loggedInUser);
            switch (role) {
                case Role.ShopAssistant: setActiveView('POS/Start'); break;
                case Role.Perfumer: setActiveView('Manufacturing/Orders'); break;
                case Role.Employee: setActiveView('MyProfile'); break;
                default: setActiveView('Dashboard'); break;
            }
        },
        logout: () => setUser(null)
    }), [user, allUsers, allBranches]);

    const checkAndSendRenewalReminders = () => { return false };
    const handleGenerateBriefing = () => {};
    
    const dispatchCrudAction = async <T extends { id: any }>(thunks: ReturnType<typeof createApiThunks<T>>, item: T, itemName: string) => {
        const action = item.id ? thunks.updateOne(item) : thunks.addNew(item as Partial<T>);
        try {
            const result = await dispatch(action).unwrap();
            addToast(`${itemName} saved successfully!`, 'success');
            return result;
        } catch (error: any) { addToast(`Failed to save ${itemName}: ${error}`, 'error'); throw error; }
    };
    
    // CRUD Handlers refactored for Redux
    const handleSaveUser = (userToSave: User) => dispatchCrudAction(users.thunks, userToSave, 'User');
    const handleSaveProduct = (productToSave: Product) => dispatchCrudAction(products.thunks, productToSave, 'Product');
    const handleSaveEmployee = (employee: EmployeeData) => dispatchCrudAction(employees.thunks, employee, 'Employee');
    const handleSaveBranch = (branch: Branch) => dispatchCrudAction(branches.thunks, branch, 'Branch');
    const handleSaveSupplier = (supplier: Supplier) => dispatchCrudAction(suppliers.thunks, supplier, 'Supplier');
    const handleSaveExpense = (expense: Expense) => dispatchCrudAction(expenses.thunks, expense, 'Expense');
    const handleSaveSalesQuotation = (quotation: SalesQuotation) => dispatchCrudAction(salesQuotations.thunks, quotation, 'Sales Quotation');
    const handleSaveProductionOrder = (order: ManufacturingOrder) => dispatchCrudAction(manufacturingOrders.thunks, order, 'Manufacturing Order');
    const handleSavePurchaseOrder = (order: PurchaseOrder) => dispatchCrudAction(purchaseOrders.thunks, order, 'Purchase Order');
    const handleSaveSalesReturn = (sr: SalesReturn) => dispatchCrudAction(salesReturns.thunks, sr, 'Sales Return');
    const handleSaveCreditNote = (cn: CreditNote) => dispatchCrudAction(creditNotes.thunks, cn, 'Credit Note');
    const handleSaveRecurringInvoice = (ri: RecurringInvoice) => dispatchCrudAction(recurringInvoices.thunks, ri, 'Recurring Invoice');
    const handleSaveCustomerPayment = (cp: CustomerPayment) => dispatchCrudAction(customerPayments.thunks, cp, 'Customer Payment');
    const handleSaveInventoryVoucher = (iv: InventoryVoucher) => dispatchCrudAction(inventoryVouchers.thunks, iv, 'Inventory Voucher');
    const handleSaveInventoryRequisition = (ir: InventoryRequisition) => dispatchCrudAction(inventoryRequisitions.thunks, ir, 'Inventory Requisition');
    
    const handleSavePurchaseInvoice = async (invoice: PurchaseInvoice) => { await dispatchCrudAction(purchases.thunks, invoice, 'Purchase Invoice'); dispatch(inventory.thunks.fetchAll()); };
    const handleSaveSale = async (sale: Sale) => { const newSale = await dispatchCrudAction(sales.thunks, sale, 'Sale'); dispatch(inventory.thunks.fetchAll()); if (activeSession && newSale) { setPosSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, salesIds: [...s.salesIds, (newSale as Sale).id] } : s)); }};
    const handleSaveCustomer = async (customer: Customer): Promise<Customer> => { return (await dispatchCrudAction(customers.thunks, customer, 'Customer')) as Customer; };
    const handleDeleteEmployee = async (employeeId: string) => { try { await dispatch(employees.thunks.deleteOne(employeeId)).unwrap(); addToast('Employee deleted.', 'success'); } catch (error: any) { addToast(`Failed to delete employee: ${error}`, 'error'); } };
    
    const handleOpenProductModal = (product: Partial<Product>) => setEditingProduct(product);
    const handleCloseProductModal = () => setEditingProduct(null);
    const handleSaveAndCloseProductModal = async (productToSave: Product) => { try { await handleSaveProduct(productToSave); handleCloseProductModal(); } catch (error) {} };

    const handleConvertQuoteToInvoice = async (quotation: SalesQuotation) => {
        // if (!user?.branchId) return;
        const customer = allCustomers.find(c => c.id === quotation.customerId);
        if(!customer) return;
        const newSale: Partial<Sale> = { brand: 'Arabiva', branchId: user?.branchId || allBranches[0]?.id, customerName: customer.name, customerId: customer.id, date: new Date().toISOString().split('T')[0], paymentMethod: 'Credit', paymentStatus: 'Pending', items: quotation.items.map(item => ({...item, id: Date.now() + Math.random() })), totalAmount: quotation.totalAmount, quotationId: quotation.id };
        await handleSaveSale(newSale as Sale);
        await dispatchCrudAction(salesQuotations.thunks, {...quotation, status: 'Accepted'}, 'Sales Quotation');
        addToast(`Quotation #${quotation.quoteNumber} converted to invoice.`, 'success');
    };

    // --- Local State Handlers (placeholders until API is available) ---
    const handleUpdateInventoryItem = (updatedItem: InventoryItem) => {};
    const handleTransferInventory = (data: any) => addToast('Transfer functionality not connected to API.', 'info');
    const handleAdjustInventory = (data: any) => { dispatch(stockAdjustments.thunks.addNew(data)).then(() => dispatch(inventory.thunks.fetchAll())); };
    const handleRecordAttendance = (records: AttendanceRecord[]) => { setAttendance(records); addToast('Attendance (local) saved.', 'info'); };
    const handleSaveLeaveRequest = (request: LeaveRequest) => { setLeaveRequests(prev => [...prev, {...request, id: Date.now().toString()}]); addToast('Leave Request (local) saved.', 'info'); };
    const handleSaveAdvanceRequest = (request: AdvanceRequest) => { setAdvanceRequests(prev => [...prev, {...request, id: Date.now().toString()}]); addToast('Advance Request (local) saved.', 'info'); };
    const handleSaveGeneralRequest = (request: GeneralRequest) => { setGeneralRequests(prev => [...prev, {...request, id: Date.now().toString()}]); addToast('General Request (local) saved.', 'info'); };
    const handleRunPayroll = (year: number, month: number) => addToast('Payroll not connected to API.', 'info');
    const handleStartSession = (openingBalance: number) => addToast('POS Sessions not connected to API.', 'info');
    const handleCloseSession = (closingBalance: number) => addToast('POS Sessions not connected to API.', 'info');
    const handleSaveProductionTask = (task: ProductionTask) => { setProductionTasks(prev => [...prev, {...task, id: Date.now().toString()}]); addToast('Production Task (local) saved.', 'info'); };
    const handleSaveIntegrations = (newSettings: IntegrationSettings) => setIntegrationSettings(newSettings);
    const handleSavePurchaseRequest = (request: PurchaseRequest) => setPurchaseRequests(prev => [...prev, {...request, id: Date.now().toString()}]);
    const handleSaveRfq = (rfq: RequestForQuotation) => setRfqs(prev => [...prev, {...rfq, id: Date.now().toString()}]);
    const handleSavePurchaseQuotation = (quotation: PurchaseQuotation) => setPurchaseQuotations(prev => [...prev, {...quotation, id: Date.now().toString()}]);
    const handleSavePurchaseReturn = (pr: PurchaseReturn) => setPurchaseReturns(prev => [...prev, {...pr, id: Date.now().toString()}]);
    const handleSaveDebitNote = (dn: DebitNote) => setDebitNotes(prev => [...prev, {...dn, id: Date.now().toString()}]);
    const handleSavePurchaseSettings = (newSettings: PurchaseSettings) => setPurchaseSettings(newSettings);
    const handleSaveJournalVoucher = (voucher: JournalVoucher) => setJournalVouchers(prev => [...prev, {...voucher, id: Date.now().toString()}]);

    const chatbotDataContext = useMemo(() => ({ sales: allSales, purchases: allPurchases, products: allProducts, inventory: allInventory, customers: allCustomers, employees: allEmployees, branches: allBranches, expenses: allExpenses, suppliers: allSuppliers, }), [allSales, allPurchases, allProducts, allInventory, allCustomers, allEmployees, allBranches, allExpenses, allSuppliers]);
    const lowStockItemsCount = useMemo(() => allInventory.filter(i => i.quantity <= i.minStock && i.minStock > 0).length, [allInventory]);
    const totalPendingHRRequests = leaveRequests.filter(r => r.status === 'Pending').length + advanceRequests.filter(r => r.status === 'Pending').length + generalRequests.filter(r => r.status === 'Pending').length;
    const sessionsForView = useMemo(() => (user?.role === Role.BranchManager || user?.role === Role.ShopAssistant) && user?.branchId ? posSessions.filter(s => s.branchId === user.branchId) : posSessions, [posSessions, user]);
    const isBranchScopedUser = useMemo(() => user?.role === Role.BranchManager || user?.role === Role.ShopAssistant, [user]);
    const salesForView = useMemo(() => isBranchScopedUser && user?.branchId ? allSales.filter(s => s.branchId === user.branchId) : allSales, [allSales, user, isBranchScopedUser]);
    const purchaseInvoicesForView = useMemo(() => isBranchScopedUser && user?.branchId ? allPurchases.filter(p => p.branchId === user.branchId) : allPurchases, [allPurchases, user, isBranchScopedUser]);
    const inventoryForView = useMemo(() => isBranchScopedUser && user?.branchId ? allInventory.filter(i => i.branchId === user.branchId) : allInventory, [allInventory, user, isBranchScopedUser]);
    const employeesForView = useMemo(() => isBranchScopedUser && user?.branchId ? allEmployees.filter(e => e.branchId === user.branchId) : allEmployees, [allEmployees, user, isBranchScopedUser]);
    const expensesForView = useMemo(() => isBranchScopedUser && user?.branchId ? allExpenses.filter(e => e.branchId === user.branchId) : allExpenses, [allExpenses, user, isBranchScopedUser]);

    if (!user) { return ( <AuthContext.Provider value={authContextValue}> <LoginScreen /> </AuthContext.Provider> ); }
    if (isInitialLoad) { return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Loading application data...</div>; }

    const renderView = () => {
        if (activeView.startsWith('MyProfile')) return <EmployeePortal user={user} employees={allEmployees} leaveRequests={leaveRequests} advanceRequests={advanceRequests} generalRequests={generalRequests} attendance={attendance} salaryPayments={salaryPayments} onSaveLeaveRequest={handleSaveLeaveRequest} onSaveAdvanceRequest={handleSaveAdvanceRequest} onSaveGeneralRequest={handleSaveGeneralRequest} />;
        if (activeView.startsWith('Dashboard')) return <Dashboard sales={salesForView} purchases={purchaseInvoicesForView} employees={employeesForView} inventory={inventoryForView} products={allProducts} branches={allBranches} settings={settings} accounts={chartOfAccounts} expenses={expensesForView} renewables={renewables} leaveRequests={leaveRequests} advanceRequests={advanceRequests} generalRequests={generalRequests} suppliers={allSuppliers} />;
        if (activeView.startsWith('Sales/Invoices') || activeView === 'Sales') return <SalesInvoices sales={salesForView} onSave={handleSaveSale} branches={allBranches} products={allProducts} inventory={inventoryForView} customers={allCustomers} />;
        if (activeView.startsWith('Sales/Quotations')) return <SalesQuotations quotations={allSalesQuotations} onSave={handleSaveSalesQuotation} onConvertToInvoice={handleConvertQuoteToInvoice} customers={allCustomers} products={allProducts} />;
        if (activeView.startsWith('Sales/Returns')) return <SalesReturns returns={allSalesReturns} sales={allSales} customers={allCustomers} />;
        if (activeView.startsWith('Sales/CreditNotes')) return <CreditNotes notes={allCreditNotes} customers={allCustomers} />;
        if (activeView.startsWith('Sales/Recurring')) return <RecurringInvoices invoices={allRecurringInvoices} customers={allCustomers} />;
        if (activeView.startsWith('Sales/Payments')) return <CustomerPayments payments={allCustomerPayments} customers={allCustomers} />;
        if (activeView.startsWith('Purchases/Invoices') || activeView === 'Purchases') return <PurchaseInvoices invoices={purchaseInvoicesForView} onSave={handleSavePurchaseInvoice} branches={allBranches} products={allProducts} sales={salesForView} inventory={inventoryForView} suppliers={allSuppliers} />;
        if (activeView.startsWith('Purchases/Suppliers')) return <Suppliers suppliers={allSuppliers} onSave={handleSaveSupplier} purchaseInvoices={allPurchases} />;
        if (activeView.startsWith('Purchases/Requests')) return <PurchaseRequests requests={purchaseRequests} onSave={handleSavePurchaseRequest} employees={allEmployees} branches={allBranches} products={allProducts} />;
        if (activeView.startsWith('Purchases/RFQs')) return <RequestForQuotations rfqs={rfqs} onSave={handleSaveRfq} suppliers={allSuppliers} products={allProducts} purchaseRequests={purchaseRequests} />;
        if (activeView.startsWith('Purchases/Quotations')) return <PurchaseQuotations quotations={purchaseQuotations} onSave={handleSavePurchaseQuotation} suppliers={allSuppliers} products={allProducts} rfqs={rfqs} />;
        if (activeView.startsWith('Purchases/Orders')) return <PurchaseOrders orders={allPurchaseOrders} onSave={handleSavePurchaseOrder} suppliers={allSuppliers} products={allProducts} purchaseQuotations={purchaseQuotations} />;
        if (activeView.startsWith('Purchases/Returns')) return <PurchaseReturns returns={purchaseReturns} onSave={handleSavePurchaseReturn} suppliers={allSuppliers} products={allProducts} />;
        if (activeView.startsWith('Purchases/DebitNotes')) return <DebitNotes notes={debitNotes} onSave={handleSaveDebitNote} suppliers={allSuppliers} products={allProducts} />;
        if (activeView.startsWith('Purchases/Payments')) return <SupplierPayments payments={supplierPayments} suppliers={allSuppliers} />;
        if (activeView === 'Inventory/Vouchers') return <InventoryVouchers vouchers={allInventoryVouchers} />;
        if (activeView === 'Inventory/Requisitions') return <InventoryRequisitions requisitions={allInventoryRequisitions} onSave={handleSaveInventoryRequisition} products={allProducts} branches={allBranches} />;
        if (activeView.startsWith('Inventory/Products/')) {
            const productId = activeView.split('/')[2];
            const product = allProducts.find(p => p.id === productId);
            if (product) { return <ProductDetailPage key={productId} product={product} inventory={allInventory} sales={allSales} purchaseInvoices={allPurchases} users={allUsers} branches={allBranches} products={allProducts} suppliers={allSuppliers} inventoryAdjustmentLogs={allInventoryAdjustmentLogs} onBack={() => setActiveView('Inventory/Products')} onEditProduct={handleOpenProductModal} onTransferInventory={handleTransferInventory} onAdjustInventory={handleAdjustInventory} />; }
        }
        if (activeView === 'Inventory/Products' || activeView === 'Inventory') { return <ProductsPage products={allProducts} suppliers={allSuppliers} onProductSelect={(product) => setActiveView(`Inventory/Products/${product.id}`)} onAddNew={() => handleOpenProductModal({})} />; }
        if (activeView === 'Inventory/Tracking') { return <InventoryMovementsPage sales={allSales} purchaseInvoices={allPurchases} inventoryAdjustmentLogs={allInventoryAdjustmentLogs} products={allProducts} branches={allBranches} users={allUsers} />; }
        if (['Inventory/Stocktakes', 'Inventory/Transfers', 'Inventory/Pricelists'].includes(activeView)) { return <div className="glass-pane" style={{padding: '2rem', textAlign: 'center'}}>Coming Soon: {activeView.split('/')[1]}</div> }
        if (activeView.startsWith('POS/Start')) return <POS posView="default" products={allProducts} inventory={allInventory} customers={allCustomers} onSaveCustomer={handleSaveCustomer} onSave={handleSaveSale} integrationSettings={integrationSettings} branches={allBranches} />;
        if (activeView.startsWith('POS/KuwaitMagic')) return <POS posView="kuwaitMagic" products={allProducts} inventory={allInventory} customers={allCustomers} onSaveCustomer={handleSaveCustomer} onSave={handleSaveSale} integrationSettings={integrationSettings} branches={allBranches} />;
        if (activeView.startsWith('POS/Sessions')) return <POSSessions sessions={sessionsForView} activeSession={activeSession} sales={allSales} branches={allBranches} employees={allEmployees} onStartSession={handleStartSession} onCloseSession={handleCloseSession} setActiveView={setActiveView} />;
        if (activeView.startsWith('Customers/')) {
            const customerId = activeView.split('/')[1];
            const customer = allCustomers.find(c => c.id === customerId);
            if (customer) { return <CustomerDetailPage customer={customer} sales={allSales} branches={allBranches} whatsappLogs={allWhatsappLogs} onBack={() => setActiveView('Customers')} />; }
        }
        if (activeView.startsWith('Customers')) return <Customers customers={allCustomers} onSave={handleSaveCustomer} whatsappSettings={integrationSettings.whatsapp} branches={allBranches} onCustomerSelect={(customer) => setActiveView(`Customers/${customer.id}`)} PROJECTS={PROJECTS} />;
        if (activeView.startsWith('Manufacturing/Orders')) return <ManufacturingOrderPage order={allManufacturingOrders[0]} branches={allBranches} products={allProducts} inventory={inventoryForView} employees={employeesForView} onSave={handleSaveProductionOrder} />;
        if (activeView.startsWith('Manufacturing/Tasks')) return <ProductionTasks tasks={productionTasks} orders={allManufacturingOrders} employees={employeesForView} onSave={handleSaveProductionTask} />;
        if (activeView.startsWith('Finance/Expenses')) return <Expenses expenses={expensesForView} onSave={handleSaveExpense} branches={allBranches} financialAccounts={allFinancialAccounts} />;
        if (activeView.startsWith('Finance/Accounts')) return <FinancialAccounts financialAccounts={allFinancialAccounts} branches={allBranches} />;
        if (activeView.startsWith('Ledger/ChartOfAccounts')) return <ChartOfAccountsPage accounts={chartOfAccounts} onSave={() => {}} sales={allSales} purchases={allPurchases} expenses={allExpenses}/>;
        if (activeView.startsWith('Ledger/Journal')) return <JournalEntriesPage journalVouchers={journalVouchers} onSave={handleSaveJournalVoucher} accounts={chartOfAccounts} />;
        if (activeView.startsWith('HR/Employees')) return <Employees employees={employeesForView} onSave={handleSaveEmployee} onDelete={handleDeleteEmployee} branches={allBranches} />;
        if (activeView.startsWith('HR/Attendance')) return <Attendance employees={employeesForView} attendanceRecords={attendance} onRecordAttendance={handleRecordAttendance} />;
        if (activeView.startsWith('HR/LeaveRequests')) return <LeaveRequests employees={allEmployees} leaveRequests={leaveRequests} onSaveRequest={handleSaveLeaveRequest} />;
        if (activeView.startsWith('HR/AdvanceRequests')) return <AdvanceRequestsPage requests={advanceRequests} employees={allEmployees} onSaveRequest={handleSaveAdvanceRequest} />;
        if (activeView.startsWith('HR/GeneralRequests')) return <GeneralRequestsPage requests={generalRequests} employees={allEmployees} onSaveRequest={handleSaveGeneralRequest} />;
        if (activeView.startsWith('HR/Salaries')) return <Salaries employees={employeesForView} payments={salaryPayments} onRunPayroll={handleRunPayroll} />;
        if (activeView.startsWith('Branches')) return <Branches branches={allBranches} onSave={handleSaveBranch} />;
        if (activeView.startsWith('Renewals')) return <Licenses renewables={renewables} setRenewables={setRenewables} onCheckReminders={checkAndSendRenewalReminders} />;
        if (activeView.startsWith('Reports')) return <Reports sales={salesForView} purchases={purchaseInvoicesForView} products={allProducts} branches={allBranches} expenses={expensesForView} customers={allCustomers} financialAccounts={allFinancialAccounts} activeReport={activeView} suppliers={allSuppliers} />;
        if (activeView.startsWith('Settings/General')) return <Settings settings={settings} setSettings={setSettings} />;
        if (['Settings/Inventory', 'Settings/Products'].includes(activeView)) { return <div className="glass-pane" style={{padding: '2rem', textAlign: 'center'}}>Coming Soon: {activeView.split('/')[1]}</div> }
        if (activeView.startsWith('Settings/Sales')) return <SettingsSales />;
        if (activeView.startsWith('Settings/Purchases')) return <SettingsPurchases settings={purchaseSettings} onSave={handleSavePurchaseSettings} />;
        if (activeView.startsWith('Settings/Suppliers')) return <SettingsSuppliers />;
        if (activeView.startsWith('Settings/Integrations')) return <IntegrationsPage settings={integrationSettings} onSave={handleSaveIntegrations} />;
        if (activeView.startsWith('Users')) return <UsersPage users={allUsers} branches={allBranches} onSave={handleSaveUser} onViewPermissions={setViewingPermissionsFor} PERMISSION_GROUPS={PERMISSION_GROUPS} />;
        if (activeView.startsWith('SupplyChain')) return <SupplyChain />;
        
        return <Dashboard sales={salesForView} purchases={purchaseInvoicesForView} employees={employeesForView} inventory={inventoryForView} products={allProducts} branches={allBranches} settings={settings} accounts={chartOfAccounts} expenses={expensesForView} renewables={renewables} leaveRequests={leaveRequests} advanceRequests={advanceRequests} generalRequests={generalRequests} suppliers={allSuppliers} />;
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            <div className={`app-layout theme-${theme}`}>
                <Sidebar activeView={activeView} setActiveView={setActiveView} lowStockCount={lowStockItemsCount} pendingLeavesCount={totalPendingHRRequests} />
                <div className="main-content-wrapper">
                    <Header viewTitle={activeView} theme={theme} toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} products={allProducts} onProductSelect={(product) => setActiveView(`Inventory/Products/${product.id}`)} onViewMyPermissions={() => setViewingPermissionsFor(user)} onGenerateBriefing={handleGenerateBriefing} />
                    <main className="main-content">
                        {isLoading && isInitialLoad ? <div style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Loading...</div> : renderView()}
                    </main>
                </div>
                <AIChatbot dataContext={chatbotDataContext} />
                {editingProduct && ( <ProductModal product={editingProduct} allProducts={allProducts} onClose={handleCloseProductModal} onSave={handleSaveAndCloseProductModal} suppliers={allSuppliers} /> )}
                {viewingPermissionsFor && ( <PermissionsViewModal user={viewingPermissionsFor} onClose={() => setViewingPermissionsFor(null)} PERMISSION_GROUPS={PERMISSION_GROUPS} /> )}
                <AIDailyBriefingModal isOpen={isBriefingOpen} onClose={() => setIsBriefingOpen(false)} isLoading={isBriefingLoading} briefingContent={briefingContent} />
            </div>
        </AuthContext.Provider>
    );
};

// This is the main export for the App.tsx file in the root
const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ToastProvider>
                <AppContent />
            </ToastProvider>
        </Provider>
    );
}

export default App;
