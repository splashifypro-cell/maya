(function() {
  const WIDGET_URL = 'https://agentmaya.vercel.app/widget';
  const CONTAINER_ID = 'maya-widget-container';
  
  // Create container for the iframe
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.style.position = 'fixed';
  container.style.bottom = '0';
  container.style.right = '0';
  container.style.zIndex = '999999';
  container.style.width = '100px'; // Initial small size for FAB
  container.style.height = '100px';
  container.style.pointerEvents = 'none';
  container.style.transition = 'width 0.3s ease, height 0.3s ease';
  document.body.appendChild(container);

  // Create the iframe
  const iframe = document.createElement('iframe');
  iframe.src = WIDGET_URL;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.background = 'transparent';
  iframe.style.pointerEvents = 'auto';
  iframe.allow = 'clipboard-read; clipboard-write';
  
  container.appendChild(iframe);

  // Handle messages from the widget
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'MAYA_WIDGET_STATE') {
      const isOpen = event.data.open;
      if (isOpen) {
        container.style.width = '420px';
        container.style.height = '700px';
      } else {
        container.style.width = '100px';
        container.style.height = '100px';
      }
    }
  });
})();
