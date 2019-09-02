// Subjects
function getSubjects(first){
    document.getElementById("showCourses").innerHTML = "";
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
    let content= "";
    const addRecord = (record) => {
        if (record.charAt(0).toUpperCase() === first){
            content += "<div class='col-lg-2 col-md-2 col-sm-4 col-xs-4'>"
                            + "<button type='submit' class='btn-primary btn-sm' onclick='getCourse(\""
                            + record +"\")'>" + record + "</button> </div>";
        }
    }
    Object.keys(subjects).forEach(addRecord);
    if (content == "") {content = "No course offered for this selection"}
    document.getElementById("showSubjects").innerHTML = content;
}

// Courses Data
function getCourse(subject) {
    const uri = "https://api.auckland.ac.nz/service/courses/v2/courses?subject=" + subject.toLowerCase() + "&size=150";
    const xhr= new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload= () => {
        const resp= JSON.parse(xhr.responseText);
            
        resp.data.sort((a,b) => {
            let x = a["catalogNbr"]; let y = b["catalogNbr"];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });

        showCourse(resp.data);
    }
    xhr.send(null);
}

function showCourse(courses) {
    let content= "";
    const addRecord = (record) => {
        content += "<div class='col-lg-2 col-md-2 col-sm-6 col-xs-12'>"
                        + "<button type='submit' class='btn-primary btn-sm'>"  
                        + record.subject + " " + record.catalogNbr
                        + "</button> </div>";

    }
    courses.forEach(addRecord);
    document.getElementById("showCourses").innerHTML = content;
}
