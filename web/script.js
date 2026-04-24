const container = document.getElementById('visualizer-container');
const speedSlider = document.getElementById('speed-slider');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const btnGenerate = document.getElementById('btn-generate');
const algoSelect = document.getElementById('algo-select');
const searchTargetContainer = document.getElementById('search-target-container');
const searchTargetDisplay = document.getElementById('search-target');
const algoControls = document.getElementById('algo-controls');
const dsControls = document.getElementById('ds-controls');
const btnDsAdd = document.getElementById('btn-ds-add');
const btnDsRemove = document.getElementById('btn-ds-remove');

let originalArray = [];
let currentArray = [];
let states = [];
let steps = [];
let targetValue = null;

let isPlaying = false;
let isPaused = false;
let currentStepIndex = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ===== QUICK SORT GENERATOR ===== */
function generateQuickSortSteps(arr) {
    const localSteps = [];
    const workArr = [...arr];

    function addStep(type, indices) {
        localSteps.push({ type, indices });
    }

    function partition(low, high) {
        let pivot = workArr[high];
        let i = low - 1;
        addStep("pivot", [high]);
        
        for (let j = low; j < high; j++) {
            addStep("compare", [j, high]);
            if (workArr[j] < pivot) {
                i++;
                addStep("swap", [i, j]);
                const temp = workArr[i];
                workArr[i] = workArr[j];
                workArr[j] = temp;
            }
        }
        addStep("swap", [i + 1, high]);
        const temp = workArr[i + 1];
        workArr[i + 1] = workArr[high];
        workArr[high] = temp;
        
        addStep("mark_sorted", [i + 1]);
        return i + 1;
    }

    function quickSort(low, high) {
        if (low < high) {
            let pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        } else if (low === high) {
            addStep("mark_sorted", [low]);
        }
    }

    quickSort(0, workArr.length - 1);
    return localSteps;
}

/* ===== BUBBLE SORT GENERATOR ===== */
function generateBubbleSortSteps(arr) {
    const localSteps = [];
    const workArr = [...arr];
    const n = workArr.length;

    function addStep(type, indices) {
        localSteps.push({ type, indices });
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            addStep("compare", [j, j + 1]);
            
            if (workArr[j] > workArr[j + 1]) {
                addStep("swap", [j, j + 1]);
                const temp = workArr[j];
                workArr[j] = workArr[j + 1];
                workArr[j + 1] = temp;
            }
        }
        addStep("mark_sorted", [n - i - 1]);
    }

    if (n > 0) {
        addStep("mark_sorted", [0]);
    }

    return localSteps;
}

/* ===== SEARCHING GENERATORS ===== */
function generateLinearSearchSteps(arr, target) {
    const localSteps = [];
    for (let i = 0; i < arr.length; i++) {
        localSteps.push({ type: 'compare', indices: [i] });
        if (arr[i] === target) {
            localSteps.push({ type: 'found', indices: [i] });
            break;
        }
    }
    return localSteps;
}

