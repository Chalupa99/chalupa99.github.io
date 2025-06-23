fetch('data.xlsx')
  .then(res => res.arrayBuffer())
  .then(ab => {
    const workbook = XLSX.read(ab, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: true, defval: "" });
    const merges = sheet['!merges'] || [];

    const table = document.createElement('table');
    const skipCells = {}; // Track cells covered by merged regions

    data.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');

      row.forEach((cell, colIndex) => {
        const cellKey = `${rowIndex},${colIndex}`;
        if (skipCells[cellKey]) return; // skip merged-over cells

        const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
        td.textContent = cell;

        // Check if this cell is part of a merged range
        const merge = merges.find(m =>
          m.s.r === rowIndex && m.s.c === colIndex
        );

        if (merge) {
          const rowspan = merge.e.r - merge.s.r + 1;
          const colspan = merge.e.c - merge.s.c + 1;
          if (rowspan > 1) td.setAttribute('rowspan', rowspan);
          if (colspan > 1) td.setAttribute('colspan', colspan);

          // Mark all covered cells to skip
          for (let r = merge.s.r; r <= merge.e.r; r++) {
            for (let c = merge.s.c; c <= merge.e.c; c++) {
              if (r === rowIndex && c === colIndex) continue;
              skipCells[`${r},${c}`] = true;
            }
          }
        }

        tr.appendChild(td);
      });

      table.appendChild(tr);
    });

    document.getElementById('table-container').innerHTML = '';
    document.getElementById('table-container').appendChild(table);
  })
  .catch(err => {
    document.getElementById('table-container').textContent = 'Failed to load data.';
    console.error('Error loading xlsx:', err);
  });
