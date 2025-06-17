# MERN Stack Assignment - Admin & Agent Management System.

## Objective
This project is a MERN stack application for managing admin users, agents, and task distribution. The key features include:
- Admin login authentication
- Adding and managing agents
- Uploading and distributing lists among agents

---

## Features and Functionality

### 1. Admin Login
- A login form with:
  - **Email**
  - **Password**
- Authentication using **JWT (JSON Web Tokens)**
- Redirects users to the dashboard upon successful login
- Displays an error message on incorrect credentials

### 2. Add Agents
- Admin can create agent accounts
- Required fields for agents:
  - **Name**
  - **Email**
  - **Mobile Number (with country code)**
  - **Password**

### 3. Upload CSV and Distribute Lists
- Allows admins to upload a CSV file containing:
  - **First Name** (Text)
  - **Phone Number** (Number)
  - **Notes** (Text)
- Supports file formats: **.csv, .xlsx, .xls**
- Validates the CSV format before processing
- Distributes tasks equally among **5 agents**
- If items are not divisible by 5, remaining items are assigned sequentially
- Saves distributed lists to **MongoDB**
- Displays assigned lists for each agent on the frontend

---

## Technology Stack

### Frontend:
- **React.js **
- **Tailwind CSS** (for UI styling)

### Backend:
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose** (for database management)
- **JSON Web Tokens (JWT)** (for authentication)
- **Multer** (for file handling)

---

## Project Setup

### 1. Clone the Repository
```sh
git clone https://github.com/muthalakshya/Admin-Agent-Management-System.git
cd your-project-folder
```

### 2. Setup the Backend
```sh
cd backend
npm install
nodemon server.js  # or node server.js
```

### 3. Setup the Frontend
```sh
cd frontend
npm install
npm run dev
```

### 4. Environment Variables (.env)
Create a `.env` file in both **backend** and **frontend**, and add:

**Backend:**
```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
```

**Frontend:**
```
REACT_APP_API_URL=http://localhost:5000
```

---

## Folder Structure

### Frontend (`/admin`)
```
📂 src
 ┣ 📂 components
 ┃ ┣ 📜 Dashboard.jsx
 ┃ ┣ 📜 Login.jsx
 ┃ ┣ 📜 Navbar.jsx
 ┃ ┣ 📜 Sidebar.jsx
 ┃
 ┣ 📂 pages
 ┃ ┣ 📜 AddAgent.jsx
 ┃ ┣ 📜 DistributeLists.jsx
 ┃ ┣ 📜 ViewAgents.jsx
 ┃
 ┣ 📜 App.jsx
 ┣ 📜 index.css
 ┣ 📜 main.jsx
```

### Backend (`/backend`)
```
📂 backend
 ┣ 📂 config
 ┃ ┣ 📜 mongodb.js
 ┃
 ┣ 📂 controllers
 ┃ ┣ 📜 agentsController.js
 ┃ ┣ 📜 listController.js
 ┃ ┣ 📜 userController.js
 ┃
 ┣ 📂 models
 ┃ ┣ 📜 agentModel.js
 ┃ ┣ 📜 listModel.js
 ┃ ┣ 📜 userModel.js
 ┃
 ┣ 📂 routes
 ┃ ┣ 📜 agentsRoute.js
 ┃ ┣ 📜 listRouter.js
 ┃ ┣ 📜 useRoute.js
 ┃
 ┣ 📜 server.js
 ┣ 📜 package.json
 ┣ 📜 .env
 ┣ 📜 vercel.json
 ┣ 📜 .gitignore
```

---

## How to Use
1. **Login as Admin**  
   - Use predefined credentials or register a new admin in the database.
2. **Add Agents**  
   - Navigate to "Add Agents" and create new agents.
3. **Upload CSV & Distribute Tasks**  
   - Upload a CSV file with user data.
   - The system automatically assigns tasks among agents.
4. **View Assigned Lists**  
   - Agents can see their assigned tasks on the dashboard.

---

## Deployment
The project is deployed using **Vercel** for the frontend and **Render**/any hosting service for the backend.

**To deploy on Vercel:**  
```sh
vercel deploy
```

---

## Evaluation Criteria
- **Functionality**: Does the app meet the requirements?  
- **Code Quality**: Is the code structured and readable?  
- **Error Handling**: Are validations and errors handled properly?  
- **UI/UX**: Is the interface clean and user-friendly?  
- **Execution**: Is the app easy to set up and run?  

---

## Demo Video
📌 [Click here to view the demo](#) *(Google Drive/Youtube link of the demo video)*  

---

### Contributors
- **Lakshya Mutha** (Developer)  


---

**Good luck! 🚀**

