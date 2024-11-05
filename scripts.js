// Example of an interactive feature
document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('.graphic-section img');
    img.addEventListener('mouseover', function() {
        img.style.transform = 'scale(1.1)';
        img.style.transition = 'transform 0.3s';
    });
    img.addEventListener('mouseout', function() {
        img.style.transform = 'scale(1)';
    });
});
