
import { Blob } from "@google/genai";
import React from 'react';

export enum Role {
  SuperAdmin = 'Super Admin',
  Perfumer = 'Perfumer',
  Accountant = 'Accountant',
  BranchManager = 'Branch Manager',
  ShopAssistant = 'Shop Assistant',
  EcommerceManager = 'E-commerce Manager',
  Employee = 'Employee',
}

export type Permission = 
  | 'purchases:create' | 'purchases:read' | 'purchases:update' | 'purchases:delete'
  | 'sales:create' | 'sales:read' | 'sales:update' | 'sales:delete'
  | 'products:create' | 'products:read' | 'products:update' | 'products:delete'
  | 'employees:create' | 'employees:read' | 'employees:update' | 'employees:delete'
  | 'licenses:create' | 'licenses:read' | 'licenses:update' | 'licenses:delete'
  | 'branches:create' | 'branches:read' | 'branches:update' | 'branches:delete'
  | 'inventory:read' | 'inventory:transfer' | 'inventory:update' | 'inventory:adjust'
  | 'payroll:manage' | 'payroll:read'
  | 'reports:read:full' | 'reports:read:limited'
  | 'settings:manage'
  | 'manufacturing:create' | 'manufacturing:read' | 'manufacturing:tasks:manage'
  | 'integrations:manage'
  | 'advances:request' | 'advances:manage'
  | 'general_requests:request' | 'general_requests:manage';

export interface User {
  id: string;
  name: string;
  role: Role;
  permissions: Permission[];
  branchId?: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  name: string;
  // FIX: Added projectId to associate a branch with a project.
  projectId: string;
}

export interface PurchaseInvoiceItem {
  id: number;
  productName: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  description?: string;
  discountPercent?: number;
  taxPercent?: number;
}

export interface Supplier {
    id: string;
    code?: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    balance: number; // Positive for money owed to them, negative for credit
}

export type Currency = 'KWD' | 'USD' | 'EUR';

export type DocStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Confirmed' | 'Billed' | 'Paid' | 'Overdue' | 'Returned' | 'Cancelled' | 'Closed' | 'Sent' | 'Accepted' | 'Expired' | 'Open' | 'Applied' | 'Void' | 'Active' | 'Paused' | 'Ended' | 'Completed';


export interface PurchaseInvoice {
  id: string;
  branchId: string;
  brand: 'Arabiva' | 'Generic';
  supplierId: string;
  date: string;
  amount: number; // Final amount in KWD
  amountInCurrency: number;
  currency: Currency;
  exchangeRate: number;
  type: 'Local' | 'External';
  description: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  items: PurchaseInvoiceItem[];
  purchaseOrderId?: string;
  notes?: string;
  attachments?: string;
  templateId?: string;
}

export interface PurchaseRequestItem {
    productId: string;
    quantity: number;
    notes?: string;
}
export interface PurchaseRequest {
    id: string;
    name?: string; // "مسمى"
    date: string;
    dueDate?: string;
    requestedByUserId: string;
    branchId: string;
    items: PurchaseRequestItem[];
    status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Ordered';
    notes?: string;
    attachment?: string;
}

export interface PurchaseOrderItem {
    productId: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxId?: string;
    total: number;
}
export interface PurchaseOrder {
    id: string;
    date: string;
    supplierId: string;
    items: PurchaseOrderItem[];
    totalAmount: number;
    status: 'Draft' | 'Confirmed' | 'Billed' | 'Completed' | 'Cancelled';
    quotationId?: string;
    notes?: string;
    shippingCost?: number;
    discountAmount?: number;
    templateId?: string;
    validUntil?: string;
    currency?: Currency;
}

export interface PurchaseReturnItem {
    productId: string;
    quantity: number;
    reason: string;
    description?: string;
    unitPrice: number;
    discountPercent?: number;
    taxId?: string;
    total: number;
}
export interface PurchaseReturn {
    id: string;
    date: string;
    supplierId: string;
    returnNumber?: string;
    items: PurchaseReturnItem[];
    totalReturnedAmount: number;
    status: 'Draft' | 'Returned';
    notes?: string;
    shippingCost?: number;
    discountAmount?: number;
    purchaseInvoiceId?: string; // Link to original invoice
}

