const API_URL ="http://localhost:8000"
const skill_table = document.getElementById("skill-table-body")
const project_table = document.getElementById("project-table-body")
async function loadSkills(){
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
loadSkills()

async function loadProjects(){
    console.log("Call to load projects")
    try{
        const response = await fetch(`${API_URL}/projects`)
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const projects = await response.json()
        console.log(projects)
        for(let i = 0; i < projects.length; i++){
            loadProject(projects[i])
        }
    }
    catch(e){
        console.log(`error: ${e.message}`)
    }
    finally{
        console.log("done loading")
    }
}
loadProjects()

function loadSkill(response){
    console.log(response)
    table_row = document.createElement("tr")
    table_row.className="skill-row"
    id_data = document.createElement("td")
    name_data = document.createElement("td")
    category_data = document.createElement("td")
    active_data= document.createElement("td")
    button_data = document.createElement("td")
    edit_button = document.createElement("button")
    delete_button = document.createElement("button")
    edit_button.className= "btn btn-sm btn-primary me-2 edit-btn"
    delete_button.className= "btn btn-sm btn-danger me-2 delete-btn"
    edit_button.textContent ="Edit"
    delete_button.textContent = "Delete"
    button_data.appendChild(edit_button)
    button_data.appendChild(delete_button)

    // adding response values to data
    id_data.textContent = response.id
    name_data.textContent = response.skill_title
    category_data.textContent = response.category
    active_data.textContent = "active"
    table_row.append(id_data,name_data,category_data,
        active_data,button_data
    )
    skill_table.appendChild(table_row)
}

function loadProject(response){
    console.log(response)
    table_row = document.createElement("tr")
    table_row.id = `del-btn-${response.id}`
    id_data = document.createElement("td")
    title_data = document.createElement("td")
    description_data = document.createElement("td")
    technologies_data= document.createElement("td")
    button_data = document.createElement("td")
    edit_button = document.createElement("button")
    delete_button = document.createElement("button")
    edit_button.className= "btn btn-sm btn-primary me-2 edit-btn"
    delete_button.className= "btn btn-sm btn-danger me-2 delete-btn"
    edit_button.textContent ="Edit"
    delete_button.textContent = "Delete"
    button_data.appendChild(edit_button)
    button_data.appendChild(delete_button)

    // adding response values to data
    id_data.textContent = response.id
    title_data.textContent = response.title
    description_data.textContent = response.description
    technologies_data.textContent = response.technologies
    table_row.append(id_data,title_data,description_data,
        technologies_data,button_data)
    
    project_table.appendChild(table_row)

}

document.addEventListener("DOMContentLoaded",function(){
    skill_table.addEventListener('click', async function(e){
        const tableRow = e.target.closest(".skill-row");
        console.log(tableRow)
        // find a way to get the skill-id from the tableRow
        if (tableRow){
            //find a a way to get the skill id
            console.log(tableRow.children)
            let targetId = tableRow.children[0].textContent
            if(confirm(`Delete ${targetId}?`)){
                console.log('deleted ....')
            }
        }
    })
})