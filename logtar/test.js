const { Logger, LogConfig } = require("./index");
const path = require("path");

async function initializeLogger() {
  const logger = Logger.withConfig(
    LogConfig.fromFile(path.join(__dirname, "./config.json")),
  );
  await logger.init();
  return logger;
}

async function main() {
  let logger = await initializeLogger();
  setInterval(() => {
    logger.critical("seomthing that uses a lot of bites" * 30);
  }, 20);
}

main();
