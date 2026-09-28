const { execSync } = require("child_process");

function freePort(port) {
  try {
    const stdout = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const lines = stdout.trim().split("\n");
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== "0" && !isNaN(pid)) {
        pids.add(pid);
      }
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`[CLEANUP] Port ${port} was busy. Automatically freed (PID ${pid}).`);
      } catch (e) {}
    }
  } catch (e) {
    // Port is already free
  }
}

freePort(5000);
freePort(3000);
