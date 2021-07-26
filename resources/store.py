from models.store_model import StoreModel
from flask_restful import Resource

class Stores(Resource):
    def get(self):
        stores = StoreModel.get_all_items()
        return_dict = {}
        for store in stores:
            return_dict[store.name] = store.to_json()
        return return_dict, 200


class Store(Resource):
    def get(self, name):
        store = StoreModel.exists_in_db(name)
        if store:
            return store.to_json(), 200
        return {"message":"Store not found"}, 400
        
    
    def post(self, name):
        store = StoreModel.exists_in_db(name)
        if store:
            return {"message":"Store already exists"}, 400
        store = StoreModel(name)
        store.save()
        return{"message":"Store created"}, 201
        
    
    def delete(self, name):
        pass
    
    def put(self, name):
        pass