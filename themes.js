// Design lab — theme switcher. Lives on the design-lab branch only; delete this file, themes.css and the
// two <link>/<script> lines in index.html when a direction is picked (then fold it into the main CSS).
(function(){
  const THEMES = [
    {id:'original',  label:'Original (current)'},
    {id:'broadcast', label:'1 · Broadcast'},
    {id:'sticker',   label:'2 · Sticker album'},
    {id:'chalk',     label:'3 · Chalk / tactics board'}
  ];
  const KEY = 'fr-theme';
  function get(){ try{ return localStorage.getItem(KEY) || 'original'; }catch(e){ return 'original'; } }
  function set(id){
    if(id === 'original') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', id);
    try{ localStorage.setItem(KEY, id); }catch(e){}
    render();
  }
  window.setTheme = set;

  // ?theme=sticker in the URL wins (handy for screenshots / sharing a link to one look)
  const q = new URLSearchParams(location.search).get('theme');
  if(q && THEMES.some(t => t.id === q)) set(q); else set(get());

  function render(){
    let box = document.getElementById('themeLab');
    if(!box){
      box = document.createElement('div'); box.id = 'themeLab';
      box.innerHTML = '<div class="menu"></div><button class="fab" type="button">🎨 Design</button>';
      document.body.appendChild(box);
      box.querySelector('.fab').addEventListener('click', () => box.classList.toggle('open'));
    }
    const cur = get();
    const menu = box.querySelector('.menu');
    menu.textContent = '';
    THEMES.forEach(t => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = t.label; if(t.id === cur) b.className = 'on';
      b.addEventListener('click', () => { set(t.id); box.classList.remove('open'); });
      menu.appendChild(b);
    });
  }
  if(document.body) render(); else document.addEventListener('DOMContentLoaded', render);
})();