export interface DebitNoteItem {
    id: number;
    productId: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxId?: string;
    total: number;
}

export interface DebitNote {
    id: string;
    date: string;
    supplierId: string;
    items: DebitNoteItem[];
    amount: number;
    reason: string;
    debitNoteNumber?: string;
    notes?: string;
    purchaseReturnId?: string;
}

export interface RequestForQuotationItem {
    productId: string;
    quantity: number;
}
export interface RequestForQuotation {
    id: string;
    date: string;
    code?: string;
    supplierIds: string[];
    items: RequestForQuotationItem[];
    deadline: string;
    dueDate?: string;
    status: 'Draft' | 'Sent' | 'Closed';
    notes?: string;
    attachment?: string;
    purchaseRequestIds?: string[];
}

export interface PurchaseQuotationItem {
    productId: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discountPercent?: number;
    taxId?: string;
    total: number;
}
export interface PurchaseQuotation {
    id: string;
    rfqId: string;
    supplierId: string;
    date: string;
    items: PurchaseQuotationItem[];
    totalAmount: number;
    status: 'Received' | 'Accepted' | 'Rejected';
    notes?: string;
    shippingCost?: number;
    discountAmount?: number;
}

export interface SupplierPayment {
    id: string;
    date: string;
    supplierId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
}

export interface SaleItem {
  id: number;
  productName: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'Cash' | 'Card' | 'K-Net' | 'Credit' | 'MyFatoorah';

export interface Sale {
  id: string;
  branchId: string;
  brand: 'Arabiva' | 'Generic';
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  date: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  items: SaleItem[];
  sessionId?: string;
  quotationId?: string;
  source?: 'In-Store' | 'Website';
}

export interface SalesQuotationItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
export interface SalesQuotation {
    id: string;
    quoteNumber: string;
    customerId: string;
    date: string;
    expiryDate: string;
    items: SalesQuotationItem[];
    totalAmount: number;
    status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
}

export interface SalesReturnItem {
    productId: string;
    quantity: number;
    reason: string;
}
export interface SalesReturn {
    id: string;
    returnNumber: string;
    date: string;
    originalInvoiceId: string;
    customerId: string;
    items: SalesReturnItem[];
    totalReturnedAmount: number;
    status: 'Draft' | 'Returned' | 'Completed';
}

export interface CreditNote {
    id: string;
    noteNumber: string;
    date: string;
    salesReturnId?: string;
    customerId: string;
    amount: number;
    reason: string;
    status: 'Open' | 'Applied' | 'Void';
}

export interface RecurringInvoice {
    id: string;
    customerId: string;
    startDate: string;
    frequency: 'Monthly' | 'Quarterly' | 'Yearly';
    items: SaleItem[]; // Re-use SaleItem
    totalAmount: number;
    nextInvoiceDate: string;
    status: 'Active' | 'Paused' | 'Ended';
}

export interface CustomerPayment {
    id: string;
    paymentNumber: string;
    date: string;
    customerId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    appliedToInvoiceId?: string;
    notes?: string;
}


export type EmployeeAttachmentType = 'Passport' | 'ID' | 'CV' | 'Other';

export interface EmployeeAttachment {
    id: number;
    name: string;
    type: EmployeeAttachmentType;
    file: File;
    uploadDate: string;
}

export interface EmployeeBenefit {
    title: string;
    description: string;
    icon: string; // Name of the icon component
}

export interface EmployeeData {
    id: string;
    name:string;
    position: string;
    branchId: string;
    salary: number;
    allowances: number;
    advances: number;
    hireDate: string;
    annualLeaveDays: number; // Total entitlement for the year
    attachments?: EmployeeAttachment[];
    benefits?: EmployeeBenefit[];
}

export interface Report {
    name: string;
    description: string;
    requiredPermission: Permission;
}

export interface InvoiceData {
  vendor?: string;
  date?: string;
  amount?: number;
}

export type RenewableCategory = 'License' | 'Vehicle' | 'Permit' | 'Subscription' | 'Other';

export interface RenewableItem {
  id: number;
  category: RenewableCategory;
  name: string;
  identifier: string; // License number, plate number, etc.
  issueDate: string;
  expiryDate: string;
  documentFile?: File;
  remindersSent: {
    [day: number]: boolean;
  };
}

export interface RenewableData {
  category?: RenewableCategory;
  name?: string;
  identifier?: string;
  issueDate?: string;
  expiryDate?: string;
}


export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  baseUnit: 'pcs' | 'g' | 'ml';
  productLine?: string;
  fragranceNotes?: { top: string; middle: string; base: string; };
  components?: { productId: string; quantity: number }[];
  barcode?: string;
  density?: number; // g/ml
  creationDate?: string;
  
