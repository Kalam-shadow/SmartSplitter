# Smart Expense Splitter

A lightweight, intuitive web application for managing shared expenses among friends, roommates, or teams.

## Features

### Core Features ✅

- **Group Management**: Create groups and add/remove members
- **Expense Tracking**: Add expenses with flexible splitting options
  - Equal split among participants
  - Custom split with manual amounts per user
- **Balance Calculation**: Automatically calculates who owes whom
- **Debt Simplification**: Converts complex balances into minimal transactions
- **Smart Categorization**: Automatically categorizes expenses (Food, Travel, Rent, etc.)
- **Local Storage**: All data persists in browser's localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 (Functional Components + Hooks)
- **State Management**: React Context API
- **Styling**: Custom CSS with modern design
- **Storage**: Browser localStorage (no backend required)
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── GroupForm.jsx       # Create new group form
│   ├── GroupSelector.jsx   # Switch between groups
│   ├── MemberList.jsx      # Manage group members
│   ├── ExpenseForm.jsx     # Add new expense form
│   └── BalanceList.jsx     # Display balances and settlements
├── pages/                   # Page components
│   ├── GroupPage.jsx       # Group management page
│   ├── ExpensePage.jsx     # Add expense page
│   └── SummaryPage.jsx     # Balance summary page
├── context/                 # React Context
│   └── ExpenseContext.jsx  # Global state management
├── utils/                   # Utility functions
│   ├── balanceCalculator.js    # Balance & categorization logic
│   ├── debtSimplifier.js       # Debt simplification algorithm
│   └── storageManager.js       # localStorage operations
├── styles/                  # CSS styles
│   ├── index.css           # Global styles
│   ├── components.css      # Component styles
│   └── pages.css           # Page styles
├── App.jsx                 # Main app component
└── index.js                # React entry point
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SplitWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

## How to Use

### 1. Create a Group
- Go to the "Groups" tab
- Enter a group name and click "Create Group"
- The group is created and automatically selected

### 2. Add Members
- In the "Manage Members" section, enter member names
- Click "Add" for each member
- Members can be removed using the "Remove" button

### 3. Add Expenses
- Go to the "Expenses" tab
- Select the group (if not already selected)
- Fill in expense details:
  - **Description**: What the expense was for
  - **Amount**: How much was spent
  - **Paid By**: Who paid for it
  - **Split Type**: Equal or Custom split
  - **Participants**: Who shares this expense
- Click "Add Expense"

### 4. View Balances
- The "Expenses" page shows real-time balance updates
- Go to "Summary" to see:
  - Total spent in the group
  - Individual member balances
  - Simplified settlements (who pays whom)
  - Spending breakdown by category
  - All expenses in the group

## Core Algorithms

### Balance Calculation
```
For each expense:
  - Track amount paid by each member
  - Calculate what each participant owes
    - Equal split: amount ÷ number of participants
    - Custom split: use provided amounts

Net balance per member = Total Paid - Total Owes
```

### Debt Simplification
Converts individual debts into minimal transactions using a greedy algorithm:
- Identifies creditors (positive balance) and debtors (negative balance)
- Matches them to settle debts with minimum number of transactions
- Example: Instead of A→B, A→C, B→C, simplifies to A→B, A→C

### Expense Categorization
Automatically categorizes based on keywords:
- **Food**: lunch, dinner, restaurant, pizza, burger, etc.
- **Travel**: train, bus, taxi, flight, uber, etc.
- **Rent**: accommodation, hotel, house, etc.
- **Entertainment**: movie, show, game, etc.
- **Utilities**: electricity, water, etc.
- **Other**: everything else

## Data Persistence

All data is automatically saved to browser's localStorage:
- Groups
- Members
- Expenses
- Current group selection

Data persists even after closing the browser.

## Features Breakdown

### Mandatory Features ✅
- ✅ Group Management (create, view, delete)
- ✅ Add/remove members
- ✅ Add expenses with equal or custom split
- ✅ Balance calculation
- ✅ Debt simplification
- ✅ Three-page UI (Groups, Expenses, Summary)
- ✅ React Context for state management
- ✅ localStorage persistence
- ✅ Clean, modular code

### Bonus Features ✅
- ✅ Smart expense categorization
- ✅ Spending breakdown by category
- ✅ Responsive design
- ✅ Modern, intuitive UI
- ✅ Real-time balance updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Vercel auto-detects it's a Create React App
5. Deploy with one click

### Deploy to Netlify

1. Build the project: `npm run build`
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the `build` folder
4. Or connect your GitHub repo for auto-deployment

## Code Quality

- ✅ Modular component architecture
- ✅ Separation of concerns (components, utils, context)
- ✅ Reusable utility functions
- ✅ No business logic in components
- ✅ Consistent naming conventions
- ✅ Clear code comments
- ✅ Responsive CSS
- ✅ Error handling

## Future Enhancements

- User authentication
- Cloud backup (Firebase, MongoDB)
- Payment integration
- Expense recurring templates
- Advanced analytics
- Mobile app (React Native)
- Dark mode
- Multi-currency support

## License

MIT License - feel free to use this project as you wish.

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React**
