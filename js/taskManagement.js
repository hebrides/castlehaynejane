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

const buildCategoryAnchorId = (sectionIndex, categoryIndex, categoryName = "category") => {
  const safeName =
    typeof categoryName === "string"
      ? categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : "category";
  return `task-category-${sectionIndex}-${categoryIndex}-${safeName || "category"}`;
};

const createSidebarProgress = (completed, total) => {
  const percentage = total ? (completed / total) * 100 : 0;
  const wrapper = document.createElement("div");
  wrapper.className = "task-menu__sidebar-progress";

  const bar = document.createElement("div");
  bar.className = "task-menu__sidebar-progress-bar";
  const fill = document.createElement("span");
  fill.style.width = `${percentage}%`;
  bar.append(fill);

  const count = document.createElement("span");
  count.className = "task-menu__sidebar-progress-count";
  count.textContent = `${completed}/${total}`;

  wrapper.append(bar, count);
  return wrapper;
};

const createCategoryBlock = (category, anchorId) => {
  const wrapper = document.createElement("section");
  wrapper.className = "task-menu__category";
  if (anchorId) wrapper.id = anchorId;

  const header = document.createElement("div");
  header.className = "task-menu__header";

  const headerText = document.createElement("div");
  const categoryName = document.createElement("h3");
  categoryName.textContent = category.name;
  const summary = document.createElement("p");
  summary.className = "task-menu__summary";
  summary.textContent = category.summary;
  headerText.append(categoryName, summary);

  header.append(headerText);

  const taskList = createTaskList(category.tasks);
  wrapper.append(header, taskList);

  return wrapper;
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

const createSidebar = (categories, scrollToCategory, scrollToTabs) => {
  const sidebar = document.createElement("aside");
  sidebar.className = "task-menu__sidebar";

  const header = document.createElement("div");
  header.className = "task-menu__sidebar-header";

  const title = document.createElement("h4");
  title.textContent = "Categories";

  const toTopButton = document.createElement("button");
  toTopButton.type = "button";
  toTopButton.className = "task-menu__to-top";
  toTopButton.title = "Scroll to top";
  toTopButton.setAttribute("aria-label", "Scroll to top");
  toTopButton.innerText = "↑";
  toTopButton.addEventListener("click", () => {
    if (typeof scrollToTabs === "function") {
      scrollToTabs();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  header.append(title, toTopButton);
  sidebar.append(header);

  const list = document.createElement("ul");
  list.className = "task-menu__sidebar-list";

  categories.forEach((category) => {
    const item = document.createElement("li");
    item.className = "task-menu__sidebar-item";

    const link = document.createElement("a");
    link.className = "task-menu__sidebar-link";
    link.href = `#${category.id}`;
    link.textContent = category.name;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToCategory(category.id);
    });

    const progress = createSidebarProgress(category.completed, category.total);
    item.append(link, progress);
    list.append(item);
  });

  sidebar.append(list);
  return sidebar;
};

const createSectionPanel = (section, sectionIndex, tabId) => {
  const panel = document.createElement("div");
  panel.className = "task-tabs__panel";
  panel.id = `task-panel-${sectionIndex}`;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tabId);
  panel.hidden = true;
  panel.setAttribute("aria-hidden", "true");

  const categoriesWithMeta = section.categories.map((category, categoryIndex) => ({
    ...category,
    id: buildCategoryAnchorId(sectionIndex, categoryIndex, category.name),
    completed: category.tasks.filter((task) => task.checked).length,
    total: category.tasks.length,
  }));

  const fragment = document.createDocumentFragment();
  const layout = document.createElement("div");
  layout.className = "task-menu__layout";

  const content = document.createElement("div");
  content.className = "task-menu__content";

  const sectionOverview = createSectionOverview(section);
  content.append(sectionOverview);

  const scrollToCategory = (categoryId) => {
    const target = panel.querySelector(`#${categoryId}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTabs = () => {
    const tabList = document.querySelector(".task-menu");
    if (tabList) {
      tabList.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  categoriesWithMeta.forEach((category) => {
    const block = createCategoryBlock(category, category.id);
    content.append(block);
  });

  const sidebar = createSidebar(categoriesWithMeta, scrollToCategory, scrollToTabs);

  layout.append(content, sidebar);
  fragment.append(layout);

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

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
};

const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return Boolean(value);
};

const buildTasksFromFields = (fields) => {
  const descriptions = Array.isArray(fields?.tasks) ? fields.tasks : [];
  const checkedStates = Array.isArray(fields?.checked) ? fields.checked : [];

  return descriptions.map((description, index) => ({
    description,
    checked: toBoolean(checkedStates[index]),
  }));
};

const extractSectionTitle = (fields) => {
  const titleSource = ensureArray(fields?.title);
  if (titleSource.length && typeof titleSource[0] === "string") {
    return titleSource[0];
  }
  if (typeof fields?.title === "string") {
    return fields.title;
  }
  return "Volunteer Tasks";
};

const buildSectionsFromApiPayload = (payload) => {
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.records)
      ? payload.records
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  if (!records.length) return [];

  const sections = new Map();
  records.forEach((record) => {
    const fields = record?.fields || record;
    if (!fields) return;

    const sectionTitle = extractSectionTitle(fields);
    if (!sections.has(sectionTitle)) {
      sections.set(sectionTitle, { title: sectionTitle, categories: [] });
    }

    sections.get(sectionTitle).categories.push({
      name: fields.category || "General",
      summary: fields.summary || "",
      tasks: buildTasksFromFields(fields),
    });
  });

  return sortSections(
    Array.from(sections.values()).map((section) => ({
      ...section,
      categories: sortCategories(section.categories),
    })),
  );
};

const romanToNumber = (value) => {
  if (typeof value !== "string") return Number.POSITIVE_INFINITY;
  const numerals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const chars = value.toUpperCase().split("");
  let total = 0;
  for (let i = 0; i < chars.length; i += 1) {
    const current = numerals[chars[i]] || 0;
    const next = numerals[chars[i + 1]] || 0;
    total += current < next ? -current : current;
  }
  return total || Number.POSITIVE_INFINITY;
};

const sortSections = (sections) =>
  sections.slice().sort((a, b) => {
    const aMatch = a.title?.trim().match(/^([IVXLCDM]+)\./i);
    const bMatch = b.title?.trim().match(/^([IVXLCDM]+)\./i);
    const aValue = romanToNumber(aMatch?.[1]);
    const bValue = romanToNumber(bMatch?.[1]);
    if (aValue === bValue) return (a.title || "").localeCompare(b.title || "");
    return aValue - bValue;
  });

const sortCategories = (categories = []) =>
  categories.slice().sort((a, b) => {
    const nameA = (a?.name || "").toLowerCase();
    const nameB = (b?.name || "").toLowerCase();
    if (nameA === nameB) return 0;
    return nameA > nameB ? 1 : -1;
  });

const toggleTaskLoadingState = (isLoading) => {
  const loader = document.querySelector("[data-task-loading]");
  if (loader) {
    loader.hidden = !isLoading;
  }

  const tabsRoot = document.querySelector("[data-task-tabs]");
  if (tabsRoot) {
    tabsRoot.hidden = Boolean(isLoading);
    tabsRoot.setAttribute("aria-busy", String(Boolean(isLoading)));
  }
};

const fetchSectionsFromApi = async (endpoint, timeout = 8000) => {
  if (!endpoint || typeof fetch !== "function") {
    return null;
  }

  let timer;
  let controller;
  if (typeof AbortController !== "undefined") {
    controller = new AbortController();
    timer = setTimeout(() => controller.abort(), timeout);
  }

  try {
    const response = await fetch(endpoint, {
      signal: controller ? controller.signal : undefined,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Task API responded with ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Task API fetch failed:", error);
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const hydrateTaskMenu = async () => {
  const tabsRoot = document.querySelector("[data-task-tabs]");
  const apiEndpoint = tabsRoot?.dataset?.taskApi?.trim();
  if (apiEndpoint) {
    toggleTaskLoadingState(true);
    try {
      const payload = await fetchSectionsFromApi(apiEndpoint);
      const apiSections = buildSectionsFromApiPayload(payload);
      if (apiSections.length) {
        renderTaskMenu(apiSections);
        return;
      }
    } finally {
      toggleTaskLoadingState(false);
    }
  }
  renderTaskMenu(getTaskSections());
};

document.addEventListener("DOMContentLoaded", () => {
  hydrateTaskMenu();
});
