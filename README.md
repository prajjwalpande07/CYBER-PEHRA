# 🛡️ Cyber Phera — Predictive Cybercrime Intelligence System

> **Predicting where cybercrime money will be withdrawn before it happens.**

## 📌 Overview

**Cyber Phera** is a predictive cybersecurity and financial-crime intelligence platform designed to help **Law Enforcement Agencies (LEAs), banks, financial institutions, and I4C** proactively identify locations where cybercrime funds are likely to be withdrawn.

Instead of waiting for a cybercrime complaint to be investigated after money has already been withdrawn, Cyber Phera uses **AI/ML, geospatial analysis, transaction patterns, graph analytics, and real-time alerts** to forecast potential cash-withdrawal hotspots in advance.

The system transforms cybercrime response from a **reactive approach into a proactive, data-driven approach**.

---

## 🚨 Problem Statement

The National Cybercrime Reporting Portal (NCRP) receives thousands of cybercrime complaints every day. In financial cyber fraud cases, stolen money can move through multiple **mule accounts** and reach ATMs or bank branches before investigators can intervene.

The official problem statement calls for a predictive analytics framework that can **forecast likely cash-withdrawal locations in advance and generate actionable intelligence for timely cybercrime intervention**.

### Current Challenges

* Cybercrime response is largely reactive.
* Fraud money can move through multiple mule accounts.
* Cash may be withdrawn before intervention.
* LEAs and financial institutions need faster intelligence sharing.
* Different jurisdictions can operate with limited visibility across cases.
* Increasing complaint volumes make manual analysis difficult.

---

# 💡 Our Solution — Cyber Phera

Cyber Phera combines historical cybercrime data, transaction-flow information, withdrawal-location data, and geospatial information to identify patterns and predict potential withdrawal hotspots.

### Core Concept

```text
Cybercrime Complaint
        ↓
Transaction Analysis
        ↓
Mule Network Detection
        ↓
Spatio-Temporal Risk Analysis
        ↓
Hotspot Prediction
        ↓
Risk Heatmap
        ↓
Real-Time Alert
        ↓
LEA / Bank Action
        ↓
Officer Feedback
        ↓
Model Retraining
```

The system therefore creates a **closed-loop intelligence cycle**:

**Prediction → Action → Outcome → Learning → Improved Prediction**

---

# 🎯 Objectives

* Predict potential cybercrime cash-withdrawal locations.
* Identify high-risk ATM and bank-branch clusters.
* Detect relationships between mule accounts and transactions.
* Provide real-time actionable intelligence.
* Help LEAs respond during the critical early period after a fraud.
* Enable banks to identify and respond to suspicious activity faster.
* Improve coordination across jurisdictions.
* Maintain an auditable record of alerts and actions.
* Continuously improve predictions using investigator feedback.

---

# ✨ Key Features

## 1. 🔮 Predictive Withdrawal Heatmap

Forecasts potential withdrawal hotspots **2–6 hours ahead** at ATM/branch-cluster level rather than simply displaying historical crime locations.

## 2. 🕸️ Mule Network Graph

Visualizes relationships between accounts, complaints, transactions, and withdrawal locations.

This helps investigators identify potentially connected mule networks across different jurisdictions.

## 3. 🚨 Golden Hour Alert

Identifies high-risk activity during the critical early period after a fraud complaint, helping stakeholders prioritize rapid intervention.

## 4. 🧠 Explainable AI Risk Cards

Each predicted hotspot provides an explanation for its risk score.

Example:

```text
Risk Level: HIGH

Reasons:
• 3 linked complaints
• Location associated with previous mule activity
• Transaction pattern matches previous cash-out behavior
• High-risk geographic cluster
```

## 5. 🌐 Cross-Jurisdiction Case Stitching

Identifies relationships between complaints from different cities or states using shared transaction and account patterns.

## 6. 🏦 Bank Co-Pilot

