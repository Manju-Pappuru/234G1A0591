export function Log(stack, level, packageName, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    stack,
    level,
    package: packageName,
    message,
    meta,
  };

  const output = `[${entry.timestamp}] [${entry.level}] [${entry.package}] ${entry.stack}: ${entry.message}`;

  if (level === "error") {
    console.error(output, meta);
  } else if (level === "warn") {
    console.warn(output, meta);
  } else {
    console.log(output, meta);
  }

  return entry;
}
