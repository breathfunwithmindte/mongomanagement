# Mongo Management

## Bue me a coffee 
  ... comming soon info

Library design not only to controll the roles of users
  > if someone can READ | DELETE | UPDATE | CREATE  a record but also\
  > which property in that record can READ | DELETE | UPDATE | CREATE

#### belog some examples of code ...

more clear documetations comming soon ....


``` javascript

  const connectionModels = new Map();
  connectionModels.set("provider", conn.model("provider", ProviderSchemaWrapper.ProviderSchema));
  connectionModels.set("user", conn.model("user", UserSchemaWrapper.UserSchema));

  const providerModel = new SysModel("provider", connectionModels, ProviderSchemaWrapper.ProviderSchemaScopeSchema);

```

### CREATE

``` javascript

  await providerModel.write([{ 
    name: "Empedus",

    backgroundImage: "wowoowo",
    backgroundColor:  "#212121",
    textColor:  "#FFFFFF",
    primaryColor:  "red",
    primaryTextColor:  "#FFFFFF",
  
  },{ 
    name: "Monofans",

    backgroundImage: "wowoowo",
    backgroundColor:  "#212121",
    textColor:  "#FFFFFF",
    primaryColor:  "red",
    primaryTextColor:  "#FFFFFF",
  
  }], { backgroundImage: "hard coded" })

```

#### DELETE

``` javascript

  console.log(await providerModel.delete({ name: "%_$in::Empedus;;Monofans" }, {  }, true))

```

#### READ

``` javascript

  console.log(await providerModel.read({ name: "%_$in::Empedus" }, {}, true))

```

#### UPDATE 

``` javascript

  console.log(await providerModel.update({ name: "%_$in::Empedus;;Monofans" }, { backgroundImage: "wowowo--updated1 1212" }, { name: "Empedus" }, true));

```


#### EXAMPLE OF SCHEMA CONFIG

ProviderSchema.js

``` JAVASCRIPT
  module.exports.ProviderSchemaScopeSchema = new SysModelScopeConfig({
    create_scopes: ["backgroundImage", "backgroundColor",
    "textColor", "primaryColor", "primaryTextColor",
    "login_title", "register_title", "externalAuthentication",
    "details"],
    create_advanced_scopes: ["name"],
    create_advanced_scopes_evaluation: async (self, key, value) => {
      const olddoc = await self.model.findOne({ name: value }, { name: 1 } );
      if (olddoc)
        throw new SysError({ status: SYSERRORSTATUS.DUBLICATE, name: "[ERROR]::DUBLICATE", message: "Document with this name already exist.", write: false, where: `SysModel<${self.name}>create_advanced_scopes_evaluation`,});
      return value;
    },
    read_scopes: ["name", "backgroundColor",
    "textColor", "primaryColor", "primaryTextColor",
    "login_title", "register_title", "externalAuthentication",
    "details"],
    read_advanced_scopes: [],
    read_advanced_scopes_evaluation: async (self, key, value) => value,
    read_select: ["_id", "name"],
    delete_scopes: ["name"],
    delete_advanced_scopes: [],
    delete_advanced_scopes_evaluation: async (self, key, value) => value,
    update_queries_scopes: ["name"],
    update_queries_advanced_scopes: [],
    update_queries_advanced_scopes_evaluation: async (self, key, value) => value,
    update_body_scopes: ["backgroundImage", "backgroundColor",
    "textColor", "primaryColor", "primaryTextColor",
    "login_title", "register_title", "externalAuthentication",
    "details"],
    update_body_advanced_scopes: [],
    update_body_advanced_scopes_evaluation: async (self, key, value) => value
  })

  module.exports.ProviderSchema = mongoose.Schema({

    name: { type: String, required: true, minlength: 3, maxlength: 255 },

    backgroundImage: { type: String, required: true, minlength: 3, maxlength: 1400, default: "https://cdn.pixabay.com/photo/2015/01/07/15/51/woman-591576_1280.jpg" },
    backgroundColor: { type: String, required: true, minlength: 3, maxlength: 255, default: "#212121" },
    textColor: { type: String, required: true, minlength: 3, maxlength: 255, default: "#FFFFFF" },
    primaryColor: { type: String, required: true, minlength: 3, maxlength: 255, default: "red" },
    primaryTextColor: { type: String, required: true, minlength: 3, maxlength: 255, default: "#FFFFFF" },
    
    login_title: { type: String, required: true, minlength: 3, maxlength: 255, default: "Welcome Back" },
    register_title: { type: String, required: true, minlength: 3, maxlength: 255, default: "Create Account" },

    externalAuthentication: { type: Boolean, required: true, default: false },

    details: { type: String, required: true, maxlength: 1400, default: "no details" },

  }, { timestamps: true, collection: "providers" });

```

