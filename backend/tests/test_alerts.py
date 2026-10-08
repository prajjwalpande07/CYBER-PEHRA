def test_get_alerts(client):
    res = client.get("/api/alerts")
    assert res.status_code == 200
    alerts = res.json()
    assert len(alerts) >= 4
    first = alerts[0]
    assert "severity" in first
    assert "locationName" in first or "location_name" in first

def test_acknowledge_alert(client):
    res = client.patch("/api/alerts/ALT-9041/acknowledge")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "Acknowledged"

def test_post_alert(client):
    payload = {
        "title": "TEST: Imminent Cashout at Test ATM",
        "type": "Imminent Withdrawal",
        "locationId": "LOC-MH-01",
        "locationName": "HDFC Bank ATM Kiosk - Shivaji Nagar",
        "state": "Maharashtra",
        "district": "Pune",
        "riskScore": 91.0,
        "severity": "CRITICAL",
        "amountAtRisk": 500000.0,
        "recipient": "Law Enforcement Agencies",
        "channel": "SMS + Dashboard",
    }
    res = client.post("/api/alerts", json=payload)
    assert res.status_code == 201
    assert res.json()["title"] == payload["title"]
