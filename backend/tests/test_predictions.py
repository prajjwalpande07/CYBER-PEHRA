def test_run_prediction_for_complaint(client):
    # Use existing seeded complaint
    res = client.post("/api/predictions/run/CP-2026-8941")
    assert res.status_code == 200
    data = res.json()
    assert "riskScore" in data or "risk_score" in data
    score = data.get("riskScore") or data.get("risk_score")
    assert score >= 30
    assert "location" in data
    assert "factors" in data
    factors = data["factors"]
    assert len(factors) >= 3

def test_get_prediction_explanation(client):
    res = client.get("/api/predictions/LOC-MH-02/explanation")
    assert res.status_code == 200
    data = res.json()
    assert "factors" in data
    assert len(data["factors"]) > 0
