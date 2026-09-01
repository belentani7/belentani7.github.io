const puppeteer = require("puppeteer-core");
const fs = require("fs");

(async () => {
  const errors = [];
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.on("console", m => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });
  page.on("pageerror", e => errors.push("PAGEERROR: " + String(e).slice(0, 300)));

  await page.goto("http://127.0.0.1:8765/index.html", { waitUntil: "networkidle2", timeout: 30000 });
  await page.waitForSelector("#enter-btn", { visible: true, timeout: 15000 });
  await page.click("#enter-btn");
  await new Promise(r => setTimeout(r, 2500));

  // main interface checks
  const checks = await page.evaluate(() => ({
    heroVisible: !!document.querySelector("#hero h1"),
    gems: document.querySelectorAll("#gems .gem").length,
    nodes: document.querySelectorAll("#grid .node").length,
    logLines: document.querySelectorAll("#syslog .ln").length,
    cpu: document.querySelector("#st-cpu").textContent,
    freq: document.querySelector("#st-freq").textContent
  }));
  console.log("MAIN_INTERFACE:", JSON.stringify(checks));

  // screenshot main
  await page.screenshot({ path: "_shot_main.png" });

  // terminal: type commands
  await page.type("#term-input", "STATUS");
  await page.keyboard.press("Enter");
  await new Promise(r => setTimeout(r, 400));
  await page.type("#term-input", "NAME ORACLE");
  await page.keyboard.press("Enter");
  await new Promise(r => setTimeout(r, 400));
  await page.type("#term-input", "WHOAMI");
  await page.keyboard.press("Enter");
  await new Promise(r => setTimeout(r, 400));
  await page.type("#term-input", "hola");
  await page.keyboard.press("Enter");
  await new Promise(r => setTimeout(r, 400));

  // open TAROT module via quick command
  await page.evaluate(() => { runCommand("TAROT"); });
  await new Promise(r => setTimeout(r, 700));
  const tarotOpen = await page.evaluate(() => document.querySelector("#modal-back").classList.contains("open"));
  const tarotCards = await page.evaluate(() => document.querySelectorAll("#modal-body .tcard").length);
  console.log("TAROT:", JSON.stringify({ tarotOpen, tarotCards }));
  await page.screenshot({ path: "_shot_tarot.png" });
  // flip a card
  await page.click("#modal-body .tcard");
  await new Promise(r => setTimeout(r, 900));
  const flipped = await page.evaluate(() => document.querySelectorAll("#modal-body .tcard.flipped").length);
  console.log("TAROT_FLIPPED:", flipped);
  await page.evaluate(() => closeModal());

  // SCAN flow: 5 questions
  await page.evaluate(() => { runCommand("SCAN"); });
  await new Promise(r => setTimeout(r, 400));
  for (let i = 0; i < 5; i++) {
    await page.click("#scan-stage .pill");
    await new Promise(r => setTimeout(r, 250));
  }
  await new Promise(r => setTimeout(r, 400));
  const scanResult = await page.evaluate(() => (document.querySelector("#scan-stage .result-box") || {}).textContent || "NONE");
  console.log("SCAN_RESULT:", scanResult.slice(0, 120).replace(/\s+/g, " "));
  const gemsLit = await page.evaluate(() => document.querySelectorAll("#gems .gem.lit").length);
  console.log("GEMS_LIT:", gemsLit);
  await page.screenshot({ path: "_shot_scan.png" });
  await page.evaluate(() => closeModal());

  // FORGE: render + toggle grid cell (audio won't start without gesture but UI must work)
  await page.evaluate(() => { runCommand("FORGE"); });
  await new Promise(r => setTimeout(r, 400));
  const forgeCells = await page.evaluate(() => document.querySelectorAll("#forge-grid .cell").length);
  const forgeOnBefore = await page.evaluate(() => document.querySelectorAll("#forge-grid .cell.on").length);
  await page.click('#forge-grid .cell[data-r="0"][data-c="5"]');
  const forgeOnAfter = await page.evaluate(() => document.querySelectorAll("#forge-grid .cell.on").length);
  console.log("FORGE:", JSON.stringify({ forgeCells, forgeOnBefore, forgeOnAfter }));
  await page.evaluate(() => closeModal());

  // DETECT flow
  await page.evaluate(() => { runCommand("DETECT"); });
  await new Promise(r => setTimeout(r, 300));
  await page.type("#detect-in", "Eso nunca pasó. Estás exagerando todo y recuerdas mal. La víctima aquí soy yo, por tu culpa.");
  await page.click("#detect-go");
  await new Promise(r => setTimeout(r, 500));
  const verdict = await page.evaluate(() => (document.querySelector("#detect-out .verdict") || {}).textContent || "NONE");
  console.log("DETECT_VERDICT:", verdict.trim());
  await page.screenshot({ path: "_shot_detect.png" });
  await page.evaluate(() => closeModal());

  // WRITE flow
  await page.evaluate(() => { runCommand("WRITE"); });
  await new Promise(r => setTimeout(r, 300));
  await page.type("#w-seed", "medianoche");
  await page.click("#w-go");
  await new Promise(r => setTimeout(r, 500));
  const lyrics = await page.evaluate(() => ((document.querySelector("#w-text") || {}).textContent || "").slice(0, 100));
  console.log("WRITE_OUT:", lyrics.replace(/\s+/g, " "));
  await page.evaluate(() => closeModal());

  // DREAM flow
  await page.evaluate(() => { runCommand("DREAM"); });
  await new Promise(r => setTimeout(r, 300));
  await page.type("#dream-in", "Soñé que volaba sobre un mar rojo y una máquina me hablaba");
  await page.click("#dream-go");
  await new Promise(r => setTimeout(r, 500));
  const dreamHits = await page.evaluate(() => document.querySelectorAll("#dream-out .sig").length);
  console.log("DREAM_SYMBOLS:", dreamHits);
  await page.evaluate(() => closeModal());

  // JUDAS portal render (don't start audio)
  await page.evaluate(() => { runCommand("JUDAS"); });
  await new Promise(r => setTimeout(r, 300));
  const jtracks = await page.evaluate(() => document.querySelectorAll("#judas-timeline .jtrack").length);
  console.log("JUDAS_TRACKS:", jtracks);
  await page.evaluate(() => closeModal());

  // Konami code → Zion
  for (const k of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
    await page.keyboard.press(k);
    await new Promise(r => setTimeout(r, 60));
  }
  await new Promise(r => setTimeout(r, 800));
  const zion = await page.evaluate(() => ({
    bodyZion: document.body.classList.contains("zion"),
    zionNode: document.querySelectorAll("#grid .zion-node").length
  }));
  console.log("ZION:", JSON.stringify(zion));
  await page.screenshot({ path: "_shot_zion.png" });

  // link modules smoke (modal renders with URL)
  for (const c of ["MANOS", "CRUZAR", "TENDER", "IVY", "CARQUIDEC", "CV", "DUCK", "OMEGA"]) {
    const ok = await page.evaluate((cmd) => { openModule(cmd); return document.querySelector("#modal-back").classList.contains("open"); }, c);
    const link = await page.evaluate(() => (document.querySelector("#modal-body a.big-btn") || {}).href || "");
    console.log("LINK_" + c + ":", ok, link);
    await page.evaluate(() => closeModal());
    await new Promise(r => setTimeout(r, 120));
  }

  // mobile viewport check
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 600));
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  console.log("MOBILE_OVERFLOW:", mobileOverflow);
  await page.screenshot({ path: "_shot_mobile.png" });

  console.log("ERRORS:", errors.length ? errors.join(" || ") : "NONE");
  await browser.close();
})().catch(e => { console.error("FATAL:", e); process.exit(1); });
