let projects = [];
let currentSort = 'stars';

async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/enfyna/repos?per_page=100&sort=updated');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const repos = await response.json();
        projects = repos;

        hideLoading();
        updateStats();
        sortProjects('stars');

    } catch (error) {
        console.error('GitHub API hatası:', error);
        showError();
    }
}

function updateStats() {
    const totalRepos = projects.length;
    const totalStars = projects.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = projects.reduce((sum, repo) => sum + repo.forks_count, 0);

    document.getElementById('totalRepos').textContent = totalRepos;
    document.getElementById('totalStars').textContent = totalStars;
    document.getElementById('totalForks').textContent = totalForks;
}

function sortProjects(sortBy, clickedElement = null) {
    currentSort = sortBy;

    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));

    if (clickedElement) {
        clickedElement.classList.add('active');
    } else {
        const targetBtn = document.querySelector(`[onclick="sortProjects('${sortBy}')"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }

    let sortedProjects = [...projects];

    switch (sortBy) {
        case 'stars':
            sortedProjects.sort((a, b) => b.stargazers_count - a.stargazers_count);
            break;
        case 'updated':
            sortedProjects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            break;
        case 'name':
            sortedProjects.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    projects = sortedProjects;
    displayProjects();
}

function displayProjects() {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';

    projects.forEach(repo => {
        const projectCard = createProjectCard(repo);
        container.appendChild(projectCard);
    });

    container.style.display = 'grid';
}

function trimProjectName(name) {
    if (name.length > 20) {
        return name.substring(0, 20) + '...';
    }
    return name;
}

function createProjectCard(repo) {
    const div = document.createElement('div');
    div.className = 'project-card';

    const languages = repo.language ? [repo.language] : [];
    const description = repo.description || '';
    const updatedDate = new Date(repo.updated_at).toLocaleDateString('tr-TR');
    const trimmedName = trimProjectName(repo.name);

    div.innerHTML = `
        <div class="project-header">
            <h3 class="project-title" title="${repo.name}">${trimmedName}</h3>
            <div class="project-stars">
                ⭐ ${repo.stargazers_count}
            </div>
        </div>
        <p class="project-description">${description}</p>
        <div class="project-stats">
            <div class="stat-item">
                <span>🍴 ${repo.forks_count} Fork</span>
            </div>
            <div class="stat-item">
                <span>📅 ${updatedDate}</span>
            </div>
            ${repo.size > 0 ? `<div class="stat-item"><span>📊 ${(repo.size / 1024).toFixed(1)} MB</span></div>` : ''}
        </div>
        ${languages.length > 0 ? `
        <div class="project-languages">
            ${languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
        </div>
        ` : ''}
        <div class="project-actions">
            <a href="${repo.html_url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                GitHub'da Görüntüle
            </a>
            ${repo.homepage ? `
            <a href="${repo.homepage}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                🡕
            </a>
            ` : ''}
        </div>
    `;

    return div;
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    fetchGitHubProjects();
});
