// JavaScript for Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Admin Authentication Elements
    const loginContainer = document.getElementById('login-container');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Tab navigation elements
    const tabLinks = document.querySelectorAll('.admin-menu a');
    const adminTabs = document.querySelectorAll('.admin-tab');
    
    // Dashboard elements
    const updateCount = document.getElementById('update-count');
    const thoughtCount = document.getElementById('thought-count');
    const activityList = document.getElementById('activity-list');
    const newUpdateBtn = document.getElementById('new-update-btn');
    const newThoughtBtn = document.getElementById('new-thought-btn');
    
    // Updates tab elements
    const adminUpdatesList = document.getElementById('admin-updates-list');
    const adminPagination = document.getElementById('admin-pagination');
    const searchAdminUpdates = document.getElementById('search-admin-updates');
    const adminSearchBtn = document.getElementById('admin-search-btn');
    const adminCategoryFilter = document.getElementById('admin-category-filter');
    const addUpdateBtn = document.getElementById('add-update-btn');
    
    // Thoughts tab elements
    const adminThoughtsList = document.getElementById('admin-thoughts-list');
    const thoughtsPagination = document.getElementById('thoughts-pagination');
    const searchThoughts = document.getElementById('search-thoughts');
    const thoughtSearchBtn = document.getElementById('thought-search-btn');
    const addThoughtBtn = document.getElementById('add-thought-btn');
    
    // Modal elements
    const updateModal = document.getElementById('update-modal');
    const thoughtModal = document.getElementById('thought-modal');
    const deleteModal = document.getElementById('delete-modal');
    const updateForm = document.getElementById('update-form');
    const thoughtForm = document.getElementById('thought-form');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const deleteMessage = document.getElementById('delete-message');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelModalBtns = document.querySelectorAll('.cancel-modal');
    
    // Current states
    let currentUpdatesFilters = {
        search: '',
        category: 'all',
        page: 1
    };
    
    let currentThoughtsFilters = {
        search: '',
        page: 1
    };
    
    let currentDeleteItem = null;
    let isLoggedIn = false;
    
    // Check if user is logged in
    checkLoginStatus();
    
    // Admin Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple authentication (replace with proper authentication)
            if (username === 'admin' && password === 'password') {
                // Store login status in session storage
                sessionStorage.setItem('adminLoggedIn', 'true');
                showDashboard();
                // Record login activity
                recordActivity('login', 'Admin logged in');
            } else {
                loginError.textContent = 'Invalid username or password';
            }
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear login status
            sessionStorage.removeItem('adminLoggedIn');
            showLoginForm();
        });
    }
    
    // Tab navigation
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and links
            tabLinks.forEach(l => l.classList.remove('active'));
            adminTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding tab
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
            
            // Load data for tab if needed
            if (tabId === 'psc-updates-tab') {
                loadAdminUpdates();
            } else if (tabId === 'thoughts-tab') {
                loadAdminThoughts();
            } else if (tabId === 'dashboard-tab') {
                loadDashboardStats();
            }
        });
    });
    
    // Modal close buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Modal cancel buttons
    cancelModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target === updateModal || e.target === thoughtModal || e.target === deleteModal) {
            closeAllModals();
        }
    });
    
    // New Update button
    if (newUpdateBtn) {
        newUpdateBtn.addEventListener('click', function() {
            openUpdateModal();
        });
    }
    
    // Add Update button
    if (addUpdateBtn) {
        addUpdateBtn.addEventListener('click', function() {
            openUpdateModal();
        });
    }
    
    // New Thought button
    if (newThoughtBtn) {
        newThoughtBtn.addEventListener('click', function() {
            openThoughtModal();
        });
    }
    
    // Add Thought button
    if (addThoughtBtn) {
        addThoughtBtn.addEventListener('click', function() {
            openThoughtModal();
        });
    }
    
    // Update form submission
    if (updateForm) {
        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const updateId = document.getElementById('update-id').value;
            const updateTitle = document.getElementById('update-title').value;
            const updateCategory = document.getElementById('update-category').value;
            const updateDate = document.getElementById('update-date').value;
            const updateContent = document.getElementById('update-content').value;
            const updateLink = document.getElementById('update-link').value;
            const updateFeatured = document.getElementById('update-featured').checked;
            
            const updateData = {
                id: updateId ? parseInt(updateId) : Date.now(),
                title: updateTitle,
                category: updateCategory,
                date: updateDate,
                content: updateContent,
                link: updateLink,
                featured: updateFeatured
            };
            
            // Save update (mock implementation)
            saveUpdate(updateData)
                .then(() => {
                    closeAllModals();
                    loadAdminUpdates();
                    loadDashboardStats();
                    
                    // Record activity
                    const activityType = updateId ? 'update' : 'create';
                    const activityMessage = updateId ? 
                        `Updated PSC update: ${updateTitle}` : 
                        `Created new PSC update: ${updateTitle}`;
                    
                    recordActivity(activityType, activityMessage);
                })
                .catch(error => {
                    console.error('Error saving update:', error);
                    alert('Failed to save update. Please try again.');
                });
        });
    }
    
    // Thought form submission
    if (thoughtForm) {
        thoughtForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const thoughtId = document.getElementById('thought-id').value;
            const thoughtText = document.getElementById('thought-text').value;
            const thoughtAuthor = document.getElementById('thought-author').value;
            const thoughtDate = document.getElementById('thought-date').value;
            
            const thoughtData = {
                id: thoughtId ? parseInt(thoughtId) : Date.now(),
                text: thoughtText,
                author: thoughtAuthor,
                date: thoughtDate
            };
            
            // Save thought (mock implementation)
            saveThought(thoughtData)
                .then(() => {
                    closeAllModals();
                    loadAdminThoughts();
                    loadDashboardStats();
                    
                    // Record activity
                    const activityType = thoughtId ? 'thought' : 'create';
                    const activityMessage = thoughtId ? 
                        `Updated daily thought by ${thoughtAuthor}` : 
                        `Created new daily thought by ${thoughtAuthor}`;
                    
                    recordActivity(activityType, activityMessage);
                })
                .catch(error => {
                    console.error('Error saving thought:', error);
                    alert('Failed to save thought. Please try again.');
                });
        });
    }
    
    // Confirm delete button
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            if (!currentDeleteItem) return;
            
            const { type, id, title } = currentDeleteItem;
            
            if (type === 'update') {
                deleteUpdate(id)
                    .then(() => {
                        closeAllModals();
                        loadAdminUpdates();
                        loadDashboardStats();
                        
                        // Record activity
                        recordActivity('delete', `Deleted PSC update: ${title}`);
                    })
                    .catch(error => {
                        console.error('Error deleting update:', error);
                        alert('Failed to delete update. Please try again.');
                    });
            } else if (type === 'thought') {
                deleteThought(id)
                    .then(() => {
                        closeAllModals();
                        loadAdminThoughts();
                        loadDashboardStats();
                        
                        // Record activity
                        recordActivity('delete', `Deleted daily thought: ${title}`);
                    })
                    .catch(error => {
                        console.error('Error deleting thought:', error);
                        alert('Failed to delete thought. Please try again.');
                    });
            }
        });
    }
    
    // Search admin updates
    if (adminSearchBtn && searchAdminUpdates) {
        adminSearchBtn.addEventListener('click', function() {
            currentUpdatesFilters.search = searchAdminUpdates.value.trim();
            currentUpdatesFilters.page = 1;
            loadAdminUpdates();
        });
        
        searchAdminUpdates.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentUpdatesFilters.search = this.value.trim();
                currentUpdatesFilters.page = 1;
                loadAdminUpdates();
            }
        });
    }
    
    // Filter admin updates by category
    if (adminCategoryFilter) {
        adminCategoryFilter.addEventListener('change', function() {
            currentUpdatesFilters.category = this.value;
            currentUpdatesFilters.page = 1;
            loadAdminUpdates();
        });
    }
    
    // Search thoughts
    if (thoughtSearchBtn && searchThoughts) {
        thoughtSearchBtn.addEventListener('click', function() {
            currentThoughtsFilters.search = searchThoughts.value.trim();
            currentThoughtsFilters.page = 1;
            loadAdminThoughts();
        });
        
        searchThoughts.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentThoughtsFilters.search = this.value.trim();
                currentThoughtsFilters.page = 1;
                loadAdminThoughts();
            }
        });
    }
    
    // ---- Functions ----
    
    // Check if user is logged in
    function checkLoginStatus() {
        isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        if (isLoggedIn) {
            showDashboard();
            loadDashboardStats();
        } else {
            showLoginForm();
        }
    }
    
    // Show login form
    function showLoginForm() {
        if (loginContainer && adminDashboard) {
            loginContainer.classList.remove('hidden');
            adminDashboard.classList.add('hidden');
        }
    }
    
    // Show dashboard
    function showDashboard() {
        if (loginContainer && adminDashboard) {
            loginContainer.classList.add('hidden');
            adminDashboard.classList.remove('hidden');
        }
    }
    
    // Load dashboard stats
    function loadDashboardStats() {
        // Update counts
        if (updateCount) {
            updateCount.textContent = mockPscUpdates.length;
        }
        
        if (thoughtCount) {
            thoughtCount.textContent = mockThoughts.length;
        }
        
        // Load recent activity
        loadRecentActivity();
    }
    
    // Load recent activity
    function loadRecentActivity() {
        if (!activityList) return;
        
        // For a real app, this would fetch from a database
        // For now, we'll show a placeholder
        activityList.innerHTML = '<p class="empty-state">No recent activity to display.</p>';
    }
    
    // Load admin updates
    function loadAdminUpdates() {
        if (!adminUpdatesList) return;
        
        // Show loading state
        adminUpdatesList.innerHTML = '<div class="loading">Loading updates...</div>';
        
        // Get updates with current filters
        getPscUpdates({
            search: currentUpdatesFilters.search,
            category: currentUpdatesFilters.category,
            page: currentUpdatesFilters.page,
            perPage: 10
        })
            .then(response => {
                if (response.updates.length === 0) {
                    adminUpdatesList.innerHTML = '<div class="empty-state">No updates found matching your criteria</div>';
                    if (adminPagination) adminPagination.innerHTML = '';
                    return;
                }
                
                // Clear loading state
                adminUpdatesList.innerHTML = '';
                
                // Render updates
                response.updates.forEach(update => {
                    const updateEl = document.createElement('div');
                    updateEl.className = 'admin-item';
                    
                    // Create update item content
                    updateEl.innerHTML = `
                        <div class="admin-item-content">
                            <h3 class="admin-item-title">${update.title}</h3>
                            <div class="admin-item-meta">
                                <span class="update-category ${update.category}">${getCategoryLabel(update.category)}</span>
                                <span class="update-date"><i class="far fa-calendar-alt"></i> ${formatDate(update.date)}</span>
                                ${update.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
                            </div>
                        </div>
                        <div class="admin-item-actions">
                            <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                    
                    // Add event listeners to buttons
                    const editBtn = updateEl.querySelector('.edit-btn');
                    const deleteBtn = updateEl.querySelector('.delete-btn');
                    
                    editBtn.addEventListener('click', () => {
                        openUpdateModal(update);
                    });
                    
                    deleteBtn.addEventListener('click', () => {
                        openDeleteModal('update', update.id, update.title);
                    });
                    
                    adminUpdatesList.appendChild(updateEl);
                });
                
                // Create pagination
                if (adminPagination) {
                    createAdminPagination(adminPagination, response.totalPages, response.currentPage, 'updates');
                }
            })
            .catch(error => {
                console.error('Error loading admin updates:', error);
                adminUpdatesList.innerHTML = '<div class="empty-state">Failed to load updates</div>';
            });
    }
    
    // Load admin thoughts
    function loadAdminThoughts() {
        if (!adminThoughtsList) return;
        
        // Show loading state
        adminThoughtsList.innerHTML = '<div class="loading">Loading thoughts...</div>';
        
        // Get thoughts with current filters (mock implementation)
        getThoughts({
            search: currentThoughtsFilters.search,
            page: currentThoughtsFilters.page,
            perPage: 10
        })
            .then(response => {
                if (response.thoughts.length === 0) {
                    adminThoughtsList.innerHTML = '<div class="empty-state">No thoughts found matching your criteria</div>';
                    if (thoughtsPagination) thoughtsPagination.innerHTML = '';
                    return;
                }
                
                // Clear loading state
                adminThoughtsList.innerHTML = '';
                
                // Render thoughts
                response.thoughts.forEach(thought => {
                    const thoughtEl = document.createElement('div');
                    thoughtEl.className = 'admin-item';
                    
                    // Create thought item content
                    thoughtEl.innerHTML = `
                        <div class="admin-item-content">
                            <h3 class="admin-item-title">"${thought.text.substring(0, 50)}${thought.text.length > 50 ? '...' : ''}"</h3>
                            <div class="admin-item-meta">
                                <span><i class="fas fa-user"></i> ${thought.author}</span>
                                <span><i class="far fa-calendar-alt"></i> ${formatDate(thought.date)}</span>
                            </div>
                        </div>
                        <div class="admin-item-actions">
                            <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                    
                    // Add event listeners to buttons
                    const editBtn = thoughtEl.querySelector('.edit-btn');
                    const deleteBtn = thoughtEl.querySelector('.delete-btn');
                    
                    editBtn.addEventListener('click', () => {
                        openThoughtModal(thought);
                    });
                    
                    deleteBtn.addEventListener('click', () => {
                        openDeleteModal('thought', thought.id, thought.text.substring(0, 30) + '...');
                    });
                    
                    adminThoughtsList.appendChild(thoughtEl);
                });
                
                // Create pagination
                if (thoughtsPagination) {
                    createAdminPagination(thoughtsPagination, response.totalPages, response.currentPage, 'thoughts');
                }
            })
            .catch(error => {
                console.error('Error loading admin thoughts:', error);
                adminThoughtsList.innerHTML = '<div class="empty-state">Failed to load thoughts</div>';
            });
    }
    
    // Create pagination for admin lists
    function createAdminPagination(container, totalPages, currentPage, type) {
        container.innerHTML = '';
        
        if (totalPages <= 1) {
            return;
        }
        
        // Previous button
        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.addEventListener('click', () => {
                if (type === 'updates') {
                    currentUpdatesFilters.page = currentPage - 1;
                    loadAdminUpdates();
                } else {
                    currentThoughtsFilters.page = currentPage - 1;
                    loadAdminThoughts();
                }
            });
            container.appendChild(prevBtn);
        }
        
        // Page buttons
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        
        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        // First page button if not starting from page 1
        if (startPage > 1) {
            const firstBtn = document.createElement('button');
            firstBtn.textContent = '1';
            firstBtn.addEventListener('click', () => {
                if (type === 'updates') {
                    currentUpdatesFilters.page = 1;
                    loadAdminUpdates();
                } else {
                    currentThoughtsFilters.page = 1;
                    loadAdminThoughts();
                }
            });
            container.appendChild(firstBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                container.appendChild(ellipsis);
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
                if (type === 'updates') {
                    currentUpdatesFilters.page = i;
                    loadAdminUpdates();
                } else {
                    currentThoughtsFilters.page = i;
                    loadAdminThoughts();
                }
            });
            
            container.appendChild(pageBtn);
        }
        
        // Last page button if not ending at last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                container.appendChild(ellipsis);
            }
            
            const lastBtn = document.createElement('button');
            lastBtn.textContent = totalPages;
            lastBtn.addEventListener('click', () => {
                if (type === 'updates') {
                    currentUpdatesFilters.page = totalPages;
                    loadAdminUpdates();
                } else {
                    currentThoughtsFilters.page = totalPages;
                    loadAdminThoughts();
                }
            });
            container.appendChild(lastBtn);
        }
        
        // Next button
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.addEventListener('click', () => {
                if (type === 'updates') {
                    currentUpdatesFilters.page = currentPage + 1;
                    loadAdminUpdates();
                } else {
                    currentThoughtsFilters.page = currentPage + 1;
                    loadAdminThoughts();
                }
            });
            container.appendChild(nextBtn);
        }
    }
    
    // Open update modal
    function openUpdateModal(update = null) {
        if (!updateModal) return;
        
        const modalTitle = document.getElementById('update-modal-title');
        const updateId = document.getElementById('update-id');
        const updateTitle = document.getElementById('update-title');
        const updateCategory = document.getElementById('update-category');
        const updateDate = document.getElementById('update-date');
        const updateContent = document.getElementById('update-content');
        const updateLink = document.getElementById('update-link');
        const updateFeatured = document.getElementById('update-featured');
        
        // Clear form
        updateForm.reset();
        
        if (update) {
            // Edit existing update
            modalTitle.textContent = 'Edit PSC Update';
            updateId.value = update.id;
            updateTitle.value = update.title;
            updateCategory.value = update.category;
            updateDate.value = update.date;
            updateContent.value = update.content;
            updateLink.value = update.link || '';
            updateFeatured.checked = update.featured;
        } else {
            // Add new update
            modalTitle.textContent = 'Add New PSC Update';
            updateId.value = '';
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            updateDate.value = today;
        }
        
        // Show modal
        updateModal.style.display = 'block';
    }
    
    // Open thought modal
    function openThoughtModal(thought = null) {
        if (!thoughtModal) return;
        
        const modalTitle = document.getElementById('thought-modal-title');
        const thoughtId = document.getElementById('thought-id');
        const thoughtText = document.getElementById('thought-text');
        const thoughtAuthor = document.getElementById('thought-author');
        const thoughtDate = document.getElementById('thought-date');
        
        // Clear form
        thoughtForm.reset();
        
        if (thought) {
            // Edit existing thought
            modalTitle.textContent = 'Edit Daily Thought';
            thoughtId.value = thought.id;
            thoughtText.value = thought.text;
            thoughtAuthor.value = thought.author;
            thoughtDate.value = thought.date;
        } else {
            // Add new thought
            modalTitle.textContent = 'Add New Daily Thought';
            thoughtId.value = '';
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            thoughtDate.value = today;
        }
        
        // Show modal
        thoughtModal.style.display = 'block';
    }
    
    // Open delete confirmation modal
    function openDeleteModal(type, id, title) {
        if (!deleteModal || !deleteMessage) return;
        
        currentDeleteItem = { type, id, title };
        
        // Set delete message
        if (type === 'update') {
            deleteMessage.textContent = `Are you sure you want to delete the update "${title}"?`;
        } else if (type === 'thought') {
            deleteMessage.textContent = `Are you sure you want to delete the thought "${title}"?`;
        }
        
        // Show modal
        deleteModal.style.display = 'block';
    }
    
    // Close all modals
    function closeAllModals() {
        if (updateModal) updateModal.style.display = 'none';
        if (thoughtModal) thoughtModal.style.display = 'none';
        if (deleteModal) deleteModal.style.display = 'none';
        
        currentDeleteItem = null;
    }
    
    // Record activity (mock implementation)
    function recordActivity(type, message) {
        // In a real application, this would save to a database
        console.log(`Activity recorded: [${type}] ${message}`);
    }
    
    // Mock API functions (will be replaced with actual API calls)
    
    // Get thoughts with filters
    function getThoughts(options = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredThoughts = [...mockThoughts];
                
                // Filter by search term
                if (options.search) {
                    const searchTerm = options.search.toLowerCase();
                    filteredThoughts = filteredThoughts.filter(thought => 
                        thought.text.toLowerCase().includes(searchTerm) || 
                        thought.author.toLowerCase().includes(searchTerm)
                    );
                }
                
                // Sort by date (newest first)
                filteredThoughts.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Pagination
                const page = options.page || 1;
                const perPage = options.perPage || 10;
                const totalPages = Math.ceil(filteredThoughts.length / perPage);
                const paginatedThoughts = filteredThoughts.slice((page - 1) * perPage, page * perPage);
                
                resolve({
                    thoughts: paginatedThoughts,
                    totalPages: totalPages,
                    currentPage: page,
                    totalThoughts: filteredThoughts.length
                });
            }, 500); // Simulate network delay
        });
    }
    
    // Save update (mock implementation)
    function saveUpdate(updateData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Find if update exists
                const existingIndex = mockPscUpdates.findIndex(update => update.id === updateData.id);
                
                if (existingIndex !== -1) {
                    // Update existing
                    mockPscUpdates[existingIndex] = updateData;
                } else {
                    // Add new
                    mockPscUpdates.push(updateData);
                }
                
                resolve(updateData);
            }, 500); // Simulate network delay
        });
    }
    
    // Save thought (mock implementation)
    function saveThought(thoughtData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Find if thought exists
                const existingIndex = mockThoughts.findIndex(thought => thought.id === thoughtData.id);
                
                if (existingIndex !== -1) {
                    // Update existing
                    mockThoughts[existingIndex] = thoughtData;
                } else {
                    // Add new
                    mockThoughts.push(thoughtData);
                }
                
                resolve(thoughtData);
            }, 500); // Simulate network delay
        });
    }
    
    // Delete update (mock implementation)
    function deleteUpdate(id) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Remove update from array
                const index = mockPscUpdates.findIndex(update => update.id === id);
                
                if (index !== -1) {
                    mockPscUpdates.splice(index, 1);
                }
                
                resolve();
            }, 500); // Simulate network delay
        });
    }
    
    // Delete thought (mock implementation)
    function deleteThought(id) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Remove thought from array
                const index = mockThoughts.findIndex(thought => thought.id === id);
                
                if (index !== -1) {
                    mockThoughts.splice(index, 1);
                }
                
                resolve();
            }, 500); // Simulate network delay
        });
    }
});
