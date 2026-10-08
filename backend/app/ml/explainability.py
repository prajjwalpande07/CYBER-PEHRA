from typing import List, Dict, Any

def compute_explainable_factors(features: Dict[str, Any], risk_score: float) -> List[Dict[str, Any]]:
    """
    Computes explainable factor attribution based on feature inputs and domain heuristics.
    Categorized into: mule, temporal, spatial, transactional, network.
    """
    factors = []
    amount = float(features.get("transaction_amount", 100000))
    hop_minutes = float(features.get("hop_minutes", 35))
    distance_km = float(features.get("distance_km", 1.8))
    mule_layer = int(features.get("mule_layer", 1))
    account_risk = float(features.get("account_risk", 80))
    atm_hits = int(features.get("atm_past_hits", 4))

    # 1. Mule Account Factor
    if mule_layer == 1:
        factors.append({
            "factor": "Layer-1 Direct Mule Conduits",
            "impact": min(35, max(22, round(account_risk * 0.35))),
            "description": "Suspected recipient account flagged as freshly activated primary mule node with high out-flow velocity.",
            "category": "mule",
        })
    else:
        factors.append({
            "factor": f"Layer-{mule_layer} Rapid Tranche Splitting",
            "impact": 20,
            "description": f"Funds dispersed across {mule_layer} intermediary hops to evade immediate single-account liens.",
            "category": "mule",
        })

    # 2. Temporal Factor
    if hop_minutes <= 60:
        factors.append({
            "factor": "Imminent Cash-Out Velocity Window",
            "impact": min(28, max(18, round((60 - hop_minutes) * 0.4 + 16))),
            "description": f"Elapsed time since fraudulent debit is under {int(hop_minutes)} minutes; peak withdrawal probability within 45-90 min window.",
            "category": "temporal",
        })
    else:
        factors.append({
            "factor": "Temporal Withdrawal Cadence",
            "impact": 15,
            "description": "Transaction executed during high-volume banking window matching syndicates' scheduled extraction runs.",
            "category": "temporal",
        })

    # 3. Spatial Factor
    if distance_km <= 5.0:
        factors.append({
            "factor": "High Geospatial Proximity to Extraction Cluster",
            "impact": min(25, max(16, round((5.0 - distance_km) * 3 + 14))),
            "description": f"ATM vestibule located within {distance_km:.1f} km radius of historical mule device geofence coordinates.",
            "category": "spatial",
        })
    else:
        factors.append({
            "factor": "Transit Hub ATM Node",
            "impact": 14,
            "description": "ATM located along inter-district transit route previously utilized for rapid cash extraction and cross-border exit.",
            "category": "spatial",
        })

    # 4. Transactional Factor
    if amount >= 500000:
        factors.append({
            "factor": "High-Value Liquidation Tranche",
            "impact": min(24, max(15, round((amount / 1000000) * 8 + 12))),
            "description": f"Debit amount of ₹{amount:,.0f} matches high-severity cybercrime extortion profiles.",
            "category": "transactional",
        })
    else:
        factors.append({
            "factor": "Micro-Tranche Smurfing Pattern",
            "impact": 16,
            "description": "Debit fragmented below automated RTGS/NEFT regulatory alerting thresholds.",
            "category": "transactional",
        })

    # 5. Network / ATM History Factor
    if atm_hits >= 3:
        factors.append({
            "factor": "Terminal Historical Hotspot Profiling",
            "impact": min(22, max(12, atm_hits * 3 + 6)),
            "description": f"ATM dispenser recorded {atm_hits} suspicious rapid debit sessions in past 30 days with low CCTV surveillance coverage.",
            "category": "network",
        })

    return factors
