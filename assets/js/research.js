document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('publication-list');
  const filter = document.getElementById('filter-category');
  const sort = document.getElementById('sort-date');
  if (!list || !filter || !sort) return;
  const items = Array.from(list.querySelectorAll('.pub-item'));
  function render() {
    const category = filter.value;
    const order = sort.value;
    const filtered = items.filter((item) => category === 'all' || item.dataset.category === category);
    filtered.sort((a, b) => order === 'newest' ? b.dataset.date.localeCompare(a.dataset.date) : a.dataset.date.localeCompare(b.dataset.date));
    list.innerHTML = '';
    filtered.forEach((item) => list.appendChild(item));
  }
  filter.addEventListener('change', render);
  sort.addEventListener('change', render);
  render();
});
