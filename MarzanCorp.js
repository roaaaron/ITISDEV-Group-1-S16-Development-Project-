document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById("introVideo");

    // When the video ends, hide the video overlay and show the main content
    video.onended = function() {
        document.querySelector(".video-overlay").style.display = "none";
        document.querySelector(".main").style.display = "block";
    };
});

// Intersection Observer for elements with the 'hidden' class
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

// Select all elements with the 'hidden' class and observe them
const hiddenElem = document.querySelectorAll('.hidden');
hiddenElem.forEach((el) => observer.observe(el));