function generateBinarySearchSteps(arr, target) {
    const localSteps = [];
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        localSteps.push({ type: 'compare', indices: [mid] });
        
        if (arr[mid] === target) {
            localSteps.push({ type: 'found', indices: [mid] });
            break;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return localSteps;
}

/* ===== APP & RENDER LOGIC ===== */
function generateNewArray() {
    originalArray = [];
    for (let i = 0; i < 20; i++) {
        originalArray.push(Math.floor(Math.random() * 100) + 10);
    }
    setupAlgorithm();
}

function setupAlgorithm() {
    isPlaying = false;
    isPaused = false;
    currentStepIndex = 0;
    
    const algo = algoSelect.value;
    
    if (algo === 'stack' || algo === 'queue') {
        algoControls.style.display = 'none';
        dsControls.style.display = 'flex';
        btnGenerate.disabled = true;
        searchTargetContainer.style.display = 'none';
        
        btnDsAdd.innerText = algo === 'stack' ? 'Push' : 'Enqueue';
        btnDsRemove.innerText = algo === 'stack' ? 'Pop' : 'Dequeue';
        
        container.className = algo;
        container.innerHTML = '';
        currentArray = [];
        return;
    } else {
        algoControls.style.display = 'flex';
        dsControls.style.display = 'none';
        btnGenerate.disabled = false;
        container.className = '';
    }

    if (algo.includes('search')) {
        targetValue = originalArray[Math.floor(Math.random() * originalArray.length)];
        searchTargetContainer.style.display = 'block';
        searchTargetDisplay.innerText = targetValue;
    } else {
        searchTargetContainer.style.display = 'none';
        targetValue = null;
    }

    if (algo === 'binarysearch') {
        currentArray = [...originalArray].sort((a, b) => a - b);
    } else {
        currentArray = [...originalArray];
    }
    
    states = new Array(currentArray.length).fill('default');
    
    // Dynamically spawn steps
    if (algo === 'quicksort') {
        steps = generateQuickSortSteps(currentArray);
    } else if (algo === 'bubblesort') {
        steps = generateBubbleSortSteps(currentArray);
    } else if (algo === 'linearsearch') {
        steps = generateLinearSearchSteps(currentArray, targetValue);
    } else if (algo === 'binarysearch') {
        steps = generateBinarySearchSteps(currentArray, targetValue);
    }
    
    renderBars();
}

function renderBars() {
    container.innerHTML = '';
    if (currentArray.length === 0) return;
    
    const maxVal = Math.max(...currentArray);
    
    currentArray.forEach((val, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        if (states[index] !== 'default') {
            bar.classList.add(states[index]);
        }
        
        bar.id = `bar-${index}`;
        const heightPercent = (val / maxVal) * 90;
        bar.style.height = `${heightPercent}%`;
        bar.innerText = val;
        
        container.appendChild(bar);
    });
}

async function handleStep(step) {
    const { type, indices, index, value } = step;
    
    // Clear temp states
    for (let i = 0; i < states.length; i++) {
        if (states[i] !== 'mark_sorted' && states[i] !== 'found') states[i] = 'default';
    }

    if (type === 'compare') {
        if (indices && indices[0] !== undefined) states[indices[0]] = 'compare';
        if (indices && indices[1] !== undefined) states[indices[1]] = 'compare';
    } 
    else if (type === 'swap') {
        if (indices && indices[0] !== undefined) states[indices[0]] = 'swap';
        if (indices && indices[1] !== undefined) states[indices[1]] = 'swap';
        
        const temp = currentArray[indices[0]];
        currentArray[indices[0]] = currentArray[indices[1]];
        currentArray[indices[1]] = temp;
    }
    else if (type === 'overwrite') { // Future proofing
        if (index !== undefined) {
            states[index] = 'overwrite';
            currentArray[index] = value;
        }
    }
    else if (type === 'pivot') {
        if (indices && indices[0] !== undefined) states[indices[0]] = 'pivot';
    }
    else if (type === 'mark_sorted') {
        if (indices && indices[0] !== undefined) states[indices[0]] = 'mark_sorted';
    }
    else if (type === 'found') {
        if (indices && indices[0] !== undefined) states[indices[0]] = 'found';
    }
    
    renderBars();
}

async function playSteps() {
    if (isPlaying && !isPaused) return; 
    if (isPlaying && isPaused) {
        isPaused = false; 
        return;
    }
    
    if (currentStepIndex >= steps.length) {
        setupAlgorithm(); 
    }
    
    isPlaying = true;
    isPaused = false;
    
    while (currentStepIndex < steps.length) {
        if (!isPlaying || isPaused) break;
        
        await handleStep(steps[currentStepIndex]);
        
        const delay = parseInt(speedSlider.value);
        await sleep(delay);
        
        currentStepIndex++;
    }
    
    if (currentStepIndex >= steps.length) {
        isPlaying = false;
        for (let i = 0; i < states.length; i++) {
            if (states[i] !== 'mark_sorted' && states[i] !== 'found') states[i] = 'default';
        }
        renderBars();
    }
}

async function dsAdd() {
    const algo = algoSelect.value;
    if (algo !== 'stack' && algo !== 'queue') return;
    
    if (currentArray.length >= 15) {
        return; // Ignore if overloaded
    }

    const val = Math.floor(Math.random() * 90) + 10;
    currentArray.push(val);

    const item = document.createElement('div');
    item.className = 'ds-item pushing';
    item.innerText = val;
    item.id = `ds-${currentArray.length - 1}`;
    
    container.appendChild(item);

    const delay = parseInt(speedSlider.value) || 300;
    await sleep(delay);
    if (container.contains(item)) {
        item.classList.remove('pushing');
    }
}

async function dsRemove() {
    const algo = algoSelect.value;
    if (algo !== 'stack' && algo !== 'queue') return;
    if (currentArray.length === 0) return;
    
    // Only consider elements that are NOT already in the process of popping
    const validChildren = Array.from(container.children).filter(c => !c.classList.contains('popping'));
    if (validChildren.length === 0) return;
    
    let item;
    if (algo === 'stack') {
        currentArray.pop();
        item = validChildren[validChildren.length - 1]; // Top of stack
    } else {
        currentArray.shift();
        item = validChildren[0]; // Front of queue
    }
    
    if (item) {
        item.classList.add('popping');
        const delay = parseInt(speedSlider.value) || 300;
        await sleep(delay);
        if (container.contains(item)) {
            item.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateNewArray(); // Automatically fire once
    
    btnGenerate.addEventListener('click', generateNewArray);
    btnReset.addEventListener('click', setupAlgorithm);
    btnPlay.addEventListener('click', () => { playSteps(); });
    btnPause.addEventListener('click', () => { isPaused = true; });
    algoSelect.addEventListener('change', setupAlgorithm);
    btnDsAdd.addEventListener('click', dsAdd);
    btnDsRemove.addEventListener('click', dsRemove);
});
