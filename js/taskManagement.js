const createProgressGroup = (categoryName, completed, total) => {
  const percentage = total ? (completed / total) * 100 : 0;
  const progressGroup = document.createElement("div");
  progressGroup.className = "task-menu__progress";
  progressGroup.setAttribute("aria-label", `${categoryName} progress`);
  progressGroup.setAttribute("role", "group");

  const progressCopy = document.createElement("p");
  progressCopy.className = "task-menu__progress-count";
  progressCopy.textContent = `${completed} of ${total} complete`;

  const progressBar = document.createElement("div");
  progressBar.className = "task-menu__progress-bar";
  progressBar.setAttribute("role", "progressbar");
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", String(total));
  progressBar.setAttribute("aria-valuenow", String(completed));

  const progressFill = document.createElement("span");
  progressFill.style.width = `${percentage}%`;
  progressBar.append(progressFill);

  progressGroup.append(progressCopy, progressBar);
  return progressGroup;
};

const createTaskList = (tasks) => {
  const taskList = document.createElement("ul");
  taskList.className = "task-list";
  taskList.setAttribute("role", "list");

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task${task.checked ? " task--done" : ""}`;

    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.disabled = true;
    if (task.checked) checkbox.checked = true;

    const description = document.createElement("span");
    description.textContent = task.description;

    label.append(checkbox, description);
    taskItem.append(label);
    taskList.append(taskItem);
  });

  return taskList;
};

const createCategoryBlock = (category) => {
  const fragment = document.createDocumentFragment();
  const completed = category.tasks.filter((task) => task.checked).length;
  const total = category.tasks.length;

  const header = document.createElement("div");
  header.className = "task-menu__header";

  const headerText = document.createElement("div");
  const categoryName = document.createElement("h3");
  categoryName.textContent = category.name;
  const summary = document.createElement("p");
  summary.className = "task-menu__summary";
  summary.textContent = category.summary;
  headerText.append(categoryName, summary);

  const progressGroup = createProgressGroup(category.name, completed, total);
  header.append(headerText, progressGroup);

  const taskList = createTaskList(category.tasks);
  fragment.append(header, taskList);

  return fragment;
};

const createSectionOverview = (section) => {
  const totalTasks = section.categories.reduce(
    (count, category) => count + category.tasks.length,
    0
  );
  const totalCompleted = section.categories.reduce(
    (count, category) => count + category.tasks.filter((task) => task.checked).length,
    0
  );

  const wrapper = document.createElement("div");
  wrapper.className = "task-menu__section-overview";

  const title = document.createElement("h2");
  title.textContent = section.title;

  const progress = createProgressGroup(section.title, totalCompleted, totalTasks);
  wrapper.append(title, progress);

  return wrapper;
};

const createSectionPanel = (section, sectionIndex, tabId) => {
  const panel = document.createElement("div");
  panel.className = "task-tabs__panel";
  panel.id = `task-panel-${sectionIndex}`;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tabId);
  panel.hidden = true;
  panel.setAttribute("aria-hidden", "true");

  const fragment = document.createDocumentFragment();
  const sectionOverview = createSectionOverview(section);
  fragment.append(sectionOverview);

  section.categories.forEach((category) => {
    const block = createCategoryBlock(category);
    fragment.append(block);
  });

  panel.append(fragment);
  return panel;
};

const createTab = (title, sectionIndex, activateTab) => {
  const tab = document.createElement("button");
  tab.type = "button";
  tab.id = `task-tab-${sectionIndex}`;
  tab.className = "task-tabs__tab";
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", `task-panel-${sectionIndex}`);
  tab.textContent = title;
  tab.tabIndex = -1;
  tab.setAttribute("aria-selected", "false");
  tab.addEventListener("click", () => activateTab(sectionIndex));
  return tab;
};

const renderTaskMenu = (sections) => {
  const tabsRoot = document.querySelector("[data-task-tabs]");
  if (!tabsRoot) return;

  const tabList = tabsRoot.querySelector("[data-task-tablist]");
  const panelsContainer = tabsRoot.querySelector("[data-task-tabpanels]");
  if (!tabList || !panelsContainer) return;

  tabList.innerHTML = "";
  panelsContainer.innerHTML = "";

  const tabs = [];
  const panels = [];
  const activateTab = (selectedIndex) => {
    tabs.forEach((tab, index) => {
      const isActive = index === selectedIndex;
      tab.classList.toggle("task-tabs__tab--active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;

      const panel = panels[index];
      if (panel) {
        panel.hidden = !isActive;
        panel.setAttribute("aria-hidden", String(!isActive));
      }
    });
  };

  sections.forEach((section, sectionIndex) => {
    const tab = createTab(section.title, sectionIndex, activateTab);
    tabList.append(tab);
    tabs.push(tab);

    const panel = createSectionPanel(section, sectionIndex, tab.id);
    panelsContainer.append(panel);
    panels.push(panel);
  });

  if (tabs.length) activateTab(0);
};

const getTaskSections = () => {
  if (typeof window !== "undefined" && window.taskSections) {
    return window.taskSections;
  }
  if (typeof globalThis !== "undefined" && globalThis.taskSections) {
    return globalThis.taskSections;
  }
  return [];
};

document.addEventListener("DOMContentLoaded", () => {
  renderTaskMenu(getTaskSections());
});
