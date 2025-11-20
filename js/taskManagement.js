const taskSections = [
  {
    title: "I. Remodel Tasks",
    categories: [
      {
        name: "Kitchen",
        summary:
          "Tracking the punch list so volunteers can quickly see what still needs attention.",
        tasks: [
          { description: "Install New Kitchen Sink", checked: false },
          { description: "Kitchen Counters", checked: true },
          { description: "Stove Hood Vent", checked: false },
          { description: "Fix Drawer Kitchen", checked: false },
          {
            description: "New Hardware / Hinges for All Cabinets",
            checked: false,
          },
          { description: "Kitchen Sink Faucet", checked: false },
          { description: "Fix Ugly Trim", checked: false },
          { description: "Fix Cabinet Kitchen / Laundry", checked: false },
        ],
      },
      {
        name: "Master Bath",
        summary: "Master Bath remodeling tasks",
        tasks: [
          { description: "Master Bath Countertops", checked: false },
          { description: "Master Bath Faucet", checked: false },
          { description: "Replace Master Bath Curtain Rod", checked: false },
          { description: "Replace Master Bath Fan (with light or fan)", checked: false },
          { description: "Hardware for Bath Cabinet", checked: false },
          { description: "Master Bath shower 541/4\" x 38\" RH", checked: false },
          { description: "New Plumbing Master Bath Shower", checked: true },
          { description: "New Tile Master Bath Shower", checked: false },
        ]
      },
      {
        name: "New Bedroom / Bath (4 baths)",
        summary: "All bedrooms and bathrooms not related to master bath",
        tasks: [
          { description: "New Living room wall", checked: true },
          { description: "New Bathroom wall", checked: true },
          { description: "Move electric switches", checked: true },
          { description: "Add bathroom electrical GFCI", checked: false },
          { description: "Toilet 1 / 2 / 3", checked: false },
          { description: "Tub", checked: true },
          { description: "Plumbing", checked: true },
          { description: "Fart fan 1 / 2 / 3", checked: true },
          { description: "Fart fan vent to exterior 1 / 2 / 3", checked: false },
          { description: "Sewer Vent to exterior", checked: false },
          { description: "Bath / showers 1", checked: false },
          { description: "Bath / showers 2", checked: false },
          { description: "Bath / showers 3", checked: false },
          { description: "Bath / showers 4", checked: false },
          { description: "vanity lights 1 / 2 / 3", checked: false },
          { description: "Vanity 1 / 2 / 3", checked: false },
          { description: "HVAC line", checked: false },
        ]
      },
      {
        name: "Other Bedrooms",
        summary: "Remaining bedroom finish work",
        tasks: [
          { description: "Fix and trim out closets", checked: false },
          { description: "Fix damaged windows", checked: false },
          { description: "Check corners", checked: false },
          { description: "Repainted", checked: false },
        ],
      },
      {
        name: "Final Paint and Drywall",
        summary: "Punch list for drywall and painting",
        tasks: [
          { description: "Additions and holes Drywalled?", checked: false },
          { description: "Last tidy up of drywall", checked: false },
          { description: "Drywall Corners for closets", checked: false },
          {
            description: "Final Drywall patch & skim walls, Prime Cleaned Areas",
            checked: false,
          },
          { description: "Clean dust from walls", checked: false },
          { description: "Final Paint Walls", checked: false },
          { description: "Paint kitchen Cabinets", checked: true },
          { description: "Room ceilings", checked: true },
          { description: "Paint closets", checked: false },
          { description: "Paint Master Bath Cabinets", checked: false },
          { description: "Paint Kitchen and Cabinets", checked: false },
          { description: "Paint exterior door", checked: false },
          { description: "Porches stained", checked: true },
          { description: "Paint and finish walls / corners", checked: false },
          {
            description: "Full Repaint check through and touch up",
            checked: false,
          },
        ],
      },
      {
        name: "HVAC",
        summary: "Heating and cooling tasks",
        tasks: [
          { description: "Clean and repair / Replace HVAC", checked: false },
          { description: "New HVAC line for Bathroom", checked: false },
          { description: "Replace HVAC Interior Blower?", checked: false },
        ],
      },
      {
        name: "Doors and Trim, Floors",
        summary: "Finish work for trim and flooring",
        tasks: [
          { description: "Flooring", checked: false },
          { description: "Door Hardware: 6 Normal butter knife handles", checked: false },
          { description: "Put doors back up", checked: false },
          { description: "Floor Moulding", checked: false },
          { description: "Door Casings", checked: false },
          { description: "Closet trim", checked: false },
          {
            description: "Crown Moulding - Use casing the way Art and I figured out",
            checked: false,
          },
          { description: "Fix skirting/ Underpinning", checked: false },
        ],
      },
      {
        name: "Interior / Exterior Fixtures",
        summary: "Light fixtures and electrical odds and ends",
        tasks: [
          { description: "Replace 6 top lights", checked: true },
          { description: "Replace 2 Master Bath Mirror Lights", checked: false },
          { description: "New Bathroom Fixtures", checked: false },
          { description: "Towel and toilet paper racks for each bathroom", checked: false },
          { description: "Exterior Porch Lights (front, side, back)", checked: false },
          { description: "Extra light for Camper", checked: false },
          { description: "Check all electrical", checked: false },
        ],
      },
      {
        name: "Redo Septic",
        summary: "Septic line and tank updates",
        tasks: [
          { description: "New Drain field line", checked: true },
          { description: "Fix Septic Junction Box", checked: true },
          { description: "Fix Septic tank (get another concrete lid)", checked: false },
          { description: "Add new tank", checked: false },
        ],
      },
      {
        name: "Camper / RV",
        summary: "Finish the camper space",
        tasks: [
          { description: "Stain / Seal Porch", checked: false },
          { description: "Clean and paint camper interior", checked: false },
          { description: "Fix HVAC", checked: false },
          { description: "Fix 12 V Inverter", checked: false },
          { description: "Finish electrical", checked: false },
          { description: "Finish water", checked: false },
          { description: "Finish Plumbing", checked: false },
          { description: "Finish Camper Hook Ups", checked: false },
        ],
      },
      {
        name: "Exterior Pump House",
        summary: "Pump house repairs",
        tasks: [
          { description: "Raise up 3 feet", checked: true },
          { description: "Siding", checked: false },
          { description: "Roof", checked: false },
          { description: "Raise Pump pressure", checked: true },
          { description: "New filter", checked: false },
          {
            description: "Cover weird other pump pipes in yard with structure or remove",
            checked: true,
          },
        ],
      },
    ],
  },
];

