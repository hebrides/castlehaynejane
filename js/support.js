const FALLBACK_CROWDFUND_ENDPOINT = '/api/crowdfund';
const STATIC_CROWDFUND_JSON = 'server/data/crowdfund.json';

const toNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const slugify = (value, fallback = 'general') => {
  if (typeof value !== 'string') return fallback;
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return slug || fallback;
};

const normalizeCrowdfundRecords = (payload) => {
  const records = Array.isArray(payload?.records)
    ? payload.records
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

  return records
    .map((record) => record?.fields || record)
    .filter(Boolean)
    .map((fields) => {
      const fundTitle = fields.fundTitle || '';
      return {
        description: fields.description || '',
        goalAmount: toNumber(fields.goalAmount),
        fundTitle,
        fundKey: slugify(fundTitle),
      };
    });
};

const fetchCrowdfundBreakdown = async (endpoint, timeout = 8000) => {
  if (!endpoint || typeof fetch !== 'function') return [];

  let timer;
  let controller;
  if (typeof AbortController !== 'undefined') {
    controller = new AbortController();
    timer = setTimeout(() => controller.abort(), timeout);
  }

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      signal: controller ? controller.signal : undefined,
    });
    if (!response.ok) {
      throw new Error(`Crowdfund API responded with ${response.status}`);
    }
    const payload = await response.json();
    return normalizeCrowdfundRecords(payload);
  } catch (error) {
    console.warn('[crowdfund] API fetch failed for %s — %s', endpoint, error.message || error);
    return [];
  } finally {
    if (timer) clearTimeout(timer);
  }
};

// Fallback: try loading static JSON file (for GitHub Pages / static hosts)
const fetchCrowdfundFromStaticJson = async () => {
  console.info('[crowdfund] API unavailable, trying static JSON fallback: %s', STATIC_CROWDFUND_JSON);
  try {
    const response = await fetch(STATIC_CROWDFUND_JSON);
    if (!response.ok) {
      console.warn('[crowdfund] Static JSON fallback returned %d', response.status);
      return [];
    }
    const payload = await response.json();
    const records = normalizeCrowdfundRecords(payload);
    console.info('[crowdfund] Loaded %d records from static JSON', records.length);
    return records;
  } catch (error) {
    console.error('[crowdfund] Static JSON fallback also failed — %s', error.message || error);
    return [];
  }
};

const calculateGoalTotal = (breakdown) =>
  breakdown.reduce((sum, item) => sum + toNumber(item.goalAmount), 0);

async function initCrowdfundCard() {
  const card = document.querySelector('.crowdfund-card');
  if (!card) return;

  const apiEndpoint = (card.dataset.crowdfundApi || '').trim() || FALLBACK_CROWDFUND_ENDPOINT;
  let breakdownData = await fetchCrowdfundBreakdown(apiEndpoint);
  // If API failed (e.g., GitHub Pages), try static JSON file
  if (!breakdownData.length) {
    breakdownData = await fetchCrowdfundFromStaticJson();
  }
  if (!breakdownData.length) {
    console.warn('[crowdfund] No crowdfund data available from any source');
  }
  const goal = calculateGoalTotal(breakdownData) || Number(card.dataset.goal) || 0;
  const current = Number(card.dataset.current) || 0;
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

  const breakdownWithPercents = attachPercents(breakdownData, goal);
  if (breakdownTarget && breakdownWithPercents.length) {
    renderCrowdfundBreakdown(breakdownTarget, breakdownWithPercents, formatter);
  }
}

function initSupportPage() {
  initCrowdfundCard().catch((error) => {
    console.error('Unable to initialize crowdfund card:', error);
  });
}

function attachPercents(breakdown, goal) {
  const total = goal > 0 ? goal : calculateGoalTotal(breakdown);
  const divisor = total || 1;

  return breakdown.map((item) => ({
    ...item,
    percent: Math.max(
      0,
      Math.min(100, Math.round((toNumber(item.goalAmount) / divisor) * 100)),
    ),
  }));
}

function renderCrowdfundBreakdown(listElement, breakdown, formatter) {
  listElement.innerHTML = '';

  breakdown.forEach((item) => {
    const estimatedCost = toNumber(item.goalAmount);
    const percentWidth = item.percent;

    const li = document.createElement('li');
    li.className = 'crowdfund-card__breakdown-item';

    const topRow = document.createElement('div');
    topRow.className = 'crowdfund-card__breakdown-row';

    const label = document.createElement('p');
    label.className = 'crowdfund-card__breakdown-label';
    label.textContent = item.description;

    const amount = document.createElement('strong');
    amount.className = 'crowdfund-card__breakdown-amount';
    amount.textContent = formatter.format(estimatedCost);

    topRow.append(label, amount);

    const barTrack = document.createElement('div');
    barTrack.className = 'crowdfund-card__breakdown-bar';
    barTrack.setAttribute('aria-hidden', 'true');

    const barFill = document.createElement('span');
    barFill.className = `crowdfund-card__breakdown-fill crowdfund-card__breakdown-fill--${item.fundKey}`;
    barFill.style.width = percentWidth + '%';
    barTrack.append(barFill);

    const percent = document.createElement('div');
    percent.className = 'crowdfund-card__breakdown-percent';
    percent.textContent = item.percent + '%';

    li.append(topRow, barTrack, percent);
    listElement.append(li);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupportPage, { once: true });
} else {
  initSupportPage();
}
