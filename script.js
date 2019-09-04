// Subjects
function getSubjects(first){
    document.getElementById("showCourses").innerHTML = "";
    document.getElementById("showSchedule").innerHTML = "";
    document.getElementById("showClasses").innerHTML = "";
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
    document.getElementById("showClasses").innerHTML = "";
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
                        + "<button type='submit' class='btn-default btn-sm' onclick='getClasses(\"" + record.subject + "\",\"" + record.catalogNbr + "\")'>" 
                        + record.subject + " " + record.catalogNbr
                        + "</button> </div>";

    }
    courses.forEach(addRecord);
    document.getElementById("showCourses").innerHTML = content;
}

// Classes
function getClasses(subject, subjectNum){
    document.getElementById("showSchedule").innerHTML = "";
    const uri = "https://mpat-cors.herokuapp.com/" // Proxy
                + "https://api.auckland.ac.nz/service/classes/v1/classes?year=2019&subject=" 
                + subject + "&catalogNbr=" + subjectNum + "&size=20";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);

        resp.data.sort((a,b) => {
            let x = a["component"]; let y = b["component"];
            if (x == "LEC" && y != "LEC") return -1
            else if (y == "LEC" && x != "LEC") return 1
            else if (x == "LEC" && y == "LEC") return 0
        });
        showClasses(resp.data, subject, subjectNum);
    }
    xhr.send(null);

}

function showClasses(classes, subject, subjectNum){
    if( classes.length == 0) {
        document.getElementById("showClasses").innerHTML = "Schedule not available.";
    } else {
        let content = "";
        const addRecord = (record) => {
            content += "<div class='col-lg-2 col-md-2 col-sm-6 col-xs-12'>"
                    + "<button type='submit' class='btn-default btn-sm' onclick='getSchedule(\"" 
                    + subject + "\",\"" + subjectNum + "\",\"" + record.classNbr + "\")'>"
                    + record.component + " - (" + record.classNbr + ") Status: " 
            content += (record.status == "O") ? "Open" : (record.status == "W") ? "Waitlist" : "Closed";
            content += " </button> </div>";
            }
            
        classes.forEach(addRecord);
        document.getElementById("showClasses").innerHTML = content;
    }
}

// Testing
/*
function getClasses2(data){
    let classes = new Set;
    data.forEach(x => {
        classes.add(x["component"])
    });
    let content = "";
    classes.forEach(x => {
        content += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'> <button type='submit' class='btn-default btn-sm'>" + x + "</button>";
    });
    document.getElementById("showClasses").innerHTML = content;

} */

function formatDate(dateString) {
    let date = dateString.toString().split("-");
    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    
    let day = date[2];
    let monthIndex = parseInt(date[1]) - 1;
    let year = date[0];
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

// Schedule
function getSchedule(subject, subjectNum, classNum){
    const uri = "https://cors-anywhere.herokuapp.com/" // Proxy
                + "https://api.auckland.ac.nz/service/classes/v1/classes?year=2019&subject=" 
                + subject + "&catalogNbr=" + subjectNum + "&classNbr=" + classNum + "&size=20";
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
        let content = "<table> <tr> <th>Start/End Date</th> <th>Start/End Time</th> <th>Location</th> <th>Day of Week</th> </tr>";
        const addRecord = (record) => {
            record.meetingPatterns.forEach( meeting => {
                let startDate = formatDate(meeting.startDate);
                let endDate = formatDate(meeting.endDate);
                content += "<tr> <td> " + startDate + " / " + endDate + "</td>"
                        + "<td> " + meeting.startTime + " / " + meeting.endTime + "</td>"
                        + "<td> " + meeting.location + "</td> <td>";

                if (meeting.daysOfWeek === "mon") { content += "Monday" }
                else if (meeting.daysOfWeek === "tue") { content += "Tuesday" }
                else if (meeting.daysOfWeek === "wed") { content += "Wednesday" }
                else if (meeting.daysOfWeek === "thu") { content += "Thursday" }
                else { content += "Friday" }

                content += "</td></tr>";
            });
            }
            
        schedule.forEach(addRecord);
        content += "</table>";
        document.getElementById("showSchedule").innerHTML = content;
    }
}