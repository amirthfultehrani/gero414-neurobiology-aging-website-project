// File: public/scripts/menu.js

/**
 * Manages the state and accessibility attributes of the mobile navigation menu.
 * Handles toggling visibility, animations, closing on link clicks,
 * closing on outside clicks, and closing via the Escape key.
 * Relies on CSS classes defined in Navigation.astro for animations and visibility.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve essential DOM elements for menu interaction.
  const hamburgerButton = document.getElementById('hamburger-button');
  const navLinks = document.getElementById('nav-links'); // The container for mobile navigation links.

  // Defensive check: Ensure required elements are present before proceeding.
  if (!hamburgerButton || !navLinks) {
    console.error("Error initializing menu.js: Hamburger button (#hamburger-button) or Nav links container (#nav-links) not found in the DOM.");
    return; // Stop execution if elements are missing.
  }

  /**
   * Toggles the mobile menu's visibility and updates ARIA attributes.
   * Manages CSS classes to trigger open/close animations.
   */
  function toggleMenu() {
    // Determine if the menu is currently closed (visually hidden).
    const isCurrentlyHidden = navLinks.classList.contains('hidden');

    if (isCurrentlyHidden) {
      // --- Open Menu ---
      // Remove 'hidden' to make the element part of the layout flow.
      navLinks.classList.remove('hidden');

      // Delay applying animation classes until the next frame.
      // This ensures the browser registers the element as visible *before* starting the transition, preventing animation glitches.
      requestAnimationFrame(() => {
        navLinks.classList.remove('opacity-0', '-translate-y-2'); // Remove initial hidden state classes.
        navLinks.classList.add('opacity-100', 'translate-y-0'); // Apply final visible state classes.
      });

      // Update ARIA attribute to indicate the menu is expanded.
      hamburgerButton.setAttribute('aria-expanded', 'true');

    } else {
      // --- Close Menu ---
      // Apply classes to initiate the closing animation.
      navLinks.classList.remove('opacity-100', 'translate-y-0');
      navLinks.classList.add('opacity-0', '-translate-y-2');

      // Update ARIA attribute to indicate the menu is collapsed.
      hamburgerButton.setAttribute('aria-expanded', 'false');

      // Define a function to add 'hidden' class *after* the CSS transition completes.
      const handleTransitionEnd = () => {
        // Check again if the menu should be hidden (prevents race conditions if toggled rapidly).
        if (hamburgerButton.getAttribute('aria-expanded') === 'false') {
          navLinks.classList.add('hidden'); // Add display: none equivalent.
        }
        // Clean up: Remove this listener after it executes once to prevent memory leaks.
        navLinks.removeEventListener('transitionend', handleTransitionEnd);
      };

      // Attach the event listener to wait for the transition to finish.
      navLinks.addEventListener('transitionend', handleTransitionEnd);
    }
  }

  // --- Initial State Setup ---
  // Set the initial ARIA state for the hamburger button.
  hamburgerButton.setAttribute('aria-expanded', 'false');
  // Ensure the navigation links container is hidden and styled for the start of the opening animation.
  navLinks.classList.add('hidden', 'opacity-0', '-translate-y-2');

  // --- Event Listeners ---

  // Toggle menu when the hamburger button is clicked.
  hamburgerButton.addEventListener('click', toggleMenu);

  // Add listeners to each link within the mobile menu.
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      // Check if the menu is currently visible.
      const isMobileMenuVisible = !navLinks.classList.contains('hidden');
      // Define the breakpoint (Tailwind 'md') to determine if in mobile view.
      const isMobileView = window.innerWidth < 768;

      // Close the menu only if it's visible and the screen is mobile-sized.
      // This prevents closing the *desktop* menu if the same link structure were used.
      if (isMobileMenuVisible && isMobileView) {
        toggleMenu(); // Execute the close menu logic.
      }
      // Default link navigation behavior is allowed to proceed.
    });
  });

  // Add listener to the document to detect clicks outside the menu.
  document.addEventListener('click', (event) => {
    // Check if the menu is currently visible.
    const isMobileMenuVisible = !navLinks.classList.contains('hidden');
    // Cache the click target for efficiency.
    const target = event.target;

    // Check if the click target is a valid node and is outside both the button and the nav links container.
    if ( isMobileMenuVisible &&
         target instanceof Node &&
         hamburgerButton && !hamburgerButton.contains(target) && // Click was not on the button or its children.
         navLinks && !navLinks.contains(target) // Click was not on the nav links container or its children.
       ) {
      toggleMenu(); // Close the menu.
    }
  });

  // Add listener for the 'Escape' key to close the menu.
  document.addEventListener('keydown', (event) => {
    // Proceed only if the pressed key is 'Escape'.
    if (event.key === 'Escape') {
      // Check if the menu is currently visible.
      const isMobileMenuVisible = !navLinks.classList.contains('hidden');
      if (isMobileMenuVisible) {
        toggleMenu(); // Close the menu.
        // Improve accessibility by returning focus to the button that opened the menu.
        hamburgerButton?.focus();
      }
    }
  });
});