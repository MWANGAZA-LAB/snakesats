// Quick Verification Script for SnakeSats Game
// Run this immediately to check current game status

console.log('🔍 Quick SnakeSats Verification...');

// Immediate checks
function quickVerification() {
    console.log('\n=== QUICK VERIFICATION RESULTS ===');
    
    // Check 1: Game instance
    if (typeof window.gameInstance !== 'undefined') {
        console.log('✅ Game instance exists');
        
        const game = window.gameInstance;
        
        // Check 2: Canvas
        if (game.canvas && game.canvas.width > 0) {
            console.log(`✅ Canvas: ${game.canvas.width}x${game.canvas.height}`);
        } else {
            console.log('❌ Canvas issue detected');
        }
        
        // Check 3: Speed level
        if (game.maxSpeedLevel === 21) {
            console.log('✅ Speed level correctly set to 21');
        } else {
            console.log(`❌ Speed level issue: ${game.maxSpeedLevel}`);
        }
        
        // Check 4: Bitcoin tips
        if (game.tips && game.tips.length > 0) {
            console.log(`✅ Bitcoin tips: ${game.tips.length} tips loaded`);
        } else {
            console.log('❌ Bitcoin tips not loaded');
        }
        
        // Check 5: Game state
        console.log(`Game running: ${game.gameRunning}`);
        console.log(`Game paused: ${game.gamePaused}`);
        console.log(`Current speed: ${game.currentSpeed}ms`);
        console.log(`Speed level: ${game.speedLevel}/21`);
        
    } else {
        console.log('❌ Game instance not found - critical issue!');
    }
    
    // Check 6: DOM elements
    const criticalElements = ['gameCanvas', 'startBtn', 'currentSpeed'];
    let domIssues = 0;
    
    criticalElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id} found`);
        } else {
            console.log(`❌ ${id} missing`);
            domIssues++;
        }
    });
    
    // Check 7: Speed display
    const speedElement = document.getElementById('currentSpeed');
    if (speedElement) {
        const speedText = speedElement.textContent;
        if (speedText.includes('21')) {
            console.log('✅ Speed display shows correct max level (21)');
        } else {
            console.log(`❌ Speed display issue: ${speedText}`);
        }
    }
    
    // Check 8: Console errors
    console.log('\n=== CONSOLE ERROR CHECK ===');
    console.log('Check browser console for any red error messages');
    
    // Summary
    console.log('\n=== VERIFICATION SUMMARY ===');
    if (typeof window.gameInstance !== 'undefined' && domIssues === 0) {
        console.log('🎉 Game appears to be working correctly!');
        console.log('💡 Try starting the game to test full functionality');
    } else {
        console.log('⚠️ Issues detected - check details above');
    }
}

// Auto-run verification
quickVerification();

// Make function available globally
window.quickVerification = quickVerification;

console.log('\n💡 Run quickVerification() anytime to check game status');
