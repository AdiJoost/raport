from db import db

class StoreModel(db.Model):
    
    __tablename__ = 'stores'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    items = db.relationship('ItemModel', lazy='dynamic')
    
    
    def __init__(self, name):
        self.name = name
                
    def to_json(self):
        return {"name": self.name, "id": self.id, "items": [item.to_json() for item in self.items.all()]}
    
    def save(self):
        db.session.add(self)
        db.session.commit()
      
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        
        
    @classmethod
    def exists_in_db (cls, name):
        return cls.query.filter_by(name=name).first()
    
    @classmethod
    def get_store_by_id (cls, store_id):
        return cls.query.filter_by(id=store_id).first()
    
    @classmethod
    def get_all_items(cls):
        return cls.query.all()
        
        
    
    