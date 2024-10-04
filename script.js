    window.onload = () => {
        gsap.from(".container", { opacity: 0, y: -50, duration: 0.5 });
        showList();
    };
    
    flatpickr("#datepicker", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
      });

    let addTasksButton = document.getElementById('addTasksButton');
    let typeTasks = document.getElementById('typeTasks');
    let typeTasks2 = document.getElementById('typeTasks2');
    let listContainer = document.getElementById('listContainer');
    let errorMessage = document.getElementById('errorMessage');
    let SelectPriorityText = document.getElementById('SelectPriorityText');
    let datepicker = document.getElementById('datepicker');
    let priorityText = '';
    let alarmTime;
    let alarmInterval;
    let li, span, editSpan, priorityList, h1, inputInsideLi, inputInsideLi2;
    
    new Sortable(listContainer, {
        animation: 400,
        onUpdate: function() {
            saveData();
        }
    });

    let CreateAllElements = () =>{
        li = document.createElement("li");
        inputInsideLi = document.createElement('span');
        inputInsideLi2 = document.createElement('span');
        span = document.createElement("img");
        editSpan = document.createElement("img");
        priorityList = document.createElement("p");
        h1 = document.createElement("h1");

            span.src = './images/trash-bin.gif';
            span.classList.add('TrashImg');
            inputInsideLi.classList.add('card-title');
            inputInsideLi2.classList.add('card-text');
            editSpan.src = './images/edit (1).png';
            editSpan.classList.add('editSpan');
            
            inputInsideLi.role = "input";
            inputInsideLi2.role = "input";
            inputInsideLi.contentEditable = false;
            inputInsideLi2.contentEditable = false;
            inputInsideLi.innerText = typeTasks.value ? typeTasks.value : "Edit Text";
            inputInsideLi2.innerText = typeTasks2.value ? typeTasks2.value : "Add description!";
            h1.innerText = datepicker.value;
            priorityList.innerText = priorityText;
            li.appendChild(inputInsideLi);
            li.appendChild(inputInsideLi2);
            li.appendChild(priorityList);
            assignClasses(priorityList);
            li.appendChild(h1);
            li.appendChild(span);
            li.appendChild(editSpan);
            li.classList.add('card');
            li.classList.add('bg-secondary');
            listContainer.appendChild(li);
            
            typeTasks.style.borderColor = 'white';
            gsap.from(li, { opacity: 0, x: -100, duration: 0.3 });
            typeTasks.value = '';
            saveData();
            
            addEditEvent(editSpan, inputInsideLi, inputInsideLi2);
            return [li, span, editSpan, priorityList, h1, inputInsideLi];
    };
    
    let addEditEvent = (editSpan, inputInsideLi, inputInsideLi2) => {
        let isEditing = false;
        editSpan.addEventListener("click", () => {
            if (isEditing) {
                inputInsideLi.contentEditable = false;
                inputInsideLi2.contentEditable = false;
                editSpan.src = './images/edit (1).png';
                saveData();
            } else {
                inputInsideLi.contentEditable = true;
                inputInsideLi2.contentEditable = true;
                editSpan.src = './images/save-data.png';
            }
            isEditing = !isEditing;
        });
    };

    listContainer.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'LI') {
            gsap.to(e.target, {
                scale: 1.01,
                duration: 0.3,
            });
        }
    });
    listContainer.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'LI') {
            gsap.to(e.target, {
                scale: 1,
                duration: 0.3,
            });
        }
    });

    let priority = (priority) => {
        if (priority === 'high') {
            priorityText = 'High Priority';
            SelectPriorityText.innerHTML = priorityText;
        } else if (priority === 'medium') {
            priorityText = 'Medium Priority';
            SelectPriorityText.innerHTML = priorityText;
        } else if (priority === 'low') {
            priorityText = 'Low Priority';
            SelectPriorityText.innerHTML = priorityText;
        }
    };
    priority();

    function addTask() {
            CreateAllElements();
    }


    let assignClasses = (priorityList) => {
        if (priorityText === 'High Priority') {
            priorityList.classList.add('highPriorityClass');
        } else if (priorityText === 'Medium Priority') {
            priorityList.classList.add('mediumPriorityClass');
        } else if (priorityText === 'Low Priority') {
            priorityList.classList.add('lowPriorityClass');
        }
    }

    listContainer.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            e.target.classList.toggle("checked");
            saveData();
        } else if (e.target.classList.contains("TrashImg")) {
            e.target.parentElement.remove();
            saveData();
        } else if (e.target.classList.contains("editSpan")) {
        }
    });


    function saveData() {
        let InputText = [];
        let input = listContainer.querySelectorAll('span')
        input.forEach(input => {InputText.push(input.value);})
        localStorage.setItem("data", listContainer.innerHTML);
        localStorage.setItem("inputData", JSON.stringify(InputText));
    }



    function showList() {
        listContainer.innerHTML = localStorage.getItem("data");
        const savedInputValues = JSON.parse(localStorage.getItem("inputData"));
        if (savedInputValues) {
            const inputs = document.querySelectorAll("#listContainer textarea");
            inputs.forEach((input, index) => {
                if (savedInputValues[index]) {
                    input.value = savedInputValues[index];
                }
            });
        }

        const listItems = document.querySelectorAll("#listContainer li");
        listItems.forEach(item => {
            let editSpan = item.querySelector('.editSpan');
            let inputInsideLi = item.querySelector('textarea');
            

            addEditEvent(editSpan, inputInsideLi)
            gsap.from(item, { opacity: 0, x: -100, duration: 0.3 });
            gsap.to(item, { opacity: 1, x: 0 });
        });
    }




    let deletingData = () =>{
        Swal.fire({
            title: "Are you sure, this will delete all tasks??",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Deleted", "", "success");
                gsap.to("#listContainer li", { opacity: 0, y: -20, duration: 0.5, stagger: 0.1, onComplete: () => {
                    listContainer.innerHTML = "";
                    localStorage.setItem("data", "");
                    localStorage.setItem("inputData", '');
                    typeTasks.style.borderColor = 'white';
                }});
            }
        });
    }
      




        



    function setAlarm() {
        const input = document.getElementById('dateSelector').value;
        if (input) {
            const selectedTime = new Date(input).getTime();
            const now = new Date().getTime();
            if (selectedTime <= now) {
                alert('Please select a future date');
                return;
            }
            alarmTime = selectedTime;
            if (alarmInterval) clearInterval(alarmInterval);
            alarmInterval = setInterval(checkAlarm, 1000);
            console.log(alarmInterval);
        }
    }





    function checkAlarm() {
        const now = new Date().getTime();
        if (now >= alarmTime) {
            triggerAlarm();
            clearInterval(alarmInterval);
        }
    }




    function triggerAlarm() {
        if (Notification.permission === "granted") {
            new Notification("Alarm!", {
                body: "The time for your task is up!",
                icon: "./images/favicon-32x32.png"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Alarm!", {
                        body: "The time for your task is up!",
                        icon: "./images/favicon-32x32.png"
                    });
                }
            });
        }
    }




    let requestNotificationPermission = () => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    requestNotificationPermission();