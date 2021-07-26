from db import db
from models.store_model import StoreModel

class ItemModel(db.Model):
   
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    price = db.Column(db.Float(precision=2))
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    store = db.relationship('StoreModel')
    
    def __init__(self, name, price, store_id):
        self.name = name
        self.price = price
        self.store_id = store_id
                
    def to_json(self):
        return {"name": self.name, "price": self.price, "store_id": self.store_id}
    
    def save(self):
        db.session.add(self)
        db.session.commit()
      
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        
    def set_store_id(self, store_id):
        if StoreModel.get_store_by_id(store_id):
            self.store_id = store_id
            return True
        return False
        
        
    @classmethod
    def exists_in_db (cls, name):
        return cls.query.filter_by(name=name).first()
    
    @classmethod
    def get_all_items(cls):
        return cls.query.all()
        
        
    
    