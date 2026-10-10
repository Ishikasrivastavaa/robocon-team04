// ROBOCON Team 04 — Vanilla JavaScript interactions
// Team photos: put files in assets/team/ using the filename shown in teamMembers.

const teamMembers = [
  { group: "UNDER SPACED", domain: "UNDER SPACED", role: "INTER-DOMAIN MEMBER", name: "Souvik", slug: "souvik" },
  { group: "UNDER SPACED", domain: "UNDER SPACED", role: "INTER-DOMAIN MEMBER", name: "Mayukh", slug: "mayukh" },
  { group: "UNDER SPACED", domain: "UNDER SPACED", role: "WEB DEVELOPMENT", name: "Ishika Srivastava", slug: "ishika-srivastava" },

  { group: "SEISED", domain: "SEISED", role: "INTER-DOMAIN MEMBER", name: "Eshanth", slug: "eshanth" },
  { group: "SEISED", domain: "SEISED", role: "INTER-DOMAIN MEMBER", name: "Oishee", slug: "oishee" },

  { group: "SAMBED", domain: "SAMBED", role: "INTER-DOMAIN MEMBER", name: "Suryansh", slug: "suryansh" },
  { group: "SAMBED", domain: "SAMBED", role: "INTER-DOMAIN MEMBER", name: "Tiasa", slug: "tiasa" },

  { group: "VFX", domain: "VFX", role: "VFX", name: "Suvith", slug: "suvith" },
  { group: "CORPORATE", domain: "CORPORATE", role: "CORPORATE", name: "Lavanya", slug: "lavanya" }
];

