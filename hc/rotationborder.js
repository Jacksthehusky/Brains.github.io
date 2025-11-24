document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('rotatingButton');
    const circleMover = document.getElementById('circleMover');
    
    // Show the circle container for midnight theme
    const circleContainer = button.querySelector('.styles_circleContainer__JKTvt');
    circleContainer.style.display = 'block';
    
    let animationFrameId = null;
    let angle = 0;
    
    function startRotation() {
        const buttonRect = button.getBoundingClientRect();
        const centerX = buttonRect.width / 2 - 40;
        const centerY = buttonRect.height / 2 + 5 ;
        const radius = Math.max(buttonRect.width, buttonRect.height) / 2; 
        
        function rotate() {
            angle += 0.02; // Rotation speed
            if (angle > Math.PI * 2) angle = 0;
            
            const x = centerX + Math.cos(angle) * radius + 40;
            const y = centerY + Math.sin(angle) * radius / 2 - 5; // Adjust for circle size
            
            circleMover.style.transform = `translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;
            
            animationFrameId = requestAnimationFrame(rotate);
        }
        
        rotate();
    }
    
    function stopRotation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
    
    // Start rotation automatically
    startRotation();
    
    // Optional: Restart rotation if window resizes
    window.addEventListener('resize', function() {
        stopRotation();
        startRotation();
    });
});