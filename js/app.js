// Common JavaScript for all pages

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // PWA installation
    const installApp = document.getElementById('install-app');
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install button
        if (installApp) {
            installApp.style.display = 'flex';
            
            installApp.addEventListener('click', (e) => {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                        installApp.style.display = 'none';
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                });
            });
        }
    });

    // Hide the install button if app is already installed
    window.addEventListener('appinstalled', (evt) => {
        if (installApp) {
            installApp.style.display = 'none';
        }
        deferredPrompt = null;
    });

    // Hide install button on iOS since PWA installation works differently
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && installApp) {
        installApp.style.display = 'none';
    }
});

// Utility functions for update management
function saveUpdate(updateData) {
    return new Promise((resolve) => {
        // Get existing updates from localStorage
        let updates = JSON.parse(localStorage.getItem('pscUpdates') || '[]');
        
        // Maximum updates limit
        const MAX_UPDATES = 50;
        const MIN_UPDATES = 20;

        // Find if update exists
        const existingIndex = updates.findIndex(update => update.id === updateData.id);
        
        if (existingIndex !== -1) {
            // Update existing update
            updates[existingIndex] = updateData;
        } else {
            // Add new update
            updates.push(updateData);
        }

        // Sort updates by date (newest first)
        updates.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Remove excess updates if over MAX_UPDATES
        if (updates.length > MAX_UPDATES) {
            // Remove oldest updates
            updates = updates.slice(0, MAX_UPDATES);
        }
        
        // Save back to localStorage
        localStorage.setItem('pscUpdates', JSON.stringify(updates));
        
        resolve(updateData);
    });
}

function cleanupUpdates() {
    let updates = JSON.parse(localStorage.getItem('pscUpdates') || '[]');
    
    // If updates exceed maximum, remove oldest
    if (updates.length > 50) {
        updates = updates.slice(0, 50);
        localStorage.setItem('pscUpdates', JSON.stringify(updates));
    }
}

// Optional: Add a manual cleanup function for admin
function manualCleanupUpdates() {
    let updates = JSON.parse(localStorage.getItem('pscUpdates') || '[]');
    
    // If updates are below minimum, keep all
    if (updates.length <= 20) {
        return null;
    }
    
    // Allow admin to manually reduce updates
    let updatesToKeep = updates.slice(0, 20);
    localStorage.setItem('pscUpdates', JSON.stringify(updatesToKeep));
    
    return {
        totalRemoved: updates.length - updatesToKeep.length,
        remainingUpdates: updatesToKeep.length
    };
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function getCategoryLabel(category) {
    const labels = {
        'notification': 'Notification',
        'exam': 'Exam Update',
        'result': 'Result',
        'appointment': 'Appointment',
        'other': 'Other'
    };
    return labels[category] || 'Other';
}

// Mock API functions (will be replaced with actual API calls)
function getPscUpdates(options = {}) {
    return new Promise((resolve) => {
        // Cleanup if needed
        cleanupUpdates();
        
        // Get updates from localStorage
        let updates = JSON.parse(localStorage.getItem('pscUpdates') || '[]');
        
        // If no updates in localStorage, add some default updates
        if (updates.length === 0) {
            // Initial default updates
            const defaultUpdates = [
                {
                    id: 1,
                    title: 'Welcome to WindowEdu PSC Hub',
                    category: 'notification',
                    date: new Date().toISOString().split('T')[0],
                    content: 'This is your new PSC updates platform. Stay tuned for important notifications!',
                    link: '',
                    featured: true
                }
            ];
            
            localStorage.setItem('pscUpdates', JSON.stringify(defaultUpdates));
            updates = defaultUpdates;
        }
        
        // Sort by date (newest first)
        updates.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Existing filtering logic
        let filteredUpdates = updates;
        
        // Filter by category
        if (options.category && options.category !== 'all') {
            filteredUpdates = filteredUpdates.filter(update => update.category === options.category);
        }
        
        // Filter by search term
        if (options.search) {
            const searchTerm = options.search.toLowerCase();
            filteredUpdates = filteredUpdates.filter(update => 
                update.title.toLowerCase().includes(searchTerm) || 
                update.content.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter featured updates if requested
        if (options.featured) {
            filteredUpdates = filteredUpdates.filter(update => update.featured);
        }
        
        // Pagination
        const page = options.page || 1;
        const perPage = options.perPage || 10;
        const totalPages = Math.ceil(filteredUpdates.length / perPage);
        const paginatedUpdates = filteredUpdates.slice((page - 1) * perPage, page * perPage);
        
        resolve({
            updates: paginatedUpdates,
            totalPages: totalPages,
            currentPage: page,
            totalUpdates: filteredUpdates.length
        });
    });
}

function getDailyThought(date) {
    return new Promise((resolve) => {
        // Get thoughts from localStorage
        let thoughts = JSON.parse(localStorage.getItem('dailyThoughts') || '[]');
        
        // If no thoughts, add a default motivational thought
        if (thoughts.length === 0) {
            const defaultThought = {
                id: 1,
                text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
                author: "Winston Churchill",
                date: new Date().toISOString().split('T')[0]
            };
            
            localStorage.setItem('dailyThoughts', JSON.stringify([defaultThought]));
            thoughts = [defaultThought];
        }
        
        // Find thought for specific date or get the latest
        const today = date ? new Date(date) : new Date();
        const todayString = today.toISOString().split('T')[0];
        
        let thought = thoughts.find(t => t.date === todayString);
        
        // If no thought for today, get the latest
        if (!thought) {
            thoughts.sort((a, b) => new Date(b.date) - new Date(a.date));
            thought = thoughts[0];
        }
        
        resolve(thought);
    });
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
