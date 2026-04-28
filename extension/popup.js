// ── Helpers ──────────────────────────────────────────────────────────────────

function showStatus(msg, isError = false) {
    const el = document.getElementById("status");
    el.textContent = msg;
    el.className = "status" + (isError ? " error" : "");
    setTimeout(() => { el.textContent = ""; el.className = "status"; }, 2500);
}

function getFormValues() {
    return {
        name: document.getElementById("name").value.trim(),
        age: document.getElementById("age").value.trim(),
        gender: document.getElementById("gender").value,
        berth: document.getElementById("berth").value,
    };
}

function setFormValues({ name = "", age = "", gender = "Male", berth = "NO" } = {}) {
    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("gender").value = gender;
    document.getElementById("berth").value = berth;
}

// ── Profile list rendering ────────────────────────────────────────────────────

function renderProfiles(profiles) {
    const select = document.getElementById("profiles");
    const current = select.value;
    select.innerHTML = '<option value="">-- Select a profile --</option>';

    profiles.forEach((p, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${p.name} (${p.age}, ${p.gender})`;
        select.appendChild(opt);
    });

    // Restore previous selection if still valid
    if (current !== "" && current < profiles.length) {
        select.value = current;
    }
}

// ── Load profiles from storage on startup ────────────────────────────────────

function loadProfiles(callback) {
    chrome.storage.local.get("profiles", (data) => {
        const profiles = data.profiles || [];
        renderProfiles(profiles);
        if (callback) callback(profiles);
    });
}

// ── Add / Save Profile ────────────────────────────────────────────────────────

document.getElementById("addProfile").addEventListener("click", () => {
    const profile = getFormValues();

    if (!profile.name || !profile.age) {
        showStatus("Name and Age are required.", true);
        return;
    }

    chrome.storage.local.get("profiles", (data) => {
        const profiles = data.profiles || [];
        profiles.push(profile);
        chrome.storage.local.set({ profiles }, () => {
            showStatus(`✓ Profile "${profile.name}" saved!`);
            loadProfiles();
        });
    });
});

// ── Load Selected Profile into form ──────────────────────────────────────────

document.getElementById("loadProfile").addEventListener("click", () => {
    const idx = document.getElementById("profiles").value;
    if (idx === "") { showStatus("Select a profile first.", true); return; }

    chrome.storage.local.get("profiles", (data) => {
        const profiles = data.profiles || [];
        const profile = profiles[parseInt(idx, 10)];
        if (profile) {
            setFormValues(profile);
            showStatus(`✓ Loaded "${profile.name}"`);
        }
    });
});

// ── Delete Selected Profile ───────────────────────────────────────────────────

document.getElementById("deleteProfile").addEventListener("click", () => {
    const idx = document.getElementById("profiles").value;
    if (idx === "") { showStatus("Select a profile to delete.", true); return; }

    chrome.storage.local.get("profiles", (data) => {
        const profiles = data.profiles || [];
        const removed = profiles.splice(parseInt(idx, 10), 1);
        chrome.storage.local.set({ profiles }, () => {
            showStatus(`✓ Deleted "${removed[0]?.name}"`);
            setFormValues();
            loadProfiles();
        });
    });
});

// ── Fill IRCTC Form via content script ───────────────────────────────────────

document.getElementById("fillForm").addEventListener("click", () => {
    const profile = getFormValues();

    if (!profile.name || !profile.age) {
        showStatus("Fill in Name and Age first.", true);
        return;
    }

    // Store the active profile so content.js can read it
    chrome.storage.local.set({ activeProfile: profile }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];

            if (!tab?.url?.includes("irctc.co.in")) {
                showStatus("Open IRCTC website first.", true);
                return;
            }

            chrome.scripting.executeScript(
                { target: { tabId: tab.id }, files: ["content.js"] },
                () => {
                    if (chrome.runtime.lastError) {
                        showStatus("Could not inject script.", true);
                    } else {
                        showStatus("✓ Form filled!");
                    }
                }
            );
        });
    });
});

// ── Init ──────────────────────────────────────────────────────────────────────

loadProfiles();
