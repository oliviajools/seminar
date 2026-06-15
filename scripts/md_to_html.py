#!/usr/bin/env python3
"""Convert a Markdown file to a styled, print-ready HTML document."""
import sys
import markdown

def main():
    src, dst = sys.argv[1], sys.argv[2]
    with open(src, "r", encoding="utf-8") as f:
        text = f.read()

    body = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "toc", "sane_lists"],
    )

    html = f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>NeuroLab Framework</title>
<style>
  @page {{ size: A4; margin: 22mm 18mm; }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
    color: #111;
    line-height: 1.55;
    font-size: 11pt;
    max-width: 800px;
    margin: 0 auto;
  }}
  h1 {{
    font-size: 26pt; font-weight: 300; letter-spacing: -0.5px;
    border-bottom: 2px solid #111; padding-bottom: 10px; margin-top: 0;
  }}
  h2 {{
    font-size: 16pt; font-weight: 600; margin-top: 28px;
    border-bottom: 1px solid #ddd; padding-bottom: 6px;
    page-break-after: avoid;
  }}
  h3 {{ font-size: 12.5pt; font-weight: 600; margin-top: 18px; page-break-after: avoid; }}
  blockquote {{
    border-left: 3px solid #111; margin: 14px 0; padding: 4px 16px;
    color: #444; font-style: italic; background: #fafafa;
  }}
  table {{
    border-collapse: collapse; width: 100%; margin: 14px 0;
    font-size: 9.5pt; page-break-inside: avoid;
  }}
  th, td {{ border: 1px solid #ccc; padding: 6px 9px; text-align: left; vertical-align: top; }}
  th {{ background: #111; color: #fff; font-weight: 600; }}
  tr:nth-child(even) td {{ background: #f6f6f6; }}
  code {{
    font-family: "SF Mono", Menlo, monospace; font-size: 9pt;
    background: #f0f0f0; padding: 1px 5px; border-radius: 3px;
  }}
  pre {{
    background: #111; color: #eee; padding: 14px; border-radius: 6px;
    overflow-x: auto; font-size: 8.5pt; line-height: 1.4;
    page-break-inside: avoid;
  }}
  pre code {{ background: none; color: #eee; padding: 0; }}
  hr {{ border: none; border-top: 1px solid #ddd; margin: 26px 0; }}
  a {{ color: #111; text-decoration: none; }}
  em {{ color: #555; }}
  ul, ol {{ padding-left: 22px; }}
  li {{ margin: 3px 0; }}
</style>
</head>
<body>
{body}
</body>
</html>
"""
    with open(dst, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Wrote {dst}")

if __name__ == "__main__":
    main()