const subsystemInfo = {
  vision: {
    title: "CAMERA / VISION",
    description: "The long-term concept uses a camera to observe the marked course ahead. The team discussed a camera-based route, but integration is still a development question alongside the current sensor bring-up.",
    status: "DEVELOPMENT CONCEPT"
  },
  controller: {
    title: "ESP32-S3",
    description: "The embedded controller is intended to coordinate sensor input, servo control and motor logic. Pin mapping, power stability and the final integration split must be confirmed against the actual build.",
    status: "EMBEDDED INTEGRATION"
  },
  control: {
    title: "CONTROL LOGIC",
    description: "PID and speed-management logic are part of the intended control strategy. The parameter values shown on this site are not tuned vehicle values; the algorithm must be verified through controlled testing.",
    status: "UNDER TEST"
  },
  actuation: {
    title: "SERVO + DRIVE",
    description: "The team reported the steering servo turning on 9 October. Motor RPM and driver compatibility were still being investigated; full drive integration is not claimed as complete.",
    status: "INTEGRATION TESTING"
  }
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function initials(name) {
  return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function renderTeam() {
  const host = $("#teamGroups");
  const order = ["UNDER SPACED", "SEISED", "SAMBED", "VFX", "CORPORATE"];

  host.innerHTML = order.map((group, groupIndex) => {
    const people = teamMembers.filter(member => member.group === group);
    return `
      <section class="team-group reveal">
        <div class="group-heading">
          <h3>${group}</h3>
          <span>${String(groupIndex + 1).padStart(2, "0")} / ${String(people.length).padStart(2, "0")} MEMBERS</span>
        </div>
        <div class="member-grid">
          ${people.map((person, index) => `
            <article class="member-card">
              <div class="member-photo">
                <span class="member-num">${String(index + 1).padStart(2, "0")}</span>
                <div class="avatar-3d" aria-hidden="true">
                  <div class="avatar-orbit orbit-outer"></div><div class="avatar-orbit orbit-inner"></div>
                  <div class="avatar-head"></div><div class="avatar-neck"></div><div class="avatar-shoulders"></div>
                  <span class="avatar-initials">${initials(person.name)}</span>
                </div>
                <span class="photo-caption">PHOTO SLOT / ADD LATER</span>
                <img src="assets/team/${person.slug}.jpg" alt="${person.name}" loading="lazy">
              </div>
              <div class="member-meta">
                <h4>${person.name}</h4>
                <span class="domain-label">${person.domain}</span>
                <span class="person-role">${person.role}</span>
                <span class="first-year">B.TECH · FIRST YEAR</span>
              </div>
              <div class="member-footnote">TEAM 04 / ROBOCON</div>
            </article>
          `).join("")}
        </div>
      </section>`;
  }).join("");

  // If a matching portrait exists later, show it and hide the placeholder monogram.
  $$(".member-photo img").forEach(img => {
    img.addEventListener("load", () => {
      img.style.display = "block";
      const wrapper = img.closest(".member-photo");
      wrapper.querySelector(".avatar-3d").style.display = "none";
      wrapper.querySelector(".photo-caption").style.display = "none";
    });
    img.addEventListener("error", () => { img.style.display = "none"; });
  });
}

function initIntro() {
  const intro = $("#introSequence");
  const skip = $("#skipIntro");
  if (!intro) return;

  const finish = () => {
    intro.classList.add("finished");
    window.setTimeout(() => intro.remove(), 850);
    try { sessionStorage.setItem("roboconIntroSeen", "1"); } catch (_) {}
  };

  let seen = false;
  try { seen = sessionStorage.getItem("roboconIntroSeen") === "1"; } catch (_) {}
  if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    intro.classList.add("finished");
    window.setTimeout(() => intro.remove(), 750);
  } else {
    window.setTimeout(finish, 2350);
  }
  skip?.addEventListener("click", finish);
}

function initNavigation() {
  const button = $("#menuButton");
  const nav = $("#mainNav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  });

  $$("#mainNav a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }));
}

function initModelDrag() {
  const stage = $("#modelStage");
  const model = $("#robotModel");
  const reset = $("#modelReset");
  if (!stage || !model) return;

  let rotateX = 59;
  let rotateZ = -32;
  let down = false;
  let startX = 0;
  let startY = 0;
  let originX = rotateZ;
  let originY = rotateX;
  let pointerMoved = false;

  const paint = () => {
    model.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
  };

  stage.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    down = true;
    pointerMoved = false;
    startX = event.clientX;
    startY = event.clientY;
    originX = rotateZ;
    originY = rotateX;
    model.classList.add("dragging");
    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", event => {
    if (!down) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) pointerMoved = true;
    rotateZ = Math.max(-70, Math.min(70, originX + dx * .34));
    rotateX = Math.max(20, Math.min(78, originY - dy * .2));
    paint();
  });

  const stop = () => { down = false; model.classList.remove("dragging"); };
  stage.addEventListener("pointerup", stop);
  stage.addEventListener("pointercancel", stop);
  stage.addEventListener("lostpointercapture", stop);

  reset?.addEventListener("click", () => {
    rotateX = 59;
    rotateZ = -32;
    paint();
  });

  // Subtle idle movement until the visitor interacts with the model.
  let interacted = false;
  stage.addEventListener("pointerdown", () => { interacted = true; }, { once: true });
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    let tick = 0;
    function idle() {
      if (!interacted && !down) {
        tick += .004;
        model.style.transform = `translate(-50%, -50%) rotateX(${59 + Math.sin(tick) * 1.6}deg) rotateZ(${-32 + Math.sin(tick * .7) * 2.2}deg)`;
      }
      requestAnimationFrame(idle);
    }
    requestAnimationFrame(idle);
  }
}

function initArchitectureSelector() {
  const title = $("#archTitle");
  const description = $("#archDescription");
  const status = $("#archStatus");

  $$(".arch-node").forEach(button => {
    button.addEventListener("click", () => {
      $$(".arch-node").forEach(node => node.classList.remove("active"));
      button.classList.add("active");
      const info = subsystemInfo[button.dataset.node];
      if (!info) return;
      title.textContent = info.title;
      description.textContent = info.description;
      status.textContent = info.status;
    });
  });
}

function initTrackAnimation() {
  const runner = $("#courseRunner");
  const stage = $(".course-scene");
  if (!runner || !stage) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    runner.style.animation = "none";
    return;
  }
  // CSS keyframes animate a small CSS 3D vehicle around the conceptual course.
  runner.classList.add("patrolling");
}

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  items.forEach(item => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  initIntro();
  initNavigation();
  renderTeam();
  initModelDrag();
  initArchitectureSelector();
  initTrackAnimation();
  initReveal();
});



