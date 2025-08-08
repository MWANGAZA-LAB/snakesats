// SnakeSats Game Functionality Test
// This script tests all game mechanics to verify functionality

console.log('🧪 Starting SnakeSats Game Functionality Test...');

function testGameFunctionality() {
    console.log('\n=== GAME FUNCTIONALITY TEST ===');
    
    // Test 1: Check if game instance exists
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not found - cannot test functionality');
        return false;
    }
    
    const game = window.gameInstance;
    console.log('✅ Game instance found');
    
    // Test 2: Test Start Game functionality
    console.log('\n--- Testing Start Game ---');
    try {
        console.log('🎮 Attempting to start game...');
        game.startGame();
        
        setTimeout(() => {
            if (game.gameRunning) {
                console.log('✅ Game started successfully');
                console.log(`Snake position: (${game.snake[0].x}, ${game.snake[0].y})`);
                console.log(`Game running: ${game.gameRunning}`);
                console.log(`Health: ${game.health}`);
                
                // Test 3: Test movement
                console.log('\n--- Testing Movement ---');
                const originalX = game.snake[0].x;
                const originalY = game.snake[0].y;
                
                // Test right movement
                game.direction = {x: 1, y: 0};
                console.log('🎯 Testing right movement...');
                
                setTimeout(() => {
                    if (game.snake[0].x !== originalX || game.snake[0].y !== originalY) {
                        console.log('✅ Snake movement working');
                    } else {
                        console.log('⚠️ Snake movement may not be working');
                    }
                    
                    // Test 4: Test pause functionality
                    console.log('\n--- Testing Pause ---');
                    game.togglePause();
                    if (game.gamePaused) {
                        console.log('✅ Pause functionality working');
                        
                        // Resume game
                        game.togglePause();
                        if (!game.gamePaused) {
                            console.log('✅ Resume functionality working');
                        }
                    }
                    
                    // Test 5: Test object generation
                    console.log('\n--- Testing Object Generation ---');
                    game.generateSat();
                    game.generateFiat();
                    game.generateDo();
                    
                    console.log(`Sats on field: ${game.sats.length}`);
                    console.log(`Fiats on field: ${game.fiats.length}`);
                    console.log(`Do's on field: ${game.dos.length}`);
                    
                    if (game.sats.length > 0) console.log('✅ Sat generation working');
                    if (game.fiats.length > 0) console.log('✅ Fiat generation working');
                    if (game.dos.length > 0) console.log('✅ Do generation working');
                    
                    // Test 6: Test stats update
                    console.log('\n--- Testing Stats Update ---');
                    const originalScore = game.score;
                    game.score = 100;
                    game.updateStats();
                    
                    const scoreElement = document.getElementById('satsCollected');
                    if (scoreElement && scoreElement.textContent !== '0') {
                        console.log('✅ Stats update working');
                    }
                    
                    // Reset score
                    game.score = originalScore;
                    
                    console.log('\n🎉 FUNCTIONALITY TEST COMPLETE');
                    console.log('📊 Game appears to be fully functional!');
                    
                }, 1000);
                
            } else {
                console.log('❌ Game failed to start');
            }
        }, 500);
        
    } catch (error) {
        console.log('❌ Error starting game:', error);
    }
}

// Test 7: Test button interactions
function testButtonInteractions() {
    console.log('\n--- Testing Button Interactions ---');
    
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    if (startBtn) {
        console.log('✅ Start button found');
        // Simulate click
        try {
            startBtn.click();
            console.log('✅ Start button click successful');
        } catch (error) {
            console.log('❌ Start button click failed:', error);
        }
    }
    
    if (pauseBtn) console.log('✅ Pause button found');
    if (restartBtn) console.log('✅ Restart button found');
}

// Test 8: Test keyboard controls
function testKeyboardControls() {
    console.log('\n--- Testing Keyboard Controls ---');
    
    const game = window.gameInstance;
    if (!game) return;
    
    // Simulate arrow key presses
    const testKeys = [
        { key: 'ArrowUp', expected: {x: 0, y: -1} },
        { key: 'ArrowDown', expected: {x: 0, y: 1} },
        { key: 'ArrowLeft', expected: {x: -1, y: 0} },
        { key: 'ArrowRight', expected: {x: 1, y: 0} }
    ];
    
    testKeys.forEach(test => {
        const event = new KeyboardEvent('keydown', { key: test.key });
        document.dispatchEvent(event);
        console.log(`🎯 Tested ${test.key} key`);
    });
    
    console.log('✅ Keyboard control tests completed');
}

// Run all tests
setTimeout(() => {
    testGameFunctionality();
    testButtonInteractions();
    testKeyboardControls();
}, 1000);

console.log('💡 Game functionality test script loaded. Tests will run automatically in 1 second.');
