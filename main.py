from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean, ForeignKey 
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session 

# Database Configuration
DATABASE_URL = "sqlite:///./hrms.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    role = Column(String)

class Leave(Base):
    __tablename__ = "leaves"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(Date)
    end_date = Column(Date)
    reason = Column(String)
    status = Column(String)

class Shift(Base):
    __tablename__ = "shifts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    shift_type = Column(String)

class Training(Base):
    __tablename__ = "trainings"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)

class Performance(Base):
    __tablename__ = "performances"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    metric = Column(String)
    score = Column(Integer)

# Create tables
Base.metadata.create_all(bind=engine)

# Routers
@app.get("/users/")
async def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/leaves/")
async def read_leaves(db: Session = Depends(get_db)):
    return db.query(Leave).all()

@app.get("/shifts/")
async def read_shifts(db: Session = Depends(get_db)):
    return db.query(Shift).all()

@app.get("/trainings/")
async def read_trainings(db: Session = Depends(get_db)):
    return db.query(Training).all()

@app.get("/performances/")
async def read_performances(db: Session = Depends(get_db)):
    return db.query(Performance).all()