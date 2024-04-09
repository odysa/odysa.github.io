const toggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeSound = document.getElementById('theme-sound');

// Function to update the theme icon based on the current theme
const updateThemeIcon = (isDarkMode) => {
    const themeMode = isDarkMode ? 'darkMode' : 'lightMode';
    const iconPath = themeIcon.querySelector('use').getAttribute('href').replace(/#.*$/, `#${themeMode}`);
    themeIcon.querySelector('use').setAttribute('href', iconPath);
};

// Function to update the theme based on the current mode
const updateTheme = (isDarkMode) => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(isDarkMode);
};

// Function to toggle the theme
const toggleTheme = () => {
    const isDarkMode = toggleButton.checked;
    updateTheme(isDarkMode);
    themeSound.play();
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Add transition class to body for smooth transition
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
};

// Event listener for theme toggle
toggleButton.addEventListener('change', toggleTheme);

// Function to initialize the theme based on the stored preference
const initializeTheme = () => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);
    toggleButton.checked = isDarkMode;
    updateTheme(isDarkMode);
};

// Initialize the theme
initializeTheme();

// Listen for changes in system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', initializeTheme);

const renderPullRequestList = (pullRequests, username) => {
    const pullRequestListElement = document.getElementById('pull-request-list');

    if (pullRequests.length === 0) {
        pullRequestListElement.innerHTML = `<h2>No pull requests found for user ${username}.</h2>`;
        return;
    }

    let html = `<h2>Latest 10 pull requests for user ${username}:</h2>`;

    pullRequests.forEach((pr, index) => {
        html += `
    <div class="pull-request">
      <h3>${index + 1}. ${pr.title}</h3>
      <p>URL: <a href="${pr.html_url}" target="_blank">${pr.html_url}</a></p>
      <p>Created at: ${pr.created_at}</p>
      <p>Status: ${pr.state}</p>
      <hr>
    </div>
  `;
    });

    pullRequestListElement.innerHTML = html;
};
const fetchPullRequests = async (username) => {
    const apiUrl = `https://api.github.com/search/issues?q=author:${username}+type:pr&sort=created&order=desc&per_page=5`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error:', error);
    }
};

const username = 'odysa';
fetchPullRequests(username)
    .then((pullRequests) => {
        renderPullRequestList(pullRequests, username);
    })
    .catch((error) => {
        console.error('Error:', error);
    });