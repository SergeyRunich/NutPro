var T=Object.defineProperty;var L=(d,a,e)=>a in d?T(d,a,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[a]=e;var b=(d,a,e)=>(L(d,typeof a!="symbol"?a+"":a,e),e);import{a1 as W,be as E,a2 as M,j as t,aa as h,B as k,a7 as C,bd as O,a3 as u,bf as S,c as p,a8 as N,bg as Y,a5 as I,bo as R}from"./index-c20b5e8e.js";import{F as g}from"./index-a86cfb93.js";import{C as y}from"./row-58ed805b.js";import"./PickerPanel-72c5d64a.js";/* empty css              */import{I as D}from"./index-86d1917a.js";/* empty css              */import{D as A}from"./index-2f7554ca.js";import{T as U}from"./Table-fe15f1b3.js";import"./Pagination-e2a53e90.js";import{g as j}from"./kitchen-60ac824b.js";import"./index-8e340a60.js";import"./styleChecker-a7b568e2.js";var x;let _=W(x=E(x=class extends M.Component{render(){const{data:a,loading:e,deleteWorkloadEntry:n,editEntry:l,intl:{formatMessage:s}}=this.props,c=[{title:s({id:"KitchenWorkload.Cooking date"}),align:"center",dataIndex:"cookingDate",key:"cookingDate",render:i=>t("span",{children:h(i).format("DD.MM.YYYY")})},{title:s({id:"KitchenWorkload.Kitchen"}),align:"center",dataIndex:"kitchen",key:"kitchen",render:i=>t("span",{children:i.kitchen})},{title:s({id:"KitchenWorkload.Minimum"}),align:"center",dataIndex:"minimum",key:"minimum",render:i=>t("span",{children:i})},{title:s({id:"KitchenWorkload.Maximum"}),align:"center",dataIndex:"maximum",key:"maximum",render:i=>t("span",{children:i})},{title:s({id:"KitchenWorkload.Salad"}),align:"center",dataIndex:"salad",key:"salad",render:i=>t("span",{children:i?"yes":"No"})},{title:s({id:"KitchenWorkload.Created date"}),align:"center",dataIndex:"created",key:"created",render:i=>t("span",{children:h(i).format("DD.MM.YYYY")})},{title:s({id:"window.edit"}),align:"center",dataIndex:"id",key:"actionEdit",render:(i,o)=>t("span",{children:t(k,{disabled:h(o.cookingDate).isBefore(o.created),type:"primary",onClick:()=>l(o),children:s({id:"window.edit"})})})},{title:s({id:"KitchenWorkload.Delete"}),align:"center",dataIndex:"id",key:"actionDelete",render:(i,o)=>t("span",{children:t(k,{disabled:h(o.cookingDate).isBefore(o.created),type:"primary",onClick:()=>n(o.id),children:s({id:"KitchenWorkload.Delete"})})})}];return t("div",{children:t(U,{className:"utils__scrollTable",tableLayout:"auto",scroll:{x:"100%"},columns:c,dataSource:a,size:"small",rowKey:()=>Math.random(),pagination:{position:"bottom",total:a.length,showTotal:(i,o)=>`${o[0]}-${o[1]} of ${i} items`,showSizeChanger:!0,pageSizeOptions:["10","20","50","100","200"],hideOnSinglePage:a.length<10},loading:e})})}})||x)||x;const z=async()=>C({method:"GET",endpoint:"/erp/kitchen-power"}).fetch(),$=async d=>C({method:"POST",endpoint:"/erp/kitchen-power",body:d}).fetch(),B=async(d,a)=>{const e={method:"PUT",endpoint:`/erp/kitchen-power/${d}`,body:a};return C(e).fetch()},F=async d=>{const a={method:"DELETE",endpoint:`/erp/kitchen-power/${d}`};return C(a).fetch()};var K,w;h.updateLocale("en",{week:{dow:1}});const{Option:P}=I;let de=(K=O(({user:d})=>({user:d})),W(w=K(w=class extends M.Component{constructor(e){super(e);b(this,"state",{loading:!1,tableData:[],typeOfsetting:"none",kitchens:[],kitchen:"Choose kitchen",cookingDate:"",min:0,max:0,salad:!1,kitchenId:""});b(this,"deleteWorkloadEntry",async e=>{const{intl:{formatMessage:n}}=this.props,l=await F(e);l.status===204?(S.success(n({id:"KitchenWorkload.Deleted!"})),this.show()):S.error(n({id:"KitchenWorkload.Error: "}),l.statusText)});this.show=this.show.bind(this),this.handleRenderAddLimit=this.handleRenderAddLimit.bind(this),this.onChangeKitchen=this.onChangeKitchen.bind(this),this.onChangeCalendar=this.onChangeCalendar.bind(this),this.onChangeMin=this.onChangeMin.bind(this),this.onChangeMax=this.onChangeMax.bind(this),this.handleToggleSwitch=this.handleToggleSwitch.bind(this),this.handleCancel=this.handleCancel.bind(this),this.handleSave=this.handleSave.bind(this),this.handleUpdate=this.handleUpdate.bind(this),this.deleteWorkloadEntry=this.deleteWorkloadEntry.bind(this),this.handleRenderUpdateLimit=this.handleRenderUpdateLimit.bind(this)}componentDidMount(){this.show()}onChangeKitchen(e){try{this.setState({kitchen:e})}catch(n){console.log(n)}}onChangeCalendar(e){this.setState({cookingDate:e})}onChangeMin(e){this.setState({min:e})}onChangeMax(e){this.setState({max:e})}handleToggleSwitch(e){this.setState({salad:e})}handleRenderAddLimit(){this.setState({typeOfsetting:"create"})}handleRenderUpdateLimit(e){this.setState({typeOfsetting:"update",kitchenId:e.id,min:e.minimum,max:e.maximum,salad:e.salad}),console.log(e)}handleCancel(){this.setState({typeOfsetting:"none",kitchen:"All",cookingDate:"",min:0,max:0,salad:!1})}show(){this.setState({loading:!0}),z().then(async e=>{if(e.status===401){const{dispatch:n}=this.props;n({type:"user/SET_STATE",payload:{authorized:!1}});return}if(e.status===200){const n=await e.json();this.setState({tableData:n.result,loading:!1})}else u.error({message:e.status,description:e.statusText}),this.setState({loading:!1})}),j().then(async e=>{const n=await e.json();this.setState({kitchens:n})})}async handleSave(){try{const{salad:e,cookingDate:n,max:l,min:s,kitchen:c}=this.state,{intl:{formatMessage:i}}=this.props,o={cookingDate:h(n).format("DD-MM-YYYY"),minimum:s,maximum:l,salad:e,kitchenId:c},f=await $(o);f.status===201?(this.show(),this.setState({typeOfsetting:"none",kitchen:"All",cookingDate:"",min:0,max:0,salad:!1}),u.success({message:i({id:"window.success"}),description:i({id:"KitchenWorkload.Data added successfully!"})})):u.error({message:i({id:"window.error"}),description:f.statusText,placement:"topLeft"})}catch(e){console.log("Failed:",e)}}async handleUpdate(){try{const{salad:e,max:n,min:l,kitchenId:s}=this.state,{intl:{formatMessage:c}}=this.props,o=await B(s,{minimum:l,maximum:n,salad:e});o.status===200?(this.show(),this.setState({typeOfsetting:"none"}),u.success({message:c({id:"window.success"}),description:c({id:"KitchenWorkload.Data updated successfully!"})})):u.error({message:c({id:"window.error"}),description:o.statusText,placement:"topLeft"})}catch(e){console.log("Failed:",e)}}render(){const{loading:e,tableData:n,typeOfsetting:l,kitchens:s,kitchen:c,min:i,max:o,salad:f}=this.state,{intl:{formatMessage:r}}=this.props,v=h().endOf("day")>h().add(1,"days")?h().endOf("day"):h().add(1,"days");return p(N,{roles:["finance","root","salesDirector"],redirect:!0,to:"/main",children:[t(Y,{title:r({id:"KitchenWorkload.KITCHENS WORKLOAD"})}),t("div",{className:"row",children:t("div",{className:"col-lg-12",children:p("div",{className:"card",children:[t("div",{className:"card-header",children:p("div",{style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"},className:"utils__title",children:[t("strong",{children:r({id:"KitchenWorkload.KITCHENS WORKLOAD"})}),l==="none"&&t(k,{style:{display:"flex",justifyContent:"center",alignItems:"center"},type:"primary",onClick:this.handleRenderAddLimit,children:r({id:"window.create"})})]})}),t("div",{className:"card-body",children:l!=="none"&&p("div",{children:[p(g,{layout:"horizontal",onSubmit:this.onSend,children:[l!=="update"&&t(y,{xl:4,md:24,children:t(g.Item,{label:r({id:"KitchenWorkload.Cooking date"}),children:t(A,{format:"DD.MM.YYYY",disabledDate:m=>m&&m<v||m.day()!==2&&m.day()!==4&&m.day()!==0,inline:!0,onChange:this.onChangeCalendar,showWeekNumbers:!0})})}),l!=="update"&&t(y,{xl:4,md:24,children:t(g.Item,{label:r({id:"KitchenWorkload.Kitchen"}),children:t(I,{value:c,style:{width:"115px",marginRight:"10px"},onChange:this.onChangeKitchen,children:s&&s.map(m=>t(P,{value:m.id,children:m.name},m.id))})})}),t(y,{xl:3,md:24,children:t(g.Item,{label:r({id:"KitchenWorkload.Min"}),children:t(D,{min:0,value:i,onChange:this.onChangeMin})})}),t(y,{xl:3,md:24,children:t(g.Item,{label:r({id:"KitchenWorkload.Max"}),children:t(D,{min:0,value:o,onChange:this.onChangeMax})})}),t(y,{xl:3,md:24,children:t(g.Item,{label:r({id:"KitchenWorkload.Salad"}),children:t(R,{checked:f,onChange:this.handleToggleSwitch,title:"salad"})})})]}),p("div",{style:{position:"absolute",right:"20px",bottom:"20px"},children:[l==="create"&&t(k,{style:{marginRight:"10px"},disabled:this.state.kitchen==="Choose kitchen"||this.state.cookingDate==="",type:"primary",onClick:this.handleSave,children:r({id:"window.save"})}),l==="update"&&t(k,{style:{marginRight:"10px"},type:"primary",onClick:this.handleUpdate,children:r({id:"KitchenWorkload.Update"})}),t(k,{style:{marginLeft:"10px"},type:"primary",onClick:this.handleCancel,children:r({id:"window.cancel"})})]})]})})]})})}),t("div",{className:"row",children:t("div",{className:"col-lg-12",children:t("div",{className:"card",children:t("div",{className:"card-body",children:t(_,{data:n,deleteWorkloadEntry:this.deleteWorkloadEntry,editEntry:this.handleRenderUpdateLimit,loading:e})})})})})]})}})||w)||w);export{de as default};
