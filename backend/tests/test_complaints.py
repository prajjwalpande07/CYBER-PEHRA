def test_get_complaints(client):
    res = client.get("/api/complaints")
    assert res.status_code == 200
    complaints = res.json()
    assert isinstance(complaints, list)
    assert len(complaints) >= 5
    # Verify camelCase serialization matching frontend
    first = complaints[0]
    assert "ncrpRef" in first or "ncrp_ref" in first
    assert "transactionAmount" in first or "transaction_amount" in first
    assert "riskScore" in first or "risk_score" in first

def test_create_complaint_and_trigger_workflow(client):
    payload = {
        "victimName": "Suresh Raina",
        "contactNumber": "+91 98200 11223",
        "complaintType": "Digital Arrest",
        "transactionId": "TXN-TEST-998811",
        "transactionAmount": 1850000,
        "transactionTime": "2026-09-23T10:00:00+05:30",
        "bank": "State Bank of India",
        "accountInfo": "SBI Savings - 40291048291",
        "suspectedAccount": "HDFC Bank - 50100482910482",
        "transactionLocation": "Pune, Maharashtra",
        "state": "Maharashtra",
        "district": "Pune",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "complaintDescription": "Impersonation of Telecom & CBI demanding instant RTGS liquidation under digital arrest threat.",
    }
    res = client.post("/api/complaints", json=payload)
    assert res.status_code == 201
    created = res.json()
    cid = created.get("id")
    assert cid.startswith("CP-2026-")
    assert created.get("riskScore", 0) > 0
    assert created.get("status") in ("Predicted", "Pending Review")
