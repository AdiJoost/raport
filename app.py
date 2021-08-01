from flask import Flask, render_template
from flask_restful import Api
from flask_jwt import JWT
from security import authenticate, identity
from resources.user import UserRegister
from resources.kid import Kid, Kids, KidsByDay
from db import db
from models.kid_model import KidModel


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "LolHAHAHA"
api = Api(app)

jwt = JWT(app, authenticate, identity)


@app.before_first_request
def create_table():
    db.create_all()
    
    
@app.route('/home', methods=['GET'])
def home():
    
    return render_template("external_css.html")

@app.route('/addKid', methods=['GET'])
def addKid():
    return render_template("add_kid.html")


api.add_resource(UserRegister, '/register')
api.add_resource(Kid, '/kid/<string:name>')
api.add_resource(Kids, '/kids')
api.add_resource(KidsByDay, '/kids/<string:dayString>')

if __name__ == "__main__":
    db.init_app(app)
    app.run(port=5000, host="0.0.0.0", debug=True)
