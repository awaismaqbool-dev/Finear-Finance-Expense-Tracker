# 🚀 Finear – Personal Finance & Wealth Management Dashboard

![Project Banner](/ScreenShorts/home.png)
>
**Finear** is a comprehensive full-stack financial management application designed to help users track income, manage expenses, and set smart savings goals. Built with the **MERN Stack** (MongoDB, Express, React, Node.js), it features real-time data visualization, secure authentication, and automated financial reporting.

This project demonstrates scalable architecture, complex state management, and the integration of data analysis tools to provide actionable financial insights.

##  Key Features

##  Landing Page & Web Interface
Beyond the dashboard, the project includes a fully responsive multi-page marketing website:
- **Home Page:** Engaging UI with product value propositions and call-to-action (CTA).
- **About Us:** Narrative on the mission of Finear and its commitment to financial literacy.
- **Contact Us:** Functional UI for user inquiries (Backend integration for email notifications coming soon).  

###  Interactive Dashboard
- **Real-time Visualization:** Dynamic Bar Charts powered by **Recharts** to analyze income vs. expense trends.
- **Financial Summary:** Instant calculation of total balance, total income, and total expenses.

###  Transaction Management
- **Smart Categorization:** Track earnings and spending with detailed categories.
- **Excel Export:** Integrated **ExcelJS** to generate and download professional `.xlsx` financial reports for offline analysis.
- **History Tracking:** View recent transactions with date-wise sorting.

###  Goal-Based Savings System
- **Target Tracking:** Create custom savings goals (e.g., "Buy iPhone", "Car Fund").
- **Priority Logic:** Set priorities (High, Medium, Low) for better financial planning.
- **Progress Visuals:** Dynamic progress bars that calculate completion percentage based on real-time saved amounts.

###  Security & Architecture
- **JWT Authentication:** Secure user sessions with JSON Web Tokens.
- **Protected Routes:** Middleware to prevent unauthorized access to financial data.
- **RESTful API:** Structured backend endpoints for scalable data fetching.

---

##  Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (Modern, Responsive UI)
- **Visualization:** Recharts (Data Charts)
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Reporting:** ExcelJS (File Generation)
- **Security:** Bcrypt.js (Password Hashing), CORS, Dotenv

---

##  Screenshots
| Dashboard Overview | Goal Tracking |
|:---:|:---:|
| ![Dashboard](/ScreenShorts/dashbaord.png) | ![Goals](/ScreenShorts/goal.png) |

| Add Transaction | Excel Export |
|:---:|:---:|
| ![Add_Expense](/ScreenShorts/add_expense.png) | ![Transaction](/ScreenShorts/expense_graph.png) | ![Export](https://via.placeholder.com/500x300?text=Excel+Report) |

---

##  Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URL)

### 1. Clone the Repository
-git clone https://github.com/awaismaqbool-dev/Finear-Finance-Expense-Tracker.git
## 2. Backend Setup 
cd backend
npm install

-Create a .env file in the server folder and add:
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development  # NODE_ENV=production
SMTP_USER=your_SMTP_user_id
SMTP_PASS=your_SMTP_Password
SENDER_EMAIL=your_user_id

-Run the server:
npm start

## 3. Frontend Setup
cd frontend
cd finear
npm install
npm run dev
```bash
API Endpoints (Brief)

Method	Endpoint	Description	
POST	/auth/login	User Login & Token Generation	
POST	/auth/register	New User Registration	
GET	/dashboard/get-transactions	Fetch Income/Expense/Savings	
POST	/dashboard/add-transaction	Add new financial record	
POST	/dashboard/create-goal	Initialize a new savings goal	
GET	/dashboard/export-sheet	Download Excel report (Blob)	


👨‍💻 Author
Awais Full-Stack Developer | MERN Stack Enthusiast




