#!/usr/bin/env python3
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import markdown
import yaml
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
PROFILES_DIR = ROOT / "profiles"


@dataclass
class Profile:
    slug: str
    name: str
    subtitle: str
    portrait: str
    guild: str
    religion: str
    member_since: str
    titles: list[str]
    domains: list[str]
    fiefs: list[str]
    offgame_role: str
    links: list[dict[str, str]]
    gallery: list[str]
    biography_md: str


def split_frontmatter(content: str) -> tuple[dict[str, Any], str]:
    if not content.startswith("---\n"):
        raise ValueError("Missing YAML frontmatter")
    _, rest = content.split("---\n", 1)
    front, body = rest.split("\n---\n", 1)
    data = yaml.safe_load(front) or {}
    return data, body.strip() + "\n"


def ensure_list(data: Any) -> list[str]:
    if not data:
        return []
    if isinstance(data, list):
        return [str(x).strip() for x in data if str(x).strip()]
    return [str(data).strip()]


def load_profile(path: Path) -> Profile:
    raw = path.read_text(encoding="utf-8")
    fm, body = split_frontmatter(raw)
    slug = path.stem
    return Profile(
        slug=slug,
        name=str(fm.get("name", slug.replace("-", " ").title())),
        subtitle=str(fm.get("subtitle", "")),
        portrait=str(fm.get("portrait", "")),
        guild=str(fm.get("guild", "")),
        religion=str(fm.get("religion", "")),
        member_since=str(fm.get("member_since", "")),
        titles=ensure_list(fm.get("titles")),
        domains=ensure_list(fm.get("domains")),
        fiefs=ensure_list(fm.get("fiefs")),
        offgame_role=str(fm.get("offgame_role", "")),
        links=fm.get("links", []) or [],
        gallery=ensure_list(fm.get("gallery")),
        biography_md=body,
    )


def profile_html(profile: Profile) -> str:
    bio_html = markdown.markdown(profile.biography_md, extensions=["extra", "sane_lists"])

    def section_list(title: str, values: list[str]) -> str:
        if not values:
            return ""
        items = "".join(f"<li>{v}</li>" for v in values)
        return f'<section class="profile-section"><h2>{title}</h2><ul>{items}</ul></section>'

    links_html = ""
    if profile.links:
        items = "".join(
            f'<li><a href="{x.get("url", "#")}">{x.get("label", x.get("url", "Lien"))}</a></li>'
            for x in profile.links
        )
        links_html = f'<section class="profile-section"><h2>Liens</h2><ul>{items}</ul></section>'

    gallery_html = ""
    if profile.gallery:
        imgs = "".join(f'<img src="{src}" alt="Portrait de {profile.name}" />' for src in profile.gallery)
        gallery_html = f'<section class="profile-section"><h2>Galerie</h2><div class="profile-gallery">{imgs}</div></section>'

    portrait_html = f'<img src="{profile.portrait}" alt="Portrait de {profile.name}" />' if profile.portrait else ""

    return f"""
<h1 class=\"page-title profile-title\">{profile.name}</h1>
<div class=\"profile-header\">
  {portrait_html}
  <div>
    <p class=\"profile-subtitle\">{profile.subtitle}</p>
    <div class=\"profile-meta\">
      <div><strong>Guilde</strong>{profile.guild}</div>
      <div><strong>Religion</strong>{profile.religion}</div>
      <div><strong>Membre depuis</strong>{profile.member_since}</div>
      <div><strong>Responsabilite hors jeu</strong>{profile.offgame_role}</div>
    </div>
  </div>
</div>
{section_list("Titres", profile.titles)}
{section_list("Domaines", profile.domains)}
{section_list("Fiefs", profile.fiefs)}
<section class=\"profile-section\">
  <h2>Biographie</h2>
  {bio_html}
</section>
{links_html}
{gallery_html}
"""


def render_page(title: str, article_html: str) -> str:
    home = ROOT / "index.html"
    soup = BeautifulSoup(home.read_text(encoding="utf-8"), "html.parser")

    if soup.title:
        soup.title.string = f"{title} - Les Cuvees"

    article = soup.find("article")
    if article is None:
        raise RuntimeError("Could not find <article> in index.html")

    article.clear()
    frag = BeautifulSoup(f"<div>{article_html}</div>", "html.parser")
    wrapper = frag.find("div")
    if wrapper:
        for node in list(wrapper.contents):
            article.append(node)

    return str(soup)


def main() -> None:
    if not PROFILES_DIR.exists():
        print("No profiles directory found.")
        return

    files = sorted(p for p in PROFILES_DIR.glob("*.md") if p.stem.lower() != "readme")
    count = 0
    for md_path in files:
        profile = load_profile(md_path)
        html = render_page(profile.name, profile_html(profile))
        target = ROOT / profile.slug / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8")
        count += 1

    print(f"Built {count} profile page(s).")


if __name__ == "__main__":
    main()
