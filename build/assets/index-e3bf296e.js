import{a7 as C,be as R,r as s,a3 as L,c as a,a8 as f,j as e,bg as S,a5 as c,B as I,aa as P}from"./index-c20b5e8e.js";import{T as U}from"./Table-fe15f1b3.js";import"./Pagination-e2a53e90.js";import{R as _,C as d}from"./row-58ed805b.js";import"./styleChecker-a7b568e2.js";const b=async({limit:i="",systemUser:h="",entity:E="",action:n=""})=>{const r={method:"GET",endpoint:`/admin/logs/erp?limit=${i}&systemUser=${h}&action=${n}&entity=${E}`};return C(r).fetch()},{Option:l}=c;function x(){const[i,h]=s.useState([]),[E,n]=s.useState(!0),[r,A]=s.useState(""),[u,y]=s.useState(""),[m,D]=s.useState(""),[T,N]=s.useState(500),v=s.useCallback(()=>{n(!0),b({limit:T,systemUser:r,entity:u,action:m}).then(async t=>{if(t.status===200){const o=await t.json();h(o.result),n(!1)}else n(!1),L.error({message:"Error",description:t.statusText})})},[m,u,T,r]);s.useEffect(()=>{v()},[v]);const p=["CREATE","UPDATE","COPY"],g=["DELETE"];return a(f,{roles:["root","admin","sales","salesDirector"],children:[e(S,{title:"Orders log"}),e("div",{className:"row",children:e("div",{className:"col-lg-12",children:a("div",{className:"card card--fullHeight",children:[e("div",{className:"card-header",children:e("div",{className:"utils__title utils__title--flat",children:e("strong",{className:"text-uppercase font-size-16",children:"ERP Log"})})}),e("div",{className:"card-body",children:a(_,{gutter:16,children:[a(d,{sm:24,md:4,children:[e("small",{children:"Number of records"}),e("br",{}),a(c,{placeholder:"limit",value:T,style:{width:"100%"},onChange:t=>N(t),children:[e(l,{value:500,children:"Last 500"},500),e(l,{value:1e3,children:"Last 1000"},1e3),e(l,{value:"",children:"All"},"")]})]}),a(d,{sm:24,md:4,children:[e("small",{children:"System User"}),e("br",{}),a(c,{placeholder:"system user",value:r,style:{width:"100%"},onChange:t=>A(t),children:[e(l,{value:"",children:"None"},""),e(l,{value:"david",children:"david"},"david"),e(l,{value:"Denisa",children:"Denisa"},"Denisa"),e(l,{value:"Adela",children:"Adela"},"Adela"),e(l,{value:"justSales",children:"justSales"},"justSales"),e(l,{value:"Dany",children:"Dany"},"Dany")]})]}),a(d,{sm:24,md:4,children:[e("small",{children:"Module"}),e("br",{}),a(c,{placeholder:"entity",value:u,style:{width:"100%"},onChange:t=>y(t),children:[e(l,{value:"",children:"None"},""),e(l,{value:"GROUP_INGREDIENTS",children:"GROUP_INGREDIENTS"},"GROUP_INGREDIENTS"),e(l,{value:"INGREDIENT",children:"INGREDIENT"},"INGREDIENT"),e(l,{value:"TECHCARD",children:"TECHCARD"},"TECHCARD"),e(l,{value:"DAY_TEMPLATE",children:"DAY_TEMPLATE"},"DAY_TEMPLATE"),e(l,{value:"WEEK_TEMPLATE",children:"WEEK_TEMPLATE"},"WEEK_TEMPLATE"),e(l,{value:"CALENDAR_MENU",children:"CALENDAR_MENU"},"CALENDAR_MENU")]})]}),a(d,{sm:24,md:4,children:[e("small",{children:"Action"}),e("br",{}),a(c,{placeholder:"action",value:m,style:{width:"100%"},onChange:t=>D(t),children:[e(l,{value:"",children:"None"},""),e(l,{value:"CREATE",children:"CREATE"},"CREATE"),e(l,{value:"UPDATE",children:"UPDATE"},"UPDATE"),e(l,{value:"DELETE",children:"DELETE"},"DELETE"),e(l,{value:"COPY",children:"COPY"},"COPY")]})]}),e(d,{sm:24,md:4,children:e(I,{style:{marginTop:"20px"},type:"primary",onClick:v,children:"Refresh"})})]})})]})})}),e("div",{className:"card card--fullHeight",children:e("div",{className:"card-body",children:e("div",{className:"row",children:e("div",{className:"col-lg-12",children:e(U,{tableLayout:"auto",scroll:{x:"100%"},columns:[{title:"DATE",dataIndex:"date",key:"date",render:t=>P(t).format("DD.MM.YYYY HH:mm")},{title:"SYSTEM USER",dataIndex:"systemUser",key:"systemUser",render:t=>t},{title:"MODULE",dataIndex:"entity",key:"module",render:t=>t},{title:"ACTION",dataIndex:"action",key:"action",render:t=>e("span",{style:{fontWeight:"26px",color:p.includes(t)?"#46be8a":g.includes(t)?"#0887c9":"#fb434a"},children:t})},{title:"TITLE",dataIndex:"object",key:"title",render:t=>t.title}],dataSource:i,pagination:{position:"bottom",total:i.length,showTotal:(t,o)=>`${o[0]}-${o[1]} of ${t} items`,showSizeChanger:!0,pageSizeOptions:["10","20","50","100","200"],hideOnSinglePage:i.length<10},loading:E,rowKey:()=>Math.random()})})})})})]})}const k=R(x);export{k as default};
