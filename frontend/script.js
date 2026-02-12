const API_URL="https://6lfcyxhtkb.execute-api.us-east-1.amazonaws.com"
const skill_table = document.getElementById("skill-table-body")
const project_table = document.getElementById("project-table-body")

// initialize bootstrap modal
const editProjectModalElement = document.getElementById("editProjectModal");
const editProjectModal = new bootstrap.Modal(editProjectModalElement);
const editProjectForm = document.getElementById("editProjectForm");

const editSkillModalElement = document.getElementById("editSkillModal");
const editSkillModal = new bootstrap.Modal(editSkillModalElement);
const editSkillForm = document.getElementById("editSkillForm");

//initialize Toast object
const toastElement  = document.getElementById("liveToast");
const toast = new  bootstrap.Toast(toastElement) 
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
            const skillTableRow = e.target.closest(".skill-row")
            if (skillTableRow){
                let targetId = skillTableRow.children[0].textContent;
                console.log("SKILL_ID",targetId);
                openEditSkillModal(targetId);
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
                openEditProjectModal(targetId)
            }
        }
        
    })
})
// delete method for deleting skill by id
async function deleteSkill(skillId){
    try{
        console.log("DELETING SKILL",skillId);
        const response = await fetch(`${API_URL}/skills/${skillId}`,
            {method : "DELETE"

            });
        if (response.ok){
            console.log('Deleted skill:',skillId);

        }
        else{
            const error  = await response.json();
            console.error(error)
        }
    }
    catch(error){
        console.error("Skill Delete failed", skillId);
    }
}

async function deleteProject(projectId){
    
    try{
        const response = await fetch(`${API_URL}/projects/${projectId}`,
            {method : "DELETE"

            });
        if (response.ok){
            console.log('Deleted project:',projectId);

        }
        else{
            const error = await response.json();
            console.error(error);
        }
    }
    catch(error){
        console.error("Project Delete failed", projectId);
    }
}

// open edit modal with item data
async function openEditProjectModal(projectId){
    try{
        const response = await fetch(`${API_URL}/project/${projectId}`);
        const project =  await response.json();
        console.log("project from openEditModal", project)
        document.getElementById("editProjectId").value = project.id;
        document.getElementById("editTitle").value = project.title;
        editProjectModal.show()
    }
    catch(error){
        console.error("Error handling item",error);

    }
}
// Handle form Submission (PATCH request)
editProjectForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    console.log("clicked something in project form")
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
            editProjectModal.hide();
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
});

async function openEditSkillModal(skillId){
    try{
        const response = await fetch(`${API_URL}/skill/${skillId}`);
        const skill =  await response.json();
        console.log("skill from openEditModal", skill)
        // console.log(`${skill.id} |||| ${skill.skill_title}`, )
        document.getElementById("editSkillId").value = skill.id;
        document.getElementById("editSkillTitle").value = skill.skill_title;
        document.getElementById("editCategory").value = skill.category;
        editSkillModal.show()
    }
    catch(error){
        console.error("Error handling item",error);
    }
}

editSkillForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    console.log("clicked something from skillForm")
    const skillId = document.getElementById("editSkillId").value;
    console.log(skillId);
    const formData = {
        skill_title : document.getElementById('editSkillTitle').value,
    };
    console.log("form-data",formData);
    try{
        const response = await fetch(`${API_URL}/skill/${skillId}`,{
            method: 'PATCH',
            headers:{
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok){
            editSkillModal.hide();
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
});
// test_var = document.getElementById("projectForm")
// console.log(`****${test_var.formData()} ****`)
document.getElementById("projectForm")
        .addEventListener("submit", async (e)=>{
            e.preventDefault();
            console.log("submit clicked")
            const form = e.target;
            const data = Object.fromEntries( new FormData(form))
            console.log("***DATA***")
            for (let key in data){
                console.log(`${data[key]}`)
            }
            console.log("***DATA***")
            try{
                console.log("*****sending data****");
                const response = await fetch(`${API_URL}/projects`,{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json"
                        }   ,
                    body: JSON.stringify(data)
                     });
                
                if (!response.ok){
                    const error =   await response.json();
                    console.log("*** ERROR:$}***",error)
                    showToast("Failed to create NEW PROJECT","error");
                    
                }
                else{
                    const res = await response.json()
                    console.log("***CHECKING OUT RES***",res);
                    showToast("Created New project","success");
                    form.reset();

                
                }
            }
            catch(error){
                console.log(error);
            }
            finally{
                console.log("all done.....")
            }
        });

document.getElementById("skillForm")
        .addEventListener("submit", async (e)=>{
            e.preventDefault();
            console.log("submitted new skill")
            const form = e.target;
            const data = Object.fromEntries( new FormData(form))
            try{

                response = await fetch(`${API_URL}/skills`,{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json"
                        },
                    body: JSON.stringify(data)
                });
                
                if(!response.ok){
                    const error = await response.json()
                    console.log(error);
                    showToast("New project creation failed","error")
                }
                else{
                    showToast("Submitted NEW proejct","success");
                    form.reset();
                }
            }  
            
            catch(error){
                console.log(error);
            }
            finally{
                console.log("all done..")
            }
            
        });

function showToast(message,type='Success'){
    console.log("***CALL TO TOAST***")
   const toastMessage =document.getElementById("toastMessage");

   toastElement.classList.remove("text-bg-success","text-bg-danger");

   if(type ==="error"){
    toastElement.classList.add("text-bg-danger");
   }
   else{
    toastElement.classList.add("text-bg-sucess");
   }
   toastMessage.textContent = message;
   console.log("***TOAST***",toastMessage,toastElement,toast)
   toast.show()
}