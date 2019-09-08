// Subjects
function getSubjects(first){
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
    let content = ``;
    const addRecord = (record) => {
        if (record.charAt(0).toUpperCase() === first){
            content += `<div class="card"> 
                            <div class="card-header p-1" id="${record}">
                                <h2 class="mb-0"> 
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${record}" aria-expanded="true" aria-controls="collapse${record}" 
                                        onclick="getCourse('${record}')"> 
                                        ${record} - ${subjects[record]}
                                    </button>
                                </h2>
                            </div>
                            <div id="collapse${record}" class="collapse" aria-labelledby="${record}" data-parent="#subject-accord">
                                <div class="card-body">
                                    <div class="accordion" id="${record}-accord"> </div>
                                </div>
                            </div>
                        </div>`;
        }
    }
    Object.keys(subjects).forEach(addRecord);
    if (content == ``) {
        content = `<div class="card border"> <div class="card-header"> No course offered for this selection </div> </div>`;
    }
    document.getElementById("subject-accord").innerHTML = content;
}

// Courses Data
function getCourse(subject) {
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
    let content = ``;
    const addRecord = (record) => {
        content += `<div class="card"> 
                        <div class="card-header p-1" id="${record.subject}${record.catalogNbr}">
                            <h2 class="mb-0"> 
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${record.subject}${record.catalogNbr}"
                                    aria-expanded="true" aria-controls="collapse${record.subject}${record.catalogNbr}" onclick="getClasses('${record.subject}', '${record.catalogNbr}')">
                                ${record.subject} ${record.catalogNbr}: ${record.titleLong} 
                                </button> 
                            </h2>
                        </div>
                        <div id="collapse${record.subject}${record.catalogNbr}" class="collapse" aria-labelledby="${record.subject}${record.catalogNbr}" data-parent="#${record.subject}-accord">
                            <div class="card-body">
                                <div class="row" id="${record.subject}${record.catalogNbr}-classes">
                                    <div class="col-3" id="${record.subject}${record.catalogNbr}-comptype"> </div>
                                    <div class="col-9" id="${record.subject}${record.catalogNbr}-compdetail"> </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

    }
    courses.forEach(addRecord);
    document.getElementById(courses[0].subject + "-accord").innerHTML = content;
}

// Classes
function getClasses(subject, subjectNum){
    const uri = `https://mpat-cors.herokuapp.com/https://api.auckland.ac.nz/service/classes/v1/classes?year=2019&subject=${subject}&catalogNbr=${subjectNum}&size=20`;
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
        getSchedule(resp.data, subject, subjectNum);
    }
    xhr.send(null);

}

function showClasses(data, subject, subjectNum){
    let classes = new Set;
    data.forEach(x => {
        classes.add(x["component"])
    });

    let content = `<div class="accordion accordion-md" id="${subject}${subjectNum}-components">`;
    
    classes.forEach(x => {
        content += `<div class="card"> 
                        <div class="card-header" id="${subject}${subjectNum}${x}-head" >
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${subject}${subjectNum}${x}-body"
                                    aria-expanded="false" aria-controls="${subject}${subjectNum}${x}-body">
                                    ${x}
                                </button> 
                            </h2>
                        </div>
                        <div id="${subject}${subjectNum}${x}-body" class="collapse" aria-labelledby="${subject}${subjectNum}${x}-head" data-parent="#${subject}${subjectNum}-components">
                            <div class="card-body">`;

        data.forEach (subjectClass => {
            if (subjectClass.component == x) {
                content += `<button id="${subject}${subjectNum}${subjectClass.classNbr}-tab" role="tab" aria-controls="${subject}${subjectNum}${subjectClass.classNbr}" 
                                aria-selected="false" onclick="showDetails('${subject}${subjectNum}${subjectClass.classNbr}')">
                                ${subjectClass.classSection}-${x} (${subjectClass.classNbr})
                            </button>`;
            }
        });

        content += `</div> </div> </div>`;
    });
    content += `</div>`;
    document.getElementById(subject + subjectNum + "-comptype").innerHTML = content;

}

function formatDate(dateString) {
    let date = dateString.toString().split("-");
    return date[2] + '/' + date[1] + '/' + date[0];
}

// Schedule
function getSchedule(subjectClasses, subject, subjectNum){
    let content = `<div class="tab-content" id="${subject}${subjectNum}-tabContent">`;
    subjectClasses.forEach( record => {
        content += `<div class="tab-pane classDetails fade" id="${subject}${subjectNum}${record.classNbr}" role="tabpanel" 
                        aria-labelledby="${subject}${subjectNum}${record.classNbr}-tab">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Start/End Dates</th>
                                    <th scope="col">Days</th>
                                    <th scope="col">Times</th>
                                    <th scope="col">Room</th>
                                </tr>
                            </thead>
                            <tbody>`;

        record.meetingPatterns.forEach( meeting => {
            let startDate = formatDate(meeting.startDate);
            let endDate = formatDate(meeting.endDate);
            content += `<tr>
                            <td>${startDate} - ${endDate}</td>
                            <td>`;
                
            if (meeting.daysOfWeek === "mon") { content += "Monday" }
            else if (meeting.daysOfWeek === "tue") { content += "Tuesday" }
            else if (meeting.daysOfWeek === "wed") { content += "Wednesday" }
            else if (meeting.daysOfWeek === "thu") { content += "Thursday" }
            else { content += "Friday" }

            content += `    </td>
                            <td>${meeting.startTime} to ${meeting.endTime}</td>
                            <td>${meeting.location}</td>
                        </tr>`;
        });
                    
        content += `</tbody> </table> </div>`;
    });
    content += `</div>`;
    document.getElementById(subject + subjectNum + "-compdetail").innerHTML = content;
}

function showDetails(id){
    let x = document.getElementById(id);
    if (x.classList.contains('active') && x.classList.contains('show')) {
        x.classList.remove('active');
        x.classList.remove('show');
    } else {
        let pages = document.getElementsByClassName('classDetails');
        for(let i = 0; i < pages.length; i++){
            if(!(pages[i].id === id)){
                pages[i].classList.remove('active');
                pages[i].classList.remove('show');
            }
        }
        x.classList.add('active');
        x.classList.add('show');

    }
}