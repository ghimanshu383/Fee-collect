const {EXCLUDED_API_FIELDS} = require('./constants');
/**
 * @class MongoHelper
 */
class MongoHelper {
  #queryObject;
  #schema;
  query;
  /**
     * @param {any} schema
     * @param {any} queryObject
     */
  constructor(schema, queryObject) {
    this.#queryObject = queryObject;
    this.#schema = schema;
    this.query='';
  }
  /**
   * @return {String} returns query string for findOne and findMany methods
   */
  getFindQueryString() {
    const queryObjectCopy = Object.assign({}, this.#queryObject);
    EXCLUDED_API_FIELDS.forEach((el) => delete queryObjectCopy[el]);
    return JSON.stringify(queryObjectCopy).replace(/\bgt|gte|lt|lte\b/, (match)=> `$${match}`);
  }
  /**
   * @return {MongoHelper} instance
   */
  find() {
    const queryString = this.getFindQueryString();
    this.query = this.#schema.find(JSON.parse(queryString));
    return this;
  }
  /**
   * @return {MongoHelper} isntance
   */
  findOne() {
    const queryString = this.getFindQueryString();
    this.query = this.#schema.findOne(JSON.parse(queryString));
    return this;
  }
  /**
   *
   * @param {String} id
   * @return {MongoHelper} instance
   */
  findById(id) {
    this.query = this.#schema.findById(id);
    return this;
  }
  /**
   * @return {MongoHelper} instance
   */
  sort() {
    if (this.#queryObject.sort) {
      const sortingString = this.#queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortingString);
    }
    return this;
  }
  /**
   * @return {MongoHelper} instance
   */
  page() {
    if (this.#queryObject.page && (+this.#queryObject.page > 0)) {
      const page = this.#queryObject.page*1 || 1;
      const limit = this.#queryObject.limit*1 || 10;
      const skip = (page-1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
  /**
   * @return {MongoHelper} instance
   */
  projection() {
    if (this.#queryObject.fields) {
      const proejctionString = this.#queryObject.fields.split(',').join('');
      this.query = this.query.select(proejctionString);
    }
    return this;
  }
  /**
   * @return {number} document Count
   */
  count() {
    const totalDocumentcount = this.query.count();
    return totalDocumentcount;
  }
}

module.exports = MongoHelper;
