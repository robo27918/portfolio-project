from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer,String,Boolean,select,DateTime,func
import os
from dotenv import load_dotenv
from datetime import date
load_dotenv()
DATABASE_URL = os.getenv("NEON_DB_URL")
print("hey there",DATABASE_URL)
engine = create_async_engine(DATABASE_URL,echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession,expire_on_commit=False)
created_at = Column(String)
#Base class for the models
Base = declarative_base()

class Project(Base):
    __tablename__="projects"
    id=Column(Integer,primary_key=True,index=True)
    title = Column(String,nullable=False)
    description=Column(String,nullable=False)
    # date_added = Column(date,nullable=False,default=date.today)
    technologies= Column(String)
    url= Column(String)
    github_url = Column(String)
    image_url = Column(String)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    
    
class Skill(Base):
    __tablename__="skills"
    id = Column(Integer,primary_key=True,index=True)
    skill_title = Column(String, nullable=False)
    category = Column(String,nullable=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    
#Session dependency
async def get_db():
    async with SessionLocal() as session:
        yield session
#create tables

async def init_db():
    async with engine.begin() as conn:
        #drop all the tables
        await conn.run_sync(Base.metadata.create_all)

async def get_all_projects(db:AsyncSession):
    result = await db.execute(select(Project))
    return result.scalars().all()
async def get_all_skills(db:AsyncSession):
    result = await db.execute(select(Skill))
    return result.scalars().all()