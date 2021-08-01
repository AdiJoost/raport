from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.kid_model import KidModel
import datetime
import flask

class KidsByDay(Resource):
    #dayString in format yyyy-MM-dd
    def get(self, dayString):
        date, state = Kid.get_date(dayString)
        if not state:
            return {"message": "Coudn't assign Birthday"}, 400
        kids = KidModel.get_kids_by_day(date.weekday())
        return_value = {}
        for kid in kids:
            return_value[kid.id] = kid.to_json()
        return return_value;
        

class Kids(Resource):
    def get(self):
        kids = KidModel.get_all_items()
        return_value = {}
        for kid in kids:
            return_value[kid.id] = kid.to_json()
        response = flask.jsonify(return_value)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

class Kid(Resource):
    def get(self, name):
        kid = KidModel.exists_name(name)
        if kid:
            return kid.to_json(), 200
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
        pass
    
    def put(self, name):
        pass
    
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

