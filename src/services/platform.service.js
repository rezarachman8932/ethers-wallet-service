const models = require('../databases/models/index');
const Platform = models.Platform;

class PlatformServices {
    async getAll() {
        const data = await Platform.findAll();
        return data;
    }
}

module.exports = new PlatformServices;