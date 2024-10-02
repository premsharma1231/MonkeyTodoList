    window.onload = () => {
        gsap.from(".container", { opacity: 0, y: -50, duration: 0.5 });
        showList();
    };
    
    let addTasksButton = document.getElementById('addTasksButton');
    let typeTasks = document.getElementById('typeTasks');
    let listContainer = document.getElementById('listContainer');
    let resetTasksButton = document.getElementById('resetTasksButton');
    let errorMessage = document.getElementById('errorMessage');
    let SelectPriorityText = document.getElementById('SelectPriorityText');
    let dateSelector = document.getElementById('dateSelector');
    let priorityText = '';
    let alarmTime;
    let alarmInterval;
    addTasksButton.addEventListener('click', addTask);
    let li, span, editSpan, priorityList, h1, inputInsideLi;
    
    new Sortable(listContainer, {
        animation: 350,
    })
    
    let CreateAllElements = () =>{
        li = document.createElement("li");
        span = document.createElement("img");
        editSpan = document.createElement("img");
        priorityList = document.createElement("p");
        h1 = document.createElement("h1");
        inputInsideLi = document.createElement('textarea');

            span.src = './images/trash-bin.gif';
            span.classList.add('TrashImg');
            inputInsideLi.classList.add('TextArea');
            editSpan.src = './images/edit (1).png';
            editSpan.classList.add('editSpan');
            inputInsideLi.classList.add('inputNewLogin');
            
            inputInsideLi.readOnly = true;
            inputInsideLi.value = typeTasks.value;
            h1.innerText = dateSelector.value;
            priorityList.innerText = priorityText;
            li.appendChild(inputInsideLi);
            li.appendChild(priorityList);
            assignClasses(priorityList);
            li.appendChild(h1);
            li.appendChild(span);
            li.appendChild(editSpan);
            li.draggable = true;
            li.classList.toggle('parentNode');
            listContainer.appendChild(li);

            typeTasks.style.borderColor = 'white';
            gsap.from(li, { opacity: 0, x: -100, duration: 0.3 });
            typeTasks.value = '';
            saveData();


            inputInsideLi.addEventListener("input", () => {
                autoResize(inputInsideLi);
            });
            
            addEditEvent(editSpan, inputInsideLi);
            return [li, span, editSpan, priorityList, h1, inputInsideLi];
    };


    
    let addEditEvent = (editSpan, inputInsideLi) => {
        let isEditing = false;
        editSpan.addEventListener("click", () => {
            if (isEditing) {
                inputInsideLi.readOnly = true;
                inputInsideLi.classList.remove('saveButton');
                editSpan.src = './images/edit (1).png';
                saveData();
            } else {
                inputInsideLi.readOnly = false;
                inputInsideLi.focus();
                inputInsideLi.style.border = 'none';
                inputInsideLi.classList.add('saveButton');
                editSpan.src = './images/save-data.png';
            }
            isEditing = !isEditing;
        });
    };




    let autoResize = (textarea) => {
        textarea.style.height = `${textarea.scrollHeight}px`;
    }




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
        if (typeTasks.value.trim() === '') {
            gsap.fromTo(errorMessage, { x: -10 }, { x: 10, repeat: 5, yoyo: true, duration: 0.1 });
            typeTasks.style.borderColor = '#890606';
            errorMessage.style.display = 'flex';
            setTimeout(() => (errorMessage.style.display = "none"), 2000);
            errorMessage.style.color = 'red';
        } else {
            CreateAllElements();
            // setAlarm();
            console.log('Alarm Set Successfully');
        }
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





    listContainer.addEventListener("mouseover", function (e) {
        if (e.target.tagName === "LI") {
            gsap.to(e.target, { scale: 1.05, duration: 0.2 });
        }
    });
    listContainer.addEventListener("mouseout", function (e) {
        if (e.target.tagName === "LI") {
            gsap.to(e.target, { scale: 1, duration: 0.2 });
        }
    });




    function saveData() {
        
        let InputText = [];
        let input = listContainer.querySelectorAll('textarea')
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
            
            console.log(editSpan, inputInsideLi);

            addEditEvent(editSpan, inputInsideLi)
            gsap.from(item, { opacity: 0, x: -100, duration: 0.3 });
            gsap.to(item, { opacity: 1, x: 0 });
        });
    }




    resetTasksButton.addEventListener('click', () => {
        gsap.to("#listContainer li", { opacity: 0, y: -20, duration: 0.5, stagger: 0.1, onComplete: () => {
            listContainer.innerHTML = "";
            localStorage.setItem("data", "");
            localStorage.setItem("inputData", '');
            typeTasks.style.borderColor = 'white';
        }});
    });




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