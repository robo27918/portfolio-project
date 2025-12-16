from fastapi import FastAPI, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from sqlalchemy import insert


from data import(
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
    