/**
 * ==================================================
 * 
 * @name MongoManagement
 * @namespace MongoManagement::types::SysModelScopeConfig
 * @author Mike Karypidis
 * @copyright PerfectEvolution - 2022
 * @license MIT
 * 
 * ==================================================
 * 
 */

module.exports = class SysModelScopeConfig 
{
  /** @type {String[]} */
  create_scopes;
  /** @type {String[]} */
  create_advanced_scopes;
  /** @type {Function} */
  create_advanced_scopes_evaluation;

  /** @type {String[]} */
  read_scopes;
  /** @type {String[]} */
  read_advanced_scopes;
  /** @type {Function} */
  read_advanced_scopes_evaluation;
  /** @type {String[]} */
  read_select;

  /** @type {String[]} */
  delete_scopes;
  /** @type {String[]} */
  delete_advanced_scopes;
  /** @type {Function} */
  delete_advanced_scopes_evaluation;

  /** @type {String[]} */
  update_queries_scopes;
  /** @type {String[]} */
  update_queries_advanced_scopes;
  /** @type {Function} */
  update_queries_advanced_scopes_evaluation;

  /** @type {String[]} */
  update_body_scopes;
  /** @type {String[]} */
  update_body_advanced_scopes;
  /** @type {Function} */
  update_body_advanced_scopes_evaluation;



  constructor (props = {})
  {
    this.create_scopes = props.create_scopes || [];
    this.create_advanced_scopes = props.create_advanced_scopes || [];
    this.create_advanced_scopes_evaluation = typeof props.create_advanced_scopes_evaluation === "function" ? props.create_advanced_scopes_evaluation : () => {console.log("function not passed;")};

    this.read_scopes = props.read_scopes || [];
    this.read_advanced_scopes = props.read_advanced_scopes || [];
    this.read_advanced_scopes_evaluation = typeof props.read_advanced_scopes_evaluation === "function" ? props.read_advanced_scopes_evaluation : () => {console.log("function not passed;")};
    this.read_select = props.read_select || [];

    this.delete_scopes = props.delete_scopes || [];
    this.delete_advanced_scopes = props.delete_advanced_scopes || [];
    this.delete_advanced_scopes_evaluation = typeof props.delete_advanced_scopes_evaluation === "function" ? props.delete_advanced_scopes_evaluation : () => {console.log("function not passed;")};

    this.update_queries_scopes = props.update_queries_scopes || [];
    this.update_queries_advanced_scopes = props.update_queries_advanced_scopes || [];
    this.update_queries_advanced_scopes_evaluation = typeof props.update_queries_advanced_scopes_evaluation === "function" ? props.update_queries_advanced_scopes_evaluation : () => {console.log("function not passed;")};
    this.update_body_scopes = props.update_body_scopes || [];
    this.update_body_advanced_scopes = props.update_body_advanced_scopes || [];
    this.update_body_advanced_scopes_evaluation = typeof props.update_body_advanced_scopes_evaluation === "function" ? props.update_body_advanced_scopes_evaluation : () => {console.log("function not passed;")};
  }

}