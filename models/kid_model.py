from db import db
import datetime

class KidModel(db.Model):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    
    __tablename__ = 'kids'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    parents = db.Column(db.String(80))
    present = db.Column(db.String(5))
    birthday = db.Column(db.Date())
    eating = db.Column(db.String(255))
    sleeping = db.Column(db.String(255))
    spez = db.Column(db.String(255))
    important = db.Column(db.String(255))

    def __init__(self, name, parents, present, birthday, eating, sleeping, spez, important):
        self.name = name
        self.parents = parents
        self.present = present
        self.birthday = birthday
        self.eating = eating
        self.sleeping = sleeping
        self.spez = spez
        self.important = important
        
    def to_json (self):
        return {"name" : self.name,
                            "id": self.id,
                            "parents": self.parents,
                            "present": self.present,
                            "birthday": str(self.birthday),
                            "eating": self.eating,
                            "sleeping": self.sleeping,
                            "spez":self.spez,
                            "important":self.important}
    
    def to_string (self):
        return f"name: {self.name},\nparents: {self.parents}\npresent:{self.present}"
    
    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def deleteMe(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def exists_name (cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def exists_id (cls, _id):
        return cls.query.filter_by(id=_id).first()
    
    @classmethod
    def get_all_items(cls):
        return cls.query.all()
    
    @classmethod
    def get_kids_by_day (cls, weekday):
        searchStatement = cls.get_statement(weekday)
        return cls.query.filter(cls.present.notlike(searchStatement)).all()
          
    #todo let method return correct string for day;
    @classmethod
    def get_statement (cls, weekday):
        if weekday == cls.MONDAY:
            return "f____"
        if weekday == cls.TUESDAY:
            return "_f___"
        if weekday == cls.WEDNESDAY:
            return "__f__"
        if weekday == cls.THURSDAY:
            return "___f_"
        if weekday == cls.FRIDAY:
            return "____f"
        return "fffff"
    
    @classmethod
    def update_kid (cls, kid, data):
        kid.parents = data["parents"]
        kid.eating = data["eating"]
        kid.sleeping = data["sleeping"]
        kid.spez = data["spez"]
        kid.important = data["important"]
        returnMessage = "";
        #check if name is valid
        if kid.name != data["name"]:
            if cls.exists_name(data["name"]):
                returnMessage += "--The new name already existed in DB, therefor old name still in use!--"
            elif kid.name.isdigit():
                returnMessage += "--The new name is a number. Numbers are not allowed as Names (As per definition, Humans have a right for a name, not a Number!), therefor old name still in use!--"
            else:
                kid.name = data["name"]
                
        #check if birthday is valid
        date, state = cls.get_date(data["birthday"])
        if state:
            kid.birthday = date
        else:
            returnMessage += "--The given Birthday is invalid form. Use format yyyy-MM-dd, therefore old birthday still in use!--"
            
        #check if presents is valid
        if KidModel.presents_valid(data["present"]):
            kid.present = data["present"]
        else:
            returnMessage += "--The given presents of the kid is in wrong format(presents has to be in 5 letters), therefore old presents still in use!--"
        kid.save()
        returnMessage += "--Kid updated--"
        return returnMessage, 200
    
    @classmethod
    def get_date(cls, string):
        try:
            year = int(string[0:4])
            month = int(string[5:7])
            day = int(string[8:])
            date = datetime.datetime(year, month, day)
            return date, True
        except:
            return None, False
        
    @classmethod
    def presents_valid(cls, present):
        if len(present) == 5:
            return True;
        else:
            return False;
        
            
        
    
    '''
    @classmethod
    def get_all_items_as_json(cls):
        data = cls.query.all()
        return_value = {}
        for kid in data:
            return_value[kid.name] = kid.to_json()
        return return_value
    
    @classmethod
    def get_all_items_as_string(cls):
        data = cls.query.all()
        return_value = ""
        for kid in data:
            return_value += kid.to_string() + "\n"
        return return_value
     
    @classmethod
    def get_all_items_as_list(cls):
        data = cls.query.all()
        return_value = []
        for kid in data:
            return_value.append(kid.to_string())
        return return_value'''