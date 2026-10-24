# SupportFlow - Customer Support Ticket Dashboard

CS-301 FSWD - Assignment 01

## Description
A responsive SaaS-style Customer Support Ticket Dashboard built with HTML, CSS, Bootstrap 5, and modern JavaScript ES6 modules.

## Features
- Responsive Bootstrap layout
- Ticket creation and JavaScript validation
- Ticket reset without page reload
- Ticket display and status summary
- Add, edit, and delete tickets
- Search by customer or issue
- Filter by status and priority
- ES6 class, arrow functions, destructuring, spread syntax, modules
- Array methods such as map, filter, find, and reduce
- localStorage persistence

## Project Structure
```text
customer-support-dashboard/
├── index.html
├── css/style.css
├── js/app.js
├── js/ticket.js
├── js/storage.js
├── report/Assignment_Report.docx
└── README.md
```

## Running the Project
Because the application uses ES6 modules, run it with a local server instead of opening `index.html` directly with `file://`.

### Option 1: VS Code Live Server
1. Open the project folder in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

### Option 2: Python
From the project directory:
```bash
python -m http.server 5500
```
Then open:
```text
http://localhost:5500
```

## Technologies
- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES6+
- Browser localStorage

## GitHub
```bash
git init
git add .
git commit -m "Complete Customer Support Dashboard assignment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/customer-support-dashboard.git
git push -u origin main
```
