$(function () {
    PrepareLocalStorage();
    listTasks();
})

function PrepareLocalStorage() {
    if (getLocalStorage() == null) {
        setLocalStorage(new Array());
    }
}

function createTask() {
    let formData = document.getElementById("newEventForm");
    let newTaskTitle = formData.newTaskTitle.value;
    let newDueDate = formData.newDueDate.value;
    if (newTaskTitle.length > 0) {

        let obj = {
            id: generateId(),
            title: newTaskTitle,
            created: renderToday(),
            completed: false,
            duedate: renderDate(newDueDate)
        };

        let getTasks = getLocalStorage();

        getTasks.push(obj);

        saveTask(getTasks);

        listTasks();
    }
}

function clearTasks() {
    localStorage.removeItem('storageTasks');
    setLocalStorage(new Array());
    listTasks();
}

function editTask() {
    let formData = document.getElementById("oldEventForm");
    let oldUUID = formData.oldUUID.value;
    let newTaskTitle = formData.newTaskTitle.value;
    let newDueDate = formData.newDueDate.value;
    let newCompleted = formData.newCompleted.checked;
    let getTasks = getLocalStorage();

    let obj = getTasks.find(t => {
        return t.id == oldUUID
    });

    if (newTaskTitle.length > 0) {
        obj.title = newTaskTitle;
    }
    if (newDueDate.length > 0) {
        obj.duedate = renderDate(newDueDate);
    }
    obj.completed = newCompleted;
    setLocalStorage(getTasks);
    listTasks();

}

function saveTask(task) {

    setLocalStorage(task);
}

function listTasks() {
    let getTasks = getLocalStorage();

    if (getTasks != null) {
        listTasksByFilter(getTasks);
    }
}

function deleteTask(element) {
    let getTasks = getLocalStorage();
    let index = getIndex(element);
    getTasks.splice(index, 1);
    setLocalStorage(getTasks);
    listTasks();
}

function completeTask(element) {
    let getTasks = getLocalStorage();
    let taskId = getTaskId(element);
    let obj = getTasks.find(t => {
        return t.id == taskId
    });
    obj.completed = !obj.completed;
    setLocalStorage(getTasks);
    listTasks();
}

function getIndex(element) {
    let taskId = getTaskId(element);
    let getTasks = getLocalStorage();
    return getTasks.findIndex(t => t.id == taskId);
}

function getTaskCount() {
    return getLocalStorage().length;
}

function getFilteredTaskCount(getTasks) {
    return getTasks.length;
}

function renderDate(date) {
    let [year, month, day] = date.split('-');
    return [month, day, year].join('/');
    //return date;
}

function renderToday() {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    //today = mm + '-' + dd + '-' + yyyy;
    //console.log(today);
    today = mm + '/' + dd + '/' + yyyy;
    //console.log(today);
    //today = dd + '-' + mm + '-' + yyyy;
    //console.log(today);
    //today = dd + '/' + mm + '/' + yyyy;
    //console.log(today);
    return today;
}

function renderCalendar(date) {
    var today = new Date(date);
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    //today = mm + '-' + dd + '-' + yyyy;
    //console.log(today);
    //today = mm + '/' + dd + '/' + yyyy;
    //console.log(today);
    //today = dd + '-' + mm + '-' + yyyy;
    //console.log(today);
    //today = dd + '/' + mm + '/' + yyyy;
    //console.log(today);
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function getTaskId(element) {
    //let taskId = $(element).parent().attr("data-id");
    let taskId = element.parentElement.getAttribute("data-id");
    return taskId;
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem('storageTasks'));
}

function setLocalStorage(data) {
    localStorage.setItem("storageTasks", JSON.stringify(data));
}

function ClearTooltip() {}

function generateId() {
    // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //     var r = Math.random() * 16 | 0,
    //         v = c == 'x' ? r : (r & 0x3 | 0x8);
    //     return v.toString(16);
    // });
    //return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    //    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    //);
    var d = new Date().getTime(); //Timestamp
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) { //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else { //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function editTaskShow(element) {
    let getTasks = getLocalStorage();
    let taskId = getTaskId(element);
    let obj = getTasks.find(t => t.id == taskId);

    $("#oldUUID").val(obj.id);
    $("#oldTaskTitle").val(obj.title);
    $("#oldDueDate").val(renderCalendar(obj.duedate));
    //$("#oldCompletedStr").val(Difference_In_Days);

    document.getElementById("oldCompleted").checked = obj.completed;
    $("#editTask").modal("show");
}

function FilterIncomplete() {
    let getTasks = JSON.parse(localStorage.getItem('storageTasks')).filter(t => t.completed == false);
    listTasksByFilter(getTasks);
}

function FilterCompleted() {
    let getTasks = JSON.parse(localStorage.getItem('storageTasks')).filter(t => t.completed == true);
    listTasksByFilter(getTasks);
}

function FilterOverDue() {
    // var date1 = new Date(obj.duedate);
    // var date2 = new Date();
    // var Difference_In_Time = date1.getTime() - date2.getTime();
    // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let getTasks = JSON.parse(localStorage.getItem('storageTasks')).filter(t => ((new Date(t.duedate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) <= 0);
    listTasksByFilter(getTasks);
}

function listTasksByFilter(getTasks) {

    const template = document.getElementById("Data-Template");
    const resultsBody = document.getElementById("resultsBody");
    // Clear table first
    resultsBody.innerHTML = "";
    if (getTasks != null) {
        getTasks.forEach(function (getTasks, index) {
            const dataRow = template.content.cloneNode(true);
            dataTR = dataRow.querySelectorAll("tr");
            dataCols = dataRow.querySelectorAll("td");
            if (getTasks.completed) {
                dataTR[0].setAttribute("class", "complete"); // completed                
            } else {
                dataTR[0].setAttribute("class", ""); // Incompleted                
            }
            dataCols[0].textContent = getTasks.id; // task Id
            dataCols[1].textContent = getTasks.title; // title
            dataCols[2].textContent = getTasks.created; // created
            dataCols[3].textContent = getTasks.duedate; // duedate
            dataCols[4].setAttribute("data-id", getTasks.id); //data-id
            // Add the row to the page
            resultsBody.appendChild(dataRow);
        });

    }
    getFilteredTaskCount(getTasks) > 0 ? document.getElementById("nTasks").innerText = `(${getFilteredTaskCount(getTasks)})` : document.getElementById("nTasks").innerText = "";
}