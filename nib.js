(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- toast ---------- */
var toastEl=$("#toast"), toastT;
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent=msg; toastEl.classList.add("on");
  clearTimeout(toastT); toastT=setTimeout(function(){toastEl.classList.remove("on")},2200);
}
function copiar(txt,msg){
  var ok=function(){toast(msg||"Copiado")};
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(ok).catch(function(){fallback(txt,ok)});
  } else fallback(txt,ok);
}
function fallback(txt,ok){
  try{
    var t=document.createElement("textarea");
    t.value=txt; t.setAttribute("readonly",""); t.style.position="absolute"; t.style.left="-9999px";
    document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); ok();
  }catch(e){ toast("Não foi possível copiar"); }
}

/* ---------- links permanentes ---------- */
$$(".perma").forEach(function(b){
  b.addEventListener("click",function(){
    var a=b.getAttribute("data-anchor");
    copiar(location.origin+location.pathname+"#"+a,"Link copiado");
    if(history.replaceState) history.replaceState(null,"","#"+a);
  });
});

/* ---------- compartilhar ---------- */
var sh=$("#share");
if(sh) sh.addEventListener("click",function(){
  var url=sh.getAttribute("data-url")||location.href;
  var dados={title:document.title,text:"O que é, afinal, o Novo Inbound?",url:url};
  if(navigator.share){ navigator.share(dados).catch(function(){}); }
  else copiar(url,"Link copiado");
});
var cpr=$("#cpref");
if(cpr) cpr.addEventListener("click",function(){
  var el=$("#refcan"); if(el) copiar(el.textContent.trim(),"Referência copiada");
});
var cpl=$("#cplink");
if(cpl) cpl.addEventListener("click",function(){
  copiar(cpl.getAttribute("data-url")||location.href,"Link copiado");
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
    var t = p<0.02 ? TOTAL+" min de leitura"
          : (p>=1 ? "leitura concluída" : "faltam "+Math.max(1,Math.round(TOTAL*(1-p)))+" min");
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

/* ---------- ferramenta 1: maturidade ---------- */
var f1=$("#f1");
if(f1){
  var f1bar=$("#f1bar"), f1prog=$("#f1prog"), f1go=$("#f1go"), f1re=$("#f1re"), f1res=$("#f1res");
  var NIVEIS={
    A:{ nome:"Maturidade de problema",
        txt:"O seu mercado sente o efeito, mas ainda não reconhece claramente o problema nem a consequência dele. A comunicação precisa ajudar o comprador a interpretar o que está acontecendo antes de falar em solução.",
        msg:["Nomear o problema e a consequência dele no negócio, não o produto.","Falar da situação que o comprador vive, com as palavras que ele usa.","Evitar vocabulário de categoria que o mercado ainda não domina."],
        con:["Conteúdo que explica o mecanismo do problema.","Dados e observações de mercado que dão nome ao que ele sente.","Presença em canais amplos, onde a educação começa: podcast, vídeo, conteúdo de especialistas."],
        pro:["Histórias de empresas que viviam a mesma situação.","Números do custo de conviver com o problema.","Diagnóstico que ajuda o comprador a se enxergar."] },
    B:{ nome:"Maturidade de categoria",
        txt:"O seu mercado reconhece o problema e começa a avaliar formas de resolvê-lo. A comunicação precisa explicar a categoria, comparar alternativas e mostrar por que os caminhos atuais são insuficientes.",
        msg:["Explicar o que a categoria resolve e o que ela não resolve.","Comparar com a alternativa real: planilha, processo manual ou solução adjacente.","Mostrar o limite do caminho que ele usa hoje."],
        con:["Comparativos e conteúdo definicional.","Critérios de avaliação que o comprador pode usar sozinho.","Materiais que ajudam a construir consenso interno."],
        pro:["Casos com o antes e o depois da adoção da categoria.","Demonstrações do que muda na operação.","Referências de pares do mesmo segmento."] },
    C:{ nome:"Maturidade de produto",
        txt:"O seu mercado reconhece o problema e entende a categoria. A disputa acontece entre fornecedores. A comunicação precisa demonstrar diferença, prova, segurança e adequação.",
        msg:["Afirmar o diferencial que você consegue provar, e só ele.","Responder objeções de risco, implementação e adequação.","Deixar claro para quem você não é a melhor escolha."],
        con:["Comparativos diretos com alternativas do mercado.","Conteúdo de implementação, integração e suporte.","Materiais que sustentam a decisão dentro do comitê."],
        pro:["Casos com números verificáveis.","Provas de segurança, integração e continuidade.","Clientes dispostos a falar com o comprador."] },
    M:{ nome:"Resultado misto",
        txt:"As respostas não convergem para um único nível. Isso é normal e costuma revelar diferenças entre segmentos, entre participantes do comitê ou entre situações de compra.",
        msg:["Separar a mensagem por segmento ou por papel dentro do comitê.","Não tentar falar com todos os níveis na mesma peça.","Escolher um nível como principal e tratar os outros como camadas de apoio."],
        con:["Mapear em qual nível está cada segmento antes de decidir o calendário.","Manter conteúdo de problema para criar demanda e conteúdo de produto para captura.","Rodar entrevistas para descobrir onde está a diferença."],
        pro:["Entrevistas com clientes recentes.","Análise das objeções por segmento.","Revisão dos motivos de ganho e de perda."] }
  };
  var respostas={};
  function f1estado(){
    var n=Object.keys(respostas).length;
    if(f1bar) f1bar.style.width=(n/4*100)+"%";
    if(f1prog) f1prog.textContent=n+" de 4 respondidas";
    if(f1go) f1go.disabled = n<4;
  }
  $$("input[type=radio]",f1).forEach(function(inp){
    inp.addEventListener("change",function(){
      respostas[inp.name]=inp.value;
      $$("input[name="+inp.name+"]",f1).forEach(function(o){
        var lab=o.closest("label"); if(lab) lab.classList.toggle("on",o.checked);
      });
      f1estado();
    });
  });
  f1estado();
  if(f1go) f1go.addEventListener("click",function(){
    var c={A:0,B:0,C:0};
    ["q1","q2","q3","q4"].forEach(function(k){ if(respostas[k]) c[respostas[k]]++; });
    var max=Math.max(c.A,c.B,c.C);
    var vencedores=["A","B","C"].filter(function(k){return c[k]===max});
    var chave = (max>=3 || (max===2 && vencedores.length===1)) ? vencedores[0] : "M";
    if(vencedores.length>1) chave="M";
    var n=NIVEIS[chave];
    f1res.innerHTML =
      '<div class="res"><span class="lbl">Resultado</span><h4>'+n.nome+'</h4>'+
      '<p>'+n.txt+'</p>'+
      '<p style="font-size:14px;color:#8f877a">Contagem: '+c.A+" em A, "+c.B+" em B, "+c.C+' em C.</p>'+
      '<h5>Mensagem</h5><ul><li>'+n.msg.join("</li><li>")+'</li></ul>'+
      '<h5>Conteúdo</h5><ul><li>'+n.con.join("</li><li>")+'</li></ul>'+
      '<h5>Prova</h5><ul><li>'+n.pro.join("</li><li>")+'</li></ul>'+
      '<p style="font-size:14.5px">Use isto como orientação. Uma leitura confiável exige entrevistas com clientes, análise de concorrência e observação das conversas comerciais.</p></div>';
    if(f1re) f1re.hidden=false;
    f1res.scrollIntoView({behavior: reduz?"auto":"smooth", block:"nearest"});
  });
  if(f1re) f1re.addEventListener("click",function(){
    respostas={}; f1.reset();
    $$("label.opt",f1).forEach(function(l){l.classList.remove("on")});
    f1res.innerHTML=""; f1re.hidden=true; f1estado();
    f1.scrollIntoView({behavior: reduz?"auto":"smooth", block:"start"});
  });
}

/* ---------- ferramenta 2: camadas de metrica ---------- */
var f2=$("#f2");
if(f2){
  var CAM={inv:"Invisível",vis:"Visível",int:"De intenção"};
  var TATICAS=[
    {id:"podcast",n:"Podcast próprio",c:["inv"],lim:"Gera quase 100% de métrica invisível. Isso não quer dizer que a tática não funciona, quer dizer que ela está cumprindo o papel dela, que é educar e criar demanda no invisível."},
    {id:"yt",n:"Vídeo no YouTube",c:["inv"],lim:"Views e retenção. Você sabe que aconteceu e quanto aconteceu, mas não sabe o nome de ninguém."},
    {id:"tl",n:"Post de thought leader no LinkedIn",c:["inv","vis"],lim:"A impressão é invisível. A curtida e o comentário viram visível, com identidade, cargo, empresa e setor. É outro nível de leitura."},
    {id:"pagina",n:"Página da empresa no LinkedIn",c:["inv","vis"],lim:"Mesma lógica do thought leader, com alcance orgânico normalmente menor."},
    {id:"paga",n:"Mídia paga",c:["inv"],lim:"Impressão de campanha. Serve para alcance e frequência, não para saber quem é."},
    {id:"news",n:"Newsletter",c:["inv","int"],lim:"Visualizações e salvamentos são invisíveis. A inscrição é intenção baixa, porque a pessoa deu o contato em troca de algo."},
    {id:"comunidade",n:"Comunidade",c:["vis"],lim:"Quem participa e interage tem nome. Sinal rico e lento, para ler como relacionamento."},
    {id:"visit",n:"Visitor tracking no site",c:["vis"],lim:"Diz a empresa, não a pessoa. Ela não entregou o dado, mas o comportamento disse o nome da conta."},
    {id:"evento",n:"Evento",c:["vis"],lim:"Alto contexto e baixo volume. A conversa vale mais que a lista de presença."},
    {id:"magnet",n:"Lead magnet",c:["int"],lim:"Intenção baixa. A pessoa deu o contato em troca de algo, não necessariamente pra conversar com você."},
    {id:"webinar",n:"Webinar",c:["int"],lim:"Intenção baixa. A disposição real de comprar ainda está baixa, porque ainda é educação."},
    {id:"form",n:"Formulário de contato comercial",c:["int"],lim:"Intenção alta. Aqui a pessoa pediu, não foi o marketing que graduou ela num score."},
    {id:"demo",n:"Pedido de demo",c:["int"],lim:"Intenção alta e o sinal mais raro dos três."}
  ];
  var f2go=$("#f2go"), f2re=$("#f2re"), f2res=$("#f2res");
  function sel(){ return $$("input[name=t]:checked",f2).map(function(i){return i.value}); }
  function f2estado(){
    $$("input[name=t]",f2).forEach(function(i){var l=i.closest("label"); if(l) l.classList.toggle("on",i.checked)});
    if(f2go) f2go.disabled = sel().length===0;
  }
  f2.addEventListener("change",f2estado); f2estado();
  if(f2go) f2go.addEventListener("click",function(){
    var ids=sel(), esc=TATICAS.filter(function(t){return ids.indexOf(t.id)>-1});
    var tem={inv:false,vis:false,int:false};
    esc.forEach(function(t){t.c.forEach(function(k){tem[k]=true})});
    var cegos=[];
    if(!tem.inv) cegos.push("Nenhuma tática sua gera métrica invisível. E é justamente no invisível que a maior parte da educação do comprador B2B acontece. Você está lendo o fim do processo, não o começo.");
    if(!tem.vis) cegos.push("Nenhuma tática sua gera métrica visível. Sem isso não dá para saber quem do ICP está prestando atenção, e sobra esperar o formulário para descobrir que a pessoa existe.");
    if(!tem.int) cegos.push("Nenhuma tática sua gera métrica de intenção. Não existe porta para quem já quer falar com você.");
    if(tem.int && !tem.inv && !tem.vis) cegos.push("Você só enxerga quem levantou a mão. Isso é captura de demanda, não criação.");
    if(tem.inv && !tem.vis && !tem.int) cegos.push("Você cria demanda e não consegue ler nada além do agregado. Falta a ponte entre o invisível e a conversa.");
    if(!cegos.length) cegos.push("As três camadas estão cobertas. O trabalho agora é cruzar as três e ler a penetração de mercado como um sistema, e não olhar cada número separado.");
    var linhas = esc.map(function(t){
      return '<li><p class="nm">'+t.n+'</p>'+
        t.c.map(function(k){return '<span class="tag c-'+k+'">'+CAM[k]+'</span>'}).join("")+
        '<p class="lim">'+t.lim+'</p></li>';
    }).join("");
    var cont={inv:0,vis:0,int:0};
    esc.forEach(function(t){t.c.forEach(function(k){cont[k]++})});
    f2res.innerHTML='<div class="res"><span class="lbl">O que você consegue ler</span>'+
      '<h4>'+esc.length+(esc.length===1?" tática selecionada":" táticas selecionadas")+'</h4>'+
      '<p>Invisível em '+cont.inv+', visível em '+cont.vis+' e de intenção em '+cont.int+'.</p>'+
      '<ul class="rowlist" style="padding-left:0">'+linhas+'</ul>'+
      '<h5>Pontos cegos</h5><ul class="cegos"><li>'+cegos.join("</li><li>")+'</li></ul>'+
      '<p style="font-size:14.5px">Lembre da regra: você tem que olhar as três camadas de métricas de frente pras táticas que está rodando. Sempre.</p></div>';
    if(f2re) f2re.hidden=false;
    f2res.scrollIntoView({behavior: reduz?"auto":"smooth", block:"nearest"});
  });
  if(f2re) f2re.addEventListener("click",function(){ f2.reset(); f2estado(); f2res.innerHTML=""; f2re.hidden=true; });
}

/* ---------- sumario mobile abre por padrao em telas medias ---------- */
var tm=$("#tocmob");
if(tm && window.innerWidth>=760) tm.open=true;
})();

/* ---------- vercel web analytics ---------- */
(function(){var s=document.createElement("script");s.defer=true;s.src="/_vercel/insights/script.js";document.head.appendChild(s);})();
