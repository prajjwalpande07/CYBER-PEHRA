def test_get_current_model(client):
    res = client.get("/api/models/current")
    assert res.status_code == 200
    data = res.json()
    assert "version" in data
    assert "accuracy" in data
    assert data["accuracy"] > 80.0

def test_retrain_model(client):
    res = client.post("/api/models/retrain")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUCCESS"
    assert "newVersion" in data or "new_version" in data
