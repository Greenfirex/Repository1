import { addLogEntry } from '../log.js';
import { technologies } from './technologies.js';

export let currentResearchingTech = null;
export let researchInterval = null;
export let currentResearchDuration = 0;
export let currentResearchStartTime = 0;
export let researchProgress = 0;

const createdTechButtons = new Set();

export function getResearchInterval() {
    return researchInterval;
}

export function setResearchInterval(interval) {
    researchInterval = interval;
}

export function getResearchProgress() {
    return researchProgress;
}

export function setResearchProgress(progress) {
    researchProgress = progress;
}

export function getCurrentResearchingTech() {
  return currentResearchingTech;
}

export function setCurrentResearchingTech(tech) {
  currentResearchingTech = tech;
}

export function getCurrentResearchStartTime() {
  return currentResearchStartTime;
}

export function setCurrentResearchStartTime(time) {
  currentResearchStartTime = time;
}

export function setupResearchSection() {
  let researchSection = document.getElementById('researchSection');
  if (!researchSection) {
    researchSection = document.createElement('div');
    researchSection.id = 'researchSection';
    researchSection.className = 'game-section hidden';
    document.getElementById('gameArea').appendChild(researchSection);
  }
  researchSection.innerHTML = '';
  researchSection.classList.add('research-bg');

  // Progress bar container
  const progressBarContainer = document.createElement('div');
  progressBarContainer.className = 'progress-bar-container';

  // Progress bar wrapper
  const progressBarWrapper = document.createElement('div');
  progressBarWrapper.className = 'progress-bar-wrapper';

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBarWrapper.appendChild(progressBar);
  progressBarContainer.appendChild(progressBarWrapper);

  // Progress info (text and cancel button)
  const progressInfo = document.createElement('div');
  progressInfo.className = 'progress-info';

  // Progress text
  const progressText = document.createElement('p');
  progressText.className = 'progress-text';
  progressText.innerText = 'Research Progress: 0%';
  progressInfo.appendChild(progressText);

  // Cancel button
  const cancelButton = document.createElement('button');
  cancelButton.className = 'cancel-button';
  cancelButton.textContent = 'Cancel Research';
  cancelButton.style.display = 'none'; // Hidden initially
  cancelButton.addEventListener('click', cancelResearch);
  progressInfo.appendChild(cancelButton);

  progressBarContainer.appendChild(progressInfo);
  researchSection.appendChild(progressBarContainer);

  // Tabs for available and researched tech
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-container';

  const availableTab = document.createElement('button');
  availableTab.className = 'tab active';
  availableTab.textContent = 'Available Tech';
  availableTab.addEventListener('click', () => showTab('available'));

  const researchedTab = document.createElement('button');
  researchedTab.className = 'tab';
  researchedTab.textContent = 'Researched Tech';
  researchedTab.addEventListener('click', () => showTab('researched'));

  tabContainer.appendChild(availableTab);
  tabContainer.appendChild(researchedTab);
  researchSection.appendChild(tabContainer);

  // Tech containers
  const availableContainer = document.createElement('div');
  availableContainer.className = 'tech-container available active';
  const researchedContainer = document.createElement('div');
  researchedContainer.className = 'tech-container researched';

  technologies.forEach(tech => {
    if (!tech.isResearched) {
      const techButton = document.querySelector(`.tech-button[data-tech='${tech.name}']`);
      if (techButton) {
        techButton.style.display = 'none';
      }

      // Check if prerequisites are met
      const allPrerequisitesResearched = tech.prerequisites.every(prereq => {
        return technologies.find(t => t.name === prereq).isResearched;
      });

      // Create buttons for eligible techs
      if (allPrerequisitesResearched) {
        createTechButton(tech.name, () => startResearch(tech, cancelButton), availableContainer);
      }
    } else {
      const techName = document.createElement('p');
      techName.textContent = tech.name;
      researchedContainer.appendChild(techName);
    }
  });

  researchSection.appendChild(availableContainer);
  researchSection.appendChild(researchedContainer);
  document.getElementById('gameArea').appendChild(researchSection);
}

