/* =========================================================
   BLAKE WALKER — SITE EXTRAS
   Local time / visitor / terminal / dev mode / easter eggs
   ========================================================= */

(() => {
  "use strict";

  /* -------------------------
     SETTINGS
  ------------------------- */

  const CONFIG = {
    timezone: "Australia/Sydney",
    terminalTitle: "BLAKE://TERMINAL",
    github: "https://github.com/XVBIGKILLERXV",
    discord: "https://discord.com/users/417191267546562560",

    projects: [
      "Nexora",
      "The Corrections Assistant Bot [PRIVATE]",
      "Corrections Control Center Bot [PRIVATE]",
      "Experiments"
    ],

    currentlyModding: "Ghost Recon Breakpoint"
  };


  /* =========================================================
     LOCAL TIME
  ========================================================= */

  function createLocalTime() {
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
        <span id="bw-visitor-count" class="bw-info-value">------</span>
      </div>
    `;

    document.body.appendChild(widget);

    function updateClock() {
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

      const timeElement = document.getElementById("bw-local-time");
      const dateElement = document.getElementById("bw-local-date");

      if (timeElement) timeElement.textContent = time;
      if (dateElement) dateElement.textContent = date.toUpperCase();
    }

    updateClock();
    setInterval(updateClock, 1000);
  }


  /* =========================================================
     VISITOR COUNTER

     NOTE:
     This is a browser-local counter because GitHub Pages
     has no database.

     Later we can connect this to a real global counter API.
  ========================================================= */

  function initVisitorCounter() {
    const display = document.getElementById("bw-visitor-count");

    if (!display) return;

    let visits = Number(localStorage.getItem("bw_visit_count") || 0);

    const counted = sessionStorage.getItem("bw_visit_counted");

    if (!counted) {
      visits++;
      localStorage.setItem("bw_visit_count", visits);
      sessionStorage.setItem("bw_visit_counted", "true");
    }

    display.textContent = String(visits).padStart(6, "0");

    display.addEventListener("click", () => {
      const original = display.textContent;

      display.textContent = "WATCHING";

      setTimeout(() => {
        display.textContent = original;
      }, 900);
    });
  }


  /* =========================================================
     BOOT SCREEN
  ========================================================= */

  function createBootScreen() {
    if (sessionStorage.getItem("bw_boot_complete")) return;

    const boot = document.createElement("div");
    boot.className = "bw-boot";

    boot.innerHTML = `
      <div class="bw-boot-inner">

        <div class="bw-boot-title">
          BLAKE.WALKER
        </div>

        <div class="bw-boot-lines">
          <div>INITIALISING...</div>
          <div>LOADING PROJECTS...</div>
          <div>DISCORD ........ CONNECTING</div>
          <div>NATAL .......... READY</div>
          <div>SYSTEM ......... ONLINE</div>
        </div>

        <div class="bw-boot-ready">
          ENTER
        </div>

      </div>
    `;

    document.body.appendChild(boot);
    document.documentElement.classList.add("bw-booting");

    const lines = boot.querySelectorAll(".bw-boot-lines div");

    lines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add("visible");
      }, 180 + index * 180);
    });

    setTimeout(() => {
      const discordLine = lines[2];

      if (discordLine) {
        discordLine.textContent = "DISCORD ........ READY";
      }
    }, 900);

    setTimeout(() => {
      boot.classList.add("bw-boot-hide");

      document.documentElement.classList.remove("bw-booting");

      sessionStorage.setItem("bw_boot_complete", "true");

      setTimeout(() => {
        boot.remove();
      }, 800);

    }, 1700);
  }


  /* =========================================================
     TERMINAL
  ========================================================= */

  function createTerminal() {
    const launcher = document.createElement("button");

    launcher.className = "bw-terminal-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Open terminal");

    launcher.innerHTML = `&gt;_`;

    document.body.appendChild(launcher);


    const terminal = document.createElement("div");
    terminal.className = "bw-terminal";
    terminal.setAttribute("aria-hidden", "true");

    terminal.innerHTML = `
      <div class="bw-terminal-window">

        <div class="bw-terminal-header">

          <span>${CONFIG.terminalTitle}</span>

          <button
            class="bw-terminal-close"
            type="button"
            aria-label="Close terminal"
          >
            ×
          </button>

        </div>

        <div
          id="bw-terminal-output"
          class="bw-terminal-output"
          aria-live="polite"
        ></div>

        <div class="bw-terminal-input-row">

          <span class="bw-terminal-prompt">&gt;</span>

          <input
            id="bw-terminal-input"
            class="bw-terminal-input"
            type="text"
            autocomplete="off"
            spellcheck="false"
            aria-label="Terminal command"
          >

        </div>

      </div>
    `;

    document.body.appendChild(terminal);


    const output = terminal.querySelector("#bw-terminal-output");
    const input = terminal.querySelector("#bw-terminal-input");
    const close = terminal.querySelector(".bw-terminal-close");


    function print(text, className = "") {
      const line = document.createElement("div");

      line.className = `bw-terminal-line ${className}`;
      line.textContent = text;

      output.appendChild(line);

      output.scrollTop = output.scrollHeight;
    }


    function blank() {
      print("");
    }


    function openTerminal() {
      terminal.classList.add("open");
      terminal.setAttribute("aria-hidden", "false");

      setTimeout(() => input.focus(), 50);

      if (!output.dataset.started) {
        print("BLAKE://TERMINAL");
        print("SYSTEM READY");
        blank();
        print('Type "help" for available commands.');

        output.dataset.started = "true";
      }
    }


    function closeTerminal() {
      terminal.classList.remove("open");
      terminal.setAttribute("aria-hidden", "true");
    }


    launcher.addEventListener("click", openTerminal);
    close.addEventListener("click", closeTerminal);


    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeTerminal();
      }

      if (
        event.key === "`" &&
        document.activeElement !== input
      ) {
        event.preventDefault();
        openTerminal();
      }
    });


    function executeCommand(rawCommand) {
      const command = rawCommand.trim().toLowerCase();

      if (!command) return;

      print(`> ${rawCommand}`, "command");

      switch (command) {

        case "help":
          blank();
          print("AVAILABLE COMMANDS");
          print("about");
          print("projects");
          print("private");
          print("status");
          print("modding");
          print("discord");
          print("github");
          print("natal");
          print("time");
          print("visitor");
          print("devmode");
          print("clear");
          blank();
          print("There may be other commands.");
          break;


        case "about":
          blank();
          print("BLAKE WALKER");
          print("Creative Developer");
          print("Australia");
          blank();
          print("Building projects, Discord systems,");
          print("experiments and whatever comes next.");
          break;


        case "projects":
          blank();
          print("SELECTED WORK");
          blank();

          CONFIG.projects.forEach((project, index) => {
            print(
              `${String(index + 1).padStart(2, "0")} / ${project}`
            );
          });

          break;


        case "private":
          blank();
          print("PRIVATE PROJECTS");
          blank();
          print("The Corrections Assistant Bot");
          print("Corrections Control Center Bot");
          blank();
          print("Source code is not publicly available.");
          print("Contact me for more information.");
          break;


        case "status":
          blank();
          print("SYSTEM / ONLINE");
          print("BUILDING / NEXORA");
          print(`MODDING / ${CONFIG.currentlyModding}`);
          print("LOCATION / AUSTRALIA");
          break;


        case "modding":
          blank();
          print("CURRENTLY MODDING");
          blank();
          print(CONFIG.currentlyModding);
          print("STATUS / ACTIVE");
          blank();
          print("Vanilla was only the starting point.");
          break;


        case "discord":
          blank();
          print("Opening Discord...");
          window.open(CONFIG.discord, "_blank", "noopener");
          break;


        case "github":
          blank();
          print("Opening GitHub...");
          window.open(CONFIG.github, "_blank", "noopener");
          break;


        case "natal":
          blank();

          const natal =
            document.querySelector("#natal") ||
            document.querySelector(".natal") ||
            document.querySelector("[data-natal]");

          if (natal) {
            print("Locating natal chart...");

            natal.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

            closeTerminal();
          } else {
            print("Natal chart unavailable.");
          }

          break;


        case "time":
          blank();

          const time =
            document.getElementById("bw-local-time")?.textContent;

          print(`LOCAL / ${time || "UNKNOWN"}`);
          print("TIMEZONE / AUSTRALIA");
          break;


        case "visitor":
          blank();

          const visitor =
            document.getElementById("bw-visitor-count")?.textContent;

          print(`VISITOR / ${visitor || "UNKNOWN"}`);
          break;


        case "devmode":
          toggleDeveloperMode();
          blank();

          print(
            document.documentElement.classList.contains("bw-dev-mode")
              ? "DEVELOPER MODE ENABLED"
              : "DEVELOPER MODE DISABLED"
          );

          break;


        case "nomad":
          blank();
          print("WELCOME BACK, GHOST.");
          blank();
          print("LOCATION / AUROA");
          print("STATUS   / ACTIVE");
          print("MISSION  / CLASSIFIED");
          print("LOADOUT  / MODIFIED");
          break;


        case "walker":
          blank();
          print("IDENTITY CONFIRMED.");
          print("WELCOME BACK, BLAKE.");
          break;


        case "ghost":
          blank();
          print("GHOST LEAD ONLINE.");
          print("TACTICAL SYSTEMS READY.");
          break;


        case "breakpoint":
          blank();
          print("AUROA CONNECTION ESTABLISHED.");
          print("MOD STATUS / HEAVILY MODIFIED");
          break;


        case "clear":
          output.innerHTML = "";
          break;


        default:
          blank();
          print(`COMMAND NOT FOUND / ${command}`);
          print('Type "help".');
      }

      blank();
    }


    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;

      const command = input.value;

      input.value = "";

      executeCommand(command);
    });
  }


  /* =========================================================
     DEVELOPER MODE
  ========================================================= */

