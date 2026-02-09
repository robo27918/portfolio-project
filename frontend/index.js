
const API_URL="https://6lfcyxhtkb.execute-api.us-east-1.amazonaws.com"
// getting necessary DOM elements
const project_list = document.getElementById("projects")
const skill_list = document.getElementById("skills")

// Modal controls

async function loadAllSkills(){
    console.log("call to load skills method")
    try{
        const response = await fetch(`${API_URL}/skills`)

        if (!response.ok){
            throw new Error(`HTTP error! status:${response.status}`)
        }
        const skills = await response.json();
        console.log(skills)
        for(let i = 0; i < skills.length; i++){
            loadSkill(skills[i])
        }

    }
    catch(e){
        console.log("some kinda error")
        console.log(e.message)
        
    }
    finally{
        console.log("done loading")
    }
}

function loadSkill(skill){
    console.log(skill)
    skill_list_item = document.createElement("li");
    skill_list_item.textContent = `$ ${skill.id} | ${skill.skill_title} | ${skill.category}`
    skills.appendChild(skill_list_item);

}
loadAllSkills()

async function loadAllProjects(project){
    try{
        const response = await fetch(`${API_URL}/projects`)

        if (!response.ok){
            throw new Error(`HTTP error! status:${response.status}`)
        }
        const projects = await response.json();
        console.log(projects)
        for(let i = 0; i < projects.length; i++){
            loadProject(projects[i])
        }

    }
    catch(e){
        console.log("some kinda error")
        console.log(e.message)
        
    }
    finally{
        console.log("done loading")
    }
}

function loadProject(project){
    console.log(project)
    project_list_item = document.createElement("li");
    project_list_item.textContent = `$ ${project.id} | ${project.title} | ${project.description} | ${project.url} | ${project.technologies}`
    projects.appendChild(project_list_item);
}
loadAllProjects()
