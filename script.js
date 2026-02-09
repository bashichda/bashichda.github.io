// Terminal Interactive Script 1
document.addEventListener("DOMContentLoaded", function () {
  // Add CSS fixes for highlights
  const style = document.createElement("style");
  style.textContent = `
        .text-secondary,
        .text-background,
        .cursor {
            line-height: 1.2;
            vertical-align: baseline;
            display: inline;
        }
        
        .terminal-input-container {
            line-height: 1.2;
        }
        
        .command-echo,
        .help-output,
        .error-output {
            line-height: 1.5;
        }
        
        /* Fix for highlight spans */
        span {
            line-height: inherit;
        }
        
        /* Fix for h3 background */
        h3 {
            display: inline-block !important;
            width: fit-content !important;
        }
    `;
  document.head.appendChild(style);

  // Hide all sections initially
  const output = document.querySelector(".output");
  const sections = {
    links: document.querySelector(".links").parentElement,
    bio: output.querySelectorAll("p")[0],
    interests: findSectionByCommand("glow interests.md"),
    contact: findSectionByCommand("contact"),
  };

  // Show mode selection screen
  showModeSelection();

  function showModeSelection() {
    // Hide everything initially
    hideAllSections();

    // Create mode selection overlay
    const modeOverlay = document.createElement("div");
    modeOverlay.className = "mode-selection-overlay";
    modeOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

    const modeContainer = document.createElement("div");
    modeContainer.className = "mode-container";
    modeContainer.style.cssText = `
            text-align: center;
            color: #a9b1d6;
            font-family: 'Fira Code', monospace;
        `;

    modeContainer.innerHTML = `
            <h2 style="color: #7aa2f7; font-size: 2rem; margin-bottom: 30px;">Welcome to bashichda's page</h2>
            <p style="font-size: 1.2rem; margin-bottom: 40px;">How would you like to view this page?</p>
            <div style="display: flex; gap: 30px; justify-content: center;">
                <button id="normalModeBtn" style="
                    background: #7aa2f7;
                    color: #1a1b26;
                    border: none;
                    padding: 15px 30px;
                    font-size: 1.1rem;
                    font-family: 'Fira Code', monospace;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s;
                ">
                    📄 Normal View
                </button>
                <button id="terminalModeBtn" style="
                    background: #9ece6a;
                    color: #1a1b26;
                    border: none;
                    padding: 15px 30px;
                    font-size: 1.1rem;
                    font-family: 'Fira Code', monospace;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s;
                ">
                    💻 Terminal Mode
                </button>
            </div>
            <p style="font-size: 0.9rem; margin-top: 30px; color: #565f89;">
                Normal View: Classic webpage layout<br>
                Terminal Mode: Interactive command-line interface
            </p>
        `;

    modeOverlay.appendChild(modeContainer);
    document.body.appendChild(modeOverlay);

    // Add hover effects
    const buttons = modeContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.05)";
        this.style.boxShadow = "0 0 20px rgba(122, 162, 247, 0.5)";
      });
      btn.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)";
        this.style.boxShadow = "none";
      });
    });

    // Handle mode selection
    document
      .getElementById("normalModeBtn")
      .addEventListener("click", function () {
        modeOverlay.remove();
        initNormalMode();
      });

    document
      .getElementById("terminalModeBtn")
      .addEventListener("click", function () {
        modeOverlay.remove();
        initTerminalMode();
      });
  }

  function initNormalMode() {
    // Show all content normally
    const allParagraphs = output.querySelectorAll("p");
    const allDivs = output.querySelectorAll("div");
    const allH3s = output.querySelectorAll("h3");
    const allUls = output.querySelectorAll("ul");

    allParagraphs.forEach((p) => (p.style.display = "block"));
    allDivs.forEach((div) => (div.style.display = "block"));
    allH3s.forEach((h3) => (h3.style.display = "inline-block"));
    allUls.forEach((ul) => (ul.style.display = "block"));
  }

  function initTerminalMode() {
    // Hide all sections on load
    hideAllSections();

    // Create terminal input area
    createTerminalInput();

    // Show help after a short delay
    setTimeout(() => {
      showHelp();
    }, 500);
  }

  function hideAllSections() {
    const allParagraphs = output.querySelectorAll("p");
    const allDivs = output.querySelectorAll("div");
    const allH3s = output.querySelectorAll("h3");
    const allUls = output.querySelectorAll("ul");

    allParagraphs.forEach((p) => (p.style.display = "none"));
    allDivs.forEach((div) => {
      // Don't hide terminal input or dynamically created elements
      if (
        !div.classList.contains("terminal-input-container") &&
        !div.classList.contains("command-echo") &&
        !div.classList.contains("help-output") &&
        !div.classList.contains("error-output") &&
        !div.classList.contains("terminal-prompt")
      ) {
        div.style.display = "none";
      }
    });
    allH3s.forEach((h3) => (h3.style.display = "none"));
    allUls.forEach((ul) => (ul.style.display = "none"));
  }

  function findSectionByCommand(command) {
    const divs = output.querySelectorAll("div");
    for (let div of divs) {
      if (div.textContent.includes(command)) {
        return div;
      }
    }
    return null;
  }

  function createTerminalInput() {
    const inputContainer = document.createElement("div");
    inputContainer.className = "terminal-input-container";
    inputContainer.style.marginTop = "20px";

    const prompt = document.createElement("div");
    prompt.className = "terminal-prompt";
    prompt.innerHTML = `
            <span class="text-secondary">bashichda@ichdabrain </span>
            <span class="text-background">~ </span>
            <span class="cursor">$ </span>
        `;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";
    input.placeholder = "Type a command...";
    input.autocomplete = "off";
    input.autofocus = true;

    // Style the input to look like terminal
    input.style.cssText = `
            background: transparent;
            border: none;
            color: #a9b1d6;
            font-family: 'Fira Code', monospace;
            font-size: 1rem;
            outline: none;
            width: calc(100% - 250px);
            display: inline-block;
        `;

    prompt.style.display = "inline-block";

    inputContainer.appendChild(prompt);
    inputContainer.appendChild(input);
    output.appendChild(inputContainer);

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    // Handle command input
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const command = input.value.trim().toLowerCase();
        if (command) {
          commandHistory.unshift(command);
          historyIndex = -1;
          executeCommand(command);
          input.value = "";
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex];
        } else {
          historyIndex = -1;
          input.value = "";
        }
      }
    });

    // Keep focus on input
    document.addEventListener("click", function () {
      input.focus();
    });
  }

  function executeCommand(command) {
    // Remove previous dynamic content (help and error messages)
    const oldHelp = document.querySelectorAll(".help-output");
    const oldError = document.querySelectorAll(".error-output");
    oldHelp.forEach((h) => h.remove());
    oldError.forEach((e) => e.remove());

    // Show command echo
    const commandEcho = document.createElement("div");
    commandEcho.className = "command-echo";
    commandEcho.innerHTML = `
            <span class="text-secondary">bashichda@ichdabrain </span>
            <span class="text-background">~ </span>
            <span class="cursor">$ </span>${command}
        `;
    commandEcho.style.marginBottom = "10px";

    // Insert before the input container
    const inputContainer = document.querySelector(".terminal-input-container");
    output.insertBefore(commandEcho, inputContainer);

    // Execute commands
    switch (command) {
      case "me -h":
      case "me":
        hideAllSections();
        showAboutMe();
        break;

      case "glow interests.md":
      case "interests":
        hideAllSections();
        showInterests();
        break;

      case "contact":
        hideAllSections();
        showContact();
        break;

      case "links":
      case "socials":
        hideAllSections();
        showLinks();
        break;

      case "all":
        hideAllSections();
        showAll();
        break;

      case "clear":
      case "cls":
        clearTerminal();
        return; // Don't scroll for clear command

      case "help":
        hideAllSections();
        showHelp();
        break;

      default:
        hideAllSections();
        showError(command);
    }

    // Scroll to bottom
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  }

  function showAboutMe() {
    const links = document.querySelector(".links");
    const bio = output.querySelectorAll("p")[0];

    if (links) links.style.display = "block";
    if (bio) bio.style.display = "block";
  }

  function showInterests() {
    const divs = Array.from(output.querySelectorAll("div"));
    for (let div of divs) {
      if (div.textContent.includes("glow interests.md")) {
        div.style.display = "block";
        // Show the h3 and ul after this div
        let next = div.nextElementSibling;
        while (next && (next.tagName === "H3" || next.tagName === "UL")) {
          next.style.display = "inline-block";
          if (next.tagName === "UL") {
            next.style.display = "block";
            break;
          }
          next = next.nextElementSibling;
        }
        break;
      }
    }
  }

  function showContact() {
    const divs = Array.from(output.querySelectorAll("div"));
    for (let div of divs) {
      if (
        div.textContent.includes("$ contact") &&
        !div.classList.contains("terminal-input-container")
      ) {
        div.style.display = "block";
        // Show the h3 and ul after this div
        let next = div.nextElementSibling;
        while (next && (next.tagName === "H3" || next.tagName === "UL")) {
          next.style.display = "inline-block";
          if (next.tagName === "UL") {
            next.style.display = "block";
            break;
          }
          next = next.nextElementSibling;
        }
        break;
      }
    }
  }

  function showLinks() {
    const links = document.querySelector(".links");
    if (links) links.style.display = "block";
  }

  function showAll() {
    const allParagraphs = output.querySelectorAll("p");
    const allDivs = output.querySelectorAll("div");
    const allH3s = output.querySelectorAll("h3");
    const allUls = output.querySelectorAll("ul");

    allParagraphs.forEach((p) => (p.style.display = "block"));
    allDivs.forEach((div) => {
      if (
        !div.classList.contains("terminal-input-container") &&
        !div.classList.contains("command-echo")
      ) {
        div.style.display = "block";
      }
    });
    allH3s.forEach((h3) => (h3.style.display = "inline-block"));
    allUls.forEach((ul) => (ul.style.display = "block"));
  }

  function clearTerminal() {
    const echos = document.querySelectorAll(".command-echo");
    const helpOutputs = document.querySelectorAll(".help-output");
    const errorOutputs = document.querySelectorAll(".error-output");

    echos.forEach((echo) => echo.remove());
    helpOutputs.forEach((help) => help.remove());
    errorOutputs.forEach((error) => error.remove());
    hideAllSections();

    // Re-focus the input
    const input = document.querySelector(".terminal-input");
    if (input) {
      input.focus();
    }
  }

  function showHelp() {
    const helpDiv = document.createElement("div");
    helpDiv.className = "help-output";
    helpDiv.innerHTML = `
            <h3>Available Commands:</h3>
            <ul>
                <li><span class="text-secondary">me -h</span> or <span class="text-secondary">me</span> - Show about me & social links</li>
                <li><span class="text-secondary">glow interests.md</span> or <span class="text-secondary">interests</span> - Show interests</li>
                <li><span class="text-secondary">contact</span> - Show contact information</li>
                <li><span class="text-secondary">links</span> or <span class="text-secondary">socials</span> - Show social media links</li>
                <li><span class="text-secondary">all</span> - Show everything</li>
                <li><span class="text-secondary">clear</span> or <span class="text-secondary">cls</span> - Clear terminal</li>
                <li><span class="text-secondary">help</span> - Show this help message</li>
            </ul>
        `;

    const inputContainer = document.querySelector(".terminal-input-container");
    output.insertBefore(helpDiv, inputContainer);
  }

  function showError(command) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-output";
    errorDiv.innerHTML = `
            <p style="color: #f7768e;">bash: ${command}: command not found</p>
            <p>Type <span class="text-secondary">help</span> to see available commands.</p>
        `;

    const inputContainer = document.querySelector(".terminal-input-container");
    output.insertBefore(errorDiv, inputContainer);
  }
});