  // New detailed fields
  description?: string;
  brand?: string;
  unitTemplate?: string;
  purchasePrice?: number;
  taxId?: string;
  isTaxable?: boolean;
  lowestSellingPrice?: number;
  discountPercent?: number;
  hasExpiryDate?: boolean;
  trackInventory?: boolean;
  trackingType?: 'None' | 'Quantity';
  alertQuantity?: number;
  internalNotes?: string;
  tags?: string;
  status?: 'Active' | 'Inactive';
  supplierProductCode?: string;
  supplierId?: string;
  image?: string;
}

export interface InventoryItem {
  id: string;
  branchId: string;
  productId: string;
  quantity: number;
  minStock: number;
  lotNumber?: string;
  expiryDate?: string;
}

export type AdjustmentReason = 'Damaged Goods' | 'Stock Count Correction' | 'Initial Stock' | 'Return to Supplier' | 'Other';

export interface InventoryAdjustmentLog {
  id: string;
  date: string;
  branchId: string;
  productId: string;
  adjustedByUserId: string;
  oldQuantity: number;
  newQuantity: number;
  reason: AdjustmentReason;
  notes?: string;
}

export interface InventoryMovement {
  id: string | number;
  date: string;
  type: string;
  quantityChange: number;
  quantityAfter: number;
  relatedDoc?: string;
  user?: string;
  branchId: string;
}

export interface InventoryVoucher {
    id: string;
    date: string;
    status: 'تمت الموافقة';
    description: string;
    details: string;
    createdBy: string;
    branch: string;
    type: 'up' | 'down';
}

export interface InventoryRequisitionItem {
    productId: string;
    quantity: number;
}
export interface InventoryRequisition {
    id: string;
    date: string;
    type: 'Purchase' | 'Transfer';
    warehouseId: string;
    items: InventoryRequisitionItem[];
    notes?: string;
    attachments?: any[];
}


// HR Module Types
export type LeaveType = 'Annual' | 'Sick' | 'Emergency' | 'Unpaid';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
    id: string;
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: RequestStatus;
}

export interface AdvanceRequest {
    id: string;
    employeeId: string;
    amount: number;
    reason: string;
    requestDate: string;
    status: RequestStatus;
}

export type GeneralRequestType = 'Salary Certificate' | 'Experience Certificate' | 'Information Update' | 'Other';
export interface GeneralRequest {
    id: string;
    employeeId: string;
    type: GeneralRequestType | string;
    details: string;
    requestDate: string;
    status: RequestStatus;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent';

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
    lateMinutes?: number;
}

export interface SalaryPayment {
    id: string; // e.g., "empId-month-year"
    employeeId: string;
    month: number;
    year: number;
    basicSalary: number;
    allowances: number;
    grossSalary: number;
    deductions: {
        advances: number;
        lateness: number;
        absence: number;
        unpaidLeave: number;
        total: number;
    };
    netSalary: number;
    paidDate: string;
    journalEntries: JournalEntry[];
}

export interface JournalEntry {
    account: string;
    debit: number;
    credit: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  branchId?: string;
  projectId?: string;
  addedBy: string;
}

