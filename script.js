// Subjects
function getSubjects(first){
    document.getElementById("showCourses").innerHTML = "";
    document.getElementById("showSchedule").innerHTML = "";
    const uri = "https://api.auckland.ac.nz/service/courses/v2/subjects?effectiveYear=2019";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        showSubjects(resp, first);
    }
    xhr.send(null);
}

function showSubjects(subjects, first){
    let content = "";
    const addRecord = (record) => {
        if (record.charAt(0).toUpperCase() === first){
            content += "<div class='col-lg-3 col-md-3 col-sm-4 col-xs-4'>"
                            + "<button type='submit' class='btn-default btn-sm' onclick='getCourse(\""
                            + record +"\")'>" + record +" - " + subjects[record] + "</button> </div>";
        }
    }
    Object.keys(subjects).forEach(addRecord);
    if (content == "") {content = "No course offered for this selection"}
    document.getElementById("showSubjects").innerHTML = content;
}

// Courses Data
function getCourse(subject) {
    document.getElementById("showSchedule").innerHTML = "";
    const uri = "https://api.auckland.ac.nz/service/courses/v2/courses?subject=" + subject.toLowerCase() + "&size=150";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
            
        resp.data.sort((a,b) => {
            let x = a["catalogNbr"]; let y = b["catalogNbr"];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });

        showCourse(resp.data);
    }
    xhr.send(null);
}

function showCourse(courses) {
    let content = "";
    const addRecord = (record) => {
        content += "<div class='col-lg-2 col-md-2 col-sm-6 col-xs-12'>"
                        + "<button type='submit' class='btn-default btn-sm' onclick='getSchedule(\"" + record.subject + "\",\"" + record.catalogNbr + "\")'>" 
                        + record.subject + " " + record.catalogNbr
                        + "</button> </div>";

    }
    courses.forEach(addRecord);
    document.getElementById("showCourses").innerHTML = content;
}


// Schedule
function getSchedule(subject, subjectNum){
    const uri = "https://cors-anywhere.herokuapp.com/" // Proxy
                + "https://api.auckland.ac.nz/service/classes/v1/classes?year=2019&subject=" 
                + subject + "&catalogNbr=" + subjectNum + "&size=20";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);

        showSchedule(resp.data);
    }
    xhr.send(null);

}

function showSchedule(schedule){
    if( schedule.length == 0) {
        document.getElementById("showSchedule").innerHTML = "Schedule not available.";
    } else {
        let content = "<tr> <th>Component</th> <th>Status</th> <th>Term</th> </tr>";
        const addRecord = (record) => {
            content += "<tr> <td>" + record.component + "</td> <td>";
            content +=  (record.status == "O") ? "Open" : "Closed";
            content += "</td> <td>" + record.term + "</td> </tr>";
            }
        schedule.forEach(addRecord);
        document.getElementById("showSchedule").innerHTML = content;
    }
}