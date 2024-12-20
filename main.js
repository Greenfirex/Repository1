import { setupMiningSection } from './sections/mining.js';
import { setupResearchSection, currentResearchingTech, currentResearchDuration, currentResearchStartTime, setResearchProgress, setResearchInterval, getResearchProgress } from './sections/research.js'
import { setupManufacturingSection } from './sections/manufacturing.js';
import { resources, updateResourceInfo, incrementResources } from './resources.js';
import { loadGameState, saveGameState } from './saveload.js';
import { addLogEntry } from './log.js'
import './headeroptions.js';

document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    loadCurrentSection();

    const isResetting = localStorage.getItem('isResetting');
  if (!isResetting) {
    loadGameState(); // Only load if not resetting
  } else {
    localStorage.removeItem('isResetting'); // Clean up after reset
  }

    updateResourceInfo();
    setupMiningSection();
    setupResearchSection();
    setupManufacturingSection();
    setupMenuButtons();
    applyActivatedSections();
    setInterval(() => {
        incrementResources();
        updateResourceInfo();
        checkConditions();
    }, 100);
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        saveGameState();
    }
});

export function setActivatedSections(sections) {
    activatedSections = sections;
    localStorage.setItem('activatedSections', JSON.stringify(activatedSections));
}

export let activatedSections = JSON.parse(localStorage.getItem('activatedSections')) || {
    researchSection: false,
    manufacturingSection: false,
};

function setupMenuButtons() {
    const sections = ['miningSection', 'researchSection', 'manufacturingSection'];
    const container = document.querySelector('.menu-buttons-container');
    container.innerHTML = ''; // Clear any existing buttons
    sections.forEach(section => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.dataset.section = section;
        button.textContent = section.charAt(0).toUpperCase() + section.slice(1);
        button.addEventListener('click', () => showSection(section));
        container.appendChild(button);
    });
}

export function applyActivatedSections() {
    document.querySelectorAll('.menu-button[data-section]').forEach(button => {
        const section = button.getAttribute('data-section');
        if (activatedSections[section]) {
            button.classList.remove('hidden');
            button.addEventListener('click', handleSectionClick); // Attach the click event
        } else if (section !== 'miningSection') {
            button.classList.add('hidden');
            }
    });
}

export function handleSectionClick(event) {
    const section = event.currentTarget.getAttribute('data-section');
    showSection(section);
}

// Function to check conditions and show buttons
export function checkConditions() {
    const buttons = [
	    { button: document.querySelector('.menu-button[data-section="miningSection"]'), threshold: 0, section: 'miningSection', logText: 'Mining section available' }, // Mining with no prerequisites
        { button: document.querySelector('.menu-button[data-section="researchSection"]'), threshold: 10, section: 'researchSection', logText: 'New menu section activated: Research' },
        { button: document.querySelector('.menu-button[data-section="manufacturingSection"]'), threshold: 20, section: 'manufacturingSection', logText: 'New menu section activated: Manufacturing' },
    ];

    const requiredResource = resources.find(resource => resource.name === 'Hydrogen');

    if (requiredResource) {
        buttons.forEach(({ button, threshold, section, logText }) => {
            if (requiredResource.amount >= threshold && !activatedSections[section]) {
                button.classList.remove('hidden');
				button.disabled = false;
                button.addEventListener('click', handleSectionClick);
                addLogEntry(logText, 'blue');
                activatedSections[section] = true;
            }
        });
    }
}

export function resetActivatedSections() {
    activatedSections = {
        researchSection: false,
        manufacturingSection: false,
    };
    localStorage.setItem('activatedSections', JSON.stringify(activatedSections));
	applyActivatedSections();

    // Skrytí tlačítek po resetování aktivovaných sekcí
    document.querySelectorAll('.menu-button[data-section]').forEach(button => {
        if (button.getAttribute('data-section') !== 'miningSection') {
            button.classList.add('hidden');
            button.disabled = true;
        }
    });
}


function preloadImages() {
    const images = [
        'assets/images/background1.jpg',
        'assets/images/background2.jpg',
        'assets/images/background3.jpg',
        'assets/images/background4.jpg',
        'assets/images/background5.jpg',
	    'assets/images/PNG/Button03.png',
        'assets/images/PNG/Button04.png',
    ];
    
    images.forEach((image) => {
        const img = new Image();
        img.src = image;
    });
}

window.showSection = function(sectionId) {
    const sections = document.querySelectorAll('.game-section');
    sections.forEach(section => {
        if (section.id !== sectionId) { // Only hide if it’s not the target section
            section.classList.add('hidden'); // Hide all sections
        }
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove('hidden'); // Show the active section
    }  
    localStorage.setItem('currentSection', sectionId); // Save current section
};

// Function to load the saved section
function loadCurrentSection() {
  const savedSection = localStorage.getItem('currentSection');
  if (savedSection) {
    showSection(savedSection);
  } else {
    // Default to mining section if no section is saved
    showSection('miningSection');
  }
}
