const API_URL = "http://localhost:8000"
// getting necessary DOM elements
const skill_list = document.getElementById("skills")
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