// Additional engineering content interactions
const pipelineStages = [
  {
    title: "CAMERA FRAME",
    text: "The system begins with the current mobile-camera input. Stream delay and frame availability must be measured during implementation."
  },
  {
    title: "PREPROCESSING",
    text: "Preprocessing may include grayscale conversion, thresholding or filtering. The exact algorithm should be selected after testing track contrast and lighting."
  },
  {
    title: "REGION OF INTEREST",
    text: "The region of interest narrows processing to the portion of the frame expected to contain useful path information. Its geometry must be tuned to the actual camera mount."
  },
  {
    title: "PATH DETECTION",
    text: "The software identifies the marked trajectory. Robustness needs to be evaluated under bends, shadows, changing light and track-mark variations."
  },
  {
    title: "CENTROID EXTRACTION",
    text: "A representative centre point or path centroid is estimated from detected pixels. If the path disappears or fragments, the system needs a safe fallback."
  },
  {
    title: "TRACKING ERROR",
    text: "Error is defined as desired path centre minus detected path centre. Pixel error is not the same as a calibrated physical distance unless camera geometry is established."
  },
  {
    title: "PID CORRECTION",
    text: "Kp, Ki and Kd determine the simulated correction response. Their values are demonstration controls only; real tuning should begin at safe speeds in controlled conditions."
  },
  {
    title: "STEERING + SPEED",
    text: "The correction influences steering and, depending on the final implementation, target speed or motor commands. Full closed-loop vehicle performance remains to be validated."
  }
];

const hardwareItems = [
  ["ESP32-S3", "EMBEDDED CONTROL", "Primary embedded controller for the vision-based architecture. Final processing responsibilities and pins should be confirmed against the wiring plan.", "Confirm pin map, 3.3 V logic compatibility and stable supply."],
  ["Mobile camera", "VISION INPUT", "Current concept uses a phone camera and wireless video stream for look-ahead information. End-to-end frame availability and delay are not yet confirmed.", "Measure stream latency, effective frame rate and mounting field of view."],
  ["DC gear motors", "PROPULSION", "Two DC gear motors provide propulsion. The team discussed questioning the initial motor choice for torque; final motor selection remains to be confirmed.", "Record motor part number, loaded RPM, current and stall-current rating."],
  ["Motor driver", "MODEL TBD", "High-current motor-control circuitry is required, but no unconfirmed driver model is presented as final.", "Check voltage range, continuous current, peak/stall current and cooling."],
  ["Steering servo", "ACKERMANN ACTUATION", "The team reported servo movement. Linkage geometry, steering limits and repeatability still require validation.", "Measure usable angle, link travel, torque margin and power stability."],
  ["Wheel encoders", "UNDER INTEGRATION", "Encoders are being investigated for wheel feedback. Tick count, mounting and direction decoding need confirmation.", "Confirm pulses/ticks per revolution and wheel circumference."],
  ["IR line sensors", "FALLBACK / REPORTED WORKING", "IR sensors were reported working in the group chat. They remain useful for low-complexity line tracking and bring-up.", "Confirm signal levels before connecting to ESP32-S3 GPIO."],
  ["Battery & power", "FINAL DESIGN TBD", "Battery and distribution must power motors, servo, controller and sensors without brownouts. Exact pack details are not finalized here.", "Check voltage/current budgets, regulators, fusing and shared ground plan."],
  ["Chassis / payload platform", "UP TO 5 KG TARGET", "Mechanical structure is intended to carry up to 5 kg. The load capacity and dynamic stability must be established through testing.", "Confirm CAD dimensions, wheelbase, track width and centre of gravity."]
];

function initPipelineInspector() {
  const buttons = $$(".pipeline-step");
  if (!buttons.length) return;

  const count = $("#pipelineStepCounter");
  const title = $("#pipelineDetailTitle");
  const text = $("#pipelineDetailText");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const index = Number(button.dataset.pipeline);
      const stage = pipelineStages[index];
      count.textContent = `STEP ${String(index + 1).padStart(2, "0")} / ${String(pipelineStages.length).padStart(2, "0")}`;
      title.textContent = stage.title;
      text.textContent = stage.text;
      const volume = $(".scan-volume");
      if (volume) {
        volume.style.opacity = String(0.32 + index * 0.085);
        volume.style.transform = `translateZ(16px) scaleY(${0.92 + index * 0.018})`;
      }
    });
  });
}

