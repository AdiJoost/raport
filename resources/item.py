from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.item_model import ItemModel
from models.store_model import StoreModel

items= []

class Item_list(Resource):
    def get(self):
        return_dic ={}
        items = ItemModel.get_all_items()
        for item in items:
            return_dic[item.id] = item.to_json()
        return return_dic


class Item(Resource):
    @jwt_required()
    def get(self, name):
        item = ItemModel.exists_in_db(name)
        if item:
            return item.to_json(), 200
        return None, 404

    def post(self, name): 
        parser = reqparse.RequestParser()
        parser.add_argument("name",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("price",
                            type=float,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("store_id",
                            type=int,
                            required=True,
                            help="This field cannot be left blank")
        data = parser.parse_args()
        if StoreModel.get_store_by_id(data["store_id"]):
            item = ItemModel(data["name"], data["price"], data["store_id"])
            item.save()
            return {"message": "item saved"}, 200
        return{"message": f"Store with id {data['store_id']} does not exist"}, 400
    
    def delete(self, name):
        parser = reqparse.RequestParser()
        parser.add_argument("name",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        data = parser.parse_args()
        item = ItemModel.exists_in_db(data["name"])
        if item:
            item.delete()
            state = True
            message = "Item deleted"
            code = 200
        else:
            state = False
            message = "Item didn't exist"
            code = 400
        return {"state": state, "message": message}, code
        
    
    
    def put(self, name):
        parser = reqparse.RequestParser()
        parser.add_argument("name",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("price",
                            type=float,
                            required=True,
                            help="This field cannot be left blank!")
        parser.add_argument("store_id",
                            type=int,
                            required=True,
                            help="This field cannot be left blank")
        
        data = parser.parse_args()
        item = ItemModel.exists_in_db(data["name"])
        if item:
            item.price = data["price"]
            item.set_store_id(data["store_id"])
            item.save()
        else:
            item = ItemModel(data["name"], data["price"])
            item.save()
        return {"message": "item updated"}, 200
            
    
        
        
    

    

            
            