const FUND_BREAKDOWN = [
  {
    label:
      'Build event spaces and stages; remodel farm house and guest house; finish pole barns and greenhouses',
    amount: 175000,
    colorClass: 'operations',
    color: '#518d48',
  },
  {
    label: 'Clear land; plant brambles, orchards, vines, ornamentals; build campground',
    amount: 125000,
    colorClass: 'education',
    color: '#8ec050',
  },
  {
    label: 'Finish offsite guest house',
    amount: 75000,
    colorClass: 'infrastructure',
    color: '#ffd05a',
  },
  {
    label: 'Finish offsite covered farmers market',
    amount: 75000,
    colorClass: 'community',
    color: '#f28f3b',
  },
  {
    label: 'Finish industrial storage building and retail space',
    amount: 50000,
    colorClass: 'reserve',
    color: '#c973ff',
  },
];

const FUND_TOTAL = FUND_BREAKDOWN.reduce((sum, item) => sum + item.amount, 0);

function initCrowdfundCard() {
  const card = document.querySelector('.crowdfund-card');
  if (!card) return;

  const current = Number(card.dataset.current) || 0;
  const goal = FUND_TOTAL;
  const breakdownTarget = card.querySelector('[data-crowdfund-breakdown]');
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

  const breakdownWithPercents = attachPercents(goal);
  if (breakdownTarget) {
    renderCrowdfundBreakdown(breakdownTarget, breakdownWithPercents, formatter);
  }

  renderCrowdfundPie(breakdownWithPercents, formatter);
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

function attachPercents(goal) {
  const total = goal > 0 ? goal : FUND_TOTAL;
  const divisor = total || 1;

  return FUND_BREAKDOWN.map((item) => ({
    ...item,
    percent: Math.max(0, Math.min(100, Math.round((item.amount / divisor) * 100))),
  }));
}

function renderCrowdfundBreakdown(listElement, breakdown, formatter) {
  listElement.innerHTML = '';

  breakdown.forEach((item) => {
    const estimatedCost = item.amount;
    const percentWidth = item.percent;

    const li = document.createElement('li');
    li.className = 'crowdfund-card__breakdown-item';

    const topRow = document.createElement('div');
    topRow.className = 'crowdfund-card__breakdown-row';

    const label = document.createElement('p');
    label.className = 'crowdfund-card__breakdown-label';
    label.textContent = item.label;

    const amount = document.createElement('strong');
    amount.className = 'crowdfund-card__breakdown-amount';
    amount.textContent = formatter.format(estimatedCost);

    topRow.append(label, amount);

    const barTrack = document.createElement('div');
    barTrack.className = 'crowdfund-card__breakdown-bar';
    barTrack.setAttribute('aria-hidden', 'true');

    const barFill = document.createElement('span');
    barFill.className = `crowdfund-card__breakdown-fill crowdfund-card__breakdown-fill--${item.colorClass}`;
    barFill.style.width = percentWidth + '%';
    barTrack.append(barFill);

    const percent = document.createElement('div');
    percent.className = 'crowdfund-card__breakdown-percent';
    percent.textContent = item.percent + '%';

    li.append(topRow, barTrack, percent);
    listElement.append(li);
  });
}

function renderCrowdfundPie(breakdown, formatter) {
  const pie = document.querySelector('[data-crowdfund-pie]');
  const legend = document.querySelector('[data-crowdfund-legend]');
  if (!pie || !legend) return;

  legend.innerHTML = '';

  let start = 0;
  const segments = breakdown.map((item) => {
    const end = start + item.percent;
    const segment = `${item.color} ${start}% ${end}%`;
    start = end;
    return segment;
  });

  if (segments.length) {
    pie.style.background = `conic-gradient(${segments.join(',')})`;
  }

  breakdown.forEach((item) => {
    const li = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = `crowdfund-pie__swatch crowdfund-pie__swatch--${item.colorClass}`;

    const text = document.createTextNode(
      `${item.label} – ${formatter.format(item.amount)} (${item.percent}%)`
    );

    li.append(swatch, text);
    legend.append(li);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupportPage, { once: true });
} else {
  initSupportPage();
}
