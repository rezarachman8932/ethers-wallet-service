/**
 * responseWrapper
 * JSON response wrapper
 * @param {Object} res - Express response
 * @param {number} code - HTTP status code
 * @param {string} message - Response message
 * @param {*} data - Optional response data
 * @returns {Object} JSON
 */
const responseWrapper = (res, code, message, data = null) => res.status(code).json({
    response: code,
    message,
    data,
  });

const response = {
  /**
   * Success Response
   * @param {Object} res - Express response
   * @param {string} message - Message text
   * @param {Object|null} data - Data to return
   * @param {number} code - HTTP status (default: 200)
   */
  success: (res, message = 'Operation successful', data = null, code = 200) =>
    responseWrapper(res, code, message, data),

  /**
   * Error Response
   * @param {Object} res - Express response
   * @param {string} message - Error message
   * @param {Object|null} data - Optional error details
   * @param {number} code - HTTP status (default: 400)
   */
  error: (res, message = 'Something went wrong', data = null, code = 400) =>
    responseWrapper(res, code, message, data),

  /**
   * Paginated Response
   * @param {Object} res - Express response
   * @param {string} message - Message text
   * @param {Array} docs - Array of results
   * @param {Object} pagination - Pagination details
   * @param {number} code - HTTP status (default: 200)
   */
  paginated: (res, message = 'Data retrieved successfully', docs = [], pagination = {}, code = 200) =>
    responseWrapper(res, code, message, { docs, pagination }),
};

module.exports = { response };