function showTab(tabName) {
  const availableContainer = document.querySelector('.tech-container.available');
  const researchedContainer = document.querySelector('.tech-container.researched');
  const availableTab = document.querySelector('.tab:nth-child(1)');
  const researchedTab = document.querySelector('.tab:nth-child(2)');

  if (tabName === 'available') {
    availableContainer.classList.add('active');
    researchedContainer.classList.remove('active');
    availableTab.classList.add('active');
    researchedTab.classList.remove('active');
  } else {
    availableContainer.classList.remove('active');
    researchedContainer.classList.add('active');
    availableTab.classList.remove('active');
    researchedTab.classList.add('active');
  }
}

function createTechButton(name, onClick, container) {
  const button = document.createElement('button');
  button.className = 'tech-button';
  button.dataset.tech = name;
    button.innerText = name;
    button.addEventListener('click', onClick);
    container.appendChild(button);
}

export function startResearch(tech, cancelButton) {
  if (getResearchInterval()) {
    clearInterval(getResearchInterval());
    setResearchInterval(null);
  }

  setCurrentResearchingTech(tech.name);
  setResearchProgress(0);
  currentResearchDuration = tech.duration;
  setCurrentResearchStartTime(Date.now());
  updateProgressBar(cancelButton);

  const techButton = document.querySelector(`.tech-button[data-tech='${tech.name}']`); // Select the button
  if (techButton) {
    techButton.style.display = 'none'; // Hide the button on start
  }

  if (cancelButton) {
    cancelButton.style.display = 'inline-block'; // Show cancel button
    cancelButton.dataset.tech = tech.name;
  }

  addLogEntry(`Started researching ${tech.name}.`, 'yellow');

  // Disable all other tech buttons
  document.querySelectorAll('.tech-button').forEach(button => {
    if (button.dataset.tech !== tech.name) {
      button.disabled = true;
    }
  });

  setResearchInterval(setInterval(() => {
    const elapsedTime = (Date.now() - getCurrentResearchStartTime()) / 1000;
    const progress = currentResearchDuration > 0 ? (elapsedTime / currentResearchDuration) * 100 : 0;
    setResearchProgress(progress);
    updateProgressBar(cancelButton);

    if (getResearchProgress() >= 100) {
      setResearchProgress(100);
      clearInterval(getResearchInterval());
      setResearchInterval(null);
      addLogEntry(`${tech.name} research complete!`, 'green');
      setResearchProgress(0);
      updateProgressBar(cancelButton);
      
      if (cancelButton) {
        cancelButton.style.display = 'none';
      }

      setCurrentResearchingTech(null);
      tech.isResearched = true;

      // Hide the button upon completion if it exists
      if (techButton) {
        techButton.style.display = 'none';
        createdTechButtons.delete(tech.name);
      }

      // Enable all tech buttons after research completion
      document.querySelectorAll('.tech-button').forEach(button => {
        button.disabled = false;
      });

      // Add the tech name to the researched tab
      const researchedContainer = document.querySelector('.tech-container.researched');
      const techName = document.createElement('p');
      techName.textContent = tech.name;
      researchedContainer.appendChild(techName);

      // Check for new available technologies
      const availableContainer = document.querySelector('.tech-container.available');
      const newAvailableTechs = [];
      technologies.forEach(t => {
        const techButton = document.querySelector(`.tech-button[data-tech='${t.name}']`);
        if (!t.isResearched && !techButton) {
          const allPrerequisitesResearched = t.prerequisites.every(prereq => {
            return technologies.find(tech => tech.name === prereq).isResearched;
          });
          if (allPrerequisitesResearched) {
            createTechButton(t.name, () => startResearch(t, cancelButton), availableContainer);
            newAvailableTechs.push(t.name);
          }
        }
      });

      // Log new available technologies
      if (newAvailableTechs.length > 0) {
        addLogEntry(`New technologies available: ${newAvailableTechs.join(', ')}.`, 'blue');
      }
    }
  }, 1000)); // Update every second
}
	
