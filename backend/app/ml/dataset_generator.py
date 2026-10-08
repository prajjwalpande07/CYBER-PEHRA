import numpy as np
from typing import Tuple, Dict, Any

FEATURE_NAMES = [
    "transaction_amount",
    "hop_minutes",
    "distance_km",
    "mule_layer",
    "hour_of_day",
    "account_risk",
    "atm_past_hits",
    "is_csp",
]

def generate_synthetic_cybercrime_data(n_samples: int = 1500, random_state: int = 42) -> Tuple[np.ndarray, np.ndarray]:
    """
    Generates synthetic demonstration training dataset for the Prototype ML Model.
    Returns: (X: np.ndarray, y: np.ndarray)
    """
    rng = np.random.RandomState(random_state)

    # 1. Transaction Amount (₹)
    amounts = rng.exponential(scale=350000, size=n_samples) + 20000
    amounts = np.clip(amounts, 10000, 5000000)

    # 2. Velocity / Hop Minutes since initial debit
    hop_minutes = rng.gamma(shape=2, scale=30, size=n_samples) + 5
    hop_minutes = np.clip(hop_minutes, 4, 360)

    # 3. Distance to candidate withdrawal point (km)
    distance_km = rng.exponential(scale=4.5, size=n_samples) + 0.2
    distance_km = np.clip(distance_km, 0.1, 50.0)

    # 4. Mule network layer (1, 2, 3)
    mule_layers = rng.choice([1, 2, 3], size=n_samples, p=[0.55, 0.35, 0.10])

    # 5. Hour of day (0-23)
    hours = rng.choice(range(24), size=n_samples)

    # 6. Suspected Account Risk Rating (0 - 100)
    account_risk = rng.normal(loc=70, scale=15, size=n_samples)
    account_risk = np.clip(account_risk, 20, 100)

    # 7. Candidate ATM Historical Extraction Count (past 30 days)
    atm_past_hits = rng.poisson(lam=6, size=n_samples)

    # 8. CSP / Kiosk Flag (0 = Standard ATM, 1 = CSP Agent)
    is_csp = rng.choice([0, 1], size=n_samples, p=[0.75, 0.25])

    # Target label: 1 = Imminent Cash-Out Risk (High/Critical), 0 = Low Risk / Diverted
    logits = (
        0.0000025 * amounts
        - 0.015 * hop_minutes
        - 0.12 * distance_km
        + 0.6 * (3 - mule_layers)
        + 0.04 * account_risk
        + 0.15 * atm_past_hits
        + 0.4 * is_csp
        - 2.8
    )
    probs = 1 / (1 + np.exp(-logits))
    labels = (probs > 0.48).astype(int)

    X = np.column_stack([
        amounts,
        hop_minutes,
        distance_km,
        mule_layers,
        hours,
        account_risk,
        atm_past_hits,
        is_csp,
    ])

    return X, labels
