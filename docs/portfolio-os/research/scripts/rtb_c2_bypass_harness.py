# Red-team panel B harness: tests whether strings bypass the C2 figure-token validator.
# Usage: python3 -I rtb_c2_bypass_harness.py <path to contracts_checks.py>
# "PASS" means the string got through the validator (a bypass). The target after hardening is zero PASS lines.
import importlib.util, sys, unicodedata
spec = importlib.util.spec_from_file_location("cc", sys.argv[1])
cc = importlib.util.module_from_spec(spec); spec.loader.exec_module(cc)
allow = {"fig_7a1", "fig_7a2", "fig_7a3", "date_7a"}
tok = ("tok", "{{fig:fig_7a3|as=ledger.balance|fmt=money}}")
cases = {
 "plural 'millions'":            [("text","You hold millions in cash: "), tok],
 "ordinal 'fifth'":              [("text","This is the fifth month in a row your balance fell: "), tok],
 "month 'May' (omitted)":        [("text","As of May your balance was "), tok],
 "abbrev 'Oct'":                 [("text","As of end-Oct your balance was "), tok],
 "relative 'last month'":        [("text","Last month you spent "), tok],
 "zero-width space in 'twelve'": [("text","Expect roughly twe​lve percent.")],
 "soft hyphen in 'million'":     [("text","About a mil­lion arrived.")],
 "Cyrillic o in 'one'":          [("text","Only оne account failed to reconcile.")],
 "Roman numeral U+216B":         [("text","Expect Ⅻ percent.")],
 "circled digit U+246B":         [("text","Expect ⑫ percent.")],
 "superscript two":              [("text","Return was x² last year.")],
 "ASCII Roman 'XII'":            [("text","Expect XII percent.")],
 "Spanish 'doce'":               [("text","Expect doce por ciento.")],
 "Yoruba 'mejila'":              [("text","Expect mejila percent.")],
 "'twice'/'k' suffix":           [("text","Spending was twice the usual; about fifty-k.")],
 "quantifier 'All'":             [("text","All of your accounts reconcile. Balance "), tok],
 "free direction word":          [("text","Your balance fell to "), tok],
 "as= omitted on fig":           [("text","Your drawdown was "), ("tok","{{fig:fig_7a1|fmt=pct1}}")],
 "dash compound 'twenty-five'":  [("text","About twenty-five percent.")],
 "fraction glyph U+215E":        [("text","About ⅞ of spending.")],
}
for k, segs in cases.items():
    verdict = cc.validate_and_render(segs, allow)
    print(f"{k:32s} -> {verdict[0]}" + ("" if verdict[0]=="PASS" else f"  {verdict[1]}"))
for ch in "Ⅻ⑫²⅞​­":
    print(hex(ord(ch)), unicodedata.category(ch), unicodedata.name(ch, "?"))
