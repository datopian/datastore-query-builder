(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{100:function(e,a,t){"use strict";t.r(a);var n=t(29),r=t(46),o=t(20),l=t(41),c=t(42);n.a.use(r.a).use(o.a).init({detection:{order:["querystring","cookie","localStorage","navigator","htmlTag","path","subdomain"],lookupQuerystring:"lng",lookupCookie:"defaultLocale",lookupLocalStorage:"defaultLocale",lookupFromPathIndex:0,lookupFromSubdomainIndex:0},resources:{en:{translation:l},da:{translation:c}},react:{useSuspense:!1},initImmediate:!1,fallbackLng:"en",keySeparator:!1,interpolation:{escapeValue:!1}});var u=n.a,i=t(0),s=t.n(i),m=(t(57),t(8)),d=t(28),f=t.n(d);var p=function(e){var a=JSON.parse(JSON.stringify(e.resource)),t=a.schema.fields.find(function(e){return e.type&&e.type.includes("date")}),n=a.schema.fields.filter(function(e){return!(e.type&&e.type.includes("date"))}),r=Object(o.b)().t,l=[{name:"=",label:"="},{name:"!=",label:"!="},{name:"<",label:"<"},{name:">",label:">"},{name:"<=",label:"<="},{name:">=",label:">="}];return s.a.createElement(m.d,{initialValues:{rules:[],startDate:null,endDate:null},onSubmit:function(n){return function(n){var r=JSON.parse(JSON.stringify(n)),o='SELECT COUNT(*) OVER () AS _count, * FROM "'.concat(a.id,'" WHERE ');if(r.startDate||r.endDate||0!==r.rules.length){if(r.startDate){var l={combinator:"AND",field:t.name,operator:">=",value:r.startDate};r.rules.push(l)}if(r.endDate){var c={combinator:"AND",field:t.name,operator:"<=",value:r.endDate};r.rules.push(c)}r.rules.forEach(function(e,a){e.value=e.value instanceof Date?e.value.toISOString():e.value,o+=0===a?'"'.concat(e.field,'" ').concat(e.operator," '").concat(e.value,"'"):" ".concat(e.combinator.toUpperCase(),' "').concat(e.field,'" ').concat(e.operator," '").concat(e.value,"'")}),o+=" LIMIT 100"}else alert("Please, provide at least one rule.");var u=encodeURI(e.apiUrl+"datastore_search_sql?sql=".concat(o));a.api=u,e.action(a)}(n)},render:function(e){var a=e.values,o=e.setFieldValue;return s.a.createElement(m.c,{className:"form-inline"},t?s.a.createElement("div",null,s.a.createElement(f.a,{value:a.startDate,clearIcon:"X",onChange:function(e){return o("startDate",e)},format:"yyyy-MM-dd",maxDate:new Date}),s.a.createElement("i",{className:"fa fa-long-arrow-right","aria-hidden":"true"}),s.a.createElement(f.a,{value:a.endDate,clearIcon:"X",onChange:function(e){return o("endDate",e)},returnValue:"end",format:"yyyy-MM-dd",minDate:a.startDate,maxDate:new Date})):"",s.a.createElement(m.b,{name:"rules",render:function(e){return s.a.createElement("div",{className:"dq-rule-container"},s.a.createElement("div",{className:"dq-heading"}),s.a.createElement("div",{className:"dq-body"},a.rules&&a.rules.length>0?a.rules.map(function(a,t){return s.a.createElement("div",{key:t,className:"dq-rule-item"},s.a.createElement(m.a,{name:"rules.".concat(t,".combinator"),component:"select",className:"form-control",required:!0},s.a.createElement("option",{value:"AND"},"AND"),s.a.createElement("option",{value:"OR"},"OR")),s.a.createElement(m.a,{name:"rules.".concat(t,".field"),component:"select",className:"form-control",required:!0},n.map(function(e,a){return s.a.createElement("option",{value:e.name,key:"field".concat(a)},e.title||e.name)})),s.a.createElement(m.a,{name:"rules.".concat(t,".operator"),component:"select",className:"form-control",required:!0},l.map(function(e,a){return s.a.createElement("option",{value:e.name,key:"operator".concat(a)},e.label)})),s.a.createElement(m.a,{name:"rules.".concat(t,".value"),className:"form-control",required:!0}),s.a.createElement("button",{type:"button",className:"btn btn-default dq-btn-remove",onClick:function(){return e.remove(t)}},"-"),s.a.createElement("button",{type:"button",className:"btn btn-default dq-btn-add",onClick:function(){return e.insert(t,{combinator:"AND",field:n[0].name,operator:"=",value:""})}},"+"))}):s.a.createElement("button",{type:"button",className:"btn btn-default dq-rule-add",onClick:function(){return e.push({combinator:"AND",field:n[0].name,operator:"=",value:""})}},r("Add a rule"))),s.a.createElement("div",{className:"dq-rule-submit dq-footer"},s.a.createElement("button",{type:"submit",className:"btn btn-primary"},r("Submit"))))}}))}})},b=function(e){var a=JSON.parse(JSON.stringify(e.resource));if(a.schema){var t=a.proxy||new URL(a.path).origin+"/api/3/action/";return s.a.createElement("div",{className:"App"},s.a.createElement(p,{resource:a,apiUrl:t,action:e.filterBuilderAction}))}return s.a.createElement("div",{className:"no-filters"})};t.d(a,"QueryBuilder",function(){return b}),u.options.resources&&console.log("Translations loaded")},41:function(e){e.exports={"Add a rule":"Add a rule",Submit:"Submit"}},42:function(e){e.exports={"Add a rule":"Tilf\xf8j en regel",Submit:"Indsend"}},47:function(e,a,t){e.exports=t(100)},57:function(e,a,t){}},[[47,1,2]]]);
//# sourceMappingURL=main.757783e2.chunk.js.map