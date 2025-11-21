function initCrowdfundCard() {
  const card = document.querySelector('.crowdfund-card');
  if (!card) return;

  const current = Number(card.dataset.current) || 0;
  const goal = Number(card.dataset.goal) || 0;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const formattedCurrent = formatter.format(current);
  const formattedGoal = formatter.format(goal);
  const summary = card.querySelector('[data-progress-summary]');
  const raisedDisplay = card.querySelector('[data-progress-raised]');
  const goalDisplay = card.querySelector('[data-progress-goal]');
  const progress = card.querySelector('.crowdfund-card__progress');
  const bar = progress ? progress.querySelector('span') : null;

  if (summary) summary.textContent = formattedCurrent + ' / ' + formattedGoal;
  if (raisedDisplay) raisedDisplay.textContent = formattedCurrent;
  if (goalDisplay) goalDisplay.textContent = formattedGoal;
  if (progress) {
    progress.setAttribute('aria-valuenow', current);
    progress.setAttribute('aria-valuemax', goal);
  }
  if (bar) {
    const percent = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
    bar.style.width = percent + '%';
  }
}

function initCrowdfundDialog() {
  const dialog = document.querySelector('[data-crowdfund-dialog]');
  const openTrigger = document.querySelector('[data-crowdfund-open]');
  if (!dialog || !openTrigger) return;

  const closeTrigger = dialog.querySelector('[data-crowdfund-close]');

  const openDialog = () => {
    dialog.hidden = false;
    document.body.classList.add('crowdfund-dialog-open');
  };

  const closeDialog = () => {
    dialog.hidden = true;
    document.body.classList.remove('crowdfund-dialog-open');
  };

  openTrigger.addEventListener('click', openDialog);
  if (closeTrigger) closeTrigger.addEventListener('click', closeDialog);

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !dialog.hidden) closeDialog();
  });
}

function initSupportPage() {
  initCrowdfundCard();
  initCrowdfundDialog();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupportPage, { once: true });
} else {
  initSupportPage();
}
