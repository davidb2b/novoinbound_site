(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var EN = (document.documentElement.lang||"").toLowerCase().indexOf("en")===0;
var T = EN ? {
  copiado:"Copied", falhou:"Could not copy", link:"Link copied", ref:"Citation copied",
  share:"What Is the New Inbound, Really?",
  leitura:function(n){return n+" min read"}, fim:"finished", falta:function(n){return n+" min left"}
} : {
  copiado:"Copiado", falhou:"N\\u00e3o foi poss\\u00edvel copiar", link:"Link copiado", ref:"Refer\\u00eancia copiada",
  share:"O que \\u00e9, afinal, o Novo Inbound?",
  leitura:function(n){return n+" min de leitura"}, fim:"leitura conclu\\u00edda", falta:function(n){return "faltam "+n+" min"}
};

/* ---------- toast ---------- */
var toastEl=$("#toast"), toastT;
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent=msg; toastEl.classList.add("on");
  clearTimeout(toastT); toastT=setTimeout(function(){toastEl.classList.remove("on")},2200);
}
function copiar(txt,msg){
  var ok=function(){toast(msg||T.copiado)};
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(ok).catch(function(){fallback(txt,ok)});
  } else fallback(txt,ok);
}
function fallback(txt,ok){
  try{
    var t=document.createElement("textarea");
    t.value=txt; t.setAttribute("readonly",""); t.style.position="absolute"; t.style.left="-9999px";
    document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); ok();
  }catch(e){ toast(T.falhou); }
}

/* ---------- links permanentes ---------- */
$$(".perma").forEach(function(b){
  b.addEventListener("click",function(){
    var a=b.getAttribute("data-anchor");
    copiar(location.origin+location.pathname+"#"+a,T.link);
    if(history.replaceState) history.replaceState(null,"","#"+a);
  });
});

/* ---------- compartilhar ---------- */
var sh=$("#share");
if(sh) sh.addEventListener("click",function(){
  var url=sh.getAttribute("data-url")||location.href;
  var dados={title:document.title,text:T.share,url:url};
  if(navigator.share){ navigator.share(dados).catch(function(){}); }
  else copiar(url,T.link);
});
var cpr=$("#cpref");
if(cpr) cpr.addEventListener("click",function(){
  var el=$("#refcan"); if(el) copiar(el.textContent.trim(),T.ref);
});
var cpl=$("#cplink");
if(cpl) cpl.addEventListener("click",function(){
  copiar(cpl.getAttribute("data-url")||location.href,T.link);
});

/* ---------- progresso e tempo restante ---------- */
var TOTAL=18, prog=$("#prog"), tbtime=$("#tbtime"), fim=$("#citar");
function medir(){
  var h=document.documentElement;
  var alvo = fim ? Math.max(1, fim.offsetTop - h.clientHeight*0.5) : Math.max(1,h.scrollHeight-h.clientHeight);
  var p=(window.pageYOffset||h.scrollTop)/alvo;
  if(p<0)p=0; if(p>1)p=1;
  if(prog) prog.style.width=(p*100).toFixed(2)+"%";
  if(tbtime){
    var t = p<0.02 ? T.leitura(TOTAL)
          : (p>=1 ? T.fim : T.falta(Math.max(1,Math.round(TOTAL*(1-p)))));
    if(tbtime.textContent!==t) tbtime.textContent=t;
  }
}

/* ---------- sumário ativo ---------- */
var secoes=["papel","origem","verdades","metodo","ciclo","metricas","faq","glossario"];
var links=$$("#tocside a");
function tocAtivo(){
  if(!links.length) return;
  var linha=window.innerHeight*0.35, cur=-1;
  secoes.forEach(function(id,i){
    var el=document.getElementById(id);
    if(el && el.getBoundingClientRect().top<=linha) cur=i;
  });
  links.forEach(function(a,i){
    if(i===cur) a.setAttribute("aria-current","true"); else a.removeAttribute("aria-current");
  });
}

/* ---------- ciclo acompanha a leitura ---------- */
var grupos=$$(".segg"), etapas=$$(".etapa"), atual=-1;
function ringSync(){
  if(!grupos.length||!etapas.length) return;
  var linha=window.innerHeight*0.42, cur=0;
  etapas.forEach(function(el,i){ if(el.getBoundingClientRect().top<=linha) cur=i; });
  if(cur===atual) return;
  atual=cur;
  grupos.forEach(function(g,j){ g.setAttribute("class", j===cur ? "segg on" : "segg"); });
}

var tick=false;
function onScroll(){
  if(tick) return; tick=true;
  window.requestAnimationFrame(function(){ medir(); tocAtivo(); ringSync(); tick=false; });
}
window.addEventListener("scroll",onScroll,{passive:true});
window.addEventListener("resize",onScroll,{passive:true});
medir(); tocAtivo(); ringSync();

/* ---------- FAQ ---------- */
var mobile = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
function abrir(btn,estado){
  var alvo=document.getElementById(btn.getAttribute("aria-controls"));
  if(!alvo) return;
  btn.setAttribute("aria-expanded", estado?"true":"false");
  if(estado) alvo.removeAttribute("hidden"); else alvo.setAttribute("hidden","");
}
$$(".qa-btn").forEach(function(btn,i){
  if(mobile) abrir(btn,false);
  btn.addEventListener("click",function(){
    abrir(btn, btn.getAttribute("aria-expanded")!=="true");
  });
});
function abrirPorHash(){
  var h=location.hash.replace("#","");
  if(!h) return;
  var alvo=document.getElementById(h);
  if(!alvo) return;
  var btn = alvo.classList && alvo.classList.contains("qa") ? $(".qa-btn",alvo) : null;
  if(!btn){
    var pai=alvo.closest ? alvo.closest(".qa") : null;
    if(pai) btn=$(".qa-btn",pai);
  }
  if(btn){ abrir(btn,true); setTimeout(function(){alvo.scrollIntoView({behavior: reduz?"auto":"smooth", block:"start"})},60); }
}
window.addEventListener("hashchange",abrirPorHash);
abrirPorHash();

/* ---------- sumario mobile abre por padrao em telas medias ---------- */
var tm=$("#tocmob");
if(tm && window.innerWidth>=760) tm.open=true;
})();

/* ---------- vercel web analytics ---------- */
(function(){var s=document.createElement("script");s.defer=true;s.src="/_vercel/insights/script.js";document.head.appendChild(s);})();
