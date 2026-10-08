def test_get_investigations(client):
    res = client.get("/api/investigations")
    assert res.status_code == 200
    invs = res.json()
    assert len(invs) >= 3
    first = invs[0]
    assert "complaintTitle" in first or "complaint_title" in first
    assert "assignedOfficer" in first or "assigned_officer" in first

def test_dispatch_patrol(client):
    res = client.post("/api/investigations/INV-7731/dispatch", json={"locationId": "LOC-MH-01"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "Team Dispatched"

def test_freeze_account(client):
    res = client.post(
        "/api/investigations/INV-7731/freeze-account",
        json={"accountNumber": "50100482910482", "amountToFreeze": 250000}
    )
    assert res.status_code == 200
    data = res.json()
    assert "Frozen" in data["accountFreezeStatus"]
