# CYBER PEHRA — Backend Architecture & Service Documentation

National Predictive Intelligence & Multi-Agency Cybercrime Intervention Grid.

## 1. Technologies
- **Python**: 3.12+ (tested on Python 3.14)
- **Framework**: FastAPI (async routes, OpenAPI 3.1, Swagger UI)
- **Database**: PostgreSQL (with automatic zero-friction SQLite fallback for local developer machines)
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Machine Learning**: Prototype Random Forest & Decision Tree Pipeline (Predictive Analytics Engine)
- **Graph Analytics**: NetworkX (Mule account hop analysis & degree centrality)
- **Real-Time Streaming**: WebSockets (`/ws/alerts`)
- **Security**: JWT Authentication (HS256) & bcrypt password hashing
- **Audit Ledger**: Cryptographic SHA-256 chained blocks

---

## 2. Directory Structure
```
backend/
├── app/
│   ├── main.py                          # FastAPI application, CORS, lifespan, WebSocket router
│   ├── core/
│   │   ├── config.py                    # App configuration, env variables, secrets
│   │   ├── database.py                  # SQLAlchemy sessionmaker, Engine, Base
│   │   ├── security.py                  # JWT encode/decode, bcrypt password hashing, RBAC
│   │   └── websocket_manager.py         # Broadcast manager for /ws/alerts
│   ├── models/                          # SQLAlchemy ORM Models
│   │   ├── user.py                      # Users & roles (ADMIN, LEA, BANK, I4C)
│   │   ├── complaint.py                 # Complaints ledger
│   │   ├── location.py                  # ATMs, Bank Branches, CSP Kiosks & Risk Factors
│   │   ├── alert.py                     # Intervention Alerts & channels
│   │   ├── investigation.py             # Investigation cases & Sec 102 CrPC actions
│   │   ├── evidence.py                  # Uploaded evidence file records with SHA-256 hashes
│   │   ├── feedback.py                  # Officer field feedback records
│   │   ├── audit.py                     # Blockchain-style cryptographic chained blocks
│   │   ├── model_meta.py                # Model versions & evaluation metrics
│   │   ├── data_fusion.py               # Data fusion sources & sync metrics
│   │   └── mule.py                      # Mule nodes and transaction edges
│   ├── schemas/                         # Pydantic v2 schemas matching Frontend types
│   ├── api/routes/                      # Clean REST Route Controllers
│   ├── services/                        # Business Logic (prediction, alert, audit, mule)
│   ├── ml/                              # Prototype ML pipeline & explainability
│   └── utils/                           # Masking and file storage utilities
├── seed/
│   └── seed_data.py                     # High-fidelity realistic Indian demo data
├── tests/                               # Comprehensive Pytest test suite
├── uploads/                             # Safe directory for uploaded evidence
├── alembic/                             # Alembic database migrations
├── .env
├── .env.example
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 3. Demo Credentials
| Role | Email / Username | Password | Operational Description |
|---|---|---|---|
| **ADMIN** | `admin@cyberpehra.gov.in` / `admin` | `Admin@12345` | Chief Data Scientist / Platform Administrator |
| **LEA_OFFICER** | `lea@cyberpehra.gov.in` / `lea_officer` | `Officer@12345` | Investigating Officer / Quick Response Team |
| **BANK_OFFICER** | `bank@cyberpehra.gov.in` / `bank_officer` | `Bank@12345` | Bank Nodal Officer / Section 102 CrPC Desk |
| **I4C_OFFICER** | `i4c@cyberpehra.gov.in` / `i4c_analyst` | `I4c@12345` | I4C National Coordinator (MHA) |

---

## 4. API Endpoints
- **Authentication**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/refresh`
- **Dashboard**:
  - `GET /api/dashboard/overview`
- **Complaints**:
  - `POST /api/complaints`
  - `GET /api/complaints`
  - `GET /api/complaints/{complaint_id}`
  - `PUT /api/complaints/{complaint_id}`
  - `PATCH /api/complaints/{complaint_id}/status`
- **Predictive Analytics**:
  - `POST /api/predictions/run/{complaint_id}`
  - `GET /api/predictions/{prediction_id}`
  - `GET /api/predictions/complaint/{complaint_id}`
  - `GET /api/predictions/{prediction_id}/explanation`
- **Risk Heatmap**:
  - `GET /api/heatmap` (GeoJSON `FeatureCollection`)
- **Withdrawal Locations**:
  - `GET /api/locations`
  - `GET /api/locations/predicted`
  - `GET /api/locations/high-risk`
  - `GET /api/locations/{location_id}`
- **Mule Network Analysis**:
  - `GET /api/mule-network`
  - `GET /api/mule-network/{account_id}`
  - `GET /api/mule-network/{account_id}/connections`
- **Alert System**:
  - `GET /api/alerts`
  - `POST /api/alerts`
  - `GET /api/alerts/{alert_id}`
  - `PATCH /api/alerts/{alert_id}/acknowledge`
  - `PATCH /api/alerts/{alert_id}/status`
  - `GET /api/alerts/live`
- **Real-time WebSocket**:
  - `ws://localhost:8000/ws/alerts`
- **Investigations**:
  - `GET /api/investigations`
  - `POST /api/investigations`
  - `GET /api/investigations/{case_id}`
  - `PUT /api/investigations/{case_id}`
  - `POST /api/investigations/{case_id}/dispatch`
  - `POST /api/investigations/{case_id}/freeze-account`
  - `POST /api/investigations/{case_id}/seizure`
  - `POST /api/investigations/{case_id}/complete`
  - `POST /api/investigations/{case_id}/evidence` (multipart file upload)
  - `GET /api/investigations/{case_id}/evidence`
- **Bank Portal**:
  - `GET /api/banks/alerts`
  - `GET /api/banks/suspicious-transactions`
  - `GET /api/banks/freeze-requests`
  - `PATCH /api/banks/freeze-requests/{id}`
- **I4C Coordination**:
  - `GET /api/i4c/overview`
  - `GET /api/i4c/cross-jurisdiction`
  - `GET /api/i4c/state-summary`
- **Officer Feedback**:
  - `POST /api/feedback`
  - `GET /api/feedback`
  - `GET /api/feedback/statistics`
- **Model Monitoring & Retraining**:
  - `GET /api/models`
  - `GET /api/models/current`
  - `GET /api/models/metrics`
  - `POST /api/models/retrain`
- **Data Fusion**:
  - `GET /api/data-sources`
  - `POST /api/data-fusion/run`
  - `GET /api/data-fusion/status`
- **Audit Ledger**:
  - `GET /api/audit`
  - `GET /api/audit/verify`
- **Global Search**:
  - `GET /api/search?q=`

---

## 5. Running the Backend
```bash
cd E:\CyberPehra\backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```
- Swagger UI Documentation: `http://localhost:8000/docs`
- WebSocket Server: `ws://localhost:8000/ws/alerts`
