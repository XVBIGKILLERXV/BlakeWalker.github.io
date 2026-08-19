(() => {
  "use strict";

  const CONFIG = {
    timezone: "Australia/Sydney",
    terminalTitle: "BLAKE://TERMINAL",
    github: "https://github.com/XVBIGKILLERXV",
    discord: "https://discord.com/users/417191267546562560",
    currentlyModding: "Ghost Recon Breakpoint",

    projects: [
      "Nexora",
      "The Corrections Assistant Bot [PRIVATE]",
      "Corrections Control Center Bot [PRIVATE]",
      "Experiments"
    ]
  };

  /* ========================================================
     BOOT SCREEN
  ======================================================== */

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

    const lines = boot.querySelectorAll(".bw-boot-lines div");

    lines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add("visible");
      }, 150 + index * 170);
    });

    setTimeout(() => {
      if (lines[2]) {
        lines[2].textContent = "DISCORD ........ READY";
      }
    }, 850);

    setTimeout(() => {
      boot.classList.add("bw-boot-hide");

      sessionStorage.setItem(
        "bw_boot_complete",
        "true"
      );

      setTimeout(() => {
        boot.remove();
      }, 700);

    }, 1700);
  }


  /* ========================================================
     LOCAL TIME + VISITOR
  ======================================================== */

  function createSystemInfo() {
    const widget = document.createElement("div");

    widget.className = "bw-system-info";

    widget.innerHTML = `
      <div class="bw-info-block">
        <span class="bw-info-label">
          LOCAL / AU
        </span>

        <span
          id="bw-local-time"
          class="bw-info-value"
        >
          --:--:--
        </span>

        <span
          id="bw-local-date"
          class="bw-info-small"
        ></span>
      </div>

      <div class="bw-info-block">
        <span class="bw-info-label">
          VISITOR
        </span>

        <span
          id="bw-visitor-count"
          class="bw-info-value bw-visitor"
        >
          ------
        </span>
      </div>
    `;

    document.body.appendChild(widget);

    updateClock();
    setInterval(updateClock, 1000);

    initVisitorCounter();
  }


  function updateClock() {
    const now = new Date();

    const time = new Intl.DateTimeFormat(
      "en-AU",
      {
        timeZone: CONFIG.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    ).format(now);

    const date = new Intl.DateTimeFormat(
      "en-AU",
      {
        timeZone: CONFIG.timezone,
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    ).format(now);

    const timeElement =
      document.getElementById("bw-local-time");

    const dateElement =
      document.getElementById("bw-local-date");

    if (timeElement) {
      timeElement.textContent = time;
    }

    if (dateElement) {
      dateElement.textContent =
        date.toUpperCase();
    }
  }


  function initVisitorCounter() {
    const display =
      document.getElementById("bw-visitor-count");

    if (!display) return;

    let visits = Number(
      localStorage.getItem("bw_visit_count") || 0
    );

    if (
      !sessionStorage.getItem(
        "bw_visit_counted"
      )
    ) {
      visits++;

      localStorage.setItem(
        "bw_visit_count",
        visits
      );

      sessionStorage.setItem(
        "bw_visit_counted",
        "true"
      );
    }

    display.textContent =
      String(visits).padStart(6, "0");

    display.addEventListener(
      "click",
      () => {
        const original =
          display.textContent;

        display.textContent =
          "WATCHING";

        setTimeout(() => {
          display.textContent =
            original;
        }, 900);
      }
    );
  }


  /* ========================================================
     DEVELOPER MODE
  ======================================================== */

  function developerModeEnabled() {
    return document.documentElement
      .classList
      .contains("bw-dev-mode");
  }


  function toggleDeveloperMode() {
    document.documentElement
      .classList
      .toggle("bw-dev-mode");

    return developerModeEnabled();
  }


  /* ========================================================
     TERMINAL
  ======================================================== */

  function createTerminal() {

    const launcher =
      document.createElement("button");

    launcher.type = "button";
    launcher.className =
      "bw-terminal-launcher";

    launcher.setAttribute(
      "aria-label",
      "Open terminal"
    );

    launcher.textContent = ">_";

    document.body.appendChild(launcher);


    const terminal =
      document.createElement("div");

    terminal.className = "bw-terminal";

    terminal.innerHTML = `
      <div class="bw-terminal-window">

        <div class="bw-terminal-header">

          <span>
            ${CONFIG.terminalTitle}
          </span>

          <button
            type="button"
            class="bw-terminal-close"
          >
            ×
          </button>

        </div>

        <div
          id="bw-terminal-output"
          class="bw-terminal-output"
        ></div>

        <div class="bw-terminal-input-row">

          <span class="bw-terminal-prompt">
            &gt;
          </span>

          <input
            id="bw-terminal-input"
            class="bw-terminal-input"
            type="text"
            autocomplete="off"
            spellcheck="false"
          >

        </div>

      </div>
    `;

    document.body.appendChild(terminal);


    const output =
      terminal.querySelector(
        "#bw-terminal-output"
      );

    const input =
      terminal.querySelector(
        "#bw-terminal-input"
      );

    const close =
      terminal.querySelector(
        ".bw-terminal-close"
      );


    function print(
      text = "",
      className = ""
    ) {
      const line =
        document.createElement("div");

      line.className =
        `bw-terminal-line ${className}`;

      line.textContent = text;

      output.appendChild(line);

      output.scrollTop =
        output.scrollHeight;
    }


    function openTerminal() {
      terminal.classList.add("open");

      if (!output.dataset.started) {
        print("BLAKE://TERMINAL");
        print("SYSTEM READY");
        print("");
        print(
          'Type "help" for available commands.'
        );

        output.dataset.started =
          "true";
      }

      setTimeout(() => {
        input.focus();
      }, 50);
    }


    function closeTerminal() {
      terminal.classList.remove("open");
    }


    function normalHelp() {
      print("");
      print("AVAILABLE COMMANDS");
      print("");
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
      print("");
      print("There may be other commands.");
    }


    function devHelp() {
      normalHelp();

      print("");
      print("DEV COMMANDS");
      print("");
      print("system");
      print("build");
      print("whoami");
      print("inspect");
      print("projects --verbose");
      print("exit");
    }


    function runCommand(raw) {

      const command =
        raw.trim().toLowerCase();

      if (!command) return;

      print(
        `> ${raw}`,
        "command"
      );


      switch (command) {

        case "help":

          if (developerModeEnabled()) {
            devHelp();
          } else {
            normalHelp();
          }

          break;


        case "about":

          print("");
          print("BLAKE WALKER");
          print("Creative Developer");
          print("Australia");
          print("");
          print(
            "Building projects, Discord systems,"
          );
          print(
            "experiments and whatever comes next."
          );

          break;


        case "projects":

          print("");
          print("SELECTED WORK");
          print("");

          CONFIG.projects.forEach(
            (project, index) => {

              print(
                `${String(index + 1)
                  .padStart(2, "0")} / ${project}`
              );

            }
          );

          break;


        case "private":

          print("");
          print("PRIVATE PROJECTS");
          print("");
          print(
            "The Corrections Assistant Bot"
          );
          print(
            "Corrections Control Center Bot"
          );
          print("");
          print(
            "SOURCE / [REDACTED]"
          );
          print(
            "ACCESS / CONTACT OWNER"
          );

          break;


        case "status":

          print("");
          print("SYSTEM / ONLINE");
          print("BUILDING / NEXORA");
          print(
            `MODDING / ${CONFIG.currentlyModding}`
          );
          print("LOCATION / AUSTRALIA");

          break;


        case "modding":

          print("");
          print("CURRENTLY MODDING");
          print("");
          print(
            CONFIG.currentlyModding
          );
          print("STATUS / ACTIVE");
          print("");
          print(
            "Vanilla was only the starting point."
          );

          break;


        case "discord":

          print("");
          print("Opening Discord...");

          window.open(
            CONFIG.discord,
            "_blank",
            "noopener"
          );

          break;


        case "github":

          print("");
          print("Opening GitHub...");

          window.open(
            CONFIG.github,
            "_blank",
            "noopener"
          );

          break;


        case "time":

          print("");

          print(
            `LOCAL / ${
              document.getElementById(
                "bw-local-time"
              )?.textContent || "UNKNOWN"
            }`
          );

          print(
            "TIMEZONE / AUSTRALIA"
          );

          break;


        case "visitor":

          print("");

          print(
            `VISITOR / ${
              document.getElementById(
                "bw-visitor-count"
              )?.textContent || "UNKNOWN"
            }`
          );

          break;


        case "natal": {

          print("");

          const natal =
            document.querySelector("#natal") ||
            document.querySelector(".natal") ||
            document.querySelector(
              "[data-natal]"
            );

          if (natal) {

            print(
              "Locating natal chart..."
            );

            natal.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

            setTimeout(
              closeTerminal,
              300
            );

          } else {

            print(
              "Natal chart unavailable."
            );

          }

          break;
        }


        case "devmode": {

          const enabled =
            toggleDeveloperMode();

          print("");

          print(
            enabled
              ? "DEVELOPER MODE ENABLED"
              : "DEVELOPER MODE DISABLED"
          );

          if (enabled) {
            print(
              'Type "help" for developer commands.'
            );
          }

          break;
        }


        case "system":

          if (!developerModeEnabled()) {
            print("");
            print("ACCESS DENIED.");
            break;
          }

          print("");
          print(
            "BLAKE.WALKER // SYSTEM"
          );
          print("");
          print(
            "HOST          GITHUB_PAGES"
          );
          print(
            "ENVIRONMENT   PRODUCTION"
          );
          print(
            "THEME         PURPLE"
          );
          print(
            "NATAL         LOADED"
          );
          print(
            "DISCORD       LANYARD"
          );
          print(
            "TERMINAL      ONLINE"
          );

          break;


        case "build":

          if (!developerModeEnabled()) {
            print("");
            print("ACCESS DENIED.");
            break;
          }

          print("");
          print("BUILD / BLAKE.WALKER");
          print("VERSION / 1.0");
          print("HOST / GITHUB PAGES");
          print("STATUS / PRODUCTION");

          break;


        case "whoami":

          if (!developerModeEnabled()) {
            print("");
            print("VISITOR");
            break;
          }

          print("");
          print("USER / DEVELOPER");
          print("OWNER / BLAKE WALKER");
          print(
            "HANDLE / XVBIGKILLERXV"
          );

          break;


        case "inspect":

          if (!developerModeEnabled()) {
            print("");
            print("ACCESS DENIED.");
            break;
          }

          print("");
          print("PAGE MODULES");
          print("");
          print(
            "IDENTITY        ACTIVE"
          );
          print(
            "SUBTAG          ACTIVE"
          );
          print(
            "SELECTED_WORK   ACTIVE"
          );
          print(
            "NATAL           ACTIVE"
          );
          print(
            "DISCORD         ACTIVE"
          );
          print(
            "TERMINAL        ACTIVE"
          );

          break;


        case "projects --verbose":

          if (!developerModeEnabled()) {
            print("");
            print("ACCESS DENIED.");
            break;
          }

          print("");
          print("01 / NEXORA");
          print(
            "TYPE        DISCORD_BOT"
          );
          print(
            "STATUS      DEVELOPMENT"
          );
          print("");
          print(
            "02 / CORRECTIONS_ASSISTANT"
          );
          print(
            "TYPE        DISCORD_BOT"
          );
          print(
            "VISIBILITY  PRIVATE"
          );
          print(
            "SOURCE      [REDACTED]"
          );
          print("");
          print(
            "03 / CORRECTIONS_CONTROL"
          );
          print(
            "TYPE        DISCORD_BOT"
          );
          print(
            "VISIBILITY  PRIVATE"
          );
          print(
            "SOURCE      [REDACTED]"
          );
          print("");
          print(
            "04 / EXPERIMENTS"
          );
          print(
            "TYPE        PROTOTYPES"
          );

          break;


        case "exit":

          if (developerModeEnabled()) {
            toggleDeveloperMode();

            print("");
            print(
              "DEVELOPER MODE DISABLED"
            );
          }

          break;


        /* --------------------------
           SECRET COMMANDS
        -------------------------- */

        case "nomad":

          print("");
          print(
            "WELCOME BACK, GHOST."
          );
          print("");
          print(
            "LOCATION / AUROA"
          );
          print(
            "STATUS   / ACTIVE"
          );
          print(
            "MISSION  / CLASSIFIED"
          );
          print(
            "LOADOUT  / MODIFIED"
          );

          break;


        case "ghost":

          print("");
          print(
            "GHOST LEAD ONLINE."
          );
          print(
            "TACTICAL SYSTEMS READY."
          );

          break;


        case "breakpoint":

          print("");
          print(
            "AUROA CONNECTION ESTABLISHED."
          );
          print(
            "MOD STATUS / HEAVILY MODIFIED"
          );

          break;


        case "walker":

          print("");
          print(
            "IDENTITY CONFIRMED."
          );
          print(
            "WELCOME BACK, BLAKE."
          );

          break;


        case "clear":

          output.innerHTML = "";

          break;


        default:

          print("");
          print(
            `COMMAND NOT FOUND / ${command}`
          );
          print(
            'Type "help".'
          );
      }

      print("");
    }


    launcher.addEventListener(
      "click",
      openTerminal
    );

    close.addEventListener(
      "click",
      closeTerminal
    );


    input.addEventListener(
      "keydown",
      event => {

        if (event.key !== "Enter") {
          return;
        }

        const command =
          input.value;

        input.value = "";

        runCommand(command);
      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          terminal.classList.contains(
            "open"
          )
        ) {
          closeTerminal();
        }

      }
    );
  }


  /* ========================================================
     KEYBOARD EASTER EGG

     Type GHOST while browsing.
  ======================================================== */

  function initKeyboardSecret() {

    let typed = "";

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.target instanceof
            HTMLInputElement ||
          event.target instanceof
            HTMLTextAreaElement
        ) {
          return;
        }

        if (event.key.length !== 1) {
          return;
        }

        typed +=
          event.key.toLowerCase();

        typed =
          typed.slice(-5);

        if (typed === "ghost") {
          showGhostMessage();
          typed = "";
        }

      }
    );
  }


  function showGhostMessage() {

    const message =
      document.createElement("div");

    message.className =
      "bw-ghost-message";

    message.innerHTML = `
      <span>
        WELCOME BACK, GHOST.
      </span>

      <small>
        AUROA // CONNECTION ESTABLISHED
      </small>
    `;

    document.body.appendChild(
      message
    );

    requestAnimationFrame(() => {
      message.classList.add(
        "visible"
      );
    });

    setTimeout(() => {

      message.classList.remove(
        "visible"
      );

      setTimeout(() => {
        message.remove();
      }, 500);

    }, 2500);
  }


  /* ========================================================
     START
  ======================================================== */

  function init() {
    createBootScreen();
    createSystemInfo();
    createTerminal();
    initKeyboardSecret();
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();