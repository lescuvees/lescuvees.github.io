(() => {
  const body = document.body;
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const article = document.querySelector("article");

  const titleCase = (value) =>
    value
      .replace(/\//g, " / ")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const normalizePath = (path) => path.replace(/index\.html$/, "").replace(/\/$/, "") || "/";

  const groupLabelForHref = (href) => {
    if (href === "/") return "Accueil";
    if (href.startsWith("/les-guildes-des-cuvees")) return "Guildes";
    if (href.startsWith("/roles-en-jeu")) return "Roles";
    if (href.startsWith("/hors-jeu")) return "Hors jeu";
    if (href.startsWith("/documents")) return "Documents";
    return "Personnages";
  };

  const setupMobileNav = () => {
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  };

  const improveNavigation = () => {
    if (!nav) return;
    const links = [...nav.querySelectorAll("a[href]")];
    const currentPath = normalizePath(window.location.pathname);

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const normalizedHref = normalizePath(href);
      if (normalizedHref === currentPath) {
        link.classList.add("is-current");
      }

      if (!link.dataset.keepText) {
        link.textContent = titleCase(link.textContent || href);
      }
    });

    const groups = new Map();
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const group = groupLabelForHref(href);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(link.cloneNode(true));
    });

    const orderedGroups = ["Accueil", "Guildes", "Roles", "Hors jeu", "Documents", "Personnages"];
    const wrapper = document.createElement("div");

    orderedGroups.forEach((name) => {
      const sectionLinks = groups.get(name);
      if (!sectionLinks || !sectionLinks.length) return;

      const section = document.createElement("section");
      section.className = "nav-section";
      const title = document.createElement("h2");
      title.className = "nav-section-title";
      title.textContent = name;
      const ul = document.createElement("ul");

      sectionLinks.forEach((link) => {
        const li = document.createElement("li");
        li.append(link);
        ul.append(li);
      });

      section.append(title, ul);
      wrapper.append(section);
    });

    const existing = nav.querySelector("ul");
    if (existing) {
      existing.replaceWith(wrapper);
    }
  };

  const makeExternalLinksSafe = () => {
    document.querySelectorAll('article a[href^="http"]').forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  };

  const tidyArticle = () => {
    if (!article) return;

    [...article.querySelectorAll("p")].forEach((p) => {
      if (!p.textContent?.trim() && !p.querySelector("img")) {
        p.remove();
      }
    });

    const firstRichParagraph = [...article.children].find((node) => node.tagName === "P" && node.textContent.trim().length > 60);
    if (firstRichParagraph) {
      firstRichParagraph.classList.add("lead");
    }
  };

  const buildMetaGrid = () => {
    if (!article) return;
    const children = [...article.children];
    const metaPairs = [];

    for (const node of children) {
      if (node.tagName !== "P") break;
      if (node.querySelector("img")) break;

      const text = node.textContent.trim();
      const match = text.match(/^([^:]{2,32})\s*:\s*(.+)$/);
      if (!match) break;

      metaPairs.push({ node, key: match[1], value: match[2] });
    }

    if (metaPairs.length < 2) return;

    const grid = document.createElement("div");
    grid.className = "meta-grid";

    metaPairs.forEach(({ node, key, value }) => {
      const item = document.createElement("div");
      item.className = "meta-item";
      item.innerHTML = `<span class="k">${key}</span><span class="v">${value}</span>`;
      grid.append(item);
      node.remove();
    });

    const firstH1 = article.querySelector("h1");
    if (firstH1) {
      firstH1.insertAdjacentElement("afterend", grid);
    } else {
      article.prepend(grid);
    }
  };

  const buildMediaGrids = () => {
    if (!article) return;
    const children = [...article.children];
    let i = 0;

    const flushCards = (startIndex, endIndex, cards) => {
      if (cards.length < 2) return;
      const grid = document.createElement("div");
      grid.className = "media-grid";

      cards.forEach(({ imageNode, caption }) => {
        const card = document.createElement("figure");
        card.className = "media-card";

        const img = imageNode.cloneNode(true);
        card.append(img);

        if (caption) {
          const figcaption = document.createElement("figcaption");
          figcaption.textContent = caption;
          card.append(figcaption);
        }

        grid.append(card);
      });

      children[startIndex].before(grid);
      for (let x = startIndex; x <= endIndex; x += 1) {
        children[x]?.remove();
      }
    };

    while (i < children.length) {
      if (!children[i] || children[i].tagName !== "P") {
        i += 1;
        continue;
      }

      const cards = [];
      let start = i;
      let end = i;

      while (i < children.length) {
        const p = children[i];
        if (!p || p.tagName !== "P") break;

        const img = p.querySelector("img");
        if (!img) break;

        let caption = "";
        let consumed = 1;
        const next = children[i + 1];
        if (next && next.tagName === "P" && !next.querySelector("img")) {
          const text = next.textContent.trim();
          if (text && text.length <= 95) {
            caption = text;
            consumed = 2;
          }
        }

        cards.push({ imageNode: img, caption });
        end = i + consumed - 1;
        i += consumed;
      }

      if (cards.length >= 2) {
        flushCards(start, end, cards);
      } else {
        i = start + 1;
      }
    }
  };

  setupMobileNav();
  improveNavigation();
  makeExternalLinksSafe();
  tidyArticle();
  buildMetaGrid();
  buildMediaGrids();
})();
