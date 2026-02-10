
const API_URL="https://6lfcyxhtkb.execute-api.us-east-1.amazonaws.com"
// getting necessary DOM elements
const projects = document.getElementById("project-display-area");
const skills = document.getElementById("skill-display-area");
const projectTemplate = document.getElementById("project-template");
const skillTemplate = document.getElementById("skill-template");

async function loadAllSkills(){
    console.log("call to load skills method")
    try{
        const response = await fetch(`${API_URL}/skills`);

        if (!response.ok){
            throw new Error(`HTTP error! status:${response.status}`);
        }
        const skills = await response.json();
        console.log(skills)
        for(let i = 0; i < skills.length; i++){
            loadSkill(skills[i])
        }

    }
    catch(e){
        console.log(e.message)
        
    }
    finally{
        console.log("done loading")
    }
}

function loadSkill(skill){
    console.log(skill)
    const node = skillTemplate.content.cloneNode(true);
    node.querySelector("span").textContent = skill.skill_title;
    skills.appendChild(node);
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
        console.log(e.message)
        
    }
    finally{
        console.log("done loading")
    }
}

function loadProject(project){
    console.log("call to loadProject")
    const node = projectTemplate.content.cloneNode(true);
    node.querySelector(".card-img-top").src = `${'https://www.paramountshop.com/cdn/shop/files/spongebob-squarepants-life-sized-cardboard-cutout-standee-946804_1445x.jpg?v=1718292085'}`;
    node.querySelector(".card-title").textContent = project.title;
    node.querySelector(".card-text").textContent = project.description;
    node.querySelector(".btn").textContent = 'fake-url.com';
    projects.appendChild(node);
}
loadAllProjects()
