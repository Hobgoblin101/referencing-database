console.log('-----------------------------------------------------------------\n                            NOTE\n-----------------------------------------------------------------\nReferencing database is going to be removed and replaced by adatre\nRecommend Changing to implement that package to replace this one asap\n\nadatre has allot more features and is allot faster and more stable\n\n');

var cleanLayout = true;
var fs = require("fs");
var object = require("object-manipulation");
var completeData = false;

module.exports = {
  started: false,
  onStartUp: [],
  new: function(type, id, overwrite){
    /*-----------------------------
      Setup
    -----------------------------*/
    if (typeof(id) == 'function' || typeof(id) == 'undefined' || typeof(id) == 'object'){
      console.log("**Error**: Invalid ID (type: "+type+", id:"+id+")");
      return {successful: false, err: "invalid ID", data: null};
    }
    if (typeof(type) == 'function' || typeof(type) == 'undefined' || typeof(id) == 'object'){
      console.log("**Error**: Invalid type (type: "+type+", id:"+id+")");
      return {successful: false, err: "invalid type", data: null};
    }
    //If database hasn't started, queue the task until it has
    if (module.exports.started === false){
      module.exports.onStartUp.push(module.exports.new(type));
      return;
    }else{
      //Check if the type is valid
      if (fs.readdirSync("./database/templates").indexOf(type+'.json') == -1){
        console.log("**Error**: invalid Database table type ("+type+")");
        return {successful: false, err: "non-existent template", data: null};
      }
      //Check if the name is already in use
      if (module.exports.exist(type, id) && !overwrite){
        console.log("**Error**: ("+type+"/"+id+") already exists, please set overwrite to true");
        return {successful: false, err: "exists", data: null};
      }

      /*-----------------------------
        Create new table
      -----------------------------*/
      //Load data
      var data = {reference: true};
      if (completeData){
        data.reference = false;
      }

      //Check if the type is valid
      if (fs.readdirSync("./database/storage").indexOf(type) == -1){
        fs.mkdirSync("./database/storage/"+type);
      }
      if (cleanLayout){
        fs.writeFileSync("./database/storage/"+type+"/"+id+".json", JSON.stringify(data, null, 2));
      }else{
        fs.writeFileSync("./database/storage/"+type+"/"+id+".json", JSON.stringify(data));
      }

      return {successful: true, err: null, data: data};
    }
  },
  exist: function(type, id){
    if (fs.readdirSync("./database/storage").indexOf(type) == -1){
      return false;
    }
    return (fs.readdirSync("./database/storage/"+type).indexOf(id+'.json') != -1);
  },
  get: function(type, id){
    if (module.exports.exist(type, id)){

      var tableData = JSON.parse(fs.readFileSync("./database/storage/"+type+"/"+id+".json", 'utf8'));

      //If database is setup not reference then just pass JSON
      if (completeData){
        return tableData;
      }

      //Other wise, check if just this file is set to reference
      if (!tableData.reference){
        return tableData;
      }

      //compile table data and reference then pass
      var template = module.exports.templateGet(type);
      if (template === null){
        template = {};
      }
      return object.merg(template, tableData);

    }else{
      //If the table doesn't exist pass null
      return null;
    }
  },
  save: function(type, id, data){
    data = object.passNew(module.exports.templateGet(type), data);

    if (cleanLayout){
      return fs.writeFileSync("./database/storage/"+type+"/"+id+".json", JSON.stringify(data, null, 2));
    }else{
      return fs.writeFileSync("./database/storage/"+type+"/"+id+".json", JSON.stringify(data));
    }
  },
  set: function(type, id, newData){
    if (typeof(newData) != "object"){
      return false;
    }else{
      var cData = module.exports.get(type, id);
      var output = object.merg(cData, newData);
      module.exports.save(type, id, output);
      return true;
    }
  },
  templateGet: function(type){
    if (typeof(type) == 'function' || typeof(type) == 'undefined' || typeof(type) == 'object'){
      console.log("**Error**: Invalid type (type: "+type+", id:"+id+")");
      return null;
    }else{
      var index = fs.readdirSync("./database/templates/");
      if (index.indexOf(type+'.json') != -1){
        return JSON.parse(fs.readFileSync("./database/templates/"+type+".json", 'utf8'));
      }else{
        return null;
      }
    }
  },
  list: function(type){
    if (fs.readdirSync("./database/storage").indexOf(type) == -1){
      return null;
    }
    var list = fs.readdirSync("./database/storage/"+type);
    var results = [];
    for (let file of list){
      file = file.split('.');
      if (file[file.length-1].toLowerCase() == 'json'){
        file.splice(file.length-1, 1);
        results.push(file.join('.'));
      }
    }

    return results;
  }
};





/*---------------------------------------------------
  start
---------------------------------------------------*/

//Does database folder exist?
if (fs.readdirSync("./").indexOf("database") == -1){
  fs.mkdirSync("database");
}
//Dose template folder exist?
if (fs.readdirSync("./database/").indexOf("templates") == -1){
  fs.mkdirSync("database/templates");
}
//Dose storage folder exist?
if (fs.readdirSync("./database/").indexOf("storage") == -1){
  fs.mkdirSync("database/storage");
}

//Set started status to true, then run any functions that were waiting for it too start
module.exports.started = true;
for (var i=0; i<module.exports.onStartUp.length; i++){
  module.exports.onStartUp[i]();
}
