from db import db


class UserModel(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    password = db.Column(db.String(80))
    
    def __init__(self, _id, username, password):
        self.id = _id
        self.username = username
        self.password = password
        
    def __str__(self):
        return f"Id: {self.id}, Username: {self.username}, Password: {self.password}"
    
    def to_tupple(self):
        return (self.id, self.username, self.password)
    
    def save(self):
        if UserModel.find_by_username(self.username):
            return False
        db.session.add(self)
        db.session.commit()
        return True
    
    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()
    
    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()