export function resumeOngoingResearch(tech, cancelButton, savedProgress, savedStartTime) {
  if (getResearchInterval()) {
    clearInterval(getResearchInterval());
    setResearchInterval(null);
  }

  setCurrentResearchingTech(tech.name);
  setResearchProgress(savedProgress);
  currentResearchDuration = tech.duration;
  setCurrentResearchStartTime(savedStartTime);
  updateProgressBar(cancelButton);

  // Ensure the cancel button is displayed correctly
  if (cancelButton) {
    cancelButton.style.display = 'inline-block';
    cancelButton.dataset.tech = tech.name;
  }

  setResearchInterval(setInterval(() => {
    const elapsedTime = (Date.now() - getCurrentResearchStartTime()) / 1000;
    const progress = currentResearchDuration > 0 ? (elapsedTime / currentResearchDuration) * 100 : 0;
    setResearchProgress(progress);
    updateProgressBar(cancelButton);

    if (getResearchProgress() >= 100) {
      setResearchProgress(100);
      clearInterval(getResearchInterval());
      setResearchInterval(null);
      addLogEntry(`${tech.name} research complete!`, 'green');

      if (!tech.isResearched) {
        setCurrentResearchingTech(null);
        tech.isResearched = true;

        if (cancelButton) {
          cancelButton.style.display = 'none';
        }

        // Post-completion logic
		const techButton = document.querySelector(`.tech-button[data-tech='${tech.name}']`);
        if (techButton) {
          techButton.style.display = 'none';
          createdTechButtons.delete(tech.name);
        }

        document.querySelectorAll('.tech-button').forEach(button => {
          button.disabled = false;
        });

        const researchedContainer = document.querySelector('.tech-container.researched');
        const techName = document.createElement('p');
        techName.textContent = tech.name;
        researchedContainer.appendChild(techName);

        const availableContainer = document.querySelector('.tech-container.available');
        const newAvailableTechs = [];
        technologies.forEach(t => {
          const techButton = document.querySelector(`.tech-button[data-tech='${t.name}']`);
          if (!t.isResearched && !techButton) {
            const allPrerequisitesResearched = t.prerequisites.every(prereq => {
              return technologies.find(tech => tech.name === prereq).isResearched;
            });
            if (allPrerequisitesResearched) {
              createTechButton(t.name, () => startResearch(t, cancelButton), availableContainer);
              newAvailableTechs.push(t.name);
            }
          }
        });

        if (newAvailableTechs.length > 0) {
          addLogEntry(`New technologies available: ${newAvailableTechs.join(', ')}.`, 'blue');
        }
      }

      setResearchProgress(0);
      updateProgressBar(cancelButton);
    }
  }, 1000));
}

export function updateProgressBar(cancelButton) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    if (progressBar && progressText) {
        const elapsedTime = (Date.now() - getCurrentResearchStartTime()) / 1000; // Elapsed time in seconds
        const totalDuration = currentResearchDuration || 1;
        const progress = Math.min((elapsedTime / totalDuration) * 100, 100);
        setResearchProgress(progress);
        progressBar.style.width = `${researchProgress}%`;
        progressText.innerText = `Research Progress: ${Math.floor(researchProgress)}%`;

        if (cancelButton && getResearchProgress() > 0 && getResearchProgress() < 100) {
            cancelButton.style.display = 'inline-block';
        } else if (cancelButton) {
            cancelButton.style.display = 'none';
        }
    } else {
        console.error('Progress bar elements not found.');
    }
}

function cancelResearch() {
  clearInterval(getResearchInterval());
  setResearchInterval(null);

  const techName = getCurrentResearchingTech();
  addLogEntry(`${techName} research cancelled.`, 'red');

  setResearchProgress(0); 
  setCurrentResearchingTech(null);
  researchProgress = 0;
  currentResearchingTech = null;

 
  // Clear saved research state
  localStorage.removeItem('researchState');

  const progressBar = document.querySelector('.progress-bar');
  const progressText = document.querySelector('.progress-text');
  if (progressBar && progressText) {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0'; // Reset to zero
    progressText.innerText = 'Research Progress: 0%'; // Update the text to zero
  }

  const cancelButton = document.querySelector('.cancel-button');
  if (cancelButton) {
    cancelButton.style.display = 'none';
  }

  // Ensure techButton visibility is reset
  const techButton = document.querySelector(`.tech-button[data-tech="${cancelButton.dataset.tech}"]`);
  if (techButton) {
    techButton.style.display = 'inline-block'; // Show button again when research is cancelled
  }

  // Re-enable all tech buttons
  document.querySelectorAll('.tech-button').forEach(button => {
    button.disabled = false;
  });

  currentResearchingTech = null;
}