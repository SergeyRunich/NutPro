import{a as _,c as t,j as e,aa as b,be as D,r as m,bP as x,a3 as p,bg as S,a5 as f,b4 as N}from"./index-c20b5e8e.js";import{S as g}from"./index-297358d3.js";import{R as A,C as h}from"./row-58ed805b.js";import{T as k}from"./index-83b0f9b6.js";import"./padStart-17be0050.js";const w="_productCard_1l1kq_1",P="_img_1l1kq_10",E="_title_1l1kq_19",j="_descr_1l1kq_35",L="_sizes_1l1kq_41",T="_price_1l1kq_57",q="_oldPrice_1l1kq_65",O="_like_1l1kq_72",z="_selectedLike_1l1kq_90",I="_imgRemove_1l1kq_94",v={productCard:w,img:P,title:E,descr:j,sizes:L,price:T,oldPrice:q,like:O,selectedLike:z,imgRemove:I},{TabPane:Y}=k;function G(d){const a=_(),l={border:"1px solid #e8e8e8",borderCollapse:"collapse",borderRadius:"10px",padding:"0.5em",textAlign:"center",textSize:"10px"},c={border:"1px solid #e8e8e8",borderCollapse:"collapse",borderRadius:"5px",padding:"0.5em",marginTop:"15px",display:"inline-table"},M=[a.formatMessage({id:"DayCard.Breakfast"}),a.formatMessage({id:"DayCard.1Snack"}),a.formatMessage({id:"DayCard.Lunch"}),a.formatMessage({id:"DayCard.2Snack"}),a.formatMessage({id:"DayCard.Dinner"})];return t("div",{className:v.productCard,children:[e("h4",{children:b.unix(d.day.timestamp).format("DD.MM.YYYY (ddd)")}),e("div",{className:v.img,children:e(k,{defaultActiveKey:"1",size:"small",children:["kcal","prot","fat","carb"].map(s=>t(Y,{tab:s,style:{marginLeft:"8px"},children:[e("h5",{children:s}),e("table",{style:c,children:t("tbody",{children:[t("tr",{children:[e("th",{style:l,children:a.formatMessage({id:"DayCard.Meal"})}),e("th",{style:l,children:a.formatMessage({id:"DayCard.Min"})}),e("th",{style:l,children:a.formatMessage({id:"DayCard.Max"})})]}),[0,1,2,3,4].map(i=>t("tr",{children:[e("td",{style:l,children:M[i]}),e("td",{style:l,children:d.day.min[s][i]!==1e4&&d.day.min[s][i]!==0?d.day.min[s][i]:"-"}),e("td",{style:l,children:d.day.max[s][i]!==0?d.day.max[s][i]:"-"})]},i))]})}),e("br",{}),e("br",{}),t("h4",{children:[d.day.minDay[s]," - ",d.day.maxDay[s],e("br",{}),s==="kcal"&&e("span",{children:a.formatMessage({id:"DayCard.(cKal)"})}),s!=="kcal"&&e("span",{children:a.formatMessage({id:"DayCard.(g)"})})]})]},s))})})]})}function V(d){const a=_(),[l,c]=m.useState(!0),[M,s]=m.useState([]),[i,R]=m.useState(5),[n,u]=m.useState({dates:"",min:{min:0,max:0,average:0},max:{min:0,max:0,average:0}});m.useEffect(()=>{x(5).then(async r=>{if(r.status===200){const o=await r.json();s(o.result),u(o.summary),c(!1)}else p.error({message:a.formatMessage({id:"window.error"}),description:r.statusText})})},[i,a]);const C=r=>{c(!0),R(r),x(r).then(async o=>{if(o.status===200){const y=await o.json();s(y.result),u(y.summary),c(!1)}else p.error({message:a.formatMessage({id:"window.error"}),description:o.statusText}),c(!1)})};return t("div",{children:[e(S,{title:a.formatMessage({id:"MacroRanges.RangesOfMacro"})}),e("div",{className:"card",children:t("div",{className:"card-body",children:[t("div",{style:{marginBottom:"10px"},children:[e("h4",{children:n.dates}),e("small",{style:{marginRight:"10px"},children:a.formatMessage({id:"MacroRanges.MealsPerDay"})}),t(f,{value:i,onChange:r=>C(r),children:[t(f.Option,{value:5,children:[" ",a.formatMessage({id:"MacroRanges.5Meals"})]},5),t(f.Option,{value:3,children:[" ",a.formatMessage({id:"MacroRanges.3Meals"})]},3),t(f.Option,{value:2,children:[" ",a.formatMessage({id:"MacroRanges.2Meals"})]},2)]})]}),e("div",{children:t(A,{gutter:16,children:[e(h,{md:4,xs:12,children:e(g,{title:a.formatMessage({id:"MacroRanges.MIN"}),value:n.min.max,suffix:"kCal"})}),e(h,{md:4,xs:12,children:e(g,{title:a.formatMessage({id:"MacroRanges.MAX"}),value:n.max.min,suffix:"kCal"})}),e(h,{md:4,xs:12,children:e(g,{title:a.formatMessage({id:"MacroRanges.AVERAGEMIN"}),value:n.min.average,suffix:"kCal"})}),e(h,{md:4,xs:12,children:e(g,{title:a.formatMessage({id:"MacroRanges.AVERAGEMAX"}),value:n.max.average,suffix:"kCal"})}),e(h,{md:5,xs:12,children:e(g,{title:a.formatMessage({id:"MacroRanges.AVERAGEOPTIMAL"}),value:(n.max.average+n.min.average)/2,suffix:"kCal"})})]})})]})}),t("div",{className:"card",children:[e("div",{className:"card-header",children:e("div",{className:"utils__title",children:e("strong",{style:{marginRight:"15px"},children:a.formatMessage({id:"MacroRanges.RangesOfMacro"})})})}),e("div",{className:"card-body",children:e("div",{children:e(N,{spinning:l,children:e("div",{className:"row",children:M.map(r=>e("div",{className:"col-xl-2 col-lg-4 col-md-6 col-sm-12",children:e(G,{day:r})},Math.random()))})})})})]})]})}const J=D(V);export{J as default};
