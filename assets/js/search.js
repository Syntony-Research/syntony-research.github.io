(function () {
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const meta = document.querySelector('[data-search-meta]');
  const resultsNode = document.querySelector('[data-search-results]');
  if (!form || !input || !meta || !resultsNode) return;

  let index = [];

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  input.value = initialQuery;

  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  const scoreItem = (item, terms, query) => {
    const title = normalize(item.title);
    const summary = normalize(item.summary);
    const type = normalize(item.type);
    const keywords = normalize((item.keywords || []).join(' '));
    const haystack = `${title} ${summary} ${type} ${keywords}`;
    let score = 0;

    if (title === query) score += 80;
    if (title.includes(query)) score += 36;
    if (keywords.includes(query)) score += 24;
    if (summary.includes(query)) score += 12;

    terms.forEach((term) => {
      if (!term) return;
      if (title.includes(term)) score += 16;
      if (keywords.includes(term)) score += 10;
      if (summary.includes(term)) score += 5;
      if (type.includes(term)) score += 3;
      if (!haystack.includes(term)) score -= 8;
    });

    return score;
  };

  const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const renderEmpty = (message) => {
    resultsNode.innerHTML = `<div class="search-empty">${message}</div>`;
  };

  const renderResults = (query) => {
    const normalizedQuery = normalize(query);
    const terms = normalizedQuery.split(' ').filter(Boolean);

    if (!normalizedQuery) {
      meta.textContent = 'Type a query to search the site.';
      resultsNode.innerHTML = '';
      return;
    }

    const results = index
      .map((item) => ({ ...item, score: scoreItem(item, terms, normalizedQuery) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 12);

    meta.textContent = results.length === 1
      ? '1 result found.'
      : `${results.length} results found.`;

    if (!results.length) {
      renderEmpty('No matching pages found. Try a broader term such as governance, red teaming, risk, research, or GovTune.');
      return;
    }

    resultsNode.innerHTML = results.map((item) => `
      <a class="search-result" href="${escapeHtml(item.url)}">
        <span class="search-result-type">${escapeHtml(item.type)}</span>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
        <span class="search-result-url">${escapeHtml(item.url)}</span>
      </a>
    `).join('');
  };

  const updateUrl = (query) => {
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url);
  };

  fetch('/assets/search-index.json')
    .then((response) => response.json())
    .then((items) => {
      index = items;
      renderResults(input.value);
      input.focus();
    })
    .catch(() => {
      meta.textContent = 'Search index could not be loaded.';
      renderEmpty('Search is temporarily unavailable.');
    });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim();
    updateUrl(query);
    renderResults(query);
  });

  input.addEventListener('input', () => {
    const query = input.value.trim();
    updateUrl(query);
    renderResults(query);
  });
}());
