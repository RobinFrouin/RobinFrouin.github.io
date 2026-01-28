const MAINTENANCE_MODE = true ;
// const MAINTENANCE_MODE = false ;

document.addEventListener('DOMContentLoaded', function () {
    if (MAINTENANCE_MODE)
    {
        showMaintenance();
    }
    else
    {
        showSite()
        initProjectCards();
        initFilters();
    }
    
});

function showMaintenance() {
  const maintenance = document.getElementById("maintenance");
  if (maintenance) maintenance.style.display = "flex";

  const site = document.getElementById("site");
  if (site) site.style.display = "none";

  document.querySelectorAll("body > .container").forEach(el => {
    el.style.display = "none";
  });

  document.body.classList.add("maintenance-open");
}

function showSite() {

  const site = document.getElementById("site");
  if (site) site.style.display = "";
}

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
    let modalDescription = document.getElementById("modal-description");

    modal.style.display = 'none';
    if (blurBackground) {
        blurBackground.remove();
    }
    if (modalDescription)
    {
        modalDescription.innerHTML = "";
    }
}

function buildInnerProjectListeHtml(Liste) {
    let listeElements = "";
    for (const elements in Liste)
    {
        listeElements += Liste[elements];
    }
    return listeElements;
}

function buildInnerProjectHtml(InnerProjectElement, ElementKey) {
    const ipe = InnerProjectElement;
    let html = ""
    if (!ipe)
    {
        console.error("ipe not valid", ipe)
    }
    else if (!ElementKey)
    {
        console.error("element key not valid", ElementKey);
    }
    else if (ElementKey == "start")
    {
        html = ipe;
    }
    else if(ElementKey == "projectname")
    {
        html = ipe;
    }
    else if (ElementKey == "goal")
    {
        const title = ipe.title;
        const desc = ipe.description;
        const result = title + desc;
        html = result;
    }
    else if (ElementKey == "end")
    {
        html = ipe;
    }
    else
    {
        const title = ipe.title;
        const startlist = ipe.startlist;
        const elements = buildInnerProjectListeHtml(ipe.elements);
        const endlist = ipe.endlist;
        const result = title + startlist + elements + endlist;
        html = result;
    }
    
    console.log("Result = ", html, " with element key = ", ElementKey);
    return html;
}

function buildProjectHtml(project) {
    const p = project;
    const ph = p.html;
    let html = "";
    for(const elements in ph)
    {
        html += buildInnerProjectHtml(ph[elements], elements);
    }
    return html;
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
                modalDescription.innerHTML = buildProjectHtml(project);
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

