import { setupMiningSection } from './sections/mining.js';
import { setupResearchSection, currentResearchingTech, currentResearchDuration, currentResearchStartTime, setResearchProgress, setResearchInterval, getResearchProgress } from './sections/research.js'
import { resources, updateResourceInfo, incrementResources } from './resources.js';
import { loadGameState, saveGameState } from './saveload.js';
import { addLogEntry } from './log.js'
import './headeroptions.js';

document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    loadCurrentSection();
    loadGameState();
    updateResourceInfo();
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

window.addEventListener('beforeunload', saveGameState);

export let activatedSections = JSON.parse(localStorage.getItem('activatedSections')) || {
    research: false,
    manufacturing: false,
    trade: false,
    other4: false,
    other5: false,
    other6: false
};

export function setActivatedSections(sections) {
    activatedSections = sections;
    localStorage.setItem('activatedSections', JSON.stringify(activatedSections));
}

function setupMenuButtons() {
    const sections = ['mining', 'research', 'manufacturing', 'trade', 'other4', 'other5', 'other6'];
    const container = document.querySelector('.menu-buttons-container');
    container.innerHTML = ''; // Clear any existing buttons
    sections.forEach(section => {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.dataset.section = section;
        button.textContent = section.charAt(0).toUpperCase() + section.slice(1);
        button.addEventListener('click', () => showSection(section));
        container.appendChild(button);
        console.log(`Initial button created: ${section}`);
    });
}

export function applyActivatedSections() {
    document.querySelectorAll('.menu-button[data-section]').forEach(button => {
        const section = button.getAttribute('data-section');
        if (activatedSections[section]) {
            button.classList.remove('hidden');
            button.addEventListener('click', handleSectionClick); // Attach the click event
        } else if (section !== 'mining') {
            button.classList.add('hidden');
            }
    });
}

export function handleSectionClick(event) {
    const section = event.currentTarget.getAttribute('data-section');
    console.log(`Button clicked: ${section}`);
	saveResearchState();
    showSection(section);
}

export function saveResearchState() {
    const researchState = {
        progress: getResearchProgress(),
        duration: currentResearchDuration, // Save the total duration of the research
        startTime: currentResearchStartTime, // Save the start time of the research
        researchingTech: currentResearchingTech
    };
    localStorage.setItem('researchState', JSON.stringify(researchState));
    console.log('Research state saved', researchState);
}

// Function to check conditions and show buttons
export function checkConditions() {
    const buttons = [
	    { button: document.querySelector('.menu-button[data-section="mining"]'), threshold: 0, section: 'mining', logText: 'Mining section available' }, // Mining with no prerequisites
        { button: document.querySelector('.menu-button[data-section="research"]'), threshold: 10, section: 'research', logText: 'New menu section activated: Research' },
        { button: document.querySelector('.menu-button[data-section="manufacturing"]'), threshold: 20, section: 'manufacturing', logText: 'New menu section activated: Manufacturing' },
        { button: document.querySelector('.menu-button[data-section="trade"]'), threshold: 30, section: 'trade', logText: 'New menu section activated: Trade' },
        { button: document.querySelector('.menu-button[data-section="other4"]'), threshold: 40, section: 'other4', logText: 'New menu section activated: Other 4' },
        { button: document.querySelector('.menu-button[data-section="other5"]'), threshold: 50, section: 'other5', logText: 'New menu section activated: Other 5' },
        { button: document.querySelector('.menu-button[data-section="other6"]'), threshold: 60, section: 'other6', logText: 'New menu section activated: Other 6' }
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
        research: false,
        manufacturing: false,
        trade: false,
        other4: false,
        other5: false,
        other6: false
    };
    localStorage.setItem('activatedSections', JSON.stringify(activatedSections));
	applyActivatedSections();

    // Skrytí tlačítek po resetování aktivovaných sekcí
    document.querySelectorAll('.menu-button[data-section]').forEach(button => {
        if (button.getAttribute('data-section') !== 'mining') {
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
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = ''; 
    gameArea.className = ''; 

    localStorage.setItem('currentSection', sectionId);

    if (sectionId === 'mining') {
        gameArea.classList.add('mining-bg');
        setupMiningSection();
    } else if (sectionId === 'research') {
        gameArea.classList.add('research-bg');
        setupResearchSection();
    } else if (sectionId === 'manufacturing') {
        gameArea.classList.add('manufacturing-bg');
    }
};

// Function to load the saved section
function loadCurrentSection() {
  const savedSection = localStorage.getItem('currentSection');
  if (savedSection) {
    showSection(savedSection);
  } else {
    // Default to mining section if no section is saved
    showSection('mining');
  }
}
