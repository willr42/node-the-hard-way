const { RollingTimeOptions, RollingSizeOptions } = require("../utils/rolling-options");

class RollingConfig {
  /**
   * @type {RollingTimeOptions}
   */
  #timeThreshold = RollingTimeOptions.Hourly;
  /**
   * @type {RollingSizeOptions}
   */
  #sizeThreshold = RollingSizeOptions.FiveMB;

  /**
   * @returns {RollingConfig} A new instance of RollingConfig with default values
   */
  static withDefaults() {
    return new RollingConfig();
  }

  /**
   * @param {number} sizeThreshold Roll/create new file every time the filesize exceeds this threshold.
   * @returns {RollingConfig} Current instance of RollingConfig.
   */
  withSizeThreshold(sizeThreshold) {
    RollingSizeOptions.assert(sizeThreshold);
    this.#sizeThreshold = sizeThreshold;
    return this;
  }

  /**
   * @param {number} timeThreshold
   * @returns {RollingConfig} Current instance of RollingConfig.
   */
  withTimeThreshold(timeThreshold) {
    RollingTimeOptions.assert(timeThreshold);
    this.#timeThreshold = timeThreshold;
    return this;
  }

  /**
   * @param {Object} json
   * @returns {RollingConfig} A new instance of RollingConfig with values from json.
   */
  static fromJson(json) {
    let rollingConfig = new RollingConfig();

    Object.keys(json).forEach((key) => {
      switch (key) {
        case "sizeThreshold":
          rollingConfig = rollingConfig.withSizeThreshold(json[key]);
          break;
        case "timeThreshold":
          rollingConfig = rollingConfig.withTimeThreshold(json[key]);
          break;
      }
    });
    return rollingConfig;
  }

  static assert(rollingConfig) {
    if (!(rollingConfig instanceof RollingConfig)) {
      throw new Error(
        `rollingConfig must be an instance of RollingConfig. Unsupported param ${JSON.stringify(
          rollingConfig
        )}`
      );
    }
  }
}

module.exports = { RollingConfig };
