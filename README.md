# 🌐 Live Demo

🚀 **Explore CYBER PEHRA Live**

Experience our AI-powered Predictive Cybercrime Intelligence System through the live demo.

🔗 **[Visit CYBER PEHRA Website]([[https://cyber-pehra.vercel.app/](https://cyber-pehra.vercel.app/)**

> Explore how CYBER PEHRA aims to help identify high-risk locations, analyze potential cybercrime fund withdrawal patterns, and support proactive investigation.


# 🛡️ CYBER PEHRA

### Predictive Cybercrime Intelligence System

> **From helping victims after cybercrime happens to helping authorities act before the next incident.**

CYBER PEHRA is an AI-powered cybercrime intelligence platform designed to help law enforcement agencies and financial institutions identify high-risk locations and potential cybercrime fund withdrawal patterns.

---

## 🚨 Problem

After a cybercrime complaint is registered, authorities need to quickly understand:

- Where the stolen money may be withdrawn
- Which ATM or bank location may be at risk
- Which transactions look suspicious
- How different accounts and transactions may be connected
- Where preventive action should be taken

Traditional investigation methods can take time. CYBER PEHRA aims to provide **predictive intelligence and risk-based insights** to support faster action.

---

# 💡 Story Behind CYBER PEHRA

CYBER PEHRA did not start as an SIH project.

The idea started from a real cyber-fraud incident involving an elderly woman.

My mother works at a bank, and an elderly woman once approached the bank after money was deducted from her account. She was confused and did not understand how the fraud happened or what she should do next.

She was told that the transaction had happened using an OTP, but she still did not understand how the fraud was carried out.

She then approached the police and was directed to the cybercrime office to register a complaint.

Even after registering the complaint, she had questions:

- What happens next?
- When will the money be recovered?
- How can she track the complaint?
- Who will investigate the case?

This made us think:

> **Can technology help a cybercrime victim understand and track the process?**

That was the beginning of CYBER PEHRA.

---

# 🔄 Evolution of the Idea

### Initial Idea

```text
AI Guidance
      ↓
Complaint Assistance
      ↓
Complaint Tracking
      ↓
Victim Support
```
The project initially focused on helping cybercrime victims.

Later, while participating in different competitions and hackathons, we understood that solving the problem only from the victim side was not enough.

Authorities also need better intelligence to act quickly.

So the project evolved into:
```text
USER-BASED
     ↓
ADMIN-BASED
     ↓
USER + ADMIN
```
Our long-term vision is to connect both sides on a single platform.

---
# 🏆 Our Journey
CYBER PEHRA evolved through multiple competitions and learning experiences.

### MGM College of Engineering

Our first idea pitch was presented at MGM College of Engineering.
Although we did not receive the recognition we expected, we continued improving the idea.

### P. R. Pote College Hackathon

We participated in a hackathon where 800+ teams submitted PPTs.

Our PPT was ranked #1 at the submission stage.

### SGGS College Hackathon

We participated again and did not win, but gained valuable experience in:
- Problem understanding
- Solution design
- Technical implementation
- Presentation
- Practical project development
  
### GDG Hackathon

At the GDG Hackathon held at MGM College of Engineering, Nanded, our team cleared the rounds and won the hackathon.

This was an important milestone for CYBER PEHRA.

### Smart India Hackathon

Later, we explored Smart India Hackathon problem statements and found a problem related to cybercrime investigation and law enforcement.

This changed the direction of the project.

Instead of only helping victims, CYBER PEHRA evolved to help authorities predict, identify and respond to potential cybercrime fund withdrawal locations.

---
# 🛡️ CYBER PEHRA for Law Enforcement
The current administrative concept follows:

```text
Cybercrime Complaint
        ↓
Data Analysis
        ↓
Predictive Analysis
        ↓
Risk Scoring
        ↓
GIS Risk Hotspots
        ↓
Alerts
        ↓
Preventive Action
```
The goal is to help authorities move from:

Reactive Investigation → Predictive Intelligence

---

# 🚀 Key Features

#### 1. Predictive Location Intelligence
Identify potentially high-risk locations where cybercrime funds may be withdrawn.

#### 3. GIS Risk Heatmap
Visualize risk levels geographically using an interactive map.

#### 5. Mule Network Analysis
Analyze relationships between accounts, transactions and suspicious entities.

#### 7. Risk-Based Alerts
Generate alerts based on suspicious activity and risk levels. 

#### 8. Explainable Risk Analysis
Provide understandable factors behind a risk prediction.

#### 9. Investigation Dashboard
Provide investigators with important case and intelligence information in one place.

#### 10. Feedback-Driven Intelligence
Investigator feedback can be used to improve future intelligence.

#### 11. Role-Based Access
Different users can access features according to their roles.

#### 12. Real-Time Communication
WebSocket-based communication can support real-time updates and alerts.

#### 13. Search & Investigation Support
Search and filter information to support investigation workflows.

---

# 🤖 AI / ML
#### CYBER PEHRA uses machine learning and data analysis to support predictive cybercrime intelligence.
Current prototype includes:
- Machine Learning based risk prediction
- Synthetic dataset generation for development
- Risk analysis
- Explainability support
- Graph/network analysis
- Predictive location analysis
#### Future improvements may include:
- Advanced spatio-temporal models
- Graph Neural Networks
- Time-series forecasting
- Advanced anomaly detection
- NLP-based investigation assistance
- RAG-based intelligence systems
- MLOps
- Federated Learning

---
# 🏗️ System Architecture
  ```text
  Cybercrime Data
      ↓
Data Processing
      ↓
AI / ML Intelligence
      ↓
Risk Prediction
      ↓
Location Intelligence
      ↓
Alerts & Investigation
      ↓
Law Enforcement Dashboard

```
# 💻 Technology Stack
#### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite
- Interactive Maps
- Data Visualization
#### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- Uvicorn
#### AI / ML
- Python
- Pandas
- NumPy
- Scikit-learn
- Machine Learning
- Graph Analysis
#### Database
- SQL Database
- SQLAlchemy
- Alembic
#### Real-Time
- WebSockets
#### Security
- Authentication
- Role-Based Access
- Secure Password Handling
- Environment Variables
#### Deployment
- Docker
- Docker Compose

---
# 📁 Project Structure
  ```text
CYBER-PEHRA/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── ml/
│   │   └── main.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── package.json
└── README.md
```
---

# ⚙️ Installation
### Clone Repository
 ```text
git clone https://github.com/prajjwalpande07/CYBER-PEHRA.git
cd CYBER-PEHRA
```
### 🔧 Backend Setup
```text
cd backend
```
#### Create virtual environment:
```text
python -m venv venv
```
#### Activate it on Windows:
```text
venv\Scripts\activate
```
#### Install dependencies:
```text
pip install -r requirements.txt
```
### Create .env file using .env.example.
#### Run backend:
```text
uvicorn app.main:app --reload
```
#### Backend will run on:
```text
http://localhost:8000
```
### 🎨 Frontend Setup
#### Open another terminal:
```text
cd frontend
```
#### Install dependencies:
```text
npm install
```
#### Run frontend:
```text
npm run dev
```
#### Frontend will run on:
```text
http://localhost:5173
```
---
# 🔐 Security & Privacy
### CYBER PEHRA is designed with security and privacy in mind.
#### Important practices include:
- Authentication
- Role-based access
- Secure password handling
- Environment-based configuration
- No sensitive credentials stored in Git
- Database files excluded from version control
- .env files excluded using .gitignore
---
# 📊 Development Data
#### The project can use synthetic/demo data during development and testing.
#### No real citizen financial information should be committed to this repository.
---
# 🎯 Objectives
### CYBER PEHRA aims to:
- Predict potential cybercrime fund withdrawal locations
- Identify high-risk areas
- Support cybercrime investigations
- Connect transaction and location intelligence
- Provide explainable risk information
- Generate actionable alerts
- Help authorities take preventive action
---
# 🔮 Future Vision
#### The long-term vision is to create a complete cybercrime intelligence ecosystem.
### USER SIDE
```text
AI Guidance
     ↓
Complaint Assistance
     ↓
Complaint Tracking
     ↓
Victim Support
```
### ADMIN SIDE
```text
Complaint Data
     ↓
Predictive Analytics
     ↓
Risk Hotspots
     ↓
Real-Time Alerts
     ↓
Preventive Action
```
### FUTURE
```text
USER SIDE
    +
ADMIN SIDE
    ↓
ONE CONNECTED PLATFORM
```
---
# 🌍 Impact
#### CYBER PEHRA can help move cybercrime response from:
```text
Reactive
   ↓
Investigative
   ↓
Predictive
   ↓
Preventive
```
The goal is to help authorities act faster and make better data-driven decisions.
---
# 🏆 Achievements
- 🥇 GDG Hackathon Winner
- 🏆 Hackathon participation and project development journey
- 🥇 Ranked #1 at the PPT submission stage among 800+ submissions
- 🚀 Smart India Hackathon journey
- 💡 Multiple iterations from idea to working prototype
---
# 👥 Team
#### CYBER PEHRA was developed a focus on:
- Cybersecurity
- Artificial Intelligence
- Machine Learning
- Web Development
- Data Analysis
- Geospatial Intelligence
---
# 🤝 Contributing
#### Contributions, ideas and suggestions are welcome.
#### If you want to contribute:
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Create a Pull Request
---
# 📄 License
This project is developed for educational, research and innovation purposes.

---
# ❤️ Our Vision
We started by solving the victim's problem, evolved to solve the authority's problem, and aim to connect both in the future.

 From helping victims after cybercrime happens to helping authorities act before the next incident.
