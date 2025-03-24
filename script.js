document.addEventListener('DOMContentLoaded', function () {
    initProjectCards();
    initFilters();
});

function initProjectCards() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function () {
            openModal(this);
        });
    });

    document.querySelector('.modal-close').addEventListener('click', closeModal);
}

function openModal(card) {
    let projectId = card.dataset.project;
    console.log("Opening modal for:", projectId);

    loadProjectData(projectId); // ✅ Separate function for loading data

    let modal = document.getElementById('project-modal');
    let blurBackground = document.createElement("div");
    blurBackground.classList.add("modal-active");
    blurBackground.id = "modal-bg";

    document.body.appendChild(blurBackground);
    modal.style.display = 'block';
}

function closeModal() {
    let modal = document.getElementById('project-modal');
    let blurBackground = document.getElementById("modal-bg");

    modal.style.display = 'none';
    if (blurBackground) {
        blurBackground.remove();
    }
}

/** 
 * ✅ Separate function to load project data from JSON
 */
function loadProjectData(projectId) {
    fetch('https://robinfrouin.github.io/projects.json') // Adjust path if needed
        .then(response => response.json())
        .then(data => {
            let project = data.projects[projectId];

            if (!project) {
                console.error("Project not found:", projectId);
                return;
            }
            let modalTitle = document.getElementById("modal-title");
            let modalDescription = document.getElementById("modal-description");
                    
            if (modalTitle && modalDescription) {
                modalTitle.innerHTML = "Your Project Title";
                modalDescription.innerHTML = "Your project description here.";
            } else {
                console.error("Modal elements not found!");
            }
            // Populate modal content
            document.getElementById('modal-title').innerHTML = project.title;
            document.getElementById('modal-content').innerHTML = project.html;

            // Apply CSS styles dynamically
            injectProjectStyles(project.css);

            // Run JavaScript if any
            executeProjectScript(project.js);
        })
        .catch(error => console.error("Error loading project data:", error));
}

/**
 * ✅ Function to inject dynamic CSS
 */
function injectProjectStyles(css) {
    let styleElement = document.getElementById("dynamic-style");
    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "dynamic-style";
        document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = css;
}

/**
 * ✅ Function to execute dynamic JavaScript
 */
function executeProjectScript(js) {
    try {
        eval(js); // ⚠️ Be cautious using eval (consider safer alternatives)
    } catch (error) {
        console.error("Error executing project script:", error);
    }
}
function initFilters() {
    document.querySelectorAll('.tabs a').forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault(); // ✅ Prevents default tab behavior
            let filterType = this.dataset.filter;
            filterProjects(filterType);
        });
    });
}

function filterProjects(filterType) {
    let projects = Array.from(document.querySelectorAll('.projects-container .card'));

    console.log("Sorting by:", filterType);

    if (filterType === 'recent') {
        projects.sort((a, b) => new Date(b.dataset.start) - new Date(a.dataset.start));
    } else if (filterType === 'oldest') {
        projects.sort((a, b) => new Date(a.dataset.start) - new Date(b.dataset.start));
    } else if (filterType === 'shortest') {
        projects.sort((a, b) => parseInt(a.dataset.duration) - parseInt(b.dataset.duration));
    } else if (filterType === 'longest') {
        projects.sort((a, b) => parseInt(b.dataset.duration) - parseInt(a.dataset.duration));
    } else if (filterType === 'proud') {
        projects.sort((a, b) => parseInt(a.dataset.proud) - parseInt(b.dataset.proud));
    }

    let container = document.querySelector('.projects-container'); 
    container.innerHTML = ""; // ✅ Clear only projects, NOT tabs or title

    projects.forEach(project => container.appendChild(project));
}
