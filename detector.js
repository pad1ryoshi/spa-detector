(() => {
  let isSPA = false;
  const spaIndicators = {
    frameworks: [],
    routing: false,
    dynamicContent: false,
    historyAPI: false,
    ajaxNavigation: false
  };

  // ADD MORE FRAMEWORKS IN FUTURE
  function detectFrameworks() {
    const frameworks = [];
    
    // React
    if (window.React || document.querySelector('[data-reactroot]') || 
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || document.querySelector('#root')) {
      frameworks.push('React');
    }
    
    // Angular
    if (window.angular || document.querySelector('[ng-app]') || 
        document.querySelector('[data-ng-app]') || window.ng) {
      frameworks.push('Angular');
    }
    
    // Vue
    if (window.Vue || document.querySelector('[data-server-rendered]') || 
        window.__VUE__ || window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      frameworks.push('Vue');
    }
    
    // Svelte
    if (window.__svelte || document.querySelector('[data-svelte]')) {
      frameworks.push('Svelte');
    }
    
    // Ember
    if (window.Ember || window.EmberENV) {
      frameworks.push('Ember');
    }
    
    // Next.js
    if (window.__NEXT_DATA__ || document.querySelector('#__next')) {
      frameworks.push('Next.js');
    }
    
    // Nuxt
    if (window.$nuxt || window.__NUXT__) {
      frameworks.push('Nuxt');
    }
    
    return frameworks;
  }

  function detectHistoryAPI() {
    let historyChanges = 0;
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
      historyChanges++;
      return originalPushState.apply(history, arguments);
    };
    
    history.replaceState = function() {
      historyChanges++;
      return originalReplaceState.apply(history, arguments);
    };
    
    window.addEventListener('popstate', () => {
      historyChanges++;
    });
    
    return () => historyChanges > 0;
  }

  function detectClientRouting() {
    let routingDetected = false;
    
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        setTimeout(() => {
          if (window.location.href !== link.href && !e.defaultPrevented) {
            routingDetected = true;
          }
        }, 100);
      }
    });
    
    return () => routingDetected;
  }

  function detectDynamicContent() {
    let mutationCount = 0;
    const observer = new MutationObserver((mutations) => {
      mutationCount += mutations.length;
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    setTimeout(() => observer.disconnect(), 5000);
    
    return () => mutationCount > 50;
  }

  function detectAjaxNavigation() {
    let ajaxCount = 0;
    const originalXHR = window.XMLHttpRequest.prototype.open;
    
    window.XMLHttpRequest.prototype.open = function() {
      ajaxCount++;
      return originalXHR.apply(this, arguments);
    };
    
    // Monitora fetch API
    const originalFetch = window.fetch;
    if (originalFetch) {
      window.fetch = function() {
        ajaxCount++;
        return originalFetch.apply(this, arguments);
      };
    }
    
    return () => ajaxCount > 5;
  }

  function detectSPA() {
    spaIndicators.frameworks = detectFrameworks();
    const historyCheck = detectHistoryAPI();
    const routingCheck = detectClientRouting();
    const dynamicCheck = detectDynamicContent();
    const ajaxCheck = detectAjaxNavigation();
    
    setTimeout(() => {
      spaIndicators.historyAPI = historyCheck();
      spaIndicators.routing = routingCheck();
      spaIndicators.dynamicContent = dynamicCheck();
      spaIndicators.ajaxNavigation = ajaxCheck();
      
      isSPA = spaIndicators.frameworks.length > 0 || 
              spaIndicators.historyAPI || 
              spaIndicators.routing ||
              (spaIndicators.dynamicContent && spaIndicators.ajaxNavigation);
      
      chrome.runtime.sendMessage({
        type: 'SPA_DETECTION',
        isSPA: isSPA,
        indicators: spaIndicators,
        url: window.location.href
      });
    }, 3000);
  }

  if (document.readyState === 'complete') {
    detectSPA();
  } else {
    window.addEventListener('load', detectSPA);
  }

  let lastUrl = window.location.href;
  new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      setTimeout(detectSPA, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
})();