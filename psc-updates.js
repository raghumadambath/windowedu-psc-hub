// JavaScript for PSC Updates page
document.addEventListener('DOMContentLoaded', function() {
    const updatesList = document.getElementById('psc-updates-list');
    const paginationContainer = document.getElementById('pagination-container');
    const searchInput = document.getElementById('search-updates');
    const searchBtn = document.getElementById('search-btn');
    const categoryFilter = document.getElementById('category-filter');
    
    // Current filter state
    let currentFilters = {
        search: '',
        category: 'all',
        page: 1
    };
    
    // Load initial updates
    loadPscUpdates();
    
    // Search button click event
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            if (searchInput) {
                currentFilters.search = searchInput.value.trim();
                currentFilters.page = 1; // Reset to first page on new search
                loadPscUpdates();
            }
        });
    }
    
    // Search input enter key press
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentFilters.search = searchInput.value.trim();
                currentFilters.page = 1; // Reset to first page on new search
                loadPscUpdates();
            }
        });
    }
    
    // Category filter change event
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            currentFilters.page = 1; // Reset to first page on new filter
            loadPscUpdates();
        });
    }
    
    // Function to load PSC updates
    function loadPscUpdates() {
        if (!updatesList) return;
        
        // Show loading state
        updatesList.innerHTML = '<div class="loading">Loading updates...</div>';
        
        // Get updates with current filters
        getPscUpdates({
            search: currentFilters.search,
            category: currentFilters.category,
            page: currentFilters.page,
            perPage: 5
        })
            .then(response => {
                if (response.updates.length === 0) {
                    updatesList.innerHTML = '<div class="empty-state">No updates found matching your criteria</div>';
                    paginationContainer.innerHTML = '';
                    return;
                }
                
                // Clear loading state
                updatesList.innerHTML = '';
                
                // Render updates
                response.updates.forEach(update => {
                    const updateEl = document.createElement('div');
                    updateEl.className = 'psc-update';
                    
                    // Create update content
                    updateEl.innerHTML = `
                        <div class="psc-update-header">
                            <h2>${update.title}</h2>
                            <div class="psc-update-meta">
                                <span class="update-category ${update.category}">${getCategoryLabel(update.category)}</span>
                                <span class="update-date"><i class="far fa-calendar-alt"></i> ${formatDate(update.date)}</span>
                            </div>
                        </div>
                        <div class="psc-update-content">
                            ${update.content}
                        </div>
                        ${update.link ? `<a href="${update.link}" target="_blank" class="psc-update-link btn secondary-btn btn-small">View Details <i class="fas fa-external-link-alt"></i></a>` : ''}
                    `;
                    
                    updatesList.appendChild(updateEl);
                });
                
                // Create pagination
                createPagination(response.totalPages, response.currentPage);
            })
            .catch(error => {
                console.error('Error loading updates:', error);
                updatesList.innerHTML = '<div class="empty-state">Failed to load updates</div>';
            });
    }
    
    // Function to create pagination
    function createPagination(totalPages, currentPage) {
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) {
            return;
        }
        
        // Previous button
        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.addEventListener('click', () => {
                currentFilters.page = currentPage - 1;
                loadPscUpdates();
                window.scrollTo(0, 0);
            });
            paginationContainer.appendChild(prevBtn);
        }
        
        // Page buttons
        const maxButtons = 5; // Maximum number of page buttons to show
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        // First page button if not starting from page 1
        if (startPage > 1) {
            const firstBtn = document.createElement('button');
            firstBtn.textContent = '1';
            firstBtn.addEventListener('click', () => {
                currentFilters.page = 1;
                loadPscUpdates();
                window.scrollTo(0, 0);
            });
            paginationContainer.appendChild(firstBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                paginationContainer.appendChild(ellipsis);
            }
        }
        
        // Page buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.className = 'active';
            }
            
            pageBtn.addEventListener('click', () => {
                currentFilters.page = i;
                loadPscUpdates();
                window.scrollTo(0, 0);
            });
            
            paginationContainer.appendChild(pageBtn);
        }
        
        // Last page button if not ending at last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                paginationContainer.appendChild(ellipsis);
            }
            
            const lastBtn = document.createElement('button');
            lastBtn.textContent = totalPages;
            lastBtn.addEventListener('click', () => {
                currentFilters.page = totalPages;
                loadPscUpdates();
                window.scrollTo(0, 0);
            });
            paginationContainer.appendChild(lastBtn);
        }
        
        // Next button
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.addEventListener('click', () => {
                currentFilters.page = currentPage + 1;
                loadPscUpdates();
                window.scrollTo(0, 0);
            });
            paginationContainer.appendChild(nextBtn);
        }
    }
});
