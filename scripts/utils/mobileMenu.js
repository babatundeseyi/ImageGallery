//Menuvariables declaration
const menuControl = document.querySelector('.js-menu-control');
const menuContainer = document.querySelector('.js-menu-container');
const mobileNav = document.querySelector('.js-mobile-nav');

export function renderMobileMenu() {
    /* Event listener for the menu icon with conditional if-else statement. checks which menu is currently being displayed and performs an action based on it */
  menuControl.addEventListener('click', () => {
    /* this open the menu when the menu icon is clicked */
    if (menuControl.innerText === "menu") {
      openMenu();
    } else if (menuControl.innerText === "close") {
      closeMenu();
    } /* this closes the menu when the close icon is clicked */
  });

  /* this event listener closes the menu when nav links are clicked, before navigating */
  menuContainer.addEventListener('click', () => {
    closeMenu();
  });

  function openMenu () {
    menuControl.innerText = "close";
    mobileNav.classList.add("is-open");
    document.body.classList.add("menu-open");
    menuContainer.style.display ="flex";
  }

  function closeMenu () {
    menuControl.innerText = "menu";
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuContainer.style.display ="none";
  }
}