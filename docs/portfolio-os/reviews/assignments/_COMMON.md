# Common instructions for every reviewer (Stage 1b/3)

1. Read `/home/user/Terminal-/docs/portfolio-os/00_CONTEXT_BRIEF.md` and `/home/user/Terminal-/docs/portfolio-os/reviews/REVIEW_STANDARD.md` first.
2. You did not write the document under review. Your job is to refute, find errors, over-claims and gaps. Agreement is not validation.
3. Before starting, check whether your memo file already exists (a previous attempt may have been interrupted). If it does, `cat` it and continue rather than restarting.
4. Citation checks: prefer direct DOI lookups, which are reachable from this environment:
   `curl -sS "https://api.crossref.org/works/<DOI>" | python3 -c "import sys,json;m=json.load(sys.stdin)['message'];print(m.get('title'),m.get('issued'),[a.get('family') for a in m.get('author',[])][:3])"`
   or `curl -sS "https://api.openalex.org/works/https://doi.org/<DOI>?select=title,publication_year,authorships"`.
   The hosted reference-lookup MCP tool may be busy (HTTP 429); use it only if it responds. Run lookups in small batches.
5. Re-fetch non-academic URLs with WebFetch (web search budget is limited, so prefer fetching listed sources over new searches). Record URL and date checked (today is 2026-11-04).
6. Write the memo in the REVIEW_STANDARD format to the file named in your assignment, in several appends (cat >> with heredocs). Target 2,000–3,500 words.
7. Do not modify the documents under review, anything under `src/`, or other reviewers' files. Do not read the founder's Drive or Gmail. Do not spawn agents.
8. Finish by replying with at most 300 words: verdict, the three most important problems, and what you could not check.
