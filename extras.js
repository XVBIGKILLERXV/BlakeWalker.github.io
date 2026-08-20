(() => {
  "use strict";

  const CONFIG = {
    timezone: "Australia/Sydney",
    terminalTitle: "BLAKE://TERMINAL",
    github: "https://github.com/XVBIGKILLERXV",
    discord: "https://discord.com/users/417191267546562560",
    currentlyModding: "Ghost Recon Breakpoint",
    projectDataUrl: "links.json"
  };

  const state = {
    projects: [],
    devMode: false,
    terminalStarted: false
  };

  /* =========================================================
     BOOT SCREEN
  ========================================================= */

  function createBootScreen() {
    if (sessionStorage.getItem("bw_boot_complete")) return;

    const boot = document.createElement("div");
    boot.className = "bw-boot";
    boot.innerHTML = `
      <div class="bw-boot-inner">
        <div class="bw-boot-title">BLAKE.WALKER</div>
        <div class="bw-boot-lines">
          <div>INITIALISING...</div>
          <div>LOADING PROJECTS...</div>
          <div>DISCORD ........ CONNECTING</div>
          <div>NATAL .......... READY</div>
          <div>SYSTEM ......... ONLINE</div>
        </div>
        <div class="bw-boot-ready">ENTER</div>
      </div>
    `;

    document.body.appendChild(boot);
    const lines = boot.querySelectorAll(".bw-boot-lines div");

    lines.forEach((line, index) => {
      setTimeout(() => line.classList.add("visible"), 150 + index * 160);
    });

    setTimeout(() => {
      if (lines[2]) lines[2].textContent = "DISCORD ........ READY";
    }, 800);

    setTimeout(() => {
      boot.classList.add("bw-boot-hide");
      sessionStorage.setItem("bw_boot_complete", "true");
      setTimeout(() => boot.remove(), 700);
    }, 1650);
  }

  /* =========================================================
     LOCAL TIME + VISITOR
  ========================================================= */

  function createSystemInfo() {
    if (document.querySelector(".bw-system-info")) return;

    const widget = document.createElement("div");
    widget.className = "bw-system-info";
    widget.innerHTML = `
      <div class="bw-info-block">
        <span class="bw-info-label">LOCAL / AU</span>
        <span id="bw-local-time" class="bw-info-value">--:--:--</span>
        <span id="bw-local-date" class="bw-info-small"></span>
      </div>
      <div class="bw-info-block">
        <span class="bw-info-label">VISITOR</span>
        <span id="bw-visitor-count" class="bw-info-value bw-visitor">------</span>
      </div>
    `;
    document.body.appendChild(widget);

    const updateClock = () => {
      const now = new Date();
      const time = new Intl.DateTimeFormat("en-AU", {
        timeZone: CONFIG.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(now);

      const date = new Intl.DateTimeFormat("en-AU", {
        timeZone: CONFIG.timezone,
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(now);

      const t = document.getElementById("bw-local-time");
      const d = document.getElementById("bw-local-date");
      if (t) t.textContent = time;
      if (d) d.textContent = date.toUpperCase();
    };

    updateClock();
    setInterval(updateClock, 1000);
    initVisitorCounter();
  }

  function initVisitorCounter() {
    const display = document.getElementById("bw-visitor-count");
    if (!display) return;

    let visits = Number(localStorage.getItem("bw_visit_count") || 0);
    if (!sessionStorage.getItem("bw_visit_counted")) {
      visits += 1;
      localStorage.setItem("bw_visit_count", String(visits));
      sessionStorage.setItem("bw_visit_counted", "true");
    }

    display.textContent = String(visits).padStart(6, "0");

    display.addEventListener("click", () => {
      const original = display.textContent;
      display.textContent = "WATCHING";
      setTimeout(() => { display.textContent = original; }, 900);
    });
  }

  /* =========================================================
     AMBIENT MOUSE GLOW
  ========================================================= */

  function createAmbientGlow() {
    if (matchMedia("(pointer: coarse)").matches) return;

    const glow = document.createElement("div");
    glow.className = "bw-ambient-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    let targetX = innerWidth * 0.5;
    let targetY = innerHeight * 0.35;
    let x = targetX;
    let y = targetY;

    document.addEventListener("pointermove", event => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add("is-active");
    }, { passive: true });

    document.addEventListener("pointerleave", () => {
      glow.classList.remove("is-active");
    });

    const animate = () => {
      x += (targetX - x) * 0.075;
      y += (targetY - y) * 0.075;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  /* =========================================================
     PROJECT HOVER PREVIEWS
  ========================================================= */

  async function loadProjectData() {
    try {
      const response = await fetch(CONFIG.projectDataUrl, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      state.projects = Array.isArray(data.links) ? data.links : [];
      initProjectPreviews();
    } catch (error) {
      console.warn("Project preview data unavailable.", error);
    }
  }

  function normalise(text) {
    return String(text || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function findProjectLink(project) {
    const links = [...document.querySelectorAll("#links a, .links__list a")];
    const target = normalise(project.title);
    return links.find(link => normalise(link.textContent).includes(target));
  }

  function createPreviewPanel() {
    let panel = document.querySelector(".bw-project-preview");
    if (panel) return panel;

    panel = document.createElement("aside");
    panel.className = "bw-project-preview";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `
      <div class="bw-preview-media"></div>
      <div class="bw-preview-content">
        <div class="bw-preview-kicker"></div>
        <div class="bw-preview-title"></div>
        <div class="bw-preview-meta"></div>
        <div class="bw-preview-blurb"></div>
      </div>
    `;
    document.body.appendChild(panel);
    return panel;
  }

  function renderPreviewMedia(host, project) {
    host.replaceChildren();

    const src = project.preview || "";
    if (!src) {
      const fallback = document.createElement("div");
      fallback.className = "bw-preview-fallback";
      fallback.textContent = project.title;
      host.appendChild(fallback);
      return;
    }

    if (/\.(mp4|webm)(\?|$)/i.test(src)) {
      const video = document.createElement("video");
      video.src = src;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      host.appendChild(video);
    } else {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `${project.title} preview`;
      image.loading = "eager";
      host.appendChild(image);
    }
  }

  function initProjectPreviews() {
    if (!state.projects.length || matchMedia("(pointer: coarse)").matches) return;

    const panel = createPreviewPanel();
    const media = panel.querySelector(".bw-preview-media");
    const kicker = panel.querySelector(".bw-preview-kicker");
    const title = panel.querySelector(".bw-preview-title");
    const meta = panel.querySelector(".bw-preview-meta");
    const blurb = panel.querySelector(".bw-preview-blurb");

    let px = innerWidth * 0.65;
    let py = innerHeight * 0.45;
    let tx = px;
    let ty = py;

    const movePanel = event => {
      tx = event.clientX + 28;
      ty = event.clientY - 30;
      const maxX = innerWidth - 390;
      const maxY = innerHeight - 440;
      tx = Math.min(Math.max(18, tx), Math.max(18, maxX));
      ty = Math.min(Math.max(18, ty), Math.max(18, maxY));
    };

    const animatePanel = () => {
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      panel.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      requestAnimationFrame(animatePanel);
    };
    animatePanel();

    state.projects.forEach(project => {
      const link = findProjectLink(project);
      if (!link || link.dataset.bwPreviewBound === "1") return;
      link.dataset.bwPreviewBound = "1";
      link.classList.add("bw-project-link");

      link.addEventListener("pointerenter", event => {
        renderPreviewMedia(media, project);
        kicker.textContent = [
          project.type || "PROJECT",
          project.visibility ? project.visibility.toUpperCase() : "",
          project.role ? project.role.toUpperCase() : ""
        ].filter(Boolean).join(" / ");

        title.textContent = project.title;
        meta.textContent = [
          project.status ? `STATUS / ${project.status.toUpperCase()}` : "",
          project.visibility === "Private" ? "SOURCE / [REDACTED]" : ""
        ].filter(Boolean).join("   ");

        blurb.textContent = project.blurb || "";
        panel.classList.add("is-visible");
        panel.setAttribute("aria-hidden", "false");
        movePanel(event);
      });

      link.addEventListener("pointermove", movePanel);
      link.addEventListener("pointerleave", () => {
        panel.classList.remove("is-visible");
        panel.setAttribute("aria-hidden", "true");
        const video = panel.querySelector("video");
        if (video) video.pause();
      });
    });
  }

  /* =========================================================
     SCROLL REVEALS
  ========================================================= */

  function initScrollReveals() {
    const targets = [
      ...document.querySelectorAll(
        ".hero__tagline, .hero__subtag, .links__eyebrow, #links > *, .elsewhere, .chart__wrap"
      )
    ];

    if (!targets.length) return;

    targets.forEach((element, index) => {
      element.classList.add("bw-scroll-reveal");
      element.style.setProperty("--bw-reveal-delay", `${Math.min(index * 45, 240)}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(element => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -7% 0px"
    });

    targets.forEach(element => observer.observe(element));
  }

  /* =========================================================
     DEVELOPER MODE
  ========================================================= */

  function developerModeEnabled() {
    return document.documentElement.classList.contains("bw-dev-mode");
  }

  function setDeveloperMode(enabled) {
    state.devMode = enabled;
    document.documentElement.classList.toggle("bw-dev-mode", enabled);

    const button = document.querySelector(".bw-dev-launcher");
    if (button) {
      button.classList.toggle("is-active", enabled);
      button.setAttribute("aria-pressed", String(enabled));
      button.title = enabled ? "Disable Developer Mode" : "Enable Developer Mode";
    }

    showDevTransition(enabled);
  }

  function toggleDeveloperMode() {
    setDeveloperMode(!developerModeEnabled());
    return developerModeEnabled();
  }

  function createDeveloperLauncher() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bw-dev-launcher";
    button.setAttribute("aria-label", "Toggle Developer Mode");
    button.setAttribute("aria-pressed", "false");
    button.title = "Developer Mode";
    button.textContent = "</>";
    button.addEventListener("click", toggleDeveloperMode);
    document.body.appendChild(button);
  }

  function showDevTransition(enabled) {
    const existing = document.querySelector(".bw-dev-transition");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "bw-dev-transition";
    overlay.innerHTML = enabled
      ? `<span>DEVELOPER MODE REQUESTED</span><small>IDENTITY / BLAKE.WALKER &nbsp; ACCESS / GRANTED</small>`
      : `<span>TERMINATING DEV SESSION</span><small>RESTORING INTERFACE...</small>`;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-visible"));

    setTimeout(() => overlay.classList.add("is-leaving"), 700);
    setTimeout(() => overlay.remove(), 1200);
  }

  /* =========================================================
     TERMINAL
  ========================================================= */

  function createTerminal() {
    const launcher = document.createElement("button");
    launcher.className = "bw-terminal-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Open terminal");
    launcher.title = "Terminal";
    launcher.textContent = ">_";
    document.body.appendChild(launcher);

    const terminal = document.createElement("div");
    terminal.className = "bw-terminal";
    terminal.setAttribute("aria-hidden", "true");
    terminal.innerHTML = `
      <div class="bw-terminal-window">
        <div class="bw-terminal-header">
          <span>${CONFIG.terminalTitle}</span>
          <button class="bw-terminal-close" type="button" aria-label="Close terminal">×</button>
        </div>
        <div id="bw-terminal-output" class="bw-terminal-output" aria-live="polite"></div>
        <div class="bw-terminal-input-row">
          <span class="bw-terminal-prompt">&gt;</span>
          <input id="bw-terminal-input" class="bw-terminal-input" type="text"
            autocomplete="off" spellcheck="false" aria-label="Terminal command">
        </div>
      </div>
    `;
    document.body.appendChild(terminal);

    const output = terminal.querySelector("#bw-terminal-output");
    const input = terminal.querySelector("#bw-terminal-input");
    const close = terminal.querySelector(".bw-terminal-close");

    const print = (text = "", className = "") => {
      const line = document.createElement("div");
      line.className = `bw-terminal-line ${className}`;
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    };

    const openTerminal = () => {
      terminal.classList.add("open");
      terminal.setAttribute("aria-hidden", "false");
      if (!state.terminalStarted) {
        print("BLAKE://TERMINAL");
        print("SYSTEM READY");
        print("");
        print('Type "help" for available commands.');
        state.terminalStarted = true;
      }
      setTimeout(() => input.focus(), 40);
    };

    const closeTerminal = () => {
      terminal.classList.remove("open");
      terminal.setAttribute("aria-hidden", "true");
    };

    const printProjects = verbose => {
      state.projects.forEach((project, index) => {
        print(`${String(index + 1).padStart(2, "0")} / ${project.title}`);
        if (verbose) {
          print(`TYPE        ${(project.type || "PROJECT").toUpperCase()}`);
          print(`STATUS      ${(project.status || "UNKNOWN").toUpperCase()}`);
          print(`VISIBILITY  ${(project.visibility || "UNKNOWN").toUpperCase()}`);
          if (project.visibility === "Private") print("SOURCE      [REDACTED]");
          print("");
        }
      });
    };

    const run = raw => {
      const command = raw.trim().toLowerCase();
      if (!command) return;
      print(`> ${raw}`, "command");

      switch (command) {
        case "help":
          print("");
          print("AVAILABLE COMMANDS");
          ["about","projects","private","status","modding","discord","github","natal","time","visitor","devmode","clear"]
            .forEach(item => print(item));
          if (developerModeEnabled()) {
            print("");
            print("DEV COMMANDS");
            ["system","build","whoami","inspect","projects --verbose","exit"].forEach(item => print(item));
          }
          print("");
          print("There may be other commands.");
          break;

        case "about":
          print("");
          print("BLAKE WALKER");
          print("Creative Developer");
          print("Australia");
          print("");
          print("Discord bots, development, modding & experiments.");
          break;

        case "projects":
          print("");
          print("SELECTED WORK");
          print("");
          printProjects(false);
          break;

        case "projects --verbose":
          if (!developerModeEnabled()) { print(""); print("ACCESS DENIED."); break; }
          print("");
          print("SELECTED WORK / VERBOSE");
          print("");
          printProjects(true);
          break;

        case "private":
          print("");
          print("PRIVATE PROJECTS");
          print("The Corrections Assistant Bot");
          print("Corrections Control Center Bot");
          print("");
          print("SOURCE / [REDACTED]");
          print("ACCESS / CONTACT OWNER");
          break;

        case "status":
          print("");
          print("SYSTEM / ONLINE");
          print("BUILDING / NEXORA");
          print(`MODDING / ${CONFIG.currentlyModding}`);
          print("LOCATION / AUSTRALIA");
          break;

        case "modding":
          print("");
          print("CURRENTLY MODDING");
          print(CONFIG.currentlyModding);
          print("STATUS / ACTIVE");
          print("");
          print("Vanilla was only the starting point.");
          break;

        case "discord":
          print(""); print("Opening Discord...");
          window.open(CONFIG.discord, "_blank", "noopener");
          break;

        case "github":
          print(""); print("Opening GitHub...");
          window.open(CONFIG.github, "_blank", "noopener");
          break;

        case "natal": {
          const natal = document.querySelector("#natalchart, #natal, .chart");
          if (natal) {
            print(""); print("Locating natal chart...");
            natal.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(closeTerminal, 250);
          } else {
            print(""); print("Natal chart unavailable.");
          }
          break;
        }

        case "time":
          print("");
          print(`LOCAL / ${document.getElementById("bw-local-time")?.textContent || "UNKNOWN"}`);
          print("TIMEZONE / AUSTRALIA/SYDNEY");
          break;

        case "visitor":
          print("");
          print(`VISITOR / ${document.getElementById("bw-visitor-count")?.textContent || "UNKNOWN"}`);
          break;

        case "devmode": {
          const enabled = toggleDeveloperMode();
          print("");
          print(enabled ? "DEVELOPER MODE ENABLED" : "DEVELOPER MODE DISABLED");
          if (enabled) print('Type "help" for developer commands.');
          break;
        }

        case "system":
          if (!developerModeEnabled()) { print(""); print("ACCESS DENIED."); break; }
          print("");
          print("BLAKE.WALKER // SYSTEM");
          print("HOST          GITHUB_PAGES");
          print("ENVIRONMENT   PRODUCTION");
          print("THEME         PURPLE");
          print("NATAL         LOADED");
          print("DISCORD       LANYARD");
          print("TERMINAL      ONLINE");
          break;

        case "build":
          if (!developerModeEnabled()) { print(""); print("ACCESS DENIED."); break; }
          print("");
          print("BUILD / BLAKE.WALKER");
          print("VERSION / INTERACTIVE-1");
          print("HOST / GITHUB PAGES");
          print("STATUS / PRODUCTION");
          break;

        case "whoami":
          print("");
          if (developerModeEnabled()) {
            print("USER / DEVELOPER");
            print("OWNER / BLAKE WALKER");
            print("HANDLE / XVBIGKILLERXV");
          } else {
            print("USER / VISITOR");
          }
          break;

        case "inspect":
          if (!developerModeEnabled()) { print(""); print("ACCESS DENIED."); break; }
          print("");
          ["IDENTITY","SUBTAG","SELECTED_WORK","PROJECT_PREVIEWS","NATAL","DISCORD","TERMINAL"]
            .forEach(module => print(`${module.padEnd(18, " ")} ACTIVE`));
          break;

        case "exit":
          if (developerModeEnabled()) {
            setDeveloperMode(false);
            print(""); print("DEVELOPER MODE DISABLED");
          }
          break;

        case "nomad":
          print("");
          print("WELCOME BACK, GHOST.");
          print("LOCATION / AUROA");
          print("STATUS   / ACTIVE");
          print("MISSION  / CLASSIFIED");
          print("LOADOUT  / MODIFIED");
          break;

        case "ghost":
          print(""); print("GHOST LEAD ONLINE."); print("TACTICAL SYSTEMS READY.");
          break;

        case "breakpoint":
          print(""); print("AUROA CONNECTION ESTABLISHED."); print("MOD STATUS / HEAVILY MODIFIED");
          break;

        case "walker":
          print(""); print("IDENTITY CONFIRMED."); print("WELCOME BACK, BLAKE.");
          break;

        case "clear":
          output.replaceChildren();
          break;

        default:
          print(""); print(`COMMAND NOT FOUND / ${command}`); print('Type "help".');
      }

      print("");
    };

    launcher.addEventListener("click", openTerminal);
    close.addEventListener("click", closeTerminal);

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && terminal.classList.contains("open")) closeTerminal();
      if (event.key === "`" && document.activeElement !== input) {
        event.preventDefault();
        openTerminal();
      }
    });

    input.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;
      const command = input.value;
      input.value = "";
      run(command);
    });
  }

  /* =========================================================
     KEYBOARD EASTER EGG
  ========================================================= */

  function initKeyboardSecret() {
    let typed = "";

    document.addEventListener("keydown", event => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.length !== 1) return;

      typed = (typed + event.key.toLowerCase()).slice(-5);
      if (typed !== "ghost") return;

      typed = "";
      const message = document.createElement("div");
      message.className = "bw-ghost-message";
      message.innerHTML = `
        <span>WELCOME BACK, GHOST.</span>
        <small>AUROA // CONNECTION ESTABLISHED</small>
      `;
      document.body.appendChild(message);
      requestAnimationFrame(() => message.classList.add("visible"));
      setTimeout(() => {
        message.classList.remove("visible");
        setTimeout(() => message.remove(), 450);
      }, 2400);
    });
  }

  /* =========================================================
     START
  ========================================================= */

  function init() {
    createBootScreen();
    createSystemInfo();
    createAmbientGlow();
    createTerminal();
    createDeveloperLauncher();
    initKeyboardSecret();
    initScrollReveals();
    loadProjectData();

    // Project links are rendered asynchronously by app.js.
    // Retry binding previews shortly after page load.
    setTimeout(initProjectPreviews, 900);
    setTimeout(initProjectPreviews, 1800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
