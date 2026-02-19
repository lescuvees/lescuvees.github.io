# Profiles Workflow

For profile pages, edit files in this folder.

Each profile is a Markdown file with YAML frontmatter:

- File name defines URL slug. Example: `abigaelle-rougeloise.md` -> `/abigaelle-rougeloise/`
- Frontmatter stores structured fields (guild, titles, etc.)
- Regular Markdown body stores the biography

## Build pages

Run:

```bash
python scripts/build_profiles.py
```

This regenerates all profile pages from `profiles/*.md`.

## Minimal template

```md
---
name: Example Name
subtitle: Court subtitle
portrait: https://example.com/photo.jpg
guild: Saint-Ordre du Vinier
religion: Saint Clement
member_since: "1006"
offgame_role: Direction
titles:
  - Chevalier
domains:
  - Limbourg
fiefs:
  - Rougeloise
links:
  - label: Fiche de personnage
    url: https://example.com
gallery:
  - https://example.com/photo-2.jpg
---

Write the biography in Markdown here.
```
