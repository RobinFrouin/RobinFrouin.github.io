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
    const projectCards = document.querySelectorAll('.project-card');
    document.querySelectorAll('.tabs a').forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            let filterType = this.dataset.filter;
            filterProjects(filterType, projectCards);
        });
    });
}

function filterProjects(filter, projectCards) {
    const projectsArray = Array.from(projectCards);

    if (projectsArray.length === 0) {
        console.warn("No project cards found to filter.");
        return;
    }

    projectsArray.sort((a, b) => {
        const startA = new Date(a.getAttribute('data-start'));
        const startB = new Date(b.getAttribute('data-start'));
        const endA = new Date(a.getAttribute('data-end'));
        const endB = new Date(b.getAttribute('data-end'));
        const durationA = parseFloat(a.getAttribute('data-duration'));
        const durationB = parseFloat(b.getAttribute('data-duration'));

        switch (filter) {
            case 'recent':
                return endB - endA;
            case 'oldest':
                return startA - startB;
            case 'shortest':
                return durationA - durationB;
            case 'longest':
                return durationB - durationA;
            default:
                return 0;
        }
    });

    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.innerHTML = '';
    projectsArray.forEach(card => projectsContainer.appendChild(card));
}

