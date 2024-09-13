document.getElementById("greeting").addEventListener('click', function() {
    greeting.classList.toggle("active");
        if (greeting) {
            greeting.style.backgroundColor == "rgb(92, 214, 92)";
        } else {
            greeting.style.backgroundColor = "rgb(209,71,202)";
        }
});