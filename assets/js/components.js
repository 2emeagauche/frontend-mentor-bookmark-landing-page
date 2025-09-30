/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   tabs-automatic.js
 *
 *   Desc:   Tablist widget that implements ARIA Authoring Practices
 */

'use strict';

class TabsAutomatic {
  constructor(groupNode) {
    this.tablistNode = groupNode;

    this.tabs = [];

    this.firstTab = null;
    this.lastTab = null;

    this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
    this.tabpanels = [];

    for (var i = 0; i < this.tabs.length; i += 1) {
      var tab = this.tabs[i];
      var tabpanel = document.getElementById(tab.getAttribute('aria-controls'));

      tab.tabIndex = -1;
      tab.setAttribute('aria-selected', 'false');
      this.tabpanels.push(tabpanel);

      tab.addEventListener('keydown', this.onKeydown.bind(this));
      tab.addEventListener('click', this.onClick.bind(this));

      if (!this.firstTab) {
        this.firstTab = tab;
      }
      this.lastTab = tab;
    }

    this.setSelectedTab(this.firstTab, false);
  }

  setSelectedTab(currentTab, setFocus) {
    if (typeof setFocus !== 'boolean') {
      setFocus = true;
    }
    for (var i = 0; i < this.tabs.length; i += 1) {
      var tab = this.tabs[i];
      if (currentTab === tab) {
        tab.setAttribute('aria-selected', 'true');
        tab.removeAttribute('tabindex');
        this.tabpanels[i].removeAttribute('hidden');
        if (setFocus) {
          tab.focus();
        }
      } else {
        tab.setAttribute('aria-selected', 'false');
        tab.tabIndex = -1;
        this.tabpanels[i].setAttribute('hidden', 'true');
      }
    }
  }

  setSelectedToPreviousTab(currentTab) {
    var index;

    if (currentTab === this.firstTab) {
      this.setSelectedTab(this.lastTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.setSelectedTab(this.tabs[index - 1]);
    }
  }

  setSelectedToNextTab(currentTab) {
    var index;

    if (currentTab === this.lastTab) {
      this.setSelectedTab(this.firstTab);
    } else {
      index = this.tabs.indexOf(currentTab);
      this.setSelectedTab(this.tabs[index + 1]);
    }
  }

  /* EVENT HANDLERS */

  onKeydown(event) {
    var tgt = event.currentTarget,
      flag = false;

    switch (event.key) {
      case 'ArrowLeft':
        this.setSelectedToPreviousTab(tgt);
        flag = true;
        break;

      case 'ArrowRight':
        this.setSelectedToNextTab(tgt);
        flag = true;
        break;

      case 'Home':
        this.setSelectedTab(this.firstTab);
        flag = true;
        break;

      case 'End':
        this.setSelectedTab(this.lastTab);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onClick(event) {
    this.setSelectedTab(event.currentTarget);
  }
}

// Initialize components

document.addEventListener("DOMContentLoaded", function () {

  // Initialize tabs component

  const tablists = document.querySelectorAll('[role=tablist].js-automatic');
  for (let i = 0; i < tablists.length; i++) {
    new TabsAutomatic(tablists[i]);
  }


  // Deal with the Accordion

  const accordionQuestions = document.querySelectorAll(".question");

  accordionQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      console.log(this);
      const expanded = this.firstElementChild.getAttribute("aria-expanded") === "true" || false;
      const accordionPanel = document.getElementById(this.firstElementChild.getAttribute("aria-controls"));

      accordionQuestions.forEach((question) => {
        question.firstElementChild.setAttribute("aria-expanded", "false");
        document.getElementById(
          question.firstElementChild.getAttribute("aria-controls")
        ).hidden = true;
      });

      if (!expanded) {
        this.firstElementChild.setAttribute("aria-expanded", "true");
        accordionPanel.hidden = false;
      }
    });
  });


  // Validate Contact Form

  const form = document.querySelector("form");

  function validateField(field) {
    const errorEl = field.parentElement.querySelector(".error-message");

    if (!field.validity.valid) {
      errorEl.textContent = field.dataset.error || "This field is required";
      return false;
    }

    errorEl.textContent = "";
    return true;
  }

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("blur", () => {
      validateField(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    const fields = form.querySelectorAll("input");

    fields.forEach((field) => {
      console.log(`Checking ${field.name}`);
      const fieldValid = validateField(field);

      if (!fieldValid) {
        isValid = false;
      }
    });

    if (isValid) {
      // send form data
      form.reset();
    } else {
      form.querySelector(":invalid").focus();
    }
  });


  // Manage mobile menu

  const menu = document.querySelector(".menu-container");
  const menuButton = document.querySelector(".mobile-nav-toggle");

  menuButton.addEventListener('click', (e) => {
    let isVisible = menu.dataset.visible;

    if(isVisible === 'false'){
      menu.dataset.visible = true;
      e.target.setAttribute('aria-expanded', 'true');
    } else {
      menu.dataset.visible = false;
      e.target.setAttribute('aria-expanded', 'false');
    }

  });
});
