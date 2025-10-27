
import React, { useState, useContext } from 'react';
// FIX: Corrected the import path for AuthContext.
import { AuthContext } from '../types';
import { Expense, Branch, FinancialAccount, ExpenseCategory } from '../types';
import ExpenseModal from '../components/ExpenseModal';
import { useToasts } from '../components/Toast';
import { PencilIcon } from '../components/Icon';

interface ExpensesProps {
    expenses: Expense[];
    onSave: (expense: Expense) => void;
    branches: Branch[];
    financialAccounts: FinancialAccount[];
}

const categoryTranslations: { [key in ExpenseCategory]?: string } = {
    [ExpenseCategory.Utilities]: 'خدمات ومرافق',
    [ExpenseCategory.Rent]: 'إيجار',
    [ExpenseCategory.Salaries]: 'رواتب',
    [ExpenseCategory.MarketingBranding]: 'تسويق وعلامة تجارية',
    [ExpenseCategory.RawMaterials]: 'مواد خام',
    [ExpenseCategory.Packaging]: 'مواد تغليف',
    [ExpenseCategory.EcommerceFees]: 'رسوم التجارة الإلكترونية',
    [ExpenseCategory.LabSupplies]: 'مستلزمات المختبر',
    [ExpenseCategory.ShippingDelivery]: 'شحن وتوصيل',
    [ExpenseCategory.GovernmentFees]: 'رسوم حكومية',
    [ExpenseCategory.Maintenance]: 'صيانة',
    [ExpenseCategory.Other]: 'أخرى'
};

const Expenses: React.FC<ExpensesProps> = ({ expenses, onSave, branches, financialAccounts }) => {
    const { user } = useContext(AuthContext); // Assuming it needs user for permissions, good practice
    const { addToast } = useToasts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    const handleSave = (expense: Expense) => {
        onSave(expense);
        setIsModalOpen(false);
        setSelectedExpense(null);
        addToast(`Expense ${expense.id ? 'updated' : 'added'} successfully!`, 'success');
    };

    const handleAddNew = () => {
        setSelectedExpense({} as Expense);
        setIsModalOpen(true);
    };
    
    const handleEdit = (expense: Expense) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="glass-pane" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>إدارة المصروفات</h3>
                    <button onClick={handleAddNew} className="btn btn-primary">
                        إضافة مصروف جديد
                    </button>
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>الفرع</th>
                                <th>الفئة</th>
                                <th>الوصف</th>
                                <th>المبلغ (د.ك)</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(e => (
                                <tr key={e.id}>
                                    <td>{e.date}</td>
                                    <td>{branches.find(b => b.id === e.branchId)?.name}</td>
                                    <td>{categoryTranslations[e.category] || e.category}</td>
                                    <td>{e.description}</td>
                                    <td style={{ color: '#ef4444', fontWeight: '600' }}>{e.amount.toLocaleString()} د.ك</td>
                                    <td>
                                        <button onClick={() => handleEdit(e)} style={{color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'}}><PencilIcon style={{width:'20px', height:'20px'}}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <ExpenseModal 
                    expense={selectedExpense}
                    onClose={() => { setIsModalOpen(false); setSelectedExpense(null); }}
                    onSave={handleSave}
                    branches={branches}
                    financialAccounts={financialAccounts}
                />
            )}
        </>
    );
};

export default Expenses;