export interface WhatsappLog {
    id: string;
    customerId: string;
    date: string;
    message: string;
    status: 'Sent' | 'Delivered' | 'Read';
}

// Finance Module Types
export enum ExpenseCategory {
    Utilities = 'Utilities',
    Rent = 'Rent',
    Salaries = 'Salaries',
    MarketingBranding = 'Marketing & Branding',
    RawMaterials = 'Raw Materials',
    Packaging = 'Packaging',
    EcommerceFees = 'E-commerce Fees',
    LabSupplies = 'Lab Supplies',
    ShippingDelivery = 'Shipping & Delivery',
    GovernmentFees = 'Government Fees',
    Maintenance = 'Maintenance',
    Other = 'Other'
}

export interface Expense {
    id: string;
    date: string;
    branchId: string;
    category: ExpenseCategory;
    amount: number;
    description: string;
    paidFromAccountId: string;
}

export interface FinancialAccount {
    id: string;
    name: string;
    type: 'Bank' | 'Cash';
    branchId?: string;
    balance: number;
}

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  id: string; // Account code, e.g., "101-01"
  name: string;
  type: AccountType;
  children?: Account[];
}

export interface GeneralLedgerEntry {
  id: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  sourceType: 'Sale' | 'Purchase' | 'Expense' | 'Other';
  sourceId: string;
}

export interface JournalVoucherLine {
    id: number;
    accountId: string;
    debit: number;
    credit: number;
    description?: string;
}

export interface JournalVoucher {
    id: string;
    date: string;
    reference: string;
    lines: JournalVoucherLine[];
}

// POS
export interface POSSession {
  id: string;
  startTime: string;
  endTime?: string;
  status: 'Open' | 'Closed';
  openingBalance: number;
  closingBalance?: number;
  totalSalesValue: number;
  salesIds: string[];
  branchId: string;
}

// Manufacturing
export type ProductionTaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface Comment {
    id: number;
    userId: string;
    userName: string;
    timestamp: string;
    text: string;
}

export interface ProductionTask {
    id: string;
    name: string;
    productionOrderId: string;
    assignedToEmployeeId?: string;
    deadline?: string;
    status: ProductionTaskStatus;
    notes?: string;
    comments?: Comment[];
}

export interface FormulaLine {
    id: string;
    materialId: string;
    materialName: string;
    materialSku: string;
    kind: 'AROMA_OIL' | 'ETHANOL' | 'DI_WATER' | 'FIXATIVE' | 'COLOR' | 'ADDITIVE';
    percentage: number;
    density?: number;
}

export interface ProcessLoss {
    mixingLossPct: number;
    filtrationLossPct: number;
    fillingLossPct: number;
}

export interface QCCheck {
    appearance: string;
    clarity: 'Clear' | 'Slight Haze' | 'Hazy';
    odorMatch: 'Pass' | 'Borderline' | 'Fail';
    result: 'APPROVED' | 'REJECTED' | 'REWORK';
}

export interface PackagingItem {
    productId: string;
    name: string;
    qtyPerUnit: number;
}

export interface ManufacturingOrder {
    id: string;
    productName: string;
    manufacturingType: 'INTERNAL' | 'CONTRACT';
    responsibleEmployeeId?: string;
    concentration: 'EDT_15' | 'EDP_20' | 'EXTRAIT_30' | 'OIL_100';
    bottleSizeMl: number;
    unitsRequested: number;
    batchCode: string;
    branchId: string;
    manufacturingDate?: string;
    expiryDate?: string;
    dueAt?: string;
    formula: FormulaLine[];
    processLoss: ProcessLoss;
    macerationDays: number;
    chilling?: { hours: number; temperatureC: number };
    filtration?: { stages: number; micron: number };
    qc?: QCCheck;
    packagingItems: PackagingItem[];
    costs: {
        materials: number;
        labor: number;
        overhead: number;
        packaging: number;
        other: number;
        total: number;
        perMl: number;
        perBottle: number;
        suggestedRetail: number;
    };
    yield: {
        theoreticalMl: number;
        expectedMl: number;
        expectedUnits: number;
        actualMl?: number;
        actualUnits?: number;
        yieldPercentage?: number;
    };
    distribution?: { id: string; locationName: string; units: number }[];
    status: 'DRAFT' | 'IN_PROGRESS' | 'MACERATING' | 'QC' | 'PACKAGING' | 'DONE' | 'CLOSED';
}

