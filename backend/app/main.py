from fastapi import FastAPI, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import insert,select
from typing import List


from app.data import(
    get_db,
    init_db,
    Project,
    Skill
)
app = FastAPI()

#cors setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.on_event("startup")
async def startup():
    #create tables if they don't exist
    await init_db()
@app.get("/health")
async def health_check():
    return {"status":"ok"}

#Pydantic models for request validation
class ProjectResponse(BaseModel):
    id:int
    title:str
    description:str
    technologies:str|None
    url:str|None
    github_url:str|None
    image_url:str|None
    
    class Config:
        form_attributes = True
class SkillResponse(BaseModel):
    id:int
    skill_title:str
    category:str|None
    class Config:
        form_attributes = True

@app.post("/projects",response_model=ProjectResponse)
async def make_project( 
    title:str=Form(...),
    description:str = Form(...),
    technologies:str = Form(None),
    url:str = Form(None),
    github_url = Form(None),
    image_url = Form(None),
    db:AsyncSession= Depends(get_db)):
    
    print("made call to post method")
    stmt = insert(Project).values(
        title = title,
        description= description,
        technologies = technologies,
        url = url,
        github_url = github_url,
        image_url = image_url,
    ).returning(Project)

    result = await db.execute(stmt)
    await db.commit()

    project =  result.first()[0]
    print(f"Inserted project {project}")
    return project

@app.delete("/skills/{skill_id}")
async def delete_skill(skill_id:int, db:AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    skill = result.scalar_one_or_none()

    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    await db.delete(skill)
    await db.commit()
    return {"message":"Skill deleted successfully", "id":skill_id}

@app.get("/skills",response_model=List[SkillResponse])
async def get_skills(skip:int = 0, limit :int =10,
               db:AsyncSession=Depends(get_db)):
    results = await db.execute(select(Skill).offset(skip).limit(limit))
    skills = results.scalars().all()
    return skills
@app.get("/projects",response_model=List[ProjectResponse])
async def get_projects(skip:int =0, limit : int =10,
                       db:AsyncSession=Depends(get_db)):
    results = await db.execute(select(Project).offset(skip).limit(limit))
    projects = results.scalars().all()
    return projects
@app.post("/skills",response_model=SkillResponse)
async def make_skill(

    skill_title:str=Form(...),
    category:str = Form(...),
    db:AsyncSession= Depends(get_db)):

    print(skill_title)
    stmt = insert(Skill).values(
        skill_title = skill_title,
        category = category
    ).returning(Skill)
    result = await db.execute(stmt)
    await db.commit()

    skill = result.first()[0]
    print(f"Skill inserted : {skill}")
    return skill
    