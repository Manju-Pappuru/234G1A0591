import Log from "./logger.js";

async function run() {
  const result = await Log(
    "frontend",
    "info",
    "utils",
    "Logging middleware initialized"
  );

  console.log(result);
}

run();