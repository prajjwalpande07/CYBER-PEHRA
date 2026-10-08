def test_get_audit_trail(client):
    res = client.get("/api/audit")
    assert res.status_code == 200
    blocks = res.json()
    assert len(blocks) >= 5
    first = blocks[0]
    assert "hash" in first
    assert "previousHash" in first or "previous_hash" in first
    assert "blockId" in first or "block_id" in first

def test_verify_audit_chain(client):
    res = client.get("/api/audit/verify")
    assert res.status_code == 200
    data = res.json()
    assert data["isValid"] is True or data["is_valid"] is True
    assert data["totalBlocks"] >= 5 or data["total_blocks"] >= 5
