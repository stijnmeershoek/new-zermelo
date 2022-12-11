(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const mt="modulepreload",St=function(e){return"/new-zermelo/"+e},je={},Be=function(t,n,s){if(!n||n.length===0)return t();const r=document.getElementsByTagName("link");return Promise.all(n.map(o=>{if(o=St(o),o in je)return;je[o]=!0;const l=o.endsWith(".css"),i=l?'[rel="stylesheet"]':"";if(!!s)for(let c=r.length-1;c>=0;c--){const a=r[c];if(a.href===o&&(!l||a.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${o}"]${i}`))return;const f=document.createElement("link");if(f.rel=l?"stylesheet":mt,l||(f.as="script",f.crossOrigin=""),f.href=o,document.head.appendChild(f),l)return new Promise((c,a)=>{f.addEventListener("load",c),f.addEventListener("error",()=>a(new Error(`Unable to preload CSS for ${o}`)))})})).then(()=>t())},w={};function F(e){w.context=e}const At=(e,t)=>e===t,G=Symbol("solid-proxy"),Ee=Symbol("solid-track"),ae={equals:At};let He=Xe;const U=1,de=2,Je={owned:null,cleanups:null,context:null,owner:null},ke={};var b=null;let q=null,A=null,x=null,M=null,Pe=0;function re(e,t){const n=A,s=b,r=e.length===0,o=r?Je:{owned:null,cleanups:null,context:null,owner:t||s},l=r?e:()=>e(()=>j(()=>Le(o)));b=o,A=null;try{return J(l,!0)}finally{A=n,b=s}}function m(e,t){t=t?Object.assign({},ae,t):ae;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},s=r=>(typeof r=="function"&&(r=r(n.value)),We(n,r));return[Ke.bind(n),s]}function Ie(e,t,n){const s=Ae(e,t,!0,U);X(s)}function he(e,t,n){const s=Ae(e,t,!1,U);X(s)}function fe(e,t,n){He=Ot;const s=Ae(e,t,!1,U),r=W&&be(b,W.id);r&&(s.suspense=r),s.user=!0,M?M.push(s):X(s)}function T(e,t,n){n=n?Object.assign({},ae,n):ae;const s=Ae(e,t,!0,0);return s.observers=null,s.observerSlots=null,s.comparator=n.equals||void 0,X(s),Ke.bind(s)}function bt(e,t,n){let s,r,o;arguments.length===2&&typeof t=="object"||arguments.length===1?(s=!0,r=e,o=t||{}):(s=e,r=t,o=n||{});let l=null,i=ke,u=null,f=!1,c=!1,a="initialValue"in o,h=typeof s=="function"&&T(s);const d=new Set,[S,v]=(o.storage||m)(o.initialValue),[O,L]=m(void 0),[D,g]=m(void 0,{equals:!1}),[P,I]=m(a?"ready":"unresolved");if(w.context){u=`${w.context.id}${w.context.count++}`;let p;o.ssrLoadFrom==="initial"?i=o.initialValue:w.load&&(p=w.load(u))&&(i=p[0])}function B(p,$,k,V){return l===p&&(l=null,a=!0,(p===i||$===i)&&o.onHydrated&&queueMicrotask(()=>o.onHydrated(V,{value:$})),i=ke,De($,k)),$}function De(p,$){J(()=>{$||v(()=>p),I($?"errored":"ready"),L($);for(const k of d.keys())k.decrement();d.clear()},!1)}function Y(){const p=W&&be(b,W.id),$=S(),k=O();if(k&&!l)throw k;return A&&!A.user&&p&&Ie(()=>{D(),l&&(p.resolved&&q&&f?q.promises.add(l):d.has(p)||(p.increment(),d.add(p)))}),$}function Q(p=!0){if(p!==!1&&c)return;c=!1;const $=h?h():s;if(f=q,$==null||$===!1){B(l,j(S));return}const k=i!==ke?i:j(()=>r($,{value:S(),refetching:p}));return typeof k!="object"||!(k&&"then"in k)?(B(l,k),k):(l=k,c=!0,queueMicrotask(()=>c=!1),J(()=>{I(a?"refreshing":"pending"),g()},!1),k.then(V=>B(k,V,void 0,$),V=>B(k,void 0,Qe(V))))}return Object.defineProperties(Y,{state:{get:()=>P()},error:{get:()=>O()},loading:{get(){const p=P();return p==="pending"||p==="refreshing"}},latest:{get(){if(!a)return Y();const p=O();if(p&&!l)throw p;return S()}}}),h?Ie(()=>Q(!1)):Q(!1),[Y,{refetch:Q,mutate:v}]}function Dt(e){return J(e,!1)}function j(e){const t=A;A=null;try{return e()}finally{A=t}}function Re(e,t,n){const s=Array.isArray(e);let r,o=n&&n.defer;return l=>{let i;if(s){i=Array(e.length);for(let f=0;f<e.length;f++)i[f]=e[f]()}else i=e();if(o){o=!1;return}const u=j(()=>t(i,r,l));return r=i,u}}function Se(e){return b===null||(b.cleanups===null?b.cleanups=[e]:b.cleanups.push(e)),e}function Ve(){return A}function kt(){return b}function $t(e){M.push.apply(M,e),e.length=0}function Ne(e,t){const n=Symbol("context");return{id:n,Provider:Ct(n),defaultValue:e}}function ze(e){let t;return(t=be(b,e.id))!==void 0?t:e.defaultValue}function Ge(e){const t=T(e),n=T(()=>ve(t()));return n.toArray=()=>{const s=n();return Array.isArray(s)?s:s!=null?[s]:[]},n}let W;function Et(){return W||(W=Ne({}))}function Ke(){const e=q;if(this.sources&&(this.state||e))if(this.state===U||e)X(this);else{const t=x;x=null,J(()=>ye(this),!1),x=t}if(A){const t=this.observers?this.observers.length:0;A.sources?(A.sources.push(this),A.sourceSlots.push(t)):(A.sources=[this],A.sourceSlots=[t]),this.observers?(this.observers.push(A),this.observerSlots.push(A.sources.length-1)):(this.observers=[A],this.observerSlots=[A.sources.length-1])}return this.value}function We(e,t,n){let s=e.value;return(!e.comparator||!e.comparator(s,t))&&(e.value=t,e.observers&&e.observers.length&&J(()=>{for(let r=0;r<e.observers.length;r+=1){const o=e.observers[r],l=q&&q.running;l&&q.disposed.has(o),(l&&!o.tState||!l&&!o.state)&&(o.pure?x.push(o):M.push(o),o.observers&&Ye(o)),l||(o.state=U)}if(x.length>1e6)throw x=[],new Error},!1)),t}function X(e){if(!e.fn)return;Le(e);const t=b,n=A,s=Pe;A=b=e,vt(e,e.value,s),A=n,b=t}function vt(e,t,n){let s;try{s=e.fn(t)}catch(r){e.pure&&(e.state=U),Ze(r)}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?We(e,s):e.value=s,e.updatedAt=n)}function Ae(e,t,n,s=U,r){const o={fn:e,state:s,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:b,context:null,pure:n};return b===null||b!==Je&&(b.owned?b.owned.push(o):b.owned=[o]),o}function ge(e){const t=q;if(e.state===0||t)return;if(e.state===de||t)return ye(e);if(e.suspense&&j(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<Pe);)(e.state||t)&&n.push(e);for(let s=n.length-1;s>=0;s--)if(e=n[s],e.state===U||t)X(e);else if(e.state===de||t){const r=x;x=null,J(()=>ye(e,n[0]),!1),x=r}}function J(e,t){if(x)return e();let n=!1;t||(x=[]),M?n=!0:M=[],Pe++;try{const s=e();return xt(n),s}catch(s){x||(M=null),Ze(s)}}function xt(e){if(x&&(Xe(x),x=null),e)return;const t=M;M=null,t.length&&J(()=>He(t),!1)}function Xe(e){for(let t=0;t<e.length;t++)ge(e[t])}function Ot(e){let t,n=0;for(t=0;t<e.length;t++){const s=e[t];s.user?e[n++]=s:ge(s)}for(w.context&&F(),t=0;t<n;t++)ge(e[t])}function ye(e,t){const n=q;e.state=0;for(let s=0;s<e.sources.length;s+=1){const r=e.sources[s];r.sources&&(r.state===U||n?r!==t&&ge(r):(r.state===de||n)&&ye(r,t))}}function Ye(e){const t=q;for(let n=0;n<e.observers.length;n+=1){const s=e.observers[n];(!s.state||t)&&(s.state=de,s.pure?x.push(s):M.push(s),s.observers&&Ye(s))}}function Le(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),s=e.sourceSlots.pop(),r=n.observers;if(r&&r.length){const o=r.pop(),l=n.observerSlots.pop();s<r.length&&(o.sourceSlots[l]=s,r[s]=o,n.observerSlots[s]=l)}}if(e.owned){for(t=0;t<e.owned.length;t++)Le(e.owned[t]);e.owned=null}if(e.cleanups){for(t=0;t<e.cleanups.length;t++)e.cleanups[t]();e.cleanups=null}e.state=0,e.context=null}function Qe(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function Ze(e){throw e=Qe(e),e}function be(e,t){return e?e.context&&e.context[t]!==void 0?e.context[t]:be(e.owner,t):void 0}function ve(e){if(typeof e=="function"&&!e.length)return ve(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const s=ve(e[n]);Array.isArray(s)?t.push.apply(t,s):t.push(s)}return t}return e}function Ct(e,t){return function(s){let r;return he(()=>r=j(()=>(b.context={[e]:s.value},Ge(()=>s.children))),void 0),r}}const Pt=Symbol("fallback");function Me(e){for(let t=0;t<e.length;t++)e[t]()}function Nt(e,t,n={}){let s=[],r=[],o=[],l=0,i=t.length>1?[]:null;return Se(()=>Me(o)),()=>{let u=e()||[],f,c;return u[Ee],j(()=>{let h=u.length,d,S,v,O,L,D,g,P,I;if(h===0)l!==0&&(Me(o),o=[],s=[],r=[],l=0,i&&(i=[])),n.fallback&&(s=[Pt],r[0]=re(B=>(o[0]=B,n.fallback())),l=1);else if(l===0){for(r=new Array(h),c=0;c<h;c++)s[c]=u[c],r[c]=re(a);l=h}else{for(v=new Array(h),O=new Array(h),i&&(L=new Array(h)),D=0,g=Math.min(l,h);D<g&&s[D]===u[D];D++);for(g=l-1,P=h-1;g>=D&&P>=D&&s[g]===u[P];g--,P--)v[P]=r[g],O[P]=o[g],i&&(L[P]=i[g]);for(d=new Map,S=new Array(P+1),c=P;c>=D;c--)I=u[c],f=d.get(I),S[c]=f===void 0?-1:f,d.set(I,c);for(f=D;f<=g;f++)I=s[f],c=d.get(I),c!==void 0&&c!==-1?(v[c]=r[f],O[c]=o[f],i&&(L[c]=i[f]),c=S[c],d.set(I,c)):o[f]();for(c=D;c<h;c++)c in v?(r[c]=v[c],o[c]=O[c],i&&(i[c]=L[c],i[c](c))):r[c]=re(a);r=r.slice(0,l=h),s=u.slice(0)}return r});function a(h){if(o[c]=h,i){const[d,S]=m(c);return i[c]=S,t(u[c],d)}return t(u[c])}}}function H(e,t){return j(()=>e(t||{}))}function et(e){let t,n;const s=r=>{const o=w.context;if(o){const[i,u]=m();(n||(n=e())).then(f=>{F(o),u(()=>f.default),F()}),t=i}else if(t){const i=t();if(i)return i(r)}else{const[i]=bt(()=>(n||(n=e())).then(u=>u.default));t=i}let l;return T(()=>(l=t())&&j(()=>{if(!o)return l(r);const i=w.context;F(o);const u=l(r);return F(i),u}))};return s.preload=()=>n||((n=e()).then(r=>t=()=>r.default),n),s}function sn(e){const t="fallback"in e&&{fallback:()=>e.fallback};return T(Nt(()=>e.each,e.children,t||void 0))}function qe(e){let t=!1;const n=e.keyed,s=T(()=>e.when,void 0,{equals:(r,o)=>t?r===o:!r==!o});return T(()=>{const r=s();if(r){const o=e.children,l=typeof o=="function"&&o.length>0;return t=n||l,l?j(()=>o(r)):o}return e.fallback})}function rn(e){let t=!1,n=!1;const s=Ge(()=>e.children),r=T(()=>{let o=s();Array.isArray(o)||(o=[o]);for(let l=0;l<o.length;l++){const i=o[l].when;if(i)return n=!!o[l].keyed,[l,i,o[l]]}return[-1]},void 0,{equals:(o,l)=>o[0]===l[0]&&(t?o[1]===l[1]:!o[1]==!l[1])&&o[2]===l[2]});return T(()=>{const[o,l,i]=r();if(o<0)return e.fallback;const u=i.children,f=typeof u=="function"&&u.length>0;return t=n||f,f?j(()=>u(l)):u})}function on(e){return e}const Lt=Ne();function Tt(e){let t=0,n,s,r,o,l;const[i,u]=m(!1),f=Et(),c={increment:()=>{++t===1&&u(!0)},decrement:()=>{--t===0&&u(!1)},inFallback:i,effects:[],resolved:!1},a=kt();if(w.context&&w.load){const S=w.context.id+w.context.count;let v=w.load(S);if(v&&(r=v[0])&&r!=="$$f"){(typeof r!="object"||!("then"in r))&&(r=Promise.resolve(r));const[O,L]=m(void 0,{equals:!1});o=O,r.then(D=>{if(D||w.done)return D&&(l=D),L();w.gather(S),F(s),L(),F()})}}const h=ze(Lt);h&&(n=h.register(c.inFallback));let d;return Se(()=>d&&d()),H(f.Provider,{value:c,get children(){return T(()=>{if(l)throw l;if(s=w.context,o)return o(),o=void 0;s&&r==="$$f"&&F();const S=T(()=>e.children);return T(v=>{const O=c.inFallback(),{showContent:L=!0,showFallback:D=!0}=n?n():{};if((!O||r&&r!=="$$f")&&L)return c.resolved=!0,d&&d(),d=s=r=void 0,$t(c.effects),S();if(!!D)return d?v:re(g=>(d=g,s&&(F({id:s.id+"f",count:0}),s=void 0),e.fallback),a)})})}})}function _t(e,t,n){let s=n.length,r=t.length,o=s,l=0,i=0,u=t[r-1].nextSibling,f=null;for(;l<r||i<o;){if(t[l]===n[i]){l++,i++;continue}for(;t[r-1]===n[o-1];)r--,o--;if(r===l){const c=o<s?i?n[i-1].nextSibling:n[o-i]:u;for(;i<o;)e.insertBefore(n[i++],c)}else if(o===i)for(;l<r;)(!f||!f.has(t[l]))&&t[l].remove(),l++;else if(t[l]===n[o-1]&&n[i]===t[r-1]){const c=t[--r].nextSibling;e.insertBefore(n[i++],t[l++].nextSibling),e.insertBefore(n[--o],c),t[r]=n[o]}else{if(!f){f=new Map;let a=i;for(;a<o;)f.set(n[a],a++)}const c=f.get(t[l]);if(c!=null)if(i<c&&c<o){let a=l,h=1,d;for(;++a<r&&a<o&&!((d=f.get(t[a]))==null||d!==c+h);)h++;if(h>c-i){const S=t[l];for(;i<c;)e.insertBefore(n[i++],S)}else e.replaceChild(n[i++],t[l++])}else l++;else t[l++].remove()}}}const Fe="_$DX_DELEGATE";function jt(e,t,n,s={}){let r;return re(o=>{r=o,t===document?e():Rt(t,e(),t.firstChild?null:void 0,n)},s.owner),()=>{r(),t.textContent=""}}function tt(e,t,n){const s=document.createElement("template");s.innerHTML=e;let r=s.content.firstChild;return n&&(r=r.firstChild),r}function ln(e,t=window.document){const n=t[Fe]||(t[Fe]=new Set);for(let s=0,r=e.length;s<r;s++){const o=e[s];n.has(o)||(n.add(o),t.addEventListener(o,Mt))}}function It(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function cn(e,t){t==null?e.removeAttribute("class"):e.className=t}function un(e,t,n,s){if(s)Array.isArray(n)?(e[`$$${t}`]=n[0],e[`$$${t}Data`]=n[1]):e[`$$${t}`]=n;else if(Array.isArray(n)){const r=n[0];e.addEventListener(t,n[0]=o=>r.call(e,n[1],o))}else e.addEventListener(t,n)}function fn(e,t,n){if(!t)return n?It(e,"style"):t;const s=e.style;if(typeof t=="string")return s.cssText=t;typeof n=="string"&&(s.cssText=n=void 0),n||(n={}),t||(t={});let r,o;for(o in n)t[o]==null&&s.removeProperty(o),delete n[o];for(o in t)r=t[o],r!==n[o]&&(s.setProperty(o,r),n[o]=r);return n}function an(e,t,n){return j(()=>e(t,n))}function Rt(e,t,n,s){if(n!==void 0&&!s&&(s=[]),typeof t!="function")return we(e,t,s,n);he(r=>we(e,t(),r,n),s)}function Mt(e){const t=`$$${e.type}`;let n=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==n&&Object.defineProperty(e,"target",{configurable:!0,value:n}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return n||document}}),w.registry&&!w.done&&(w.done=!0,document.querySelectorAll("[id^=pl-]").forEach(s=>s.remove()));n!==null;){const s=n[t];if(s&&!n.disabled){const r=n[`${t}Data`];if(r!==void 0?s.call(n,r,e):s.call(n,e),e.cancelBubble)return}n=n.host&&n.host!==n&&n.host instanceof Node?n.host:n.parentNode}}function we(e,t,n,s,r){for(w.context&&!n&&(n=[...e.childNodes]);typeof n=="function";)n=n();if(t===n)return n;const o=typeof t,l=s!==void 0;if(e=l&&n[0]&&n[0].parentNode||e,o==="string"||o==="number"){if(w.context)return n;if(o==="number"&&(t=t.toString()),l){let i=n[0];i&&i.nodeType===3?i.data=t:i=document.createTextNode(t),n=K(e,n,s,i)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||o==="boolean"){if(w.context)return n;n=K(e,n,s)}else{if(o==="function")return he(()=>{let i=t();for(;typeof i=="function";)i=i();n=we(e,i,n,s)}),()=>n;if(Array.isArray(t)){const i=[],u=n&&Array.isArray(n);if(xe(i,t,n,r))return he(()=>n=we(e,i,n,s,!0)),()=>n;if(w.context){if(!i.length)return n;for(let f=0;f<i.length;f++)if(i[f].parentNode)return n=i}if(i.length===0){if(n=K(e,n,s),l)return n}else u?n.length===0?Ue(e,i,s):_t(e,n,i):(n&&K(e),Ue(e,i));n=i}else if(t instanceof Node){if(w.context&&t.parentNode)return n=l?[t]:t;if(Array.isArray(n)){if(l)return n=K(e,n,s,t);K(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function xe(e,t,n,s){let r=!1;for(let o=0,l=t.length;o<l;o++){let i=t[o],u=n&&n[o];if(i instanceof Node)e.push(i);else if(!(i==null||i===!0||i===!1))if(Array.isArray(i))r=xe(e,i,u)||r;else if(typeof i=="function")if(s){for(;typeof i=="function";)i=i();r=xe(e,Array.isArray(i)?i:[i],Array.isArray(u)?u:[u])||r}else e.push(i),r=!0;else{const f=String(i);u&&u.nodeType===3&&u.data===f?e.push(u):e.push(document.createTextNode(f))}}return r}function Ue(e,t,n=null){for(let s=0,r=t.length;s<r;s++)e.insertBefore(t[s],n)}function K(e,t,n,s){if(n===void 0)return e.textContent="";const r=s||document.createTextNode("");if(t.length){let o=!1;for(let l=t.length-1;l>=0;l--){const i=t[l];if(r!==i){const u=i.parentNode===e;!o&&!l?u?e.replaceChild(r,i):e.insertBefore(r,n):u&&i.remove()}else o=!0}}else e.insertBefore(r,n);return[r]}const Oe=Symbol("store-raw"),oe=Symbol("store-node"),qt=Symbol("store-name");function nt(e,t){let n=e[G];if(!n&&(Object.defineProperty(e,G,{value:n=new Proxy(e,Bt)}),!Array.isArray(e))){const s=Object.keys(e),r=Object.getOwnPropertyDescriptors(e);for(let o=0,l=s.length;o<l;o++){const i=s[o];if(r[i].get){const u=r[i].get.bind(n);Object.defineProperty(e,i,{enumerable:r[i].enumerable,get:u})}}}return n}function pe(e){let t;return e!=null&&typeof e=="object"&&(e[G]||!(t=Object.getPrototypeOf(e))||t===Object.prototype||Array.isArray(e))}function ie(e,t=new Set){let n,s,r,o;if(n=e!=null&&e[Oe])return n;if(!pe(e)||t.has(e))return e;if(Array.isArray(e)){Object.isFrozen(e)?e=e.slice(0):t.add(e);for(let l=0,i=e.length;l<i;l++)r=e[l],(s=ie(r,t))!==r&&(e[l]=s)}else{Object.isFrozen(e)?e=Object.assign({},e):t.add(e);const l=Object.keys(e),i=Object.getOwnPropertyDescriptors(e);for(let u=0,f=l.length;u<f;u++)o=l[u],!i[o].get&&(r=e[o],(s=ie(r,t))!==r&&(e[o]=s))}return e}function Te(e){let t=e[oe];return t||Object.defineProperty(e,oe,{value:t={}}),t}function Ce(e,t,n){return e[t]||(e[t]=rt(n))}function Ft(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||!n.configurable||t===G||t===oe||t===qt||(delete n.value,delete n.writable,n.get=()=>e[G][t]),n}function st(e){if(Ve()){const t=Te(e);(t._||(t._=rt()))()}}function Ut(e){return st(e),Reflect.ownKeys(e)}function rt(e){const[t,n]=m(e,{equals:!1,internal:!0});return t.$=n,t}const Bt={get(e,t,n){if(t===Oe)return e;if(t===G)return n;if(t===Ee)return st(e),n;const s=Te(e),r=s.hasOwnProperty(t);let o=r?s[t]():e[t];if(t===oe||t==="__proto__")return o;if(!r){const l=Object.getOwnPropertyDescriptor(e,t);Ve()&&(typeof o!="function"||e.hasOwnProperty(t))&&!(l&&l.get)&&(o=Ce(s,t,o)())}return pe(o)?nt(o):o},has(e,t){return t===Oe||t===G||t===Ee||t===oe||t==="__proto__"?!0:(this.get(e,t,e),t in e)},set(){return!0},deleteProperty(){return!0},ownKeys:Ut,getOwnPropertyDescriptor:Ft};function me(e,t,n,s=!1){if(!s&&e[t]===n)return;const r=e[t],o=e.length;n===void 0?delete e[t]:e[t]=n;let l=Te(e),i;(i=Ce(l,t,r))&&i.$(()=>n),Array.isArray(e)&&e.length!==o&&(i=Ce(l,"length",o))&&i.$(e.length),(i=l._)&&i.$()}function ot(e,t){const n=Object.keys(t);for(let s=0;s<n.length;s+=1){const r=n[s];me(e,r,t[r])}}function Ht(e,t){if(typeof t=="function"&&(t=t(e)),t=ie(t),Array.isArray(t)){if(e===t)return;let n=0,s=t.length;for(;n<s;n++){const r=t[n];e[n]!==r&&me(e,n,r)}me(e,"length",s)}else ot(e,t)}function se(e,t,n=[]){let s,r=e;if(t.length>1){s=t.shift();const l=typeof s,i=Array.isArray(e);if(Array.isArray(s)){for(let u=0;u<s.length;u++)se(e,[s[u]].concat(t),n);return}else if(i&&l==="function"){for(let u=0;u<e.length;u++)s(e[u],u)&&se(e,[u].concat(t),n);return}else if(i&&l==="object"){const{from:u=0,to:f=e.length-1,by:c=1}=s;for(let a=u;a<=f;a+=c)se(e,[a].concat(t),n);return}else if(t.length>1){se(e[s],t,[s].concat(n));return}r=e[s],n=[s].concat(n)}let o=t[0];typeof o=="function"&&(o=o(r,n),o===r)||s===void 0&&o==null||(o=ie(o),s===void 0||pe(r)&&pe(o)&&!Array.isArray(o)?ot(r,o):me(e,s,o))}function Jt(...[e,t]){const n=ie(e||{}),s=Array.isArray(n),r=nt(n);function o(...l){Dt(()=>{s&&l.length===1?Ht(n,l[0]):se(n,l)})}return[r,o]}const Vt=e=>{let t=864e5,n=new Date(e.getFullYear(),e.getMonth(),e.getDate()),s=n.getDay()*t,r=new Date(n.getTime()-s+t);return r>n&&(r=new Date(r.getTime()-t*7)),r},it=(e,t)=>{let n;return n=Vt(e),n.setDate(n.getDate()+t*7),n},zt=async(e,t)=>{const n=it(e,t);let s=[];n.setDate(n.getDate()-n.getDay()+1);for(let r=0;r<5;r++)s.push(new Date(n)),n.setDate(n.getDate()+1);return Promise.resolve(s)},Gt=e=>`${e.getFullYear()}`+`${Math.ceil(Math.floor((Number(e)-Number(new Date(e.getFullYear(),0,1)))/(24*60*60*1e3))/7)}`.padStart(2,"0");function Kt(e,t,n){if(e.length<1)return[];let s=new Date(e.reduce((i,u)=>u.end>i?u.end:i,e[0].end)*1e3).getHours()+1,r=new Date(e.reduce((i,u)=>u.start<i?u.start:i,e[0].start)*1e3).getHours();r>t&&(r=t),s<n&&(s=n);let o=[];for(var l=r;l<=s;l++)o.push(l);return o}const Wt=(e,t,n)=>{if(e.length<1)return[];const s=e.filter(c=>new Date(c.start*1e3).toDateString()===t[0].toDateString()&&new Date(c.end*1e3).toDateString()===t[0].toDateString()),r=e.filter(c=>new Date(c.start*1e3).toDateString()===t[1].toDateString()&&new Date(c.end*1e3).toDateString()===t[1].toDateString()),o=e.filter(c=>new Date(c.start*1e3).toDateString()===t[2].toDateString()&&new Date(c.end*1e3).toDateString()===t[2].toDateString()),l=e.filter(c=>new Date(c.start*1e3).toDateString()===t[3].toDateString()&&new Date(c.end*1e3).toDateString()===t[3].toDateString()),i=e.filter(c=>new Date(c.start*1e3).toDateString()===t[4].toDateString()&&new Date(c.end*1e3).toDateString()===t[4].toDateString());let u=[s,r,o,l,i],f=u;return n==="false"&&(f=u.map(c=>c.filter(a=>a.appointmentType!=="choice"))),f};function lt(e){return`https://${e}.zportal.nl`}async function dn(e,t){const n=lt(e),s=await fetch(`${n}/api/v3/oauth/token?grant_type=authorization_code&code=${t}`,{method:"POST"});if(!s.ok)return await Promise.reject(Error("Server returned an error. you probably entered an invalid code."));const r=await s.json();return r.access_token?await Promise.resolve(r.access_token):await Promise.reject(Error("No access token could be retrieved from server."))}const $e=async(e,t,n,s,r)=>{if(e!=="GET"&&e!=="POST")return;const o=lt(s),l=await fetch(`${o}${t}`,{method:e,headers:{Authorization:`Bearer ${n}`},signal:r});if(!l.ok)throw new Error(`Server returned with an error (${l.status})`);const i=await l.json();if(i)return i;throw new Error("Server returned with an error")},Xt=e=>{const[t,n]=m(window.matchMedia(e.query).matches);return fe(()=>{const s=window.matchMedia(e.query),r=()=>{s.matches!==t()&&n(s.matches)};window.addEventListener("resize",r),Se(()=>window.removeEventListener("resize",r))}),t},Yt=tt('<div class="loader-div"><span class="loader"></span></div>'),Qt=et(()=>Be(()=>import("./Login.dd2e7b21.js"),["assets/Login.dd2e7b21.js","assets/Translate.7bcbe563.js","assets/Login.49c06998.css"])),Zt={localPREFIX:"zermelo",settings:{lng:"nl",showChoices:"false",theme:"light",enableCustom:"false"},updateSettings:()=>()=>{},isDesktop:()=>!0,user:()=>"",accounts:()=>[],currentAccount:()=>0,logOut:()=>{},logIn:()=>{},toggleAddAccount:()=>{},switchAccount:()=>{},scheduleHours:()=>[],datesLoad:()=>[],scheduleLoad:()=>[],announcementsLoad:()=>[],fetchLiveSchedule:()=>Promise.resolve([])},ct=Ne(Zt);function hn(){return ze(ct)}function en(e){const t="zermelo",[n,s]=m(8),[r,o]=m(16),l=Xt({query:"(min-width: 1110px)"}),[i,u]=m(!0),[f,c]=m(!1),[a,h]=m(JSON.parse(localStorage.getItem(`${t}-accounts`)||"[]")),[d,S]=m(Number(localStorage.getItem(`${t}-current`)||0)),[v,O]=m(!1),[L,D]=m(""),[g,P]=Jt(JSON.parse(localStorage.getItem(`${t}-settings`)||'{"lng": "nl", "theme": "light", "showChoices": "false", "enableCustom": "false"}')),[I,B]=m(""),[De,Y]=m([]),[Q,p]=m([]),[$,k]=m([]),[V,ut]=m([]),ft=y=>E=>{const C=E.currentTarget;P({[y]:C.value})};fe(()=>{!Array.isArray(a())||a().length===0?(c(!1),u(!1)):(d()>a().length-1&&S(a().length-1),c(!0))}),fe(Re(()=>[a(),d()],()=>{const y=a()[d()];if(!f()||!y.accessToken)return;u(!0);const E=new Date().getDay()===6||new Date().getDay()===0?1:0,C=new AbortController,N=C.signal;(async()=>{let z;const ee=await yt(N);if(ee&&ee.data[0].code)z=ee.data[0].code;else{c(!1),u(!1);return}const le=await zt(new Date,E),ce=await Promise.all([_e(z,le,E,N),pt(N)]);let ue=ce[0],te=ce[1];if(!ue.every(_=>_.length<1)){const _=[...new Set(ue.flat().map(R=>R.groups?R.groups[0]:"").filter(R=>R?.includes(".")))].map(R=>R.split("."))[0][0];if(_!==I()&&_!==""){const R=te.filter(ne=>ne.title.toLowerCase().match(/\d+[A-z]/g)?.includes(_)||!_);B(_),k(R)}else k(te)}D(z),ut(le),p(ue),u(!1)})(),Se(()=>C.abort())})),fe(Re(()=>[g.enableCustom,g.showChoices,g.lng,g.theme],()=>{!g||(localStorage.setItem(`${t}-settings`,JSON.stringify(g)),document.body.classList.value=g.theme)}));const at=()=>{u(!0);const y=a();y.splice(d(),1),localStorage.setItem(`${t}-accounts`,JSON.stringify(y)),localStorage.setItem(`${t}-current`,JSON.stringify(0)),h(y),S(0),y.length<1&&c(!1)},dt=(y,E)=>{u(!0);const C=[...E,y],N=C.indexOf(y);localStorage.setItem(`${t}-accounts`,JSON.stringify(C)),localStorage.setItem(`${t}-current`,JSON.stringify(N)),h(C),S(N),O(!1),c(!0)},ht=()=>{O(!v()),c(!f())},gt=y=>{y<-1||y>a().length||(localStorage.setItem(`${t}-current`,JSON.stringify(y)),S(y))};async function yt(y){const E=a()[d()],C=E.school,N=E.accessToken;return(await $e("GET","/api/v3/users/~me?fields=code,displayName",N,C,y)).response}async function wt(y){const E=localStorage.getItem(`${t}-customappointments`);if(!E)return[];const N=JSON.parse(E)[y]||[];return Promise.resolve(N)}async function _e(y,E,C,N){const Z=a()[d()],z=Z.school,ee=Z.accessToken,le=it(new Date,C),ce=Gt(le),te=(await $e("GET",`/api/v3/liveschedule?student=${y}&week=${ce}&fields=start,end,startTimeSlotName,endTimeSlotName,subjects,groups,locations,teachers,cancelled,changeDescription,schedulerRemark,content,appointmentType`,ee,z,N)).response;let _=te.data[0].appointments;if(g.enableCustom==="true"){const ne=await wt(y);_=te.data[0].appointments.concat(ne)}let R=[];if(_.length>1){R=Wt(_,E,g.showChoices);const ne=Kt(_,n(),r());Y(ne)}return Promise.resolve(R)}async function pt(y){const E=a()[d()],C=E.school,N=E.accessToken,z=(await $e("GET","/api/v3/announcements?user=~me&current=true&fields=text,title,id,read",N,C,y)).response;return Promise.resolve(z.data)}return H(ct.Provider,{value:{localPREFIX:t,user:L,isDesktop:l,accounts:a,currentAccount:d,logOut:at,logIn:dt,toggleAddAccount:ht,settings:g,updateSettings:ft,switchAccount:gt,scheduleHours:De,scheduleLoad:Q,announcementsLoad:$,datesLoad:V,fetchLiveSchedule:_e},get children(){return H(qe,{get when(){return!i()},get fallback(){return Yt.cloneNode(!0)},get children(){return H(qe,{get when(){return T(()=>!!f())()&&a()},get fallback(){return H(Qt,{addAccount:v})},get children(){return e.children}})}})}})}const tn=tt('<div class="loader-div"><span class="loader"></span></div>'),nn=et(()=>Be(()=>import("./App.3605f947.js").then(e=>e.A),["assets/App.3605f947.js","assets/Translate.7bcbe563.js","assets/App.f21c8269.css"]));jt(()=>H(en,{get children(){return H(Tt,{get fallback(){return tn.cloneNode(!0)},get children(){return H(nn,{})}})}}),document.body);document.body.querySelector(".loader-div")?.remove();export{sn as F,on as M,qe as S,Be as _,H as a,un as b,fe as c,he as d,ln as e,cn as f,T as g,it as h,Rt as i,m as j,Vt as k,et as l,Tt as m,fn as n,Se as o,Re as p,zt as q,an as r,It as s,tt as t,hn as u,rn as v,Jt as w,dn as x,$e as y};
