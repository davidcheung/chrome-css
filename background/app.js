chrome.webNavigation.onCompleted.addListener(function(tab) {
  let domain = getDomain(tab.url)
  if (domain) {
    if (css = localStorage.getItem(domain)) {
      appendCss(tab.id, css)
    }
  }  
});

function getDomain(url) {
  var match = /(?:[\w-]+\.)+[\w-]+/.exec(url)
  return match ? match[0] :undefined
}

function appendCss(tabId, css) {
  css = css.replace(/\n/g,' ');
  chrome.tabs.executeScript(tabId, 
    {code: 'var x =document.createElement("STYLE");x.innerText="'+css+'"; document.getElementsByTagName("head")[0].appendChild(x) '},
    ()=>{ console.log('Applied styling')}
  )
}
