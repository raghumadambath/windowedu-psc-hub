// JavaScript for home page
document.addEventListener('DOMContentLoaded', function() {
    const updatesContainer = document.getElementById('updates-container');
    const thoughtContainer = document.getElementById('thought-content');
    const thoughtAuthor = document.getElementById('thought-author');
    
    // Load latest PSC updates for home page
    loadLatestUpdates();
    
    // Load thought of the day
    loadThoughtOfTheDay();
    
    // Function to load latest PSC updates
    function loadLatestUpdates() {
        if (!updatesContainer) return;
        
        // Show loading state
        updatesContainer.innerHTML = '<div class="loading">Loading updates...</div>';
        
        // Get featured updates for home page
        getPscUpdates({ featured: true, perPage: 3 })
            .then(response => {
                if (response.updates.length === 0) {
                    updatesContainer.innerHTML = '<p class="empty-state">No updates available</p>';
                    return;
                }
                
                // Clear loading state
                updatesContainer.innerHTML = '';
                
                // Render updates
                response.updates.forEach(update => {
                    const updateEl = document.createElement('div');
                    updateEl.className = 'update-item';
                    
                    updateEl.innerHTML = `
                        <h3>${update.title}</h3>
                        <div class="update-meta">
                            <span class="update-category ${update.category}">${getCategoryLabel(update.category)}</span>
                            <span class="update-date">${formatDate(update.date)}</span>
                        </div>
                        <p class="update-excerpt">${update.content.substring(0, 100)}...</p>
                        <a href="psc-updates.html" class="update-link">Read more</a>
                    `;
                    
                    updatesContainer.appendChild(updateEl);
                });
            })
            .catch(error => {
                console.error('Error loading updates:', error);
                updatesContainer.innerHTML = '<p class="empty-state">Failed to load updates</p>';
            });
    }
    
    // Function to load thought of the day
    function loadThoughtOfTheDay() {
        if (!thoughtContainer || !thoughtAuthor) return;
        
        getDailyThought()
            .then(thought => {
                if (!thought) {
                    thoughtContainer.textContent = 'No thought available for today';
                    thoughtAuthor.textContent = '';
                    return;
                }
                
                thoughtContainer.textContent = `"${thought.text}"`;
                thoughtAuthor.textContent = `- ${thought.author}`;
            })
            .catch(error => {
                console.error('Error loading thought:', error);
                thoughtContainer.textContent = 'Failed to load thought of the day';
                thoughtAuthor.textContent = '';
            });
    }
});
