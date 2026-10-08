import re

def mask_account_number(account_str: str) -> str:
    """
    Masks middle digits of account number for privacy compliance.
    E.g. 'HDFC Bank - 50100482910482' -> 'HDFC Bank - 50100****0482'
    """
    if not account_str:
        return ""
    
    # Check if there is a number of 8+ digits
    match = re.search(r'\b(\d{4})(\d{4,10})(\d{4})\b', account_str)
    if match:
        masked = f"{match.group(1)}****{match.group(3)}"
        return account_str.replace(match.group(0), masked)
    
    # Fallback masking
    if len(account_str) > 8:
        return f"{account_str[:4]}****{account_str[-4:]}"
    return account_str

def mask_phone_number(phone_str: str) -> str:
    """
    E.g. '+91 9823145678' -> '+91 98231 XXXXX'
    """
    if not phone_str:
        return ""
    if "XXXXX" in phone_str:
        return phone_str
    
    digits = re.sub(r'\D', '', phone_str)
    if len(digits) >= 10:
        prefix = phone_str[:-5]
        return f"{prefix}XXXXX"
    return phone_str
