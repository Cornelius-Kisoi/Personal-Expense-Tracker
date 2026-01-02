// 1. DOM Elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const currencySelect = document.getElementById('currency-select');
const progressFill = document.getElementById('progress-fill');
const percentText = document.getElementById('percent');
let idToDelete = null; // Temporary storage for the ID
const modalOverlay = document.getElementById('modal-overlay');
const confirmBtn = document.getElementById('modal-confirm');
const cancelBtn = document.getElementById('modal-cancel');

// 2. State Management
let currencySymbol = 'KES';
let transactions = [];
try {
    const stored = localStorage.getItem('transactions');
    transactions = stored ? JSON.parse(stored) : [];
} catch (err) {
    console.error('Failed to parse transactions from localStorage, clearing stored value.', err);
    transactions = [];
    localStorage.removeItem('transactions');
} 

// 3. Actions
function addTransaction(e) {
    e.preventDefault();
    const type = document.getElementById('type').value;

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a description and amount');
        return;
    }

    // Force the number to be positive (Income) or negative (Expense)
    const finalAmount = type === 'expense' ? -Math.abs(+amount.value) : Math.abs(+amount.value);

    const transaction = {
        id: Date.now(),
        text: text.value,
        amount: finalAmount
    };

    transactions.push(transaction);
    init();
    form.reset(); // Clears all inputs at once
}

// 1. Intercept the delete click
function removeTransaction(id) {
    // This ONLY opens the modal
    idToDelete = id;
    modalOverlay.style.display = 'flex';
}

// 2. If user confirms
confirmBtn.addEventListener('click', () => {
    transactions = transactions.filter(t => t.id !== idToDelete);
    init();
    closeModal();
});

// 3. If user cancels
cancelBtn.addEventListener('click', closeModal);

function closeModal() {
    modalOverlay.style.display = 'none';
    idToDelete = null;
}

function editTransaction(id) {
    // Find the specific transaction
    const transactionToEdit = transactions.find(t => t.id === id);
    if (!transactionToEdit) {
        console.warn('Attempted to edit a non-existent transaction:', id);
        return;
    }

    // Fill the form fields with the existing data
    text.value = transactionToEdit.text;
    amount.value = Math.abs(transactionToEdit.amount);
    document.getElementById('type').value = transactionToEdit.amount < 0 ? 'expense' : 'income';

    // REMOVE from array directly (skips the Modal confirmation)
    transactions = transactions.filter(t => t.id !== id);
    
    // Refresh the UI so the item "disappears" while you edit it
    init();
    
    // Put the cursor in the description box for the user
    text.focus();
} 

// 4. Calculations & UI Updates
function updateValues() {
    // Ensure all amounts are numeric
    const amounts = transactions.map(t => Number(t.amount) || 0);

    const totalNum = amounts.reduce((acc, item) => acc + item, 0);
    const incomeNum = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
    const expenseNum = Math.abs(amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0));

    const total = totalNum.toFixed(2);
    const income = incomeNum.toFixed(2);
    const expense = expenseNum.toFixed(2);

    // Update Text
    balance.innerText = `${currencySymbol} ${total}`;
    money_plus.innerText = `+${currencySymbol} ${income}`;
    money_minus.innerText = `-${currencySymbol} ${expense}`;

    // Feature: Progress Bar Logic (use numeric values)
    const percentage = incomeNum > 0 ? (expenseNum / incomeNum) * 100 : 0;
    progressFill.style.width = `${Math.min(percentage, 100)}%`;
    progressFill.style.backgroundColor = percentage > 80 ? '#e74c3c' : '#2ecc71';
    percentText.innerText = `${Math.round(percentage)}%`;
} 

function init() {
    // 1. Clear the current list to prevent duplicates
    list.innerHTML = '';

    // 2. Loop through the transactions array
    transactions.forEach(t => {
        const sign = t.amount < 0 ? '-' : '+';
        const item = document.createElement('li');

        // Add the color class (red for minus, green for plus)
        item.classList.add(t.amount < 0 ? 'minus' : 'plus');

        // Description (safe text node)
        const desc = document.createElement('span');
        desc.className = 'desc';
        desc.textContent = t.text;
        item.appendChild(desc);

        // Amount span
        const amountSpan = document.createElement('span');
        amountSpan.textContent = `${sign}${currencySymbol} ${Math.abs(t.amount).toFixed(2)}`;
        item.appendChild(amountSpan);

        // Action buttons container
        const actions = document.createElement('div');
        actions.className = 'action-btns';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '✎';
        editBtn.addEventListener('click', () => editTransaction(t.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'x';
        deleteBtn.addEventListener('click', () => removeTransaction(t.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        item.appendChild(actions);

        list.appendChild(item);
    });

    // 3. Update the dashboard numbers and progress bar
    updateValues();

    // 4. Save the updated state to LocalStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 5. Advanced Features
function exportToCSV() {
    if (transactions.length === 0) {
        alert("No data to export!");
        return;
    }

    const escapeCSV = (val) => {
        if (val == null) return '""';
        const s = String(val).replace(/"/g, '""');
        return `"${s}"`;
    };

    let rows = ['"Title","Amount","Type"'];
    transactions.forEach(t => {
        const type = t.amount > 0 ? 'Income' : 'Expense';
        rows.push(`${escapeCSV(t.text)},${escapeCSV(t.amount.toFixed(2))},${escapeCSV(type)}`);
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'WealthWatch_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 6. Event Listeners
form.addEventListener('submit', addTransaction);

currencySelect.addEventListener('change', (e) => {
    currencySymbol = e.target.value;
    init();
});

// Initialize
init();