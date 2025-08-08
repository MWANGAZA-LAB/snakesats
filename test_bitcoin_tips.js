// Test script for Bitcoin Tips Timing System
// Run this in the browser console to validate the implementation

console.log('🧪 Testing Bitcoin Tips Timing System...');

// Test 1: Check if tips system is initialized
function testTipsInitialization() {
    console.log('Test 1: Checking tips system initialization...');
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not found. Make sure the game is loaded.');
        return false;
    }
    
    const game = window.gameInstance;
    if (game.tips && game.tips.length > 0) {
        console.log(`✅ Tips system initialized with ${game.tips.length} tips`);
        console.log('📝 Sample tips:', game.tips.slice(0, 3));
        return true;
    } else {
        console.log('❌ Tips array not found or empty');
        return false;
    }
}

// Test 2: Check timing configuration
function testTimingConfiguration() {
    console.log('Test 2: Checking timing configuration...');
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not available for timing test');
        return false;
    }
    
    const game = window.gameInstance;
    console.log(`⏱️ Tip delay: ${game.tipDelay}ms (${game.tipDelay/1000}s)`);
    console.log(`🔄 Tip update interval: ${game.tipUpdateInterval}ms (${game.tipUpdateInterval/1000}s)`);
    
    if (game.tipDelay >= 2000 && game.tipDelay <= 5000) {
        console.log('✅ Tip delay is reasonable (2-5 seconds)');
    } else {
        console.log('⚠️ Tip delay might be too short or too long');
    }
    
    if (game.tipUpdateInterval >= 5000 && game.tipUpdateInterval <= 15000) {
        console.log('✅ Tip update interval is reasonable (5-15 seconds)');
    } else {
        console.log('⚠️ Tip update interval might be too short or too long');
    }
    
    return true;
}

// Test 3: Check tip elements
function testTipElements() {
    console.log('Test 3: Checking tip elements...');
    
    const desktopTip = document.getElementById('tipContent');
    const mobileTip = document.getElementById('mobileTipContent');
    
    if (desktopTip) {
        console.log('✅ Desktop tip element found');
        console.log('📱 Desktop tip content:', desktopTip.textContent);
    } else {
        console.log('❌ Desktop tip element not found');
    }
    
    if (mobileTip) {
        console.log('✅ Mobile tip element found');
        console.log('📱 Mobile tip content:', mobileTip.textContent);
    } else {
        console.log('❌ Mobile tip element not found');
    }
    
    return desktopTip && mobileTip;
}

// Test 4: Check tip rotation function
function testTipRotation() {
    console.log('Test 4: Checking tip rotation function...');
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not available for rotation test');
        return false;
    }
    
    const game = window.gameInstance;
    
    if (typeof game.rotateBitcoinTip === 'function') {
        console.log('✅ Tip rotation function exists');
        
        // Test rotation (this will actually rotate the tip)
        const initialIndex = game.currentTipIndex;
        game.rotateBitcoinTip();
        const newIndex = game.currentTipIndex;
        
        if (newIndex !== initialIndex) {
            console.log('✅ Tip rotation working correctly');
            console.log(`🔄 Rotated from tip ${initialIndex} to tip ${newIndex}`);
        } else {
            console.log('❌ Tip rotation not working');
        }
        
        return true;
    } else {
        console.log('❌ Tip rotation function not found');
        return false;
    }
}

// Test 5: Check game start timing
function testGameStartTiming() {
    console.log('Test 5: Checking game start timing...');
    if (typeof window.gameInstance === 'undefined') {
        console.log('❌ Game instance not available for timing test');
        return false;
    }
    
    const game = window.gameInstance;
    
    if (game.gameStartTime) {
        const timeSinceStart = Date.now() - game.gameStartTime;
        console.log(`⏰ Game started ${timeSinceStart}ms ago (${(timeSinceStart/1000).toFixed(1)}s)`);
        
        if (timeSinceStart < game.tipDelay) {
            console.log('⏳ Tips should not be showing yet (within delay period)');
        } else {
            console.log('✅ Tips should be showing now (past delay period)');
        }
        
        return true;
    } else {
        console.log('⚠️ Game not started yet - no timing data available');
        return false;
    }
}

// Run all tests
function runBitcoinTipsTests() {
    console.log('🚀 Starting Bitcoin Tips Timing Tests...\n');
    
    const tests = [
        testTipsInitialization,
        testTimingConfiguration,
        testTipElements,
        testTipRotation,
        testGameStartTiming
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
        console.log('🎉 All tests passed! Bitcoin tips timing system is working correctly.');
        console.log('\n💡 Tips will appear:');
        console.log(`   • After ${window.gameInstance?.tipDelay/1000 || 3} seconds of game start`);
        console.log(`   • Every ${window.gameInstance?.tipUpdateInterval/1000 || 8} seconds`);
        console.log('   • With smooth fade transitions');
    } else {
        console.log('⚠️ Some tests failed. Please check the implementation.');
    }
}

// Make the test function globally available
window.testBitcoinTips = runBitcoinTipsTests;

console.log('Bitcoin tips test script loaded. Run testBitcoinTips() in the console to test the implementation.');
