// Manual Game Test - Verify SnakeSats functionality
console.log('🎮 Starting Manual Game Test...');

function testGameManually() {
    // Wait for game instance to be available
    if (!window.gameInstance) {
        console.log('❌ Game instance not found');
        return;
    }
    
    console.log('✅ Game instance found');
    console.log('📊 Initial game state:', {
        gameRunning: window.gameInstance.gameRunning,
        direction: window.gameInstance.direction,
        snakePosition: window.gameInstance.snake[0],
        health: window.gameInstance.health
    });
    
    // Test start game
    console.log('🎮 Testing start game...');
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.click();
        console.log('✅ Start button clicked');
        
        setTimeout(() => {
            console.log('📊 Game state after start:', {
                gameRunning: window.gameInstance.gameRunning,
                direction: window.gameInstance.direction,
                snakePosition: window.gameInstance.snake[0],
                health: window.gameInstance.health,
                satsCount: window.gameInstance.sats.length
            });
            
            // Test keyboard input
            console.log('⌨️ Testing keyboard controls...');
            
            // Simulate arrow key press
            const rightKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39
            });
            document.dispatchEvent(rightKeyEvent);
            console.log('🎯 Sent ArrowRight key');
            
            setTimeout(() => {
                console.log('📊 Game state after key press:', {
                    direction: window.gameInstance.direction,
                    gameRunning: window.gameInstance.gameRunning
                });
                
                console.log('🎉 Manual test completed!');
            }, 100);
            
        }, 500);
    } else {
        console.log('❌ Start button not found');
    }
}

// Run test when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(testGameManually, 1000);
    });
} else {
    setTimeout(testGameManually, 1000);
}