// Legacy type for older components
export interface ProductionOrder_Legacy {
  id: number;
  productId: number;
  quantity: number;
  branchId: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  creationDate: string;
}


// Settings & Integrations
export interface EcommerceIntegrationSettings {
    isEnabled: boolean;
    apiUrl: string;
    apiKey: string;
    apiSecret: string;
    autoSyncCustomers: boolean;
    autoSyncSales: boolean;
    syncInterval: number;
}
export interface PaymentGatewaySettings {
    isEnabled: boolean;
    apiKey: string;
}
export interface WhatsAppSettings {
    isEnabled: boolean;
    apiKey: string;
    phoneNumberId: string;
}
export type WebhookEvent = 'sale.created' | 'customer.created' | 'inventory.low_stock' | 'purchase.created';
export interface Webhook {
    event: WebhookEvent;
    url: string;
    isEnabled: boolean;
}
export interface N8nSettings {
    isEnabled: boolean;
    webhooks: Webhook[];
}
export interface AISettings {
    isEnabled: boolean;
    provider: 'Gemini';
}
export interface IntegrationSettings {
    openCart: EcommerceIntegrationSettings;
    wooCommerce: EcommerceIntegrationSettings;
    myFatoorah: PaymentGatewaySettings;
    whatsapp: WhatsAppSettings;
    n8n: N8nSettings;
    ai: AISettings;
}

export interface PurchaseApprovalTier {
    id: number;
    minAmount: number;
    approverRole: Role;
}
export interface PurchaseSettings {
  defaultPaymentTermsDays: number;
  defaultShippingPreference: string;
  isApprovalWorkflowEnabled: boolean;
  approvalTiers: PurchaseApprovalTier[];
}


// Gemini / AI Service Types
export interface ChatbotDataContext {
    sales: Sale[];
    purchases: PurchaseInvoice[];
    products: Product[];
    inventory: InventoryItem[];
    customers: Customer[];
    employees: EmployeeData[];
    branches: Branch[];
    expenses: Expense[];
    suppliers: Supplier[];
}

export interface DailyBriefingContext {
    today: string;
    yesterdaySalesTotal: number;
    yesterdayInvoiceCount: number;
    topSellingProducts: { name: string; quantity: number; revenue: number; }[];
    lowStockItemsCount: number;
    criticalLowStockItems: { name: string; quantity: number; minStock: number; }[];
    pendingHRRequests: number;
    upcomingRenewals: { name: string; daysUntilExpiry: number }[];
}

export interface PurchaseOrderSuggestionContext {
    branchName: string;
    forecastDays: number;
    inventory: Array<{ 
        productId: string; 
        productName: string; 
        sku: string; 
        currentStock: number; 
        minStock: number; 
        salesVelocityPerDay: number; 
    }>;
}

export interface SuggestedPurchaseOrderItem {
    productId: string;
    productName: string;
    sku: string;
    currentStock: number;
    recommendedQuantity: number;
    reasoning: string;
}

export interface FormulaSuggestionContext {
    prompt: string;
    rawMaterials: Array<{
        id: string;
        name: string;
        sku: string;
        baseUnit: string;
        availableQuantity: number;
    }>;
}

export interface NewProductIdeaContext {
    prompt: string;
    rawMaterials: any[];
}

export interface NewProductIdeaResponse {
    productName: string;
    fragranceNotes: {
        top: string;
        middle: string;
        base: string;
    };
    formula: FormulaLine[];
}

// FIX: AuthContext moved from App.tsx to resolve circular dependency.
export const AuthContext = React.createContext<{ user: User | null; login: (role: Role) => void; logout: () => void; }>({ user: null, login: () => {}, logout: () => {} });
