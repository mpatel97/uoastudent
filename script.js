// Courses Data -----------------------------------------------------------------------------------------------------------------
function getCourses() {
    const uri = "https://api.auckland.ac.nz/service/courses/v2/courses?subject=compsci&size=60";
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

function showCourses(courses) {

    let tableContent= ""
    const addRecord = (record) => {
        tableContent += "<div class='col-lg-3 col-md-3 col-sm-6 col-xs-12'> <h4>" + record.subject + " " + record.catalogNbr + "</h4>"
                        + "<table><tr><td>"  
                        + record.titleLong
                        + "</td><td>" + record.unitsAcadProg + " points</td></tr> <tr><td colspan='3'>";

        tableContent += (record.description != undefined) ? record.description : "";
        tableContent += "</td></tr> <tr><td colspan='3'>";
        tableContent += (record.rqrmntDescr != undefined) ? record.rqrmntDescr : "";
        tableContent += "</td></tr></table></div>\n<hr>";

    }
    courses.forEach(addRecord);
    document.getElementById("showCourses").innerHTML = tableContent;
}