function toggleDeveloperMode() {
  const root = document.documentElement;

  root.classList.toggle("bw-dev-mode");

  const enabled = root.classList.contains("bw-dev-mode");

  console.log(
    enabled
      ? "Developer Mode Enabled"
      : "Developer Mode Disabled"
  );
}

  /* =========================================================
     HERO EASTER EGG
  ========================================================= */

  function initHeroEasterEgg() {
    const hero =
      document.querySelector(".hero__name") ||
      document.querySelector(".spindle") ||
      document.querySelector("h1");

    if (!hero) return;

    let clicks = 0;
    let timer;

    hero.style.cursor = "default";

    hero.addEventListener("click", () => {
      clicks++;

      clearTimeout(timer);

      timer = setTimeout(() => {
        clicks = 0;
      }, 1800);

      if (clicks >= 5) {
        clicks = 0;

        hero.classList.add("bw-glitch");

        const secret = document.createElement("div");

        secret.className = "bw-secret-message";
        secret.textContent = "SYSTEM // UNLOCKED";

        document.body.appendChild(secret);

        requestAnimationFrame(() => {
          secret.classList.add("visible");
        });

        setTimeout(() => {
          hero.classList.remove("bw-glitch");

          secret.classList.remove("visible");

          setTimeout(() => secret.remove(), 500);

        }, 1800);
      }
    });
  }


  /* =========================================================
     KONAMI-STYLE SECRET

     Type:
     G H O S T

     anywhere outside an input.
  ========================================================= */

  function initKeyboardSecret() {
    const secret = "ghost";
    let typed = "";

    document.addEventListener("keydown", (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key.length !== 1) return;

      typed += event.key.toLowerCase();

      typed = typed.slice(-secret.length);

      if (typed === secret) {
        showGhostMessage();
        typed = "";
      }
    });
  }


  function showGhostMessage() {
    const message = document.createElement("div");

    message.className = "bw-ghost-message";

    message.innerHTML = `
      <span>WELCOME BACK, GHOST.</span>
      <small>AUROA // CONNECTION ESTABLISHED</small>
    `;

    document.body.appendChild(message);

    requestAnimationFrame(() => {
      message.classList.add("visible");
    });

    setTimeout(() => {
      message.classList.remove("visible");

      setTimeout(() => {
        message.remove();
      }, 500);

    }, 2500);
  }


  /* =========================================================
     INITIALISE
  ========================================================= */

  function init() {
    createBootScreen();
    createLocalTime();
    initVisitorCounter();
    createTerminal();
    initHeroEasterEgg();
    initKeyboardSecret();
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();