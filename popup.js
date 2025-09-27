document.addEventListener('DOMContentLoaded', () => {
  const port = chrome.runtime.connect({ name: 'popup' });
  
  port.postMessage({ type: 'GET_SPA_DATA' });
  
  port.onMessage.addListener((msg) => {
    if (msg.type === 'SPA_DATA') {
      displayResults(msg.data);
    }
  });
  
  setTimeout(() => {
    const content = document.getElementById('content');
    if (content.innerHTML.includes('loading-spinner')) {
      content.innerHTML = `
        <div class="status regular">
          <div>⏳ Wait a little bit</div>
        </div>
        <div class="details">
          <p>Refresh the page</p>
        </div>
      `;
    }
  }, 3000);
});

function displayResults(data) {
  const content = document.getElementById('content');
  
  if (!data || data.isSPA === undefined) {
    content.innerHTML = `
      <div class="status regular">
        <div>📄 No data</div>
      </div>
      <div class="details">
        <p>Refresh the page</p>
      </div>
    `;
    return;
  }
  
  const statusClass = data.isSPA ? 'spa' : 'regular';
  const statusText = data.isSPA ? '🎌 SPA Detect!' : '📄 Not SPA';
  
  let detailsHTML = '';
  
  if (data.indicators && data.isSPA) {
    const indicators = data.indicators;
    
    // Mostra apenas frameworks detectados
    if (indicators.frameworks && indicators.frameworks.length > 0) {
      detailsHTML = `
        <div class="details">
          <strong>Tech:</strong><br>
          ${indicators.frameworks.map(f => `<span class="framework-badge">${f}</span>`).join('')}
        </div>
      `;
    }
  }
  
  content.innerHTML = `
    <div class="status ${statusClass}">
      <div>${statusText}</div>
    </div>
    ${detailsHTML}
  `;
}