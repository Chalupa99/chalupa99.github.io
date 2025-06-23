fetch('data.xlsx')
  .then(res => res.arrayBuffer())
  .then(ab => {
    const workbook = XLSX.read(ab, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const merges = sheet['!merges'] || [];

    const range = XLSX.utils.decode_range(sheet['!ref']);
    const table = document.createElement('table');

    const skipCells = {}; // To skip cells that are inside merged ranges

    for (let row = range.s.r; row <= range.e.r; row++) {
      const tr = document.createElement('tr');

      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellKey = `${row},${col}`;
        if (skipCells[cellKey]) continue; // Skip merged-over cells

        const cellAddress = { r: row, c: col };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = sheet[cellRef];
        const td = document.createElement(row === range.s.r ? 'th' : 'td');
        if (cell && typeof cell.v === 'number') {
            td.textContent = Number(cell.v.toFixed(2));
        } else {
            td.textContent = cell ? cell.v : "";
        }

        // Check if this is the start of a merged region
        const merge = merges.find(m => m.s.r === row && m.s.c === col);
        if (merge) {
          const rowspan = merge.e.r - merge.s.r + 1;
          const colspan = merge.e.c - merge.s.c + 1;
          if (rowspan > 1) td.setAttribute('rowspan', rowspan);
          if (colspan > 1) td.setAttribute('colspan', colspan);

          // Mark all merged cells to skip
          for (let r = merge.s.r; r <= merge.e.r; r++) {
            for (let c = merge.s.c; c <= merge.e.c; c++) {
              if (r === row && c === col) continue;
              skipCells[`${r},${c}`] = true;
            }
          }
        }

        tr.appendChild(td);
      }

      table.appendChild(tr);
    }

    document.getElementById('table-container').innerHTML = '';
    document.getElementById('table-container').appendChild(table);
  })
  .catch(err => {
    document.getElementById('table-container').textContent = 'Failed to load data.';
    console.error('Error loading xlsx:', err);
  });


document.querySelectorAll('.zoomable').forEach(img => {
  img.addEventListener('click', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.style.display = 'block';
    lightboxImg.src = img.src;
  });
});

document.querySelector('.lightbox-close').addEventListener('click', () => {
  document.getElementById('lightbox').style.display = 'none';
});

document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.style.display = 'none';
  }
});

function copyPaymentInfo() {
  const textToCopy = "SK5811000000002936027373";
  const payMessage = document.getElementById('pay-banner');

  navigator.clipboard.writeText(textToCopy).then(() => {
    const originalHTML = payMessage.innerHTML;
    payMessage.innerHTML = "IBAN Copied!";
    setTimeout(() => {
      payMessage.innerHTML = originalHTML;
    }, 2000);
  }).catch(err => {
    payMessage.innerHTML = "Copy failed";
    console.error("Clipboard error:", err);
  });
}
