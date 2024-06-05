import { resources } from '../resources.js';

export function setupMiningSection() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = ''; // Clear any existing content

    const miningSection = document.createElement('div');
    miningSection.id = 'miningSection';

// Create and add the header to the mining section
    const header = document.createElement('h2');
    header.textContent = 'Manual Gathering';
    header.className = 'section-header';
    miningSection.appendChild(header);

// Create and add buttons to the mining section
    createMiningButton('Mine Resource', mineResource, miningSection);
    createMiningButton('Mine Resource 2', mineResource2, miningSection);
    createMiningButton('Mine Resource 3', mineResource3, miningSection);
    createMiningButton('Mine Resource 4', mineResource4, miningSection);
    createMiningButton('Mine Resource 5', mineResource5, miningSection);


    gameArea.appendChild(miningSection);
}

function createMiningButton(text, callback, container) {
    const button = document.createElement('button');
    button.className = 'mining-button';
    button.textContent = text;
    button.onclick = callback;
    container.appendChild(button);
}

function mineResource() {
    console.log('Mining resource...');
    // Logic for mining resource
}

function mineResource2() {
    console.log('Mining resource 2...');
    // Logic for mining resource 2
}

function mineResource3() {
    console.log('Mining resource 3...');
    // Logic for mining resource 3
}

function mineResource4() {
    console.log('Mining resource 4...');
    // Logic for mining resource 4
}

function mineResource5() {
    console.log('Mining resource 5...');
    // Logic for mining resource 5
}

