from flask_restful import Resource, reqparse
from models.user_model import UserModel

    
class UserRegister(Resource):
    
    parser = reqparse.RequestParser()
    parser.add_argument("username",
                        type = str,
                        required=True,
                        help="This field cannot left blank")
    parser.add_argument("password",
                        type = str,
                        required=True,
                        help="This field cannot left blank")
    def post(self): 
        data = UserRegister.parser.parse_args()
        user = UserModel(None, data["username"], data["password"])
        if user.save():
            return {"message": "User created successefully"}, 201
        return {"message": "User already exists"}, 400
        