const renderTaskMenu = (sections) => {
  const root = document.querySelector("[data-task-menu-root]");

  if (!root) return;

  root.innerHTML = "";
  const fragment = document.createDocumentFragment();

  sections.forEach((section) => {
    let sectionTitleAdded = false;
    section.categories.forEach((category) => {
      const completed = category.tasks.filter((task) => task.checked).length;
      const total = category.tasks.length;
      const percentage = total ? (completed / total) * 100 : 0;

      const header = document.createElement("div");
      header.className = "task-menu__header";

      const headerText = document.createElement("div");
      if (!sectionTitleAdded) {
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = section.title;
        headerText.append(sectionTitle);
        sectionTitleAdded = true;
      }
      const categoryName = document.createElement("h3");
      categoryName.textContent = category.name;
      const summary = document.createElement("p");
      summary.className = "task-menu__summary";
      summary.textContent = category.summary;

      headerText.append(categoryName, summary);

      const progressGroup = document.createElement("div");
      progressGroup.className = "task-menu__progress";
      progressGroup.setAttribute(
        "aria-label",
        `${category.name} progress`
      );
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
      header.append(headerText, progressGroup);

      const taskList = document.createElement("ul");
      taskList.className = "task-list";
      taskList.setAttribute("role", "list");

      category.tasks.forEach((task) => {
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

      fragment.append(header, taskList);
    });
  });

  root.append(fragment);
};

document.addEventListener("DOMContentLoaded", () => renderTaskMenu(taskSections));