Provides banks and financial institutions with risk information through APIs to support faster identification of suspicious accounts.

## 7. 📢 Real-Time Alerts

Alerts can be delivered to relevant stakeholders through:

* Dashboard
* API
* SMS
* Email
* Push notifications

## 8. 🗣️ Multilingual Investigator Assistant

Enables LEA officers to query the system using natural language, including questions such as:

```text
"Show today's high-risk hotspots in my district."
```

## 9. 🔄 Feedback-Driven Learning

Investigators can classify alerts as:

```text
True Positive
False Positive
```

The feedback can then be used for future model retraining.

## 10. ⛓️ Blockchain Audit Trail

Alerts, actions, and relevant events can be recorded using a permissioned blockchain audit layer to provide an immutable audit trail.

## 11. 📊 Risk Score API

Provides risk scores to authorized banking and financial applications through secure APIs.

## 12. 🎮 Simulation / War-Gaming Mode

Allows authorized users to simulate different fraud scenarios and analyze possible resource requirements.

---

# 🏗️ System Architecture

Cyber Phera follows a four-layer architecture.

```text
┌─────────────────────────────────────────────┐
│              DATA INGESTION                 │
│                                             │
│ NCRP • CFCFRMS • Transactions • ATM Data   │
│ Geospatial Data • Historical Data           │
└───────────────────┬─────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          PREDICTIVE ANALYTICS ENGINE        │
│                                             │
│ Graph Analytics • ML • Anomaly Detection   │
│ Spatio-Temporal Prediction                 │
└───────────────────┬─────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          INTELLIGENCE DASHBOARD             │
│                                             │
│ GIS Heatmap • Risk Scores • Risk Cards     │
│ Mule Network • Case Intelligence            │
└───────────────────┬─────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│       ALERT & COORDINATION LAYER            │
│                                             │
│ LEA • Banks • I4C • SMS • Email • API      │
└───────────────────┬─────────────────────────┘
                    ↓
             Officer Feedback
                    ↓
             Model Retraining
```

---

# 🤖 AI / ML Components

Cyber Phera uses multiple analytical techniques.

| Component                | Technology / Technique                |
| ------------------------ | ------------------------------------- |
| Hotspot Prediction       | ST-GNN / LSTM + Geospatial Clustering |
| Mule Network Detection   | Graph Analytics                       |
| Community Detection      | Louvain / Label Propagation           |
| Anomaly Detection        | Isolation Forest / Autoencoder        |
| Explainability           | SHAP / LIME                           |
| Time-Series Forecasting  | Prophet / Temporal Models             |
| Geospatial Indexing      | H3 / PostGIS                          |
| Complaint Classification | Multilingual NLP                      |
| Investigator Assistant   | RAG + LLM                             |
| Continuous Learning      | Feedback-based MLOps                  |

The proposed solution specifically describes spatio-temporal forecasting, graph-based mule-network detection, anomaly scoring, and explainability.

---

# 🗺️ Risk Heatmap

The dashboard visualizes:

* 🔴 High-risk locations
* 🟠 Medium-risk locations
* 🟢 Low-risk locations
* ATM/branch locations
* Predicted withdrawal windows
* Crime categories
* Geographic clusters
* Historical activity

Users can drill down by:

```text
Time
↓
State
↓
District
↓
Location
↓
ATM / Branch
↓
Risk Score
↓
Reason for Prediction
```

---

# 👮 Law Enforcement Interface

Authorized investigators can access:

### Dashboard

* Current alerts
* Predicted hotspots
* Risk levels
* Geographic intelligence

### Investigation

* Complaint details
* Transaction relationships
* Mule-network visualization
* Linked cases

### Intelligence

* Risk explanations
* Historical patterns
* Predicted withdrawal windows

### Action

* Alert banks
* Dispatch teams
* Record investigation outcomes
* Provide model feedback

