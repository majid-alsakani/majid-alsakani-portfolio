/* Signal Now: renders verified current work from a small, editable local data source. */
(function(){
  var root=document.documentElement,year=document.getElementById("year"),grid=document.querySelector("[data-now-grid]"),meta=document.querySelector("[data-now-meta]"),stack=document.querySelector("[data-now-stack]");
  if(year)year.textContent=new Date().getFullYear();
  function text(tag,value,className){var node=document.createElement(tag);node.textContent=value;if(className)node.className=className;return node}
  function render(data){
    if(meta){meta.innerHTML="";[["LAST UPDATE",data.updatedLabel],["BASE",data.base],["COLLABORATION",data.availability]].forEach(function(pair){var item=document.createElement("div");item.append(text("b",pair[0]),text("span",pair[1]));meta.append(item)})}
    if(grid){grid.innerHTML="";data.projects.forEach(function(project,index){var card=document.createElement("article");card.className="sn-card";card.dataset.index="0"+(index+1);card.append(text("span",project.label,"sn-card-label"),text("h3",project.title),text("p",project.description));if(project.href){var link=text("a",project.linkLabel+" ↗");link.href=project.href;card.append(link)}grid.append(card)})}
    if(stack){stack.innerHTML="";data.stack.forEach(function(item){stack.append(text("span",item))})}
  }
  var source=document.body.dataset.nowSource;if(!source||!window.fetch)return;fetch(source).then(function(response){if(!response.ok)throw new Error("Now data unavailable");return response.json()}).then(render).catch(function(){if(grid)grid.innerHTML="<p class='sn-fallback'>Current work details are being refreshed. Please check back shortly.</p>"});
})();
