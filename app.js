// ========================================
// DATA & STATE MANAGEMENT
// ========================================

// Pre-built workout protocols
const PREBUILT_WORKOUTS = [
    {
        id: 'repeaters',
        name: 'Repeaters',
        hangTime: 7,
        restTime: 3,
        sets: 6,
        restBetweenSets: 180,
        numberOfSets: 3
    },
    {
        id: 'max-hangs',
        name: 'Max Hangs',
        hangTime: 10,
        restTime: 0,
        sets: 1,
        restBetweenSets: 180,
        numberOfSets: 5
    },
    {
        id: 'intermediate',
        name: 'Intermediate Repeaters',
        hangTime: 10,
        restTime: 5,
        sets: 5,
        restBetweenSets: 120,
        numberOfSets: 3
    },
    {
        id: 'endurance',
        name: 'Endurance',
        hangTime: 15,
        restTime: 15,
        sets: 8,
        restBetweenSets: 180,
        numberOfSets: 2
    }
];

// App state
let customWorkouts = [];
let workoutHistory = [];
let currentWorkout = null;
let timerState = {
    isRunning: false,
    isPaused: false,
    phase: 'prepare',
    timeRemaining: 5,
    currentSet: 1,
    currentRep: 0,
    totalElapsedTime: 0,
    interval: null
};

// Audio context for beeps
let audioContext = null;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupTabNavigation();
    setupEventListeners();
    renderWorkouts();
    renderHistory();
    renderCustomWorkouts();
    
    // Initialize audio on first user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
});

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// ========================================
// LOCAL STORAGE
// ========================================

function loadData() {
    const savedCustom = localStorage.getItem('customWorkouts');
    const savedHistory = localStorage.getItem('workoutHistory');
    
    if (savedCustom) {
        customWorkouts = JSON.parse(savedCustom);
    }
    
    if (savedHistory) {
        workoutHistory = JSON.parse(savedHistory);
    }
}

function saveCustomWorkouts() {
    localStorage.setItem('customWorkouts', JSON.stringify(customWorkouts));
}

function saveHistory() {
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
}

// ========================================
// TAB NAVIGATION
// ========================================

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    // Refresh content when switching to tabs
    if (tabName === 'history') {
        renderHistory();
    } else if (tabName === 'custom') {
        renderCustomWorkouts();
    } else if (tabName === 'timer') {
        renderWorkouts();
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Add workout button
    document.getElementById('add-workout-btn').addEventListener('click', () => {
        openWorkoutModal();
    });
    
    // Modal close buttons
    document.getElementById('close-modal').addEventListener('click', closeWorkoutModal);
    document.getElementById('cancel-modal').addEventListener('click', closeWorkoutModal);
    
    // Workout form
    document.getElementById('workout-form').addEventListener('submit', handleWorkoutSubmit);
    
    // Form inputs - update total duration
    ['hang-time', 'rest-time', 'sets', 'num-sets', 'rest-between-sets'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateFormDuration);
    });
    
    // Timer controls
    document.getElementById('close-timer').addEventListener('click', handleCloseTimer);
    document.getElementById('start-button').addEventListener('click', startTimer);
    document.getElementById('pause-button').addEventListener('click', pauseTimer);
    document.getElementById('resume-button').addEventListener('click', resumeTimer);
    document.getElementById('stop-button').addEventListener('click', handleStopTimer);
    document.getElementById('done-button').addEventListener('click', finishWorkout);
    
    // Exit modal
    document.getElementById('cancel-exit').addEventListener('click', closeExitModal);
    document.getElementById('confirm-exit').addEventListener('click', confirmExit);
}

// ========================================
// RENDER FUNCTIONS
// ========================================

function renderWorkouts() {
    const prebuiltContainer = document.getElementById('prebuilt-workouts');
    const customContainer = document.getElementById('custom-workouts-list');
    
    // Render pre-built workouts
    prebuiltContainer.innerHTML = PREBUILT_WORKOUTS.map(workout => 
        createWorkoutCard(workout, false)
    ).join('');
    
    // Render custom workouts in timer tab
    if (customWorkouts.length > 0) {
        document.querySelector('.custom-section').style.display = 'block';
        customContainer.innerHTML = customWorkouts.map(workout => 
            createWorkoutCard(workout, false)
        ).join('');
    } else {
        document.querySelector('.custom-section').style.display = 'none';
    }
    
    // Add click listeners
    document.querySelectorAll('.workout-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.icon-button')) {
                const workoutId = card.dataset.id;
                const workout = findWorkout(workoutId);
                if (workout) {
                    openTimerScreen(workout);
                }
            }
        });
    });
}

