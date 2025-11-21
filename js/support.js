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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCrowdfundCard, { once: true });
} else {
  initCrowdfundCard();
}
