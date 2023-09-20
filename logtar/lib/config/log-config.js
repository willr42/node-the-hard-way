const fs = require("node:fs");
const { LogLevel } = require("../utils/log-level");
const { RollingConfig } = require("./rolling-config");

class LogConfig {
  /**
   * @type {number}
   * @description The log level to be used.
   */
  #level = LogLevel.Info;

  /**@type {RollingConfig} */
  #rollingConfig;

  /**
   * @type {string}
   * @description The prefix to be used for the logfile name
   */
  #filePrefix = "Logtar_";

  constructor() {
    this.#rollingConfig = RollingConfig.withDefaults();
  }

  /**
   * @returns {LogConfig} A new instance of LogConfig with default values.
   */
  static withDefaults() {
    return new LogConfig();
  }

  /**
   * @param {string} filePath The path to the config file.
   * @returns {LogConfig} A new instance of LogConfig with values from the config
   * @throws {Error} If the filePath is not a string
   */
  static fromFile(filePath) {
    const fileContents = fs.readFileSync(filePath, { encoding: "utf-8" });
    return LogConfig.fromJson(JSON.parse(fileContents));
  }

  /**
   * @param {Object} json The json object to be parsed into {LogConfig}
   * @returns {LogConfig} A new instance with values from the json
   */
  static fromJson(json) {
    let logConfig = new LogConfig();

    Object.keys(json).forEach((key) => {
      const val = json[key];
      switch (key) {
        case "level":
          logConfig = logConfig.withLogLevel(val);
          break;
        case "rollingConfig":
          logConfig = logConfig.withRollingConfig(val);
          break;
        case "level":
          logConfig = logConfig.withFilePrefix(val);
          break;
      }
    });
    return logConfig;
  }

  /**
   * @param {LogConfig} logConfig The config to be validated.
   * @throws {Error} If the logConfig is not a valid instance.
   */
  static assert(logConfig) {
    if (arguments.length > 0 && !(logConfig instanceof LogConfig)) {
      throw new Error(
        `logConfig must be an instance of LogConfig. Unsupported param ${JSON.stringify(logConfig)}`
      );
    }
  }

  /**
   * @returns {LogLevel} The current log level.
   */
  get level() {
    return this.#level;
  }

  /**
   *
   * @param {LogLevel} logLevel The log level to be set.
   * @returns {LogConfig} The current instance of LogConfig.
   * @throws {Error} If the logLevel is not an instance of LogLevel.
   */
  withLogLevel(logLevel) {
    LogLevel.assert(logLevel);
    this.#level = logLevel;
    return this;
  }

  /**
   * @returns {RollingConfig} The current rolling config.
   */
  get rollingConfig() {
    return this.#rollingConfig;
  }

  /**
   *
   * @param {RollingConfig} rollingConfig The rolling config to be set.
   * @returns {LogConfig} The current instance of LogConfig.
   */
  withRollingConfig(rollingConfig) {
    this.#rollingConfig = RollingConfig.fromJson(rollingConfig);
    return this;
  }

  /**
   * @returns {String} The current max file size.
   */
  get filePrefix() {
    return this.#filePrefix;
  }

  /**
   * @param {string} filePrefix File prefix to be set.
   * @returns {LogConfig} current instance of LogConfig.
   * @throws {Error} If filePrefix is not a string.
   */
  withFilePrefix(filePrefix) {
    if (typeof filePrefix !== "string") {
      throw new Error(
        `filePrefix must be a string. Unsupported param ${JSON.stringify(filePrefix)}`
      );
    }
    this.#filePrefix = filePrefix;
    return this;
  }
}

module.exports = { LogConfig };
