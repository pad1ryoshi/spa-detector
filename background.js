// background.js - Service Worker com tema japonês
const spaData = new Map();

const COLORS = {
  spa: '#BC002D',      // Vermelho do Japão para SPA
  regular: '#E0E0E0'   // Cinza claro para sites regulares
};

// Recebe mensagens do content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SPA_DETECTION') {
    const tabId = sender.tab.id;
    
    // Armazena dados do site
    spaData.set(tabId, {
      isSPA: message.isSPA,
      indicators: message.indicators,
      url: message.url
    });
    
    // Atualiza o ícone da extensão
    updateIcon(tabId, message.isSPA);
  }
});

// Atualiza o ícone baseado na detecção
function updateIcon(tabId, isSPA) {
  // Cria um canvas para desenhar o ícone colorido (estilo sol nascente japonês)
  const canvas = new OffscreenCanvas(128, 128);
  const ctx = canvas.getContext('2d');
  
  if (isSPA) {
    // Fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 128, 128);
    // Círculo vermelho (sol nascente)
    ctx.fillStyle = '#BC002D';
    ctx.beginPath();
    ctx.arc(64, 64, 45, 0, 2 * Math.PI);
    ctx.fill();
    // Texto branco
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('侍', 64, 64);
  } else {
    // Fundo branco com borda cinza
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 124, 124);
    // Círculo cinza claro
    ctx.fillStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.arc(64, 64, 45, 0, 2 * Math.PI);
    ctx.fill();
    // Texto cinza
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WEB', 64, 64);
  }
  
  // Converte para ImageData
  const imageData = ctx.getImageData(0, 0, 128, 128);
  
  // Define o ícone
  chrome.action.setIcon({
    tabId: tabId,
    imageData: {
      128: imageData
    }
  });
  
  chrome.action.setTitle({
    tabId: tabId,
    title: isSPA ? '侍 SPA' : '侍 Not SPA'
  });
  
  chrome.action.setBadgeText({
    tabId: tabId,
    text: isSPA ? 'SPA' : ''
  });
  
  chrome.action.setBadgeBackgroundColor({
    tabId: tabId,
    color: '#BC002D'
  });
}

// Limpa dados quando uma aba é fechada
chrome.tabs.onRemoved.addListener((tabId) => {
  spaData.delete(tabId);
});

// Responde a requisições do popup
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup') {
    port.onMessage.addListener((msg) => {
      if (msg.type === 'GET_SPA_DATA') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            const data = spaData.get(tabs[0].id) || { isSPA: false, indicators: {} };
            port.postMessage({ type: 'SPA_DATA', data: data });
          }
        });
      }
    });
  }
});