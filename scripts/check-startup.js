const { spawn } = require("child_process");

const timeoutMs = Number(process.env.STARTUP_CHECK_TIMEOUT_MS || 8000);

const child = spawn(process.execPath, ["--no-deprecation", "app.js"], {
  cwd: process.cwd(),
  env: process.env,
});

let output = "";

child.stdout.on("data", (data) => {
  output += data.toString();
});

child.stderr.on("data", (data) => {
  output += data.toString();
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

child.on("exit", (code) => {
  if (code !== null && code !== 0) {
    process.stdout.write(output);
    process.exit(code);
  }
});

setTimeout(() => {
  child.kill();
  process.stdout.write(output || "Backend stayed running with no startup error.\n");
  process.exit(0);
}, timeoutMs);
