from .strategy_expression_parser import parse_expression
from .strategy_matcher import match_rules

def scan_signal(df, expr: str):
    tokens = parse_expression(expr)
    rules, i = [], 0
    while i < len(tokens):
        ind, op, thr = tokens[i], tokens[i+1], tokens[i+2]
        rules.append((ind, op, float(thr)))
        i += 3
    return match_rules(df, rules)
