# 💰 WealthWatch – Personal Expense Tracker

WealthWatch is a browser-based personal finance tracker built using **vanilla JavaScript**, **HTML**, and **CSS**.  
It allows users to track income and expenses, visualize spending progress, and export financial data.

---

## 📌 Features

- Add income and expense transactions
- Edit existing transactions
- Delete transactions with confirmation modal
- Persistent storage using LocalStorage
- Real-time balance, income & expense updates
- Expense-to-income progress bar
- Currency selection support
- Export transactions to CSV

---

## 🧱 Project Structure

```
index.html
script.js
style.css
```

---

## 📄 Files Overview

### HTML
- index.html

### CSS
- style.css

### JavaScript
- script.js

---

## 🧠 Data Model

Transactions are stored as objects:

```js
{
  id: Number,
  text: String,
  amount: Number
}
```

Data is persisted using the **LocalStorage API**.

---

## 📊 UI Logic

- Balance is calculated from all transactions
- Income = sum of positive values
- Expense = sum of negative values
- Progress bar visualizes expense percentage
- Bar turns red when expenses exceed 80% of income

---

## 🗑️ Delete Confirmation

Transactions are deleted only after user confirmation through a modal dialog to prevent accidental data loss.

---

## 📤 CSV Export

Transactions can be exported as a CSV file:

```
Title,Amount,Type
```

File name:
`WealthWatch_Export.csv`

---

## 🚀 How to Run

1. Open `index.html` in a browser  
2. OR use **Live Server** in VS Code

---

## 🛠 Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Browser LocalStorage API

---

## 🔮 Future Improvements

- Charts & analytics
- Category-based tracking
- Monthly reports
- Backend API integration
- Authentication

---

## 📄 License

Open-source — free to use for learning and personal projects.
