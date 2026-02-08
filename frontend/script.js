const API_URL ="http://localhost:8000"
const skill_table = document.getElementById("skill-table-body")
const project_table = document.getElementById("project-table-body")

// initialize bootstrap modal
const editModalElement = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalElement);
const editForm = document.getElementById("editForm");

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
    table_row.className = "project-row"
    table_row.id = `${response.id}`
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
        const target = e.target;
        if (target.classList.contains("delete-btn")){

            const tableRow = e.target.closest(".skill-row");
             // find a way to get the skill-id from the tableRow
            if (tableRow){
                //find a a way to get the skill id
                console.log(tableRow.children)
                let targetId = tableRow.children[0].textContent
                if(confirm(`Delete ${targetId}?`)){
                    console.log('deleted ....')
                    // hit the delete api point for deleting skill
                    deleteSkill(targetId)
                }
            }

        }
        else if(target.classList.contains("edit-btn")){
            const editBtn = e.target.closest("edit-btn");
            if(editBtn){
                // const projectId = editBtn.dataset.id;
                // console.log("projectId for editing is", projectId)
                // openEditModal(projectId);
            }
         
        }
      
    })
})
document.addEventListener("DOMContentLoaded",function(){
    project_table.addEventListener('click', async function(e){
        
        const target = e.target;

        if(target.classList.contains("delete-btn")){
        const tableRow = e.target.closest(".project-row");
     
        // find a way to get the skill-id from the tableRow
            if (tableRow){
                //find a a way to get the skill id
        
                let targetId = tableRow.children[0].textContent
                
                if(confirm(`Delete ${targetId}?`)){
                    console.log('deleted ....')
                    // hit the delete api point for deleting skill
                    deleteProject(targetId)
                }
            }    
        }
        else if(target.classList.contains("edit-btn")){
            const tableRow = e.target.closest(".project-row");
            console.log("clicked edit button")

            if (tableRow){
                const targetId = tableRow.children[0].textContent;
                console.log("PROJECT_ID",targetId);
                openEditModal(targetId)
            }
        }
        
    })
})
// delete method for deleting skill by id
async function deleteSkill(skillId){
    try{
        const response = await fetch(`http://localhost:8000/skills/${skillId}`,
            {method : "DELETE"

            });
        if (response.ok){
            console.log('Deleted skill:',skillId);

        }
    }
    catch(error){
        console.error("Skill Delete failed", skillId);
    }
}

async function deleteProject(projectId){

    try{
        const response = await fetch(`http://localhost:8000/projects/${projectId}`,
            {method : "DELETE"

            });
        if (response.ok){
            console.log('Deleted project:',projectId);

        }
    }
    catch(error){
        console.error("Project Delete failed", projectId);
    }
}

// open edit modal with item data
async function openEditModal(projectId){
    try{
        const response = await fetch(`http://localhost:8000/project/${projectId}`);
        const project =  await response.json();
        console.log("project from openEditModal", project)
        document.getElementById("editProjectId").value = project.id;
        document.getElementById("editTitle").value = project.title;
        editModal.show()
    }
    catch(error){
        console.error("Error handling item",error);

    }
}
// Handle form Submission (PATCH request)
editForm.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const projectId = document.getElementById("editProjectId").value;

    const formData = {
        title : document.getElementById('editTitle').value,
    };
    console.log("form-data",formData);
    try{
        const response = await fetch(`${API_URL}/project/${projectId}`,{
            method: 'PATCH',
            headers:{
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok){
            editModal.hide();
        }
        else{
            const error = await response.json();
            console.log("Error",error);
        }
    }catch(error){
        console.error('Error updating item:',error);
    }
    finally{
        console.log("some clean up required ???")
    }
})