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

    loadProjectData(projectId);

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


function loadProjectData(projectId) {
    fetch('https://robinfrouin.github.io/projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let project = data.projects[projectId];
            if (!project) {
                console.error("Project not found:", projectId);
                return;
            }

            let modalDescription = document.getElementById("modal-description");

            if (modalDescription) {
                modalDescription.innerHTML = project.html;
            } else {
                console.error("Modal elements not found!");
            }
        })
        .catch(error => console.error("Error loading project data:", error));
}


function injectProjectStyles(css) {
    let styleElement = document.getElementById("dynamic-style");
    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "dynamic-style";
        document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = css;
}


function executeProjectScript(js) {
    try {
        eval(js);
    } catch (error) {
        console.error("Error executing project script:", error);
    }
}
function initFilters() {
    document.querySelectorAll('.tabs a').forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
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
    container.innerHTML = "";

    projects.forEach(project => container.appendChild(project));
}
