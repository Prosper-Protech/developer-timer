 document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const themeToggle = document.getElementById('themeToggle');
            const addProjectBtn = document.getElementById('addProjectBtn');
            const addProjectModal = document.getElementById('addProjectModal');
            const closeModal = document.querySelector('.close');
            const projectForm = document.getElementById('projectForm');
            const projectsContainer = document.getElementById('projectsContainer');
            const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
            const sections = document.querySelectorAll('.section');
            const notification = document.getElementById('notification');
            const imagePreview = document.getElementById('imagePreview');
            const imageUpload = document.getElementById('imageUpload');
            const profileImage = document.getElementById('profileImage');
            const defaultIcon = document.getElementById('defaultIcon');
            const codeBot = document.getElementById('codeBot');
            const codeBotComputer = document.getElementById('codeBotComputer');
            const codeBotCode = document.getElementById('codeBotCode');
            const exportJSON = document.getElementById('exportJSON');
            const exportCSV = document.getElementById('exportCSV');
            const sessionList = document.getElementById('sessionList');
            const saveSettings = document.getElementById('saveSettings');
            const customizationToggle = document.getElementById('customizationToggle');
            const customizationPanel = document.getElementById('customizationPanel');
            const resetCustomization = document.getElementById('resetCustomization');
            const quoteWidget = document.getElementById('quoteWidget');
            const menuToggle = document.getElementById('menuToggle');
            const sidebarToggle = document.getElementById('sidebarToggle');
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            
            // Customization elements
            const colorOptions = document.querySelectorAll('.color-option');
            const bgColorPicker = document.getElementById('bgColorPicker');
            const cardColorPicker = document.getElementById('cardColorPicker');
            const textColorPicker = document.getElementById('textColorPicker');
            const borderRadiusSlider = document.getElementById('borderRadiusSlider');
            const borderRadiusValue = document.getElementById('borderRadiusValue');
            const shadowSlider = document.getElementById('shadowSlider');
            const shadowValue = document.getElementById('shadowValue');
            const quoteVisibility = document.getElementById('quoteVisibility');
            const statsVisibility = document.getElementById('statsVisibility');
            const botVisibility = document.getElementById('botVisibility');
            const layoutOptions = document.querySelectorAll('.layout-option');
            
            // Draggable elements
            const draggables = document.querySelectorAll('.draggable');
            
            // Language icons mapping
            const languageIcons = {
                javascript: 'fab fa-js-square',
                python: 'fab fa-python',
                java: 'fab fa-java',
                csharp: 'fas fa-code',
                php: 'fab fa-php',
                cpp: 'fas fa-code',
                ruby: 'fab fa-ruby',
                swift: 'fab fa-swift',
                go: 'fas fa-code',
                rust: 'fas fa-code',
                typescript: 'fas fa-code',
                html: 'fab fa-html5',
                css: 'fab fa-css3-alt'
            };
            
            // Language colors mapping
            const languageColors = {
                javascript: '#f7df1e',
                python: '#3776ab',
                java: '#007396',
                csharp: '#239120',
                php: '#777bb4',
                cpp: '#00599c',
                ruby: '#cc342d',
                swift: '#fa7343',
                go: '#00add8',
                rust: '#dea584',
                typescript: '#3178c6',
                html: '#e34f26',
                css: '#1572b6'
            };
            
            // Sample quotes
            const quotes = [
                "First, solve the problem. Then, write the code. - John Johnson",
                "Code is like humor. When you have to explain it, it's bad. - Cory House",
                "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
                "The best error message is the one that never shows up. - Thomas Fuchs",
                "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
                "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. - Dan Salomon"
            ];

            // Sample code snippets for bot animation
            const codeSnippets = [
                "function hello() {\n  console.log('Hello, Coder!');\n  return true;\n}",
                "const calculate = (a, b) => {\n  return a + b;\n};",
                "class Developer {\n  constructor(name) {\n    this.name = name;\n  }\n\n  code() {\n    console.log('Coding...');\n  }\n}",
                "const array = [1, 2, 3];\narray.map(x => x * 2);"
            ];

            // Sample projects data
            let projects = JSON.parse(localStorage.getItem('projects')) || [];
            let sessions = JSON.parse(localStorage.getItem('sessions')) || [];
            let settings = JSON.parse(localStorage.getItem('settings')) || {
                dailyGoal: 2,
                notifications: 'yes',
                developerName: '',
                profileImage: '',
                codeBotVisibility: 'visible'
            };
            
            let customization = JSON.parse(localStorage.getItem('customization')) || {
                colors: {
                    primary: '#238636',
                    secondary: '#2ea043',
                    success: '#3fb950',
                    warning: '#d29922',
                    danger: '#f85149',
                    background: '#0d1117',
                    cardBg: '#161b22',
                    text: '#f0f6fc'
                },
                borderRadius: '6',
                shadow: '0.3',
                quoteVisible: 'visible',
                statsVisible: 'visible',
                botVisible: 'visible',
                layout: 'grid',
                positions: {}
            };
            
            let currentTimers = {};
            
            // Initialize the app
            function init() {
                updateQuote();
                renderProjects();
                updateStats();
                renderSessionHistory();
                loadSettings();
                animateCodeBot();
                applyCustomization();
                initDraggables();
                
                // Set GitHub-like theme by default
                document.body.setAttribute('data-theme', 'dark');
                themeToggle.querySelector('span').textContent = 'Light Mode';
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
            
            // Apply customization settings
            function applyCustomization() {
                // Apply colors
                document.documentElement.style.setProperty('--primary', customization.colors.primary);
                document.documentElement.style.setProperty('--secondary', customization.colors.secondary);
                document.documentElement.style.setProperty('--success', customization.colors.success);
                document.documentElement.style.setProperty('--warning', customization.colors.warning);
                document.documentElement.style.setProperty('--danger', customization.colors.danger);
                document.documentElement.style.setProperty('--background', customization.colors.background);
                document.documentElement.style.setProperty('--card-bg', customization.colors.cardBg);
                document.documentElement.style.setProperty('--text', customization.colors.text);
                
                // Apply other styles
                document.documentElement.style.setProperty('--border-radius', customization.borderRadius + 'px');
                document.documentElement.style.setProperty('--shadow', `rgba(0, 0, 0, ${customization.shadow})`);
                
                // Update customization panel values
                bgColorPicker.value = customization.colors.background;
                cardColorPicker.value = customization.colors.cardBg;
                textColorPicker.value = customization.colors.text;
                borderRadiusSlider.value = customization.borderRadius;
                borderRadiusValue.textContent = customization.borderRadius + 'px';
                shadowSlider.value = customization.shadow * 10;
                shadowValue.textContent = customization.shadow;
                
                // Apply visibility settings
                quoteWidget.style.display = customization.quoteVisible === 'visible' ? 'block' : 'none';
                document.getElementById('statsGrid').style.display = customization.statsVisible === 'visible' ? 'grid' : 'none';
                codeBot.style.display = customization.botVisible === 'visible' ? 'flex' : 'none';
                
                // Apply layout
                if (customization.layout === 'list') {
                    document.getElementById('projectsContainer').style.gridTemplateColumns = '1fr';
                } else {
                    document.getElementById('projectsContainer').style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
                }
                
                // Apply saved positions
                for (const [id, position] of Object.entries(customization.positions)) {
                    const element = document.getElementById(id);
                    if (element) {
                        element.style.position = 'absolute';
                        element.style.left = position.x + 'px';
                        element.style.top = position.y + 'px';
                        element.style.zIndex = '100';
                    }
                }
            }
            
            // Initialize draggable elements
            function initDraggables() {
                draggables.forEach(draggable => {
                    const handle = draggable.querySelector('.drag-handle');
                    const dragElement = handle || draggable;
                    
                    dragElement.addEventListener('mousedown', dragStart);
                    dragElement.addEventListener('touchstart', dragStart, { passive: false });
                    
                    // Make sure elements are positioned correctly
                    if (!customization.positions[draggable.id]) {
                        const rect = draggable.getBoundingClientRect();
                        customization.positions[draggable.id] = {
                            x: rect.left,
                            y: rect.top
                        };
                    }
                });
            }
            
            // Drag functionality
            function dragStart(e) {
                e.preventDefault();
                
                const draggable = this.closest('.draggable');
                if (!draggable) return;
                
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                
                if (e.type === 'mousedown') {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                } else if (e.type === 'touchstart') {
                    pos3 = e.touches[0].clientX;
                    pos4 = e.touches[0].clientY;
                }
                
                document.onmouseup = dragEnd;
                document.ontouchend = dragEnd;
                
                document.onmousemove = drag;
                document.ontouchmove = drag;
                
                function drag(e) {
                    e.preventDefault();
                    
                    if (e.type === 'mousemove') {
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                    } else if (e.type === 'touchmove') {
                        pos1 = pos3 - e.touches[0].clientX;
                        pos2 = pos4 - e.touches[0].clientY;
                        pos3 = e.touches[0].clientX;
                        pos4 = e.touches[0].clientY;
                    }
                    
                    // Set the element's new position
                    draggable.style.position = 'absolute';
                    draggable.style.top = (draggable.offsetTop - pos2) + "px";
                    draggable.style.left = (draggable.offsetLeft - pos1) + "px";
                    draggable.style.zIndex = "100";
                    
                    // Save position
                    customization.positions[draggable.id] = {
                        x: draggable.offsetLeft - pos1,
                        y: draggable.offsetTop - pos2
                    };
                    
                    localStorage.setItem('customization', JSON.stringify(customization));
                }
                
                function dragEnd() {
                    document.onmouseup = null;
                    document.ontouchend = null;
                    document.onmousemove = null;
                    document.ontouchmove = null;
                }
            }
            
            // Update motivational quote
            function updateQuote() {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                document.getElementById('quote').textContent = randomQuote;
            }
            
            // Render projects
            function renderProjects() {
                projectsContainer.innerHTML = '';
                
                if (projects.length === 0) {
                    projectsContainer.innerHTML = `
                        <div class="card">
                            <p>No projects yet. Add your first project to start tracking time!</p>
                        </div>
                    `;
                    return;
                }
                
                projects.forEach((project, index) => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'card project-card draggable';
                    projectCard.id = `project-${index}`;
                    
                    const languageIcon = languageIcons[project.language] || 'fas fa-code';
                    const languageColor = languageColors[project.language] || '#238636';
                    
                    projectCard.innerHTML = `
                        <i class="fas fa-grip-vertical drag-handle"></i>
                        ${project.image ? `<img src="${project.image}" alt="${project.name}" class="project-image">` : ''}
                        <div class="card-header">
                            <h3 class="card-title">${project.name}</h3>
                            <div class="card-icon">
                                <i class="${languageIcon}"></i>
                            </div>
                        </div>
                        <p>${project.description || 'No description'}</p>
                        <div class="project-language">
                            <span class="language-color" style="background-color: ${languageColor}"></span>
                            ${project.language}
                        </div>
                        <div class="timer-display" id="timer-${index}">00:00:00</div>
                        <div class="timer-controls">
                            <button class="btn btn-primary start-timer" data-index="${index}">Start</button>
                            <button class="btn btn-warning pause-timer" data-index="${index}" disabled>Pause</button>
                            <button class="btn btn-danger stop-timer" data-index="${index}" disabled>Stop</button>
                        </div>
                        <div class="progress-container">
                            <div class="progress-info">
                                <span>Today's Progress</span>
                                <span>${formatTime(project.timeToday || 0)} / ${settings.dailyGoal || 2}h</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${Math.min(((project.timeToday || 0) / ((settings.dailyGoal || 2) * 60 * 60)) * 100, 100)}%"></div>
                            </div>
                        </div>
                    `;
                    projectsContainer.appendChild(projectCard);
                    
                    // Apply saved position if exists
                    if (customization.positions[projectCard.id]) {
                        const position = customization.positions[projectCard.id];
                        projectCard.style.position = 'absolute';
                        projectCard.style.left = position.x + 'px';
                        projectCard.style.top = position.y + 'px';
                        projectCard.style.zIndex = '100';
                    }
                });
                
                // Add event listeners to timer buttons
                document.querySelectorAll('.start-timer').forEach(btn => {
                    btn.addEventListener('click', startTimer);
                });
                
                document.querySelectorAll('.pause-timer').forEach(btn => {
                    btn.addEventListener('click', pauseTimer);
                });
                
                document.querySelectorAll('.stop-timer').forEach(btn => {
                    btn.addEventListener('click', stopTimer);
                });
                
                // Make new project cards draggable
                const newDraggables = document.querySelectorAll('.project-card.draggable');
                newDraggables.forEach(draggable => {
                    const handle = draggable.querySelector('.drag-handle');
                    const dragElement = handle || draggable;
                    
                    dragElement.addEventListener('mousedown', dragStart);
                    dragElement.addEventListener('touchstart', dragStart, { passive: false });
                });
            }
            
            // Format time in seconds to HH:MM:SS
            function formatTime(seconds) {
                const hrs = Math.floor(seconds / 3600);
                const mins = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                
                return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            
            // Start timer for a project
            function startTimer(e) {
                const index = e.target.dataset.index;
                const timerDisplay = document.getElementById(`timer-${index}`);
                
                // Disable start button, enable pause and stop
                document.querySelector(`.start-timer[data-index="${index}"]`).disabled = true;
                document.querySelector(`.pause-timer[data-index="${index}"]`).disabled = false;
                document.querySelector(`.stop-timer[data-index="${index}"]`).disabled = false;
                
                // Initialize timer if not exists
                if (!currentTimers[index]) {
                    currentTimers[index] = {
                        startTime: Date.now(),
                        elapsed: projects[index].timeToday || 0,
                        isPaused: false,
                        pauseStart: 0,
                        totalPaused: 0
                    };
                } else if (currentTimers[index].isPaused) {
                    // Resume from pause
                    currentTimers[index].totalPaused += Date.now() - currentTimers[index].pauseStart;
                    currentTimers[index].isPaused = false;
                }
                
                // Update timer display every second
                clearInterval(currentTimers[index].interval);
                currentTimers[index].interval = setInterval(() => {
                    if (!currentTimers[index].isPaused) {
                        const elapsedSeconds = Math.floor((Date.now() - currentTimers[index].startTime - currentTimers[index].totalPaused) / 1000);
                        timerDisplay.textContent = formatTime(currentTimers[index].elapsed + elapsedSeconds);
                        
                        // Check for goal
                        if (elapsedSeconds + currentTimers[index].elapsed === (settings.dailyGoal || 2) * 60 * 60) {
                            showNotification(`Congratulations! You've reached your ${settings.dailyGoal || 2} hour coding goal today!`);
                        }
                    }
                }, 1000);
            }
            
            // Pause timer
            function pauseTimer(e) {
                const index = e.target.dataset.index;
                
                if (currentTimers[index] && !currentTimers[index].isPaused) {
                    currentTimers[index].isPaused = true;
                    currentTimers[index].pauseStart = Date.now();
                    
                    // Update button states
                    document.querySelector(`.start-timer[data-index="${index}"]`).disabled = false;
                    document.querySelector(`.pause-timer[data-index="${index}"]`).disabled = true;
                }
            }
            
            // Stop timer
            function stopTimer(e) {
                const index = e.target.dataset.index;
                
                if (currentTimers[index]) {
                    clearInterval(currentTimers[index].interval);
                    
                    // Calculate total time
                    const elapsedSeconds = Math.floor((Date.now() - currentTimers[index].startTime - currentTimers[index].totalPaused) / 1000);
                    const totalTime = currentTimers[index].elapsed + elapsedSeconds;
                    
                    // Update project time
                    projects[index].timeToday = totalTime;
                    projects[index].totalTime = (projects[index].totalTime || 0) + elapsedSeconds;
                    
                    // Add to session history
                    const session = {
                        project: projects[index].name,
                        date: new Date().toISOString(),
                        duration: elapsedSeconds,
                        projectId: index
                    };
                    
                    sessions.push(session);
                    localStorage.setItem('sessions', JSON.stringify(sessions));
                    
                    // Save to localStorage
                    localStorage.setItem('projects', JSON.stringify(projects));
                    
                    // Reset timer UI
                    document.querySelector(`.start-timer[data-index="${index}"]`).disabled = false;
                    document.querySelector(`.pause-timer[data-index="${index}"]`).disabled = true;
                    document.querySelector(`.stop-timer[data-index="${index}"]`).disabled = true;
                    
                    // Update progress bar
                    const progressBar = document.querySelector(`#timer-${index}`).closest('.project-card').querySelector('.progress');
                    const progressPercentage = Math.min((totalTime / ((settings.dailyGoal || 2) * 60 * 60)) * 100, 100);
                    progressBar.style.width = `${progressPercentage}%`;
                    
                    // Change progress color based on percentage
                    progressBar.className = 'progress';
                    if (progressPercentage >= 100) {
                        progressBar.classList.add('progress-danger');
                    } else if (progressPercentage >= 75) {
                        progressBar.classList.add('progress-warning');
                    }
                    
                    // Update stats
                    updateStats();
                    renderSessionHistory();
                    
                    // Show notification
                    showNotification(`Timer stopped. You coded for ${formatTime(elapsedSeconds)} on ${projects[index].name}`);
                    
                    // Remove timer
                    delete currentTimers[index];
                }
            }
            
            // Update statistics
            function updateStats() {
                let totalTime = 0;
                let sessionsToday = 0;
                
                projects.forEach(project => {
                    totalTime += project.timeToday || 0;
                    if (project.timeToday > 0) sessionsToday++;
                });
                
                // Calculate streak (simplified)
                const streak = sessions.length > 0 ? Math.min(Math.floor(sessions.length / 2), 10) : 0;
                
                document.getElementById('totalTime').textContent = formatTime(totalTime);
                document.getElementById('sessions').textContent = sessionsToday;
                document.getElementById('streak').textContent = streak;
                
                // Calculate productivity score (simplified)
                const productivity = Math.min(Math.floor((totalTime / ((settings.dailyGoal || 2) * 60 * 60)) * 100), 100);
                document.getElementById('productivity').textContent = `${productivity}%`;
            }
            
            // Render session history
            function renderSessionHistory() {
                sessionList.innerHTML = '';
                
                if (sessions.length === 0) {
                    sessionList.innerHTML = '<li class="session-item">No sessions recorded yet.</li>';
                    return;
                }
                
                // Show latest sessions first
                const recentSessions = [...sessions].reverse().slice(0, 10);
                
                recentSessions.forEach(session => {
                    const li = document.createElement('li');
                    li.className = 'session-item';
                    
                    const sessionDate = new Date(session.date);
                    const formattedDate = sessionDate.toLocaleDateString() + ' ' + sessionDate.toLocaleTimeString();
                    
                    li.innerHTML = `
                        <div class="session-info">
                            <div class="session-project">${session.project}</div>
                            <div class="session-date">${formattedDate}</div>
                        </div>
                        <div class="session-duration">${formatTime(session.duration)}</div>
                    `;
                    
                    sessionList.appendChild(li);
                });
            }
            
            // Show notification
            function showNotification(message) {
                if (settings.notifications === 'no') return;
                
                notification.querySelector('.notification-content').textContent = message;
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
            
            // Image upload handling
            imagePreview.addEventListener('click', () => {
                imageUpload.click();
            });
            
            imageUpload.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profileImage.src = e.target.result;
                        profileImage.style.display = 'block';
                        defaultIcon.style.display = 'none';
                        
                        // Save to settings
                        settings.profileImage = e.target.result;
                        localStorage.setItem('settings', JSON.stringify(settings));
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Load settings
            function loadSettings() {
                // Developer name
                if (settings.developerName) {
                    document.getElementById('developerName').value = settings.developerName;
                }
                
                // Daily goal
                if (settings.dailyGoal) {
                    document.getElementById('dailyGoal').value = settings.dailyGoal;
                }
                
                // Notifications
                if (settings.notifications) {
                    document.getElementById('notifications').value = settings.notifications;
                }
                
                // Code bot visibility
                if (settings.codeBotVisibility) {
                    document.getElementById('codeBotVisibility').value = settings.codeBotVisibility;
                    codeBot.style.display = settings.codeBotVisibility === 'visible' ? 'flex' : 'none';
                }
                
                // Profile image
                if (settings.profileImage) {
                    profileImage.src = settings.profileImage;
                    profileImage.style.display = 'block';
                    defaultIcon.style.display = 'none';
                }
            }
            
            // Save settings
            saveSettings.addEventListener('click', function() {
                settings.developerName = document.getElementById('developerName').value;
                settings.dailyGoal = parseInt(document.getElementById('dailyGoal').value);
                settings.notifications = document.getElementById('notifications').value;
                settings.codeBotVisibility = document.getElementById('codeBotVisibility').value;
                
                localStorage.setItem('settings', JSON.stringify(settings));
                
                // Update code bot visibility
                codeBot.style.display = settings.codeBotVisibility === 'visible' ? 'flex' : 'none';
                
                showNotification('Settings saved successfully!');
            });
            
            // Animate code bot
            function animateCodeBot() {
                let codeIndex = 0;
                let charIndex = 0;
                let currentCode = codeSnippets[codeIndex];
                
                function typeCode() {
                    if (charIndex < currentCode.length) {
                        codeBotCode.textContent += currentCode.charAt(charIndex);
                        charIndex++;
                        setTimeout(typeCode, 50);
                    } else {
                        setTimeout(() => {
                            codeBotCode.textContent = '';
                            codeIndex = (codeIndex + 1) % codeSnippets.length;
                            currentCode = codeSnippets[codeIndex];
                            charIndex = 0;
                            setTimeout(typeCode, 1000);
                        }, 2000);
                    }
                }
                
                typeCode();
            }
            
            // Export data
            exportJSON.addEventListener('click', function() {
                const dataStr = JSON.stringify({
                    projects: projects,
                    sessions: sessions,
                    settings: settings
                }, null, 2);
                
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                
                const exportFileDefaultName = 'codetimer-data.json';
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
            });
            
            exportCSV.addEventListener('click', function() {
                // Create CSV content for sessions
                let csvContent = 'Project,Date,Duration (seconds)\n';
                
                sessions.forEach(session => {
                    csvContent += `"${session.project}",${session.date},${session.duration}\n`;
                });
                
                const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', 'codetimer-sessions.csv');
                document.body.appendChild(link);
                
                link.click();
                document.body.removeChild(link);
            });
            
            // Theme toggle
            themeToggle.addEventListener('click', () => {
                if (document.body.getAttribute('data-theme') === 'dark') {
                    document.body.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                    themeToggle.querySelector('span').textContent = 'Dark Mode';
                    themeToggle.querySelector('i').className = 'fas fa-moon';
                } else {
                    document.body.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                    themeToggle.querySelector('span').textContent = 'Light Mode';
                    themeToggle.querySelector('i').className = 'fas fa-sun';
                }
            });
            
            // Sidebar toggle
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('show');
            });
            
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.remove('show');
            });
            
            // Modal handling
            addProjectBtn.addEventListener('click', () => {
                addProjectModal.style.display = 'flex';
            });
            
            closeModal.addEventListener('click', () => {
                addProjectModal.style.display = 'none';
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === addProjectModal) {
                    addProjectModal.style.display = 'none';
                }
            });
            
            // Form submission
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const projectImageFile = document.getElementById('projectImage').files[0];
                const projectLanguage = document.getElementById('projectLanguage').value;
                
                const newProject = {
                    name: document.getElementById('projectName').value,
                    description: document.getElementById('projectDescription').value,
                    tags: document.getElementById('projectTags').value.split(',').map(tag => tag.trim()),
                    language: projectLanguage,
                    timeToday: 0,
                    totalTime: 0
                };
                
                if (projectImageFile) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        newProject.image = e.target.result;
                        projects.push(newProject);
                        localStorage.setItem('projects', JSON.stringify(projects));
                        
                        renderProjects();
                        projectForm.reset();
                        addProjectModal.style.display = 'none';
                        
                        showNotification(`Project "${newProject.name}" added successfully!`);
                    };
                    reader.readAsDataURL(projectImageFile);
                } else {
                    projects.push(newProject);
                    localStorage.setItem('projects', JSON.stringify(projects));
                    
                    renderProjects();
                    projectForm.reset();
                    addProjectModal.style.display = 'none';
                    
                    showNotification(`Project "${newProject.name}" added successfully!`);
                }
            });
            
            // Sidebar navigation
            sidebarLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const sectionId = link.dataset.section;
                    
                    // Update active link
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Show corresponding section
                    sections.forEach(section => {
                        section.style.display = 'none';
                    });
                    document.getElementById(sectionId).style.display = 'block';
                });
            });
            
            // Customization panel toggle
            customizationToggle.addEventListener('click', () => {
                customizationPanel.classList.toggle('open');
            });
            
            // Color options
            colorOptions.forEach(option => {
                option.addEventListener('click', () => {
                    colorOptions.forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    
                    const colorType = option.dataset.color;
                    customization.colors[colorType] = option.style.backgroundColor;
                    document.documentElement.style.setProperty(`--${colorType}`, option.style.backgroundColor);
                    
                    localStorage.setItem('customization', JSON.stringify(customization));
                });
            });
            
            // Color pickers
            bgColorPicker.addEventListener('input', (e) => {
                customization.colors.background = e.target.value;
                document.documentElement.style.setProperty('--background', e.target.value);
                localStorage.setItem('customization', JSON.stringify(customization));
            });
            
            cardColorPicker.addEventListener('input', (e) => {
                customization.colors.cardBg = e.target.value;
                document.documentElement.style.setProperty('--card-bg', e.target.value);
                localStorage.setItem('customization', JSON.stringify(customization));
            });
            
            textColorPicker.addEventListener('input', (e) => {
                customization.colors.text = e.target.value;
                document.documentElement.style.setProperty('--text', e.target.value);
                localStorage.setItem('customization', JSON.stringify(customization));
            });
            
            // Border radius slider
            borderRadiusSlider.addEventListener('input', (e) => {
                customization.borderRadius = e.target.value;
                document.documentElement.style.setProperty('--border-radius', e.target.value + 'px');
                borderRadiusValue.textContent = e.target.value + 'px';
                localStorage.setItem('customization', JSON.stringify(customization));
            });
            
            // Shadow slider
            shadowSlider.addEventListener('input', (e) => {
                const shadowValue = e.target.value / 10;
                customization.shadow = shadowValue;
                document.documentElement.style.setProperty('--shadow', `rgba(0, 0, 0, ${shadowValue})`);
                document.getElementById('shadowValue').textContent = shadowValue;
                localStorage.setItem('customization', JSON.stringify(customization));
            });
            
            // Visibility settings
            quoteVisibility.addEventListener('change', (e) => {
                customization.quoteVisible = e.target.value;
                quoteWidget.style.display = e.target.value === 'visible' ? 'block' : 'none';
                localStorage.setItem('customization', JSON.stringify(customization));
            });
            
            statsVisibility.addEventListener('change', (e) => {
                customization.statsVisible = e.target.value;
                document.getElementById('statsGrid').style.display = e.target.value === 'visible' ? 'grid' : 'none';
                localStorage.setItem('customization', JSON.stringify(customization));
            });
            
            botVisibility.addEventListener('change', (e) => {
                customization.botVisible = e.target.value;
                codeBot.style.display = e.target.value === 'visible' ? 'flex' : 'none';
                localStorage.setItem('customization', JSON.stringify(customization));
            });
            
            // Layout options
            layoutOptions.forEach(option => {
                option.addEventListener('click', () => {
                    customization.layout = option.dataset.layout;
                    
                    if (option.dataset.layout === 'list') {
                        document.getElementById('projectsContainer').style.gridTemplateColumns = '1fr';
                    } else {
                        document.getElementById('projectsContainer').style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
                    }
                    
                    localStorage.setItem('customization', JSON.stringify(customization));
                });
            });
            
            // Reset customization
            resetCustomization.addEventListener('click', () => {
                customization = {
                    colors: {
                        primary: '#238636',
                        secondary: '#2ea043',
                        success: '#3fb950',
                        warning: '#d29922',
                        danger: '#f85149',
                        background: '#0d1117',
                        cardBg: '#161b22',
                        text: '#f0f6fc'
                    },
                    borderRadius: '6',
                    shadow: '0.3',
                    quoteVisible: 'visible',
                    statsVisible: 'visible',
                    botVisible: 'visible',
                    layout: 'grid',
                    positions: {}
                };
                
                localStorage.setItem('customization', JSON.stringify(customization));
                applyCustomization();
                renderProjects();
                
                showNotification('Customization reset to default!');
            });
            
            // Initialize the app
            init();
        });