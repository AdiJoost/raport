from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.task_model import TaskModel
from flask import make_response
from datetime import date
import flask

class Task(Resource):
    def get(self, name):
        return_value = {"message": ""}
        task = TaskModel.get_by_id(name)
        if task:
            return_value["task"] = task.to_json()
            return_value["message"] = "Got a Task!"
            return Task.create_response(return_value, 200)
        
        task = TaskModel.get_by_name(name)
        if task:
            return_value["task"] = task.to_json()
            return_value["message"] = "Got a Task! But it's better practise to call tasks with their id! Maybe another Task with that name exists :/"
            return Task.create_response(return_value, 200)
        else:
            return_value["message"] = "No task found"
        return Task.create_response(return_value, 400)
        
        
    
    def post(self, name):
        parser = Task.get_post_parser()
        data = parser.parse_args()
        return_value = {"message": ""}
        return_state = 200
        
        date_due, state = TaskModel.get_date(data["due"])
        if not state:
            return_value["message"] = "Couldn't assign due as Date. Use format: yyyy-MM-dd!"
            return_state = 400
            return Task.create_response(return_value, return_state)
            
        date_init, _ = TaskModel.get_date(data["initialized"])
        task = TaskModel(data["name"], data["description"], date_due, date_init)
        task.save()
        return_value["message"] = "Task created"
        return_state = 201
        return Task.create_response(return_value, return_state)
        
        
    
    def put(self, name):
        pass
    
    def delete(self, name):
        pass
    
    @classmethod
    def get_get_parser(cls):
        parser = reqparse.RequestParser()
        parser.add_argument("name",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        return parser
        
    @classmethod
    def get_post_parser(cls):
        parser = reqparse.RequestParser()
        parser.add_argument("name",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("description",
                            type=str,
                            required=True,
                            help="This field cannot be left blank")
        parser.add_argument("due",
                            type=str,
                            required=True,
                            help="This field cannot be left blank. Formmat: yyyy-MM-dd")
        parser.add_argument("initialized",
                            type=str,
                            required=True,
                            help="This field cannot be left blank. Put -1 for today.")
        
        return parser
    
    @classmethod
    def create_response (cls, body, status):
        response = make_response(flask.jsonify(body), status)
        response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5000')
        return response
        
