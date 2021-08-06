from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.gift_model import GiftModel
from models.kid_model import KidModel
from flask import make_response
import flask

class Gifts(Resource):
    def get(self):
        gifts = GiftModel.get_all_items();
        return_value = {}
        for gift in gifts:
            return_value[gift.id] = gift.to_json();
        return Gift.create_response(return_value, 200);

class Gift(Resource):
    def get(self, _id):
        gift = GiftModel.get_by_id(_id)
        return_status = 200
        if gift:
            return_value = gift.to_json()
        else:
            return_value = {"message": "No gift with given ID found"}
            return_status = 404
        return Gift.create_response(return_value, return_status)
        
    
    def post(self, _id):
        parser = Gift.get_parser()
        data = parser.parse_args()
        if not KidModel.exists_id(data["kid_id"]):
            return_value = {"message": "There exists no Kid with given ID"}
            return_status = 400
            return Gift.create_response(return_value, return_status)
        if not len(str(data["year"])) == 4:
            return_value = {"message": "The year should be in four digits (i.E. 2020)"}
            return_status = 400
            return Gift.create_response(return_value, return_status)
        
        gift = GiftModel(**data)
        gift.save()
        return_value = {"message": "Gift added"}
        return_status = 201
        return Gift.create_response(return_value, return_status)
    
    def delete(self):
        pass
    
    @classmethod
    def get_parser(cls):
        parser = reqparse.RequestParser()
        parser.add_argument("kid_id",
                            type=int,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("gift_type",
                            type=int,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("year",
                            type=int,
                            required=True,
                            help="This field cannot be left blank")
        
        return parser

    @classmethod
    def create_response (cls, body, status):
        response = make_response(flask.jsonify(body), status)
        response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5000')
        return response
    
    