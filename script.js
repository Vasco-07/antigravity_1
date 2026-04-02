/* script.js */

const LEARNING_PATHS = [
    {
        id: "path_cpp", name: "C++ Masterclass", icon: "⚡",
        modules: [
            { id: "cpp_beg", level: "Beginner", title: "Syntax & Variables", desc: "Learn the basics.", code: 'cout &lt;&lt; "Hello";' },
            { id: "cpp_int", level: "Intermediate", title: "Pointers & Arrays", desc: "Memory deep dive.", code: 'int* ptr = &var;' },
            { id: "cpp_adv", level: "Advanced", title: "OOP & Templates", desc: "Classes, macros.", code: 'template &lt;class T&gt;' }
        ]
    },
    {
        id: "path_java", name: "Java Fundamentals", icon: "☕",
        modules: [
            { id: "java_beg", level: "Beginner", title: "Classes & Objects", desc: "The OOP paradigm basis.", code: 'class Main {}' },
            { id: "java_int", level: "Intermediate", title: "Collections", desc: "Lists, Sets, and Maps.", code: 'List&lt;String&gt; list;' },
            { id: "java_adv", level: "Advanced", title: "Multithreading", desc: "Concurrency & runnables.", code: 'Thread t = new Thread();' }
        ]
    },
    {
        id: "path_python", name: "Python Developer", icon: "🐍",
        modules: [
            { id: "py_beg", level: "Beginner", title: "Data Types", desc: "Lists and dict structures.", code: 'print("Hello")' },
            { id: "py_int", level: "Intermediate", title: "Functions", desc: "Classes and decorators.", code: 'def func(): pass' },
            { id: "py_adv", level: "Advanced", title: "Data Science", desc: "Pandas and requests.", code: 'import requests' }
        ]
    },
    {
        id: "path_web", name: "Modern Web Dev", icon: "🌐",
        modules: [
            { id: "web_beg", level: "Beginner", title: "HTML & CSS", desc: "Structure and styling.", code: '&lt;div&gt;Content&lt;/div&gt;' },
            { id: "web_int", level: "Intermediate", title: "Vanilla JS", desc: "DOM manipulation.", code: 'document.querySelector()' },
            { id: "web_adv", level: "Advanced", title: "React", desc: "Components and hooks.", code: 'useState()' }
        ]
    }
];

const RESOURCES = [
    { title: "FreeCodeCamp Youtube", type: "Video Tutorial", link: "https://youtube.com", desc: "Over 1000+ hours of full courses." },
    { title: "MDN Web Docs", type: "Documentation", link: "https://developer.mozilla.org", desc: "The gold standard for Web Development APIs." },
    { title: "LeetCode", type: "Practice Platform", link: "https://leetcode.com", desc: "Prepare for algorithm interviews." },
    { title: "Python Official Docs", type: "Documentation", link: "https://docs.python.org/3/", desc: "Complete standard library manuals." }
];

let appState = { username: null, completedModules: [] };

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById('landing-view')) return;

    loadState();
    if (appState.username) showApp();
    else showLogin();
    
    setupEventListeners();
    renderGuides();
    renderResources();
});

function loadState() {
    try {
        const saved = localStorage.getItem('codeMaster_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                appState = parsed;
                if (!appState.completedModules) appState.completedModules = [];
            }
        }
    } catch(e) {
        console.error("Local storage parsing error. Resetting state.");
        appState = { username: null, completedModules: [] };
    }
}

function saveState() {
    localStorage.setItem('codeMaster_state', JSON.stringify(appState));
}

window.completeModule = function(moduleId) {
    if (!appState.completedModules.includes(moduleId)) {
        appState.completedModules.push(moduleId);
        saveState();
        renderGuides(); 
        renderDashboard(); 
    }
};

function showLogin() {
    const loginView = document.getElementById('landing-view');
    const appView = document.getElementById('app-view');
    if (loginView && appView) {
        loginView.style.display = 'flex';
        appView.style.display = 'none';
    }
}

function showApp() {
    const loginView = document.getElementById('landing-view');
    const appView = document.getElementById('app-view');
    const userBadge = document.getElementById('display-username');
    
    if (loginView && appView && userBadge) {
        loginView.style.display = 'none';
        appView.style.display = 'flex';
        userBadge.textContent = `@${appState.username}`;
        renderDashboard();
        switchView('dashboard');
    }
}

