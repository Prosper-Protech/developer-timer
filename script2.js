 // Enhanced data structure with projects, dates, and statistics
        let appData = {
            currentProject: 'default',
            projects: {
                'default': {
                    name: 'Daily Tasks',
                    description: 'Your daily to-do list',
                    created: new Date().toISOString(),
                    days: [
                        
                    ],
                    statistics: {
                        totalTasks: 0,
                        completedTasks: 0,
                        completionRate: 0,
                        currentStreak: 0,
                        lastCompleted: null
                    }
                }
            }
        };

        // DOM Elements
        const daysContainer = document.getElementById('days-container');
        const taskModal = document.getElementById('task-modal');
        const projectModal = document.getElementById('project-modal');
        const shareModal = document.getElementById('share-modal');
        const taskForm = document.getElementById('task-form');
        const projectForm = document.getElementById('project-form');
        const modalTitle = document.getElementById('modal-title');
        const taskText = document.getElementById('task-text');
        const taskDuration = document.getElementById('task-duration');
        const taskReminder = document.getElementById('task-reminder');
        const editDayIndex = document.getElementById('edit-day-index');
        const editTaskIndex = document.getElementById('edit-task-index');
        const closeModal = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        const closeProjectModal = document.getElementById('close-project-modal');
        const cancelProjectBtn = document.getElementById('cancel-project-btn');
        const closeShareModal = document.getElementById('close-share-modal');
        const closeShareBtn = document.getElementById('close-share-btn');
        const shareLink = document.getElementById('share-link');
        const projectTabs = document.getElementById('project-tabs');
        const projectName = document.getElementById('project-name');
        const projectDescription = document.getElementById('project-description');

        // Timer interval reference
        let timerInterval = null;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            loadAppData();
            renderProjectTabs();
            renderDays();
            updateStatistics();
            updateProgress();
            startTimerInterval();
            
            // Add event listeners
            document.getElementById('save-btn').addEventListener('click', saveAppData);
            document.getElementById('reset-btn').addEventListener('click', resetDay);
            document.getElementById('new-project-btn').addEventListener('click', openNewProjectModal);
            document.getElementById('share-btn').addEventListener('click', openShareModal);
            closeModal.addEventListener('click', closeTaskModal);
            cancelBtn.addEventListener('click', closeTaskModal);
            closeProjectModal.addEventListener('click', closeProjectModalFunc);
            cancelProjectBtn.addEventListener('click', closeProjectModalFunc);
            closeShareModal.addEventListener('click', closeShareModalFunc);
            closeShareBtn.addEventListener('click', closeShareModalFunc);
            taskForm.addEventListener('submit', saveTask);
            projectForm.addEventListener('submit', saveProject);
            
            // Close modals when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === taskModal) closeTaskModal();
                if (event.target === projectModal) closeProjectModalFunc();
                if (event.target === shareModal) closeShareModalFunc();
            });
        });

        // Render project tabs
        function renderProjectTabs() {
            projectTabs.innerHTML = '';
            
            for (const projectId in appData.projects) {
                const project = appData.projects[projectId];
                const tab = document.createElement('div');
                tab.className = `project-tab ${projectId === appData.currentProject ? 'active' : ''}`;
                tab.textContent = project.name;
                tab.dataset.projectId = projectId;
                tab.addEventListener('click', function() {
                    switchProject(projectId);
                });
                projectTabs.appendChild(tab);
            }
        }

        // Switch between projects
        function switchProject(projectId) {
            appData.currentProject = projectId;
            renderProjectTabs();
            renderDays();
            updateStatistics();
            updateProgress();
        }

        // Render all days for current project
        function renderDays() {
            daysContainer.innerHTML = '';
            const project = appData.projects[appData.currentProject];
            
            if (!project.days || project.days.length === 0) {
                daysContainer.innerHTML = '<div class="comic-panel empty-state"><i class="fas fa-tasks"></i><p>No days yet. Add your first day!</p></div>';
                return;
            }
            
            project.days.forEach((dayData, dayIndex) => {
                const dayElement = document.createElement('div');
                dayElement.className = 'comic-panel day-card';
                dayElement.innerHTML = `
                    <div class="day-header">
                        <div class="day-title">
                            <i class="${dayData.icon}"></i>
                            ${dayData.title} - ${formatDate(dayData.date)}
                        </div>
                        <div class="day-number">${dayData.day}</div>
                    </div>
                    <ul class="task-list">
                        ${dayData.tasks.length > 0 ? 
                            dayData.tasks.map((task, taskIndex) => `
                                <li class="task-item">
                                    <input type="checkbox" class="task-checkbox" id="day-${dayData.day}-task-${taskIndex}" ${task.completed ? 'checked' : ''}>
                                    <div class="task-content">
                                        <div>
                                            <span class="task-text">${task.text}</span>
                                            <div class="task-meta">
                                                <span><i class="far fa-clock"></i> ${task.duration} min</span>
                                                ${task.reminder ? `<span><i class="far fa-bell"></i> ${task.reminder}</span>` : ''}
                                                ${task.timer.active ? `<span class="timer-display" id="timer-${dayData.day}-${taskIndex}">${formatTime(task.timer.elapsed)}</span>` : ''}
                                            </div>
                                        </div>
                                        <div class="task-actions">
                                            ${!task.completed ? `
                                                <button class="timer-start" data-day="${dayIndex}" data-task="${taskIndex}">
                                                    <i class="fas ${task.timer.active ? 'fa-pause' : 'fa-play'}"></i>
                                                </button>
                                            ` : ''}
                                            <button class="edit-task" data-day="${dayIndex}" data-task="${taskIndex}">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="delete-task" data-day="${dayIndex}" data-task="${taskIndex}">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            `).join('') : 
                            '<div class="empty-state"><i class="fas fa-tasks"></i><p>No quests yet. Add your first quest!</p></div>'
                        }
                    </ul>
                    <button class="add-task-btn" data-day="${dayIndex}">
                        <i class="fas fa-plus"></i> Add New Quest
                    </button>
                    <div class="comic-dots"></div>
                `;
                daysContainer.appendChild(dayElement);
                
                // Add event listeners to checkboxes
                dayData.tasks.forEach((task, taskIndex) => {
                    const checkbox = document.getElementById(`day-${dayData.day}-task-${taskIndex}`);
                    checkbox.addEventListener('change', function() {
                        task.completed = this.checked;
                        if (task.completed) {
                            task.timer.active = false;
                        }
                        updateStatistics();
                        updateProgress();
                        saveAppData();
                    });
                });
                
                // Add event listeners to action buttons
                const addTaskBtn = dayElement.querySelector('.add-task-btn');
                addTaskBtn.addEventListener('click', function() {
                    openAddTaskModal(dayIndex);
                });
                
                const editButtons = dayElement.querySelectorAll('.edit-task');
                editButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const dayIdx = this.getAttribute('data-day');
                        const taskIdx = this.getAttribute('data-task');
                        openEditTaskModal(dayIdx, taskIdx);
                    });
                });
                
                const deleteButtons = dayElement.querySelectorAll('.delete-task');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const dayIdx = this.getAttribute('data-day');
                        const taskIdx = this.getAttribute('data-task');
                        deleteTask(dayIdx, taskIdx);
                    });
                });
                
                const timerButtons = dayElement.querySelectorAll('.timer-start');
                timerButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const dayIdx = this.getAttribute('data-day');
                        const taskIdx = this.getAttribute('data-task');
                        toggleTimer(dayIdx, taskIdx);
                    });
                });
            });
        }

        // Update statistics
        function updateStatistics() {
            const project = appData.projects[appData.currentProject];
            let totalTasks = 0;
            let completedTasks = 0;
            
            project.days.forEach(day => {
                day.tasks.forEach(task => {
                    totalTasks++;
                    if (task.completed) completedTasks++;
                });
            });
            
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            // Update streak (simplified logic)
            const today = new Date().toISOString().split('T')[0];
            let currentStreak = 0;
            
            // This is a simplified streak calculation - in a real app you'd track completion dates
            if (completedTasks > 0) {
                currentStreak = 1;
            }
            
            project.statistics = {
                totalTasks,
                completedTasks,
                completionRate,
                currentStreak,
                lastCompleted: completedTasks > 0 ? today : null
            };
            
            // Update UI
            document.getElementById('total-tasks-stat').textContent = totalTasks;
            document.getElementById('completed-tasks-stat').textContent = completedTasks;
            document.getElementById('completion-rate-stat').textContent = `${completionRate}%`;
            document.getElementById('current-streak-stat').textContent = `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`;
        }

        // Update progress bar and stats
        function updateProgress() {
            const project = appData.projects[appData.currentProject];
            let completed = 0;
            const total = project.statistics.totalTasks;
            
            // Update progress bar
            const progressPercent = total > 0 ? (completed / total) * 100 : 0;
            document.getElementById('progress-bar').style.width = `${progressPercent}%`;
            document.getElementById('completed-tasks').textContent = completed;
            document.getElementById('total-tasks').textContent = total;
            document.getElementById('progress-percent').textContent = `${Math.round(progressPercent)}%`;
        }

        // Timer functions
        function toggleTimer(dayIndex, taskIndex) {
            const project = appData.projects[appData.currentProject];
            const task = project.days[dayIndex].tasks[taskIndex];
            
            if (task.timer.active) {
                // Pause timer
                task.timer.active = false;
                task.timer.elapsed += Math.floor((Date.now() - task.timer.startTime) / 1000);
                task.timer.startTime = null;
            } else {
                // Start timer
                task.timer.active = true;
                task.timer.startTime = Date.now();
            }
            
            renderDays();
            saveAppData();
        }

        function updateTimers() {
            const project = appData.projects[appData.currentProject];
            
            project.days.forEach((day, dayIndex) => {
                day.tasks.forEach((task, taskIndex) => {
                    if (task.timer.active && task.timer.startTime) {
                        const elapsed = task.timer.elapsed + Math.floor((Date.now() - task.timer.startTime) / 1000);
                        const timerDisplay = document.getElementById(`timer-${day.day}-${taskIndex}`);
                        if (timerDisplay) {
                            timerDisplay.textContent = formatTime(elapsed);
                        }
                        
                        // Check if task duration is completed
                        if (elapsed >= task.duration * 60) {
                            // Task time completed - you could add a notification here
                            console.log(`Task "${task.text}" time completed!`);
                        }
                    }
                });
            });
        }

        function startTimerInterval() {
            timerInterval = setInterval(updateTimers, 1000);
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        function formatDate(dateString) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }

        // Task management functions
        function openAddTaskModal(dayIndex) {
            modalTitle.textContent = 'Add New Quest';
            taskText.value = '';
            taskDuration.value = '30';
            taskReminder.value = '';
            editDayIndex.value = dayIndex;
            editTaskIndex.value = -1;
            taskModal.style.display = 'flex';
            taskText.focus();
        }

        function openEditTaskModal(dayIndex, taskIndex) {
            const project = appData.projects[appData.currentProject];
            const task = project.days[dayIndex].tasks[taskIndex];
            
            modalTitle.textContent = 'Edit Quest';
            taskText.value = task.text;
            taskDuration.value = task.duration;
            taskReminder.value = task.reminder || '';
            editDayIndex.value = dayIndex;
            editTaskIndex.value = taskIndex;
            taskModal.style.display = 'flex';
            taskText.focus();
        }

        function closeTaskModal() {
            taskModal.style.display = 'none';
            taskForm.reset();
        }

        function saveTask(e) {
            e.preventDefault();
            
            const dayIndex = parseInt(editDayIndex.value);
            const taskIndex = parseInt(editTaskIndex.value);
            const taskValue = taskText.value.trim();
            const durationValue = parseInt(taskDuration.value);
            const reminderValue = taskReminder.value;
            
            if (taskValue === '') return;
            
            const project = appData.projects[appData.currentProject];
            
            if (taskIndex === -1) {
                // Add new task
                project.days[dayIndex].tasks.push({
                    text: taskValue,
                    completed: false,
                    created: new Date().toISOString(),
                    duration: durationValue,
                    reminder: reminderValue,
                    timer: {
                        active: false,
                        startTime: null,
                        elapsed: 0
                    }
                });
            } else {
                // Edit existing task
                project.days[dayIndex].tasks[taskIndex].text = taskValue;
                project.days[dayIndex].tasks[taskIndex].duration = durationValue;
                project.days[dayIndex].tasks[taskIndex].reminder = reminderValue;
            }
            
            renderDays();
            updateStatistics();
            updateProgress();
            saveAppData();
            closeTaskModal();
        }

        function deleteTask(dayIndex, taskIndex) {
            if (confirm('Are you sure you want to delete this quest?')) {
                const project = appData.projects[appData.currentProject];
                project.days[dayIndex].tasks.splice(taskIndex, 1);
                renderDays();
                updateStatistics();
                updateProgress();
                saveAppData();
            }
        }

        // Project management functions
        function openNewProjectModal() {
            projectModal.style.display = 'flex';
            projectName.focus();
        }

        function closeProjectModalFunc() {
            projectModal.style.display = 'none';
            projectForm.reset();
        }

        function saveProject(e) {
            e.preventDefault();
            
            const projectNameValue = projectName.value.trim();
            const projectDescriptionValue = projectDescription.value.trim();
            
            if (projectNameValue === '') return;
            
            const projectId = 'project-' + Date.now();
            
            appData.projects[projectId] = {
                name: projectNameValue,
                description: projectDescriptionValue,
                created: new Date().toISOString(),
                days: [],
                statistics: {
                    totalTasks: 0,
                    completedTasks: 0,
                    completionRate: 0,
                    currentStreak: 0,
                    lastCompleted: null
                }
            };
            
            // Add a default day
            const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
            const today = new Date();
            const dayName = daysOfWeek[today.getDay()];
            
            appData.projects[projectId].days.push({
                day: 1,
                title: dayName,
                date: today.toISOString().split('T')[0],
                icon: "fas fa-clipboard-list",
                tasks: []
            });
            
            renderProjectTabs();
            switchProject(projectId);
            closeProjectModalFunc();
            saveAppData();
        }

        // Share functionality
        function openShareModal() {
            shareModal.style.display = 'flex';
            
            // Generate a shareable link (in a real app, this would be a proper URL)
            const shareData = btoa(JSON.stringify({
                project: appData.currentProject,
                stats: appData.projects[appData.currentProject].statistics
            }));
            
            // This is a simplified version - in a real app you'd have proper URL routing
            shareLink.textContent = `${window.location.href.split('?')[0]}?share=${shareData}`;
        }

        function closeShareModalFunc() {
            shareModal.style.display = 'none';
        }

        // Reset current day
        function resetDay() {
            if (confirm('Are you sure you want to reset today\'s progress? This will mark all tasks as incomplete.')) {
                const project = appData.projects[appData.currentProject];
                const today = new Date().toISOString().split('T')[0];
                
                // Find today's day
                const todayIndex = project.days.findIndex(day => day.date === today);
                
                if (todayIndex !== -1) {
                    project.days[todayIndex].tasks.forEach(task => {
                        task.completed = false;
                        task.timer.active = false;
                        task.timer.startTime = null;
                        task.timer.elapsed = 0;
                    });
                    
                    renderDays();
                    updateStatistics();
                    updateProgress();
                    saveAppData();
                    
                    // Show confirmation
                    const resetBtn = document.getElementById('reset-btn');
                    const originalText = resetBtn.innerHTML;
                    resetBtn.innerHTML = '<i class="fas fa-check"></i> Day Reset!';
                    setTimeout(() => {
                        resetBtn.innerHTML = originalText;
                    }, 1500);
                } else {
                    alert('No tasks found for today!');
                }
            }
        }

        // Data persistence
        function saveAppData() {
            localStorage.setItem('protechTodoData', JSON.stringify(appData));
            
            // Show confirmation
            const saveBtn = document.getElementById('save-btn');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Progress Saved!';
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
            }, 1500);
        }

        function loadAppData() {
            const savedData = localStorage.getItem('protechTodoData');
            
            if (savedData) {
                appData = JSON.parse(savedData);
                
                // Ensure current project exists
                if (!appData.projects[appData.currentProject]) {
                    appData.currentProject = 'default';
                }
                
                // Ensure default project exists
                if (!appData.projects['default']) {
                    appData.projects['default'] = {
                        name: 'Daily Tasks',
                        description: 'Your daily to-do list',
                        created: new Date().toISOString(),
                        days: [],
                        statistics: {
                            totalTasks: 0,
                            completedTasks: 0,
                            completionRate: 0,
                            currentStreak: 0,
                            lastCompleted: null
                        }
                    };
                }
            }

        }

