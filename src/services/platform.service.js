const models = require('../databases/models/index');
const Platform = models.Platform;

class PlatformServices {
  /**
   * Get All Platform
   * @returns
   */
  async getAll() {
    const data = await Platform.findAll({
      attributes: ['uuid', 'name', 'description', 'accessKey', 'createdAt', 'updatedAt'],
    });
    return data;
  }

  /**
   * Create Platform
   * @param {string} name name of platform
   * @param {string} description description of platform
   * @returns
   */
  async create({ name, description }) {
    const data = await Platform.create({ name, description });
    delete data.dataValues.id;
    delete data.dataValues.token;
    return data;
  }
}

module.exports = new PlatformServices();