function renderCustomWorkouts() {
    const container = document.getElementById('custom-workouts-manage');
    
    if (customWorkouts.length === 0) {
        container.innerHTML = `
            <div class="custom-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <h3>No custom workouts</h3>
                <p>Create your own workout protocol</p>
            </div>
        `;
    } else {
        container.innerHTML = customWorkouts.map(workout => 
            createWorkoutCard(workout, true)
        ).join('');
        
        // Add edit and delete listeners
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const workoutId = btn.closest('.workout-card').dataset.id;
                const workout = customWorkouts.find(w => w.id === workoutId);
                if (workout) {
                    openWorkoutModal(workout);
                }
            });
        });
        
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const workoutId = btn.closest('.workout-card').dataset.id;
                deleteCustomWorkout(workoutId);
            });
        });
    }
}

function renderHistory() {
    const container = document.getElementById('history-list');
    
    if (workoutHistory.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3>No workout history yet</h3>
                <p>Complete a workout to see it here</p>
            </div>
        `;
    } else {
        container.innerHTML = workoutHistory.map(history => 
            createHistoryCard(history)
        ).join('');
        
        // Add delete listeners
        container.querySelectorAll('.delete-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const historyId = btn.dataset.id;
                deleteHistory(historyId);
            });
        });
    }
}

// ========================================
// CARD CREATION
// ========================================

function createWorkoutCard(workout, showActions) {
    const totalDuration = calculateTotalDuration(workout);
    
    return `
        <div class="workout-card" data-id="${workout.id}">
            <div class="workout-card-header">
                <div class="workout-name">${workout.name}</div>
                ${showActions ? `
                    <div class="workout-actions">
                        <button class="icon-button edit-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="icon-button delete-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="workout-details">
                <div class="workout-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2v20M2 12h20"></path>
                    </svg>
                    ${workout.hangTime}s hang
                </div>
                ${workout.restTime > 0 ? `
                    <div class="workout-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${workout.restTime}s rest
                    </div>
                ` : ''}
            </div>
            <div class="workout-meta">
                <span>${workout.sets} reps × ${workout.numberOfSets} sets</span>
                <span>Total: ${formatTime(totalDuration)}</span>
            </div>
        </div>
    `;
}

function createHistoryCard(history) {
    const date = new Date(history.date);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div class="history-card">
            <div class="history-header">
                <div class="history-name">${history.protocolName}</div>
                <div style="display: flex; align-items: center;">
                    <div class="completion-badge ${history.completed ? 'completed' : 'incomplete'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            ${history.completed 
                                ? '<polyline points="20 6 9 17 4 12"></polyline>'
                                : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
                            }
                        </svg>
                        ${history.completed ? 'Done' : 'Stopped'}
                    </div>
                    <button class="delete-button" data-id="${history.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="history-meta">
                <span>${dateStr} ${timeStr}</span>
                <span>${formatTime(history.duration)}</span>
            </div>
        </div>
    `;
}

// ========================================
// WORKOUT MODAL
// ========================================

let editingWorkout = null;

function openWorkoutModal(workout = null) {
    editingWorkout = workout;
    const modal = document.getElementById('workout-modal');
    const form = document.getElementById('workout-form');
    
    if (workout) {
        document.getElementById('modal-title').textContent = 'Edit Workout';
        document.getElementById('workout-name').value = workout.name;
        document.getElementById('hang-time').value = workout.hangTime;
        document.getElementById('rest-time').value = workout.restTime;
        document.getElementById('sets').value = workout.sets;
        document.getElementById('num-sets').value = workout.numberOfSets;
        document.getElementById('rest-between-sets').value = workout.restBetweenSets;
    } else {
        document.getElementById('modal-title').textContent = 'Create Workout';
        form.reset();
    }
    
    updateFormDuration();
    modal.classList.remove('hidden');
}

function closeWorkoutModal() {
    document.getElementById('workout-modal').classList.add('hidden');
    editingWorkout = null;
}

function updateFormDuration() {
    const hangTime = parseInt(document.getElementById('hang-time').value) || 0;
    const restTime = parseInt(document.getElementById('rest-time').value) || 0;
    const sets = parseInt(document.getElementById('sets').value) || 0;
    const numberOfSets = parseInt(document.getElementById('num-sets').value) || 0;
    const restBetweenSets = parseInt(document.getElementById('rest-between-sets').value) || 0;
    
    const workout = { hangTime, restTime, sets, numberOfSets, restBetweenSets };
    const duration = calculateTotalDuration(workout);
    
    document.getElementById('form-total-duration').textContent = formatTime(duration);
}

function handleWorkoutSubmit(e) {
    e.preventDefault();
    
    const workout = {
        id: editingWorkout ? editingWorkout.id : generateId(),
        name: document.getElementById('workout-name').value,
        hangTime: parseInt(document.getElementById('hang-time').value),
        restTime: parseInt(document.getElementById('rest-time').value),
        sets: parseInt(document.getElementById('sets').value),
        numberOfSets: parseInt(document.getElementById('num-sets').value),
        restBetweenSets: parseInt(document.getElementById('rest-between-sets').value)
    };
    
    if (editingWorkout) {
        // Update existing
        const index = customWorkouts.findIndex(w => w.id === editingWorkout.id);
        customWorkouts[index] = workout;
    } else {
        // Add new
        customWorkouts.push(workout);
    }
    
    saveCustomWorkouts();
    renderWorkouts();
    renderCustomWorkouts();
    closeWorkoutModal();
}

function deleteCustomWorkout(id) {
    if (confirm('Delete this workout?')) {
        customWorkouts = customWorkouts.filter(w => w.id !== id);
        saveCustomWorkouts();
        renderWorkouts();
        renderCustomWorkouts();
    }
}

// ========================================
// HISTORY MANAGEMENT
// ========================================

function addToHistory(completed) {
    const history = {
        id: generateId(),
        date: new Date().toISOString(),
        protocolName: currentWorkout.name,
        duration: timerState.totalElapsedTime,
        completed: completed
    };
    
    workoutHistory.unshift(history);
    saveHistory();
}

function deleteHistory(id) {
    workoutHistory = workoutHistory.filter(h => h.id !== id);
    saveHistory();
    renderHistory();
}

// ========================================
// TIMER FUNCTIONS
// ========================================

function openTimerScreen(workout) {
    currentWorkout = workout;
    document.getElementById('timer-workout-name').textContent = workout.name;
    
    // Reset timer state
    timerState = {
        isRunning: false,
        isPaused: false,
        phase: 'prepare',
        timeRemaining: 5,
        currentSet: 1,
        currentRep: 0,
        totalElapsedTime: 0,
        interval: null
    };
    
    updateTimerDisplay();
    
    // Show start button, hide others
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('pause-button').classList.add('hidden');
    document.getElementById('resume-button').classList.add('hidden');
    document.getElementById('stop-button').classList.add('hidden');
    document.getElementById('done-button').classList.add('hidden');
    
    const screen = document.getElementById('timer-screen');
    screen.classList.remove('hidden', 'prepare', 'hang', 'rest', 'set-rest', 'finished');
    screen.classList.add('prepare');
}

function startTimer() {
    timerState.isRunning = true;
    timerState.isPaused = false;
    
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('pause-button').classList.remove('hidden');
    document.getElementById('stop-button').classList.remove('hidden');
    
    playBeep();
    runTimer();
}

function pauseTimer() {
    timerState.isPaused = true;
    clearInterval(timerState.interval);
    
    document.getElementById('pause-button').classList.add('hidden');
    document.getElementById('resume-button').classList.remove('hidden');
}

function resumeTimer() {
    timerState.isPaused = false;
    
    document.getElementById('resume-button').classList.add('hidden');
    document.getElementById('pause-button').classList.remove('hidden');
    
    runTimer();
}

function runTimer() {
    timerState.interval = setInterval(() => {
        timerState.totalElapsedTime++;
        timerState.timeRemaining--;
        
        // Beep on last 3 seconds
        if (timerState.timeRemaining <= 3 && timerState.timeRemaining > 0) {
            playBeep();
        }
        
        updateTimerDisplay();
        
        // Phase transition
        if (timerState.timeRemaining <= 0) {
            transitionPhase();
        }
    }, 1000);
}

function transitionPhase() {
    const w = currentWorkout;
    
    switch (timerState.phase) {
        case 'prepare':
            // Start first hang
            timerState.phase = 'hang';
            timerState.currentRep = 1;
            timerState.timeRemaining = w.hangTime;
            playBeep();
            break;
            
        case 'hang':
            // Check if we've completed all reps in this set
            if (timerState.currentRep >= w.sets) {
                // Check if we've completed all sets
                if (timerState.currentSet >= w.numberOfSets) {
                    finishWorkoutTimer();
                } else {
                    // Move to set rest
                    timerState.phase = 'set-rest';
                    timerState.timeRemaining = w.restBetweenSets;
                    playBeep();
                }
            } else {
                // Move to rest between reps
                timerState.phase = 'rest';
                timerState.timeRemaining = w.restTime;
                playBeep();
            }
            break;
            
        case 'rest':
            // Move to next hang
            timerState.currentRep++;
            timerState.phase = 'hang';
            timerState.timeRemaining = w.hangTime;
            playBeep();
            break;
            
        case 'set-rest':
            // Move to next set
            timerState.currentSet++;
            timerState.currentRep = 1;
            timerState.phase = 'hang';
            timerState.timeRemaining = w.hangTime;
            playBeep();
            break;
    }
    
    updateTimerDisplay();
}

function finishWorkoutTimer() {
    timerState.phase = 'finished';
    timerState.isRunning = false;
    clearInterval(timerState.interval);
    
    playFinishSound();
    updateTimerDisplay();
    
    // Show done button
    document.getElementById('pause-button').classList.add('hidden');
    document.getElementById('stop-button').classList.add('hidden');
    document.getElementById('done-button').classList.remove('hidden');
}

function updateTimerDisplay() {
    // Update timer display
    document.getElementById('timer-display').textContent = formatTime(timerState.timeRemaining);
    document.getElementById('total-time').textContent = formatTime(timerState.totalElapsedTime);
    
    // Update phase label
    const phaseLabels = {
        'prepare': 'GET READY',
        'hang': 'HANG',
        'rest': 'REST',
        'set-rest': 'SET REST',
        'finished': 'COMPLETE!'
    };
    document.getElementById('phase-label').textContent = phaseLabels[timerState.phase];
    
    // Update set/rep info
    document.getElementById('current-set').textContent = 
        `${timerState.currentSet}/${currentWorkout.numberOfSets}`;
    document.getElementById('current-rep').textContent = 
        `${timerState.currentRep}/${currentWorkout.sets}`;
    
    // Update background color
    const screen = document.getElementById('timer-screen');
    screen.className = `timer-screen ${timerState.phase}`;
}

function handleCloseTimer() {
    if (timerState.isRunning || timerState.totalElapsedTime > 0) {
        openExitModal();
    } else {
        closeTimerScreen();
    }
}

function handleStopTimer() {
    openExitModal();
}

function finishWorkout() {
    addToHistory(true);
    closeTimerScreen();
}

function closeTimerScreen() {
    clearInterval(timerState.interval);
    document.getElementById('timer-screen').classList.add('hidden');
    renderHistory();
}

// ========================================
// EXIT MODAL
// ========================================

function openExitModal() {
    pauseTimer();
    document.getElementById('exit-modal').classList.remove('hidden');
}

function closeExitModal() {
    document.getElementById('exit-modal').classList.add('hidden');
    if (timerState.isRunning && !timerState.isPaused) {
        resumeTimer();
    }
}

function confirmExit() {
    addToHistory(timerState.phase === 'finished');
    closeExitModal();
    closeTimerScreen();
}

// ========================================
// AUDIO
// ========================================

function playBeep() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playFinishSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function calculateTotalDuration(workout) {
    const singleSetTime = (workout.hangTime + workout.restTime) * workout.sets - workout.restTime;
    const allSetsTime = singleSetTime * workout.numberOfSets;
    const restsBetweenSets = workout.restBetweenSets * (workout.numberOfSets - 1);
    return allSetsTime + restsBetweenSets;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function findWorkout(id) {
    return PREBUILT_WORKOUTS.find(w => w.id === id) || 
           customWorkouts.find(w => w.id === id);
}
