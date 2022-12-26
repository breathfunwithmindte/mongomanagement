/**
 * ==================================================
 * 
 * @name MongoManagement
 * @namespace MongoManagement::SysModel
 * @author Mike Karypidis
 * @copyright PerfectEvolution - 2022
 * @license MIT
 * 
 * ==================================================
 * 
 */

 const mongoose = require("mongoose");
 const SysError = require("../types/SysError");
 const SYSERRORSTATUS = require("../statictypes/SYSERRORSTATUS");
 const SysModelScopeConfig = require("../types/SysModelScopeConfig");
 const { querymongo } = require("./utils");
 
 module.exports = class SysModel {
 
   /** @type {String} */
   name;
   /** @type{mongoose.Model} */
   model;
   /** @param {Map<String, mongoose.Model>} models */
   models;
   /** @type {SysModelScopeConfig} sysModelScopeConfig */
   sysModelScopeConfig;
 
   /**
    *
    * @param {String} name
    * @param {Map<String, mongoose.Model>} models
    * @param {SysModelScopeConfig} sysModelScopeConfig - *pointer
    */
   constructor(name, models, sysModelScopeConfig) {
     this.name = name;
     this.model = models.get(name);
     this.models = models;
     this.sysModelScopeConfig = sysModelScopeConfig;
   }
 
   /**
    * @param {*} body - usecase req.body on node-expessjs example
    * @param {*} hardcodedBody - usecase to override stuff that not allowed to passed from client
    */
   async write(body, hardcodedBody) {
     let final_formstate = new Array();
 
     if (body instanceof Array === true) {
       for (let i = 0; i < body.length; i++) {
         let doc_final_formstate = new Object();
         for (const key in body[i]) {
           if (Object.hasOwnProperty.call(body[i], key)) {
             if (
               this.sysModelScopeConfig.create_advanced_scopes.some(
                 (s) => s === key
               )
             ) {
               doc_final_formstate[key] =
                 await this.sysModelScopeConfig.create_advanced_scopes_evaluation(
                   this,
                   key,
                   body[i][key]
                 );
             } else if (
               this.sysModelScopeConfig.create_scopes.some((s) => s === key)
             ) {
               doc_final_formstate[key] = body[i][key];
             }
           }
         }
         for (const key2 in hardcodedBody) {
           if (Object.hasOwnProperty.call(hardcodedBody, key2)) {
             doc_final_formstate[key2] = hardcodedBody[key2];
           }
         }
         final_formstate.push(doc_final_formstate);
       }
     } else {
       let local_final_formstate = new Object();
       for (const key in body) {
         if (Object.hasOwnProperty.call(body, key)) {
           if (
             this.sysModelScopeConfig.create_advanced_scopes.some(
               (s) => s === key
             )
           ) {
             local_final_formstate[key] =
               await this.sysModelScopeConfig.create_advanced_scopes_evaluation(
                 this,
                 key,
                 body[key]
               );
           } else if (
             this.sysModelScopeConfig.create_scopes.some((s) => s === key)
           ) {
             local_final_formstate[key] = body[key];
           }
         }
       }
       for (const key2 in hardcodedBody) {
         if (Object.hasOwnProperty.call(hardcodedBody, key2)) {
           local_final_formstate[key2] = hardcodedBody[key2];
         }
       }
       final_formstate.push(local_final_formstate);
     }
    //  console.log(final_formstate);
     await this.model.insertMany(final_formstate);
   }
 
   /**
    *
    * @param {*} query - usecase req.query on node-expessjs example
    * @param {*} hardcodedQuery - usecase to override query stuff that not allowed to be searched by client
    * @param {Boolean} logQueries - if true will log to the console the list of final queries used on Model.find(<final queries>)
    * @returns
    */
   async read(query, hardcodedQuery, logQueries) {
     let final_query = new Object();
     let select_query = new Object();
 
     final_query["$and"] = new Array();
 
     for (const key in query) {
       if (Object.hasOwnProperty.call(query, key)) {
         if (
           this.sysModelScopeConfig.read_advanced_scopes.some((s) => s === key)
         ) {
           let v =
             await this.sysModelScopeConfig.read_advanced_scopes_evaluation(
               this,
               key,
               query[key]
             );
           final_query["$and"].push({ [key]: querymongo(v) });
         } else if (
           this.sysModelScopeConfig.read_scopes.some((s) => s === key)
         ) {
           final_query["$and"].push({ [key]: querymongo(query[key]) });
         }
       }
     }
 
     for (const key2 in hardcodedQuery) {
       if (Object.hasOwnProperty.call(hardcodedQuery, key2)) {
         let currentquerybyname = final_query["$and"].find(
           (f) => f[key2] !== undefined
         );
         if (currentquerybyname) {
           currentquerybyname[key2] = querymongo(hardcodedQuery[key2]);
         } else {
           final_query["$and"].push({
             [key2]: querymongo(hardcodedQuery[key2]),
           });
         }
       }
     }
 
     this.sysModelScopeConfig.read_select.map((i) => {
       select_query[i] = 1;
     });
     if (logQueries) {
       console.log("==============================");
       console.log(final_query);
       if (final_query["$and"] && final_query.length !== 0) {
         console.table(final_query["$and"]);
       }
       console.log("==============================");
     }
 
     if (final_query["$and"].length === 0) {
       return await this.model.find({}, select_query);
     } else {
       return await this.model.find(final_query, select_query);
     }
   }
 
   /**
    *
    * @param {*} query - usecase req.query on node-expessjs example
    * @param {*} hardcodedQuery - usecase to override query stuff that not allowed to be searched by client
    * @param {Boolean} logQueries - if true will log to the console the list of final queries used on Model.find(<final queries>)
    * @returns
    */
   async delete(query, hardcodedQuery, logQueries) {
     let final_query = new Object();
 
     final_query["$and"] = new Array();
 
     for (const key in query) {
       if (Object.hasOwnProperty.call(query, key)) {
         if (
           this.sysModelScopeConfig.delete_advanced_scopes.some((s) => s === key)
         ) {
           let v =
             await this.sysModelScopeConfig.delete_advanced_scopes_evaluation(
               this,
               key,
               query[key]
             );
           final_query["$and"].push({ [key]: querymongo(v) });
         } else if (
           this.sysModelScopeConfig.delete_scopes.some((s) => s === key)
         ) {
           final_query["$and"].push({ [key]: querymongo(query[key]) });
         }
       }
     }
 
     for (const key2 in hardcodedQuery) {
       if (Object.hasOwnProperty.call(hardcodedQuery, key2)) {
         let currentquerybyname = final_query["$and"].find(
           (f) => f[key2] !== undefined
         );
         if (currentquerybyname) {
           currentquerybyname[key2] = querymongo(hardcodedQuery[key2]);
         } else {
           final_query["$and"].push({
             [key2]: querymongo(hardcodedQuery[key2]),
           });
         }
       }
     }
 
     if (logQueries) {
       console.log("==============================");
       console.log(final_query);
       if (final_query["$and"] && final_query.length !== 0) {
         console.table(final_query["$and"]);
       }
       console.log("==============================");
     }
 
     if (final_query["$and"].length === 0) {
       throw new SysError({
         status: SYSERRORSTATUS.EMPTYQUERY,
         name: "[ERROR]::EMPTY QUERIES",
         message: `Cannot execute empty query ${this.name}`,
         write: false,
         where: `SysModel<${this.name}>::delete`,
       });
     } else {
       return await this.model.deleteMany(final_query);
     }
   }
 
   /**
    *
    * @param {*} query - usecase req.query on node-expessjs example
    * @param {*} update - usecase req.body on node-expessjs example
    * @param {*} hardcodedQuery - usecase to override query stuff that not allowed to be searched by client
    * @param {Boolean} logQueries - if true will log to the console the list of final queries used on Model.updateMany(<final queries>)
    * @returns
    */
   async update(query, update, hardcodedQuery, logQueriesAndUpdate) {
     let final_query = new Object();
     let final_formstate = new Object();
 
     final_query["$and"] = new Array();
 
     for (const key in query) {
       if (Object.hasOwnProperty.call(query, key)) {
         if (
           this.sysModelScopeConfig.update_queries_advanced_scopes.some(
             (s) => s === key
           )
         ) {
           let v =
             await this.sysModelScopeConfig.update_queries_advanced_scopes_evaluation(
               this,
               key,
               query[key]
             );
           final_query["$and"].push({ [key]: querymongo(v) });
         } else if (
           this.sysModelScopeConfig.update_queries_scopes.some((s) => s === key)
         ) {
           final_query["$and"].push({ [key]: querymongo(query[key]) });
         }
       }
     }
 
     for (const key2 in hardcodedQuery) {
       if (Object.hasOwnProperty.call(hardcodedQuery, key2)) {
         let currentquerybyname = final_query["$and"].find(
           (f) => f[key2] !== undefined
         );
         if (currentquerybyname) {
           currentquerybyname[key2] = querymongo(hardcodedQuery[key2]);
         } else {
           final_query["$and"].push({
             [key2]: querymongo(hardcodedQuery[key2]),
           });
         }
       }
     }
 
     for (const key in update) {
       if (Object.hasOwnProperty.call(update, key)) {
         if (
           this.sysModelScopeConfig.update_body_advanced_scopes.some(
             (s) => s === key
           )
         ) {
           final_formstate[key] =
             await this.sysModelScopeConfig.update_body_advanced_scopes_evaluation(
               this,
               key,
               update[key]
             );
         } else if (
           this.sysModelScopeConfig.update_body_scopes.some((s) => s === key)
         ) {
           final_formstate[key] = update[key];
         }
       }
     }
 
     if (logQueriesAndUpdate) {
       console.log(
         "============================== UPDATE OBJECT ============================== "
       );
       console.log(final_formstate);
       console.log(
         "============================== QUERY OBJECT ============================== "
       );
       console.log(final_query);
       if (final_query["$and"] && final_query.length !== 0) {
         console.table(final_query["$and"]);
       }
       console.log(
         "============================== ENDL ============================== "
       );
     }
 
     if (final_query["$and"].length === 0) {
       throw new SysError({
         status: SYSERRORSTATUS.EMPTYQUERY,
         name: "[ERROR]::EMPTY QUERIES",
         message: `Cannot execute empty query ${this.name}`,
         write: false,
         where: `SysModel<${this.name}>::write`,
       });
     } else {
       return await this.model.updateMany(final_query, {
         $set: final_formstate,
       });
     }
   }
 };
 