var P=Object.defineProperty;var K=(u,p,r)=>p in u?P(u,p,{enumerable:!0,configurable:!0,writable:!0,value:r}):u[p]=r;var h=(u,p,r)=>(K(u,typeof p!="symbol"?p+"":p,r),r);import{a1 as V,a2 as j,r as L,a3 as x,j as e,a4 as W,bl as i,c as m,I as q,a5 as k,a6 as U,bd as G,be as H,B as D,aW as X,aX as Y,a8 as Z,bg as J,aZ as $}from"./index-c20b5e8e.js";import{T as Q}from"./Table-fe15f1b3.js";import"./Pagination-e2a53e90.js";import{P as ee}from"./index-67f4e7c4.js";import{g as M,d as te,c as re,e as ne}from"./ingredient-16e26155.js";import{g as ie}from"./ingredientGroup-69636766.js";import{F as l}from"./index-a86cfb93.js";import{R as y,C as c}from"./row-58ed805b.js";import{I as C}from"./index-86d1917a.js";import"./styleChecker-a7b568e2.js";var _;const{Option:v}=k;let ae=V(_=class extends j.Component{constructor(r){super(r);h(this,"state",{name:"",group:"",unit:"kilogram",brutto:0,percent:0,isEdit:!1,energy:0,prot:0,fat:0,carb:0,tags:[],testEnabled:!1,min:0,max:0});h(this,"formRef",L.createRef());this.onFinish=this.onFinish.bind(this),this.closeDrawer=this.closeDrawer.bind(this)}onChangeField(r,n){r.target?r.target.type==="checkbox"?this.setState({[n]:r.target.checked}):this.setState({[n]:r.target.value}):this.setState({[n]:r})}async onFinish(){try{const{create:r,edit:n,forEdit:o,update:a,intl:{formatMessage:d}}=this.props;await this.formRef.current.validateFields();const{name:f,group:I,unit:g,brutto:b,percent:w,energy:S,prot:t,fat:s,carb:N,tags:A,testEnabled:z,min:B,max:O}=this.state,T={name:f,group:I,unit:g,brutto:b,percent:w,nutrients:{energy:S,prot:t,fat:s,carb:N},tags:A,testEnabled:z,min:B,max:O};if(o.id){const E=await n(o.id,T);E.status===202?(this.closeDrawer(),x.success({message:d({id:"CreateIngrForm.Saved"}),description:d({id:"CreateIngrForm.IngredientSuccessfullySaved!"})}),await a()):x.error({message:d({id:"window.error"}),description:E.statusText,placement:"topLeft"})}else{const E=await r(T);E.status===201?(this.closeDrawer(),x.success({message:d({id:"CreateIngrForm.Created"}),description:d({id:"CreateIngrForm.IngredientSuccessfullyCreated!"})}),a()):x.error({message:d({id:"window.error"}),description:E.statusText,placement:"topLeft"})}}catch(r){console.log("Failed:",r)}}setEdit(){const{forEdit:r}=this.props;r&&this.setState({name:r.name,group:r.group.id,unit:r.unit,brutto:r.brutto,percent:r.percent,energy:r.nutrients.energy,prot:r.nutrients.prot,fat:r.nutrients.fat,carb:r.nutrients.carb,isEdit:!0,tags:r.tags,testEnabled:r.testEnabled,min:r.min,max:r.max})}componentDidUpdate(r){var o,a,d,f,I,g;const{forEdit:n}=this.props;n&&r.forEdit!==n&&((g=this.formRef.current)==null||g.setFieldsValue({name:n.name,brutto:n.brutto,group:(o=n.group)==null?void 0:o.id,unit:n.unit,percent:n.percent,energy:(a=n.nutrients)==null?void 0:a.energy,prot:(d=n.nutrients)==null?void 0:d.prot,fat:(f=n.nutrients)==null?void 0:f.fat,carb:(I=n.nutrients)==null?void 0:I.carb,tags:n.tags,min:n.min,max:n.max,testEnabled:n.testEnabled}))}closeDrawer(){const{onClose:r}=this.props;this.setState({isEdit:!1,name:"",group:"",unit:"kilogram",brutto:0,percent:0,energy:0,prot:0,fat:0,carb:0,tags:[],testEnabled:!1,min:0,max:0}),this.formRef.current.resetFields(),r()}render(){const{visible:r,groups:n,forEdit:o,intl:{formatMessage:a}}=this.props,{group:d,unit:f,isEdit:I,tags:g,testEnabled:b,min:w,max:S}=this.state;return o.id&&!I&&this.setEdit(),e(W,{title:o.id?e(i,{id:"erp.title.editingIngredient"}):e(i,{id:"erp.title.createIngredient"}),open:r,onOk:this.onFinish,okText:e(i,{id:"main.save"}),onCancel:this.closeDrawer,children:m(l,{ref:this.formRef,layout:"vertical",onFinish:this.onFinish,children:[e(y,{gutter:16,children:e(c,{md:24,sm:24,children:e(l.Item,{label:e(i,{id:"erp.name"}),name:"name",rules:[{required:!0}],children:e(q,{onChange:t=>this.onChangeField(t,"name")})})})}),m(y,{gutter:16,children:[e(c,{md:8,sm:24,children:e(l.Item,{label:e(i,{id:"erp.brutto"}),name:"brutto",rules:[{required:!0}],children:e(C,{style:{width:"100%"},onChange:t=>this.onChangeField(t,"brutto")})})}),e(c,{md:8,sm:24,children:e(l.Item,{name:"unit",label:e(i,{id:"erp.unit"}),children:m(k,{value:f,onChange:t=>this.onChangeField(t,"unit"),children:[e(v,{value:"kilogram",children:a({id:"CreateIngrForm.Kilogram"})},"kilogram"),e(v,{value:"l",children:"l"},"l"),e(v,{value:"kousky",children:a({id:"CreateIngrForm.Kousky"})},"kousky")]})})}),e(c,{md:8,sm:24,children:e(l.Item,{label:"%",name:"percent",rules:[{required:!0}],children:e(C,{style:{width:"100%"},onChange:t=>this.onChangeField(t,"percent")})})})]}),m(y,{gutter:16,children:[e(c,{md:6,sm:24,children:e(l.Item,{label:"kCal",name:"energy",rules:[{required:!0}],children:e(C,{onChange:t=>this.onChangeField(t,"energy")})})}),e(c,{md:6,sm:24,children:e(l.Item,{label:e(i,{id:"erp.prot"}),name:"prot",rules:[{required:!0}],children:e(C,{onChange:t=>this.onChangeField(t,"prot")})})}),e(c,{md:6,sm:24,children:e(l.Item,{label:e(i,{id:"erp.fat"}),name:"fat",rules:[{required:!0}],children:e(C,{onChange:t=>this.onChangeField(t,"fat")})})}),e(c,{md:6,sm:24,children:e(l.Item,{label:e(i,{id:"erp.carb"}),name:"carb",rules:[{required:!0}],children:e(C,{onChange:t=>this.onChangeField(t,"carb")})})})]}),e(y,{gutter:16,children:e(c,{md:24,sm:24,children:e(l.Item,{name:"group",label:e(i,{id:"erp.group"}),children:e(k,{value:d,onChange:t=>this.onChangeField(t,"group"),children:n.map(t=>e(v,{value:t.id,children:t.name},t.id))})})})}),e(y,{gutter:16,children:e(c,{md:24,sm:24,children:e(l.Item,{name:"tags",label:"Tags",children:e(k,{placeholder:"Tags",mode:"tags",value:g,onChange:t=>this.onChangeField(t,"tags"),children:["1","2","3","4","5","6","7","8","9","10","11","12","13","14"].map(t=>e(v,{value:t,children:t},t))})})})}),m(y,{gutter:16,children:[e(c,{md:12,sm:24,children:m(l.Item,{label:a({id:"CreateIngrForm.TestInIngredients"}),name:"testEnabled",children:[e(U,{checked:b,onChange:t=>this.onChangeField(t,"testEnabled")}),a({id:"CreateIngrForm.SPASEWillBeDisplayedInTests"})]})}),e(c,{md:6,sm:24,children:e(l.Item,{label:"Min (g)",name:"min",children:e(C,{value:w,onChange:t=>this.onChangeField(t,"min")})})}),e(c,{md:6,sm:24,children:e(l.Item,{label:"Max (g)",name:"max",children:e(C,{value:S,onChange:t=>this.onChangeField(t,"max")})})})]})]})})}})||_;var R,F;let be=(R=G(({user:u})=>({user:u})),V(F=H(F=R(F=class extends j.Component{constructor(r){super(r);h(this,"state",{tableData:[],data:[],filterDropdownVisible:!1,searchText:"",filtered:!1,loading:!0,createIngredientFormVisible:!1,groups:[],forEdit:{}});h(this,"onInputChange",r=>{this.setState({searchText:r.target.value})});h(this,"showDrawerCreateIngredientForm",()=>{this.setState({createIngredientFormVisible:!0})});h(this,"editIngredientModal",r=>{this.setState({forEdit:r,createIngredientFormVisible:!0})});h(this,"onCloseCreateIngredientForm",()=>{this.setState({forEdit:{},createIngredientFormVisible:!1})});h(this,"onSearch",()=>{const{searchText:r,tableData:n}=this.state,o=new RegExp(r,"gi");this.setState({filterDropdownVisible:!1,filtered:!!r,data:n.map(a=>a.name.match(o)?{...a,name:a.name}:null).filter(a=>!!a)}),r===""&&this.setState({filtered:!1})});h(this,"refSearchInput",r=>{this.searchInput=r});this.updateIngredients=this.updateIngredients.bind(this)}UNSAFE_componentWillMount(){M().then(async r=>{if(r.status===401){const{dispatch:n}=this.props;n({type:"user/SET_STATE",payload:{authorized:!1}});return}if(r.status===200){const n=await r.json();this.setState({tableData:n,data:n,loading:!1})}}),ie().then(async r=>{if(r.status===401){const{dispatch:n}=this.props;n({type:"user/SET_STATE",payload:{authorized:!1}});return}if(r.status===200){const n=await r.json();this.setState({groups:n})}})}updateIngredients(){M().then(async r=>{if(r.status===401){const{dispatch:n}=this.props;n({type:"user/SET_STATE",payload:{authorized:!1}});return}if(r.status===200){const n=await r.json();this.setState({tableData:n,data:n,loading:!1,forEdit:{}})}})}async removeIngredient(r){const{intl:{formatMessage:n}}=this.props,o=await te(r);o.status===204?(x.success(n({id:"CreateIngrForm.IngredientDeleted"})),this.updateIngredients()):x.error({message:n({id:"window.error"}),description:o.statusText,placement:"topRight"})}render(){const{data:r,searchText:n,filterDropdownVisible:o,filtered:a,createIngredientFormVisible:d,groups:f,forEdit:I}=this.state,{user:g,intl:{formatMessage:b}}=this.props,w=t=>e($,{style:{padding:"0px"},children:e($.Item,{children:e(ee,{title:b({id:"CreateIngrForm.AreYouSureDeleteThisIngredient?"}),onConfirm:async()=>this.removeIngredient(t),okText:b({id:"window.yes"}),cancelText:b({id:"window.no"}),children:e(i,{id:"window.remove"})})},"remove")}),S=[{title:e(i,{id:"erp.ingredient"}),dataIndex:"name",key:"name",sorter:(t,s)=>t.name.length-s.name.length,render:(t,s)=>e("span",{children:e("strong",{children:` ${s.name}`})}),filterDropdown:m("div",{className:"custom-filter-dropdown",style:{padding:"5px"},children:[e(q,{ref:this.refSearchInput,placeholder:"Search name",value:n,onChange:this.onInputChange,onPressEnter:this.onSearch}),e(D,{type:"primary",onClick:this.onSearch,style:{marginTop:"5px"},children:b({id:"CreateIngrForm.Search"})})]}),filterIcon:e(X,{style:{color:a?"#108ee9":"#aaa"}}),filterDropdownVisible:o,onFilterDropdownVisibleChange:t=>{this.setState({filterDropdownVisible:t},()=>this.searchInput&&this.searchInput.focus())}},{title:e(i,{id:"erp.group"}),dataIndex:"group",key:"group",render:t=>e("span",{children:`${t?t.name:"-"}`})},{title:e(i,{id:"erp.unit"}),dataIndex:"unit",key:"unit",render:t=>e("span",{children:`${t||"-"}`})},{title:e(i,{id:"erp.brutto"}),dataIndex:"brutto",key:"brutto",render:t=>e("span",{children:`${t||"-"}`}),sorter:(t,s)=>t.brutto-s.brutoo},{title:e(i,{id:"erp.netto"}),dataIndex:"netto",key:"netto",render:t=>e("span",{children:`${t||"-"}`}),sorter:(t,s)=>t.netto-s.netto},{title:"%",dataIndex:"percent",key:"percent",render:t=>e("span",{children:`${t||"-"}`}),sorter:(t,s)=>t.percent-s.percent},{title:"kCal",dataIndex:"nutrients",key:"kCal",render:t=>e("span",{children:`${t.energy||"-"}`})},{title:e(i,{id:"erp.prot"}),dataIndex:"nutrients",key:"prot",render:t=>e("span",{children:`${t.prot||"-"}`})},{title:e(i,{id:"erp.fat"}),dataIndex:"nutrients",key:"fat",render:t=>e("span",{children:`${t.fat||"-"}`})},{title:e(i,{id:"erp.carb"}),dataIndex:"nutrients",key:"carb",render:t=>e("span",{children:`${t.carb||"-"}`})},{title:"---",dataIndex:"id",key:"action",render:(t,s)=>e("span",{children:g.name!=="david"&&e(Y.Button,{onClick:()=>this.editIngredientModal(s),overlay:w(t),children:e(i,{id:"window.edit"})})})}];return m(Z,{roles:["root","admin"],redirect:!0,to:"/main",children:[e(J,{title:"Ingredients"}),m("div",{className:"card",children:[e("div",{className:"card-header",children:e("div",{className:"utils__title",children:e("strong",{children:e(i,{id:"erp.ingredients"})})})}),m("div",{className:"card-body",children:[g.name!=="david"&&e(D,{style:{marginBottom:"20px"},type:"primary",onClick:this.showDrawerCreateIngredientForm,children:e(i,{id:"erp.newIngredient"})}),e(Q,{className:"utils__scrollTable",tableLayout:"auto",scroll:{x:"100%"},columns:S,dataSource:r,pagination:{position:"bottom",total:r.length,showTotal:(t,s)=>`${s[0]}-${s[1]} of ${t} items`,showSizeChanger:!0,pageSizeOptions:["10","20","50","100","200"],hideOnSinglePage:r.length<10},loading:this.state.loading,rowKey:()=>Math.random()})]})]}),e(ae,{visible:d,onClose:this.onCloseCreateIngredientForm,groups:f,forEdit:I,create:re,edit:ne,update:this.updateIngredients})]})}})||F)||F)||F);export{be as default};
