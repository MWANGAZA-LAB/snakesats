// Test script for canvas size changes
// Run this in the browser console to validate the implementation

console.log('🧪 Testing Canvas Size Changes...');

// Test 1: Check if game instance exists
function testGameInstance() {
    console.log('Test 1: Checking game instance...');
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not found. Make sure the game is loaded.');
        return false;
    }
    console.log('✅ Game instance found');
    return true;
}

// Test 2: Check canvas size
function testCanvasSize() {
    console.log('Test 2: Checking canvas size...');
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.log('❌ Canvas element not found');
        return false;
    }
    
    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`Canvas CSS size: ${canvas.style.width || 'auto'} x ${canvas.style.height || 'auto'}`);
    
    // Check if canvas is larger than the old 400x400 size
    if (canvas.width >= 600 && canvas.height >= 600) {
        console.log('✅ Canvas size increased successfully (Desktop)');
    } else if (canvas.width >= 400 && canvas.height >= 400) {
        console.log('✅ Canvas size is appropriate for current screen size');
    } else {
        console.log('❌ Canvas size seems too small');
        return false;
    }
    
    return true;
}

// Test 3: Check grid size
function testGridSize() {
    console.log('Test 3: Checking grid size...');
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not available for grid test');
        return false;
    }
    
    const gridSize = window.gameInstance.gridSize;
    console.log(`Grid size: ${gridSize}x${gridSize}`);
    
    if (gridSize >= 20) {
        console.log('✅ Grid size is appropriate');
    } else {
        console.log('❌ Grid size seems too small');
        return false;
    }
    
    return true;
}

// Test 4: Check snake initialization
function testSnakeInitialization() {
    console.log('Test 4: Checking snake initialization...');
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not available for snake test');
        return false;
    }
    
    const snake = window.gameInstance.snake;
    const gridSize = window.gameInstance.gridSize;
    
    if (snake && snake.length > 0) {
        const head = snake[0];
        console.log(`Snake head position: (${head.x}, ${head.y})`);
        
        // Check if snake is within grid bounds
        if (head.x >= 0 && head.x < gridSize && head.y >= 0 && head.y < gridSize) {
            console.log('✅ Snake position is within grid bounds');
        } else {
            console.log('❌ Snake position is outside grid bounds');
            return false;
        }
    } else {
        console.log('❌ Snake not properly initialized');
        return false;
    }
    
    return true;
}

// Test 5: Check responsive behavior
function testResponsiveBehavior() {
    console.log('Test 5: Checking responsive behavior...');
    const canvas = document.getElementById('gameCanvas');
    const isMobile = window.innerWidth <= 768;
    
    console.log(`Screen width: ${window.innerWidth}px`);
    console.log(`Mobile detection: ${isMobile}`);
    
    if (isMobile) {
        console.log('📱 Mobile mode detected');
        if (canvas.width <= window.innerWidth) {
            console.log('✅ Canvas fits mobile screen');
        } else {
            console.log('❌ Canvas too large for mobile');
            return false;
        }
    } else {
        console.log('🖥️ Desktop mode detected');
        if (canvas.width >= 600) {
            console.log('✅ Desktop canvas size is large enough');
        } else {
            console.log('❌ Desktop canvas size too small');
            return false;
        }
    }
    
    return true;
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting Canvas Size Tests...\n');
    
    const tests = [
        testGameInstance,
        testCanvasSize,
        testGridSize,
        testSnakeInitialization,
        testResponsiveBehavior
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    tests.forEach((test, index) => {
        console.log(`\n--- Test ${index + 1} ---`);
        if (test()) {
            passedTests++;
        }
    });
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Canvas size changes are working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Please check the implementation.');
    }
}

// Make the test function globally available
window.testCanvasSize = runAllTests;

console.log('Test script loaded. Run testCanvasSize() in the console to test the implementation.');
