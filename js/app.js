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

// Mock data for development (will be replaced with a proper backend)
const mockPscUpdates = [
    {
        id: 1,
        title: 'Kerala PSC Exam Calendar 2025 Published',
        category: 'notification',
        date: '2025-03-10',
        content: 'Kerala PSC has published the examination calendar for the year 2025. The calendar includes tentative exam dates for various posts. Candidates can check the official website for more details.',
        link: 'https://keralapsc.gov.in',
        featured: true
    },
    {
        id: 2,
        title: 'Last Date Extended: Assistant Professor Application',
        category: 'notification',
        date: '2025-03-08',
        content: 'The last date for submitting applications for the post of Assistant Professor in various subjects has been extended to April 15, 2025. Candidates who have not applied yet can submit their applications through the official website.',
        link: 'https://keralapsc.gov.in',
        featured: true
    },
    {
        id: 3,
        title: 'Junior Instructor Exam Results Published',
        category: 'result',
        date: '2025-03-05',
        content: 'Kerala PSC has published the results of the Junior Instructor (Electronics) examination held on January 25, 2025. Candidates can check their results by logging into their profile on the official website.',
        link: 'https://keralapsc.gov.in/results',
        featured: false
    },
    {
        id: 4,
        title: 'Police Constable Physical Test Schedule',
        category: 'exam',
        date: '2025-03-01',
        content: 'The physical efficiency test for Police Constable (Armed Police Battalion) will be conducted from April 5 to April 25, 2025. Candidates can download their admit cards from March 20, 2025 onwards.',
        link: '',
        featured: true
    },
    {
        id: 5,
        title: 'New Appointments: Health Department',
        category: 'appointment',
        date: '2025-02-28',
        content: 'Kerala PSC has issued appointment orders for the post of Staff Nurse Grade II in the Health Department. A total of 1,257 candidates have been appointed across various districts.',
        link: '',
        featured: false
    }
];

const mockThoughts = [
    {
        id: 1,
        text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        author: "Winston Churchill",
        date: "2025-03-18"
    },
    {
        id: 2,
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        date: "2025-03-17"
    },
    {
        id: 3,
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        date: "2025-03-16"
    },
    {
        id: 4,
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        date: "2025-03-15"
    },
    {
        id: 5,
        text: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela",
        date: "2025-03-14"
    }
];

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
        setTimeout(() => {
            let filteredUpdates = [...mockPscUpdates];
            
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
            
            // Filter featured updates
            if (options.featured) {
                filteredUpdates = filteredUpdates.filter(update => update.featured);
            }
            
            // Sort by date (newest first)
            filteredUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
            
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
        }, 500); // Simulate network delay
    });
}

function getDailyThought(date) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Find thought for specific date or get the latest
            const today = date ? new Date(date) : new Date();
            const todayString = today.toISOString().split('T')[0];
            
            let thought = mockThoughts.find(t => t.date === todayString);
            
            // If no thought for today, get the latest
            if (!thought) {
                mockThoughts.sort((a, b) => new Date(b.date) - new Date(a.date));
                thought = mockThoughts[0];
            }
            
            resolve(thought);
        }, 300); // Simulate network delay
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
