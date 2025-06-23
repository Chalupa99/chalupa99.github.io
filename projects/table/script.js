fetch('data.xlsx')
  .then(res => res.arrayBuffer())
  .then(ab => {
    const workbook = XLSX.read(ab, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // First sheet
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const table = document.createElement('table');
    data.forEach((row, i) => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const el = document.createElement(i === 0 ? 'th' : 'td');
        el.textContent = cell;
        tr.appendChild(el);
      });
      table.appendChild(tr);
    });

    const container = document.getElementById('table-container');
    container.innerHTML = '';
    container.appendChild(table);
  })
  .catch(err => {
    document.getElementById('table-container').textContent = 'Failed to load data.';
    console.error('Error loading xlsx:', err);
  });
