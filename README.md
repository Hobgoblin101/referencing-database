A template reference based data base system.

#Setup
After installing this package though npm, add require('referencing-database')  
at the top of your node script, then run for first time setup.  
After that the module will of created a folder called 'database', and within  
that will be a folder called 'templates', of which is where you will be required  
to put your templates to be able to make new database items from.  

Though out the module templates are equivalent to types.
Example: database.new('profile', 'newUserId'); will be referencing 'database/templates/profile.json'



##database.new(type, id, overwrite)
Will create a new database item referencing the template of type.  
Overwrite will force the new data item to overwrite another item with the same type and id.

##database.exist(type, id)
Will return a boolean on wether or not that item exists

##database.get(type, id)
Will return all data in that specific data item

##database.save(type, id, data)
Will delete the items content and replace it with the input data

##database.set(type, id, data)
Will merg the data items current data with the new data (so new data will overwrite old data).

##database.getTemplate(type)
Will return the default data from the type inputted.



#Template Setup
 _Example_
```
{
  _templateInfoData:{
    encryption: 'bb'
  }
  maxUsers: 10,
  chatRooms: [
    'Lobby',
    'Gaming',
    'Coding'
  ]
}
```

##Encryption
_Comming Soon_  
 **bb**: basic binary (converts .json to binary so someone can't easily read it)  
 **B**: converts the data to a buffer  
