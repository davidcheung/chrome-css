let tab, tabId

function getCurrentTabUrl(callback) {
  return new Promise((resolve) => {
    chrome.tabs.query(
      {active: true, currentWindow: true},
      (tabs)=> resolve(tabs[0])
    );
  })
}

function appendCss(css) {
  chrome.tabs.executeScript(tabId, 
    {code: 'var x =document.createElement("STYLE");x.innerText="'+css+'"; document.getElementsByTagName("head")[0].appendChild(x) '} 
  )
}

function getDomain(url) {
  return /(?:[\w-]+\.)+[\w-]+/.exec(url)[0]
}

function createOption(str) {
  var elem = document.createElement('option')
  elem.value = str
  elem.innerHTML = str
  return elem
}

function populateDropdown(url) {
  var domains = document.getElementById('domains');
  var domain = getDomain(url);
  domains.appendChild(createOption(domain))
  loadCss(domain)
}

function loadCss(domain) {
  if (css = localStorage.getItem(domain)) {
    document.getElementById('css').value = css
  }
}

function bindSubmit() {
  document.getElementById('submit').addEventListener('click', ()=>{
    var css = document.getElementById('css').value;
    appendCss(css.replace(/\n/g,' '));    
  })
}  

function bindSave() {
  document.getElementById('save').addEventListener('click', ()=>{
    let css = document.getElementById('css').value;
    const selectedDomain =  document.getElementById('domains').value
    console.log('Saving css of ', selectedDomain, css);
    localStorage.setItem(selectedDomain, css)
  })
}

function init() {
  return new Promise((resolve) =>{
    getCurrentTabUrl().then(res=>{
      tab = res
      tabId = tab.id
      document.getElementById('app').innerHTML = JSON.stringify(tab)
      populateDropdown(tab.url)
      bindSubmit()
      bindSave()
      resolve()
    })
  });
} 

document.addEventListener('DOMContentLoaded', function() {
  init();
});
