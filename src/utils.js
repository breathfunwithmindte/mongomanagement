/**
 * ==================================================
 * 
 * @name MongoManagement
 * @namespace MongoManagement::utils
 * @author Mike Karypidis
 * @copyright PerfectEvolution - 2022
 * @license MIT
 * 
 * ==================================================
 * 
 */

module.exports.querymongo = (value) => {
  if(typeof value !== "string") return value;

  const mongo_attributes = ["%_$eq::", "%_$ne::", "%_$gt::", "%_$gte::", "%_$lt::", "%_$lte::", "%_$in::", "%_$nin::", "%_$search::"];

  let substringlength = 0;
  let attribute = "";
  let actual_value;


  for (let c = 0; c < mongo_attributes.length; c++) {
    if(!value.startsWith(mongo_attributes[c])) continue;
    substringlength = mongo_attributes[c].length;
    attribute = mongo_attributes[c].substring(2, mongo_attributes[c].length - 2);
    if(attribute === "$in" || attribute === "$nin") {
      actual_value = value.substring(substringlength, value.length).split(";;").map(i => {
        if(!isNaN(i)) return Number(i);
        return i;
      });
    } else {
      actual_value = value.substring(substringlength, value.length);
    }
  }
  
  if(substringlength === 0) return value;
  return { [attribute]: actual_value };
}