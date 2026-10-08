def test_login_success(client):
    res = client.post("/api/auth/login", json={"username": "lea_officer", "password": "Officer@12345"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["role"] == "LEA_OFFICER"
    assert data["user"]["email"] == "lea@cyberpehra.gov.in"

def test_login_invalid_password(client):
    res = client.post("/api/auth/login", json={"username": "lea_officer", "password": "WrongPassword"})
    assert res.status_code == 401

def test_get_current_user_me(client):
    login_res = client.post("/api/auth/login", json={"username": "admin", "password": "Admin@12345"})
    token = login_res.json()["access_token"]
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["username"] == "admin"
    assert data["role"] == "ADMIN"
