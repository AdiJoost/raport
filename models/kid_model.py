from db import db

class KidModel(db.Model):
    
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
        return {self.name: {"name" : self.name,
                            "id": self.id,
                            "parents": self.parents,
                            "present": self.present,
                            "birthday": str(self.birthday),
                            "eating": self.eating,
                            "sleeping": self.sleeping,
                            "spez":self.spez,
                            "important":self.important}}
    
    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def delete(self):
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