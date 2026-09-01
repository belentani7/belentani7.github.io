const { spawn } = require("child_process");
const path = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  "--window-size=1440,2400",
  "--virtual-time-budget=9000",
  "--screenshot=C:\\Users\\USER\\.openclaw\\workspace\\belentani-portal\\_shot.png",
  "http://127.0.0.1:8765/index.html"
];
const p = spawn(path, args, { stdio: "inherit" });
p.on("exit", c => { console.log("EDGE_EXIT=" + c); process.exit(c); });
setTimeout(() => { console.log("timeout"); process.exit(2); }, 30000);
