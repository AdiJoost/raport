from db import db

class GiftModel(db.Model):
    
    __tablename__ = "gifts";
    id = db.Column(db.Integer, primary_key=True)
    
    kid_id = db.Column(db.Integer, db.ForeignKey("kids.id"))
    kid = db.relationship('KidModel')
    
    gift_type = db.Column(db.Integer)
    year = db.Column(db.Integer)
    
    def __init__(self, kid_id, gift_type, year):
        self.kid_id = kid_id
        self.gift_type = gift_type
        self.year = year
                
    def to_json(self):
        return {"id": self.id,
                "kid_id": self.kid_id,
                "gift_type": self.gift_type,
                "year": self.year,
                "kid_name": self.kid.name}

    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def deleteMe(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def get_all_items(cls):
        return cls.query.all()
    
    @classmethod
    def get_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first();
    
    