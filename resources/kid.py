from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.kid_model import KidModel
from flask import make_response
import datetime
import flask

class KidsByDay(Resource):
    #dayString in format yyyy-MM-dd
    def get(self, dayString):
        date, state = Kid.get_date(dayString)
        if not state:
            response =  make_response(flask.jsonify(
                {"message": "Invalid date: {} \nUse format: yyyy-MM-dd\n\tfor Example: 2020-12-27".format(dayString)}), 
                400)
            response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5000')
            return response
        kids = KidModel.get_kids_by_day(date.weekday())
        return_value = {}
        for kid in kids:
            return_value[kid.id] = kid.to_json()
        response = flask.jsonify(return_value)
        response.headers.add('Access-Control-Allow-Origin', 'http://127..0.1:5000')
        return response
        

class Kids(Resource):
    def get(self):
        kids = KidModel.get_all_items()
        return_value = {}
        for kid in kids:
            return_value[kid.id] = kid.to_json()
        response = flask.jsonify(return_value)
        response.headers.add('Access-Control-Allow-Origin', 'http://127..0.1:5000')
        return response

class Kid(Resource):
    def get(self, name):
        kid = KidModel.exists_name(name)
        if kid:
            return kid.to_json(), 200
        try:
            _id = int(name)
            kid = KidModel.exists_id(_id)
            if kid:
                return kid.to_json(), 200
        except:
            pass
        return None, 404
    
    
    def post(self, name):
        parser = reqparse.RequestParser()
        parser.add_argument("name",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("parents",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("present",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("birthday",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("eating",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("sleeping",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("spez",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("important",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        
        data = parser.parse_args()
        if KidModel.exists_name(data["name"]):
            return {"message": "Kid with name {} already exists".format(data["name"])}, 400
        if data["name"].isdigit():
            return {"message": "The Name of the Kid is not aloud to be a number!"}, 400
        
        date, state = Kid.get_date(data["birthday"])
        if state:
            kid = KidModel(data["name"],
                      data["parents"],
                      data["present"],
                      date,
                      data["eating"],
                      data["sleeping"],
                      data["spez"],
                      data["important"])
            kid.save()
            return kid.to_json(), 201
        return {"message": "Coudn't assign Birthday"}, 400
        
    
    def delete(self, name):
        _id = 0;
        try:
            _id = int(name)
        except:
            return {"message": "Given ID is invalid. Use a hole and positiv Number!"}, 400
            
        kid = KidModel.exists_id(_id);
        if not kid:
            return {"message": "No Kid with given ID found, therefore none exists"}, 400
        kid.deleteMe();
        return {"message": "Kid deleted", "kid": kid.to_json()}, 200
    
    def put(self, name):
        parser = reqparse.RequestParser()
        parser.add_argument("name",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("parents",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("present",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("birthday",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("eating",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("sleeping",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("spez",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("important",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("id",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        data = parser.parse_args();
        kid = KidModel.exists_id(data["id"]);
        if not kid:
            return {"message": "(Maybe 500)For some strange reason, the server didn't found a Kid with ID:{}".format(data["id"])}, 400
        message, status = KidModel.update_kid(kid, data)
        return {"message": message}, status
    
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

