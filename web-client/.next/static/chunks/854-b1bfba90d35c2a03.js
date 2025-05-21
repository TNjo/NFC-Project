"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[854],{8954:function(e,t,r){r.d(t,{BH:function(){return b},L:function(){return c},LL:function(){return I},P0:function(){return m},Sg:function(){return v},UG:function(){return w},ZR:function(){return A},aH:function(){return _},eu:function(){return E},hl:function(){return y},m9:function(){return R},vZ:function(){return function e(t,r){if(t===r)return!0;let n=Object.keys(t),i=Object.keys(r);for(let a of n){if(!i.includes(a))return!1;let n=t[a],o=r[a];if(C(n)&&C(o)){if(!e(n,o))return!1}else if(n!==o)return!1}for(let e of i)if(!n.includes(e))return!1;return!0}}});var n=r(9079);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let i=function(e){let t=[],r=0;for(let n=0;n<e.length;n++){let i=e.charCodeAt(n);i<128?t[r++]=i:(i<2048?t[r++]=i>>6|192:((64512&i)==55296&&n+1<e.length&&(64512&e.charCodeAt(n+1))==56320?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++n)),t[r++]=i>>18|240,t[r++]=i>>12&63|128):t[r++]=i>>12|224,t[r++]=i>>6&63|128),t[r++]=63&i|128)}return t},a=function(e){let t=[],r=0,n=0;for(;r<e.length;){let i=e[r++];if(i<128)t[n++]=String.fromCharCode(i);else if(i>191&&i<224){let a=e[r++];t[n++]=String.fromCharCode((31&i)<<6|63&a)}else if(i>239&&i<365){let a=((7&i)<<18|(63&e[r++])<<12|(63&e[r++])<<6|63&e[r++])-65536;t[n++]=String.fromCharCode(55296+(a>>10)),t[n++]=String.fromCharCode(56320+(1023&a))}else{let a=e[r++],o=e[r++];t[n++]=String.fromCharCode((15&i)<<12|(63&a)<<6|63&o)}}return t.join("")},o={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let t=0;t<e.length;t+=3){let i=e[t],a=t+1<e.length,o=a?e[t+1]:0,s=t+2<e.length,l=s?e[t+2]:0,c=i>>2,h=(3&i)<<4|o>>4,u=(15&o)<<2|l>>6,d=63&l;s||(d=64,a||(u=64)),n.push(r[c],r[h],r[u],r[d])}return n.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(i(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):a(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let r=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let t=0;t<e.length;){let i=r[e.charAt(t++)],a=t<e.length?r[e.charAt(t)]:0,o=++t<e.length?r[e.charAt(t)]:64,l=++t<e.length?r[e.charAt(t)]:64;if(++t,null==i||null==a||null==o||null==l)throw new s;let c=i<<2|a>>4;if(n.push(c),64!==o){let e=a<<4&240|o>>2;if(n.push(e),64!==l){let e=o<<6&192|l;n.push(e)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class s extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}let l=function(e){let t=i(e);return o.encodeByteArray(t,!0)},c=function(e){return l(e).replace(/\./g,"")},h=function(e){try{return o.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null},u=()=>("undefined"!=typeof self?self:window).__FIREBASE_DEFAULTS__,d=()=>{if(void 0===n||void 0===n.env)return;let e=n.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},f=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&h(e[1]);return t&&JSON.parse(t)},p=()=>{try{return u()||d()||f()}catch(e){console.info("Unable to get __FIREBASE_DEFAULTS__ due to: ".concat(e));return}},g=e=>{var t,r;return null===(r=null===(t=p())||void 0===t?void 0:t.emulatorHosts)||void 0===r?void 0:r[e]},m=e=>{let t=g(e);if(!t)return;let r=t.lastIndexOf(":");if(r<=0||r+1===t.length)throw Error("Invalid host ".concat(t," with no separate hostname and port!"));let n=parseInt(t.substring(r+1),10);return"["===t[0]?[t.substring(1,r-1),n]:[t.substring(0,r),n]},_=()=>{var e;return null===(e=p())||void 0===e?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b{wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,r))}}constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v(e,t){if(e.uid)throw Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let r=t||"demo-project",n=e.iat||0,i=e.sub||e.user_id;if(!i)throw Error("mockUserToken must contain 'sub' or 'user_id' field!");let a=Object.assign({iss:"https://securetoken.google.com/".concat(r),aud:r,iat:n,exp:n+3600,auth_time:n,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},e);return[c(JSON.stringify({alg:"none",type:"JWT"})),c(JSON.stringify(a)),""].join(".")}function w(){var e;let t=null===(e=p())||void 0===e?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(r.g.process)}catch(e){return!1}}function y(){try{return"object"==typeof indexedDB}catch(e){return!1}}function E(){return new Promise((e,t)=>{try{let r=!0,n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),r||self.indexedDB.deleteDatabase(n),e(!0)},i.onupgradeneeded=()=>{r=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}})}class A extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name="FirebaseError",Object.setPrototypeOf(this,A.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,I.prototype.create)}}class I{create(e){for(var t=arguments.length,r=Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];let i=r[0]||{},a="".concat(this.service,"/").concat(e),o=this.errors[e],s=o?o.replace(T,(e,t)=>{let r=i[t];return null!=r?String(r):"<".concat(t,"?>")}):"Error",l="".concat(this.serviceName,": ").concat(s," (").concat(a,").");return new A(a,l,i)}constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}}let T=/\{\$([^}]+)}/g;function C(e){return null!==e&&"object"==typeof e}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R(e){return e&&e._delegate?e._delegate:e}},7977:function(e,t,r){r.d(t,{Z:function(){return u}});var n=r(4090);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),a=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase()),o=e=>{let t=a(e);return t.charAt(0).toUpperCase()+t.slice(1)},s=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim()},l=e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0};/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var c={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let h=(0,n.forwardRef)((e,t)=>{let{color:r="currentColor",size:i=24,strokeWidth:a=2,absoluteStrokeWidth:o,className:h="",children:u,iconNode:d,...f}=e;return(0,n.createElement)("svg",{ref:t,...c,width:i,height:i,stroke:r,strokeWidth:o?24*Number(a)/Number(i):a,className:s("lucide",h),...!u&&!l(f)&&{"aria-hidden":"true"},...f},[...d.map(e=>{let[t,r]=e;return(0,n.createElement)(t,r)}),...Array.isArray(u)?u:[u]])}),u=(e,t)=>{let r=(0,n.forwardRef)((r,a)=>{let{className:l,...c}=r;return(0,n.createElement)(h,{ref:a,iconNode:t,className:s("lucide-".concat(i(o(e))),"lucide-".concat(e),l),...c})});return r.displayName=o(e),r}},3861:function(e,t,r){r.d(t,{Z:function(){return n}});let n=(0,r(7977).Z)("crown",[["path",{d:"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",key:"1vdc57"}],["path",{d:"M5 21h14",key:"11awu3"}]])},8727:function(e,t,r){r.d(t,{Z:function(){return n}});let n=(0,r(7977).Z)("sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]])},1213:function(e,t,r){r.d(t,{Z:function(){return n}});let n=(0,r(7977).Z)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},9079:function(e,t,r){var n,i;e.exports=(null==(n=r.g.process)?void 0:n.env)&&"object"==typeof(null==(i=r.g.process)?void 0:i.env)?r.g.process:r(3127)},3127:function(e){!function(){var t={229:function(e){var t,r,n,i=e.exports={};function a(){throw Error("setTimeout has not been defined")}function o(){throw Error("clearTimeout has not been defined")}function s(e){if(t===setTimeout)return setTimeout(e,0);if((t===a||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:a}catch(e){t=a}try{r="function"==typeof clearTimeout?clearTimeout:o}catch(e){r=o}}();var l=[],c=!1,h=-1;function u(){c&&n&&(c=!1,n.length?l=n.concat(l):h=-1,l.length&&d())}function d(){if(!c){var e=s(u);c=!0;for(var t=l.length;t;){for(n=l,l=[];++h<t;)n&&n[h].run();h=-1,t=l.length}n=null,c=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===o||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function f(e,t){this.fun=e,this.array=t}function p(){}i.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];l.push(new f(e,t)),1!==l.length||c||s(d)},f.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=p,i.addListener=p,i.once=p,i.off=p,i.removeListener=p,i.removeAllListeners=p,i.emit=p,i.prependListener=p,i.prependOnceListener=p,i.listeners=function(e){return[]},i.binding=function(e){throw Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw Error("process.chdir is not supported")},i.umask=function(){return 0}}},r={};function n(e){var i=r[e];if(void 0!==i)return i.exports;var a=r[e]={exports:{}},o=!0;try{t[e](a,a.exports,n),o=!1}finally{o&&delete r[e]}return a.exports}n.ab="//";var i=n(229);e.exports=i}()},900:function(e,t,r){let n,i;r.d(t,{Jn:function(){return j},qX:function(){return M},Xd:function(){return P},Mq:function(){return z},ZF:function(){return V},KN:function(){return W}});var a,o,s,l=r(6574);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let c=[];(o=s||(s={}))[o.DEBUG=0]="DEBUG",o[o.VERBOSE=1]="VERBOSE",o[o.INFO=2]="INFO",o[o.WARN=3]="WARN",o[o.ERROR=4]="ERROR",o[o.SILENT=5]="SILENT";let h={debug:s.DEBUG,verbose:s.VERBOSE,info:s.INFO,warn:s.WARN,error:s.ERROR,silent:s.SILENT},u=s.INFO,d={[s.DEBUG]:"log",[s.VERBOSE]:"log",[s.INFO]:"info",[s.WARN]:"warn",[s.ERROR]:"error"},f=function(e,t){for(var r=arguments.length,n=Array(r>2?r-2:0),i=2;i<r;i++)n[i-2]=arguments[i];if(t<e.logLevel)return;let a=new Date().toISOString(),o=d[t];if(o)console[o]("[".concat(a,"]  ").concat(e.name,":"),...n);else throw Error("Attempted to log a message with an invalid logType (value: ".concat(t,")"))};class p{get logLevel(){return this._logLevel}set logLevel(e){if(!(e in s))throw TypeError('Invalid value "'.concat(e,'" assigned to `logLevel`'));this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?h[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];this._userLogHandler&&this._userLogHandler(this,s.DEBUG,...t),this._logHandler(this,s.DEBUG,...t)}log(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];this._userLogHandler&&this._userLogHandler(this,s.VERBOSE,...t),this._logHandler(this,s.VERBOSE,...t)}info(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];this._userLogHandler&&this._userLogHandler(this,s.INFO,...t),this._logHandler(this,s.INFO,...t)}warn(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];this._userLogHandler&&this._userLogHandler(this,s.WARN,...t),this._logHandler(this,s.WARN,...t)}error(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];this._userLogHandler&&this._userLogHandler(this,s.ERROR,...t),this._logHandler(this,s.ERROR,...t)}constructor(e){this.name=e,this._logLevel=u,this._logHandler=f,this._userLogHandler=null,c.push(this)}}var g=r(8954);let m=(e,t)=>t.some(t=>e instanceof t),_=new WeakMap,b=new WeakMap,v=new WeakMap,w=new WeakMap,y=new WeakMap,E={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return b.get(e);if("objectStoreNames"===t)return e.objectStoreNames||v.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return A(e[t])},set:(e,t,r)=>(e[t]=r,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function A(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,r)=>{let n=()=>{e.removeEventListener("success",i),e.removeEventListener("error",a)},i=()=>{t(A(e.result)),n()},a=()=>{r(e.error),n()};e.addEventListener("success",i),e.addEventListener("error",a)});return t.then(t=>{t instanceof IDBCursor&&_.set(t,e)}).catch(()=>{}),y.set(t,e),t}(e);if(w.has(e))return w.get(e);let r="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(){for(var e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];return t.apply(I(this),r),A(_.get(this))}:function(){for(var e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];return A(t.apply(I(this),r))}:function(e){for(var r=arguments.length,n=Array(r>1?r-1:0),i=1;i<r;i++)n[i-1]=arguments[i];let a=t.call(I(this),e,...n);return v.set(a,e.sort?e.sort():[e]),A(a)}:(t instanceof IDBTransaction&&function(e){if(b.has(e))return;let t=new Promise((t,r)=>{let n=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",a),e.removeEventListener("abort",a)},i=()=>{t(),n()},a=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",i),e.addEventListener("error",a),e.addEventListener("abort",a)});b.set(e,t)}(t),m(t,n||(n=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,E):t;return r!==e&&(w.set(e,r),y.set(r,e)),r}let I=e=>y.get(e),T=["get","getKey","getAll","getAllKeys","count"],C=["put","add","delete","clear"],R=new Map;function D(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(R.get(t))return R.get(t);let r=t.replace(/FromIndex$/,""),n=t!==r,i=C.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!(i||T.includes(r)))return;let a=async function(e){for(var t=arguments.length,a=Array(t>1?t-1:0),o=1;o<t;o++)a[o-1]=arguments[o];let s=this.transaction(e,i?"readwrite":"readonly"),l=s.store;return n&&(l=l.index(a.shift())),(await Promise.all([l[r](...a),i&&s.done]))[0]};return R.set(t,a),a}E={...a=E,get:(e,t,r)=>D(e,t)||a.get(e,t,r),has:(e,t)=>!!D(e,t)||a.has(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{getPlatformInfoString(){return this.container.getProviders().map(e=>{if(!function(e){let t=e.getComponent();return(null==t?void 0:t.type)==="VERSION"}(e))return null;{let t=e.getImmediate();return"".concat(t.library,"/").concat(t.version)}}).filter(e=>e).join(" ")}constructor(e){this.container=e}}let S="@firebase/app",k="0.9.12",N=new p("@firebase/app"),L="[DEFAULT]",B={[S]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","fire-js":"fire-js",firebase:"fire-js-all"},U=new Map,x=new Map;function P(e){let t=e.name;if(x.has(t))return N.debug("There were multiple attempts to register component ".concat(t,".")),!1;for(let r of(x.set(t,e),U.values()))!function(e,t){try{e.container.addComponent(t)}catch(r){N.debug("Component ".concat(t.name," failed to register with FirebaseApp ").concat(e.name),r)}}(r,e);return!0}function M(e,t){let r=e.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),e.container.getProvider(t)}let H=new g.LL("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw H.create("app-deleted",{appName:this._name})}constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new l.wA("app",()=>this,"PUBLIC"))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let j="9.22.2";function V(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=e;"object"!=typeof t&&(t={name:t});let n=Object.assign({name:L,automaticDataCollectionEnabled:!1},t),i=n.name;if("string"!=typeof i||!i)throw H.create("bad-app-name",{appName:String(i)});if(r||(r=(0,g.aH)()),!r)throw H.create("no-options");let a=U.get(i);if(a){if((0,g.vZ)(r,a.options)&&(0,g.vZ)(n,a.config))return a;throw H.create("duplicate-app",{appName:i})}let o=new l.H0(i);for(let e of x.values())o.addComponent(e);let s=new F(r,n,o);return U.set(i,s),s}function z(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:L,t=U.get(e);if(!t&&e===L&&(0,g.aH)())return V();if(!t)throw H.create("no-app",{appName:e});return t}function W(e,t,r){var n;let i=null!==(n=B[e])&&void 0!==n?n:e;r&&(i+="-".concat(r));let a=i.match(/\s|\//),o=t.match(/\s|\//);if(a||o){let e=['Unable to register library "'.concat(i,'" with version "').concat(t,'":')];a&&e.push('library name "'.concat(i,'" contains illegal characters (whitespace or "/")')),a&&o&&e.push("and"),o&&e.push('version name "'.concat(t,'" contains illegal characters (whitespace or "/")')),N.warn(e.join(" "));return}P(new l.wA("".concat(i,"-version"),()=>({library:i,version:t}),"VERSION"))}let Z="firebase-heartbeat-store",q=null;function K(){return q||(q=(function(e,t){let{blocked:r,upgrade:n,blocking:i,terminated:a}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=indexedDB.open(e,1),s=A(o);return n&&o.addEventListener("upgradeneeded",e=>{n(A(o.result),e.oldVersion,e.newVersion,A(o.transaction),e)}),r&&o.addEventListener("blocked",e=>r(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener("close",()=>a()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),s})("firebase-heartbeat-database",1,{upgrade:(e,t)=>{0===t&&e.createObjectStore(Z)}}).catch(e=>{throw H.create("idb-open",{originalErrorMessage:e.message})})),q}async function G(e){try{let t=await K();return await t.transaction(Z).objectStore(Z).get(J(e))}catch(e){if(e instanceof g.ZR)N.warn(e.message);else{let t=H.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});N.warn(t.message)}}}async function X(e,t){try{let r=(await K()).transaction(Z,"readwrite"),n=r.objectStore(Z);await n.put(t,J(e)),await r.done}catch(e){if(e instanceof g.ZR)N.warn(e.message);else{let t=H.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});N.warn(t.message)}}}function J(e){return"".concat(e.name,"!").concat(e.options.appId)}class ${async triggerHeartbeat(){let e=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),t=Y();return(null===this._heartbeatsCache&&(this._heartbeatsCache=await this._heartbeatsCachePromise),this._heartbeatsCache.lastSentHeartbeatDate===t||this._heartbeatsCache.heartbeats.some(e=>e.date===t))?void 0:(this._heartbeatsCache.heartbeats.push({date:t,agent:e}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{let t=new Date(e.date).valueOf();return Date.now()-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache))}async getHeartbeatsHeader(){if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null===this._heartbeatsCache||0===this._heartbeatsCache.heartbeats.length)return"";let e=Y(),{heartbeatsToSend:t,unsentEntries:r}=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1024,r=[],n=e.slice();for(let i of e){let e=r.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),ee(r)>t){e.dates.pop();break}}else if(r.push({agent:i.agent,dates:[i.date]}),ee(r)>t){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}(this._heartbeatsCache.heartbeats),n=(0,g.L)(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),n}constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new Q(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}}function Y(){return new Date().toISOString().substring(0,10)}class Q{async runIndexedDBEnvironmentCheck(){return!!(0,g.hl)()&&(0,g.eu)().then(()=>!0).catch(()=>!1)}async read(){return await this._canUseIndexedDBPromise&&await G(this.app)||{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){let r=await this.read();return X(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){let r=await this.read();return X(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}}constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}}function ee(e){return(0,g.L)(JSON.stringify({version:2,heartbeats:e})).length}P(new l.wA("platform-logger",e=>new O(e),"PRIVATE")),P(new l.wA("heartbeat",e=>new $(e),"PRIVATE")),W(S,k,""),W(S,k,"esm2017"),W("fire-js","")},6574:function(e,t,r){r.d(t,{H0:function(){return s},wA:function(){return i}});var n=r(8954);class i{setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let a="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o{get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new n.BH;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let r=this.getOrInitializeService({instanceIdentifier:t});r&&e.resolve(r)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let r=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(e){if(n)return null;throw e}else{if(n)return null;throw Error("Service ".concat(this.name," is not available"))}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error("Mismatching Component ".concat(e.name," for Provider ").concat(this.name,"."));if(this.component)throw Error("Component for ".concat(this.name," has already been provided"));if(this.component=e,this.shouldAutoInitialize()){if("EAGER"===e.instantiationMode)try{this.getOrInitializeService({instanceIdentifier:a})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let r=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:r});t.resolve(e)}catch(e){}}}}clearInstance(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a;this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a;return this.instances.has(e)}getOptions(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a;return this.instancesOptions.get(e)||{}}initialize(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error("".concat(this.name,"(").concat(r,") has already been initialized"));if(!this.isComponentSet())throw Error("Component ".concat(this.name," has not been registered yet"));let n=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[e,t]of this.instancesDeferred.entries())r===this.normalizeInstanceIdentifier(e)&&t.resolve(n);return n}onInit(e,t){var r;let n=this.normalizeInstanceIdentifier(t),i=null!==(r=this.onInitCallbacks.get(n))&&void 0!==r?r:new Set;i.add(e),this.onInitCallbacks.set(n,i);let a=this.instances.get(n);return a&&e(a,n),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let n of r)try{n(e,t)}catch(e){}}getOrInitializeService(e){let{instanceIdentifier:t,options:r={}}=e,n=this.instances.get(t);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:t===a?void 0:t,options:r}),this.instances.set(t,n),this.instancesOptions.set(t,r),this.invokeOnInitCallbacks(n,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,n)}catch(e){}return n||null}normalizeInstanceIdentifier(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a;return this.component?this.component.multipleInstances?e:a:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s{addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error("Component ".concat(e.name," has already been registered with ").concat(this.name));t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new o(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}constructor(e){this.name=e,this.providers=new Map}}},6142:function(e,t,r){r.d(t,{ZF:function(){return n.ZF}});var n=r(900);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(0,n.KN)("firebase","9.22.2","app")},4905:function(e,t,r){r.d(t,{Jt:function(){return er},cF:function(){return ei},iH:function(){return en},KV:function(){return et}});var n,i,a,o,s=r(900),l=r(8954),c=r(6574);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let h="firebasestorage.googleapis.com",u="storageBucket";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d extends l.ZR{get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return f(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message="".concat(this._baseMessage,"\n").concat(this.customData.serverResponse):this.message=this._baseMessage}constructor(e,t,r=0){super(f(e),"Firebase Storage: ".concat(t," (").concat(f(e),")")),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,d.prototype)}}function f(e){return"storage/"+e}function p(){return new d(a.UNKNOWN,"An unknown error occurred, please check the error payload for server response.")}function g(e){return new d(a.INVALID_ARGUMENT,e)}function m(){return new d(a.APP_DELETED,"The Firebase app was deleted.")}function _(e,t){return new d(a.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function b(e){throw new d(a.INTERNAL_ERROR,"Internal error: "+e)}(n=a||(a={})).UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v{get path(){return this.path_}get isRoot(){return 0===this.path.length}fullServerUrl(){let e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=v.makeFromUrl(e,t)}catch(t){return new v(e,"")}if(""===r.path)return r;throw new d(a.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}static makeFromUrl(e,t){let r=null,n="([A-Za-z0-9.\\-_]+)",i=RegExp("^gs://"+n+"(/(.*))?$","i");function o(e){e.path_=decodeURIComponent(e.path)}let s=t.replace(/[.]/g,"\\."),l=[{regex:i,indices:{bucket:1,path:3},postModify:function(e){"/"===e.path.charAt(e.path.length-1)&&(e.path_=e.path_.slice(0,-1))}},{regex:RegExp("^https?://".concat(s,"/").concat("v[A-Za-z0-9_]+","/b/").concat(n,"/o").concat("(/([^?#]*).*)?$"),"i"),indices:{bucket:1,path:3},postModify:o},{regex:RegExp("^https?://".concat(t===h?"(?:storage.googleapis.com|storage.cloud.google.com)":t,"/").concat(n,"/").concat("([^?#]*)"),"i"),indices:{bucket:1,path:2},postModify:o}];for(let t=0;t<l.length;t++){let n=l[t],i=n.regex.exec(e);if(i){let e=i[n.indices.bucket],t=i[n.indices.path];t||(t=""),r=new v(e,t),n.postModify(r);break}}if(null==r)throw new d(a.INVALID_URL,"Invalid URL '"+e+"'.");return r}constructor(e,t){this.bucket=e,this.path_=t}}class w{getPromise(){return this.promise_}cancel(){arguments.length>0&&void 0!==arguments[0]&&arguments[0]}constructor(e){this.promise_=Promise.reject(e)}}function y(e){return"string"==typeof e||e instanceof String}function E(e){return A()&&e instanceof Blob}function A(){return"undefined"!=typeof Blob&&!(0,l.UG)()}function I(e,t,r,n){if(n<t)throw g("Invalid value for '".concat(e,"'. Expected ").concat(t," or greater."));if(n>r)throw g("Invalid value for '".concat(e,"'. Expected ").concat(r," or less."))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T(e,t,r){let n=t;return null==r&&(n="https://".concat(t)),"".concat(r,"://").concat(n,"/v0").concat(e)}function C(e){let t=encodeURIComponent,r="?";for(let n in e)e.hasOwnProperty(n)&&(r=r+(t(n)+"=")+t(e[n])+"&");return r.slice(0,-1)}(i=o||(o={}))[i.NO_ERROR=0]="NO_ERROR",i[i.NETWORK_ERROR=1]="NETWORK_ERROR",i[i.ABORT=2]="ABORT";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R{start_(){let e=(e,t)=>{let r=this.resolve_,n=this.reject_,i=t.connection;if(t.wasSuccessCode)try{let e=this.callback_(i,i.getResponse());void 0!==e?r(e):r()}catch(e){n(e)}else if(null!==i){let e=p();e.serverResponse=i.getErrorText(),n(this.errorCallback_?this.errorCallback_(i,e):e)}else n(t.canceled?this.appDelete_?m():new d(a.CANCELED,"User canceled the upload/download."):new d(a.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again."))};this.canceled_?e(!1,new D(!1,null,!0)):this.backoffId_=/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,t,r){let n=1,i=null,a=null,o=!1,s=0,l=!1;function c(){for(var e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];l||(l=!0,t.apply(null,r))}function h(t){i=setTimeout(()=>{i=null,e(d,2===s)},t)}function u(){a&&clearTimeout(a)}function d(e){let t;for(var r=arguments.length,i=Array(r>1?r-1:0),a=1;a<r;a++)i[a-1]=arguments[a];if(l){u();return}if(e||2===s||o){u(),c.call(null,e,...i);return}n<64&&(n*=2),1===s?(s=2,t=0):t=(n+Math.random())*1e3,h(t)}let f=!1;function p(e){!f&&(f=!0,u(),!l&&(null!==i?(e||(s=2),clearTimeout(i),h(0)):e||(s=1)))}return h(0),a=setTimeout(()=>{o=!0,p(!0)},r),p}((e,t)=>{if(t){e(!1,new D(!1,null,!0));return}let r=this.connectionFactory_();this.pendingConnection_=r;let n=e=>{let t=e.loaded,r=e.lengthComputable?e.total:-1;null!==this.progressCallback_&&this.progressCallback_(t,r)};null!==this.progressCallback_&&r.addUploadProgressListener(n),r.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{null!==this.progressCallback_&&r.removeUploadProgressListener(n),this.pendingConnection_=null;let t=r.getErrorCode()===o.NO_ERROR,i=r.getStatus();if(!t||/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,t){let r=e>=500&&e<600,n=-1!==[408,429].indexOf(e),i=-1!==t.indexOf(e);return r||n||i}(i,this.additionalRetryCodes_)&&this.retry){e(!1,new D(!1,null,r.getErrorCode()===o.ABORT));return}e(!0,new D(-1!==this.successCodes_.indexOf(i),r))})},e,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,null!==this.backoffId_&&(0,this.backoffId_)(!1),null!==this.pendingConnection_&&this.pendingConnection_.abort()}constructor(e,t,r,n,i,a,o,s,l,c,h,u=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=n,this.successCodes_=i,this.additionalRetryCodes_=a,this.callback_=o,this.errorCallback_=s,this.timeout_=l,this.progressCallback_=c,this.connectionFactory_=h,this.retry=u,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((e,t)=>{this.resolve_=e,this.reject_=t,this.start_()})}}class D{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function O(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let n="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:void 0;if(void 0!==n){let e=new n;for(let r=0;r<t.length;r++)e.append(t[r]);return e.getBlob()}if(A())return new Blob(t);throw new d(a.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let S={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class k{constructor(e,t){this.data=e,this.contentType=t||null}}function N(e){let t=[];for(let r=0;r<e.length;r++){let n=e.charCodeAt(r);n<=127?t.push(n):n<=2047?t.push(192|n>>6,128|63&n):(64512&n)==55296?r<e.length-1&&(64512&e.charCodeAt(r+1))==56320?(n=65536|(1023&n)<<10|1023&e.charCodeAt(++r),t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n)):t.push(239,191,189):(64512&n)==56320?t.push(239,191,189):t.push(224|n>>12,128|n>>6&63,128|63&n)}return new Uint8Array(t)}function L(e,t){let r;switch(e){case S.BASE64:{let r=-1!==t.indexOf("-"),n=-1!==t.indexOf("_");if(r||n)throw _(e,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case S.BASE64URL:{let r=-1!==t.indexOf("+"),n=-1!==t.indexOf("/");if(r||n)throw _(e,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/")}}try{r=/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){if("undefined"==typeof atob)throw new d(a.UNSUPPORTED_ENVIRONMENT,"".concat("base-64"," is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information."));return atob(e)}(t)}catch(t){if(t.message.includes("polyfill"))throw t;throw _(e,"Invalid character found")}let n=new Uint8Array(r.length);for(let e=0;e<r.length;e++)n[e]=r.charCodeAt(e);return n}class B{constructor(e){var t;this.base64=!1,this.contentType=null;let r=e.match(/^data:([^,]+)?,/);if(null===r)throw _(S.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");let n=r[1]||null;null!=n&&(this.base64=(t=";base64",n.length>=t.length&&n.substring(n.length-t.length)===t),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=e.substring(e.indexOf(",")+1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{size(){return this.size_}type(){return this.type_}slice(e,t){if(!E(this.data_))return new U(new Uint8Array(this.data_.buffer,e,t-e),!0);{var r;let n=(r=this.data_).webkitSlice?r.webkitSlice(e,t):r.mozSlice?r.mozSlice(e,t):r.slice?r.slice(e,t):null;return null===n?null:new U(n)}}static getBlob(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];if(A()){let e=t.map(e=>e instanceof U?e.data_:e);return new U(O.apply(null,e))}{let e=t.map(e=>y(e)?function(e,t){switch(e){case S.RAW:return new k(N(t));case S.BASE64:case S.BASE64URL:return new k(L(e,t));case S.DATA_URL:return new k(function(e){let t=new B(e);return t.base64?L(S.BASE64,t.rest):function(e){let t;try{t=decodeURIComponent(e)}catch(e){throw _(S.DATA_URL,"Malformed data URL.")}return N(t)}(t.rest)}(t),new B(t).contentType)}throw p()}(S.RAW,e).data:e.data_),r=0;e.forEach(e=>{r+=e.byteLength});let n=new Uint8Array(r),i=0;return e.forEach(e=>{for(let t=0;t<e.length;t++)n[i++]=e[t]}),new U(n,!0)}}uploadData(){return this.data_}constructor(e,t){let r=0,n="";E(e)?(this.data_=e,r=e.size,n=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(e){var t;let r;try{r=JSON.parse(e)}catch(e){return null}return"object"!=typeof(t=r)||Array.isArray(t)?null:r}function P(e){let t=e.lastIndexOf("/",e.length-2);return -1===t?e:e.slice(t+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(e,t){return t}class H{constructor(e,t,r,n){this.server=e,this.local=t||e,this.writable=!!r,this.xform=n||M}}let F=null;function j(){if(F)return F;let e=[];e.push(new H("bucket")),e.push(new H("generation")),e.push(new H("metageneration")),e.push(new H("name","fullPath",!0));let t=new H("name");t.xform=function(e,t){return!y(t)||t.length<2?t:P(t)},e.push(t);let r=new H("size");return r.xform=function(e,t){return void 0!==t?Number(t):t},e.push(r),e.push(new H("timeCreated")),e.push(new H("updated")),e.push(new H("md5Hash",null,!0)),e.push(new H("cacheControl",null,!0)),e.push(new H("contentDisposition",null,!0)),e.push(new H("contentEncoding",null,!0)),e.push(new H("contentLanguage",null,!0)),e.push(new H("contentType",null,!0)),e.push(new H("metadata","customMetadata",!0)),F=e}function V(e,t,r){let n=x(t);return null===n?null:function(e,t,r){let n={};n.type="file";let i=r.length;for(let e=0;e<i;e++){let i=r[e];n[i.local]=i.xform(n,t[i.server])}return Object.defineProperty(n,"ref",{get:function(){let t=new v(n.bucket,n.fullPath);return e._makeStorageReference(t)}}),n}(e,n,r)}class z{constructor(e,t,r,n){this.url=e,this.method=t,this.handler=r,this.timeout=n,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(e){if(!e)throw p()}function Z(e){return function(t,r){var n,i;let o;return 401===t.getStatus()?o=t.getErrorText().includes("Firebase App Check token is invalid")?new d(a.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project."):new d(a.UNAUTHENTICATED,"User is not authenticated, please authenticate using Firebase Authentication and try again."):402===t.getStatus()?(n=e.bucket,o=new d(a.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")):403===t.getStatus()?(i=e.path,o=new d(a.UNAUTHORIZED,"User does not have permission to access '"+i+"'.")):o=r,o.status=t.getStatus(),o.serverResponse=r.serverResponse,o}}class q{send(e,t,r,n){if(this.sent_)throw b("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(t,e,!0),void 0!==n)for(let e in n)n.hasOwnProperty(e)&&this.xhr_.setRequestHeader(e,n[e].toString());return void 0!==r?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw b("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw b("cannot .getStatus() before sending");try{return this.xhr_.status}catch(e){return -1}}getResponse(){if(!this.sent_)throw b("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw b("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.removeEventListener("progress",e)}constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=o.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=o.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=o.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}}class K extends q{initXhr(){this.xhr_.responseType="text"}}function G(){return new K}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new X(e,t)}get root(){let e=new v(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return P(this._location.path)}get storage(){return this._service}get parent(){let e=/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){if(0===e.length)return null;let t=e.lastIndexOf("/");return -1===t?"":e.slice(0,t)}(this._location.path);if(null===e)return null;let t=new v(this._location.bucket,e);return new X(this._service,t)}_throwIfRoot(e){if(""===this._location.path)throw new d(a.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}constructor(e,t){this._service=e,t instanceof v?this._location=t:this._location=v.makeFromUrl(t,e.host)}}function J(e,t){let r=null==t?void 0:t[u];return null==r?null:v.makeFromBucketSpec(r,e)}class ${get host(){return this._host}set host(e){this._host=e,null!=this._url?this._bucket=v.makeFromBucketSpec(this._url,e):this._bucket=J(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){I("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){I("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;let e=this._authProvider.getImmediate({optional:!0});if(e){let t=await e.getToken();if(null!==t)return t.accessToken}return null}async _getAppCheckToken(){let e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new X(this,e)}_makeRequest(e,t,r,n){let i=!(arguments.length>4)||void 0===arguments[4]||arguments[4];if(this._deleted)return new w(m());{let a=function(e,t,r,n,i,a){let o=!(arguments.length>6)||void 0===arguments[6]||arguments[6],s=C(e.urlParams),l=e.url+s,c=Object.assign({},e.headers);return t&&(c["X-Firebase-GMPID"]=t),null!==r&&r.length>0&&(c.Authorization="Firebase "+r),c["X-Firebase-Storage-Version"]="webjs/"+(null!=a?a:"AppManager"),null!==n&&(c["X-Firebase-AppCheck"]=n),new R(l,e.method,c,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,i,o)}(e,this._appId,r,n,t,this._firebaseVersion,i);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){let[r,n]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,n).getPromise()}constructor(e,t,r,n,i){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=n,this._firebaseVersion=i,this._bucket=null,this._host=h,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=12e4,this._maxUploadRetryTime=6e5,this._requests=new Set,null!=n?this._bucket=v.makeFromBucketSpec(n,this._host):this._bucket=J(this._host,this.app.options)}}let Y="@firebase/storage",Q="0.11.2",ee="storage";function et(e,t,r){return function(e,t,r){e._throwIfRoot("uploadBytes");let n=function(e,t,r,n,i){let o=t.bucketOnlyServerUrl(),s={"X-Goog-Upload-Protocol":"multipart"},l=function(){let e="";for(let t=0;t<2;t++)e+=Math.random().toString().slice(2);return e}();s["Content-Type"]="multipart/related; boundary="+l;let c=function(e,t,r){let n=Object.assign({},r);return n.fullPath=e.path,n.size=t.size(),!n.contentType&&(n.contentType=t&&t.type()||"application/octet-stream"),n}(t,n,i),h="--"+l+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+function(e,t){let r={},n=t.length;for(let i=0;i<n;i++){let n=t[i];n.writable&&(r[n.server]=e[n.local])}return JSON.stringify(r)}(c,r)+"\r\n--"+l+"\r\nContent-Type: "+c.contentType+"\r\n\r\n",u=U.getBlob(h,n,"\r\n--"+l+"--");if(null===u)throw new d(a.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.");let f={name:c.fullPath},p=new z(T(o,e.host,e._protocol),"POST",function(t,n){let i=V(e,n,r);return W(null!==i),i},e.maxUploadRetryTime);return p.urlParams=f,p.headers=s,p.body=u.uploadData(),p.errorHandler=Z(t),p}(e.storage,e._location,j(),new U(t,!0),r);return e.storage.makeRequestWithTokens(n,G).then(t=>({metadata:t,ref:e}))}(e=(0,l.m9)(e),t,r)}function er(e){return function(e){e._throwIfRoot("getDownloadURL");let t=function(e,t,r){let n=new z(T(t.fullServerUrl(),e.host,e._protocol),"GET",function(t,n){let i=V(e,n,r);return W(null!==i),function(e,t,r,n){let i=x(t);if(null===i||!y(i.downloadTokens))return null;let a=i.downloadTokens;if(0===a.length)return null;let o=encodeURIComponent;return a.split(",").map(t=>{let i=e.bucket,a=e.fullPath;return T("/b/"+o(i)+"/o/"+o(a),r,n)+C({alt:"media",token:t})})[0]}(i,n,e.host,e._protocol)},e.maxOperationRetryTime);return n.errorHandler=function(e){let t=Z(e);return function(r,n){let i=t(r,n);if(404===r.getStatus()){var o;o=e.path,i=new d(a.OBJECT_NOT_FOUND,"Object '"+o+"' does not exist.")}return i.serverResponse=n.serverResponse,i}}(t),n}(e.storage,e._location,j());return e.storage.makeRequestWithTokens(t,G).then(e=>{if(null===e)throw new d(a.NO_DOWNLOAD_URL,"The given file does not have any download URLs.");return e})}(e=(0,l.m9)(e))}function en(e,t){return function(e,t){if(!(t&&/^[A-Za-z]+:\/\//.test(t)))return function e(t,r){if(t instanceof $){if(null==t._bucket)throw new d(a.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+u+"' property when initializing the app?");let n=new X(t,t._bucket);return null!=r?e(n,r):n}return void 0!==r?function(e,t){let r=function(e,t){let r=t.split("/").filter(e=>e.length>0).join("/");return 0===e.length?r:e+"/"+r}(e._location.path,t),n=new v(e._location.bucket,r);return new X(e.storage,n)}(t,r):t}(e,t);if(e instanceof $)return new X(e,t);throw g("To use ref(service, url), the first argument must be a Storage instance.")}(e=(0,l.m9)(e),t)}function ei(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:(0,s.Mq)(),t=arguments.length>1?arguments[1]:void 0;e=(0,l.m9)(e);let r=(0,s.qX)(e,ee).getImmediate({identifier:t}),n=(0,l.P0)("storage");return n&&function(e,t,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};!function(e,t,r){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};e.host="".concat(t,":").concat(r),e._protocol="http";let{mockUserToken:i}=n;i&&(e._overrideAuthToken="string"==typeof i?i:(0,l.Sg)(i,e.app.options.projectId))}(e,t,r,n)}(r,...n),r}(0,s.Xd)(new c.wA(ee,function(e,t){let{instanceIdentifier:r}=t;return new $(e.getProvider("app").getImmediate(),e.getProvider("auth-internal"),e.getProvider("app-check-internal"),r,s.Jn)},"PUBLIC").setMultipleInstances(!0)),(0,s.KN)(Y,Q,""),(0,s.KN)(Y,Q,"esm2017")}}]);