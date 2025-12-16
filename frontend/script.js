const API_URL ="http://localhost:8000"
async function loadSkills(){
    console.log("call to load skills method")
    try{
        const response = await fetch(`${API_URL}/skills`)

        if (!response.ok){
            throw new Error(`HTTP error! status:${response.status}`)
        }
        const skills = await response.json();
        console.log(skills)
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
    }
    catch(e){
        console.log(`error: ${e.message}`)
    }
    finally{
        console.log("done loading")
    }
}
loadProjects()