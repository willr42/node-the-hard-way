const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");
const fs = require("fs/promises");
const path = require("path");
const { checkAndCreateDir, getCallerInfo } = require("./utils/helpers");

class Logger {
  /** @type {LogConfig} */
  #config;

  /**
   * @type {fs.FileHandle}
   */
  #logFileHandle;

  async init() {
    const logDirPath = checkAndCreateDir("logs");

    const fileName =
      this.#config.filePrefix +
      new Date().toISOString().replace(/\:/g, "-").split(".")[0] +
      ".log";
    this.#logFileHandle = await fs.open(path.join(logDirPath, fileName), "a+");
  }

  /**
   *
   * @returns {Logger} Logger A new instance of Logger with default config.
   */
  static withDefaults() {
    return new Logger();
  }

  /**
   * @param {LogConfig} [logConfig] LogConfig, uses withDefaults() if not supplied
   */
  constructor(logConfig) {
    logConfig = logConfig || LogConfig.withDefaults();
    this.#config = logConfig;
  }

  /**
   *
   * @param {LogConfig} logConfig
   * @returns A new instance of Logger with given config
   */
  static withConfig(logConfig) {
    return new Logger(logConfig);
  }

  /**
   * @returns {LogLevel} The current log level.
   */
  get level() {
    return this.#config.level;
  }

  get filePrefix() {
    return this.#config.filePrefix;
  }

  get timeThreshold() {
    return this.#config.rollingConfig.timeThreshold;
  }

  get sizeThreshhold() {
    return this.#config.rollingConfig.sizeThreshold;
  }

  /**
   * @param {string} message
   * @param {number} logLevel
   */
  async #log(message, logLevel) {
    if (logLevel < this.#config.level) {
      return;
    }

    await this.#writeToHandle(message, logLevel);

    await this.#rollingCheck();
  }

  debug(message) {
    this.#log(message, LogLevel.Debug);
  }

  info(message) {
    this.#log(message, LogLevel.Info);
  }

  warn(message) {
    this.#log(message, LogLevel.Warn);
  }

  error(message) {
    this.#log(message, LogLevel.Error);
  }

  critical(message) {
    this.#log(message, LogLevel.Critical);
  }

  /**
   * @param {string} message the message to be written
   * @param {string} logLevel the string for the relevant logLevel
   */
  async #writeToHandle(message, logLevel) {
    const dateIso = new Date().toISOString();
    const logLevelString = LogLevel.toString(logLevel);

    const logMessage = `[${dateIso}] [${logLevelString}]: ${getCallerInfo()} ${message}\n`;

    await this.#logFileHandle.write(logMessage);
  }

  /**
   * Checks if the log has passed rolling parameters. If so, create new logfile.
   */
  async #rollingCheck() {
    const { sizeThreshold, timeThreshold } = this.#config.rollingConfig;

    const { size, birthtimeMs } = await this.#logFileHandle.stat();
    const currentTime = new Date().getTime();

    if (
      size >= sizeThreshold ||
      currentTime - birthtimeMs >= timeThreshold * 1000
    ) {
      await this.#logFileHandle.close();
      await this.init();
    }
  }
}

module.exports = { Logger };