The problem statement specifically identifies a secure LEA interface for alerts, intelligence reports, and evidence documentation as a key deliverable.

---

# 🔔 Alert System

Cyber Phera can generate alerts when a predicted location crosses a defined risk threshold.

```text
Risk Score
    ↓
Threshold Check
    ↓
High Risk?
   / \
 Yes  No
  ↓    ↓
Alert  Monitor
  ↓
LEA + Bank + I4C
```

Supported notification mechanisms include:

* 📱 SMS
* 📧 Email
* 🔗 API
* 🖥️ Dashboard notification

---

# 🔗 Blockchain Audit Layer

Cyber Phera incorporates blockchain specifically for **auditability**.

A permissioned blockchain can maintain records of:

```text
Alert Created
      ↓
Alert Viewed
      ↓
Action Taken
      ↓
Freeze / Advisory Request
      ↓
Investigation Outcome
```

The proposed architecture identifies **Hyperledger Fabric** as the permissioned blockchain layer for government-oriented use.

---

# 🗄️ Database Architecture

### PostgreSQL + PostGIS

Used for structured and geospatial data.

Main entities:

```text
Complaints
Transactions
Withdrawal Locations
Alerts
Officer Feedback
```

### Neo4j

Used for relationship and network analysis.

```text
Account
   ↓
Transaction
   ↓
Account
   ↓
Withdrawal Location
   ↓
Complaint
```

Sensitive account information should use **hashed/tokenized references**, with identity resolution restricted to authorized systems.

---

# 🔌 API Endpoints

Proposed APIs include:

```http
GET /predict/hotspots
```

Returns predicted geographic risk scores.

```http
POST /alerts/subscribe
```

Registers LEA/bank alert subscriptions.

```http
POST /case/link
```

Links potentially related cases across jurisdictions.

```http
GET /audit/trail/{alertId}
```

Retrieves the audit trail for an alert.

```http
POST /genai/query
```

Allows authorized users to query the investigation assistant.

---

# 🛠️ Technology Stack

### Frontend

* React.js
* Tailwind CSS
* Mapbox GL / Leaflet
* Recharts

### Backend

* Python
* FastAPI
* REST APIs

### AI / ML

* Python
* PyTorch
* TensorFlow
* Scikit-learn
* PyTorch Geometric
* Prophet

### Databases

* PostgreSQL
* PostGIS
* Neo4j
* Redis
* Elasticsearch

### Real-Time Processing

* Apache Kafka
* Apache Flink

### Blockchain

* Hyperledger Fabric

### GenAI

* Llama / Mistral
* LangChain
* RAG

### DevOps

* Docker
* Kubernetes
* Prometheus
* Grafana

The proposed technology stack in the solution blueprint includes React, FastAPI/Node.js, Python ML frameworks, Neo4j, PostgreSQL/PostGIS, Kafka/Flink, Redis, Elasticsearch, Hyperledger Fabric, and containerized deployment.

---

# 📂 Project Structure

```text
Cyber-Phera/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── ml/
│   │   └── main.py
│   ├── requirements.txt
│   └── ...
│
├── ml/
│   ├── datasets/
│   ├── preprocessing/
│   ├── models/
│   └── training/
│
├── blockchain/
│   ├── contracts/
│   └── network/
│
├── docs/
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/cyber-phera.git
cd cyber-phera
```

## 2. Backend Setup

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend will normally run at:

```text
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The frontend URL will normally be:

```text
http://localhost:5173
```

---

# 🧪 Demo Workflow

Cyber Phera can be demonstrated using synthetic data:

```text
1. Submit simulated cybercrime complaint
              ↓
2. Transaction data enters system
              ↓
3. Mule network is analyzed
              ↓
4. ML model calculates risk
              ↓
5. Predicted hotspots appear
              ↓
6. Investigator opens risk card
              ↓
7. Alert sent to bank / LEA
              ↓
