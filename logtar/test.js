const { Logger, LogConfig } = require("./index")
const path = require("path")

async function initializeLogger() {
  const logger = Logger.withConfig(
    LogConfig.fromFile(path.join(__dirname, "./config.json")),
  );
  await logger.init();
  return logger;
}

async function main() {
  let logger = await initializeLogger();
logger.critical('From the main() function')
    nested_func(logger)
}

function nested_func(logger) {
    logger.critical('From the nested_func() function')
    super_nested(logger)
}

function super_nested(logger) {
    logger.critical('From the super_nested() function')
}

main()