def test_get_mule_network(client):
    res = client.get("/api/mule-network")
    assert res.status_code == 200
    data = res.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) >= 6
    assert len(data["edges"]) >= 5

def test_get_account_connections(client):
    res = client.get("/api/mule-network/MN-02/connections")
    assert res.status_code == 200
    data = res.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) > 0
