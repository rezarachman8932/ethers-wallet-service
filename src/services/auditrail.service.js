const models = require('../databases/models/index');
const Auditrail = models.Auditrail;

class AuditrailServices {
    async create({ action, header, body, ipAddress }) {
        try {
            await Auditrail.create({ action, header, body, ipAddress });
        } catch (err) {
            console.error('Failed to save auditrail:', err.message);
        }
    }
}

module.exports = new AuditrailServices;