8. Investigator records outcome
              ↓
9. Feedback enters ML pipeline
              ↓
10. Audit record is generated
```

The proposed demo flow follows this sequence: simulated complaint → real-time risk calculation → hotspot visualization → explainable risk card → alert → mule-network graph → investigator feedback → audit trail.

---

# 📊 Data Sources

For development and demonstration, the proposed solution identifies:

* Synthetic fraud transaction datasets
* PaySim
* Credit Card Fraud Detection datasets
* ATM/bank-branch location data
* Population-density data
* OpenStreetMap
* Public cybercrime/fraud statistics

Actual government datasets should only be used when appropriate authorization and access are available.

---

# 🔐 Security & Privacy

Cyber Phera is designed with security and privacy considerations including:

* Role-Based Access Control (RBAC)
* OAuth2 authentication
* Tokenized/hashed account references
* Restricted identity resolution
* Secure APIs
* Permissioned blockchain audit
* Data localization for sensitive government data
* On-premise / sovereign-cloud deployment for sensitive workloads

---

# 📈 Impact

Cyber Phera aims to support:

### ⚡ Faster Response

Provide intelligence before potential cash withdrawal events.

### 💰 Better Fund Recovery Opportunities

Help banks and LEAs act faster on suspicious financial activity.

### 👮 Improved Law-Enforcement Coordination

Enable intelligence sharing across jurisdictions.

### 🧠 Data-Driven Investigation

Use transaction, geographic, and network patterns to support investigations.

### 🔄 Continuous Improvement

Use investigator feedback to improve future predictions.

The problem statement specifically describes proactive intervention, faster fund blocking, real-time intelligence sharing, and improved coordination between LEAs and financial institutions.

---

# 🚀 Future Scope

Future development can include:

* Real-time UPI/NPCI fraud signals
* Cross-border mule-network detection
* Predictive victim warnings
* Federated learning across banks
* National financial-crime early-warning capabilities
* Advanced multilingual AI assistants
* More sophisticated spatio-temporal models
* Integration with additional authorized financial intelligence sources

These areas are included in the proposed solution's future-scope roadmap.

---

# 🏛️ Project Context

| Field           | Details                                                    |
| --------------- | ---------------------------------------------------------- |
| Organization    | Ministry of Home Affairs                                   |
| Department      | Indian Cyber Crime Coordination Centre (I4C), CIS Division |
| Category        | Software                                                   |
| Theme           | Blockchain & Cybersecurity                                 |
| Project         | Cyber Phera                                                |
| Core Technology | AI/ML + GIS + Graph Analytics + Blockchain                 |

The original problem statement identifies the Ministry of Home Affairs and I4C/CIS Division under the **Blockchain & Cybersecurity** theme.

---

# 👥 Target Stakeholders

* 👮 Law Enforcement Agencies
* 🏦 Banks
* 💳 Financial Institutions
* 🏛️ I4C
* 🛡️ Cybercrime Investigation Teams
* 🏢 Government Security Organizations

---

# 🤝 Contributing

Contributions are welcome.

```bash
git checkout -b feature/new-feature
```

Make your changes and commit:

```bash
git add .
git commit -m "Add new feature"
```

Push your branch:

```bash
git push origin feature/new-feature
```

Then create a Pull Request.

---

# 📜 License

This project is developed as a cybersecurity and predictive analytics solution for educational, research, and prototype purposes.

Deployment with real government, banking, financial, or law-enforcement data requires appropriate authorization, security controls, and compliance procedures.

---

# 👨‍💻 Cyber Phera

### 🛡️ Predict. Alert. Act.

**Cyber Phera** transforms cybercrime response from:

```text
REACTIVE
Complaint → Investigation → Action
```

into:

```text
PROACTIVE
Complaint → Prediction → Alert → Action → Feedback → Learning
```

> **Turning cybercrime data into actionable intelligence before the money disappears.**