function initSpeedSelector() {
  const details = {
    straight: {
      label: "HIGH",
      text: "On a straight section, the controller may allow a higher target speed if the path is stable and the validated limits permit it.",
      left: "8%",
      angle: "-9deg"
    },
    gentle: {
      label: "MODERATE",
      text: "A gentle curve calls for a moderated target so the vehicle has time to track the trajectory without abrupt steering changes.",
      left: "32%",
      angle: "6deg"
    },
    sharp: {
      label: "REDUCED",
      text: "When a sharper bend is predicted, the speed strategy should reduce the target before entering the curve and allow steering to settle.",
      left: "65%",
      angle: "18deg"
    },
    exit: {
      label: "RECOVER GRADUALLY",
      text: "After the vehicle exits the curve and the path error becomes manageable, speed can recover smoothly rather than jumping immediately to maximum.",
      left: "82%",
      angle: "-7deg"
    }
  };

  const buttons = $$(".speed-choice");
  const car = $("#speedCar3D");
  const output = $("#speedStrategyValue");
  const text = $("#speedStrategyText");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const scenario = details[button.dataset.speedScene];
      if (!scenario) return;
      output.textContent = scenario.label;
      text.textContent = scenario.text;
      if (car) {
        car.style.left = scenario.left;
        car.style.transform = `translateZ(35px) rotateZ(${scenario.angle})`;
      }
    });
  });
}

function initHardwareInspector() {
  const rows = $$(".hardware-row");
  if (!rows.length) return;
  const count = $("#hardwareCount");
  const title = $("#hardwareTitle");
  const role = $("#hardwareRole");
  const description = $("#hardwareDescription");
  const next = $("#hardwareNext");

  rows.forEach(row => row.addEventListener("click", () => {
    rows.forEach(item => item.classList.remove("active"));
    row.classList.add("active");
    const index = Number(row.dataset.hardware);
    const item = hardwareItems[index];
    if (!item) return;
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(hardwareItems.length).padStart(2, "0")}`;
    title.textContent = item[0];
    role.textContent = `ROLE / ${item[1]}`;
    description.textContent = item[2];
    next.textContent = item[3];

    const bay = $(".hardware-3d-bay");
    if (bay) {
      bay.querySelectorAll(".hardware-chip").forEach(chip => chip.classList.remove("chip-selected"));
      const chipMap = {
        0: ".chip-mcu", 3: ".chip-driver", 6: ".chip-sensor", 7: ".chip-power"
      };
      if (chipMap[index]) bay.querySelector(chipMap[index])?.classList.add("chip-selected");
    }
  }));
}

function initPayloadToggle() {
  const load = $("#stabilityLoad");
  const cog = $("#stabilityCog");
  const buttons = $$(".load-mode");
  if (!load || !cog || !buttons.length) return;

  buttons.forEach(button => button.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    const loaded = button.dataset.loadMode === "loaded";
    load.style.opacity = loaded ? "1" : ".12";
    load.style.transform = loaded ? "translateZ(38px) translateY(0)" : "translateZ(15px) translateY(-12px)";
    cog.style.left = loaded ? "53%" : "47%";
    cog.style.top = loaded ? "46%" : "39%";
  }));
}

function initTestLog() {
  const fields = $$("[data-test-field]");
  const completion = $("#testCompletion");
  const reset = $("#resetTests");
  if (!fields.length) return;

  const storageKey = "roboconTeam04TestLogV1";
  const save = () => {
    const data = {};
    fields.forEach(field => { data[field.dataset.testField] = field.value; });
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (_) {}
    updateCount();
  };

  const updateCount = () => {
    const rowCount = 10;
    let completed = 0;
    for (let i = 0; i < rowCount; i++) {
      const status = $(`[data-test-field="${i}-status"]`);
      if (status && status.value === "COMPLETED") completed++;
    }
    if (completion) completion.textContent = `${completed} / ${rowCount} completed`;
  };

  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || "{}");
    fields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(data, field.dataset.testField)) {
        field.value = data[field.dataset.testField];
      }
    });
  } catch (_) {}

  fields.forEach(field => field.addEventListener("input", save));
  fields.forEach(field => field.addEventListener("change", save));

  reset?.addEventListener("click", () => {
    if (!window.confirm("Clear the test log saved in this browser? This does not affect source files.")) return;
    fields.forEach(field => {
      if (field.tagName === "SELECT") field.value = "NOT STARTED";
      else field.value = "";
    });
    try { localStorage.removeItem(storageKey); } catch (_) {}
    updateCount();
  });

  updateCount();
}

document.addEventListener("DOMContentLoaded", () => {
  initPipelineInspector();
  initSpeedSelector();
  initHardwareInspector();
  initPayloadToggle();
  initTestLog();
});

