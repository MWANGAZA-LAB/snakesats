// Comprehensive Diagnostic Test for SnakeSats Game
// Run this in the browser console to identify issues

console.log('🔍 Starting SnakeSats Diagnostic Test...');

// Test 1: Check if all required files are loaded
function testFileLoading() {
    console.log('\n=== Test 1: File Loading ===');
    
    const requiredFiles = ['game.js', 'styles.css', 'test_canvas_size.js', 'test_bitcoin_tips.js'];
    let allFilesLoaded = true;
    
    requiredFiles.forEach(file => {
        const link = document.querySelector(`link[href="${file}"], script[src="${file}"]`);
        if (link) {
            console.log(`✅ ${file} - Found in DOM`);
        } else {
            console.log(`❌ ${file} - NOT found in DOM`);
            allFilesLoaded = false;
        }
    });
    
    return allFilesLoaded;
}

// Test 2: Check DOM elements
function testDOMElements() {
    console.log('\n=== Test 2: DOM Elements ===');
    
    const requiredElements = [
        'gameCanvas',
        'startBtn',
        'pauseBtn', 
        'restartBtn',
        'gameMessage',
        'tipContent',
        'mobileTipContent'
    ];
    
    let allElementsFound = true;
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id} - Found`);
        } else {
            console.log(`❌ ${id} - NOT found`);
            allElementsFound = false;
        }
    });
    
    return allElementsFound;
}

// Test 3: Check JavaScript errors
function testJavaScriptErrors() {
    console.log('\n=== Test 3: JavaScript Errors ===');
    
    // Check if game instance exists
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not found');
        return false;
    }
    
    console.log('✅ Game instance found');
    
    // Check if game class is properly defined
    if (typeof SnakeSats === 'undefined') {
        console.log('❌ SnakeSats class not defined');
        return false;
    }
    
    console.log('✅ SnakeSats class defined');
    
    // Check canvas context
    const game = window.gameInstance;
    if (!game.canvas) {
        console.log('❌ Canvas not found in game instance');
        return false;
    }
    
    if (!game.ctx) {
        console.log('❌ Canvas context not found');
        return false;
    }
    
    console.log('✅ Canvas and context found');
    console.log(`Canvas size: ${game.canvas.width}x${game.canvas.height}`);
    
    return true;
}

// Test 4: Check game initialization
function testGameInitialization() {
    console.log('\n=== Test 4: Game Initialization ===');
    
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Cannot test initialization - game instance not found');
        return false;
    }
    
    const game = window.gameInstance;
    
    // Check game state
    console.log(`Game running: ${game.gameRunning}`);
    console.log(`Game paused: ${game.gamePaused}`);
    console.log(`Score: ${game.score}`);
    console.log(`Level: ${game.level}`);
    console.log(`Health: ${game.health}`);
    
    // Check if canvas is properly set up
    if (game.canvas.width === 0 || game.canvas.height === 0) {
        console.log('❌ Canvas has zero dimensions');
        return false;
    }
    
    console.log('✅ Canvas dimensions are valid');
    
    // Check if snake is initialized
    if (!game.snake || game.snake.length === 0) {
        console.log('❌ Snake not initialized');
        return false;
    }
    
    console.log(`✅ Snake initialized with ${game.snake.length} segments`);
    
    return true;
}

// Test 5: Check event listeners
function testEventListeners() {
    console.log('\n=== Test 5: Event Listeners ===');
    
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    if (!startBtn) {
        console.log('❌ Start button not found');
        return false;
    }
    
    // Check if buttons are properly configured
    console.log(`Start button disabled: ${startBtn.disabled}`);
    console.log(`Pause button disabled: ${pauseBtn?.disabled}`);
    console.log(`Restart button disabled: ${restartBtn?.disabled}`);
    
    // Check if buttons have click handlers
    const startHandler = startBtn.onclick;
    if (!startHandler) {
        console.log('❌ Start button has no click handler');
        return false;
    }
    
    console.log('✅ Start button has click handler');
    
    return true;
}

// Test 6: Check CSS loading
function testCSSLoading() {
    console.log('\n=== Test 6: CSS Loading ===');
    
    const stylesheet = document.querySelector('link[href="styles.css"]');
    if (!stylesheet) {
        console.log('❌ styles.css not found in DOM');
        return false;
    }
    
    console.log('✅ styles.css found in DOM');
    
    // Check if CSS is loaded
    if (stylesheet.sheet) {
        console.log('✅ CSS stylesheet loaded');
        return true;
    } else {
        console.log('❌ CSS stylesheet not loaded');
        return false;
    }
}

// Test 7: Check mobile detection
function testMobileDetection() {
    console.log('\n=== Test 7: Mobile Detection ===');
    
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Cannot test mobile detection - game instance not found');
        return false;
    }
    
    const game = window.gameInstance;
    console.log(`Is mobile: ${game.isMobile}`);
    console.log(`Screen width: ${window.innerWidth}px`);
    console.log(`Screen height: ${window.innerHeight}px`);
    
    return true;
}

// Test 8: Check Bitcoin tips system
function testBitcoinTips() {
    console.log('\n=== Test 8: Bitcoin Tips System ===');
    
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Cannot test tips system - game instance not found');
        return false;
    }
    
    const game = window.gameInstance;
    
    if (!game.tips || game.tips.length === 0) {
        console.log('❌ Tips array not found or empty');
        return false;
    }
    
    console.log(`✅ Tips system initialized with ${game.tips.length} tips`);
    console.log(`Tip delay: ${game.tipDelay}ms`);
    console.log(`Tip interval: ${game.tipUpdateInterval}ms`);
    
    return true;
}

// Test 9: Check sound system
function testSoundSystem() {
    console.log('\n=== Test 9: Sound System ===');
    
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Cannot test sound system - game instance not found');
        return false;
    }
    
    const game = window.gameInstance;
    
    console.log(`Sound enabled: ${game.soundEnabled}`);
    console.log(`Music enabled: ${game.musicEnabled}`);
    
    if (game.audioContext) {
        console.log('✅ Audio context initialized');
    } else {
        console.log('⚠️ Audio context not initialized (may be normal)');
    }
    
    return true;
}

// Test 10: Check browser compatibility
function testBrowserCompatibility() {
    console.log('\n=== Test 10: Browser Compatibility ===');
    
    console.log(`User agent: ${navigator.userAgent}`);
    console.log(`Canvas support: ${!!document.createElement('canvas').getContext}`);
    console.log(`LocalStorage support: ${!!window.localStorage}`);
    console.log(`AudioContext support: ${!!window.AudioContext || !!window.webkitAudioContext}`);
    
    // Check for common issues
    const issues = [];
    
    if (!document.createElement('canvas').getContext) {
        issues.push('Canvas not supported');
    }
    
    if (!window.localStorage) {
        issues.push('LocalStorage not supported');
    }
    
    if (issues.length === 0) {
        console.log('✅ Browser compatibility is good');
        return true;
    } else {
        console.log('❌ Browser compatibility issues:', issues);
        return false;
    }
}

// Run all diagnostic tests
function runDiagnostics() {
    console.log('🚀 Starting Comprehensive SnakeSats Diagnostics...\n');
    
    const tests = [
        { name: 'File Loading', test: testFileLoading },
        { name: 'DOM Elements', test: testDOMElements },
        { name: 'JavaScript Errors', test: testJavaScriptErrors },
        { name: 'Game Initialization', test: testGameInitialization },
        { name: 'Event Listeners', test: testEventListeners },
        { name: 'CSS Loading', test: testCSSLoading },
        { name: 'Mobile Detection', test: testMobileDetection },
        { name: 'Bitcoin Tips', test: testBitcoinTips },
        { name: 'Sound System', test: testSoundSystem },
        { name: 'Browser Compatibility', test: testBrowserCompatibility }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    const results = [];
    
    tests.forEach((testObj, index) => {
        console.log(`\n--- ${testObj.name} (${index + 1}/${totalTests}) ---`);
        try {
            if (testObj.test()) {
                passedTests++;
                results.push(`✅ ${testObj.name}`);
            } else {
                results.push(`❌ ${testObj.name}`);
            }
        } catch (error) {
            console.log(`❌ Error in ${testObj.name}:`, error);
            results.push(`❌ ${testObj.name} (Error)`);
        }
    });
    
    console.log('\n📊 DIAGNOSTIC RESULTS:');
    console.log(`Passed: ${passedTests}/${totalTests}`);
    console.log(`Failed: ${totalTests - passedTests}/${totalTests}`);
    
    console.log('\n📋 DETAILED RESULTS:');
    results.forEach(result => console.log(result));
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! Game should be working properly.');
        console.log('If the game still doesn\'t start, check the browser console for errors.');
    } else {
        console.log('\n⚠️ Some tests failed. Check the issues above.');
        console.log('Common solutions:');
        console.log('1. Refresh the page');
        console.log('2. Clear browser cache');
        console.log('3. Check browser console for JavaScript errors');
        console.log('4. Ensure all files are properly loaded');
    }
    
    return passedTests === totalTests;
}

// Make diagnostic function globally available
window.runSnakeSatsDiagnostics = runDiagnostics;

console.log('Diagnostic script loaded. Run runSnakeSatsDiagnostics() in the console to test the game.');
