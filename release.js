const repository='FARS1803/nexo-descargas';
const expected='Nexo-Instalador.exe';
const button=document.querySelector('#download-button');
const state=document.querySelector('#release-state');
async function loadRelease(){
  try{
    const response=await fetch(`https://api.github.com/repos/${repository}/releases/latest`,{headers:{Accept:'application/vnd.github+json'}});
    if(!response.ok)throw Error('Sin versión publicada');
    const release=await response.json();
    if(release.draft||release.prerelease||!/^v?\d+\.\d+\.\d+$/.test(release.tag_name))throw Error('Sin versión estable');
    const asset=release.assets?.find(item=>item.name===expected);
    const url=new URL(asset?.browser_download_url||'');
    if(url.origin!=='https://github.com'||!url.pathname.startsWith(`/${repository}/releases/download/`)||!url.pathname.endsWith('/'+expected)||url.search||url.hash)throw Error('Descarga no verificada');
    button.href=url.href;button.classList.remove('is-disabled');button.removeAttribute('aria-disabled');
    button.innerHTML=`Descargar Nexo ${release.tag_name.replace(/^v/,'')} <span aria-hidden="true">↗</span>`;
    state.textContent=`Versión ${release.tag_name.replace(/^v/,'')} disponible`;
  }catch{
    state.textContent='La descarga pública aún no está disponible';
    button.textContent='Descarga en preparación';
  }
}
button.addEventListener('click',event=>{if(button.getAttribute('aria-disabled')==='true')event.preventDefault();});
loadRelease();
