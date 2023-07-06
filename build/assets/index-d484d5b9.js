import{r as c,u as G,a as U,j as e,c as d,bp as ae,I as _,a5 as q,aa as oe,a6 as R,B as I,a3 as P,a7 as $,aW as se,a8 as re,b0 as N}from"./index-c20b5e8e.js";import{T as ie}from"./Table-fe15f1b3.js";import"./Pagination-e2a53e90.js";import{P as ne}from"./index-67f4e7c4.js";import{D as ce}from"./index-1e692111.js";import{F as m}from"./index-a86cfb93.js";import{R as y,C as v}from"./row-58ed805b.js";import{I as Y}from"./index-86d1917a.js";import"./PickerPanel-72c5d64a.js";/* empty css              */import{D as de}from"./index-2f7554ca.js";import{i as le,u as me}from"./dates-bfaafc52.js";import"./styleChecker-a7b568e2.js";import"./index-8e340a60.js";import"./constants-480696f2.js";const{Option:B}=q,he="DD.MM.YYYY",z={code:"",type:"fixedAmount",amount:"",deactivateAfterApply:!1,expirationDate:null,maxActivations:0,access:"",branchIds:[],isEdit:!1,isActive:!0},pe=({visible:h,create:p,update:x,edit:M,forEdit:n,onClose:k})=>{const[u]=m.useForm(),[r,l]=c.useState(z),{branches:S}=G(a=>a.settings),{formatMessage:i}=U(),A=async()=>{try{await u.validateFields();const a={...r,active:!!r.isActive,expirationDate:r.expirationDate?r.expirationDate.toISOString():null};if(n.id){const f=await M(n.id,a);f.status===200?(C(),P.success({message:i({id:"Promo.Saved"}),description:i({id:"Promo.PromoCodeSuccessfullySaved!"})}),await x()):P.error({message:i({id:"window.error"}),description:f.statusText,placement:"topLeft"})}else{const f=await p(a);f.status===201?(C(),P.success({message:i({id:"Promo.Created"}),description:i({id:"Promo.Promocode successfully created!"})}),await x()):P.error({message:i({id:"window.error"}),description:f.statusText,placement:"topLeft"})}}catch({errors:a}){P.error({message:i({id:"window.error"}),description:"Please fill all required fields",placement:"topLeft"})}},b=()=>{n&&l({isEdit:!0,code:n.code,type:n.type,amount:n.amount,deactivateAfterApply:n.deactivateAfterApply,expirationDate:n.expirationDate?le(n.expirationDate):null,maxActivations:n.maxActivations,access:n.access,branchIds:n.branchIds,isActive:n.active})},C=()=>{l(z),u.resetFields(),k()};let F=1080;return typeof window.innerWidth<"u"&&(F=window.innerWidth),n.id&&!r.isEdit&&b(),c.useEffect(()=>{u.setFieldsValue({code:r.code,amount:r.amount,maxActivations:r.maxActivations,access:r.access,branchIds:r.branchIds,expirationDate:r.expirationDate})},[r]),e(ce,{title:n.id?i({id:"Promo.Edit a promocode"}):i({id:"Promo.Create a new promocode"}),width:F<768?"100%":"auto",onClose:C,open:h,bodyStyle:{paddingBottom:80},children:d(m,{form:u,layout:"vertical",onFinish:A,children:[!n.id&&d(ae,{children:[e(y,{gutter:16,children:e(v,{md:24,sm:24,children:e(m.Item,{label:"Code",name:"code",rules:[{required:!0}],children:e(_,{placeholder:"Please enter code",onChange:a=>l({...r,code:a.target.value})})})})}),e(y,{gutter:16,children:e(v,{md:24,sm:24,children:e(m.Item,{name:"type",label:"Type",rules:[{required:!0,message:i({id:"Promo.Please choose the type"})}],children:d(q,{placeholder:"Please choose the type",onChange:a=>l({...r,type:a}),children:[e(B,{value:"fixedAmount",children:i({id:"Promo.Fixed amount"})},"fixedAmount"),e(B,{value:"percentage",children:i({id:"Promo.Percentage"})},"percentage")]})})})}),e(y,{gutter:16,children:e(v,{md:24,sm:24,children:e(m.Item,{label:"Amount",name:"amount",rules:[{required:!0}],children:e(Y,{style:{width:"100%"},placeholder:i({id:"Promo.Amount"}),onChange:a=>l({...r,amount:a})})})})})]}),e(y,{gutter:16,children:d(v,{md:24,sm:24,children:[e(m.Item,{style:{marginBottom:"0px"},label:"Maximum activations",name:"maxActivations",rules:[{required:!0}],children:e(Y,{style:{width:"100%"},min:0,placeholder:i({id:"Promo.maxActivations"}),onChange:a=>l({...r,maxActivations:a})})}),e("span",{style:{display:"block",marginBottom:"25px"},children:i({id:"Promo.Value of 0 is an unlimited activations"})})]})}),e(y,{gutter:16,children:e(v,{md:24,sm:24,children:e(m.Item,{label:"Access",name:"access",rules:[{required:!0}],children:e(q,{style:{width:"100%"},placeholder:"Access",onChange:a=>l({...r,access:a}),children:["sales","all","customers"].map(a=>e(B,{value:a,children:a},a))})})})}),e(y,{gutter:16,children:e(v,{md:24,sm:24,children:e(m.Item,{label:"Branches",name:"branchIds",rules:[{required:!0}],children:e(q,{style:{width:"100%"},placeholder:"Branches",mode:"multiple",onChange:a=>l({...r,branchIds:a}),children:S&&S.map(({id:a,name:f,countryIsoCode:T})=>d(B,{value:a,children:[f," (",T,")"]},a))})})})}),e(y,{gutter:16,children:e(v,{md:24,sm:24,children:e(m.Item,{label:"Expiration date",name:"expirationDate",rules:[{required:!1}],children:e(de,{style:{width:"100%"},format:he,disabledDate:a=>a&&a<oe.utc().add(-1,"days"),onChange:a=>l({...r,expirationDate:a})})})})}),!n.id&&e(y,{gutter:16,children:e(v,{md:24,sm:24,children:e(m.Item,{name:"deactivateAfterApply",children:e(R,{checked:r.deactivateAfterApply,onChange:a=>l({...r,deactivateAfterApply:a.target.checked}),children:i({id:"Promo.Deactivate after apply"})})})})}),n.id&&e(y,{gutter:16,children:e(v,{md:24,sm:24,children:e(m.Item,{name:"active",children:e(R,{checked:r.isActive,onChange:a=>l({...r,isActive:a.target.checked}),children:i({id:"Promo.Active"})})})})}),e("div",{className:"form-actions",children:d(m.Item,{children:[e(I,{style:{width:150},type:"primary",htmlType:"submit",className:"mr-3",children:n.id?i({id:"window.save"}):i({id:"window.create"})}),e(I,{onClick:C,children:i({id:"window.cancel"})})]})})]})})},W=async(h="all")=>{const p={method:"GET",endpoint:`/admin/promo?status=${h}`};return $(p).fetch()},ue=async h=>{const p={method:"DELETE",endpoint:`/admin/promo/${h}`};return $(p).fetch()},fe=async h=>$({method:"POST",endpoint:"/admin/promo",body:h}).fetch(),ge=async(h,p)=>{const x={method:"PUT",endpoint:`/admin/promo/${h}`,body:p};return $(x).fetch()},Ne=()=>{const[h,p]=c.useState([]),[x,M]=c.useState([]),[n,k]=c.useState(!1),[u,r]=c.useState(""),[l,S]=c.useState(!1),[i,A]=c.useState(!1),[b,C]=c.useState("all"),[F,a]=c.useState(!1),[f,T]=c.useState({}),{branches:K}=G(t=>t.settings),j=c.useRef(),o=U(),L=c.useCallback(async()=>{try{A(!0);const s=await(await W(b)).json();p(s.result),M(s.result)}catch{P.error({message:o.formatMessage({id:"window.error"}),description:"Failed to get Promo-codes"})}},[o,b]),H=t=>{r(t.target.value)},V=()=>{const t=new RegExp(u,"gi");k(!1),S(!!u);const s=h.map(w=>{const g=w.code.match(t);return g?{...w,name:e("span",{children:w.code.split(t).map((D,te)=>te>0?[e("span",{className:"highlight",children:g[0]},D),D]:D)})}:null}).filter(w=>!!w);M(s),u===""&&S(!1)},J=t=>{C(t.target.value)},Q=()=>{a(!0)},X=t=>{T(t),a(!0)},Z=()=>{T({}),a(!1)},O=async()=>{try{A(!0);const s=await(await W(b)).json();p(s.result),M(s.result)}catch{P.error({message:o.formatMessage({id:"window.error"}),description:"Failed to update Promo-codes"})}finally{A(!1)}},E=async t=>{const s=await ue(t);s.status===204?(P.success({message:o.formatMessage({id:"window.success"}),description:o.formatMessage({id:"Promo.Promocode successfully removed!"})}),await O()):P.error({message:o.formatMessage({id:"window.error"}),description:s.statusText})},ee=[{title:o.formatMessage({id:"Promo.Code"}),dataIndex:"code",key:"code",render:t=>e("span",{children:t}),filterDropdown:d("div",{className:"custom-filter-dropdown",children:[e(_,{ref:j,placeholder:o.formatMessage({id:"Promo.Search name"}),value:u,onChange:H,onPressEnter:V}),e(I,{type:"primary",onClick:V,style:{marginTop:"5px"},children:o.formatMessage({id:"Promo.Search"})})]}),filterIcon:e(se,{style:{color:l?"#108ee9":"#aaa"}}),isFilterDropdownVisible:n,onFilterDropdownVisibleChange:t=>{k(t),t&&j.current.focus()}},{title:o.formatMessage({id:"Promo.Created"}),dataIndex:"created",key:"created",render:t=>e("span",{children:t})},{title:o.formatMessage({id:"Promo.expirationDate"}),dataIndex:"expirationDate",key:"expirationDate",render:(t,s)=>e("span",{children:s.expirationDate?me(s.expirationDate):""})},{title:o.formatMessage({id:"Promo.Type"}),dataIndex:"type",key:"type",render:t=>e("span",{children:t})},{title:o.formatMessage({id:"Promo.Amount"}),dataIndex:"amount",key:"amount",render:t=>e("span",{children:`${t}`}),sorter:(t,s)=>t.amount-s.amount},{title:o.formatMessage({id:"Promo.Activations/Max activations"}),dataIndex:"id",key:"act/maxAct",render:(t,s)=>s.maxActivations!==0?e("span",{children:`${s.activations} / ${s.maxActivations}`}):e("span",{children:`${s.activations}`})},{title:o.formatMessage({id:"Promo.Status"}),dataIndex:"active",key:"active",render:t=>e("span",{className:t===!0?"font-size-12 badge badge-success":"font-size-12 badge badge-danger",children:t?o.formatMessage({id:"Promo.Active"}):o.formatMessage({id:"Promo.Disabled"})})},{title:o.formatMessage({id:"Promo.Access"}),dataIndex:"access",key:"access",render:t=>e("span",{children:`${t}`})},{title:o.formatMessage({id:"Promo.Branches"}),dataIndex:"branches",key:"branches",render:(t,s)=>{const w=K.filter(g=>{var D;return(D=s==null?void 0:s.branchIds)==null?void 0:D.includes(g.id)}).map(g=>g.name);return e("div",{children:w.map(g=>d("span",{children:[g,e("br",{})]},g))})}},{title:o.formatMessage({id:"Promo.Deactivate after apply"}),dataIndex:"deactivateAfterApply",key:"deactivateAfterApply",render:t=>e("span",{children:t?"Yes":"No"})},{title:o.formatMessage({id:"Promo.Action"}),dataIndex:"id",key:"action",render:(t,s)=>d("span",{children:[e(I,{style:{marginRight:"20px"},type:"primary",onClick:()=>X(s),children:o.formatMessage({id:"window.edit"})}),e(ne,{title:"Are you sure?",onConfirm:()=>E(t),okText:"Yes",cancelText:"No",children:e(I,{type:"primary",danger:!0,children:o.formatMessage({id:"window.remove"})})})]})}];return c.useEffect(()=>{document.title=o.formatMessage({id:"Promo.Promocodes"}),L().finally(()=>A(!1))},[L,o]),d(re,{roles:["root","admin","sales","salesDirector"],denied:["Dany"],redirect:!0,to:"/main",children:[e("div",{className:"card",children:d("div",{className:"card-body",children:[d("div",{style:{float:"left"},children:[e("h4",{children:o.formatMessage({id:"Promo.Status"})}),d(N.Group,{value:b,onChange:J,children:[e(N.Button,{value:"all",children:o.formatMessage({id:"Promo.All"})}),e(N.Button,{value:"active",children:o.formatMessage({id:"Promo.Active"})}),e(N.Button,{value:"disabled",children:o.formatMessage({id:"Promo.Disabled"})})]})]}),e("div",{style:{float:"right"},children:e(I,{type:"primary",onClick:Q,children:o.formatMessage({id:"Promo.Create promocode"})})})]})}),d("div",{className:"card",children:[e("div",{className:"card-header",children:e("div",{className:"utils__title",children:e("strong",{children:o.formatMessage({id:"Promo.Promocodes"})})})}),e("div",{className:"card-body",children:e(ie,{tableLayout:"auto",scroll:{x:"100%"},columns:ee,dataSource:x,pagination:{position:"bottom",total:x.length,showTotal:(t,s)=>`${s[0]}-${s[1]} of ${t} items`,showSizeChanger:!0,pageSizeOptions:["10","20","50","100","200"],hideOnSinglePage:x.length<10},loading:i,rowKey:()=>Math.random().toString()})})]}),e(pe,{visible:F,create:fe,onClose:Z,edit:ge,update:O,forEdit:f})]})};export{Ne as default};
