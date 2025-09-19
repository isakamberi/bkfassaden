document.addEventListener('DOMContentLoaded', function() {
    // Project data - you can expand this with more projects
    const projectsData = {
        'Apartment Building': {
            location: 'Fällanden',
            image: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            description: 'Complete facade renovation for a modern apartment complex in Fällanden, featuring energy-efficient materials and a sleek, contemporary design.',
            features: [
                {
                    icon: 'fas fa-ruler-combined',
                    title: 'Area',
                    value: '2,500 m²'
                },
                {
                    icon: 'fas fa-calendar-alt',
                    title: 'Completed',
                    value: 'March 2023'
                },
                {
                    icon: 'fas fa-paint-roller',
                    title: 'Services',
                    value: 'Facade, Painting'
                }
            ]
        },
        'Luxury Villa': {
            location: 'Herrliberg',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            description: 'Luxury villa renovation with premium materials and custom design elements, including a complete exterior makeover and landscaping.',
            features: [
                {
                    icon: 'fas fa-ruler-combined',
                    title: 'Area',
                    value: '1,800 m²'
                },
                {
                    icon: 'fas fa-calendar-alt',
                    title: 'Completed',
                    value: 'November 2022'
                },
                {
                    icon: 'fas fa-paint-roller',
                    title: 'Services',
                    value: 'Complete Renovation'
                }
            ]
        },
        'Office Building': {
            location: 'Zurich',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            description: 'Modern office building facade upgrade with energy-efficient glass and metal cladding, completed with minimal disruption to business operations.',
            features: [
                {
                    icon: 'fas fa-ruler-combined',
                    title: 'Area',
                    value: '5,200 m²'
                },
                {
                    icon: 'fas fa-calendar-alt',
                    title: 'Completed',
                    value: 'July 2023'
                },
                {
                    icon: 'fas fa-paint-roller',
                    title: 'Services',
                    value: 'Facade, Glass Work'
                }
            ]
        },
        'Apartment Building': {
            location: 'Bubendorf',
            image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            description: 'Complete exterior renovation of a residential building, including new insulation, windows, and a modern facade system.',
            features: [
                {
                    icon: 'fas fa-ruler-combined',
                    title: 'Area',
                    value: '3,100 m²'
                },
                {
                    icon: 'fas fa-calendar-alt',
                    title: 'Completed',
                    value: 'January 2023'
                },
                {
                    icon: 'fas fa-paint-roller',
                    title: 'Services',
                    value: 'Complete Facade'
                }
            ]
        },
        'Single-Family Home': {
            location: 'Horgen',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            description: 'Charming single-family home renovation with a focus on traditional architecture and high-quality materials.',
            features: [
                {
                    icon: 'fas fa-ruler-combined',
                    title: 'Area',
                    value: '450 m²'
                },
                {
                    icon: 'fas fa-calendar-alt',
                    title: 'Completed',
                    value: 'September 2022'
                },
                {
                    icon: 'fas fa-paint-roller',
                    title: 'Services',
                    value: 'Facade, Roofing'
                }
            ]
        },
        'Villa Renovation': {
            location: 'Zollikon',
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            description: 'Luxury villa renovation with premium materials and custom design elements, including a complete exterior makeover and landscaping.',
            features: [
                {
                    icon: 'fas fa-ruler-combined',
                    title: 'Area',
                    value: '2,800 m²'
                },
                {
                    icon: 'fas fa-calendar-alt',
                    title: 'Completed',
                    value: 'May 2023'
                },
                {
                    icon: 'fas fa-paint-roller',
                    title: 'Services',
                    value: 'Complete Renovation'
                }
            ]
        }
    };

    // Get modal elements
    const modal = document.getElementById('projectModal');
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalLocation = modal.querySelector('.modal-location');
    const modalDescription = modal.querySelector('.modal-description');
    const projectFeatures = modal.querySelector('.project-features');
    const closeModal = modal.querySelector('.close-modal');

    // Function to open modal with project data
    function openProjectModal(projectName) {
        const project = projectsData[projectName];
        if (!project) return;

        // Update modal content
        modalImage.style.backgroundImage = `url('${project.image}')`;
        modalTitle.textContent = projectName;
        modalLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${project.location}`;
        modalDescription.textContent = project.description;

        // Update features
        projectFeatures.innerHTML = project.features.map(feature => `
            <div class="feature-item">
                <i class="${feature.icon}"></i>
                <div class="feature-text">
                    <h4>${feature.title}</h4>
                    <p>${feature.value}</p>
                </div>
            </div>
        `).join('');

        // Show modal
        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
    }

    // Function to close modal
    function closeProjectModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add click event to all project cards
    document.addEventListener('click', function(e) {
        const projectCard = e.target.closest('.project-card');
        if (projectCard) {
            const projectName = projectCard.querySelector('h3').textContent;
            openProjectModal(projectName);
        }
    });

    // Close modal when clicking the close button or outside the modal
    closeModal.addEventListener('click', closeProjectModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
});
