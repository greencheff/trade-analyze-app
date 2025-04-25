import re

def parse_expression(expr: str):
    return re.findall(r"[A-Za-z0-9_]+|<|>|=|&&|\|\|", expr)
