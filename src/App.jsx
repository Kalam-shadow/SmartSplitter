import React from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { Dashboard } from './pages/Dashboard';
import './styles/index.css';
import './styles/dashboard.css';
import './styles/sections.css';

function AppContent() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">💰 Smart Expense Splitter</h1>
          <p className="app-subtitle">Track shared expenses effortlessly</p>
        </div>
      </header>

      <main className="app-main">
        <Dashboard />
      </main>

      <footer className="app-footer">
        <p>Smart Expense Splitter © 2026 | Data saved locally</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
