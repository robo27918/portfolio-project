from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from sqlalchemy import insert


from data import(
    get_db,
    init_db,
    Project,
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
class ProjectCreate(BaseModel):
    title:str
    description:str
    technologies:str|None
    url:str|None
    github_url:str|None
    image_url:str|None

@app.post("/projects")
async def make_project(project:ProjectCreate,
                         db:AsyncSession= Depends(get_db)):
    stmt = insert(Project).values(
        title = project.title,
        description= project.description,
        technologies = project.technologies,
        url = project.url,
        github_url = project.github_url,
        image_url = project.image_url,
    ).returning(Project)

    result = await db.execute(stmt)
    await db.commit()
    return result.fetchone()
    