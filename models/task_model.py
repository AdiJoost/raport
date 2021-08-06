from db import db
import datetime

class TaskModel(db.Model):
    OPEN = 1
    WORKED_ON = 2
    DONE = 3
    PROBLEMS_ARRISED = 4
    
    __tablename__ = "tasks"
    
    
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    description = db.Column(db.String())
    status = db.Column(db.Integer())
    due = db.Column(db.Date())
    initialized = db.Column(db.Date())
    done = db.Column(db.Date())
    time_used = db.Column(db.Integer())
    
    
    
    def __init__ (self, name, description, due, initialized):
        self.name = name
        self.description = description
        self.due = due
        if (initialized):
            self.initialized = initialized
        else:
            self.initialized = datetime.date.today()
        self.status = TaskModel.OPEN
        self.done = None
        self.time_used = 0
        
    def to_json(self):
        return {"name": self.name,
                "id": self.id,
                "description": self.description,
                "status": self.status,
                "due": self.due,
                "initialized": self.initialized,
                "done": self.done,
                "time_used": self.time_used}
    
    def save (self):
        db.session.add(self)
        db.session.commit()
        
    def deleteMe(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def get_tasks_by_status(cls, status):
        return cls.query.filter_by(status=status).all()
        
    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter_by(name=name).first()
    
    @classmethod
    def get_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
    
    @classmethod
    def get_all(cls):
        return cls.query.order_by(TaskModel.status).all()
    
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
        