(() => {
  const footerEl = document.querySelector(".footer");
  const canvasEl = document.querySelector("#neuro");
  if (!footerEl || !canvasEl) return;

  let gl = null;
  let shaderProgram = null;
  let uniforms = {};
  let rafId = null;
  let isVisible = false;

  const pointer = { x: 0, y: 0, tX: 0, tY: 0 };

  function getDPR(rectWidth) {
    const raw = window.devicePixelRatio || 1;
    return Math.min(raw, rectWidth < 600 ? 1 : 2);
  }

  function init() {
    gl = initShader();
    if (!gl) return;

    resizeCanvas();

    setupPointerEvents();
    observeRootStyleChanges();
    updatePrimaryColorUniform();

    setupVisibilityObserver();

    let resizeTimeout = null;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          resizeCanvas();
        }, 120);
      },
      { passive: true }
    );
  }

  function initShader() {
    const vsSource = document.getElementById("vertShader")?.textContent;
    const fsSource = document.getElementById("fragShader")?.textContent;
    if (!vsSource || !fsSource) {
      console.warn("Shaders not found in DOM.");
      return null;
    }

    const _gl =
      canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");
    if (!_gl) {
      console.warn("WebGL not supported");
      return null;
    }

    function compile(src, type) {
      const s = _gl.createShader(type);
      _gl.shaderSource(s, src);
      _gl.compileShader(s);
      if (!_gl.getShaderParameter(s, _gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", _gl.getShaderInfoLog(s));
        _gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vsh = compile(vsSource, _gl.VERTEX_SHADER);
    const fsh = compile(fsSource, _gl.FRAGMENT_SHADER);
    if (!vsh || !fsh) return null;

    const program = _gl.createProgram();
    _gl.attachShader(program, vsh);
    _gl.attachShader(program, fsh);
    _gl.linkProgram(program);
    if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
      console.error("Program link error:", _gl.getProgramInfoLog(program));
      return null;
    }
    shaderProgram = program;
    _gl.useProgram(shaderProgram);

    uniforms = {};
    const count = _gl.getProgramParameter(program, _gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = _gl.getActiveUniform(program, i);
      if (!info) continue;
      const name = info.name.replace(/\[0\]$/, ""); 
      uniforms[name] = _gl.getUniformLocation(program, name);
    }

    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vb = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, vb);
    _gl.bufferData(_gl.ARRAY_BUFFER, verts, _gl.STATIC_DRAW);

    const pos = _gl.getAttribLocation(program, "a_position");
    _gl.enableVertexAttribArray(pos);
    _gl.vertexAttribPointer(pos, 2, _gl.FLOAT, false, 0, 0);

    _gl.clearColor(0, 0, 0, 0);

    return _gl;
  }

  function resizeCanvas() {
    if (!gl) return;
    const rect = footerEl.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = getDPR(rect.width);
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));

    if (canvasEl.width !== w || canvasEl.height !== h) {
      canvasEl.width = w;
      canvasEl.height = h;
      canvasEl.style.width = Math.round(rect.width) + "px";
      canvasEl.style.height = Math.round(rect.height) + "px";
      gl.viewport(0, 0, w, h);
      if (uniforms.u_ratio) {
        gl.uniform1f(uniforms.u_ratio, w / h);
      }
    }
  }

  function render(now) {
    if (!isVisible || !gl) {
      rafId = null;
      return;
    }
    pointer.x += (pointer.tX - pointer.x) * 0.18;
    pointer.y += (pointer.tY - pointer.y) * 0.18;

    if (uniforms.u_time) {
      try {
        gl.uniform1f(uniforms.u_time, now);
      } catch (e) {}
    }

    if (uniforms.u_pointer_position) {
      const rect = footerEl.getBoundingClientRect();
      const nx = rect.width > 0 ? (pointer.x - rect.left) / rect.width : 0.5;
      const ny =
        rect.height > 0 ? 1 - (pointer.y - rect.top) / rect.height : 0.5;
      const cx = Math.min(1, Math.max(0, nx));
      const cy = Math.min(1, Math.max(0, ny));
      try {
        gl.uniform2f(uniforms.u_pointer_position, cx, cy);
      } catch (e) {}
    }

    if (uniforms.u_scroll_progress) {
      try {
        gl.uniform1f(
          uniforms.u_scroll_progress,
          window.pageYOffset / (2 * window.innerHeight)
        );
      } catch (e) {}
    }

    try {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } catch (e) {}

    rafId = requestAnimationFrame(render);
  }

  function setupVisibilityObserver() {
    if (!("IntersectionObserver" in window)) {
      isVisible = true;
      if (!rafId) rafId = requestAnimationFrame(render);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (!ent) return;
        if (ent.isIntersecting) {
          isVisible = true;
          resizeCanvas();
          if (!rafId) rafId = requestAnimationFrame(render);
        } else {
          isVisible = false;
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        }
      },
      { threshold: 0.01 }
    );
    io.observe(footerEl);
  }

  function setupPointerEvents() {
    const onPointer = (e) => {
      pointer.tX = e.clientX;
      pointer.tY = e.clientY;
    };
    const onTouch = (e) => {
      const t = e.targetTouches && e.targetTouches[0];
      if (!t) return;
      pointer.tX = t.clientX;
      pointer.tY = t.clientY;
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("click", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
  }

  function hexToRgbNormalized(hex) {
    hex = (hex || "").replace("#", "").trim();
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    if (hex.length !== 6) return [0.2, 0.6, 0.5];
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r / 255, g / 255, b / 255];
  }
  function rgbStringToNormalized(rgbStr) {
    const nums = (rgbStr || "").match(/(\d+(\.\d+)?)/g);
    if (!nums || nums.length < 3) return [0.2, 0.6, 0.5];
    return [
      parseFloat(nums[0]) / 255,
      parseFloat(nums[1]) / 255,
      parseFloat(nums[2]) / 255,
    ];
  }
  function getCSSVarAsNormalized(varName) {
    let val = "";
    try {
      val = getComputedStyle(document.body).getPropertyValue(varName).trim();
    } catch (e) {}
    if (!val) {
      try {
        val = getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim();
      } catch (e) {}
    }
    if (!val) return [0.2, 0.6, 0.5];
    if (val.startsWith("#")) return hexToRgbNormalized(val);
    if (val.startsWith("rgb")) return rgbStringToNormalized(val);
    return [0.2, 0.6, 0.5];
  }
  function updatePrimaryColorUniform() {
    if (!gl || !uniforms) return;
    const p = getCSSVarAsNormalized("--main-color");
    if (shaderProgram) gl.useProgram(shaderProgram);
    if (uniforms.u_primaryColor) {
      try {
        gl.uniform3f(uniforms.u_primaryColor, p[0], p[1], p[2]);
      } catch (e) {}
    }
  }

  function observeRootStyleChanges() {
    const target = document.body || document.documentElement;
    if (!target) return;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes") {
          updatePrimaryColorUniform();
          break;
        }
      }
    });
    observer.observe(target, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  init();

  window.__neuroCanvas = {
    restart: () => {
      if (!isVisible && !rafId) {
        isVisible = true;
        rafId = requestAnimationFrame(render);
      }
    },
    stop: () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      isVisible = false;
    },
    updateColor: updatePrimaryColorUniform,
    resize: resizeCanvas,
  };
})();
