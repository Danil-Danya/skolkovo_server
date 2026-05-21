const { spawn } = require("node:child_process");

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const maxRetries = parsePositiveInt(process.env.MIGRATION_MAX_RETRIES, 12);
const retryDelayMs = parsePositiveInt(process.env.MIGRATION_RETRY_DELAY_MS, 5000);
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runPrismaMigrateDeploy = () =>
  new Promise((resolve, reject) => {
    const child = spawn(npxCommand, ["prisma", "migrate", "deploy"], {
      env: process.env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      const details = signal ? `signal ${signal}` : `code ${code ?? "unknown"}`;
      reject(new Error(`prisma migrate deploy exited with ${details}`));
    });
  });

async function main() {
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      console.log(`[migrate] Running Prisma migrations (${attempt}/${maxRetries})`);
      await runPrismaMigrateDeploy();
      console.log("[migrate] Prisma migrations are up to date");
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[migrate] ${message}`);

      if (attempt === maxRetries) {
        console.error("[migrate] Migration retries exhausted, refusing to start the API");
        process.exit(1);
      }

      console.log(`[migrate] Retrying in ${retryDelayMs}ms`);
      await sleep(retryDelayMs);
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(`[migrate] Unexpected failure: ${message}`);
  process.exit(1);
});