function switchView(target) {
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.style.display = 'none';
        sec.classList.remove('fade-in');
    });
    
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
        if(nav.dataset.target === target) nav.classList.add('active');
    });
    
    const targetEl = document.getElementById(`view-${target}`);
    if(targetEl) {
        targetEl.style.display = 'block';
        void targetEl.offsetWidth; 
        targetEl.classList.add('fade-in');
    }
}

function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('username-input');
            if(input && input.value.trim()) {
                appState.username = input.value.trim();
                saveState();
                showApp();
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            appState.username = null;
            saveState();
            showLogin();
        });
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchView(item.dataset.target));
    });
}

function renderDashboard() {
    let totalModules = 0;
    LEARNING_PATHS.forEach(p => totalModules += p.modules.length);
    
    const completedCount = appState.completedModules.length;
    let percentage = 0;
    if(totalModules > 0) percentage = Math.round((completedCount / totalModules) * 100);

    const progressText = document.getElementById('overall-progress-text');
    const progressFill = document.getElementById('overall-progress-fill');
    
    if (progressText && progressFill) {
        progressText.textContent = `${percentage}%`;
        progressFill.style.width = `${percentage}%`;
    }

    const listEl = document.getElementById('completed-topics-list');
    if (listEl) {
        listEl.innerHTML = '';
        if (completedCount === 0) {
            listEl.innerHTML = `<li style="color:var(--text-muted)">No topics completed yet. Check out the Coding Guides!</li>`;
        } else {
            let completedData = [];
            LEARNING_PATHS.forEach(path => {
                path.modules.forEach(mod => {
                    if(appState.completedModules.includes(mod.id)) {
                        completedData.push(`${path.name} - ${mod.level}`);
                    }
                });
            });
            
            completedData.slice(-4).reverse().forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                listEl.appendChild(li);
            });
        }
    }

    const continueEl = document.getElementById('continue-learning-widget');
    if (!continueEl) return;
    
    let suggestedAction = null;
    
    for(let path of LEARNING_PATHS) {
        for(let mod of path.modules) {
            if(!appState.completedModules.includes(mod.id)) {
                let isUnlocked = (path.modules.indexOf(mod) === 0) || appState.completedModules.includes(path.modules[path.modules.indexOf(mod) - 1].id);
                if (isUnlocked) {
                    suggestedAction = { title: mod.title, path: path.name };
                    break;
                }
            }
        }
        if(suggestedAction) break;
    }

    if (suggestedAction) {
        continueEl.innerHTML = `
            <div style="padding: 1.2rem; background: rgba(0,240,255,0.05); border-left: 4px solid var(--neon-blue); border-radius: 8px;">
                <p style="font-size: 0.85rem; color: var(--neon-blue); font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 1px;">UP NEXT</p>
                <h4>${suggestedAction.title}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">${suggestedAction.path}</p>
                <button class="btn btn-outline glow-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="document.querySelector('[data-target=\\'guides\\']').click()">Go to Guides</button>
            </div>
        `;
    } else {
        continueEl.innerHTML = `
            <div style="padding: 1.2rem; background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; border-radius: 8px;">
                <p style="font-size: 0.85rem; color: #10b981; font-weight: bold; margin-bottom: 0.5rem; letter-spacing: 1px;">ALL COMPLETED!</p>
                <h4>Master Developer</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted);">You have conquered all the paths.</p>
            </div>
        `;
    }
}

