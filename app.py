from flask import Flask, render_template, send_from_directory
from flask_restful import Api
from flask_jwt import JWT
from security import authenticate, identity
from resources.user import UserRegister
from resources.kid import Kid, Kids, KidsByDay
from resources.gift import Gift, Gifts
from db import db
from resources.task import Task, Tasks


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
    return render_template("index.html")

@app.route('/addKid', methods=['GET'])
def addKid():
    return render_template("add_kid.html")

@app.route('/editKid/<string:_id>')
def editKid(_id):
    return render_template("edit_kid.html", data={"id": _id})

@app.route('/allKids')
def allKids():
    return render_template("external_css.html")

@app.route('/tasks')
def taskes():
    return render_template("tasks.html")

@app.route('/addTask')
def addTask():
    return render_template("add_task.html")

@app.route('/giftpage')
def giftpage():
    return render_template("gifts.html")

@app.route('/addGift/<string:kid_id>')
def addGift(kid_id):
    return render_template("add_gift.html", data={"kid_id": kid_id})

@app.route('/static/<path:path>')
def static_dir(path):
    return send_from_directory("static", path)


api.add_resource(UserRegister, '/register')
api.add_resource(Kid, '/kid/<string:name>')
api.add_resource(Kids, '/kids')
api.add_resource(KidsByDay, '/kids/<string:dayString>')
api.add_resource(Task, '/task/<string:name>')
api.add_resource(Tasks, '/tasks/<string:param>')
api.add_resource(Gift, '/gift/<int:_id>')
api.add_resource(Gifts, '/gifts')

if __name__ == "__main__":
    db.init_app(app)
    app.run(port=5000, host="0.0.0.0", debug=True)
