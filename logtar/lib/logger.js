const { LogConfig } = require("./config/log-config");
const { LogLevel } = require("./utils/log-level");

class Logger {
  /** @type {LogConfig} */
  #config;

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
}

module.exports = { Logger };
