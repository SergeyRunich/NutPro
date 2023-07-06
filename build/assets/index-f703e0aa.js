import{be as b,a as k,r as l,a3 as R,aa as V,j as r,bF as S,c as d,bk as j,B as f,a8 as B,bg as _,a5 as L}from"./index-c20b5e8e.js";import{T as z}from"./Table-fe15f1b3.js";import"./Pagination-e2a53e90.js";import{R as H,C as h}from"./row-58ed805b.js";import{g as C}from"./orderLog-3d88f3dc.js";import"./styleChecker-a7b568e2.js";const{Option:s}=L;function Y(){const e=k(),[O,u]=l.useState([]),[v,o]=l.useState(!0),[g,T]=l.useState(""),[n,D]=l.useState(""),[c,P]=l.useState(""),[m,U]=l.useState(""),[E,w]=l.useState(500),M=l.useCallback(()=>{o(!0),C({limit:E,systemUser:g,user:n,order:c,action:m}).then(async a=>{if(a.status===200){const t=await a.json();u(t.result),o(!1)}else o(!1),R.error({message:e.formatMessage({id:"window.error"}),description:a.statusText})})},[E,g,n,c,m,e]);l.useEffect(()=>{M()},[M]);const A=a=>{o(!0),P(a),C({limit:E,systemUser:g,user:n,order:c,action:m}).then(async t=>{if(t.status===200){const i=await t.json();u(i.result),o(!1)}else o(!1),R.error({message:e.formatMessage({id:"window.error"}),description:t.statusText})})},p=a=>{o(!0),D(a),C({limit:E,systemUser:g,user:n,order:c,action:m}).then(async t=>{if(t.status===200){const i=await t.json();u(i.result),o(!1)}else o(!1),R.error({message:e.formatMessage({id:"window.error"}),description:t.statusText})})},y={ignoredMealTypes:e.formatMessage({id:"OrderLog.SkippedMeals"}),kcal:e.formatMessage({id:"OrderLog.kcal"}),mealsPerDay:e.formatMessage({id:"OrderLog.Meals"}),deliveryDescription:e.formatMessage({id:"OrderLog.DeliveryComment"}),kitchenDescription:e.formatMessage({id:"OrderLog.KitchenComment"}),size:e.formatMessage({id:"OrderLog.WeekSize"}),timestamp:e.formatMessage({id:"OrderLog.FirstDeliveryDate"})},I=[e.formatMessage({id:"window.create"}),e.formatMessage({id:"window.accept"}),e.formatMessage({id:"OrderLog.ADDPAUSE"}),e.formatMessage({id:"OrderLog.APPROVALCUSTOMPRICE"}),e.formatMessage({id:"OrderLog.APPROVALRECALCULATEDPRICE"})],N=[e.formatMessage({id:"window.edit"}),e.formatMessage({id:"OrderLog.RESENDINVOICE"}),e.formatMessage({id:"OrderLog.REQUESTRECALCULATEDPRICE"}),e.formatMessage({id:"OrderLog.REGENERATE"})],x=[{title:e.formatMessage({id:"window.date"}),dataIndex:"date",key:"date",render:a=>V(a).format("DD.MM.YYYY HH:mm")},{title:e.formatMessage({id:"OrderLog.SYSTEMUSER"}),dataIndex:"systemUser",key:"systemUser",render:a=>a},{title:e.formatMessage({id:"OrderLog.ACTION"}),dataIndex:"action",key:"action",render:a=>r("span",{style:{fontWeight:"26px",color:I.includes(a)?"#46be8a":N.includes(a)?"#0887c9":"#fb434a"},children:a})},{title:e.formatMessage({id:"OrderLog.USER"}),dataIndex:"user",key:"user",render:a=>r(S,{to:`/users/${a.id}`,children:a.name})},{title:e.formatMessage({id:"OrderLog.ORDER"}),dataIndex:"order",key:"order",render:a=>r(S,{to:`/orders/${a}`,children:a})},{title:e.formatMessage({id:"OrderLog.CHANGES"}),dataIndex:"changes",key:"changes",render:a=>{if(a.length){const t=r("div",{children:a.map(i=>d("p",{children:[r("b",{children:y[i.field]||r("span",{style:{textTransform:"capitalize"},children:i.field})}),": ",i.before||"None"," ",r("i",{className:"fa fa-long-arrow-right"})," ",i.after||"None"]},Math.random()))});return r(j,{content:t,title:e.formatMessage({id:"OrderLog.ChangesInOrder"}),children:r("div",{style:{width:"400px"},children:a.map(i=>d("span",{style:{textTransform:"capitalize"},children:[y[i.field]||i.field,","," "]},Math.random()))})})}return r("span",{children:"-"})}},{title:e.formatMessage({id:"OrderLog.ADVANCEDSEARCH"}),dataIndex:"id",key:"id",render:(a,t)=>d("span",{children:[r(f,{type:"default",style:{marginRight:"10px"},onClick:()=>A(t.order),children:e.formatMessage({id:"OrderLog.BYORDER"})}),r(f,{type:"default",onClick:()=>p(t.user.id),children:e.formatMessage({id:"OrderLog.BYUSER"})})]})}];return d(B,{roles:["root","admin","sales","salesDirector"],children:[r(_,{title:e.formatMessage({id:"OrderLog.OrdersLog"})}),r("div",{className:"row",children:r("div",{className:"col-lg-12",children:d("div",{className:"card card--fullHeight",children:[r("div",{className:"card-header",children:r("div",{className:"utils__title utils__title--flat",children:r("strong",{className:"text-uppercase font-size-16",children:e.formatMessage({id:"OrderLog.Filter"})})})}),r("div",{className:"card-body",children:d(H,{gutter:16,children:[d(h,{sm:24,md:5,children:[r("small",{children:e.formatMessage({id:"OrderLog.Action"})}),r("br",{}),d(L,{placeholder:e.formatMessage({id:"OrderLog.RecordLimit"}),value:m,style:{width:"100%"},onChange:a=>U(a),children:[r(s,{value:"",children:e.formatMessage({id:"OrderLog.None"})},""),r(s,{value:"CREATE",children:e.formatMessage({id:"window.create"})},"CREATE"),r(s,{value:"EDIT",children:e.formatMessage({id:"window.edit"})},"EDIT"),r(s,{value:"ACCEPT",children:e.formatMessage({id:"window.accept"})},"ACCEPT"),r(s,{value:"REJECT",children:e.formatMessage({id:"window.reject"})},"REJECT"),r(s,{value:"ADD PAUSE",children:e.formatMessage({id:"OrderLog.ADDPAUSE"})},"ADD PAUSE"),r(s,{value:"REMOVE PAUSE",children:e.formatMessage({id:"OrderLog.REMOVEPAUSE"})},"REMOVE PAUSE"),r(s,{value:"REGENERATE",children:e.formatMessage({id:"OrderLog.REGENERATE"})},"REGENERATE"),r(s,{value:"RESEND INVOICE",children:e.formatMessage({id:"OrderLog.RESENDINVOICE"})},"RESEND INVOICE"),r(s,{value:"APPROVAL CUSTOM PRICE",children:e.formatMessage({id:"OrderLog.APPROVALCUSTOMPRICE"})},"APPROVAL CUSTOM PRICE"),r(s,{value:"APPROVAL RECALCULATED PRICE",children:e.formatMessage({id:"OrderLog.APPROVALRECALCULATEDPRICE"})},"APPROVAL RECALCULATED PRICE"),r(s,{value:"REJECT RECALCULATED PRICE",children:e.formatMessage({id:"OrderLog.REJECTRECALCULATEDPRICE"})},"REJECT RECALCULATED PRICE"),r(s,{value:"REQUEST RECALCULATED PRICE",children:e.formatMessage({id:"OrderLog.REQUESTRECALCULATEDPRICE"})},"REQUEST RECALCULATED PRICE")]})]}),d(h,{sm:24,md:4,children:[r("small",{children:e.formatMessage({id:"OrderLog.SystemUser"})}),r("br",{}),d(L,{placeholder:e.formatMessage({id:"OrderLog.SystemUser"}),value:g,style:{width:"100%"},onChange:a=>T(a),children:[r(s,{value:"",children:e.formatMessage({id:"OrderLog.None"})},""),r(s,{value:"david",children:e.formatMessage({id:"OrderLog.david"})},"david"),r(s,{value:"Denisa",children:e.formatMessage({id:"OrderLog.Denisa"})},"Denisa"),r(s,{value:"Adela",children:e.formatMessage({id:"OrderLog.Adela"})},"Adela"),r(s,{value:"justSales",children:e.formatMessage({id:"OrderLog.justSales"})},"justSales"),r(s,{value:"Dany",children:e.formatMessage({id:"OrderLog.Dany"})},"Dany")]})]}),d(h,{sm:24,md:4,children:[r("small",{children:e.formatMessage({id:"OrderLog.NumberOfRecords"})}),r("br",{}),d(L,{placeholder:e.formatMessage({id:"OrderLog.Limit"}),value:E,style:{width:"100%"},onChange:a=>w(a),children:[r(s,{value:500,children:e.formatMessage({id:"OrderLog.Last500"})},500),r(s,{value:1e3,children:e.formatMessage({id:"OrderLog.Last1000"})},1e3),r(s,{value:"",children:e.formatMessage({id:"OrderLog.All"})},"")]})]}),Boolean(c)&&d(h,{sm:24,md:5,children:[d("small",{children:[" ",e.formatMessage({id:"OrderLog.SearchByOrder"})]}),r("br",{}),c,r(f,{type:"danger",style:{marginLeft:"10px"},onClick:()=>A(""),children:e.formatMessage({id:"OrderLog.CLEAR"})})]}),Boolean(n)&&d(h,{sm:24,md:5,children:[r("small",{children:e.formatMessage({id:"OrderLog.SearchByUser"})}),r("br",{}),n,r(f,{type:"danger",style:{marginLeft:"10px"},onClick:()=>p(""),children:e.formatMessage({id:"OrderLog.CLEAR"})})]})]})})]})})}),d("div",{className:"utils__title utils__title--flat mb-3",children:[r("strong",{className:"text-uppercase font-size-16",children:e.formatMessage({id:"OrderLog.OrderLog"})}),r(f,{className:"ml-3",type:"primary",onClick:M,children:e.formatMessage({id:"OrderLog.Refresh"})})]}),r("div",{className:"card card--fullHeight",children:r("div",{className:"card-body",children:r("div",{className:"row",children:r("div",{className:"col-lg-12",children:r(z,{tableLayout:"auto",scroll:{x:"100%"},columns:x,dataSource:O,pagination:{position:"bottom",total:O.length,showTotal:(a,t)=>`${t[0]}-${t[1]} of ${a} items`,showSizeChanger:!0,pageSizeOptions:["10","20","50","100","200"],hideOnSinglePage:O.length<10},loading:v,rowKey:()=>Math.random()})})})})})]})}const W=b(Y);export{W as default};
