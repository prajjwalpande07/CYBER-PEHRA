def test_get_heatmap_geojson(client):
    res = client.get("/api/heatmap")
    assert res.status_code == 200
    geojson = res.json()
    assert geojson["type"] == "FeatureCollection"
    assert "features" in geojson
    features = geojson["features"]
    assert len(features) >= 5

    first_feat = features[0]
    assert first_feat["type"] == "Feature"
    assert first_feat["geometry"]["type"] == "Point"
    assert len(first_feat["geometry"]["coordinates"]) == 2  # [lon, lat]
    props = first_feat["properties"]
    assert "location" in props or "name" in props
    assert "riskScore" in props or "risk_score" in props
    assert "recommended_action" in props

def test_heatmap_filtering_by_state(client):
    res = client.get("/api/heatmap?state=Maharashtra")
    assert res.status_code == 200
    geojson = res.json()
    for feat in geojson["features"]:
        assert feat["properties"]["state"] == "Maharashtra"
