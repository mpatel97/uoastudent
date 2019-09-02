let isOpen = false;

// Subjects
function getSubjects(first){
    const uri = "https://api.auckland.ac.nz/service/courses/v2/subjects?effectiveYear=2019";
    const xhr= new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload= () => {
        const resp= JSON.parse(xhr.responseText);
        showSubjects(resp, first);
    }
    xhr.send(null);
}

function showSubjects(subjects, first){
    let tableContent= ""
    const addRecord = (record) => {
        console.log(record);
        if (record.charAt(0).toUpperCase() === first){
            tableContent += "<div class='col-lg-2 col-md-2 col-sm-6 col-xs-12'>"
                            + "<button type='submit' class='btn-primary btn-sm'>"  
                            + record + "</button> </div>";
        }
    }
    Object.keys(subjects).forEach(addRecord);
    document.getElementById("showSubjects").innerHTML = tableContent;
}

// Courses Data
function getCourses() {
    if (!isOpen) {
        isOpen = true;

        const uri = "https://api.auckland.ac.nz/service/courses/v2/courses?subject=compsci&size=200";
        const xhr= new XMLHttpRequest();
        xhr.open("GET", uri, true);
        xhr.onload= () => {
            const resp= JSON.parse(xhr.responseText);
            
            resp.data.sort((a,b) => {
                let x = a["catalogNbr"]; let y = b["catalogNbr"];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });

            showCourses(resp.data);
        }
        xhr.send(null);
    }
    else {
        document.getElementById("showCourses").innerHTML = "";
        isOpen = false;
    }
}

function showCourses(courses) {

    let tableContent= ""
    const addRecord = (record) => {
        tableContent += "<div class='col-lg-2 col-md-2 col-sm-6 col-xs-12'>"
                        + "<button type='submit' class='btn-primary btn-sm'>"  
                        + record.subject + " " + record.catalogNbr
                        + "</button> </div>";

    }
    courses.forEach(addRecord);
    document.getElementById("showCourses").innerHTML = tableContent;
}
