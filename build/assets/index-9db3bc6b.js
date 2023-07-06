var K=Object.defineProperty;var V=(h,s,t)=>s in h?K(h,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[s]=t;var M=(h,s,t)=>(V(h,typeof s!="symbol"?s+"":s,t),t);import{a7 as T,a1 as D,a2 as F,c as r,j as e,aY as _,bl as u,a as J,aa as N,r as U,a3 as I,B as j,bd as Y,be as O,a8 as E,bg as q,a5 as A,b4 as P}from"./index-c20b5e8e.js";import{T as G}from"./index-83b0f9b6.js";import{g as H}from"./kitchen-60ac824b.js";import{R as x,C as o}from"./row-58ed805b.js";import{D as C}from"./index-98f1088d.js";import{T as Q}from"./Table-fe15f1b3.js";import"./Pagination-e2a53e90.js";import{F as W}from"./index-a86cfb93.js";import{I as g}from"./index-86d1917a.js";import{D as X}from"./index-1e692111.js";import"./styleChecker-a7b568e2.js";const z=async h=>{const s={method:"GET",endpoint:`/admin/material-log?kitchen=${h}`};return T(s).fetch()},Z=async h=>T({method:"POST",endpoint:"/admin/material-log",body:h}).fetch();var R;const m={border:"1px solid #e8e8e8",borderCollapse:"collapse",borderRadius:"10px",padding:"0.5em",textAlign:"center",textSize:"10px"},w={border:"1px solid #e8e8e8",borderCollapse:"collapse",borderRadius:"10px",padding:"0.5em",textAlign:"center",textSize:"10px",color:"red"},B={border:"1px solid #e8e8e8",borderCollapse:"collapse",borderRadius:"5px",padding:"0.5em",marginTop:"15px",display:"inline-table"},ee=[{type:"type1",title:"Dvoudílná 40mm"},{type:"type2",title:"Dvoudílná 50mm"},{type:"type3",title:"Dvoudílná 60mm"},{type:"type4",title:"Jednodílná 40mm"},{type:"type5",title:"Jednodílná 50mm"},{type:"type6",title:"Jednodílná 60mm"},{type:"type7",title:"Polevková zatavovací malá"},{type:"type8",title:"Polevková zatavovací velká"},{type:"type9",title:"Uzavírací krabička malá"},{type:"type10",title:"Uzavírací krabička velká"}],te=["breakfast","snack1","lunch","snack2","dinner"];function b(h=[],s="",{weekday:t="",meal:a="",type:n=""}){for(let i=0;i<h.length;i+=1)if(s===h[i].material&&(s==="stickers"&&t===h[i].weekday&&a===h[i].meal||s==="boxes"&&n===h[i].type||s==="packages"&&n===h[i].type||s==="menu"))return w;return m}let ae=D(R=class extends F.Component{constructor(){super(...arguments);M(this,"state",{})}render(){const{stickers:t,boxes:a,packages:n,menu:i,errors:c,intl:{formatMessage:l}}=this.props;return r("div",{children:[!t&&!a&&!n&&!i&&e(_,{}),r(x,{gutter:16,children:[t&&r(o,{md:10,sm:24,children:[e(C,{orientation:"center",children:l({id:"Materials.Stickers"})}),e("center",{children:e("table",{style:B,children:r("tbody",{children:[r("tr",{children:[e("th",{style:m,children:"-/-"}),e("th",{style:m,children:e(u,{id:"main.monday"})}),e("th",{style:m,children:e(u,{id:"main.tuesday"})}),e("th",{style:m,children:e(u,{id:"main.wednesday"})}),e("th",{style:m,children:e(u,{id:"main.thursday"})}),e("th",{style:m,children:e(u,{id:"main.friday"})}),e("th",{style:m,children:e(u,{id:"main.saturday"})})]}),te.map(d=>r("tr",{children:[e("th",{style:m,children:d}),e("td",{style:b(c,l({id:"Materials.stickers"}),{weekday:l({id:"Materials.monday"}),meal:d}),children:t.monday[d]}),e("td",{style:b(c,l({id:"Materials.stickers"}),{weekday:l({id:"Materials.tuesday"}),meal:d}),children:t.tuesday[d]}),e("td",{style:b(c,l({id:"Materials.stickers"}),{weekday:l({id:"Materials.wednesday"}),meal:d}),children:t.wednesday[d]}),e("td",{style:b(c,l({id:"Materials.stickers"}),{weekday:l({id:"Materials.thursday"}),meal:d}),children:t.thursday[d]}),e("td",{style:b(c,l({id:"Materials.stickers"}),{weekday:l({id:"Materials.friday"}),meal:d}),children:t.friday[d]}),e("td",{style:b(c,l({id:"Materials.stickers"}),{weekday:l({id:"Materials.saturday"}),meal:d}),children:t.saturday[d]})]},Math.random()))]})})})]}),a&&r(o,{md:6,sm:24,children:[e(C,{orientation:"center",children:l({id:"Materials.Boxes"})}),e("center",{children:e("table",{style:B,children:r("tbody",{children:[r("tr",{children:[e("th",{style:m,children:l({id:"Materials.Box"})}),e("th",{style:m,children:l({id:"Materials.Value"})})]}),[0,1,2,3,4,5,6,7,8,9].map(d=>r("tr",{children:[e("th",{style:m,children:ee[d].title}),e("td",{style:b(c,"boxes",{type:`type${d+1}`}),children:a[`type${d+1}`]})]},d))]})})})]}),n&&r(o,{md:6,sm:24,children:[e(C,{orientation:"center",children:l({id:"Materials.Menu / Packages"})}),e("center",{children:e("table",{style:B,children:r("tbody",{children:[r("tr",{children:[e("th",{style:m,children:l({id:"Materials.Menu"})}),e("th",{style:m,children:l({id:"Materials.Package Small"})}),e("th",{style:m,children:l({id:"Materials.Package Big"})})]}),r("tr",{children:[e("td",{style:b(c,"menu",{}),children:i}),e("td",{style:b(c,"packages",{type:"type1"}),children:n.type1}),e("td",{style:b(c,"packages",{type:"type2"}),children:n.type2})]},Math.random())]})})})]})]})]})}})||R;const ie=({logs:h})=>{const{formatMessage:s}=J(),t=[{title:s({id:"window.date"}),dataIndex:"date",key:"date",render:a=>N(a).format("DD.MM.YYYY")},{title:s({id:"Materials.Menu"}),dataIndex:"menu",key:"menu",render:a=>a},{title:s({id:"Materials.Pac small"}),dataIndex:"packages",key:"packages1",render:a=>a.type1},{title:s({id:"Materials.Pac big"}),dataIndex:"packages",key:"packages2",render:a=>a.type2},{title:s({id:"Materials.Box1"}),dataIndex:"boxes",key:"box1",render:a=>a.type1},{title:s({id:"Materials.Box2"}),dataIndex:"boxes",key:"box2",render:a=>a.type2},{title:s({id:"Materials.Box3"}),dataIndex:"boxes",key:"box3",render:a=>a.type3},{title:s({id:"Materials.Box4"}),dataIndex:"boxes",key:"box4",render:a=>a.type4},{title:s({id:"Materials.Box5"}),dataIndex:"boxes",key:"box5",render:a=>a.type5},{title:s({id:"Materials.Box6"}),dataIndex:"boxes",key:"box6",render:a=>a.type6},{title:s({id:"Materials.Box7"}),dataIndex:"boxes",key:"box7",render:a=>a.type7},{title:s({id:"Materials.Box8"}),dataIndex:"boxes",key:"box8",render:a=>a.type8},{title:s({id:"Materials.Box9"}),dataIndex:"boxes",key:"box9",render:a=>a.type9},{title:s({id:"Materials.Box10"}),dataIndex:"boxes",key:"box10",render:a=>a.type10}];return e("div",{children:e(x,{gutter:16,children:e(o,{md:24,sm:24,children:e(Q,{tableLayout:"auto",scroll:{x:"100%"},columns:t,dataSource:h,pagination:{position:"bottom",total:h.length,showTotal:(a,n)=>`${n[0]}-${n[1]} of ${a} items`,showSizeChanger:!0,pageSizeOptions:["10","20","50","100","200"],hideOnSinglePage:h.length<10},rowKey:()=>Math.random().toString()})})})})};var L;const se=[{type:"type1",title:"Dvoudílná 40mm"},{type:"type2",title:"Dvoudílná 50mm"},{type:"type3",title:"Dvoudílná 60mm"},{type:"type4",title:"Jednodílná 40mm"},{type:"type5",title:"Jednodílná 50mm"},{type:"type6",title:"Jednodílná 60mm"},{type:"type7",title:"Polevková zatavovací malá"},{type:"type8",title:"Polevková zatavovací velká"},{type:"type9",title:"Uzavírací krabička malá"},{type:"type10",title:"Uzavírací krabička velká"}],ne=["breakfast","snack1","lunch","snack2","dinner"];let re=D(L=class extends F.Component{constructor(t){super(t);M(this,"state",{stickers:{monday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},tuesday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},wednesday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},thursday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},friday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},saturday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0}},boxes:{type1:0,type2:0,type3:0,type4:0,type5:0,type6:0,type7:0,type8:0,type9:0,type10:0},packages:{type1:0,type2:0},menu:0});M(this,"formRef",U.createRef());this.onFinish=this.onFinish.bind(this),this.closeDrawer=this.closeDrawer.bind(this),this.onChangeSticker=this.onChangeSticker.bind(this),this.onChangeBox=this.onChangeBox.bind(this),this.onChangePackage=this.onChangePackage.bind(this)}onChangeSticker(t,a,n){const{stickers:i}=this.state;let c=t;t&&t.target&&(t.target.type==="checkbox"?c=t.target.checked:c=t.target.value),i[a][n]=c,this.setState({stickers:i})}onChangePackage(t,a){const{packages:n}=this.state;let i=t;t&&t.target&&(t.target.type==="checkbox"?i=t.target.checked:i=t.target.value),n[a]=i,this.setState({packages:n})}onChangeBox(t,a){const{boxes:n}=this.state;let i=t;t&&t.target&&(t.target.type==="checkbox"?i=t.target.checked:i=t.target.value),n[a]=i,this.setState({boxes:n})}onChangeMenu(t){let a=t;t.target&&(t.target.type==="checkbox"?a=t.target.checked:a=t.target.value),this.setState({menu:a})}async onFinish(){try{const{create:t,update:a,kitchen:n,intl:{formatMessage:i}}=this.props;await this.formRef.current.validateFields();const{stickers:c,packages:l,menu:d,boxes:f}=this.state,S=await t({stickers:c,packages:l,menu:d,boxes:f,kitchen:n});S.status===200?(a(),this.closeDrawer(),I.success({message:i({id:"window.success"}),description:i({id:"Materials.Data added successfully!"})})):I.error({message:i({id:"window.error"}),description:S.statusText,placement:"topLeft"})}catch(t){console.log("Failed:",t)}}closeDrawer(){const{onClose:t}=this.props;t(),this.setState({stickers:{monday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},tuesday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},wednesday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},thursday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},friday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0},saturday:{breakfast:0,snack1:0,lunch:0,snack2:0,dinner:0}},boxes:{type1:0,type2:0,type3:0,type4:0,type5:0,type6:0,type7:0,type8:0,type9:0,type10:0},packages:{type1:0,type2:0},menu:0}),this.formRef.current.resetFields()}render(){const{visible:t,kitchen:a,kitchens:n,intl:{formatMessage:i}}=this.props,{stickers:c,packages:l,menu:d,boxes:f}=this.state,p={padding:"0.5em",textAlign:"center",textSize:"10px"},S=n.find(y=>y.id===a);return e(X,{title:i({id:"Materials.Add material log"}),width:"50%",onClose:this.closeDrawer,open:t,bodyStyle:{paddingBottom:80},children:r(W,{ref:this.formRef,layout:"vertical",onFinish:this.onFinish,children:[r("span",{style:{marginRight:"15px",fontSize:"18px"},children:[i({id:"Materials.Kitchen: "}),S?S.name:"Unknown"]}),e(j,{type:"primary",onClick:this.onFinish,children:i({id:"window.create"})}),r(x,{gutter:16,children:[r(o,{md:24,sm:24,children:[e(C,{orientation:"center",children:i({id:"Materials.Menu / Packages"})}),r("center",{children:[r(x,{gutter:16,children:[e(o,{md:5,sm:8,style:p,children:e("b",{children:i({id:"Materials.Menu"})})}),e(o,{md:5,sm:8,style:p,children:e("b",{children:i({id:"Materials.Package Small"})})}),e(o,{md:5,sm:8,style:p,children:e("b",{children:i({id:"Materials.Package Big"})})})]}),r(x,{gutter:16,children:[e(o,{style:p,lg:5,sm:8,children:e(g,{onChange:y=>this.onChangeMenu(y),value:d})}),e(o,{style:p,lg:5,sm:8,children:e(g,{onChange:y=>this.onChangePackage(y,"type1"),value:l.type1})}),e(o,{style:p,lg:5,sm:8,children:e(g,{onChange:y=>this.onChangePackage(y,"type2"),value:l.type2})})]})]}),e(C,{orientation:"center",children:i({id:"Materials.Stickers"})}),r(x,{gutter:16,children:[e(o,{style:p,md:4,children:e("b",{children:e(u,{id:"main.monday"})})}),e(o,{md:4,style:p,children:e("b",{children:e(u,{id:"main.tuesday"})})}),e(o,{md:4,style:p,children:e("b",{children:e(u,{id:"main.wednesday"})})}),e(o,{md:4,style:p,children:e("b",{children:e(u,{id:"main.thursday"})})}),e(o,{md:4,style:p,children:e("b",{children:e(u,{id:"main.friday"})})}),e(o,{md:4,style:p,children:e("b",{children:e(u,{id:"main.saturday"})})})]}),ne.map(y=>r(x,{gutter:16,children:[e(o,{style:p,md:4,children:e(g,{onChange:k=>this.onChangeSticker(k,"monday",y),value:c.monday[y]})}),e(o,{style:p,md:4,children:e(g,{onChange:k=>this.onChangeSticker(k,"tuesday",y),value:c.tuesday[y]})}),e(o,{style:p,md:4,children:e(g,{onChange:k=>this.onChangeSticker(k,"wednesday",y),value:c.wednesday[y]})}),e(o,{style:p,md:4,children:e(g,{onChange:k=>this.onChangeSticker(k,"thursday",y),value:c.thursday[y]})}),e(o,{style:p,md:4,children:e(g,{onChange:k=>this.onChangeSticker(k,"friday",y),value:c.friday[y]})}),e(o,{style:p,md:4,children:e(g,{onChange:k=>this.onChangeSticker(k,"saturday",y),value:c.saturday[y]})})]},Math.random()))]}),r(o,{md:24,sm:24,children:[e(C,{orientation:"center",children:i({id:"Materials.Boxes"})}),r("center",{children:[r(x,{gutter:16,children:[e(o,{md:5,sm:12,style:p,children:e("b",{children:i({id:"Materials.Box"})})}),e(o,{md:5,sm:12,style:p,children:e("b",{children:i({id:"Materials.Value"})})})]}),[0,1,2,3,4,5,6,7,8,9].map(y=>r(x,{gutter:16,children:[e(o,{style:p,lg:5,sm:12,children:se[y].title}),e(o,{style:p,lg:5,sm:12,children:e(g,{onChange:k=>this.onChangeBox(k,`type${y+1}`),value:f[`type${y+1}`]})})]},y))]})]})]})]})})}})||L;var $,v;const{Option:de}=A;let ve=($=Y(({user:h})=>({user:h})),D(v=O(v=$(v=class extends F.Component{constructor(t){super(t);M(this,"state",{loading:!0,createFormVisible:!1,logs:[],errors:[],kitchens:[],kitchen:""});M(this,"showCreateForm",()=>{this.setState({createFormVisible:!0})});M(this,"onCloseCreateForm",()=>{this.setState({createFormVisible:!1})});M(this,"setKitchen",async t=>{this.setState({kitchen:t.key}),z(t.key).then(async a=>{if(a.status===200){const n=await a.json();this.setState({logs:n.result,errors:n.errors,loading:!1})}})});this.update=this.update.bind(this)}componentDidMount(){this.update()}update(){this.setState({loading:!0});let t="";H().then(async a=>{const n=await a.json();t=n[0].id,this.setState({kitchens:n,kitchen:n[0].id})}),setTimeout(()=>{z(t).then(async a=>{if(a.status===200){const n=await a.json();this.setState({logs:n.result,errors:n.errors,loading:!1})}})},300)}render(){const{loading:t,logs:a,createFormVisible:n,errors:i,kitchen:c,kitchens:l}=this.state,{intl:{formatMessage:d}}=this.props;return e(E,{roles:["root","admin","sales","salesDirector"],redirect:!0,to:"/main",children:r("div",{children:[e(q,{title:d({id:"Materials.Material logs"})}),r("div",{className:"card",children:[e("div",{className:"card-header",children:e("div",{className:"utils__title",children:e("strong",{children:d({id:"Materials.Material log"})})})}),r("div",{className:"card-body",children:[e("h4",{children:d({id:"Materials.Kitchen"})}),r("div",{style:{marginTop:"15px",marginBottom:"15px"},children:[e(A,{labelInValue:!0,style:{width:"115px",marginRight:"30px"},onChange:this.setKitchen,value:{key:c},placeholder:d({id:"Materials.Select"}),children:l.map(f=>e(de,{value:f.id,children:f.name},f.id))}),e(j,{type:"primary",onClick:()=>this.showCreateForm(),children:d({id:"Materials.Create log"})})]}),e(G,{defaultActiveKey:"1",items:[{label:d({id:"Materials.Statistics"}),key:"1",children:e(P,{spinning:t,children:!t&&e(ae,{stickers:a[0]?a[0].stickers:void 0,boxes:a[0]?a[0].boxes:void 0,packages:a[0]?a[0].packages:void 0,menu:a[0]?a[0].menu:0,errors:i})})},{label:d({id:"Materials.Logs"}),key:"2",children:e(P,{spinning:t,children:!t&&e(ie,{logs:a})})}]})]})]}),e(re,{visible:n,onClose:this.onCloseCreateForm,create:Z,update:this.update,kitchens:l,kitchen:c})]})})}})||v)||v)||v);export{ve as default};
