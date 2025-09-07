export function onRequest(context) {
  // Handle SPA routing
  const url = new URL(context.request.url);
  
  // If it's not an asset and not an API route, serve index.html
  if (!url.pathname.startsWith('/assets/') && 
      !url.pathname.startsWith('/api/') && 
      !url.pathname.includes('.')) {
    return context.next({
      rewrite: new URL('/index.html', url.origin)
    });
  }
  
  return context.next();
}
