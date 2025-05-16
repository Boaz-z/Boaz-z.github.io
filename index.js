let a = 0; //mouse not on logo
let b = 0; //.start not active

const input = document.getElementById("input");
const submit = document.querySelector(".search input[type=submit]");
const navbar = document.querySelector("nav");
const divup = document.querySelector("div ul up");

window.addEventListener("load", function () {
    //add .start on load
    submit.classList.add("inactive");
    navbar.classList.add("start");
    divup.classList.add("hiddenup");
    b = 1;

    setTimeout(() => { 
        navbar.classList.remove("start"); 
        b = 0;
    }, 5000); // Remove .start after 5 seconds
});

window.addEventListener("scroll", function () {

    if (window.scrollY > 0 && b === 1) { 
        //if scroll and .start is active, remove it
        navbar.classList.remove("start");
        b = 0;
    }

    if (window.scrollY > 475 && b === 0) { //up button removed when scrollpos > 475px
        divup.classList.remove("hiddenup");
    } else {
        divup.classList.add("hiddenup");
    }

    if (window.scrollY > 475 && a === 0 && b === 0) { //if scrollpos > 475px, mouse isn't on logo and .start isn't active
        navbar.classList.add("hiddennav");
    } else {
        navbar.classList.remove("hiddennav");
    }

});

    navbar.addEventListener("mouseenter", function () { //if hover on logo, remove .hiddennav
        a = 1
            navbar.classList.remove("hiddennav")
    });
    
    navbar.addEventListener("mouseleave", function () { //if no longer hovering on logo and scrollpos > 476px, add hiddennav
        a = 0
        if (window.scrollY > 476) {
            navbar.classList.add("hiddennav")
        }
    });

input.addEventListener("input", () => {
  if (input.value.trim() === "") {
    submit.classList.add("inactive");
  } else {
    submit.classList.remove("inactive");
  }
});