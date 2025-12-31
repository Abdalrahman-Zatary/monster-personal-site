function tilesBlocks() {
  const baseTileSize = 60;
  const minTiles = 20;
  const maxTiles = 80;
  const resizeDebounce = 150;

  const cardsGallrey = Array.from(document.querySelectorAll(".card-gallery"));
  const prevSizes = new WeakMap();

  function calcGrid(width, height) {
    const area = Math.max(1, width * height);
    let desired = Math.round(area / (baseTileSize * baseTileSize));
    desired = Math.max(minTiles, Math.min(maxTiles, desired));

    const cols = Math.max(1, Math.round(Math.sqrt(desired * (width / height))));
    const rows = Math.max(1, Math.ceil(desired / cols));
    return { rows, cols };
  }

  function extractUrlFromBg(bgValue) {
    if (!bgValue) return null;
    const m = /url\(\s*['"]?(.+?)['"]?\s*\)/.exec(bgValue);
    return m ? m[1] : null;
  }

  function getImageSources(card) {
    const div1 = card.querySelector('div.img1') || null;
    const div2 = card.querySelector('div.img2') || null;

    let img1 = null;
    let img2 = null;

    if (div1) {
      img1 = extractUrlFromBg(div1.style && div1.style.backgroundImage)
      || extractUrlFromBg(getComputedStyle(div1).backgroundImage);
    }
    if (div2) {
      img2 = extractUrlFromBg(div2.style && div2.style.backgroundImage)
      || extractUrlFromBg(getComputedStyle(div2).backgroundImage);
    }

    if (!img1 && !img2) {
      if (card.dataset.img1 || card.dataset.img2) {
        img1 = card.dataset.img1 || null;
        img2 = card.dataset.img2 || null;
      } else if (card.dataset.img) {
        const parts = card.dataset.img.split(',').map(s => s.trim()).filter(Boolean);
        if (parts.length >= 2) {
          img1 = parts[0];
          img2 = parts[1];
        } else if (parts.length === 1) {
          img1 = parts[0];
          img2 = parts[0];
        }
      }
    }

    if (img1 && !img2) img2 = img1;
    if (!img1 && img2) img1 = img2;

    return { img1: img1 || null, img2: img2 || null };
  }

  function buildTilesForCard(card) {
    const { img1, img2 } = getImageSources(card);
    if (!img1 || !img2) return;

    const rect = card.getBoundingClientRect();
    const width = Math.max(2, Math.round(rect.width));
    const height = Math.max(2, Math.round(rect.height));

    const prev = prevSizes.get(card);
    if (
      prev &&
      prev.width === width &&
      prev.height === height &&
      card.querySelector(".tile")
    ) {
      return;
    }

    card.querySelectorAll(".tile").forEach((t) => t.remove());

    const { rows, cols } = calcGrid(width, height);
    const tileW = width / cols;
    const tileH = height / rows;

    const frag = document.createDocumentFragment();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const left = Math.round(c * tileW);
        const top = Math.round(r * tileH);
        const w = Math.ceil(tileW);
        const h = Math.ceil(tileH);

        const t1 = document.createElement("div");
        t1.className = "tile img-one";
        Object.assign(t1.style, {
          width: `${w}px`,
          height: `${h}px`,
          left: `${left}px`,
          top: `${top}px`,
          backgroundImage: `url("${img1}")`,
          backgroundSize: `${width}px ${height}px`,
          backgroundPosition: `${-left}px ${-top}px`,
        });

        const t2 = document.createElement("div");
        t2.className = "tile img-two";
        Object.assign(t2.style, {
          width: `${w}px`,
          height: `${h}px`,
          left: `${left}px`,
          top: `${top}px`,
          backgroundImage: `url("${img2}")`,
          backgroundSize: `${width}px ${height}px`,
          backgroundPosition: `${-left}px ${-top}px`,
          transitionDelay: `${(Math.random() * 0.6).toFixed(2)}s`,
          transform: "scale(1.02)",
        });

        frag.appendChild(t1);
        frag.appendChild(t2);
      }
    }

    card.appendChild(frag);
    prevSizes.set(card, { width, height, rows, cols });
  }

  function buildAllVisible() {
    cardsGallrey.forEach((card) => {
      if (card.dataset.__visible === "true") buildTilesForCard(card);
    });
  }

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildAllVisible();
    }, resizeDebounce);
  }

  window.addEventListener('resize', onResize);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.dataset.__visible = "true";
          buildTilesForCard(el);
        } else {
          el.dataset.__visible = "false";
          el.querySelectorAll(".tile").forEach((t) => t.remove());
        }
      });
    },
    { root: null, rootMargin: "200px", threshold: 0.05 }
  );

  cardsGallrey.forEach((c) => io.observe(c));

  const mutObs = new MutationObserver((mutList) => {
    let should = false;
    for (const m of mutList) {
      if (m.type === "attributes" || m.type === "childList") {
        should = true;
        break;
      }
    }
    if (should) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildAllVisible, resizeDebounce);
    }
  });
  mutObs.observe(document.querySelector(".gallery") || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
  requestAnimationFrame(buildAllVisible);
}

tilesBlocks();
