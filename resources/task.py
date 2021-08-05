from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.task_model import TaskModel
from flask import make_response
import flask

class Tasks(Resource):
    def get(self, param):         
        tasks = TaskModel.get_all()
        return_value = {}
        for task in tasks:
            return_value[task.id] = task.to_json()
        return Task.create_response(return_value, 200)
    
    def post (self, param):
        if param == "due":
            pass
        elif param == "status":
            parser = Task.get_status_parser()
            data = parser.parse_args();
            tasks = TaskModel.get_tasks_by_status(data["status"])
        else:   
             tasks = TaskModel.get_all()
        return_value = {}
        for task in tasks:
            return_value[task.id] = task.to_json()
        return Task.create_response(return_value, 200)

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
        task = TaskModel.get_by_id(name)
        return_value = {"message": ""}
        if not task:
            return_value["message"] = "No Task found with given ID"
            return Task.create_response(return_value, 400)
        parser = Task.get_put_parser()
        data = parser.parse_args()
        #if bored create function or better, make set-functions and a mainfunction in TaskModel
        if data["name"]:
            task.name = data["name"]
            return_value["message"] = return_value["message"] + "Name edited\n"
        if data["description"]:
            task.description = data["description"]
            return_value["message"] = return_value["message"] + "description edited\n"
        if data["due"]:
            date, state = TaskModel.get_date(data["due"])
            if state:
                task.due = date
                return_value["message"] = return_value["message"] + "due edited\n"
            else:
                return_value["message"] = return_value["message"] + "couldn't assigne date for due, old date still in use \n"
        if data["initialized"]:
            date, state = TaskModel.get_date(data["initialized"])
            if state:
                task.initialized = date
                return_value["message"] = return_value["message"] + "initialized edited\n"
            else:
                return_value["message"] = return_value["message"] + "couldn't assigne date for initialized, old date still in use \n"
        if data["done"]:
            date, state = TaskModel.get_date(data["done"])
            if state:
                task.done = date
                return_value["message"] = return_value["message"] + "done edited\n"
            else:
                return_value["message"] = return_value["message"] + "couldn't assigne done for initialized, old date still in use \n"
        if data["status"]:
            task.status = data["status"]
            return_value["message"] = return_value["message"] + "status edited\n"
        if data["time_used"]:
            task.time_used = data["time_used"]
            return_value["message"] = return_value["message"] + "time_used edited\n"
        task.save()
        return make_response(return_value, 200)
        
        
            
    
    def delete(self, name):
        task = TaskModel.get_by_id(name)
        return_value = {"message": ""}
        if task:
            task.deleteMe()
            return_value["message"] = "Task deleted"
        else:
            return_value["message"] = "There was no Task with ID: {} to begin with".format(name)
        return Task.create_response(return_value, 200)
        
    
    @classmethod
    def get_status_parser(cls):
        parser = reqparse.RequestParser()
        parser.add_argument("status",
                            type=int,
                            required=True,
                            help="This field cannot be left blank")
        return parser
    
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
    def get_put_parser(cls):
        parser = reqparse.RequestParser()
        parser.add_argument("name",
                            type=str,
                            help="This field cannot be left blank")
        parser.add_argument("description",
                            type=str,
                            help="This field cannot be left blank")
        parser.add_argument("due",
                            type=str,
                            help="This field cannot be left blank. Formmat: yyyy-MM-dd")
        parser.add_argument("initialized",
                            type=str,
                            help="This field cannot be left blank. Put -1 for today.")
        parser.add_argument("status",
                            type=int)
        parser.add_argument("done",
                            type=str)
        parser.add_argument("time_used",
                            type=int)
        return parser
    
    @classmethod
    def create_response (cls, body, status):
        response = make_response(flask.jsonify(body), status)
        response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5000')
        return response
        