function renderGuides() {
    const container = document.getElementById('paths-container');
    if (!container) return;
    container.innerHTML = '';

    LEARNING_PATHS.forEach(path => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.padding = '0';
        card.style.overflow = 'hidden';
        
        card.innerHTML = `
            <div style="display:flex; align-items:center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding: 2rem; background: rgba(0,0,0,0.4);">
                <div style="display:flex; align-items:center; gap: 20px;">
                    <div style="width: 50px; height: 50px; border-radius: 12px; background: rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; font-size: 1.8rem; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                        ${path.icon}
                    </div>
                    <div>
                        <h2 style="font-size: 1.6rem; margin:0;" class="glow-text">${path.name}</h2>
                        <span style="color:var(--text-muted); font-size:0.9rem;">${path.modules.length} Intensive Modules</span>
                    </div>
                </div>
            </div>
            <div class="modules-container" style="padding: 1.5rem 2.5rem;"></div>
        `;
        
        const modContainer = card.querySelector('.modules-container');

        path.modules.forEach((mod, index) => {
            const isCompleted = appState.completedModules.includes(mod.id);
            let isUnlocked = (index === 0) || appState.completedModules.includes(path.modules[index - 1].id);

            const row = document.createElement('div');
            row.className = 'module-row';
            
            let borderColor = isCompleted ? '#10b981' : (isUnlocked ? 'var(--neon-blue)' : '#444');
            row.style.borderLeft = `4px solid ${borderColor}`;
            if (!isUnlocked) row.style.opacity = '0.5';

            let btnHTML = '';
            let statusIcon = '';
            
            if (isCompleted) {
                statusIcon = `<div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); border: 2px solid #10b981; display:flex; align-items:center; justify-content:center; color: #10b981; font-weight:bold; font-size: 1.1rem;">✓</div>`;
                btnHTML = `<button class="btn" disabled style="background: transparent; border: 1px solid #10b981; color: #10b981; min-width: 140px;">Completed</button>`;
            } else if (isUnlocked) {
                statusIcon = `<div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(0, 240, 255, 0.1); border: 2px solid var(--neon-blue); display:flex; align-items:center; justify-content:center; color: var(--neon-blue); font-weight:bold; font-size: 1rem; margin-right: -2px;">▶</div>`;
                btnHTML = `<button class="btn btn-primary glow-btn" style="min-width: 140px;" onclick="window.completeModule('${mod.id}')">Start Module</button>`;
            } else {
                statusIcon = `<div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); display:flex; align-items:center; justify-content:center; color: #666; font-weight:bold; font-size: 1rem;">🔒</div>`;
                btnHTML = `<button class="btn" disabled style="min-width: 140px; background: transparent; color: #666;">Locked</button>`;
            }

            let codeHTML = `<code style="background:rgba(0,0,0,0.6); padding:0.5rem 1rem; border-radius:6px; font-family:var(--font-mono); font-size:0.85rem; color:var(--text-muted); border: 1px solid rgba(255,255,255,0.05); white-space: nowrap;">> ${mod.code}</code>`;

            row.innerHTML = `
                <div style="display:flex; align-items:center; gap: 20px; flex:1;">
                    ${statusIcon}
                    <div style="display:flex; flex-direction:column; justify-content:center;">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom: 6px;">
                            <h4 style="font-size: 1.2rem; margin:0; ${!isUnlocked ? 'color:#888;' : 'color:var(--text-main)'}">${mod.title}</h4>
                            <span style="background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius:12px; font-size: 0.7rem; font-weight:bold; letter-spacing: 0.5px; color: ${isCompleted ? '#10b981' : (isUnlocked ? 'var(--neon-blue)' : '#888')};">${mod.level.toUpperCase()}</span>
                        </div>
                        <p style="margin:0; font-size: 0.95rem; color: var(--text-muted);">${mod.desc}</p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; justify-content:flex-end; gap: 20px; flex-wrap:wrap; min-width:300px;">
                    ${isUnlocked && !isCompleted ? codeHTML : ''}
                    <div style="text-align:right;">
                        ${btnHTML}
                    </div>
                </div>
            `;
            modContainer.appendChild(row);
        });

        container.appendChild(card);
    });
}

function renderResources() {
    const container = document.querySelector('.resource-grid');
    if (!container) return;
    container.innerHTML = '';
    
    // Group resources by type to look professional
    const groups = {};
    RESOURCES.forEach(res => {
        if(!groups[res.type]) groups[res.type] = [];
        groups[res.type].push(res);
    });

    for(let type in groups) {
        const section = document.createElement('div');
        section.style.marginBottom = '3rem';
        section.innerHTML = `<h2 style="font-size: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.8rem; margin-bottom: 1.5rem; color: var(--neon-blue); letter-spacing: 1px;">${type.toUpperCase()}S</h2>`;
        
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
        grid.style.gap = '1.5rem';

        groups[type].forEach(res => {
            const card = document.createElement('div');
            card.className = 'glass-card resource-card';
            card.style.padding = '1.8rem';
            card.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px; margin-bottom: 15px;">
                    <div style="width:12px; height:12px; border-radius:50%; background:var(--neon-purple); box-shadow: 0 0 10px var(--neon-purple);"></div>
                    <h3 style="margin:0; font-size: 1.2rem;">${res.title}</h3>
                </div>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem; line-height:1.6;">${res.desc}</p>
                <a href="${res.link}" target="_blank" class="btn btn-outline glow-btn" style="width:100%; text-align:center; padding: 0.8rem; font-size:0.95rem;">Launch Resource ↗</a>
            `;
            grid.appendChild(card);
        });

        section.appendChild(grid);
        container.appendChild(section);
    }
}
