const e=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let s=e.charCodeAt(r);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=63&s|128):55296==(64512&s)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(s=65536+((1023&s)<<10)+(1023&e.charCodeAt(++r)),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=63&s|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=63&s|128)}return t},t={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<e.length;s+=3){const t=e[s],i=s+1<e.length,o=i?e[s+1]:0,a=s+2<e.length,c=a?e[s+2]:0,u=t>>2,l=(3&t)<<4|o>>4;let h=(15&o)<<2|c>>6,d=63&c;a||(d=64,i||(h=64)),r.push(n[u],n[l],n[h],n[d])}return r.join("")},encodeString(t,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(t):this.encodeByteArray(e(t),n)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const s=e[n++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=e[n++];t[r++]=String.fromCharCode((31&s)<<6|63&i)}else if(s>239&&s<365){const i=((7&s)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(i>>10)),t[r++]=String.fromCharCode(56320+(1023&i))}else{const i=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&s)<<12|(63&i)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const r=t?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<e.length;){const t=r[e.charAt(i++)],o=i<e.length?r[e.charAt(i)]:0;++i;const a=i<e.length?r[e.charAt(i)]:64;++i;const c=i<e.length?r[e.charAt(i)]:64;if(++i,null==t||null==o||null==a||null==c)throw new n;const u=t<<2|o>>4;if(s.push(u),64!==a){const e=o<<4&240|a>>2;if(s.push(e),64!==c){const e=a<<6&192|c;s.push(e)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};
/**
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
 */class n extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const r=function(n){return function(n){const r=e(n);return t.encodeByteArray(r,!0)}(n).replace(/\./g,"")},s=function(e){try{return t.decodeString(e,!0)}catch(n){console.error("base64Decode failed: ",n)}return null};
/**
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
 */
function i(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}
/**
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
 */const o=()=>{try{return i().__FIREBASE_DEFAULTS__||(()=>{if("undefined"==typeof process||void 0===process.env)return;const e={}.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&s(e[1]);return t&&JSON.parse(t)})()}catch(e){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`)}},a=e=>{var t,n;return null==(n=null==(t=o())?void 0:t.emulatorHosts)?void 0:n[e]},c=()=>{var e;return null==(e=o())?void 0:e.config},u=e=>{var t;return null==(t=o())?void 0:t[`_${e}`]};
/**
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
 */
class l{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2025 Google LLC
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
 */function h(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function d(e){return(await fetch(e,{credentials:"include"})).ok}
/**
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
 */const f={};let p=!1;function m(e,t){if("undefined"==typeof window||"undefined"==typeof document||!h(window.location.host)||f[e]===t||f[e]||p)return;function n(e){return`__firebase__banner__${e}`}f[e]=t;const r="__firebase__banner",s=function(){const e={prod:[],emulator:[]};for(const t of Object.keys(f))f[t]?e.emulator.push(t):e.prod.push(t);return e}().prod.length>0;function i(){const e=document.createElement("span");return e.style.cursor="pointer",e.style.marginLeft="16px",e.style.fontSize="24px",e.innerHTML=" &times;",e.onclick=()=>{p=!0,function(){const e=document.getElementById(r);e&&e.remove()}()},e}function o(){const e=function(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}(r),t=n("text"),o=document.getElementById(t)||document.createElement("span"),a=n("learnmore"),c=document.getElementById(a)||document.createElement("a"),u=n("preprendIcon"),l=document.getElementById(u)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(e.created){const t=e.element;!function(e){e.style.display="flex",e.style.background="#7faaf0",e.style.position="fixed",e.style.bottom="5px",e.style.left="5px",e.style.padding=".5em",e.style.borderRadius="5px",e.style.alignItems="center"}(t),function(e,t){e.setAttribute("id",t),e.innerText="Learn more",e.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",e.setAttribute("target","__blank"),e.style.paddingLeft="5px",e.style.textDecoration="underline"}(c,a);const n=i();!function(e,t){e.setAttribute("width","24"),e.setAttribute("id",t),e.setAttribute("height","24"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.style.marginLeft="-6px"}(l,u),t.append(l,o,c,n),document.body.appendChild(t)}s?(o.innerText="Preview backend disconnected.",l.innerHTML='<g clip-path="url(#clip0_6013_33858)">\n<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6013_33858">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>'):(l.innerHTML='<g clip-path="url(#clip0_6083_34804)">\n<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6083_34804">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>',o.innerText="Preview backend running in this workspace."),o.setAttribute("id",t)}"loading"===document.readyState?window.addEventListener("DOMContentLoaded",o):o()}
/**
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
 */function g(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function y(){var e;const t=null==(e=o())?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(n){return!1}}function v(){return!y()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function w(){return!y()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function I(){try{return"object"==typeof indexedDB}catch(e){return!1}}class _ extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,_.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,b.prototype.create)}}class b{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,s=this.errors[e],i=s?function(e,t){return e.replace(T,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}(s,n):"Error",o=`${this.serviceName}: ${i} (${r}).`;return new _(r,o,n)}}const T=/\{\$([^}]+)}/g;function E(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const s of n){if(!r.includes(s))return!1;const n=e[s],i=t[s];if(S(n)&&S(i)){if(!E(n,i))return!1}else if(n!==i)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function S(e){return null!==e&&"object"==typeof e}
/**
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
 */function C(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function A(e){const t={};return e.replace(/^\?/,"").split("&").forEach(e=>{if(e){const[n,r]=e.split("=");t[decodeURIComponent(n)]=decodeURIComponent(r)}}),t}function k(e){const t=e.indexOf("?");if(!t)return"";const n=e.indexOf("#",t);return e.substring(t,n>0?n:void 0)}class N{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=function(e,t){if("object"!=typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=D),void 0===r.error&&(r.error=D),void 0===r.complete&&(r.complete=D);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}}),this.observers.push(r),s}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!=typeof console&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function D(){}
/**
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
 */function x(e){return e&&e._delegate?e._delegate:e}class R{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
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
 */const P="[DEFAULT]";
/**
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
 */class O{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new l;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=(null==e?void 0:e.optional)??!1;if(!this.isInitialized(t)&&!this.shouldAutoInitialize()){if(n)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(n)return null;throw r}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
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
 */(e))try{this.getOrInitializeService({instanceIdentifier:P})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=P){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=P){return this.instances.has(e)}getOptions(e=P){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,i]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(s)&&i.resolve(r)}return r}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(n)??new Set;r.add(e),this.onInitCallbacks.set(n,r);const s=this.instances.get(n);return s&&e(s,n),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const r of n)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===P?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}var r;return n||null}normalizeInstanceIdentifier(e=P){return this.component?this.component.multipleInstances?e:P:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class M{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new O(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
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
 */var L,F;(F=L||(L={}))[F.DEBUG=0]="DEBUG",F[F.VERBOSE=1]="VERBOSE",F[F.INFO=2]="INFO",F[F.WARN=3]="WARN",F[F.ERROR=4]="ERROR",F[F.SILENT=5]="SILENT";const V={debug:L.DEBUG,verbose:L.VERBOSE,info:L.INFO,warn:L.WARN,error:L.ERROR,silent:L.SILENT},U=L.INFO,B={[L.DEBUG]:"log",[L.VERBOSE]:"log",[L.INFO]:"info",[L.WARN]:"warn",[L.ERROR]:"error"},q=(e,t,...n)=>{if(t<e.logLevel)return;const r=(new Date).toISOString(),s=B[t];if(!s)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[s](`[${r}]  ${e.name}:`,...n)};class j{constructor(e){this.name=e,this._logLevel=U,this._logHandler=q,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in L))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?V[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,L.DEBUG,...e),this._logHandler(this,L.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,L.VERBOSE,...e),this._logHandler(this,L.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,L.INFO,...e),this._logHandler(this,L.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,L.WARN,...e),this._logHandler(this,L.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,L.ERROR,...e),this._logHandler(this,L.ERROR,...e)}}let z,$;const G=new WeakMap,K=new WeakMap,H=new WeakMap,W=new WeakMap,Q=new WeakMap;let J={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return K.get(e);if("objectStoreNames"===t)return e.objectStoreNames||H.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Z(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function Y(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?($||($=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(ee(this),t),Z(G.get(this))}:function(...t){return Z(e.apply(ee(this),t))}:function(t,...n){const r=e.call(ee(this),t,...n);return H.set(r,t.sort?t.sort():[t]),Z(r)}}function X(e){return"function"==typeof e?Y(e):(e instanceof IDBTransaction&&function(e){if(K.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",i),e.removeEventListener("abort",i)},s=()=>{t(),r()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",s),e.addEventListener("error",i),e.addEventListener("abort",i)});K.set(e,t)}(e),t=e,(z||(z=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>t instanceof e)?new Proxy(e,J):e);var t}function Z(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",s),e.removeEventListener("error",i)},s=()=>{t(Z(e.result)),r()},i=()=>{n(e.error),r()};e.addEventListener("success",s),e.addEventListener("error",i)});return t.then(t=>{t instanceof IDBCursor&&G.set(t,e)}).catch(()=>{}),Q.set(t,e),t}(e);if(W.has(e))return W.get(e);const t=X(e);return t!==e&&(W.set(e,t),Q.set(t,e)),t}const ee=e=>Q.get(e);const te=["get","getKey","getAll","getAllKeys","count"],ne=["put","add","delete","clear"],re=new Map;function se(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(re.get(t))return re.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,s=ne.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!s&&!te.includes(n))return;const i=async function(e,...t){const i=this.transaction(e,s?"readwrite":"readonly");let o=i.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),s&&i.done]))[0]};return re.set(t,i),i}J=(e=>({...e,get:(t,n,r)=>se(t,n)||e.get(t,n,r),has:(t,n)=>!!se(t,n)||e.has(t,n)}))(J);
/**
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
 */
class ie{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const oe="@firebase/app",ae="0.14.3",ce=new j("@firebase/app"),ue="@firebase/app-compat",le="@firebase/analytics-compat",he="@firebase/analytics",de="@firebase/app-check-compat",fe="@firebase/app-check",pe="@firebase/auth",me="@firebase/auth-compat",ge="@firebase/database",ye="@firebase/data-connect",ve="@firebase/database-compat",we="@firebase/functions",Ie="@firebase/functions-compat",_e="@firebase/installations",be="@firebase/installations-compat",Te="@firebase/messaging",Ee="@firebase/messaging-compat",Se="@firebase/performance",Ce="@firebase/performance-compat",Ae="@firebase/remote-config",ke="@firebase/remote-config-compat",Ne="@firebase/storage",De="@firebase/storage-compat",xe="@firebase/firestore",Re="@firebase/ai",Pe="@firebase/firestore-compat",Oe="firebase",Me="[DEFAULT]",Le={[oe]:"fire-core",[ue]:"fire-core-compat",[he]:"fire-analytics",[le]:"fire-analytics-compat",[fe]:"fire-app-check",[de]:"fire-app-check-compat",[pe]:"fire-auth",[me]:"fire-auth-compat",[ge]:"fire-rtdb",[ye]:"fire-data-connect",[ve]:"fire-rtdb-compat",[we]:"fire-fn",[Ie]:"fire-fn-compat",[_e]:"fire-iid",[be]:"fire-iid-compat",[Te]:"fire-fcm",[Ee]:"fire-fcm-compat",[Se]:"fire-perf",[Ce]:"fire-perf-compat",[Ae]:"fire-rc",[ke]:"fire-rc-compat",[Ne]:"fire-gcs",[De]:"fire-gcs-compat",[xe]:"fire-fst",[Pe]:"fire-fst-compat",[Re]:"fire-vertex","fire-js":"fire-js",[Oe]:"fire-js-all"},Fe=new Map,Ve=new Map,Ue=new Map;function Be(e,t){try{e.container.addComponent(t)}catch(n){ce.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function qe(e){const t=e.name;if(Ue.has(t))return ce.debug(`There were multiple attempts to register component ${t}.`),!1;Ue.set(t,e);for(const n of Fe.values())Be(n,e);for(const n of Ve.values())Be(n,e);return!0}function je(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function ze(e){return null!=e&&void 0!==e.settings}
/**
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
 */const $e=new b("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
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
 */
class Ge{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new R("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw $e.create("app-deleted",{appName:this._name})}}
/**
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
 */const Ke="12.3.0";function He(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r={name:Me,automaticDataCollectionEnabled:!0,...t},s=r.name;if("string"!=typeof s||!s)throw $e.create("bad-app-name",{appName:String(s)});if(n||(n=c()),!n)throw $e.create("no-options");const i=Fe.get(s);if(i){if(E(n,i.options)&&E(r,i.config))return i;throw $e.create("duplicate-app",{appName:s})}const o=new M(s);for(const c of Ue.values())o.addComponent(c);const a=new Ge(n,r,o);return Fe.set(s,a),a}function We(e=Me){const t=Fe.get(e);if(!t&&e===Me&&c())return He();if(!t)throw $e.create("no-app",{appName:e});return t}function Qe(e,t,n){let r=Le[e]??e;n&&(r+=`-${n}`);const s=r.match(/\s|\//),i=t.match(/\s|\//);if(s||i){const e=[`Unable to register library "${r}" with version "${t}":`];return s&&e.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&e.push("and"),i&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void ce.warn(e.join(" "))}qe(new R(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}
/**
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
 */const Je="firebase-heartbeat-store";let Ye=null;function Xe(){return Ye||(Ye=function(e,t,{blocked:n,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(e,t),a=Z(o);return r&&o.addEventListener("upgradeneeded",e=>{r(Z(o.result),e.oldVersion,e.newVersion,Z(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{i&&e.addEventListener("close",()=>i()),s&&e.addEventListener("versionchange",e=>s(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(Je)}catch(n){console.warn(n)}}}).catch(e=>{throw $e.create("idb-open",{originalErrorMessage:e.message})})),Ye}async function Ze(e,t){try{const n=(await Xe()).transaction(Je,"readwrite"),r=n.objectStore(Je);await r.put(t,et(e)),await n.done}catch(n){if(n instanceof _)ce.warn(n.message);else{const e=$e.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});ce.warn(e.message)}}}function et(e){return`${e.name}!${e.options.appId}`}
/**
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
 */class tt{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new rt(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=nt();if(null==(null==(e=this._heartbeatsCache)?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null==(t=this._heartbeatsCache)?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(e=>e.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
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
 */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){ce.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null==(e=this._heartbeatsCache)?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=nt(),{heartbeatsToSend:n,unsentEntries:s}=function(e,t=1024){const n=[];let r=e.slice();for(const s of e){const e=n.find(e=>e.agent===s.agent);if(e){if(e.dates.push(s.date),st(n)>t){e.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),st(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),i=r(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return ce.warn(t),""}}}function nt(){return(new Date).toISOString().substring(0,10)}class rt{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!I()&&new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var e;t((null==(e=s.error)?void 0:e.message)||"")}}catch(n){t(n)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await Xe()).transaction(Je),n=await t.objectStore(Je).get(et(e));return await t.done,n}catch(t){if(t instanceof _)ce.warn(t.message);else{const e=$e.create("idb-get",{originalErrorMessage:null==t?void 0:t.message});ce.warn(e.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return Ze(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return Ze(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}}}function st(e){return r(JSON.stringify({version:2,heartbeats:e})).length}var it;it="",qe(new R("platform-logger",e=>new ie(e),"PRIVATE")),qe(new R("heartbeat",e=>new tt(e),"PRIVATE")),Qe(oe,ae,it),Qe(oe,ae,"esm2020"),Qe("fire-js","");var ot,at,ct="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e;
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function t(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}function n(e,t,n){n||(n=0);const r=Array(16);if("string"==typeof t)for(var s=0;s<16;++s)r[s]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(s=0;s<16;++s)r[s]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],s=e.g[2];let i,o=e.g[3];i=t+(o^n&(s^o))+r[0]+3614090360&4294967295,i=o+(s^(t=n+(i<<7&4294967295|i>>>25))&(n^s))+r[1]+3905402710&4294967295,o=t+(i<<12&4294967295|i>>>20),i=s+(n^o&(t^n))+r[2]+606105819&4294967295,i=n+(t^(s=o+(i<<17&4294967295|i>>>15))&(o^t))+r[3]+3250441966&4294967295,i=t+(o^(n=s+(i<<22&4294967295|i>>>10))&(s^o))+r[4]+4118548399&4294967295,i=o+(s^(t=n+(i<<7&4294967295|i>>>25))&(n^s))+r[5]+1200080426&4294967295,o=t+(i<<12&4294967295|i>>>20),i=s+(n^o&(t^n))+r[6]+2821735955&4294967295,i=n+(t^(s=o+(i<<17&4294967295|i>>>15))&(o^t))+r[7]+4249261313&4294967295,i=t+(o^(n=s+(i<<22&4294967295|i>>>10))&(s^o))+r[8]+1770035416&4294967295,i=o+(s^(t=n+(i<<7&4294967295|i>>>25))&(n^s))+r[9]+2336552879&4294967295,o=t+(i<<12&4294967295|i>>>20),i=s+(n^o&(t^n))+r[10]+4294925233&4294967295,i=n+(t^(s=o+(i<<17&4294967295|i>>>15))&(o^t))+r[11]+2304563134&4294967295,i=t+(o^(n=s+(i<<22&4294967295|i>>>10))&(s^o))+r[12]+1804603682&4294967295,i=o+(s^(t=n+(i<<7&4294967295|i>>>25))&(n^s))+r[13]+4254626195&4294967295,o=t+(i<<12&4294967295|i>>>20),i=s+(n^o&(t^n))+r[14]+2792965006&4294967295,i=n+(t^(s=o+(i<<17&4294967295|i>>>15))&(o^t))+r[15]+1236535329&4294967295,i=t+(s^o&((n=s+(i<<22&4294967295|i>>>10))^s))+r[1]+4129170786&4294967295,i=o+(n^s&((t=n+(i<<5&4294967295|i>>>27))^n))+r[6]+3225465664&4294967295,o=t+(i<<9&4294967295|i>>>23),i=s+(t^n&(o^t))+r[11]+643717713&4294967295,i=n+(o^t&((s=o+(i<<14&4294967295|i>>>18))^o))+r[0]+3921069994&4294967295,i=t+(s^o&((n=s+(i<<20&4294967295|i>>>12))^s))+r[5]+3593408605&4294967295,i=o+(n^s&((t=n+(i<<5&4294967295|i>>>27))^n))+r[10]+38016083&4294967295,o=t+(i<<9&4294967295|i>>>23),i=s+(t^n&(o^t))+r[15]+3634488961&4294967295,i=n+(o^t&((s=o+(i<<14&4294967295|i>>>18))^o))+r[4]+3889429448&4294967295,i=t+(s^o&((n=s+(i<<20&4294967295|i>>>12))^s))+r[9]+568446438&4294967295,i=o+(n^s&((t=n+(i<<5&4294967295|i>>>27))^n))+r[14]+3275163606&4294967295,o=t+(i<<9&4294967295|i>>>23),i=s+(t^n&(o^t))+r[3]+4107603335&4294967295,i=n+(o^t&((s=o+(i<<14&4294967295|i>>>18))^o))+r[8]+1163531501&4294967295,i=t+(s^o&((n=s+(i<<20&4294967295|i>>>12))^s))+r[13]+2850285829&4294967295,i=o+(n^s&((t=n+(i<<5&4294967295|i>>>27))^n))+r[2]+4243563512&4294967295,o=t+(i<<9&4294967295|i>>>23),i=s+(t^n&(o^t))+r[7]+1735328473&4294967295,i=n+(o^t&((s=o+(i<<14&4294967295|i>>>18))^o))+r[12]+2368359562&4294967295,i=t+((n=s+(i<<20&4294967295|i>>>12))^s^o)+r[5]+4294588738&4294967295,i=o+((t=n+(i<<4&4294967295|i>>>28))^n^s)+r[8]+2272392833&4294967295,o=t+(i<<11&4294967295|i>>>21),i=s+(o^t^n)+r[11]+1839030562&4294967295,i=n+((s=o+(i<<16&4294967295|i>>>16))^o^t)+r[14]+4259657740&4294967295,i=t+((n=s+(i<<23&4294967295|i>>>9))^s^o)+r[1]+2763975236&4294967295,i=o+((t=n+(i<<4&4294967295|i>>>28))^n^s)+r[4]+1272893353&4294967295,o=t+(i<<11&4294967295|i>>>21),i=s+(o^t^n)+r[7]+4139469664&4294967295,i=n+((s=o+(i<<16&4294967295|i>>>16))^o^t)+r[10]+3200236656&4294967295,i=t+((n=s+(i<<23&4294967295|i>>>9))^s^o)+r[13]+681279174&4294967295,i=o+((t=n+(i<<4&4294967295|i>>>28))^n^s)+r[0]+3936430074&4294967295,o=t+(i<<11&4294967295|i>>>21),i=s+(o^t^n)+r[3]+3572445317&4294967295,i=n+((s=o+(i<<16&4294967295|i>>>16))^o^t)+r[6]+76029189&4294967295,i=t+((n=s+(i<<23&4294967295|i>>>9))^s^o)+r[9]+3654602809&4294967295,i=o+((t=n+(i<<4&4294967295|i>>>28))^n^s)+r[12]+3873151461&4294967295,o=t+(i<<11&4294967295|i>>>21),i=s+(o^t^n)+r[15]+530742520&4294967295,i=n+((s=o+(i<<16&4294967295|i>>>16))^o^t)+r[2]+3299628645&4294967295,i=t+(s^((n=s+(i<<23&4294967295|i>>>9))|~o))+r[0]+4096336452&4294967295,i=o+(n^((t=n+(i<<6&4294967295|i>>>26))|~s))+r[7]+1126891415&4294967295,o=t+(i<<10&4294967295|i>>>22),i=s+(t^(o|~n))+r[14]+2878612391&4294967295,i=n+(o^((s=o+(i<<15&4294967295|i>>>17))|~t))+r[5]+4237533241&4294967295,i=t+(s^((n=s+(i<<21&4294967295|i>>>11))|~o))+r[12]+1700485571&4294967295,i=o+(n^((t=n+(i<<6&4294967295|i>>>26))|~s))+r[3]+2399980690&4294967295,o=t+(i<<10&4294967295|i>>>22),i=s+(t^(o|~n))+r[10]+4293915773&4294967295,i=n+(o^((s=o+(i<<15&4294967295|i>>>17))|~t))+r[1]+2240044497&4294967295,i=t+(s^((n=s+(i<<21&4294967295|i>>>11))|~o))+r[8]+1873313359&4294967295,i=o+(n^((t=n+(i<<6&4294967295|i>>>26))|~s))+r[15]+4264355552&4294967295,o=t+(i<<10&4294967295|i>>>22),i=s+(t^(o|~n))+r[6]+2734768916&4294967295,i=n+(o^((s=o+(i<<15&4294967295|i>>>17))|~t))+r[13]+1309151649&4294967295,i=t+(s^((n=s+(i<<21&4294967295|i>>>11))|~o))+r[4]+4149444226&4294967295,i=o+(n^((t=n+(i<<6&4294967295|i>>>26))|~s))+r[11]+3174756917&4294967295,o=t+(i<<10&4294967295|i>>>22),i=s+(t^(o|~n))+r[2]+718787259&4294967295,i=n+(o^((s=o+(i<<15&4294967295|i>>>17))|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(s+(i<<21&4294967295|i>>>11))&4294967295,e.g[2]=e.g[2]+s&4294967295,e.g[3]=e.g[3]+o&4294967295}function r(e,t){this.h=t;const n=[];let r=!0;for(let s=e.length-1;s>=0;s--){const i=0|e[s];r&&i==t||(n[s]=i,r=!1)}this.g=n}!function(e,t){function n(){}n.prototype=t.prototype,e.F=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.D=function(e,n,r){for(var s=Array(arguments.length-2),i=2;i<arguments.length;i++)s[i-2]=arguments[i];return t.prototype[n].apply(e,s)}}(t,function(){this.blockSize=-1}),t.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},t.prototype.v=function(e,t){void 0===t&&(t=e.length);const r=t-this.blockSize,s=this.C;let i=this.h,o=0;for(;o<t;){if(0==i)for(;o<=r;)n(this,e,o),o+=this.blockSize;if("string"==typeof e){for(;o<t;)if(s[i++]=e.charCodeAt(o++),i==this.blockSize){n(this,s),i=0;break}}else for(;o<t;)if(s[i++]=e[o++],i==this.blockSize){n(this,s),i=0;break}}this.h=i,this.o+=t},t.prototype.A=function(){var e=Array((this.h<56?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;t=8*this.o;for(var n=e.length-8;n<e.length;++n)e[n]=255&t,t/=256;for(this.v(e),e=Array(16),t=0,n=0;n<4;++n)for(let r=0;r<32;r+=8)e[t++]=this.g[n]>>>r&255;return e};var s={};function i(e){return-128<=e&&e<128?function(e,t){var n=s;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}(e,function(e){return new r([0|e],e<0?-1:0)}):new r([0|e],e<0?-1:0)}function o(e){if(isNaN(e)||!isFinite(e))return a;if(e<0)return d(o(-e));const t=[];let n=1;for(let r=0;e>=n;r++)t[r]=e/n|0,n*=4294967296;return new r(t,0)}var a=i(0),c=i(1),u=i(16777216);function l(e){if(0!=e.h)return!1;for(let t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function h(e){return-1==e.h}function d(e){const t=e.g.length,n=[];for(let r=0;r<t;r++)n[r]=~e.g[r];return new r(n,~e.h).add(c)}function f(e,t){return e.add(d(t))}function p(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function m(e,t){this.g=e,this.h=t}function g(e,t){if(l(t))throw Error("division by zero");if(l(e))return new m(a,a);if(h(e))return t=g(d(e),t),new m(d(t.g),d(t.h));if(h(t))return t=g(e,d(t)),new m(d(t.g),t.h);if(e.g.length>30){if(h(e)||h(t))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=t;r.l(e)<=0;)n=y(n),r=y(r);var s=v(n,1),i=v(r,1);for(r=v(r,2),n=v(n,2);!l(r);){var u=i.add(r);u.l(e)<=0&&(s=s.add(n),i=u),r=v(r,1),n=v(n,1)}return t=f(e,s.j(t)),new m(s,t)}for(s=a;e.l(t)>=0;){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=(r=Math.ceil(Math.log(n)/Math.LN2))<=48?1:Math.pow(2,r-48),u=(i=o(n)).j(t);h(u)||u.l(e)>0;)u=(i=o(n-=r)).j(t);l(i)&&(i=c),s=s.add(i),e=f(e,u)}return new m(s,e)}function y(e){const t=e.g.length+1,n=[];for(let r=0;r<t;r++)n[r]=e.i(r)<<1|e.i(r-1)>>>31;return new r(n,e.h)}function v(e,t){const n=t>>5;t%=32;const s=e.g.length-n,i=[];for(let r=0;r<s;r++)i[r]=t>0?e.i(r+n)>>>t|e.i(r+n+1)<<32-t:e.i(r+n);return new r(i,e.h)}(e=r.prototype).m=function(){if(h(this))return-d(this).m();let e=0,t=1;for(let n=0;n<this.g.length;n++){const r=this.i(n);e+=(r>=0?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if((e=e||10)<2||36<e)throw Error("radix out of range: "+e);if(l(this))return"0";if(h(this))return"-"+d(this).toString(e);const t=o(Math.pow(e,6));var n=this;let r="";for(;;){const s=g(n,t).g;let i=(((n=f(n,s.j(t))).g.length>0?n.g[0]:n.h)>>>0).toString(e);if(l(n=s))return i+r;for(;i.length<6;)i="0"+i;r=i+r}},e.i=function(e){return e<0?0:e<this.g.length?this.g[e]:this.h},e.l=function(e){return h(e=f(this,e))?-1:l(e)?0:1},e.abs=function(){return h(this)?d(this):this},e.add=function(e){const t=Math.max(this.g.length,e.g.length),n=[];let s=0;for(let r=0;r<=t;r++){let t=s+(65535&this.i(r))+(65535&e.i(r)),i=(t>>>16)+(this.i(r)>>>16)+(e.i(r)>>>16);s=i>>>16,t&=65535,i&=65535,n[r]=i<<16|t}return new r(n,-2147483648&n[n.length-1]?-1:0)},e.j=function(e){if(l(this)||l(e))return a;if(h(this))return h(e)?d(this).j(d(e)):d(d(this).j(e));if(h(e))return d(this.j(d(e)));if(this.l(u)<0&&e.l(u)<0)return o(this.m()*e.m());const t=this.g.length+e.g.length,n=[];for(var s=0;s<2*t;s++)n[s]=0;for(s=0;s<this.g.length;s++)for(let t=0;t<e.g.length;t++){const r=this.i(s)>>>16,i=65535&this.i(s),o=e.i(t)>>>16,a=65535&e.i(t);n[2*s+2*t]+=i*a,p(n,2*s+2*t),n[2*s+2*t+1]+=r*a,p(n,2*s+2*t+1),n[2*s+2*t+1]+=i*o,p(n,2*s+2*t+1),n[2*s+2*t+2]+=r*o,p(n,2*s+2*t+2)}for(e=0;e<t;e++)n[e]=n[2*e+1]<<16|n[2*e];for(e=t;e<2*t;e++)n[e]=0;return new r(n,0)},e.B=function(e){return g(this,e).h},e.and=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)&e.i(r);return new r(n,this.h&e.h)},e.or=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)|e.i(r);return new r(n,this.h|e.h)},e.xor=function(e){const t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)^e.i(r);return new r(n,this.h^e.h)},t.prototype.digest=t.prototype.A,t.prototype.reset=t.prototype.u,t.prototype.update=t.prototype.v,at=t,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.B,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function e(t,n){if(0==t.length)throw Error("number format error: empty string");if((n=n||10)<2||36<n)throw Error("radix out of range: "+n);if("-"==t.charAt(0))return d(e(t.substring(1),n));if(t.indexOf("-")>=0)throw Error('number format error: interior "-" character');const r=o(Math.pow(n,8));let s=a;for(let a=0;a<t.length;a+=8){var i=Math.min(8,t.length-a);const e=parseInt(t.substring(a,a+i),n);i<8?(i=o(Math.pow(n,i)),s=s.j(i).add(o(e))):(s=s.j(r),s=s.add(o(e)))}return s},ot=r}).apply(void 0!==ct?ct:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var ut,lt,ht,dt,ft,pt,mt,gt,yt="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e,t=Object.defineProperty;var n=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof yt&&yt];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);function r(e,r){if(r)e:{var s=n;e=e.split(".");for(var i=0;i<e.length-1;i++){var o=e[i];if(!(o in s))break e;s=s[o]}(r=r(i=s[e=e[e.length-1]]))!=i&&null!=r&&t(s,e,{configurable:!0,writable:!0,value:r})}}r("Symbol.dispose",function(e){return e||Symbol("Symbol.dispose")}),r("Array.prototype.values",function(e){return e||function(){return this[Symbol.iterator]()}}),r("Object.entries",function(e){return e||function(e){var t,n=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.push([t,e[t]]);return n}});
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
var s=s||{},i=this||self;function o(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function a(e,t,n){return e.call.apply(e.bind,arguments)}function c(e,t,n){return(c=a).apply(null,arguments)}function u(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function l(e,t){function n(){}n.prototype=t.prototype,e.Z=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Ob=function(e,n,r){for(var s=Array(arguments.length-2),i=2;i<arguments.length;i++)s[i-2]=arguments[i];return t.prototype[n].apply(e,s)}}var h="undefined"!=typeof AsyncContext&&"function"==typeof AsyncContext.Snapshot?e=>e&&AsyncContext.Snapshot.wrap(e):e=>e;function d(e){const t=e.length;if(t>0){const n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function f(e,t){for(let r=1;r<arguments.length;r++){const t=arguments[r];var n=typeof t;if("array"==(n="object"!=n?n:t?Array.isArray(t)?"array":n:"null")||"object"==n&&"number"==typeof t.length){n=e.length||0;const r=t.length||0;e.length=n+r;for(let s=0;s<r;s++)e[n+s]=t[s]}else e.push(t)}}function p(e){i.setTimeout(()=>{throw e},0)}function m(){var e=I;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}var g=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return this.h>0?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new y,e=>e.reset());class y{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let v,w=!1,I=new class{constructor(){this.h=this.g=null}add(e,t){const n=g.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}},_=()=>{const e=Promise.resolve(void 0);v=()=>{e.then(b)}};function b(){for(var e;e=m();){try{e.h.call(e.g)}catch(n){p(n)}var t=g;t.j(e),t.h<100&&(t.h++,e.next=t.g,t.g=e)}w=!1}function T(){this.u=this.u,this.C=this.C}function E(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}T.prototype.u=!1,T.prototype.dispose=function(){this.u||(this.u=!0,this.N())},T.prototype[Symbol.dispose]=function(){this.dispose()},T.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},E.prototype.h=function(){this.defaultPrevented=!0};var S=function(){if(!i.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const e=()=>{};i.addEventListener("test",e,t),i.removeEventListener("test",e,t)}catch(n){}return e}();function C(e){return/^[\s\xa0]*$/.test(e)}function A(e,t){E.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e&&this.init(e,t)}l(A,E),A.prototype.init=function(e,t){const n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;this.target=e.target||e.srcElement,this.g=t,(t=e.relatedTarget)||("mouseover"==n?t=e.fromElement:"mouseout"==n&&(t=e.toElement)),this.relatedTarget=t,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType=e.pointerType,this.state=e.state,this.i=e,e.defaultPrevented&&A.Z.h.call(this)},A.prototype.h=function(){A.Z.h.call(this);const e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var k="closure_listenable_"+(1e6*Math.random()|0),N=0;function D(e,t,n,r,s){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=s,this.key=++N,this.da=this.fa=!1}function x(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function R(e,t,n){for(const r in e)t.call(n,e[r],r,e)}function P(e){const t={};for(const n in e)t[n]=e[n];return t}const O="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function M(e,t){let n,r;for(let s=1;s<arguments.length;s++){for(n in r=arguments[s],r)e[n]=r[n];for(let t=0;t<O.length;t++)n=O[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function L(e){this.src=e,this.g={},this.h=0}function F(e,t){const n=t.type;if(n in e.g){var r,s=e.g[n],i=Array.prototype.indexOf.call(s,t,void 0);(r=i>=0)&&Array.prototype.splice.call(s,i,1),r&&(x(t),0==e.g[n].length&&(delete e.g[n],e.h--))}}function V(e,t,n,r){for(let s=0;s<e.length;++s){const i=e[s];if(!i.da&&i.listener==t&&i.capture==!!n&&i.ha==r)return s}return-1}L.prototype.add=function(e,t,n,r,s){const i=e.toString();(e=this.g[i])||(e=this.g[i]=[],this.h++);const o=V(e,t,r,s);return o>-1?(t=e[o],n||(t.fa=!1)):((t=new D(t,this.src,i,!!r,s)).fa=n,e.push(t)),t};var U="closure_lm_"+(1e6*Math.random()|0),B={};function q(e,t,n,r,s){if(r&&r.once)return z(e,t,n,r,s);if(Array.isArray(t)){for(let i=0;i<t.length;i++)q(e,t[i],n,r,s);return null}return n=J(n),e&&e[k]?e.J(t,n,o(r)?!!r.capture:!!r,s):j(e,t,n,!1,r,s)}function j(e,t,n,r,s,i){if(!t)throw Error("Invalid event type");const a=o(s)?!!s.capture:!!s;let c=W(e);if(c||(e[U]=c=new L(e)),(n=c.add(t,n,r,a,i)).proxy)return n;if(r=function(){function e(n){return t.call(e.src,e.listener,n)}const t=H;return e}(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)S||(s=a),void 0===s&&(s=!1),e.addEventListener(t.toString(),r,s);else if(e.attachEvent)e.attachEvent(K(t.toString()),r);else{if(!e.addListener||!e.removeListener)throw Error("addEventListener and attachEvent are unavailable.");e.addListener(r)}return n}function z(e,t,n,r,s){if(Array.isArray(t)){for(let i=0;i<t.length;i++)z(e,t[i],n,r,s);return null}return n=J(n),e&&e[k]?e.K(t,n,o(r)?!!r.capture:!!r,s):j(e,t,n,!0,r,s)}function $(e,t,n,r,s){if(Array.isArray(t))for(var i=0;i<t.length;i++)$(e,t[i],n,r,s);else r=o(r)?!!r.capture:!!r,n=J(n),e&&e[k]?(e=e.i,(i=String(t).toString())in e.g&&((n=V(t=e.g[i],n,r,s))>-1&&(x(t[n]),Array.prototype.splice.call(t,n,1),0==t.length&&(delete e.g[i],e.h--)))):e&&(e=W(e))&&(t=e.g[t.toString()],e=-1,t&&(e=V(t,n,r,s)),(n=e>-1?t[e]:null)&&G(n))}function G(e){if("number"!=typeof e&&e&&!e.da){var t=e.src;if(t&&t[k])F(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent(K(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=W(t))?(F(n,e),0==n.h&&(n.src=null,t[U]=null)):x(e)}}}function K(e){return e in B?B[e]:B[e]="on"+e}function H(e,t){if(e.da)e=!0;else{t=new A(t,this);const n=e.listener,r=e.ha||e.src;e.fa&&G(e),e=n.call(r,t)}return e}function W(e){return(e=e[U])instanceof L?e:null}var Q="__closure_events_fn_"+(1e9*Math.random()>>>0);function J(e){return"function"==typeof e?e:(e[Q]||(e[Q]=function(t){return e.handleEvent(t)}),e[Q])}function Y(){T.call(this),this.i=new L(this),this.M=this,this.G=null}function X(e,t){var n,r=e.G;if(r)for(n=[];r;r=r.G)n.push(r);if(e=e.M,r=t.type||t,"string"==typeof t)t=new E(t,e);else if(t instanceof E)t.target=t.target||e;else{var s=t;M(t=new E(r,e),s)}let i,o;if(s=!0,n)for(o=n.length-1;o>=0;o--)i=t.g=n[o],s=Z(i,r,!0,t)&&s;if(i=t.g=e,s=Z(i,r,!0,t)&&s,s=Z(i,r,!1,t)&&s,n)for(o=0;o<n.length;o++)i=t.g=n[o],s=Z(i,r,!1,t)&&s}function Z(e,t,n,r){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();let s=!0;for(let i=0;i<t.length;++i){const o=t[i];if(o&&!o.da&&o.capture==n){const t=o.listener,n=o.ha||o.src;o.fa&&F(e.i,o),s=!1!==t.call(n,r)&&s}}return s&&!r.defaultPrevented}function ee(e){e.g=function(e,t){if("function"!=typeof e){if(!e||"function"!=typeof e.handleEvent)throw Error("Invalid listener argument");e=c(e.handleEvent,e)}return Number(t)>2147483647?-1:i.setTimeout(e,t||0)}(()=>{e.g=null,e.i&&(e.i=!1,ee(e))},e.l);const t=e.h;e.h=null,e.m.apply(null,t)}l(Y,T),Y.prototype[k]=!0,Y.prototype.removeEventListener=function(e,t,n,r){$(this,e,t,n,r)},Y.prototype.N=function(){if(Y.Z.N.call(this),this.i){var e=this.i;for(const t in e.g){const n=e.g[t];for(let e=0;e<n.length;e++)x(n[e]);delete e.g[t],e.h--}}this.G=null},Y.prototype.J=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},Y.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};class te extends T{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:ee(this)}N(){super.N(),this.g&&(i.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ne(e){T.call(this),this.h=e,this.g={}}l(ne,T);var re=[];function se(e){R(e.g,function(e,t){this.g.hasOwnProperty(t)&&G(e)},e),e.g={}}ne.prototype.N=function(){ne.Z.N.call(this),se(this)},ne.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ie=i.JSON.stringify,oe=i.JSON.parse,ae=class{stringify(e){return i.JSON.stringify(e,void 0)}parse(e){return i.JSON.parse(e,void 0)}};function ce(){}function ue(){}var le={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function he(){E.call(this,"d")}function de(){E.call(this,"c")}l(he,E),l(de,E);var fe={},pe=null;function me(){return pe=pe||new Y}function ge(e){E.call(this,fe.Ia,e)}function ye(e){const t=me();X(t,new ge(t))}function ve(e,t){E.call(this,fe.STAT_EVENT,e),this.stat=t}function we(e){const t=me();X(t,new ve(t,e))}function Ie(e,t){E.call(this,fe.Ja,e),this.size=t}function _e(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return i.setTimeout(function(){e()},t)}function be(){this.g=!0}function Te(e,t,n,r){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{const i=JSON.parse(t);if(i)for(e=0;e<i.length;e++)if(Array.isArray(i[e])){var n=i[e];if(!(n.length<2)){var r=n[1];if(Array.isArray(r)&&!(r.length<1)){var s=r[0];if("noop"!=s&&"stop"!=s&&"close"!=s)for(let e=1;e<r.length;e++)r[e]=""}}}return ie(i)}catch(i){return t}}(e,n)+(r?" "+r:"")})}fe.Ia="serverreachability",l(ge,E),fe.STAT_EVENT="statevent",l(ve,E),fe.Ja="timingevent",l(Ie,E),be.prototype.ua=function(){this.g=!1},be.prototype.info=function(){};var Ee,Se={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Ce={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"};function Ae(){}function ke(e){return encodeURIComponent(String(e))}function Ne(e){var t=1;e=e.split(":");const n=[];for(;t>0&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(":")),n}function De(e,t,n,r){this.j=e,this.i=t,this.l=n,this.S=r||1,this.V=new ne(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new xe}function xe(){this.i=null,this.g="",this.h=!1}l(Ae,ce),Ae.prototype.g=function(){return new XMLHttpRequest},Ee=new Ae;var Re={},Pe={};function Oe(e,t,n){e.M=1,e.A=it(et(t)),e.u=n,e.R=!0,Me(e,null)}function Me(e,t){e.F=Date.now(),Ve(e),e.B=et(e.A);var n=e.B,r=e.S;Array.isArray(r)||(r=[String(r)]),kt(n.i,"t",r),e.C=0,n=e.j.L,e.h=new xe,e.g=mn(e.j,n?t:null,!e.u),e.P>0&&(e.O=new te(c(e.Y,e,e.g),e.P)),t=e.V,n=e.g,r=e.ba;var s="readystatechange";Array.isArray(s)||(s&&(re[0]=s.toString()),s=re);for(let i=0;i<s.length;i++){const e=q(n,s[i],r||t.handleEvent,!1,t.h||t);if(!e)break;t.g[e.key]=e}t=e.J?P(e.J):{},e.u?(e.v||(e.v="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.B,e.v,e.u,t)):(e.v="GET",e.g.ea(e.B,e.v,null,t)),ye(),function(e,t,n,r,s,i){e.info(function(){if(e.g)if(i){var o="",a=i.split("&");for(let e=0;e<a.length;e++){var c=a[e].split("=");if(c.length>1){const e=c[0];c=c[1];const t=e.split("_");o=t.length>=2&&"type"==t[1]?o+(e+"=")+c+"&":o+(e+"=redacted&")}}}else o=null;else o=i;return"XMLHTTP REQ ("+r+") [attempt "+s+"]: "+t+"\n"+n+"\n"+o})}(e.i,e.v,e.B,e.l,e.S,e.u)}function Le(e){return!!e.g&&("GET"==e.v&&2!=e.M&&e.j.Aa)}function Fe(e,t){var n=e.C,r=t.indexOf("\n",n);return-1==r?Pe:(n=Number(t.substring(n,r)),isNaN(n)?Re:(r+=1)+n>t.length?Pe:(t=t.slice(r,r+n),e.C=r+n,t))}function Ve(e){e.T=Date.now()+e.H,Ue(e,e.H)}function Ue(e,t){if(null!=e.D)throw Error("WatchDog timer not null");e.D=_e(c(e.aa,e),t)}function Be(e){e.D&&(i.clearTimeout(e.D),e.D=null)}function qe(e){0==e.j.I||e.K||ln(e.j,e)}function je(e){Be(e);var t=e.O;t&&"function"==typeof t.dispose&&t.dispose(),e.O=null,se(e.V),e.g&&(t=e.g,e.g=null,t.abort(),t.dispose())}function ze(e,t){try{var n=e.j;if(0!=n.I&&(n.g==e||We(n.h,e)))if(!e.L&&We(n.h,e)&&3==n.I){try{var r=n.Ba.g.parse(t)}catch(l){r=null}if(Array.isArray(r)&&3==r.length){var s=r;if(0==s[0]){e:if(!n.v){if(n.g){if(!(n.g.F+3e3<e.F))break e;un(n),Xt(n)}on(n),we(18)}}else n.xa=s[1],0<n.xa-n.K&&s[2]<37500&&n.F&&0==n.A&&!n.C&&(n.C=_e(c(n.Va,n),6e3));He(n.h)<=1&&n.ta&&(n.ta=void 0)}else dn(n,11)}else if((e.L||n.g==e)&&un(n),!C(t))for(s=n.Ba.g.parse(t),t=0;t<s.length;t++){let c=s[t];const l=c[0];if(!(l<=n.K))if(n.K=l,c=c[1],2==n.I)if("c"==c[0]){n.M=c[1],n.ba=c[2];const t=c[3];null!=t&&(n.ka=t,n.j.info("VER="+n.ka));const s=c[4];null!=s&&(n.za=s,n.j.info("SVER="+n.za));const l=c[5];null!=l&&"number"==typeof l&&l>0&&(r=1.5*l,n.O=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const h=e.g;if(h){const e=h.g?h.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var i=r.h;i.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(i.j=i.l,i.g=new Set,i.h&&(Qe(i,i.h),i.h=null))}if(r.G){const e=h.g?h.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(r.wa=e,st(r.J,r.G,e))}}n.I=3,n.l&&n.l.ra(),n.aa&&(n.T=Date.now()-e.F,n.j.info("Handshake RTT: "+n.T+"ms"));var o=e;if((r=n).na=pn(r,r.L?r.ba:null,r.W),o.L){Je(r.h,o);var a=o,u=r.O;u&&(a.H=u),a.D&&(Be(a),Ve(a)),r.g=o}else sn(r);n.i.length>0&&en(n)}else"stop"!=c[0]&&"close"!=c[0]||dn(n,7);else 3==n.I&&("stop"==c[0]||"close"==c[0]?"stop"==c[0]?dn(n,7):Yt(n):"noop"!=c[0]&&n.l&&n.l.qa(c),n.A=0)}ye()}catch(l){}}De.prototype.ba=function(e){e=e.target;const t=this.O;t&&3==Ht(e)?t.j():this.Y(e)},De.prototype.Y=function(e){try{if(e==this.g)e:{const c=Ht(this.g),u=this.g.ya();this.g.ca();if(!(c<3)&&(3!=c||this.g&&(this.h.h||this.g.la()||Wt(this.g)))){this.K||4!=c||7==u||ye(),Be(this);var t=this.g.ca();this.X=t;var n=function(e){if(!Le(e))return e.g.la();const t=Wt(e.g);if(""===t)return"";let n="";const r=t.length,s=4==Ht(e.g);if(!e.h.i){if("undefined"==typeof TextDecoder)return je(e),qe(e),"";e.h.i=new i.TextDecoder}for(let i=0;i<r;i++)e.h.h=!0,n+=e.h.i.decode(t[i],{stream:!(s&&i==r-1)});return t.length=0,e.h.g+=n,e.C=0,e.h.g}(this);if(this.o=200==t,function(e,t,n,r,s,i,o){e.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+s+"]: "+t+"\n"+n+"\n"+i+" "+o})}(this.i,this.v,this.B,this.l,this.S,c,t),this.o){if(this.U&&!this.L){t:{if(this.g){var r,s=this.g;if((r=s.g?s.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(r)){var o=r;break t}}o=null}if(!(e=o)){this.o=!1,this.m=3,we(12),je(this),qe(this);break e}Te(this.i,this.l,e,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,ze(this,e)}if(this.R){let t;for(e=!0;!this.K&&this.C<n.length;){if(t=Fe(this,n),t==Pe){4==c&&(this.m=4,we(14),e=!1),Te(this.i,this.l,null,"[Incomplete Response]");break}if(t==Re){this.m=4,we(15),Te(this.i,this.l,n,"[Invalid Chunk]"),e=!1;break}Te(this.i,this.l,t,null),ze(this,t)}if(Le(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=c||0!=n.length||this.h.h||(this.m=1,we(16),e=!1),this.o=this.o&&e,e){if(n.length>0&&!this.W){this.W=!0;var a=this.j;a.g==this&&a.aa&&!a.P&&(a.j.info("Great, no buffering proxy detected. Bytes received: "+n.length),an(a),a.P=!0,we(11))}}else Te(this.i,this.l,n,"[Invalid Chunked Response]"),je(this),qe(this)}else Te(this.i,this.l,n,null),ze(this,n);4==c&&je(this),this.o&&!this.K&&(4==c?ln(this.j,this):(this.o=!1,Ve(this)))}else(function(e){const t={};e=(e.g&&Ht(e)>=2&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<e.length;r++){if(C(e[r]))continue;var n=Ne(e[r]);const s=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const i=t[s]||[];t[s]=i,i.push(n)}!function(e,t){for(const n in e)t.call(void 0,e[n],n,e)}(t,function(e){return e.join(", ")})})(this.g),400==t&&n.indexOf("Unknown SID")>0?(this.m=3,we(12)):(this.m=0,we(13)),je(this),qe(this)}}}catch(c){}},De.prototype.cancel=function(){this.K=!0,je(this)},De.prototype.aa=function(){this.D=null;const e=Date.now();e-this.T>=0?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.i,this.B),2!=this.M&&(ye(),we(17)),je(this),this.m=2,qe(this)):Ue(this,this.T-e)};var $e=class{constructor(e,t){this.g=e,this.map=t}};function Ge(e){this.l=e||10,i.PerformanceNavigationTiming?e=(e=i.performance.getEntriesByType("navigation")).length>0&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):e=!!(i.chrome&&i.chrome.loadTimes&&i.chrome.loadTimes()&&i.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Ke(e){return!!e.h||!!e.g&&e.g.size>=e.j}function He(e){return e.h?1:e.g?e.g.size:0}function We(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function Qe(e,t){e.g?e.g.add(t):e.h=t}function Je(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function Ye(e){if(null!=e.h)return e.i.concat(e.h.G);if(null!=e.g&&0!==e.g.size){let t=e.i;for(const n of e.g.values())t=t.concat(n.G);return t}return d(e.i)}Ge.prototype.cancel=function(){if(this.i=Ye(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const e of this.g.values())e.cancel();this.g.clear()}};var Xe=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ze(e){let t;this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1,e instanceof Ze?(this.l=e.l,tt(this,e.j),this.o=e.o,this.g=e.g,nt(this,e.u),this.h=e.h,rt(this,Nt(e.i)),this.m=e.m):e&&(t=String(e).match(Xe))?(this.l=!1,tt(this,t[1]||"",!0),this.o=ot(t[2]||""),this.g=ot(t[3]||"",!0),nt(this,t[4]),this.h=ot(t[5]||"",!0),rt(this,t[6]||"",!0),this.m=ot(t[7]||"")):(this.l=!1,this.i=new Tt(null,this.l))}function et(e){return new Ze(e)}function tt(e,t,n){e.j=n?ot(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function nt(e,t){if(t){if(t=Number(t),isNaN(t)||t<0)throw Error("Bad port number "+t);e.u=t}else e.u=null}function rt(e,t,n){t instanceof Tt?(e.i=t,function(e,t){t&&!e.j&&(Et(e),e.i=null,e.g.forEach(function(e,t){const n=t.toLowerCase();t!=n&&(St(this,t),kt(this,n,e))},e)),e.j=t}(e.i,e.l)):(n||(t=at(t,_t)),e.i=new Tt(t,e.l))}function st(e,t,n){e.i.set(t,n)}function it(e){return st(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function ot(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function at(e,t,n){return"string"==typeof e?(e=encodeURI(e).replace(t,ct),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function ct(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}Ze.prototype.toString=function(){const e=[];var t=this.j;t&&e.push(at(t,vt,!0),":");var n=this.g;return(n||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(at(t,vt,!0),"@"),e.push(ke(n).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.u)&&e.push(":",String(n))),(n=this.h)&&(this.g&&"/"!=n.charAt(0)&&e.push("/"),e.push(at(n,"/"==n.charAt(0)?It:wt,!0))),(n=this.i.toString())&&e.push("?",n),(n=this.m)&&e.push("#",at(n,bt)),e.join("")},Ze.prototype.resolve=function(e){const t=et(this);let n=!!e.j;n?tt(t,e.j):n=!!e.o,n?t.o=e.o:n=!!e.g,n?t.g=e.g:n=null!=e.u;var r=e.h;if(n)nt(t,e.u);else if(n=!!e.h){if("/"!=r.charAt(0))if(this.g&&!this.h)r="/"+r;else{var s=t.h.lastIndexOf("/");-1!=s&&(r=t.h.slice(0,s+1)+r)}if(".."==(s=r)||"."==s)r="";else if(-1!=s.indexOf("./")||-1!=s.indexOf("/.")){r=0==s.lastIndexOf("/",0),s=s.split("/");const e=[];for(let t=0;t<s.length;){const n=s[t++];"."==n?r&&t==s.length&&e.push(""):".."==n?((e.length>1||1==e.length&&""!=e[0])&&e.pop(),r&&t==s.length&&e.push("")):(e.push(n),r=!0)}r=e.join("/")}else r=s}return n?t.h=r:n=""!==e.i.toString(),n?rt(t,Nt(e.i)):n=!!e.m,n&&(t.m=e.m),t};var vt=/[#\/\?@]/g,wt=/[#\?:]/g,It=/[#\?]/g,_t=/[#\?@]/g,bt=/#/g;function Tt(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function Et(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(let n=0;n<e.length;n++){const r=e[n].indexOf("=");let s,i=null;r>=0?(s=e[n].substring(0,r),i=e[n].substring(r+1)):s=e[n],t(s,i?decodeURIComponent(i.replace(/\+/g," ")):"")}}}(e.i,function(t,n){e.add(decodeURIComponent(t.replace(/\+/g," ")),n)}))}function St(e,t){Et(e),t=Dt(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function Ct(e,t){return Et(e),t=Dt(e,t),e.g.has(t)}function At(e,t){Et(e);let n=[];if("string"==typeof t)Ct(e,t)&&(n=n.concat(e.g.get(Dt(e,t))));else for(e=Array.from(e.g.values()),t=0;t<e.length;t++)n=n.concat(e[t]);return n}function kt(e,t,n){St(e,t),n.length>0&&(e.i=null,e.g.set(Dt(e,t),d(n)),e.h+=n.length)}function Nt(e){const t=new Tt;return t.i=e.i,e.g&&(t.g=new Map(e.g),t.h=e.h),t}function Dt(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function xt(e,t,n,r,s){try{s&&(s.onload=null,s.onerror=null,s.onabort=null,s.ontimeout=null),r(n)}catch(i){}}function Rt(){this.g=new ae}function Pt(e){this.i=e.Sb||null,this.h=e.ab||!1}function Ot(e,t){Y.call(this),this.H=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}function Mt(e){e.j.read().then(e.Ma.bind(e)).catch(e.ga.bind(e))}function Lt(e){e.readyState=4,e.l=null,e.j=null,e.B=null,Ft(e)}function Ft(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function Vt(e){let t="";return R(e,function(e,n){t+=n,t+=":",t+=e,t+="\r\n"}),t}function Ut(e,t,n){e:{for(r in n){var r=!1;break e}r=!0}r||(n=Vt(n),"string"==typeof e?null!=n&&ke(n):st(e,t,n))}function Bt(e){Y.call(this),this.headers=new Map,this.L=e||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}(e=Tt.prototype).add=function(e,t){Et(this),this.i=null,e=Dt(this,e);let n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this},e.forEach=function(e,t){Et(this),this.g.forEach(function(n,r){n.forEach(function(n){e.call(t,n,r,this)},this)},this)},e.set=function(e,t){return Et(this),this.i=null,Ct(this,e=Dt(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e&&(e=At(this,e)).length>0?String(e[0]):t},e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],t=Array.from(this.g.keys());for(let r=0;r<t.length;r++){var n=t[r];const s=ke(n);n=At(this,n);for(let t=0;t<n.length;t++){let r=s;""!==n[t]&&(r+="="+ke(n[t])),e.push(r)}}return this.i=e.join("&")},l(Pt,ce),Pt.prototype.g=function(){return new Ot(this.i,this.h)},l(Ot,Y),(e=Ot.prototype).open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.F=e,this.D=t,this.readyState=1,Ft(this)},e.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const t={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};e&&(t.body=e),(this.H||i).fetch(new Request(this.D,t)).then(this.Pa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&4!=this.readyState&&(this.g=!1,Lt(this)),this.readyState=0},e.Pa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,Ft(this)),this.g&&(this.readyState=3,Ft(this),this.g)))if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(void 0!==i.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Mt(this)}else e.text().then(this.Oa.bind(this),this.ga.bind(this))},e.Ma=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.B.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?Lt(this):Ft(this),3==this.readyState&&Mt(this)}},e.Oa=function(e){this.g&&(this.response=this.responseText=e,Lt(this))},e.Na=function(e){this.g&&(this.response=e,Lt(this))},e.ga=function(){this.g&&Lt(this)},e.setRequestHeader=function(e,t){this.A.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+": "+n[1]),n=t.next();return e.join("\r\n")},Object.defineProperty(Ot.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),l(Bt,Y);var qt=/^https?$/i,jt=["POST","PUT"];function zt(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.o=5,$t(e),Kt(e)}function $t(e){e.A||(e.A=!0,X(e,"complete"),X(e,"error"))}function Gt(e){if(e.h&&void 0!==s)if(e.v&&4==Ht(e))setTimeout(e.Ca.bind(e),0);else if(X(e,"readystatechange"),4==Ht(e)){e.h=!1;try{const s=e.ca();e:switch(s){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break e;default:t=!1}var n;if(!(n=t)){var r;if(r=0===s){let t=String(e.D).match(Xe)[1]||null;!t&&i.self&&i.self.location&&(t=i.self.location.protocol.slice(0,-1)),r=!qt.test(t?t.toLowerCase():"")}n=r}if(n)X(e,"complete"),X(e,"success");else{e.o=6;try{var o=Ht(e)>2?e.g.statusText:""}catch(a){o=""}e.l=o+" ["+e.ca()+"]",$t(e)}}finally{Kt(e)}}}function Kt(e,t){if(e.g){e.m&&(clearTimeout(e.m),e.m=null);const r=e.g;e.g=null,t||X(e,"ready");try{r.onreadystatechange=null}catch(n){}}}function Ht(e){return e.g?e.g.readyState:0}function Wt(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.F){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(t){return null}}function Qt(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function Jt(e){this.za=0,this.i=[],this.j=new be,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Qt("failFast",!1,e),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Qt("baseRetryDelayMs",5e3,e),this.Za=Qt("retryDelaySeedMs",1e4,e),this.Ta=Qt("forwardChannelMaxRetries",2,e),this.va=Qt("forwardChannelRequestTimeoutMs",2e4,e),this.ma=e&&e.xmlHttpFactory||void 0,this.Ua=e&&e.Rb||void 0,this.Aa=e&&e.useFetchStreams||!1,this.O=void 0,this.L=e&&e.supportsCrossDomainXhr||!1,this.M="",this.h=new Ge(e&&e.concurrentRequestLimit),this.Ba=new Rt,this.S=e&&e.fastHandshake||!1,this.R=e&&e.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=e&&e.Pb||!1,e&&e.ua&&this.j.ua(),e&&e.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&e&&e.detectBufferingProxy||!1,this.ia=void 0,e&&e.longPollingTimeout&&e.longPollingTimeout>0&&(this.ia=e.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}function Yt(e){if(Zt(e),3==e.I){var t=e.V++,n=et(e.J);if(st(n,"SID",e.M),st(n,"RID",t),st(n,"TYPE","terminate"),nn(e,n),(t=new De(e,e.j,t)).M=2,t.A=it(et(n)),n=!1,i.navigator&&i.navigator.sendBeacon)try{n=i.navigator.sendBeacon(t.A.toString(),"")}catch(r){}!n&&i.Image&&((new Image).src=t.A,n=!0),n||(t.g=mn(t.j,null),t.g.ea(t.A)),t.F=Date.now(),Ve(t)}fn(e)}function Xt(e){e.g&&(an(e),e.g.cancel(),e.g=null)}function Zt(e){Xt(e),e.v&&(i.clearTimeout(e.v),e.v=null),un(e),e.h.cancel(),e.m&&("number"==typeof e.m&&i.clearTimeout(e.m),e.m=null)}function en(e){if(!Ke(e.h)&&!e.m){e.m=!0;var t=e.Ea;v||_(),w||(v(),w=!0),I.add(t,e),e.D=0}}function tn(e,t){var n;n=t?t.l:e.V++;const r=et(e.J);st(r,"SID",e.M),st(r,"RID",n),st(r,"AID",e.K),nn(e,r),e.u&&e.o&&Ut(r,e.u,e.o),n=new De(e,e.j,n,e.D+1),null===e.u&&(n.J=e.o),t&&(e.i=t.G.concat(e.i)),t=rn(e,n,1e3),n.H=Math.round(.5*e.va)+Math.round(.5*e.va*Math.random()),Qe(e.h,n),Oe(n,r,t)}function nn(e,t){e.H&&R(e.H,function(e,n){st(t,n,e)}),e.l&&R({},function(e,n){st(t,n,e)})}function rn(e,t,n){n=Math.min(e.i.length,n);const r=e.l?c(e.l.Ka,e.l,e):null;e:{var s=e.i;let t=-1;for(;;){const e=["count="+n];-1==t?n>0?(t=s[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let c=!0;for(let l=0;l<n;l++){var i=s[l].g;const n=s[l].map;if((i-=t)<0)t=Math.max(0,s[l].g-100),c=!1;else try{i="req"+i+"_"||"";try{var a=n instanceof Map?n:Object.entries(n);for(const[t,n]of a){let r=n;o(n)&&(r=ie(n)),e.push(i+t+"="+encodeURIComponent(r))}}catch(u){throw e.push(i+"type="+encodeURIComponent("_badmap")),u}}catch(u){r&&r(n)}}if(c){a=e.join("&");break e}}a=void 0}return e=e.i.splice(0,n),t.G=e,a}function sn(e){if(!e.g&&!e.v){e.Y=1;var t=e.Da;v||_(),w||(v(),w=!0),I.add(t,e),e.A=0}}function on(e){return!(e.g||e.v||e.A>=3)&&(e.Y++,e.v=_e(c(e.Da,e),hn(e,e.A)),e.A++,!0)}function an(e){null!=e.B&&(i.clearTimeout(e.B),e.B=null)}function cn(e){e.g=new De(e,e.j,"rpc",e.Y),null===e.u&&(e.g.J=e.o),e.g.P=0;var t=et(e.na);st(t,"RID","rpc"),st(t,"SID",e.M),st(t,"AID",e.K),st(t,"CI",e.F?"0":"1"),!e.F&&e.ia&&st(t,"TO",e.ia),st(t,"TYPE","xmlhttp"),nn(e,t),e.u&&e.o&&Ut(t,e.u,e.o),e.O&&(e.g.H=e.O);var n=e.g;e=e.ba,n.M=1,n.A=it(et(t)),n.u=null,n.R=!0,Me(n,e)}function un(e){null!=e.C&&(i.clearTimeout(e.C),e.C=null)}function ln(e,t){var n=null;if(e.g==t){un(e),an(e),e.g=null;var r=2}else{if(!We(e.h,t))return;n=t.G,Je(e.h,t),r=1}if(0!=e.I)if(t.o)if(1==r){n=t.u?t.u.length:0,t=Date.now()-t.F;var s=e.D;X(r=me(),new Ie(r,n)),en(e)}else sn(e);else if(3==(s=t.m)||0==s&&t.X>0||!(1==r&&function(e,t){return!(He(e.h)>=e.h.j-(e.m?1:0)||(e.m?(e.i=t.G.concat(e.i),0):1==e.I||2==e.I||e.D>=(e.Sa?0:e.Ta)||(e.m=_e(c(e.Ea,e,t),hn(e,e.D)),e.D++,0)))}(e,t)||2==r&&on(e)))switch(n&&n.length>0&&(t=e.h,t.i=t.i.concat(n)),s){case 1:dn(e,5);break;case 4:dn(e,10);break;case 3:dn(e,6);break;default:dn(e,2)}}function hn(e,t){let n=e.Qa+Math.floor(Math.random()*e.Za);return e.isActive()||(n*=2),n*t}function dn(e,t){if(e.j.info("Error code "+t),2==t){var n=c(e.bb,e),r=e.Ua;const t=!r;r=new Ze(r||"//www.google.com/images/cleardot.gif"),i.location&&"http"==i.location.protocol||tt(r,"https"),it(r),t?function(e,t){const n=new be;if(i.Image){const r=new Image;r.onload=u(xt,n,"TestLoadImage: loaded",!0,t,r),r.onerror=u(xt,n,"TestLoadImage: error",!1,t,r),r.onabort=u(xt,n,"TestLoadImage: abort",!1,t,r),r.ontimeout=u(xt,n,"TestLoadImage: timeout",!1,t,r),i.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=e}else t(!1)}(r.toString(),n):function(e,t){new be;const n=new AbortController,r=setTimeout(()=>{n.abort(),xt(0,0,!1,t)},1e4);fetch(e,{signal:n.signal}).then(e=>{clearTimeout(r),e.ok?xt(0,0,!0,t):xt(0,0,!1,t)}).catch(()=>{clearTimeout(r),xt(0,0,!1,t)})}(r.toString(),n)}else we(2);e.I=0,e.l&&e.l.pa(t),fn(e),Zt(e)}function fn(e){if(e.I=0,e.ja=[],e.l){const t=Ye(e.h);0==t.length&&0==e.i.length||(f(e.ja,t),f(e.ja,e.i),e.h.i.length=0,d(e.i),e.i.length=0),e.l.oa()}}function pn(e,t,n){var r=n instanceof Ze?et(n):new Ze(n);if(""!=r.g)t&&(r.g=t+"."+r.g),nt(r,r.u);else{var s=i.location;r=s.protocol,t=t?t+"."+s.hostname:s.hostname,s=+s.port;const e=new Ze(null);r&&tt(e,r),t&&(e.g=t),s&&nt(e,s),n&&(e.h=n),r=e}return n=e.G,t=e.wa,n&&t&&st(r,n,t),st(r,"VER",e.ka),nn(e,r),r}function mn(e,t,n){if(t&&!e.L)throw Error("Can't create secondary domain capable XhrIo object.");return(t=e.Aa&&!e.ma?new Bt(new Pt({ab:n})):new Bt(e.ma)).Fa(e.L),t}function gn(){}function yn(){}function vn(e,t){Y.call(this),this.g=new Jt(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.sa&&(e?e["X-WebChannel-Client-Profile"]=t.sa:e={"X-WebChannel-Client-Profile":t.sa}),this.g.U=e,(e=t&&t.Qb)&&!C(e)&&(this.g.u=e),this.A=t&&t.supportsCrossDomainXhr||!1,this.v=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!C(t)&&(this.g.G=t,null!==(e=this.h)&&t in e&&(t in(e=this.h)&&delete e[t])),this.j=new _n(this)}function wn(e){he.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(const n in t){e=n;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function In(){de.call(this),this.status=1}function _n(e){this.g=e}(e=Bt.prototype).Fa=function(e){this.H=e},e.ea=function(e,t,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);t=t?t.toUpperCase():"GET",this.D=e,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ee.g(),this.g.onreadystatechange=h(c(this.Ca,this));try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(o){return void zt(this,o)}if(e=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var s in r)n.set(s,r[s]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const e of r.keys())n.set(e,r.get(e))}r=Array.from(n.keys()).find(e=>"content-type"==e.toLowerCase()),s=i.FormData&&e instanceof i.FormData,!(Array.prototype.indexOf.call(jt,t,void 0)>=0)||r||s||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[i,a]of n)this.g.setRequestHeader(i,a);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(e),this.v=!1}catch(o){zt(this,o)}},e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=e||7,X(this,"complete"),X(this,"abort"),Kt(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Kt(this,!0)),Bt.Z.N.call(this)},e.Ca=function(){this.u||(this.B||this.v||this.j?Gt(this):this.Xa())},e.Xa=function(){Gt(this)},e.isActive=function(){return!!this.g},e.ca=function(){try{return Ht(this)>2?this.g.status:-1}catch(e){return-1}},e.la=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},e.La=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),oe(t)}},e.ya=function(){return this.o},e.Ha=function(){return"string"==typeof this.l?this.l:String(this.l)},(e=Jt.prototype).ka=8,e.I=1,e.connect=function(e,t,n,r){we(0),this.W=e,this.H=t||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.J=pn(this,null,this.W),en(this)},e.Ea=function(e){if(this.m)if(this.m=null,1==this.I){if(!e){this.V=Math.floor(1e5*Math.random()),e=this.V++;const s=new De(this,this.j,e);let i=this.o;if(this.U&&(i?(i=P(i),M(i,this.U)):i=this.U),null!==this.u||this.R||(s.J=i,i=null),this.S)e:{for(var t=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if((t+=r)>4096){t=n;break e}if(4096===t||n===this.i.length-1){t=n+1;break e}}t=1e3}else t=1e3;t=rn(this,s,t),st(n=et(this.J),"RID",e),st(n,"CVER",22),this.G&&st(n,"X-HTTP-Session-Id",this.G),nn(this,n),i&&(this.R?t="headers="+ke(Vt(i))+"&"+t:this.u&&Ut(n,this.u,i)),Qe(this.h,s),this.Ra&&st(n,"TYPE","init"),this.S?(st(n,"$req",t),st(n,"SID","null"),s.U=!0,Oe(s,n,null)):Oe(s,n,t),this.I=2}}else 3==this.I&&(e?tn(this,e):0==this.i.length||Ke(this.h)||tn(this))},e.Da=function(){if(this.v=null,cn(this),this.aa&&!(this.P||null==this.g||this.T<=0)){var e=4*this.T;this.j.info("BP detection timer enabled: "+e),this.B=_e(c(this.Wa,this),e)}},e.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,we(10),Xt(this),cn(this))},e.Va=function(){null!=this.C&&(this.C=null,Xt(this),on(this),we(19))},e.bb=function(e){e?(this.j.info("Successfully pinged google.com"),we(2)):(this.j.info("Failed to ping google.com"),we(1))},e.isActive=function(){return!!this.l&&this.l.isActive(this)},(e=gn.prototype).ra=function(){},e.qa=function(){},e.pa=function(){},e.oa=function(){},e.isActive=function(){return!0},e.Ka=function(){},yn.prototype.g=function(e,t){return new vn(e,t)},l(vn,Y),vn.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},vn.prototype.close=function(){Yt(this.g)},vn.prototype.o=function(e){var t=this.g;if("string"==typeof e){var n={};n.__data__=e,e=n}else this.v&&((n={}).__data__=ie(e),e=n);t.i.push(new $e(t.Ya++,e)),3==t.I&&en(t)},vn.prototype.N=function(){this.g.l=null,delete this.j,Yt(this.g),delete this.g,vn.Z.N.call(this)},l(wn,he),l(In,de),l(_n,gn),_n.prototype.ra=function(){X(this.g,"a")},_n.prototype.qa=function(e){X(this.g,new wn(e))},_n.prototype.pa=function(e){X(this.g,new In)},_n.prototype.oa=function(){X(this.g,"b")},yn.prototype.createWebChannel=yn.prototype.g,vn.prototype.send=vn.prototype.o,vn.prototype.open=vn.prototype.m,vn.prototype.close=vn.prototype.close,gt=function(){return new yn},mt=function(){return me()},pt=fe,ft={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Se.NO_ERROR=0,Se.TIMEOUT=8,Se.HTTP_ERROR=6,dt=Se,Ce.COMPLETE="complete",ht=Ce,ue.EventType=le,le.OPEN="a",le.CLOSE="b",le.ERROR="c",le.MESSAGE="d",Y.prototype.listen=Y.prototype.J,lt=ue,Bt.prototype.listenOnce=Bt.prototype.K,Bt.prototype.getLastError=Bt.prototype.Ha,Bt.prototype.getLastErrorCode=Bt.prototype.ya,Bt.prototype.getStatus=Bt.prototype.ca,Bt.prototype.getResponseJson=Bt.prototype.La,Bt.prototype.getResponseText=Bt.prototype.la,Bt.prototype.send=Bt.prototype.ea,Bt.prototype.setWithCredentials=Bt.prototype.Fa,ut=Bt}).apply(void 0!==yt?yt:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});const vt="@firebase/firestore",wt="4.9.2";
/**
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
 */class It{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}It.UNAUTHENTICATED=new It(null),It.GOOGLE_CREDENTIALS=new It("google-credentials-uid"),It.FIRST_PARTY=new It("first-party-uid"),It.MOCK_USER=new It("mock-user");
/**
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
 */
let _t="12.3.0";
/**
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
 */const bt=new j("@firebase/firestore");function Tt(){return bt.logLevel}function Et(e,...t){if(bt.logLevel<=L.DEBUG){const n=t.map(At);bt.debug(`Firestore (${_t}): ${e}`,...n)}}function St(e,...t){if(bt.logLevel<=L.ERROR){const n=t.map(At);bt.error(`Firestore (${_t}): ${e}`,...n)}}function Ct(e,...t){if(bt.logLevel<=L.WARN){const n=t.map(At);bt.warn(`Firestore (${_t}): ${e}`,...n)}}function At(e){if("string"==typeof e)return e;try{
/**
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
    */
return t=e,JSON.stringify(t)}catch(n){return e}var t}
/**
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
 */function kt(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,Nt(e,r,n)}function Nt(e,t,n){let r=`FIRESTORE (${_t}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(s){r+=" CONTEXT: "+n}throw St(r),new Error(r)}function Dt(e,t,n,r){let s="Unexpected state";"string"==typeof n?s=n:r=n,e||Nt(t,s,r)}function xt(e,t){return e}
/**
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
 */const Rt={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Pt extends _{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
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
 */class Ot{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}
/**
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
 */class Mt{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Lt{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(It.UNAUTHENTICATED))}shutdown(){}}class Ft{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Vt{constructor(e){this.t=e,this.currentUser=It.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Dt(void 0===this.o,42304);let n=this.i;const r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve();let s=new Ot;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Ot,e.enqueueRetryable(()=>r(this.currentUser))};const i=()=>{const t=s;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},o=e=>{Et("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),i())};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){const e=this.t.getImmediate({optional:!0});e?o(e):(Et("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Ot)}},0),i()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(Et("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(Dt("string"==typeof t.accessToken,31837,{l:t}),new Mt(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Dt(null===e||"string"==typeof e,2055,{h:e}),new It(e)}}class Ut{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=It.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Bt{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Ut(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(It.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class qt{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class jt{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,ze(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Dt(void 0===this.o,3512);const n=e=>{null!=e.error&&Et("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);const n=e.token!==this.m;return this.m=e.token,Et("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};const r=e=>{Et("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){const e=this.V.getImmediate({optional:!0});e?r(e):Et("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new qt(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(Dt("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new qt(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
/**
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
 */
function zt(e){const t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}
/**
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
 */class $t{static newId(){const e=62*Math.floor(256/62);let t="";for(;t.length<20;){const n=zt(40);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function Gt(e,t){return e<t?-1:e>t?1:0}function Kt(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=e.charAt(r),s=t.charAt(r);if(n!==s)return Qt(n)===Qt(s)?Gt(n,s):Qt(n)?1:-1}return Gt(e.length,t.length)}const Ht=55296,Wt=57343;function Qt(e){const t=e.charCodeAt(0);return t>=Ht&&t<=Wt}function Jt(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}function Yt(e){return e+"\0"}
/**
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
 */const Xt="__name__";class Zt{constructor(e,t,n){void 0===t?t=0:t>e.length&&kt(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&kt(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===Zt.comparator(this,e)}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Zt?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=Zt.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return Gt(e.length,t.length)}static compareSegments(e,t){const n=Zt.isNumericId(e),r=Zt.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?Zt.extractNumericId(e).compare(Zt.extractNumericId(t)):Kt(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return ot.fromString(e.substring(4,e.length-2))}}class en extends Zt{construct(e,t,n){return new en(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new Pt(Rt.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new en(t)}static emptyPath(){return new en([])}}const tn=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class nn extends Zt{construct(e,t,n){return new nn(e,t,n)}static isValidIdentifier(e){return tn.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),nn.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===Xt}static keyField(){return new nn([Xt])}static fromServerFormat(e){const t=[];let n="",r=0;const s=()=>{if(0===n.length)throw new Pt(Rt.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let i=!1;for(;r<e.length;){const t=e[r];if("\\"===t){if(r+1===e.length)throw new Pt(Rt.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new Pt(Rt.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?(i=!i,r++):"."!==t||i?(n+=t,r++):(s(),r++)}if(s(),i)throw new Pt(Rt.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new nn(t)}static emptyPath(){return new nn([])}}
/**
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
 */class rn{constructor(e){this.path=e}static fromPath(e){return new rn(en.fromString(e))}static fromName(e){return new rn(en.fromString(e).popFirst(5))}static empty(){return new rn(en.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===en.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return en.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new rn(new en(e.slice()))}}
/**
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
 */function sn(e,t,n){if(!n)throw new Pt(Rt.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function on(e,t,n,r){if(!0===t&&!0===r)throw new Pt(Rt.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function an(e){if(!rn.isDocumentKey(e))throw new Pt(Rt.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function cn(e){if(rn.isDocumentKey(e))throw new Pt(Rt.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function un(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function ln(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{const n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}var t;return"function"==typeof e?"a function":kt(12329,{type:typeof e})}function hn(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new Pt(Rt.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=ln(e);throw new Pt(Rt.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}function dn(e,t){if(t<=0)throw new Pt(Rt.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)}
/**
 * @license
 * Copyright 2025 Google LLC
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
 */function fn(e,t){const n={typeString:e};return t&&(n.value=t),n}function pn(e,t){if(!un(e))throw new Pt(Rt.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in t)if(t[r]){const s=t[r].typeString,i="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}const o=e[r];if(s&&typeof o!==s){n=`JSON field '${r}' must be a ${s}.`;break}if(void 0!==i&&o!==i.value){n=`Expected '${r}' field to equal '${i.value}'`;break}}if(n)throw new Pt(Rt.INVALID_ARGUMENT,n);return!0}
/**
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
 */const mn=-62135596800,gn=1e6;class yn{static now(){return yn.fromMillis(Date.now())}static fromDate(e){return yn.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*gn);return new yn(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Pt(Rt.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Pt(Rt.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<mn)throw new Pt(Rt.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Pt(Rt.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/gn}_compareTo(e){return this.seconds===e.seconds?Gt(this.nanoseconds,e.nanoseconds):Gt(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:yn._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(pn(e,yn._jsonSchema))return new yn(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-mn;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}yn._jsonSchemaVersion="firestore/timestamp/1.0",yn._jsonSchema={type:fn("string",yn._jsonSchemaVersion),seconds:fn("number"),nanoseconds:fn("number")};
/**
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
 */
class vn{static fromTimestamp(e){return new vn(e)}static min(){return new vn(new yn(0,0))}static max(){return new vn(new yn(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
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
 */const wn=-1;class In{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function _n(e){return e.fields.find(e=>2===e.kind)}function bn(e){return e.fields.filter(e=>2!==e.kind)}function Tn(e,t){let n=Gt(e.collectionGroup,t.collectionGroup);if(0!==n)return n;for(let r=0;r<Math.min(e.fields.length,t.fields.length);++r)if(n=Sn(e.fields[r],t.fields[r]),0!==n)return n;return Gt(e.fields.length,t.fields.length)}In.UNKNOWN_ID=-1;class En{constructor(e,t){this.fieldPath=e,this.kind=t}}function Sn(e,t){const n=nn.comparator(e.fieldPath,t.fieldPath);return 0!==n?n:Gt(e.kind,t.kind)}class Cn{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Cn(0,Nn.min())}}function An(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,s=vn.fromTimestamp(1e9===r?new yn(n+1,0):new yn(n,r));return new Nn(s,rn.empty(),t)}function kn(e){return new Nn(e.readTime,e.key,wn)}class Nn{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Nn(vn.min(),rn.empty(),wn)}static max(){return new Nn(vn.max(),rn.empty(),wn)}}function Dn(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:(n=rn.comparator(e.documentKey,t.documentKey),0!==n?n:Gt(e.largestBatchId,t.largestBatchId)
/**
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
 */)}const xn="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Rn{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}
/**
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
 */async function Pn(e){if(e.code!==Rt.FAILED_PRECONDITION||e.message!==xn)throw e;Et("LocalStore","Unexpectedly lost primary lease")}
/**
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
 */class On{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&kt(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new On((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof On?t:On.resolve(t)}catch(t){return On.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):On.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):On.reject(t)}static resolve(e){return new On((t,n)=>{t(e)})}static reject(e){return new On((t,n)=>{n(e)})}static waitFor(e){return new On((t,n)=>{let r=0,s=0,i=!1;e.forEach(e=>{++r,e.next(()=>{++s,i&&s===r&&t()},e=>n(e))}),i=!0,s===r&&t()})}static or(e){let t=On.resolve(!1);for(const n of e)t=t.next(e=>e?On.resolve(e):n());return t}static forEach(e,t){const n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new On((n,r)=>{const s=e.length,i=new Array(s);let o=0;for(let a=0;a<s;a++){const c=a;t(e[c]).next(e=>{i[c]=e,++o,o===s&&n(i)},e=>r(e))}})}static doWhile(e,t){return new On((n,r)=>{const s=()=>{!0===e()?t().next(()=>{s()},r):n()};s()})}}
/**
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
 */const Mn="SimpleDb";class Ln{static open(e,t,n,r){try{return new Ln(t,e.transaction(r,n))}catch(s){throw new Bn(t,s)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new Ot,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Bn(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{const n=Gn(t.target.error);this.S.reject(new Bn(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(Et(Mn,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){const t=this.transaction.objectStore(e);return new jn(t)}}class Fn{static delete(e){return Et(Mn,"Removing database:",e),zn(i().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!I())return!1;if(Fn.F())return!0;const e=g(),t=Fn.M(e),n=0<t&&t<10,r=Vn(e),s=0<r&&r<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||s)}static F(){var e;return"undefined"!=typeof process&&"YES"===(null==(e=process.__PRIVATE_env)?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)}static O(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,12.2===Fn.M(g())&&St("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(Et(Mn,"Opening database:",this.name),this.db=await new Promise((t,n)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{const n=e.target.result;t(n)},r.onblocked=()=>{n(new Bn(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{const r=t.target.error;"VersionError"===r.name?n(new Pt(Rt.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new Pt(Rt.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new Bn(e,r))},r.onupgradeneeded=e=>{Et(Mn,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);const t=e.target.result;this.N.k(t,r.transaction,e.oldVersion,this.version).next(()=>{Et(Mn,"Database upgrade to version "+this.version+" complete")})}})),this.q&&(this.db.onversionchange=e=>this.q(e)),this.db}$(e){this.q=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,r){const s="readonly"===t;let i=0;for(;;){++i;try{this.db=await this.L(e);const t=Ln.open(this.db,e,s?"readonly":"readwrite",n),i=r(t).next(e=>(t.C(),e)).catch(e=>(t.abort(e),On.reject(e))).toPromise();return i.catch(()=>{}),await t.D,i}catch(o){const e=o,t="FirebaseError"!==e.name&&i<3;if(Et(Mn,"Transaction failed with error:",e.message,"Retrying:",t),this.close(),!t)return Promise.reject(e)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Vn(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class Un{constructor(e){this.U=e,this.K=!1,this.W=null}get isDone(){return this.K}get G(){return this.W}set cursor(e){this.U=e}done(){this.K=!0}j(e){this.W=e}delete(){return zn(this.U.delete())}}class Bn extends Pt{constructor(e,t){super(Rt.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function qn(e){return"IndexedDbTransactionError"===e.name}class jn{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(Et(Mn,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(Et(Mn,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),zn(n)}add(e){return Et(Mn,"ADD",this.store.name,e,e),zn(this.store.add(e))}get(e){return zn(this.store.get(e)).next(t=>(void 0===t&&(t=null),Et(Mn,"GET",this.store.name,e,t),t))}delete(e){return Et(Mn,"DELETE",this.store.name,e),zn(this.store.delete(e))}count(){return Et(Mn,"COUNT",this.store.name),zn(this.store.count())}J(e,t){const n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){const e=r.getAll(n.range);return new On((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{const e=this.cursor(n),t=[];return this.H(e,(e,n)=>{t.push(n)}).next(()=>t)}}Y(e,t){const n=this.store.getAll(e,null===t?void 0:t);return new On((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}})}Z(e,t){Et(Mn,"DELETE ALL",this.store.name);const n=this.options(e,t);n.X=!1;const r=this.cursor(n);return this.H(r,(e,t,n)=>n.delete())}ee(e,t){let n;t?n=e:(n={},t=e);const r=this.cursor(n);return this.H(r,t)}te(e){const t=this.cursor({});return new On((n,r)=>{t.onerror=e=>{const t=Gn(e.target.error);r(t)},t.onsuccess=t=>{const r=t.target.result;r?e(r.primaryKey,r.value).next(e=>{e?r.continue():n()}):n()}})}H(e,t){const n=[];return new On((r,s)=>{e.onerror=e=>{s(e.target.error)},e.onsuccess=e=>{const s=e.target.result;if(!s)return void r();const i=new Un(s),o=t(s.primaryKey,s.value,i);if(o instanceof On){const e=o.catch(e=>(i.done(),On.reject(e)));n.push(e)}i.isDone?r():null===i.G?s.continue():s.continue(i.G)}}).next(()=>On.waitFor(n))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.X?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function zn(e){return new On((t,n)=>{e.onsuccess=e=>{const n=e.target.result;t(n)},e.onerror=e=>{const t=Gn(e.target.error);n(t)}})}let $n=!1;function Gn(e){const t=Fn.M(g());if(t>=12.2&&t<13){const t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){const e=new Pt("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return $n||($n=!0,setTimeout(()=>{throw e},0)),e}}return e}const Kn="IndexBackfiller";class Hn{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}re(e){Et(Kn,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const e=await this.ne.ie();Et(Kn,`Documents written: ${e}`)}catch(e){qn(e)?Et(Kn,"Ignoring IndexedDB error during index backfill: ",e):await Pn(e)}await this.re(6e4)})}}class Wn{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.se(t,e))}se(e,t){const n=new Set;let r=t,s=!0;return On.doWhile(()=>!0===s&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!n.has(t))return Et(Kn,`Processing collection: ${t}`),this.oe(e,t,r).next(e=>{r-=e,n.add(t)});s=!1})).next(()=>t-r)}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next(n=>{const s=n.changes;return this.localStore.indexManager.updateIndexEntries(e,s).next(()=>this._e(r,n)).next(n=>(Et(Kn,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n))).next(()=>s.size)}))}_e(e,t){let n=e;return t.changes.forEach((e,t)=>{const r=kn(t);Dn(r,n)>0&&(n=r)}),new Nn(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}
/**
 * @license
 * Copyright 2018 Google LLC
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
 */class Qn{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ae(e),this.ue=e=>t.writeSequenceNumber(e))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Qn.ce=-1;
/**
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
 */
const Jn=-1;function Yn(e){return null==e}function Xn(e){return 0===e&&1/e==-1/0}function Zn(e){return"number"==typeof e&&Number.isInteger(e)&&!Xn(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}
/**
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
 */const er="";function tr(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t=rr(t)),t=nr(e.get(n),t);return rr(t)}function nr(e,t){let n=t;const r=e.length;for(let s=0;s<r;s++){const t=e.charAt(s);switch(t){case"\0":n+="";break;case er:n+="";break;default:n+=t}}return n}function rr(e){return e+er+""}function sr(e){const t=e.length;if(Dt(t>=2,64408,{path:e}),2===t)return Dt(e.charAt(0)===er&&""===e.charAt(1),56145,{path:e}),en.emptyPath();const n=t-2,r=[];let s="";for(let i=0;i<t;){const t=e.indexOf(er,i);switch((t<0||t>n)&&kt(50515,{path:e}),e.charAt(t+1)){case"":const n=e.substring(i,t);let o;0===s.length?o=n:(s+=n,o=s,s=""),r.push(o);break;case"":s+=e.substring(i,t),s+="\0";break;case"":s+=e.substring(i,t+1);break;default:kt(61167,{path:e})}i=t+2}return new en(r)}
/**
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
 */const ir="remoteDocuments",or="owner",ar="owner",cr="mutationQueues",ur="mutations",lr="batchId",hr="userMutationsIndex",dr=["userId","batchId"];
/**
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
 */function fr(e,t){return[e,tr(t)]}function pr(e,t,n){return[e,tr(t),n]}const mr={},gr="documentMutations",yr="remoteDocumentsV14",vr=["prefixPath","collectionGroup","readTime","documentId"],wr="documentKeyIndex",Ir=["prefixPath","collectionGroup","documentId"],_r="collectionGroupIndex",br=["collectionGroup","readTime","prefixPath","documentId"],Tr="remoteDocumentGlobal",Er="remoteDocumentGlobalKey",Sr="targets",Cr="queryTargetsIndex",Ar=["canonicalId","targetId"],kr="targetDocuments",Nr=["targetId","path"],Dr="documentTargetsIndex",xr=["path","targetId"],Rr="targetGlobalKey",Pr="targetGlobal",Or="collectionParents",Mr=["collectionId","parent"],Lr="clientMetadata",Fr="bundles",Vr="namedQueries",Ur="indexConfiguration",Br="collectionGroupIndex",qr="indexState",jr=["indexId","uid"],zr="sequenceNumberIndex",$r=["uid","sequenceNumber"],Gr="indexEntries",Kr=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Hr="documentKeyIndex",Wr=["indexId","uid","orderedDocumentKey"],Qr="documentOverlays",Jr=["userId","collectionPath","documentId"],Yr="collectionPathOverlayIndex",Xr=["userId","collectionPath","largestBatchId"],Zr="collectionGroupOverlayIndex",es=["userId","collectionGroup","largestBatchId"],ts="globals",ns=[cr,ur,gr,ir,Sr,or,Pr,kr,Lr,Tr,Or,Fr,Vr],rs=[...ns,Qr],ss=[cr,ur,gr,yr,Sr,or,Pr,kr,Lr,Tr,Or,Fr,Vr,Qr],is=ss,os=[...is,Ur,qr,Gr],as=os,cs=[...os,ts],us=cs;
/**
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
 */class ls extends Rn{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function hs(e,t){const n=xt(e);return Fn.O(n.le,t)}
/**
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
 */function ds(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function fs(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function ps(e,t){const n=[];for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.push(t(e[r],r,e));return n}function ms(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
/**
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
 */class gs{constructor(e,t){this.comparator=e,this.root=t||vs.EMPTY}insert(e,t){return new gs(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,vs.BLACK,null,null))}remove(e){return new gs(this.comparator,this.root.remove(e,this.comparator).copy(null,null,vs.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ys(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ys(this.root,e,this.comparator,!1)}getReverseIterator(){return new ys(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ys(this.root,e,this.comparator,!0)}}class ys{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&r&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(0===s){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class vs{constructor(e,t,n,r,s){this.key=e,this.value=t,this.color=null!=n?n:vs.RED,this.left=null!=r?r:vs.EMPTY,this.right=null!=s?s:vs.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,s){return new vs(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=s?s:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const s=n(e,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===s?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return vs.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return vs.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,vs.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,vs.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw kt(43730,{key:this.key,value:this.value});if(this.right.isRed())throw kt(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw kt(27949);return e+(this.isRed()?0:1)}}vs.EMPTY=null,vs.RED=!0,vs.BLACK=!1,vs.EMPTY=new class{constructor(){this.size=0}get key(){throw kt(57766)}get value(){throw kt(16141)}get color(){throw kt(16727)}get left(){throw kt(29726)}get right(){throw kt(36894)}copy(e,t,n,r,s){return this}insert(e,t,n){return new vs(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
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
 */
class ws{constructor(e){this.comparator=e,this.data=new gs(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Is(this.data.getIterator())}getIteratorFrom(e){return new Is(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof ws))return!1;if(this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new ws(this.comparator);return t.data=e,t}}class Is{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function _s(e){return e.hasNext()?e.getNext():void 0}
/**
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
 */class bs{constructor(e){this.fields=e,e.sort(nn.comparator)}static empty(){return new bs([])}unionWith(e){let t=new ws(nn.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new bs(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Jt(this.fields,e.fields,(e,t)=>e.isEqual(t))}}
/**
 * @license
 * Copyright 2023 Google LLC
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
 */class Ts extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
/**
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
 */
/**
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
 */
class Es{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(e){try{return atob(e)}catch(t){throw"undefined"!=typeof DOMException&&t instanceof DOMException?new Ts("Invalid base64 string: "+t):t}}(e);return new Es(t)}static fromUint8Array(e){const t=function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e);return new Es(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Gt(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Es.EMPTY_BYTE_STRING=new Es("");const Ss=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Cs(e){if(Dt(!!e,39018),"string"==typeof e){let t=0;const n=Ss.exec(e);if(Dt(!!n,46558,{timestamp:e}),n[1]){let e=n[1];e=(e+"000000000").substr(0,9),t=Number(e)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:As(e.seconds),nanos:As(e.nanos)}}function As(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function ks(e){return"string"==typeof e?Es.fromBase64String(e):Es.fromUint8Array(e)}
/**
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
 */const Ns="server_timestamp",Ds="__type__",xs="__previous_value__",Rs="__local_write_time__";function Ps(e){var t,n;return(null==(n=((null==(t=null==e?void 0:e.mapValue)?void 0:t.fields)||{})[Ds])?void 0:n.stringValue)===Ns}function Os(e){const t=e.mapValue.fields[xs];return Ps(t)?Os(t):t}function Ms(e){const t=Cs(e.mapValue.fields[Rs].timestampValue);return new yn(t.seconds,t.nanos)}
/**
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
 */class Ls{constructor(e,t,n,r,s,i,o,a,c,u){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=s,this.forceLongPolling=i,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c,this.isUsingEmulator=u}}const Fs="(default)";class Vs{constructor(e,t){this.projectId=e,this.database=t||Fs}static empty(){return new Vs("","")}get isDefaultDatabase(){return this.database===Fs}isEqual(e){return e instanceof Vs&&e.projectId===this.projectId&&e.database===this.database}}
/**
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
 */const Us="__type__",Bs="__max__",qs={mapValue:{fields:{__type__:{stringValue:Bs}}}},js="__vector__",zs="value",$s={nullValue:"NULL_VALUE"};function Gs(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Ps(e)?4:ci(e)?9007199254740991:oi(e)?10:11:kt(28295,{value:e})}function Ks(e,t){if(e===t)return!0;const n=Gs(e);if(n!==Gs(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return Ms(e).isEqual(Ms(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;const n=Cs(e.timestampValue),r=Cs(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return r=t,ks(e.bytesValue).isEqual(ks(r.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return As(e.geoPointValue.latitude)===As(t.geoPointValue.latitude)&&As(e.geoPointValue.longitude)===As(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return As(e.integerValue)===As(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){const n=As(e.doubleValue),r=As(t.doubleValue);return n===r?Xn(n)===Xn(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return Jt(e.arrayValue.values||[],t.arrayValue.values||[],Ks);case 10:case 11:return function(e,t){const n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(ds(n)!==ds(r))return!1;for(const s in n)if(n.hasOwnProperty(s)&&(void 0===r[s]||!Ks(n[s],r[s])))return!1;return!0}(e,t);default:return kt(52216,{left:e})}var r}function Hs(e,t){return void 0!==(e.values||[]).find(e=>Ks(e,t))}function Ws(e,t){if(e===t)return 0;const n=Gs(e),r=Gs(t);if(n!==r)return Gt(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return Gt(e.booleanValue,t.booleanValue);case 2:return function(e,t){const n=As(e.integerValue||e.doubleValue),r=As(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return Qs(e.timestampValue,t.timestampValue);case 4:return Qs(Ms(e),Ms(t));case 5:return Kt(e.stringValue,t.stringValue);case 6:return function(e,t){const n=ks(e),r=ks(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){const n=e.split("/"),r=t.split("/");for(let s=0;s<n.length&&s<r.length;s++){const e=Gt(n[s],r[s]);if(0!==e)return e}return Gt(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){const n=Gt(As(e.latitude),As(t.latitude));return 0!==n?n:Gt(As(e.longitude),As(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return Js(e.arrayValue,t.arrayValue);case 10:return function(e,t){var n,r,s,i;const o=e.fields||{},a=t.fields||{},c=null==(n=o[zs])?void 0:n.arrayValue,u=null==(r=a[zs])?void 0:r.arrayValue,l=Gt((null==(s=null==c?void 0:c.values)?void 0:s.length)||0,(null==(i=null==u?void 0:u.values)?void 0:i.length)||0);return 0!==l?l:Js(c,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===qs.mapValue&&t===qs.mapValue)return 0;if(e===qs.mapValue)return 1;if(t===qs.mapValue)return-1;const n=e.fields||{},r=Object.keys(n),s=t.fields||{},i=Object.keys(s);r.sort(),i.sort();for(let o=0;o<r.length&&o<i.length;++o){const e=Kt(r[o],i[o]);if(0!==e)return e;const t=Ws(n[r[o]],s[i[o]]);if(0!==t)return t}return Gt(r.length,i.length)}(e.mapValue,t.mapValue);default:throw kt(23264,{he:n})}}function Qs(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return Gt(e,t);const n=Cs(e),r=Cs(t),s=Gt(n.seconds,r.seconds);return 0!==s?s:Gt(n.nanos,r.nanos)}function Js(e,t){const n=e.values||[],r=t.values||[];for(let s=0;s<n.length&&s<r.length;++s){const e=Ws(n[s],r[s]);if(e)return e}return Gt(n.length,r.length)}function Ys(e){return Xs(e)}function Xs(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){const t=Cs(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?ks(e.bytesValue).toBase64():"referenceValue"in e?function(e){return rn.fromName(e).toString()}(e.referenceValue):"geoPointValue"in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):"arrayValue"in e?function(e){let t="[",n=!0;for(const r of e.values||[])n?n=!1:t+=",",t+=Xs(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){const t=Object.keys(e.fields||{}).sort();let n="{",r=!0;for(const s of t)r?r=!1:n+=",",n+=`${s}:${Xs(e.fields[s])}`;return n+"}"}(e.mapValue):kt(61005,{value:e})}function Zs(e){switch(Gs(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=Os(e);return t?16+Zs(t):16;case 5:return 2*e.stringValue.length;case 6:return ks(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return(e.arrayValue.values||[]).reduce((e,t)=>e+Zs(t),0);case 10:case 11:return function(e){let t=0;return fs(e.fields,(e,n)=>{t+=e.length+Zs(n)}),t}(e.mapValue);default:throw kt(13486,{value:e})}}function ei(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function ti(e){return!!e&&"integerValue"in e}function ni(e){return!!e&&"arrayValue"in e}function ri(e){return!!e&&"nullValue"in e}function si(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function ii(e){return!!e&&"mapValue"in e}function oi(e){var t,n;return(null==(n=((null==(t=null==e?void 0:e.mapValue)?void 0:t.fields)||{})[Us])?void 0:n.stringValue)===js}function ai(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:{...e.timestampValue}};if(e.mapValue){const t={mapValue:{fields:{}}};return fs(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=ai(n)),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=ai(e.arrayValue.values[n]);return t}return{...e}}function ci(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===Bs}const ui={mapValue:{fields:{[Us]:{stringValue:js},[zs]:{arrayValue:{}}}}};function li(e){return"nullValue"in e?$s:"booleanValue"in e?{booleanValue:!1}:"integerValue"in e||"doubleValue"in e?{doubleValue:NaN}:"timestampValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in e?{stringValue:""}:"bytesValue"in e?{bytesValue:""}:"referenceValue"in e?ei(Vs.empty(),rn.empty()):"geoPointValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in e?{arrayValue:{}}:"mapValue"in e?oi(e)?ui:{mapValue:{}}:kt(35942,{value:e})}function hi(e){return"nullValue"in e?{booleanValue:!1}:"booleanValue"in e?{doubleValue:NaN}:"integerValue"in e||"doubleValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in e?{stringValue:""}:"stringValue"in e?{bytesValue:""}:"bytesValue"in e?ei(Vs.empty(),rn.empty()):"referenceValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in e?{arrayValue:{}}:"arrayValue"in e?ui:"mapValue"in e?oi(e)?{mapValue:{}}:qs:kt(61959,{value:e})}function di(e,t){const n=Ws(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function fi(e,t){const n=Ws(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}
/**
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
 */class pi{constructor(e){this.value=e}static empty(){return new pi({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!ii(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ai(t)}setAll(e){let t=nn.emptyPath(),n={},r=[];e.forEach((e,s)=>{if(!t.isImmediateParentOf(s)){const e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=s.popLast()}e?n[s.lastSegment()]=ai(e):r.push(s.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,n,r)}delete(e){const t=this.field(e.popLast());ii(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ks(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];ii(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){fs(t,(t,n)=>e[t]=n);for(const r of n)delete e[r]}clone(){return new pi(ai(this.value))}}function mi(e){const t=[];return fs(e.fields,(e,n)=>{const r=new nn([e]);if(ii(n)){const e=mi(n.mapValue).fields;if(0===e.length)t.push(r);else for(const n of e)t.push(r.child(n))}else t.push(r)}),new bs(t)
/**
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
 */}class gi{constructor(e,t,n,r,s,i,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=s,this.data=i,this.documentState=o}static newInvalidDocument(e){return new gi(e,0,vn.min(),vn.min(),vn.min(),pi.empty(),0)}static newFoundDocument(e,t,n,r){return new gi(e,1,t,vn.min(),n,r,0)}static newNoDocument(e,t){return new gi(e,2,t,vn.min(),vn.min(),pi.empty(),0)}static newUnknownDocument(e,t){return new gi(e,3,t,vn.min(),vn.min(),pi.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(vn.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=pi.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=pi.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=vn.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof gi&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new gi(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
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
 */class yi{constructor(e,t){this.position=e,this.inclusive=t}}function vi(e,t,n){let r=0;for(let s=0;s<e.position.length;s++){const i=t[s],o=e.position[s];if(r=i.field.isKeyField()?rn.comparator(rn.fromName(o.referenceValue),n.key):Ws(o,n.data.field(i.field)),"desc"===i.dir&&(r*=-1),0!==r)break}return r}function wi(e,t){if(null===e)return null===t;if(null===t)return!1;if(e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!Ks(e.position[n],t.position[n]))return!1;return!0}
/**
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
 */class Ii{constructor(e,t="asc"){this.field=e,this.dir=t}}function _i(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
/**
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
 */class bi{}class Ti extends bi{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new Pi(e,t,n):"array-contains"===t?new Fi(e,n):"in"===t?new Vi(e,n):"not-in"===t?new Ui(e,n):"array-contains-any"===t?new Bi(e,n):new Ti(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new Oi(e,n):new Mi(e,n)}matches(e){const t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(Ws(t,this.value)):null!==t&&Gs(this.value)===Gs(t)&&this.matchesComparison(Ws(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return kt(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ei extends bi{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Ei(e,t)}matches(e){return Si(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.Pe||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Si(e){return"and"===e.op}function Ci(e){return"or"===e.op}function Ai(e){return ki(e)&&Si(e)}function ki(e){for(const t of e.filters)if(t instanceof Ei)return!1;return!0}function Ni(e){if(e instanceof Ti)return e.field.canonicalString()+e.op.toString()+Ys(e.value);if(Ai(e))return e.filters.map(e=>Ni(e)).join(",");{const t=e.filters.map(e=>Ni(e)).join(",");return`${e.op}(${t})`}}function Di(e,t){return e instanceof Ti?(n=e,(r=t)instanceof Ti&&n.op===r.op&&n.field.isEqual(r.field)&&Ks(n.value,r.value)):e instanceof Ei?function(e,t){return t instanceof Ei&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce((e,n,r)=>e&&Di(n,t.filters[r]),!0)}(e,t):void kt(19439);var n,r}function xi(e,t){const n=e.filters.concat(t);return Ei.create(n,e.op)}function Ri(e){return e instanceof Ti?`${(t=e).field.canonicalString()} ${t.op} ${Ys(t.value)}`:e instanceof Ei?function(e){return e.op.toString()+" {"+e.getFilters().map(Ri).join(" ,")+"}"}(e):"Filter";var t}class Pi extends Ti{constructor(e,t,n){super(e,t,n),this.key=rn.fromName(n.referenceValue)}matches(e){const t=rn.comparator(e.key,this.key);return this.matchesComparison(t)}}class Oi extends Ti{constructor(e,t){super(e,"in",t),this.keys=Li("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Mi extends Ti{constructor(e,t){super(e,"not-in",t),this.keys=Li("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Li(e,t){var n;return((null==(n=t.arrayValue)?void 0:n.values)||[]).map(e=>rn.fromName(e.referenceValue))}class Fi extends Ti{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ni(t)&&Hs(t.arrayValue,this.value)}}class Vi extends Ti{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return null!==t&&Hs(this.value.arrayValue,t)}}class Ui extends Ti{constructor(e,t){super(e,"not-in",t)}matches(e){if(Hs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!Hs(this.value.arrayValue,t)}}class Bi extends Ti{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ni(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>Hs(this.value.arrayValue,e))}}
/**
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
 */class qi{constructor(e,t=null,n=[],r=[],s=null,i=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=s,this.startAt=i,this.endAt=o,this.Te=null}}function ji(e,t=null,n=[],r=[],s=null,i=null,o=null){return new qi(e,t,n,r,s,i,o)}function zi(e){const t=xt(e);if(null===t.Te){let e=t.path.canonicalString();null!==t.collectionGroup&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(e=>Ni(e)).join(","),e+="|ob:",e+=t.orderBy.map(e=>{return(t=e).field.canonicalString()+t.dir;var t}).join(","),Yn(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(e=>Ys(e)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(e=>Ys(e)).join(",")),t.Te=e}return t.Te}function $i(e,t){if(e.limit!==t.limit)return!1;if(e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!_i(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!Di(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!wi(e.startAt,t.startAt)&&wi(e.endAt,t.endAt)}function Gi(e){return rn.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function Ki(e,t){return e.filters.filter(e=>e instanceof Ti&&e.field.isEqual(t))}function Hi(e,t,n){let r=$s,s=!0;for(const i of Ki(e,t)){let e=$s,t=!0;switch(i.op){case"<":case"<=":e=li(i.value);break;case"==":case"in":case">=":e=i.value;break;case">":e=i.value,t=!1;break;case"!=":case"not-in":e=$s}di({value:r,inclusive:s},{value:e,inclusive:t})<0&&(r=e,s=t)}if(null!==n)for(let i=0;i<e.orderBy.length;++i)if(e.orderBy[i].field.isEqual(t)){const e=n.position[i];di({value:r,inclusive:s},{value:e,inclusive:n.inclusive})<0&&(r=e,s=n.inclusive);break}return{value:r,inclusive:s}}function Wi(e,t,n){let r=qs,s=!0;for(const i of Ki(e,t)){let e=qs,t=!0;switch(i.op){case">=":case">":e=hi(i.value),t=!1;break;case"==":case"in":case"<=":e=i.value;break;case"<":e=i.value,t=!1;break;case"!=":case"not-in":e=qs}fi({value:r,inclusive:s},{value:e,inclusive:t})>0&&(r=e,s=t)}if(null!==n)for(let i=0;i<e.orderBy.length;++i)if(e.orderBy[i].field.isEqual(t)){const e=n.position[i];fi({value:r,inclusive:s},{value:e,inclusive:n.inclusive})>0&&(r=e,s=n.inclusive);break}return{value:r,inclusive:s}}
/**
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
 */class Qi{constructor(e,t=null,n=[],r=[],s=null,i="F",o=null,a=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=s,this.limitType=i,this.startAt=o,this.endAt=a,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Ji(e,t,n,r,s,i,o,a){return new Qi(e,t,n,r,s,i,o,a)}function Yi(e){return new Qi(e)}function Xi(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function Zi(e){return null!==e.collectionGroup}function eo(e){const t=xt(e);if(null===t.Ie){t.Ie=[];const e=new Set;for(const r of t.explicitOrderBy)t.Ie.push(r),e.add(r.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(e){let t=new ws(nn.comparator);return e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t})(t).forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.Ie.push(new Ii(r,n))}),e.has(nn.keyField().canonicalString())||t.Ie.push(new Ii(nn.keyField(),n))}return t.Ie}function to(e){const t=xt(e);return t.Ee||(t.Ee=ro(t,eo(e))),t.Ee}function no(e){const t=xt(e);return t.de||(t.de=ro(t,e.explicitOrderBy)),t.de}function ro(e,t){if("F"===e.limitType)return ji(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{const t="desc"===e.dir?"asc":"desc";return new Ii(e.field,t)});const n=e.endAt?new yi(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new yi(e.startAt.position,e.startAt.inclusive):null;return ji(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function so(e,t){const n=e.filters.concat([t]);return new Qi(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function io(e,t,n){return new Qi(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function oo(e,t){return $i(to(e),to(t))&&e.limitType===t.limitType}function ao(e){return`${zi(to(e))}|lt:${e.limitType}`}function co(e){return`Query(target=${function(e){let t=e.path.canonicalString();return null!==e.collectionGroup&&(t+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map(e=>Ri(e)).join(", ")}]`),Yn(e.limit)||(t+=", limit: "+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map(e=>{return`${(t=e).field.canonicalString()} (${t.dir})`;var t}).join(", ")}]`),e.startAt&&(t+=", startAt: ",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(e=>Ys(e)).join(",")),e.endAt&&(t+=", endAt: ",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(e=>Ys(e)).join(",")),`Target(${t})`}(to(e))}; limitType=${e.limitType})`}function uo(e,t){return t.isFoundDocument()&&function(e,t){const n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):rn.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(const n of eo(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(const n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(r=t,!((n=e).startAt&&!function(e,t,n){const r=vi(e,t,n);return e.inclusive?r<=0:r<0}(n.startAt,eo(n),r)||n.endAt&&!function(e,t,n){const r=vi(e,t,n);return e.inclusive?r>=0:r>0}(n.endAt,eo(n),r)));var n,r}function lo(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function ho(e){return(t,n)=>{let r=!1;for(const s of eo(e)){const e=fo(s,t,n);if(0!==e)return e;r=r||s.field.isKeyField()}return 0}}function fo(e,t,n){const r=e.field.isKeyField()?rn.comparator(t.key,n.key):function(e,t,n){const r=t.data.field(e),s=n.data.field(e);return null!==r&&null!==s?Ws(r,s):kt(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return kt(19790,{direction:e.dir})}}
/**
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
 */class po{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n)for(const[r,s]of n)if(this.equalsFn(r,e))return s}has(e){return void 0!==this.get(e)}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return void(r[s]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){fs(this.inner,(t,n)=>{for(const[r,s]of n)e(r,s)})}isEmpty(){return ms(this.inner)}size(){return this.innerSize}}
/**
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
 */const mo=new gs(rn.comparator);function go(){return mo}const yo=new gs(rn.comparator);function vo(...e){let t=yo;for(const n of e)t=t.insert(n.key,n);return t}function wo(e){let t=yo;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function Io(){return bo()}function _o(){return bo()}function bo(){return new po(e=>e.toString(),(e,t)=>e.isEqual(t))}const To=new gs(rn.comparator),Eo=new ws(rn.comparator);function So(...e){let t=Eo;for(const n of e)t=t.add(n);return t}const Co=new ws(Gt);function Ao(){return Co}
/**
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
 */function ko(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Xn(t)?"-0":t}}function No(e){return{integerValue:""+e}}function Do(e,t){return Zn(t)?No(t):ko(e,t)}
/**
 * @license
 * Copyright 2018 Google LLC
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
 */class xo{constructor(){this._=void 0}}function Ro(e,t,n){return e instanceof Mo?function(e,t){const n={fields:{[Ds]:{stringValue:Ns},[Rs]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&Ps(t)&&(t=Os(t)),t&&(n.fields[xs]=t),{mapValue:n}}(n,t):e instanceof Lo?Fo(e,t):e instanceof Vo?Uo(e,t):function(e,t){const n=Oo(e,t),r=qo(n)+qo(e.Ae);return ti(n)&&ti(e.Ae)?No(r):ko(e.serializer,r)}(e,t)}function Po(e,t,n){return e instanceof Lo?Fo(e,t):e instanceof Vo?Uo(e,t):n}function Oo(e,t){return e instanceof Bo?ti(n=t)||(r=n)&&"doubleValue"in r?t:{integerValue:0}:null;var n,r}class Mo extends xo{}class Lo extends xo{constructor(e){super(),this.elements=e}}function Fo(e,t){const n=jo(t);for(const r of e.elements)n.some(e=>Ks(e,r))||n.push(r);return{arrayValue:{values:n}}}class Vo extends xo{constructor(e){super(),this.elements=e}}function Uo(e,t){let n=jo(t);for(const r of e.elements)n=n.filter(e=>!Ks(e,r));return{arrayValue:{values:n}}}class Bo extends xo{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function qo(e){return As(e.integerValue||e.doubleValue)}function jo(e){return ni(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
/**
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
 */class zo{constructor(e,t){this.field=e,this.transform=t}}class $o{constructor(e,t){this.version=e,this.transformResults=t}}class Go{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Go}static exists(e){return new Go(void 0,e)}static updateTime(e){return new Go(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Ko(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class Ho{}function Wo(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new sa(e.key,Go.none()):new Zo(e.key,e.data,Go.none());{const n=e.data,r=pi.empty();let s=new ws(nn.comparator);for(let e of t.fields)if(!s.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),s=s.add(e)}return new ea(e.key,r,new bs(s.toArray()),Go.none())}}function Qo(e,t,n){var r;e instanceof Zo?function(e,t,n){const r=e.value.clone(),s=na(e.fieldTransforms,t,n.transformResults);r.setAll(s),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof ea?function(e,t,n){if(!Ko(e.precondition,t))return void t.convertToUnknownDocument(n.version);const r=na(e.fieldTransforms,t,n.transformResults),s=t.data;s.setAll(ta(e)),s.setAll(r),t.convertToFoundDocument(n.version,s).setHasCommittedMutations()}(e,t,n):(r=n,t.convertToNoDocument(r.version).setHasCommittedMutations())}function Jo(e,t,n,r){return e instanceof Zo?function(e,t,n,r){if(!Ko(e.precondition,t))return n;const s=e.value.clone(),i=ra(e.fieldTransforms,r,t);return s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null}(e,t,n,r):e instanceof ea?function(e,t,n,r){if(!Ko(e.precondition,t))return n;const s=ra(e.fieldTransforms,r,t),i=t.data;return i.setAll(ta(e)),i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null===n?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):(s=t,i=n,Ko(e.precondition,s)?(s.convertToNoDocument(s.version).setHasLocalMutations(),null):i);var s,i}function Yo(e,t){let n=null;for(const r of e.fieldTransforms){const e=t.data.field(r.field),s=Oo(r.transform,e||null);null!=s&&(null===n&&(n=pi.empty()),n.set(r.field,s))}return n||null}function Xo(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||n&&r&&Jt(n,r,(e,t)=>function(e,t){return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof Lo&&r instanceof Lo||n instanceof Vo&&r instanceof Vo?Jt(n.elements,r.elements,Ks):n instanceof Bo&&r instanceof Bo?Ks(n.Ae,r.Ae):n instanceof Mo&&r instanceof Mo);var n,r}(e,t)))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask)));var n,r}class Zo extends Ho{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class ea extends Ho{constructor(e,t,n,r,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function ta(e){const t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}}),t}function na(e,t,n){const r=new Map;Dt(e.length===n.length,32656,{Re:n.length,Ve:e.length});for(let s=0;s<n.length;s++){const i=e[s],o=i.transform,a=t.data.field(i.field);r.set(i.field,Po(o,a,n[s]))}return r}function ra(e,t,n){const r=new Map;for(const s of e){const e=s.transform,i=n.data.field(s.field);r.set(s.field,Ro(e,i,t))}return r}class sa extends Ho{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class ia extends Ho{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
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
 */class oa{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const t=this.mutations[r];t.key.isEqual(e.key)&&Qo(t,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Jo(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Jo(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=_o();return this.mutations.forEach(r=>{const s=e.get(r.key),i=s.overlayedDocument;let o=this.applyToLocalView(i,s.mutatedFields);o=t.has(r.key)?null:o;const a=Wo(i,o);null!==a&&n.set(r.key,a),i.isValidDocument()||i.convertToNoDocument(vn.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),So())}isEqual(e){return this.batchId===e.batchId&&Jt(this.mutations,e.mutations,(e,t)=>Xo(e,t))&&Jt(this.baseMutations,e.baseMutations,(e,t)=>Xo(e,t))}}class aa{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){Dt(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let r=To;const s=e.mutations;for(let i=0;i<s.length;i++)r=r.insert(s[i].key,n[i].version);return new aa(e,t,n,r)}}
/**
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
 */class ca{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
/**
 * @license
 * Copyright 2023 Google LLC
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
 */class ua{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}
/**
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
 */class la{constructor(e,t){this.count=e,this.unchangedNames=t}}
/**
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
 */var ha,da;function fa(e){switch(e){case Rt.OK:return kt(64938);case Rt.CANCELLED:case Rt.UNKNOWN:case Rt.DEADLINE_EXCEEDED:case Rt.RESOURCE_EXHAUSTED:case Rt.INTERNAL:case Rt.UNAVAILABLE:case Rt.UNAUTHENTICATED:return!1;case Rt.INVALID_ARGUMENT:case Rt.NOT_FOUND:case Rt.ALREADY_EXISTS:case Rt.PERMISSION_DENIED:case Rt.FAILED_PRECONDITION:case Rt.ABORTED:case Rt.OUT_OF_RANGE:case Rt.UNIMPLEMENTED:case Rt.DATA_LOSS:return!0;default:return kt(15467,{code:e})}}function pa(e){if(void 0===e)return St("GRPC error has no .code"),Rt.UNKNOWN;switch(e){case ha.OK:return Rt.OK;case ha.CANCELLED:return Rt.CANCELLED;case ha.UNKNOWN:return Rt.UNKNOWN;case ha.DEADLINE_EXCEEDED:return Rt.DEADLINE_EXCEEDED;case ha.RESOURCE_EXHAUSTED:return Rt.RESOURCE_EXHAUSTED;case ha.INTERNAL:return Rt.INTERNAL;case ha.UNAVAILABLE:return Rt.UNAVAILABLE;case ha.UNAUTHENTICATED:return Rt.UNAUTHENTICATED;case ha.INVALID_ARGUMENT:return Rt.INVALID_ARGUMENT;case ha.NOT_FOUND:return Rt.NOT_FOUND;case ha.ALREADY_EXISTS:return Rt.ALREADY_EXISTS;case ha.PERMISSION_DENIED:return Rt.PERMISSION_DENIED;case ha.FAILED_PRECONDITION:return Rt.FAILED_PRECONDITION;case ha.ABORTED:return Rt.ABORTED;case ha.OUT_OF_RANGE:return Rt.OUT_OF_RANGE;case ha.UNIMPLEMENTED:return Rt.UNIMPLEMENTED;case ha.DATA_LOSS:return Rt.DATA_LOSS;default:return kt(39323,{code:e})}}(da=ha||(ha={}))[da.OK=0]="OK",da[da.CANCELLED=1]="CANCELLED",da[da.UNKNOWN=2]="UNKNOWN",da[da.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",da[da.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",da[da.NOT_FOUND=5]="NOT_FOUND",da[da.ALREADY_EXISTS=6]="ALREADY_EXISTS",da[da.PERMISSION_DENIED=7]="PERMISSION_DENIED",da[da.UNAUTHENTICATED=16]="UNAUTHENTICATED",da[da.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",da[da.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",da[da.ABORTED=10]="ABORTED",da[da.OUT_OF_RANGE=11]="OUT_OF_RANGE",da[da.UNIMPLEMENTED=12]="UNIMPLEMENTED",da[da.INTERNAL=13]="INTERNAL",da[da.UNAVAILABLE=14]="UNAVAILABLE",da[da.DATA_LOSS=15]="DATA_LOSS";
/**
 * @license
 * Copyright 2023 Google LLC
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
 */
let ma=null;
/**
 * @license
 * Copyright 2023 Google LLC
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
 */function ga(){return new TextEncoder}
/**
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
 */const ya=new ot([4294967295,4294967295],0);function va(e){const t=ga().encode(e),n=new at;return n.update(t),new Uint8Array(n.digest())}function wa(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new ot([n,r],0),new ot([s,i],0)]}class Ia{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new _a(`Invalid padding: ${t}`);if(n<0)throw new _a(`Invalid hash count: ${n}`);if(e.length>0&&0===this.hashCount)throw new _a(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new _a(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=ot.fromNumber(this.ge)}ye(e,t,n){let r=e.add(t.multiply(ot.fromNumber(n)));return 1===r.compare(ya)&&(r=new ot([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.ge)return!1;const t=va(e),[n,r]=wa(t);for(let s=0;s<this.hashCount;s++){const e=this.ye(n,r,s);if(!this.we(e))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),i=new Ia(s,r,t);return n.forEach(e=>i.insert(e)),i}insert(e){if(0===this.ge)return;const t=va(e),[n,r]=wa(t);for(let s=0;s<this.hashCount;s++){const e=this.ye(n,r,s);this.Se(e)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class _a extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
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
 */class ba{constructor(e,t,n,r,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,Ta.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new ba(vn.min(),r,new gs(Gt),go(),So())}}class Ta{constructor(e,t,n,r,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Ta(n,t,So(),So(),So())}}
/**
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
 */class Ea{constructor(e,t,n,r){this.be=e,this.removedTargetIds=t,this.key=n,this.De=r}}class Sa{constructor(e,t){this.targetId=e,this.Ce=t}}class Ca{constructor(e,t,n=Es.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class Aa{constructor(){this.ve=0,this.Fe=Da(),this.Me=Es.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return 0!==this.ve}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=So(),t=So(),n=So();return this.Fe.forEach((r,s)=>{switch(s){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:kt(38017,{changeType:s})}}),new Ta(this.Me,this.xe,e,t,n)}qe(){this.Oe=!1,this.Fe=Da()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,Dt(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class ka{constructor(e){this.Ge=e,this.ze=new Map,this.je=go(),this.Je=Na(),this.He=Na(),this.Ye=new gs(Gt)}Ze(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(e.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.We(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:kt(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((e,n)=>{this.rt(n)&&t(n)})}st(e){const t=e.targetId,n=e.Ce.count,r=this.ot(t);if(r){const s=r.target;if(Gi(s))if(0===n){const e=new rn(s.path);this.et(t,e,gi.newNoDocument(e,vn.min()))}else Dt(1===n,20013,{expectedCount:n});else{const r=this._t(t);if(r!==n){const n=this.ut(e),s=n?this.ct(n,e,r):1;if(0!==s){this.it(t);const e=2===s?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(t,e)}null==ma||ma.lt(function(e,t,n,r,s){var i,o,a;const c={localCacheCount:e,existenceFilterCount:t.count,databaseId:n.database,projectId:n.projectId},u=t.unchangedNames;return u&&(c.bloomFilter={applied:0===s,hashCount:(null==u?void 0:u.hashCount)??0,bitmapLength:(null==(o=null==(i=null==u?void 0:u.bits)?void 0:i.bitmap)?void 0:o.length)??0,padding:(null==(a=null==u?void 0:u.bits)?void 0:a.padding)??0,mightContain:e=>(null==r?void 0:r.mightContain(e))??!1}),c}(r,e.Ce,this.Ge.ht(),n,s))}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:s=0}=t;let i,o;try{i=ks(n).toUint8Array()}catch(a){if(a instanceof Ts)return Ct("Decoding the base64 bloom filter in existence filter failed ("+a.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw a}try{o=new Ia(i,r,s)}catch(a){return Ct(a instanceof _a?"BloomFilter error: ":"Applying bloom filter failed: ",a),null}return 0===o.ge?null:o}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let r=0;return n.forEach(n=>{const s=this.Ge.ht(),i=`projects/${s.projectId}/databases/${s.database}/documents/${n.path.canonicalString()}`;e.mightContain(i)||(this.et(t,n,null),r++)}),r}Tt(e){const t=new Map;this.ze.forEach((n,r)=>{const s=this.ot(r);if(s){if(n.current&&Gi(s.target)){const t=new rn(s.target.path);this.It(t).has(r)||this.Et(r,t)||this.et(r,t,gi.newNoDocument(t,e))}n.Be&&(t.set(r,n.ke()),n.qe())}});let n=So();this.He.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{const t=this.ot(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.je.forEach((t,n)=>n.setReadTime(e));const r=new ba(e,t,this.Ye,this.je,n);return this.je=go(),this.Je=Na(),this.He=Na(),this.Ye=new gs(Gt),r}Xe(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const r=this.nt(e);this.Et(e,t)?r.Qe(t,1):r.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new Aa,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new ws(Gt),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new ws(Gt),this.Je=this.Je.insert(e,t)),t}rt(e){const t=null!==this.ot(e);return t||Et("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Aa),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Na(){return new gs(rn.comparator)}function Da(){return new gs(rn.comparator)}const xa={asc:"ASCENDING",desc:"DESCENDING"},Ra={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Pa={and:"AND",or:"OR"};class Oa{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ma(e,t){return e.useProto3Json||Yn(t)?t:{value:t}}function La(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Fa(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Va(e,t){return La(e,t.toTimestamp())}function Ua(e){return Dt(!!e,49232),vn.fromTimestamp(function(e){const t=Cs(e);return new yn(t.seconds,t.nanos)}(e))}function Ba(e,t){return qa(e,t).canonicalString()}function qa(e,t){const n=(r=e,new en(["projects",r.projectId,"databases",r.database])).child("documents");var r;return void 0===t?n:n.child(t)}function ja(e){const t=en.fromString(e);return Dt(hc(t),10190,{key:t.toString()}),t}function za(e,t){return Ba(e.databaseId,t.path)}function $a(e,t){const n=ja(t);if(n.get(1)!==e.databaseId.projectId)throw new Pt(Rt.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new Pt(Rt.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new rn(Wa(n))}function Ga(e,t){return Ba(e.databaseId,t)}function Ka(e){const t=ja(e);return 4===t.length?en.emptyPath():Wa(t)}function Ha(e){return new en(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function Wa(e){return Dt(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function Qa(e,t,n){return{name:za(e,t),fields:n.value.mapValue.fields}}function Ja(e,t,n){const r=$a(e,t.name),s=Ua(t.updateTime),i=t.createTime?Ua(t.createTime):vn.min(),o=new pi({mapValue:{fields:t.fields}}),a=gi.newFoundDocument(r,s,i,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}function Ya(e,t){let n;if(t instanceof Zo)n={update:Qa(e,t.key,t.value)};else if(t instanceof sa)n={delete:za(e,t.key)};else if(t instanceof ea)n={update:Qa(e,t.key,t.data),updateMask:lc(t.fieldMask)};else{if(!(t instanceof ia))return kt(16599,{Vt:t.type});n={verify:za(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>function(e,t){const n=t.transform;if(n instanceof Mo)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof Lo)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof Vo)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof Bo)return{fieldPath:t.field.canonicalString(),increment:n.Ae};throw kt(20930,{transform:t.transform})}(0,e))),t.precondition.isNone||(n.currentDocument=(r=e,void 0!==(s=t.precondition).updateTime?{updateTime:Va(r,s.updateTime)}:void 0!==s.exists?{exists:s.exists}:kt(27497))),n;var r,s}function Xa(e,t){const n=t.currentDocument?void 0!==(s=t.currentDocument).updateTime?Go.updateTime(Ua(s.updateTime)):void 0!==s.exists?Go.exists(s.exists):Go.none():Go.none(),r=t.updateTransforms?t.updateTransforms.map(t=>function(e,t){let n=null;if("setToServerValue"in t)Dt("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new Mo;else if("appendMissingElements"in t){const e=t.appendMissingElements.values||[];n=new Lo(e)}else if("removeAllFromArray"in t){const e=t.removeAllFromArray.values||[];n=new Vo(e)}else"increment"in t?n=new Bo(e,t.increment):kt(16584,{proto:t});const r=nn.fromServerFormat(t.fieldPath);return new zo(r,n)}(e,t)):[];var s;if(t.update){t.update.name;const s=$a(e,t.update.name),i=new pi({mapValue:{fields:t.update.fields}});if(t.updateMask){const e=function(e){const t=e.fieldPaths||[];return new bs(t.map(e=>nn.fromServerFormat(e)))}(t.updateMask);return new ea(s,i,e,n,r)}return new Zo(s,i,n,r)}if(t.delete){const r=$a(e,t.delete);return new sa(r,n)}if(t.verify){const r=$a(e,t.verify);return new ia(r,n)}return kt(1463,{proto:t})}function Za(e,t){return{documents:[Ga(e,t.path)]}}function ec(e,t){const n={structuredQuery:{}},r=t.path;let s;null!==t.collectionGroup?(s=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Ga(e,s);const i=function(e){if(0!==e.length)return uc(Ei.create(e,"and"))}(t.filters);i&&(n.structuredQuery.where=i);const o=function(e){if(0!==e.length)return e.map(e=>{return{field:ac((t=e).field),direction:sc(t.dir)};var t})}(t.orderBy);o&&(n.structuredQuery.orderBy=o);const a=Ma(e,t.limit);return null!==a&&(n.structuredQuery.limit=a),t.startAt&&(n.structuredQuery.startAt={before:(c=t.startAt).inclusive,values:c.position}),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{ft:n,parent:s};var c}function tc(e,t,n,r){const{ft:s,parent:i}=ec(e,t),o={},a=[];let c=0;return n.forEach(e=>{const t=r?e.alias:"aggregate_"+c++;o[t]=e.alias,"count"===e.aggregateType?a.push({alias:t,count:{}}):"avg"===e.aggregateType?a.push({alias:t,avg:{field:ac(e.fieldPath)}}):"sum"===e.aggregateType&&a.push({alias:t,sum:{field:ac(e.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:a,structuredQuery:s.structuredQuery},parent:s.parent},gt:o,parent:i}}function nc(e){let t=Ka(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){Dt(1===r,65062);const e=n.from[0];e.allDescendants?s=e.collectionId:t=t.child(e.collectionId)}let i=[];n.where&&(i=function(e){const t=rc(e);return t instanceof Ei&&Ai(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=n.orderBy.map(e=>{return new Ii(cc((t=e).field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(t.direction));var t}));let a=null;n.limit&&(a=function(e){let t;return t="object"==typeof e?e.value:e,Yn(t)?null:t}(n.limit));let c=null;n.startAt&&(c=function(e){const t=!!e.before,n=e.values||[];return new yi(n,t)}(n.startAt));let u=null;return n.endAt&&(u=function(e){const t=!e.before,n=e.values||[];return new yi(n,t)}(n.endAt)),Ji(t,s,o,i,a,"F",c,u)}function rc(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":const t=cc(e.unaryFilter.field);return Ti.create(t,"==",{doubleValue:NaN});case"IS_NULL":const n=cc(e.unaryFilter.field);return Ti.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=cc(e.unaryFilter.field);return Ti.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const s=cc(e.unaryFilter.field);return Ti.create(s,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return kt(61313);default:return kt(60726)}}(e):void 0!==e.fieldFilter?(t=e,Ti.create(cc(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return kt(58110);default:return kt(50506)}}(t.fieldFilter.op),t.fieldFilter.value)):void 0!==e.compositeFilter?function(e){return Ei.create(e.compositeFilter.filters.map(e=>rc(e)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return kt(1026)}}(e.compositeFilter.op))}(e):kt(30097,{filter:e});var t}function sc(e){return xa[e]}function ic(e){return Ra[e]}function oc(e){return Pa[e]}function ac(e){return{fieldPath:e.canonicalString()}}function cc(e){return nn.fromServerFormat(e.fieldPath)}function uc(e){return e instanceof Ti?function(e){if("=="===e.op){if(si(e.value))return{unaryFilter:{field:ac(e.field),op:"IS_NAN"}};if(ri(e.value))return{unaryFilter:{field:ac(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(si(e.value))return{unaryFilter:{field:ac(e.field),op:"IS_NOT_NAN"}};if(ri(e.value))return{unaryFilter:{field:ac(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ac(e.field),op:ic(e.op),value:e.value}}}(e):e instanceof Ei?function(e){const t=e.getFilters().map(e=>uc(e));return 1===t.length?t[0]:{compositeFilter:{op:oc(e.op),filters:t}}}(e):kt(54877,{filter:e})}function lc(e){const t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function hc(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}
/**
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
 */class dc{constructor(e,t,n,r,s=vn.min(),i=vn.min(),o=Es.EMPTY_BYTE_STRING,a=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=i,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(e){return new dc(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new dc(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new dc(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new dc(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}
/**
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
 */class fc{constructor(e){this.yt=e}}function pc(e,t){const n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:mc(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())r.document={name:za(s=e.yt,(i=t).key),fields:i.data.value.mapValue.fields,updateTime:La(s,i.version.toTimestamp()),createTime:La(s,i.createTime.toTimestamp())};else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:gc(t.version)};else{if(!t.isUnknownDocument())return kt(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:gc(t.version)}}var s,i;return r}function mc(e){const t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function gc(e){const t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function yc(e){const t=new yn(e.seconds,e.nanoseconds);return vn.fromTimestamp(t)}function vc(e,t){const n=(t.baseMutations||[]).map(t=>Xa(e.yt,t));for(let i=0;i<t.mutations.length-1;++i){const e=t.mutations[i];if(i+1<t.mutations.length&&void 0!==t.mutations[i+1].transform){const n=t.mutations[i+1];e.updateTransforms=n.transform.fieldTransforms,t.mutations.splice(i+1,1),++i}}const r=t.mutations.map(t=>Xa(e.yt,t)),s=yn.fromMillis(t.localWriteTimeMs);return new oa(t.batchId,s,n,r)}function wc(e){const t=yc(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?yc(e.lastLimboFreeSnapshotVersion):vn.min();let r;return r=void 0!==e.query.documents?function(e){const t=e.documents.length;return Dt(1===t,1966,{count:t}),to(Yi(Ka(e.documents[0])))}(e.query):function(e){return to(nc(e))}(e.query),new dc(r,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,Es.fromBase64String(e.resumeToken))}function Ic(e,t){const n=gc(t.snapshotVersion),r=gc(t.lastLimboFreeSnapshotVersion);let s;s=Gi(t.target)?Za(e.yt,t.target):ec(e.yt,t.target).ft;const i=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:zi(t.target),readTime:n,resumeToken:i,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:s}}function _c(e){const t=nc({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?io(t,t.limit,"L"):t}function bc(e,t){return new ca(t.largestBatchId,Xa(e.yt,t.overlayMutation))}function Tc(e,t){const n=t.path.lastSegment();return[e,tr(t.path.popLast()),n]}function Ec(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:gc(r.readTime),documentKey:tr(r.documentKey.path),largestBatchId:r.largestBatchId}}
/**
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
 */class Sc{getBundleMetadata(e,t){return Cc(e).get(t).next(e=>{if(e)return{id:(t=e).bundleId,createTime:yc(t.createTime),version:t.version};var t})}saveBundleMetadata(e,t){return Cc(e).put({bundleId:(n=t).id,createTime:gc(Ua(n.createTime)),version:n.version});var n}getNamedQuery(e,t){return Ac(e).get(t).next(e=>{if(e)return{name:(t=e).name,query:_c(t.bundledQuery),readTime:yc(t.readTime)};var t})}saveNamedQuery(e,t){return Ac(e).put({name:(n=t).name,readTime:gc(Ua(n.readTime)),bundledQuery:n.bundledQuery});var n}}function Cc(e){return hs(e,Fr)}function Ac(e){return hs(e,Vr)}
/**
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
 */class kc{constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){const n=t.uid||"";return new kc(e,n)}getOverlay(e,t){return Nc(e).get(Tc(this.userId,t)).next(e=>e?bc(this.serializer,e):null)}getOverlays(e,t){const n=Io();return On.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){const r=[];return n.forEach((n,s)=>{const i=new ca(t,s);r.push(this.St(e,i))}),On.waitFor(r)}removeOverlaysForBatchId(e,t,n){const r=new Set;t.forEach(e=>r.add(tr(e.getCollectionPath())));const s=[];return r.forEach(t=>{const r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);s.push(Nc(e).Z(Yr,r))}),On.waitFor(s)}getOverlaysForCollection(e,t,n){const r=Io(),s=tr(t),i=IDBKeyRange.bound([this.userId,s,n],[this.userId,s,Number.POSITIVE_INFINITY],!0);return Nc(e).J(Yr,i).next(e=>{for(const t of e){const e=bc(this.serializer,t);r.set(e.getKey(),e)}return r})}getOverlaysForCollectionGroup(e,t,n,r){const s=Io();let i;const o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Nc(e).ee({index:Zr,range:o},(e,t,n)=>{const o=bc(this.serializer,t);s.size()<r||o.largestBatchId===i?(s.set(o.getKey(),o),i=o.largestBatchId):n.done()}).next(()=>s)}St(e,t){return Nc(e).put(function(e,t,n){const[r,s,i]=Tc(t,n.mutation.key);return{userId:t,collectionPath:s,documentId:i,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:Ya(e.yt,n.mutation)}}(this.serializer,this.userId,t))}}function Nc(e){return hs(e,Qr)}
/**
 * @license
 * Copyright 2024 Google LLC
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
 */class Dc{bt(e){return hs(e,ts)}getSessionToken(e){return this.bt(e).get("sessionToken").next(e=>{const t=null==e?void 0:e.value;return t?Es.fromUint8Array(t):Es.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.bt(e).put({name:"sessionToken",value:t.toUint8Array()})}}
/**
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
 */class xc{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(As(e.integerValue));else if("doubleValue"in e){const n=As(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),Xn(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),"string"==typeof n&&(n=Cs(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(ks(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?ci(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):oi(e)?this.kt(e.mapValue,t):(this.qt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.Qt(e.arrayValue,t),this.Nt(t)):kt(19022,{$t:e})}Ot(e,t){this.Ft(t,25),this.Ut(e,t)}Ut(e,t){t.xt(e)}qt(e,t){const n=e.fields||{};this.Ft(t,55);for(const r of Object.keys(n))this.Ot(r,t),this.Ct(n[r],t)}kt(e,t){var n,r;const s=e.fields||{};this.Ft(t,53);const i=zs,o=(null==(r=null==(n=s[i].arrayValue)?void 0:n.values)?void 0:r.length)||0;this.Ft(t,15),t.Mt(As(o)),this.Ot(i,t),this.Ct(s[i],t)}Qt(e,t){const n=e.values||[];this.Ft(t,50);for(const r of n)this.Ct(r,t)}Lt(e,t){this.Ft(t,37),rn.fromName(e).path.forEach(e=>{this.Ft(t,60),this.Ut(e,t)})}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}xc.Kt=new xc;
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Rc=255;function Pc(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}function Oc(e){const t=64-function(e){let t=0;for(let n=0;n<8;++n){const r=Pc(255&e[n]);if(t+=r,8!==r)break}return t}(e);return Math.ceil(t/8)}class Mc{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Wt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Ht()}Yt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Gt(e);else if(e<2048)this.Gt(960|e>>>6),this.Gt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Gt(480|e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e);else{const e=t.codePointAt(0);this.Gt(240|e>>>18),this.Gt(128|63&e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e)}}this.zt()}Zt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Jt(e);else if(e<2048)this.Jt(960|e>>>6),this.Jt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Jt(480|e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e);else{const e=t.codePointAt(0);this.Jt(240|e>>>18),this.Jt(128|63&e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e)}}this.Ht()}Xt(e){const t=this.en(e),n=Oc(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=255&t[r]}nn(e){const t=this.en(e),n=Oc(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=~(255&t[r])}rn(){this.sn(Rc),this.sn(255)}_n(){this.an(Rc),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){const t=function(e){const t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let r=1;r<t.length;++r)t[r]^=n?255:0;return t}Gt(e){const t=255&e;0===t?(this.sn(0),this.sn(255)):t===Rc?(this.sn(Rc),this.sn(0)):this.sn(t)}Jt(e){const t=255&e;0===t?(this.an(0),this.an(255)):t===Rc?(this.an(Rc),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class Lc{constructor(e){this.cn=e}Bt(e){this.cn.Wt(e)}xt(e){this.cn.Yt(e)}Mt(e){this.cn.Xt(e)}vt(){this.cn.rn()}}class Fc{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class Vc{constructor(){this.cn=new Mc,this.ln=new Lc(this.cn),this.hn=new Fc(this.cn)}seed(e){this.cn.seed(e)}Pn(e){return 0===e?this.ln:this.hn}un(){return this.cn.un()}reset(){this.cn.reset()}}
/**
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
 */class Uc{constructor(e,t,n,r){this.Tn=e,this.In=t,this.En=n,this.dn=r}An(){const e=this.dn.length,t=0===e||255===this.dn[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.dn,0),t!==e?n.set([0],this.dn.length):++n[n.length-1],new Uc(this.Tn,this.In,this.En,n)}Rn(e,t,n){return{indexId:this.Tn,uid:e,arrayValue:jc(this.En),directionalValue:jc(this.dn),orderedDocumentKey:jc(t),documentKey:n.path.toArray()}}Vn(e,t,n){const r=this.Rn(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}}function Bc(e,t){let n=e.Tn-t.Tn;return 0!==n?n:(n=qc(e.En,t.En),0!==n?n:(n=qc(e.dn,t.dn),0!==n?n:rn.comparator(e.In,t.In)))}function qc(e,t){for(let n=0;n<e.length&&n<t.length;++n){const r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}function jc(e){return w()?function(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function zc(e){return"string"!=typeof e?e:function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e)}class $c{constructor(e){this.mn=new ws((e,t)=>nn.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.fn=e.orderBy,this.gn=[];for(const t of e.filters){const e=t;e.isInequality()?this.mn=this.mn.add(e):this.gn.push(e)}}get pn(){return this.mn.size>1}yn(e){if(Dt(e.collectionGroup===this.collectionId,49279),this.pn)return!1;const t=_n(e);if(void 0!==t&&!this.wn(t))return!1;const n=bn(e);let r=new Set,s=0,i=0;for(;s<n.length&&this.wn(n[s]);++s)r=r.add(n[s].fieldPath.canonicalString());if(s===n.length)return!0;if(this.mn.size>0){const e=this.mn.getIterator().getNext();if(!r.has(e.field.canonicalString())){const t=n[s];if(!this.Sn(e,t)||!this.bn(this.fn[i++],t))return!1}++s}for(;s<n.length;++s){const e=n[s];if(i>=this.fn.length||!this.bn(this.fn[i++],e))return!1}return!0}Dn(){if(this.pn)return null;let e=new ws(nn.comparator);const t=[];for(const n of this.gn)if(!n.field.isKeyField())if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new En(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new En(n.field,0))}for(const n of this.fn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new En(n.field,"asc"===n.dir?0:1)));return new In(In.UNKNOWN_ID,this.collectionId,t,Cn.empty())}wn(e){for(const t of this.gn)if(this.Sn(t,e))return!0;return!1}Sn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;const n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}bn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}
/**
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
 */function Gc(e){var t,n;if(Dt(e instanceof Ti||e instanceof Ei,20012),e instanceof Ti){if(e instanceof Vi){const r=(null==(n=null==(t=e.value.arrayValue)?void 0:t.values)?void 0:n.map(t=>Ti.create(e.field,"==",t)))||[];return Ei.create(r,"or")}return e}const r=e.filters.map(e=>Gc(e));return Ei.create(r,e.op)}function Kc(e){if(0===e.getFilters().length)return[];const t=Jc(Gc(e));return Dt(Qc(t),7391),Hc(t)||Wc(t)?[t]:t.getFilters()}function Hc(e){return e instanceof Ti}function Wc(e){return e instanceof Ei&&Ai(e)}function Qc(e){return Hc(e)||Wc(e)||function(e){if(e instanceof Ei&&Ci(e)){for(const t of e.getFilters())if(!Hc(t)&&!Wc(t))return!1;return!0}return!1}(e)}function Jc(e){if(Dt(e instanceof Ti||e instanceof Ei,34018),e instanceof Ti)return e;if(1===e.filters.length)return Jc(e.filters[0]);const t=e.filters.map(e=>Jc(e));let n=Ei.create(t,e.op);return n=Zc(n),Qc(n)?n:(Dt(n instanceof Ei,64498),Dt(Si(n),40251),Dt(n.filters.length>1,57927),n.filters.reduce((e,t)=>Yc(e,t)))}function Yc(e,t){let n;return Dt(e instanceof Ti||e instanceof Ei,38388),Dt(t instanceof Ti||t instanceof Ei,25473),n=e instanceof Ti?t instanceof Ti?(r=e,s=t,Ei.create([r,s],"and")):Xc(e,t):t instanceof Ti?Xc(t,e):function(e,t){if(Dt(e.filters.length>0&&t.filters.length>0,48005),Si(e)&&Si(t))return xi(e,t.getFilters());const n=Ci(e)?e:t,r=Ci(e)?t:e,s=n.filters.map(e=>Yc(e,r));return Ei.create(s,"or")}(e,t),Zc(n);var r,s}function Xc(e,t){if(Si(t))return xi(t,e.getFilters());{const n=t.filters.map(t=>Yc(e,t));return Ei.create(n,"or")}}function Zc(e){if(Dt(e instanceof Ti||e instanceof Ei,11850),e instanceof Ti)return e;const t=e.getFilters();if(1===t.length)return Zc(t[0]);if(ki(e))return e;const n=t.map(e=>Zc(e)),r=[];return n.forEach(t=>{t instanceof Ti?r.push(t):t instanceof Ei&&(t.op===e.op?r.push(...t.filters):r.push(t))}),1===r.length?r[0]:Ei.create(r,e.op)
/**
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
 */}class eu{constructor(){this.Cn=new tu}addToCollectionParentIndex(e,t){return this.Cn.add(t),On.resolve()}getCollectionParents(e,t){return On.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return On.resolve()}deleteFieldIndex(e,t){return On.resolve()}deleteAllFieldIndexes(e){return On.resolve()}createTargetIndexes(e,t){return On.resolve()}getDocumentsMatchingTarget(e,t){return On.resolve(null)}getIndexType(e,t){return On.resolve(0)}getFieldIndexes(e,t){return On.resolve([])}getNextCollectionGroupToUpdate(e){return On.resolve(null)}getMinOffset(e,t){return On.resolve(Nn.min())}getMinOffsetFromCollectionGroup(e,t){return On.resolve(Nn.min())}updateCollectionGroup(e,t,n){return On.resolve()}updateIndexEntries(e,t){return On.resolve()}}class tu{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new ws(en.comparator),s=!r.has(n);return this.index[t]=r.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new ws(en.comparator)).toArray()}}
/**
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
 */const nu="IndexedDbIndexManager",ru=new Uint8Array(0);class su{constructor(e,t){this.databaseId=t,this.vn=new tu,this.Fn=new po(e=>zi(e),(e,t)=>$i(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){const n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.vn.add(t)});const s={collectionId:n,parent:tr(r)};return iu(e).put(s)}return On.resolve()}getCollectionParents(e,t){const n=[],r=IDBKeyRange.bound([t,""],[Yt(t),""],!1,!0);return iu(e).J(r).next(e=>{for(const r of e){if(r.collectionId!==t)break;n.push(sr(r.parent))}return n})}addFieldIndex(e,t){const n=au(e),r={indexId:(s=t).indexId,collectionGroup:s.collectionGroup,fields:s.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};var s;delete r.indexId;const i=n.add(r);if(t.indexState){const n=cu(e);return i.next(e=>{n.put(Ec(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return i.next()}deleteFieldIndex(e,t){const n=au(e),r=cu(e),s=ou(e);return n.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=au(e),n=ou(e),r=cu(e);return t.Z().next(()=>n.Z()).next(()=>r.Z())}createTargetIndexes(e,t){return On.forEach(this.Mn(t),t=>this.getIndexType(e,t).next(n=>{if(0===n||1===n){const n=new $c(t).Dn();if(null!=n)return this.addFieldIndex(e,n)}}))}getDocumentsMatchingTarget(e,t){const n=ou(e);let r=!0;const s=new Map;return On.forEach(this.Mn(t),t=>this.xn(e,t).next(e=>{r&&(r=!!e),s.set(t,e)})).next(()=>{if(r){let e=So();const r=[];return On.forEach(s,(s,i)=>{var o;Et(nu,`Using index ${o=s,`id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")}`} to execute ${zi(t)}`);const a=function(e,t){const n=_n(t);if(void 0===n)return null;for(const r of Ki(e,n.fieldPath))switch(r.op){case"array-contains-any":return r.value.arrayValue.values||[];case"array-contains":return[r.value]}return null}(i,s),c=function(e,t){const n=new Map;for(const r of bn(t))for(const t of Ki(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(i,s),u=function(e,t){const n=[];let r=!0;for(const s of bn(t)){const t=0===s.kind?Hi(e,s.fieldPath,e.startAt):Wi(e,s.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new yi(n,r)}(i,s),l=function(e,t){const n=[];let r=!0;for(const s of bn(t)){const t=0===s.kind?Wi(e,s.fieldPath,e.endAt):Hi(e,s.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new yi(n,r)}(i,s),h=this.On(s,i,u),d=this.On(s,i,l),f=this.Nn(s,i,c),p=this.Bn(s.indexId,a,h,u.inclusive,d,l.inclusive,f);return On.forEach(p,s=>n.Y(s,t.limit).next(t=>{t.forEach(t=>{const n=rn.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))})}))}).next(()=>r)}return On.resolve(null)})}Mn(e){let t=this.Fn.get(e);return t||(t=0===e.filters.length?[e]:Kc(Ei.create(e.filters,"and")).map(t=>ji(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.Fn.set(e,t),t)}Bn(e,t,n,r,s,i,o){const a=(null!=t?t.length:1)*Math.max(n.length,s.length),c=a/(null!=t?t.length:1),u=[];for(let l=0;l<a;++l){const a=t?this.Ln(t[l/c]):ru,h=this.kn(e,a,n[l%c],r),d=this.qn(e,a,s[l%c],i),f=o.map(t=>this.kn(e,a,t,!0));u.push(...this.createRange(h,d,f))}return u}kn(e,t,n,r){const s=new Uc(e,rn.empty(),t,n);return r?s:s.An()}qn(e,t,n,r){const s=new Uc(e,rn.empty(),t,n);return r?s.An():s}xn(e,t){const n=new $c(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(e=>{let t=null;for(const r of e)n.yn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t})}getIndexType(e,t){let n=2;const r=this.Mn(t);return On.forEach(r,t=>this.xn(e,t).next(e=>{e?0!==n&&e.fields.length<function(e){let t=new ws(nn.comparator),n=!1;for(const r of e.filters)for(const e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(const r of e.orderBy)r.field.isKeyField()||(t=t.add(r.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})).next(()=>null!==t.limit&&r.length>1&&2===n?1:n)}Qn(e,t){const n=new Vc;for(const r of bn(e)){const e=t.data.field(r.fieldPath);if(null==e)return null;const s=n.Pn(r.kind);xc.Kt.Dt(e,s)}return n.un()}Ln(e){const t=new Vc;return xc.Kt.Dt(e,t.Pn(0)),t.un()}$n(e,t){const n=new Vc;return xc.Kt.Dt(ei(this.databaseId,t),n.Pn(function(e){const t=bn(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.un()}Nn(e,t,n){if(null===n)return[];let r=[];r.push(new Vc);let s=0;for(const i of bn(e)){const e=n[s++];for(const n of r)if(this.Un(t,i.fieldPath)&&ni(e))r=this.Kn(r,i,e);else{const t=n.Pn(i.kind);xc.Kt.Dt(e,t)}}return this.Wn(r)}On(e,t,n){return this.Nn(e,t,n.position)}Wn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Kn(e,t,n){const r=[...e],s=[];for(const i of n.arrayValue.values||[])for(const e of r){const n=new Vc;n.seed(e.un()),xc.Kt.Dt(i,n.Pn(t.kind)),s.push(n)}return s}Un(e,t){return!!e.filters.find(e=>e instanceof Ti&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){const n=au(e),r=cu(e);return(t?n.J(Br,IDBKeyRange.bound(t,t)):n.J()).next(e=>{const t=[];return On.forEach(e,e=>r.get([e.indexId,this.uid]).next(n=>{t.push(function(e,t){const n=t?new Cn(t.sequenceNumber,new Nn(yc(t.readTime),new rn(sr(t.documentKey)),t.largestBatchId)):Cn.empty(),r=e.fields.map(([e,t])=>new En(nn.fromServerFormat(e),t));return new In(e.indexId,e.collectionGroup,r,n)}(e,n))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{const n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:Gt(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,n){const r=au(e),s=cu(e);return this.Gn(e).next(e=>r.J(Br,IDBKeyRange.bound(t,t)).next(t=>On.forEach(t,t=>s.put(Ec(t.indexId,this.uid,e,n)))))}updateIndexEntries(e,t){const n=new Map;return On.forEach(t,(t,r)=>{const s=n.get(t.collectionGroup);return(s?On.resolve(s):this.getFieldIndexes(e,t.collectionGroup)).next(s=>(n.set(t.collectionGroup,s),On.forEach(s,n=>this.zn(e,t,n).next(t=>{const s=this.jn(r,n);return t.isEqual(s)?On.resolve():this.Jn(e,r,n,t,s)}))))})}Hn(e,t,n,r){return ou(e).put(r.Rn(this.uid,this.$n(n,t.key),t.key))}Yn(e,t,n,r){return ou(e).delete(r.Vn(this.uid,this.$n(n,t.key),t.key))}zn(e,t,n){const r=ou(e);let s=new ws(Bc);return r.ee({index:Hr,range:IDBKeyRange.only([n.indexId,this.uid,jc(this.$n(n,t))])},(e,r)=>{s=s.add(new Uc(n.indexId,t,zc(r.arrayValue),zc(r.directionalValue)))}).next(()=>s)}jn(e,t){let n=new ws(Bc);const r=this.Qn(t,e);if(null==r)return n;const s=_n(t);if(null!=s){const i=e.data.field(s.fieldPath);if(ni(i))for(const s of i.arrayValue.values||[])n=n.add(new Uc(t.indexId,e.key,this.Ln(s),r))}else n=n.add(new Uc(t.indexId,e.key,ru,r));return n}Jn(e,t,n,r,s){Et(nu,"Updating index entries for document '%s'",t.key);const i=[];return function(e,t,n,r,s){const i=e.getIterator(),o=t.getIterator();let a=_s(i),c=_s(o);for(;a||c;){let e=!1,t=!1;if(a&&c){const r=n(a,c);r<0?t=!0:r>0&&(e=!0)}else null!=a?t=!0:e=!0;e?(r(c),c=_s(o)):t?(s(a),a=_s(i)):(a=_s(i),c=_s(o))}}(r,s,Bc,r=>{i.push(this.Hn(e,t,n,r))},r=>{i.push(this.Yn(e,t,n,r))}),On.waitFor(i)}Gn(e){let t=1;return cu(e).ee({index:zr,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,n,r)=>{r.done(),t=n.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((e,t)=>Bc(e,t)).filter((e,t,n)=>!t||0!==Bc(e,n[t-1]));const r=[];r.push(e);for(const i of n){const n=Bc(i,e),s=Bc(i,t);if(0===n)r[0]=e.An();else if(n>0&&s<0)r.push(i),r.push(i.An());else if(s>0)break}r.push(t);const s=[];for(let i=0;i<r.length;i+=2){if(this.Zn(r[i],r[i+1]))return[];const e=r[i].Vn(this.uid,ru,rn.empty()),t=r[i+1].Vn(this.uid,ru,rn.empty());s.push(IDBKeyRange.bound(e,t))}return s}Zn(e,t){return Bc(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(uu)}getMinOffset(e,t){return On.mapArray(this.Mn(t),t=>this.xn(e,t).next(e=>e||kt(44426))).next(uu)}}function iu(e){return hs(e,Or)}function ou(e){return hs(e,Gr)}function au(e){return hs(e,Ur)}function cu(e){return hs(e,qr)}function uu(e){Dt(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){const s=e[r].indexState.offset;Dn(s,t)<0&&(t=s),n<s.largestBatchId&&(n=s.largestBatchId)}return new Nn(t.readTime,t.documentKey,n)}
/**
 * @license
 * Copyright 2018 Google LLC
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
 */const lu={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},hu=41943040;class du{static withCacheSize(e){return new du(e,du.DEFAULT_COLLECTION_PERCENTILE,du.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}
/**
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
 */function fu(e,t,n){const r=e.store(ur),s=e.store(gr),i=[],o=IDBKeyRange.only(n.batchId);let a=0;const c=r.ee({range:o},(e,t,n)=>(a++,n.delete()));i.push(c.next(()=>{Dt(1===a,47070,{batchId:n.batchId})}));const u=[];for(const l of n.mutations){const e=pr(t,l.key.path,n.batchId);i.push(s.delete(e)),u.push(l.key)}return On.waitFor(i).next(()=>u)}function pu(e){if(!e)return 0;let t;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw kt(14731);t=e.noDocument}return JSON.stringify(t).length}
/**
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
 */du.DEFAULT_COLLECTION_PERCENTILE=10,du.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,du.DEFAULT=new du(hu,du.DEFAULT_COLLECTION_PERCENTILE,du.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),du.DISABLED=new du(-1,0,0);class mu{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Xn={}}static wt(e,t,n,r){Dt(""!==e.uid,64387);const s=e.isAuthenticated()?e.uid:"";return new mu(s,t,n,r)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return yu(e).ee({index:hr,range:n},(e,n,r)=>{t=!1,r.done()}).next(()=>t)}addMutationBatch(e,t,n,r){const s=vu(e),i=yu(e);return i.add({}).next(o=>{Dt("number"==typeof o,49019);const a=new oa(o,t,n,r),c=function(e,t,n){const r=n.baseMutations.map(t=>Ya(e.yt,t)),s=n.mutations.map(t=>Ya(e.yt,t));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:s}}(this.serializer,this.userId,a),u=[];let l=new ws((e,t)=>Gt(e.canonicalString(),t.canonicalString()));for(const e of r){const t=pr(this.userId,e.key.path,o);l=l.add(e.key.path.popLast()),u.push(i.put(c)),u.push(s.put(t,mr))}return l.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Xn[o]=a.keys()}),On.waitFor(u).next(()=>a)})}lookupMutationBatch(e,t){return yu(e).get(t).next(e=>e?(Dt(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),vc(this.serializer,e)):null)}er(e,t){return this.Xn[t]?On.resolve(this.Xn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){const n=e.keys();return this.Xn[t]=n,n}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]);let s=null;return yu(e).ee({index:hr,range:r},(e,t,r)=>{t.userId===this.userId&&(Dt(t.batchId>=n,47524,{tr:n}),s=vc(this.serializer,t)),r.done()}).next(()=>s)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=Jn;return yu(e).ee({index:hr,range:t,reverse:!0},(e,t,r)=>{n=t.batchId,r.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,Jn],[this.userId,Number.POSITIVE_INFINITY]);return yu(e).J(hr,t).next(e=>e.map(e=>vc(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=fr(this.userId,t.path),r=IDBKeyRange.lowerBound(n),s=[];return vu(e).ee({range:r},(n,r,i)=>{const[o,a,c]=n,u=sr(a);if(o===this.userId&&t.path.isEqual(u))return yu(e).get(c).next(e=>{if(!e)throw kt(61480,{nr:n,batchId:c});Dt(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:c}),s.push(vc(this.serializer,e))});i.done()}).next(()=>s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new ws(Gt);const r=[];return t.forEach(t=>{const s=fr(this.userId,t.path),i=IDBKeyRange.lowerBound(s),o=vu(e).ee({range:i},(e,r,s)=>{const[i,o,a]=e,c=sr(o);i===this.userId&&t.path.isEqual(c)?n=n.add(a):s.done()});r.push(o)}),On.waitFor(r).next(()=>this.rr(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1,s=fr(this.userId,n),i=IDBKeyRange.lowerBound(s);let o=new ws(Gt);return vu(e).ee({range:i},(e,t,s)=>{const[i,a,c]=e,u=sr(a);i===this.userId&&n.isPrefixOf(u)?u.length===r&&(o=o.add(c)):s.done()}).next(()=>this.rr(e,o))}rr(e,t){const n=[],r=[];return t.forEach(t=>{r.push(yu(e).get(t).next(e=>{if(null===e)throw kt(35274,{batchId:t});Dt(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(vc(this.serializer,e))}))}),On.waitFor(r).next(()=>n)}removeMutationBatch(e,t){return fu(e.le,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.ir(t.batchId)}),On.forEach(n,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}ir(e){delete this.Xn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return On.resolve();const n=IDBKeyRange.lowerBound([this.userId]),r=[];return vu(e).ee({range:n},(e,t,n)=>{if(e[0]===this.userId){const t=sr(e[1]);r.push(t)}else n.done()}).next(()=>{Dt(0===r.length,56720,{sr:r.map(e=>e.canonicalString())})})})}containsKey(e,t){return gu(e,this.userId,t)}_r(e){return wu(e).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:Jn,lastStreamToken:""})}}function gu(e,t,n){const r=fr(t,n.path),s=r[1],i=IDBKeyRange.lowerBound(r);let o=!1;return vu(e).ee({range:i,X:!0},(e,n,r)=>{const[i,a,c]=e;i===t&&a===s&&(o=!0),r.done()}).next(()=>o)}function yu(e){return hs(e,ur)}function vu(e){return hs(e,gr)}function wu(e){return hs(e,cr)}
/**
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
 */class Iu{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new Iu(0)}static cr(){return new Iu(-1)}}
/**
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
 */class _u{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.lr(e).next(t=>{const n=new Iu(t.highestTargetId);return t.highestTargetId=n.next(),this.hr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.lr(e).next(e=>vn.fromTimestamp(new yn(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.lr(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.lr(e).next(r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.hr(e,r)))}addTargetData(e,t){return this.Pr(e,t).next(()=>this.lr(e).next(n=>(n.targetCount+=1,this.Tr(t,n),this.hr(e,n))))}updateTargetData(e,t){return this.Pr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>bu(e).delete(t.targetId)).next(()=>this.lr(e)).next(t=>(Dt(t.targetCount>0,8065),t.targetCount-=1,this.hr(e,t)))}removeTargets(e,t,n){let r=0;const s=[];return bu(e).ee((i,o)=>{const a=wc(o);a.sequenceNumber<=t&&null===n.get(a.targetId)&&(r++,s.push(this.removeTargetData(e,a)))}).next(()=>On.waitFor(s)).next(()=>r)}forEachTarget(e,t){return bu(e).ee((e,n)=>{const r=wc(n);t(r)})}lr(e){return Tu(e).get(Rr).next(e=>(Dt(null!==e,2888),e))}hr(e,t){return Tu(e).put(Rr,t)}Pr(e,t){return bu(e).put(Ic(this.serializer,t))}Tr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.lr(e).next(e=>e.targetCount)}getTargetData(e,t){const n=zi(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let s=null;return bu(e).ee({range:r,index:Cr},(e,n,r)=>{const i=wc(n);$i(t,i.target)&&(s=i,r.done())}).next(()=>s)}addMatchingKeys(e,t,n){const r=[],s=Eu(e);return t.forEach(t=>{const i=tr(t.path);r.push(s.put({targetId:n,path:i})),r.push(this.referenceDelegate.addReference(e,n,t))}),On.waitFor(r)}removeMatchingKeys(e,t,n){const r=Eu(e);return On.forEach(t,t=>{const s=tr(t.path);return On.waitFor([r.delete([n,s]),this.referenceDelegate.removeReference(e,n,t)])})}removeMatchingKeysForTargetId(e,t){const n=Eu(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),r=Eu(e);let s=So();return r.ee({range:n,X:!0},(e,t,n)=>{const r=sr(e[1]),i=new rn(r);s=s.add(i)}).next(()=>s)}containsKey(e,t){const n=tr(t.path),r=IDBKeyRange.bound([n],[Yt(n)],!1,!0);let s=0;return Eu(e).ee({index:Dr,X:!0,range:r},([e,t],n,r)=>{0!==e&&(s++,r.done())}).next(()=>s>0)}At(e,t){return bu(e).get(t).next(e=>e?wc(e):null)}}function bu(e){return hs(e,Sr)}function Tu(e){return hs(e,Pr)}function Eu(e){return hs(e,kr)}
/**
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
 */const Su="LruGarbageCollector",Cu=1048576;function Au([e,t],[n,r]){const s=Gt(e,n);return 0===s?Gt(t,r):s}class ku{constructor(e){this.Ir=e,this.buffer=new ws(Au),this.Er=0}dr(){return++this.Er}Ar(e){const t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{const e=this.buffer.last();Au(t,e)<0&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Nu{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return null!==this.Rr}Vr(e){Et(Su,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){qn(e)?Et(Su,"Ignoring IndexedDB error during garbage collection: ",e):await Pn(e)}await this.Vr(3e5)})}}class Du{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return On.resolve(Qn.ce);const n=new ku(t);return this.mr.forEachTarget(e,e=>n.Ar(e.sequenceNumber)).next(()=>this.mr.pr(e,e=>n.Ar(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.mr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return-1===this.params.cacheSizeCollectionThreshold?(Et("LruGarbageCollector","Garbage collection skipped; disabled"),On.resolve(lu)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(Et("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),lu):this.yr(e,t))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let n,r,s,i,o,a,c;const u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(Et("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,i=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,o=Date.now(),this.removeTargets(e,n,t))).next(t=>(s=t,a=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(c=Date.now(),Tt()<=L.DEBUG&&Et("LruGarbageCollector",`LRU Garbage Collection\n\tCounted targets in ${i-u}ms\n\tDetermined least recently used ${r} in `+(o-i)+`ms\n\tRemoved ${s} targets in `+(a-o)+`ms\n\tRemoved ${e} documents in `+(c-a)+`ms\nTotal Duration: ${c-u}ms`),On.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:s,documentsRemoved:e})))}}function xu(e,t){return new Du(e,t)}
/**
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
 */class Ru{constructor(e,t){this.db=e,this.garbageCollector=xu(this,t)}gr(e){const t=this.wr(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}wr(e){let t=0;return this.pr(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}pr(e,t){return this.Sr(e,(e,n)=>t(n))}addReference(e,t,n){return Pu(e,n)}removeReference(e,t,n){return Pu(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Pu(e,t)}br(e,t){return function(e,t){let n=!1;return wu(e).te(r=>gu(e,r,t).next(e=>(e&&(n=!0),On.resolve(!e)))).next(()=>n)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let s=0;return this.Sr(e,(i,o)=>{if(o<=t){const t=this.br(e,i).next(t=>{if(!t)return s++,n.getEntry(e,i).next(()=>(n.removeEntry(i,vn.min()),Eu(e).delete([0,tr(i.path)])))});r.push(t)}}).next(()=>On.waitFor(r)).next(()=>n.apply(e)).next(()=>s)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Pu(e,t)}Sr(e,t){const n=Eu(e);let r,s=Qn.ce;return n.ee({index:Dr},([e,n],{path:i,sequenceNumber:o})=>{0===e?(s!==Qn.ce&&t(new rn(sr(r)),s),s=o,r=i):s=Qn.ce}).next(()=>{s!==Qn.ce&&t(new rn(sr(r)),s)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Pu(e,t){return Eu(e).put((n=t,r=e.currentSequenceNumber,{targetId:0,path:tr(n.path),sequenceNumber:r}));var n,r}
/**
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
 */class Ou{constructor(){this.changes=new po(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,gi.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return void 0!==n?On.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}
/**
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
 */class Mu{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Uu(e).put(n)}removeEntry(e,t,n){return Uu(e).delete(function(e,t){const n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],mc(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.Dr(e,n)))}getEntry(e,t){let n=gi.newInvalidDocument(t);return Uu(e).ee({index:wr,range:IDBKeyRange.only(Bu(t))},(e,r)=>{n=this.Cr(t,r)}).next(()=>n)}vr(e,t){let n={size:0,document:gi.newInvalidDocument(t)};return Uu(e).ee({index:wr,range:IDBKeyRange.only(Bu(t))},(e,r)=>{n={document:this.Cr(t,r),size:pu(r)}}).next(()=>n)}getEntries(e,t){let n=go();return this.Fr(e,t,(e,t)=>{const r=this.Cr(e,t);n=n.insert(e,r)}).next(()=>n)}Mr(e,t){let n=go(),r=new gs(rn.comparator);return this.Fr(e,t,(e,t)=>{const s=this.Cr(e,t);n=n.insert(e,s),r=r.insert(e,pu(t))}).next(()=>({documents:n,Or:r}))}Fr(e,t,n){if(t.isEmpty())return On.resolve();let r=new ws(ju);t.forEach(e=>r=r.add(e));const s=IDBKeyRange.bound(Bu(r.first()),Bu(r.last())),i=r.getIterator();let o=i.getNext();return Uu(e).ee({index:wr,range:s},(e,t,r)=>{const s=rn.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;o&&ju(o,s)<0;)n(o,null),o=i.getNext();o&&o.isEqual(s)&&(n(o,t),o=i.hasNext()?i.getNext():null),o?r.j(Bu(o)):r.done()}).next(()=>{for(;o;)n(o,null),o=i.hasNext()?i.getNext():null})}getDocumentsMatchingQuery(e,t,n,r,s){const i=t.path,o=[i.popLast().toArray(),i.lastSegment(),mc(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],a=[i.popLast().toArray(),i.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Uu(e).J(IDBKeyRange.bound(o,a,!0)).next(e=>{null==s||s.incrementDocumentReadCount(e.length);let n=go();for(const s of e){const e=this.Cr(rn.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);e.isFoundDocument()&&(uo(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n})}getAllFromCollectionGroup(e,t,n,r){let s=go();const i=qu(t,n),o=qu(t,Nn.max());return Uu(e).ee({index:_r,range:IDBKeyRange.bound(i,o,!0)},(e,t,n)=>{const i=this.Cr(rn.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);s=s.insert(i.key,i),s.size===r&&n.done()}).next(()=>s)}newChangeBuffer(e){return new Fu(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return Vu(e).get(Er).next(e=>(Dt(!!e,20021),e))}Dr(e,t){return Vu(e).put(Er,t)}Cr(e,t){if(t){const e=function(e,t){let n;if(t.document)n=Ja(e.yt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const e=rn.fromSegments(t.noDocument.path),r=yc(t.noDocument.readTime);n=gi.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return kt(56709);{const e=rn.fromSegments(t.unknownDocument.path),r=yc(t.unknownDocument.version);n=gi.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){const t=new yn(e[0],e[1]);return vn.fromTimestamp(t)}(t.readTime)),n}(this.serializer,t);if(!e.isNoDocument()||!e.version.isEqual(vn.min()))return e}return gi.newInvalidDocument(e)}}function Lu(e){return new Mu(e)}class Fu extends Ou{constructor(e,t){super(),this.Nr=e,this.trackRemovals=t,this.Br=new po(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){const t=[];let n=0,r=new ws((e,t)=>Gt(e.canonicalString(),t.canonicalString()));return this.changes.forEach((s,i)=>{const o=this.Br.get(s);if(t.push(this.Nr.removeEntry(e,s,o.readTime)),i.isValidDocument()){const a=pc(this.Nr.serializer,i);r=r.add(s.path.popLast());const c=pu(a);n+=c-o.size,t.push(this.Nr.addEntry(e,s,a))}else if(n-=o.size,this.trackRemovals){const n=pc(this.Nr.serializer,i.convertToNoDocument(vn.min()));t.push(this.Nr.addEntry(e,s,n))}}),r.forEach(n=>{t.push(this.Nr.indexManager.addToCollectionParentIndex(e,n))}),t.push(this.Nr.updateMetadata(e,n)),On.waitFor(t)}getFromCache(e,t){return this.Nr.vr(e,t).next(e=>(this.Br.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.Nr.Mr(e,t).next(({documents:e,Or:t})=>(t.forEach((t,n)=>{this.Br.set(t,{size:n,readTime:e.get(t).readTime})}),e))}}function Vu(e){return hs(e,Tr)}function Uu(e){return hs(e,yr)}function Bu(e){const t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function qu(e,t){const n=t.documentKey.path.toArray();return[e,mc(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function ju(e,t){const n=e.path.toArray(),r=t.path.toArray();let s=0;for(let i=0;i<n.length-2&&i<r.length-2;++i)if(s=Gt(n[i],r[i]),s)return s;return s=Gt(n.length,r.length),s||(s=Gt(n[n.length-2],r[r.length-2]),s||Gt(n[n.length-1],r[r.length-1])
/**
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
 */
/**
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
 */)}class zu{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}
/**
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
 */class $u{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&Jo(n.mutation,e,bs.empty(),yn.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,So()).next(()=>t))}getLocalViewOfDocuments(e,t,n=So()){const r=Io();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=vo();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){const n=Io();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,So()))}populateOverlays(e,t,n){const r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let s=go();const i=bo(),o=bo();return t.forEach((e,t)=>{const o=n.get(t.key);r.has(t.key)&&(void 0===o||o.mutation instanceof ea)?s=s.insert(t.key,t):void 0!==o?(i.set(t.key,o.mutation.getFieldMask()),Jo(o.mutation,t,o.mutation.getFieldMask(),yn.now())):i.set(t.key,bs.empty())}),this.recalculateAndSaveOverlays(e,s).next(e=>(e.forEach((e,t)=>i.set(e,t)),t.forEach((e,t)=>o.set(e,new zu(t,i.get(e)??null))),o))}recalculateAndSaveOverlays(e,t){const n=bo();let r=new gs((e,t)=>e-t),s=So();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(const s of e)s.keys().forEach(e=>{const i=t.get(e);if(null===i)return;let o=n.get(e)||bs.empty();o=s.applyToLocalView(i,o),n.set(e,o);const a=(r.get(s.batchId)||So()).add(e);r=r.insert(s.batchId,a)})}).next(()=>{const i=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,u=_o();c.forEach(e=>{if(!s.has(e)){const r=Wo(t.get(e),n.get(e));null!==r&&u.set(e,r),s=s.add(e)}}),i.push(this.documentOverlayCache.saveOverlays(e,a,u))}return On.waitFor(i)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return s=t,rn.isDocumentKey(s.path)&&null===s.collectionGroup&&0===s.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):Zi(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r);var s}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(s=>{const i=r-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-s.size):On.resolve(Io());let o=wn,a=s;return i.next(t=>On.forEach(t,(t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),s.get(t)?On.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{a=a.insert(t,e)}))).next(()=>this.populateOverlays(e,t,s)).next(()=>this.computeViews(e,a,t,So())).next(e=>({batchId:o,changes:wo(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new rn(t)).next(e=>{let t=vo();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const s=t.collectionGroup;let i=vo();return this.indexManager.getCollectionParents(e,s).next(o=>On.forEach(o,o=>{const a=(c=t,u=o.child(s),new Qi(u,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt));var c,u;return this.getDocumentsMatchingCollectionQuery(e,a,n,r).next(e=>{e.forEach((e,t)=>{i=i.insert(e,t)})})}).next(()=>i))}getDocumentsMatchingCollectionQuery(e,t,n,r){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(i=>(s=i,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,r))).next(e=>{s.forEach((t,n)=>{const r=n.getKey();null===e.get(r)&&(e=e.insert(r,gi.newInvalidDocument(r)))});let n=vo();return e.forEach((e,r)=>{const i=s.get(e);void 0!==i&&Jo(i.mutation,r,bs.empty(),yn.now()),uo(t,r)&&(n=n.insert(e,r))}),n})}}
/**
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
 */class Gu{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return On.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,{id:(n=t).id,version:n.version,createTime:Ua(n.createTime)}),On.resolve();var n}getNamedQuery(e,t){return On.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,{name:(n=t).name,query:_c(n.bundledQuery),readTime:Ua(n.readTime)}),On.resolve();var n}}
/**
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
 */class Ku{constructor(){this.overlays=new gs(rn.comparator),this.qr=new Map}getOverlay(e,t){return On.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Io();return On.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.St(e,t,r)}),On.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.qr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.qr.delete(n)),On.resolve()}getOverlaysForCollection(e,t,n){const r=Io(),s=t.length+1,i=new rn(t.child("")),o=this.overlays.getIteratorFrom(i);for(;o.hasNext();){const e=o.getNext().value,i=e.getKey();if(!t.isPrefixOf(i.path))break;i.path.length===s&&e.largestBatchId>n&&r.set(e.getKey(),e)}return On.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let s=new gs((e,t)=>e-t);const i=this.overlays.getIterator();for(;i.hasNext();){const e=i.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=s.get(e.largestBatchId);null===t&&(t=Io(),s=s.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}const o=Io(),a=s.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach((e,t)=>o.set(e,t)),!(o.size()>=r)););return On.resolve(o)}St(e,t,n){const r=this.overlays.get(n.key);if(null!==r){const e=this.qr.get(r.largestBatchId).delete(n.key);this.qr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new ca(t,n));let s=this.qr.get(t);void 0===s&&(s=So(),this.qr.set(t,s)),this.qr.set(t,s.add(n.key))}}
/**
 * @license
 * Copyright 2024 Google LLC
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
 */class Hu{constructor(){this.sessionToken=Es.EMPTY_BYTE_STRING}getSessionToken(e){return On.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,On.resolve()}}
/**
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
 */class Wu{constructor(){this.Qr=new ws(Qu.$r),this.Ur=new ws(Qu.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){const n=new Qu(e,t);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Gr(new Qu(e,t))}zr(e,t){e.forEach(e=>this.removeReference(e,t))}jr(e){const t=new rn(new en([])),n=new Qu(t,e),r=new Qu(t,e+1),s=[];return this.Ur.forEachInRange([n,r],e=>{this.Gr(e),s.push(e.key)}),s}Jr(){this.Qr.forEach(e=>this.Gr(e))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const t=new rn(new en([])),n=new Qu(t,e),r=new Qu(t,e+1);let s=So();return this.Ur.forEachInRange([n,r],e=>{s=s.add(e.key)}),s}containsKey(e){const t=new Qu(e,0),n=this.Qr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class Qu{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return rn.comparator(e.key,t.key)||Gt(e.Yr,t.Yr)}static Kr(e,t){return Gt(e.Yr,t.Yr)||rn.comparator(e.key,t.key)}}
/**
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
 */class Ju{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new ws(Qu.$r)}checkEmpty(e){return On.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){const s=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const i=new oa(s,t,n,r);this.mutationQueue.push(i);for(const o of r)this.Zr=this.Zr.add(new Qu(o.key,s)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return On.resolve(i)}lookupMutationBatch(e,t){return On.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.ei(n),s=r<0?0:r;return On.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return On.resolve(0===this.mutationQueue.length?Jn:this.tr-1)}getAllMutationBatches(e){return On.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Qu(t,0),r=new Qu(t,Number.POSITIVE_INFINITY),s=[];return this.Zr.forEachInRange([n,r],e=>{const t=this.Xr(e.Yr);s.push(t)}),On.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new ws(Gt);return t.forEach(e=>{const t=new Qu(e,0),r=new Qu(e,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([t,r],e=>{n=n.add(e.Yr)})}),On.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let s=n;rn.isDocumentKey(s)||(s=s.child(""));const i=new Qu(new rn(s),0);let o=new ws(Gt);return this.Zr.forEachWhile(e=>{const t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.Yr)),!0)},i),On.resolve(this.ti(o))}ti(e){const t=[];return e.forEach(e=>{const n=this.Xr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){Dt(0===this.ni(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Zr;return On.forEach(t.mutations,r=>{const s=new Qu(r.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Zr=n})}ir(e){}containsKey(e,t){const n=new Qu(t,0),r=this.Zr.firstAfterOrEqual(n);return On.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,On.resolve()}ni(e,t){return this.ei(e)}ei(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Xr(e){const t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}
/**
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
 */class Yu{constructor(e){this.ri=e,this.docs=new gs(rn.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),s=r?r.size:0,i=this.ri(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:i}),this.size+=i-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return On.resolve(n?n.document.mutableCopy():gi.newInvalidDocument(t))}getEntries(e,t){let n=go();return t.forEach(e=>{const t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():gi.newInvalidDocument(e))}),On.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let s=go();const i=t.path,o=new rn(i.child("__id-9223372036854775808__")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:e,value:{document:o}}=a.getNext();if(!i.isPrefixOf(e.path))break;e.path.length>i.length+1||Dn(kn(o),n)<=0||(r.has(o.key)||uo(t,o))&&(s=s.insert(o.key,o.mutableCopy()))}return On.resolve(s)}getAllFromCollectionGroup(e,t,n,r){kt(9500)}ii(e,t){return On.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new Xu(this)}getSize(e){return On.resolve(this.size)}}class Xu extends Ou{constructor(e){super(),this.Nr=e}applyChanges(e){const t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Nr.addEntry(e,r)):this.Nr.removeEntry(n)}),On.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}}
/**
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
 */class Zu{constructor(e){this.persistence=e,this.si=new po(e=>zi(e),$i),this.lastRemoteSnapshotVersion=vn.min(),this.highestTargetId=0,this.oi=0,this._i=new Wu,this.targetCount=0,this.ai=Iu.ur()}forEachTarget(e,t){return this.si.forEach((e,n)=>t(n)),On.resolve()}getLastRemoteSnapshotVersion(e){return On.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return On.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),On.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.oi&&(this.oi=t),On.resolve()}Pr(e){this.si.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.ai=new Iu(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,On.resolve()}updateTargetData(e,t){return this.Pr(t),On.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),this.targetCount-=1,On.resolve()}removeTargets(e,t,n){let r=0;const s=[];return this.si.forEach((i,o)=>{o.sequenceNumber<=t&&null===n.get(o.targetId)&&(this.si.delete(i),s.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)}),On.waitFor(s).next(()=>r)}getTargetCount(e){return On.resolve(this.targetCount)}getTargetData(e,t){const n=this.si.get(t)||null;return On.resolve(n)}addMatchingKeys(e,t,n){return this._i.Wr(t,n),On.resolve()}removeMatchingKeys(e,t,n){this._i.zr(t,n);const r=this.persistence.referenceDelegate,s=[];return r&&t.forEach(t=>{s.push(r.markPotentiallyOrphaned(e,t))}),On.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),On.resolve()}getMatchingKeysForTargetId(e,t){const n=this._i.Hr(t);return On.resolve(n)}containsKey(e,t){return On.resolve(this._i.containsKey(t))}}
/**
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
 */class el{constructor(e,t){this.ui={},this.overlays={},this.ci=new Qn(0),this.li=!1,this.li=!0,this.hi=new Hu,this.referenceDelegate=e(this),this.Pi=new Zu(this),this.indexManager=new eu,this.remoteDocumentCache=new Yu(e=>this.referenceDelegate.Ti(e)),this.serializer=new fc(t),this.Ii=new Gu(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Ku,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ui[e.toKey()];return n||(n=new Ju(t,this.referenceDelegate),this.ui[e.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,n){Et("MemoryPersistence","Starting transaction:",e);const r=new tl(this.ci.next());return this.referenceDelegate.Ei(),n(r).next(e=>this.referenceDelegate.di(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ai(e,t){return On.or(Object.values(this.ui).map(n=>()=>n.containsKey(e,t)))}}class tl extends Rn{constructor(e){super(),this.currentSequenceNumber=e}}class nl{constructor(e){this.persistence=e,this.Ri=new Wu,this.Vi=null}static mi(e){return new nl(e)}get fi(){if(this.Vi)return this.Vi;throw kt(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.fi.delete(n.toString()),On.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.fi.add(n.toString()),On.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),On.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach(e=>this.fi.add(e.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.fi.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ei(){this.Vi=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return On.forEach(this.fi,n=>{const r=rn.fromPath(n);return this.gi(e,r).next(e=>{e||t.removeEntry(r,vn.min())})}).next(()=>(this.Vi=null,t.apply(e)))}updateLimboDocument(e,t){return this.gi(e,t).next(e=>{e?this.fi.delete(t.toString()):this.fi.add(t.toString())})}Ti(e){return 0}gi(e,t){return On.or([()=>On.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}}class rl{constructor(e,t){this.persistence=e,this.pi=new po(e=>tr(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=xu(this,t)}static mi(e,t){return new rl(e,t)}Ei(){}di(e){return On.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){const t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}wr(e){let t=0;return this.pr(e,e=>{t++}).next(()=>t)}pr(e,t){return On.forEach(this.pi,(n,r)=>this.br(e,n,r).next(e=>e?On.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const r=this.persistence.getRemoteDocumentCache(),s=r.newChangeBuffer();return r.ii(e,r=>this.br(e,r,t).next(e=>{e||(n++,s.removeEntry(r,vn.min()))})).next(()=>s.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),On.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),On.resolve()}removeReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),On.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),On.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Zs(e.data.value)),t}br(e,t,n){return On.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const e=this.pi.get(t);return On.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}
/**
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
 */class sl{constructor(e){this.serializer=e}k(e,t,n,r){const s=new Ln("createOrUpgrade",t);n<1&&r>=1&&(e.createObjectStore(or),function(e){e.createObjectStore(cr,{keyPath:"userId"});e.createObjectStore(ur,{keyPath:lr,autoIncrement:!0}).createIndex(hr,dr,{unique:!0}),e.createObjectStore(gr)}(e),il(e),function(e){e.createObjectStore(ir)}(e));let i=On.resolve();return n<3&&r>=3&&(0!==n&&(function(e){e.deleteObjectStore(kr),e.deleteObjectStore(Sr),e.deleteObjectStore(Pr)}(e),il(e)),i=i.next(()=>function(e){const t=e.store(Pr),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:vn.min().toTimestamp(),targetCount:0};return t.put(Rr,n)}(s))),n<4&&r>=4&&(0!==n&&(i=i.next(()=>function(e,t){return t.store(ur).J().next(n=>{e.deleteObjectStore(ur),e.createObjectStore(ur,{keyPath:lr,autoIncrement:!0}).createIndex(hr,dr,{unique:!0});const r=t.store(ur),s=n.map(e=>r.put(e));return On.waitFor(s)})}(e,s))),i=i.next(()=>{!function(e){e.createObjectStore(Lr,{keyPath:"clientId"})}(e)})),n<5&&r>=5&&(i=i.next(()=>this.yi(s))),n<6&&r>=6&&(i=i.next(()=>(function(e){e.createObjectStore(Tr)}(e),this.wi(s)))),n<7&&r>=7&&(i=i.next(()=>this.Si(s))),n<8&&r>=8&&(i=i.next(()=>this.bi(e,s))),n<9&&r>=9&&(i=i.next(()=>{!function(e){e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")}(e)})),n<10&&r>=10&&(i=i.next(()=>this.Di(s))),n<11&&r>=11&&(i=i.next(()=>{!function(e){e.createObjectStore(Fr,{keyPath:"bundleId"})}(e),function(e){e.createObjectStore(Vr,{keyPath:"name"})}(e)})),n<12&&r>=12&&(i=i.next(()=>{!function(e){const t=e.createObjectStore(Qr,{keyPath:Jr});t.createIndex(Yr,Xr,{unique:!1}),t.createIndex(Zr,es,{unique:!1})}(e)})),n<13&&r>=13&&(i=i.next(()=>function(e){const t=e.createObjectStore(yr,{keyPath:vr});t.createIndex(wr,Ir),t.createIndex(_r,br)}(e)).next(()=>this.Ci(e,s)).next(()=>e.deleteObjectStore(ir))),n<14&&r>=14&&(i=i.next(()=>this.Fi(e,s))),n<15&&r>=15&&(i=i.next(()=>function(e){e.createObjectStore(Ur,{keyPath:"indexId",autoIncrement:!0}).createIndex(Br,"collectionGroup",{unique:!1});e.createObjectStore(qr,{keyPath:jr}).createIndex(zr,$r,{unique:!1});e.createObjectStore(Gr,{keyPath:Kr}).createIndex(Hr,Wr,{unique:!1})}(e))),n<16&&r>=16&&(i=i.next(()=>{t.objectStore(qr).clear()}).next(()=>{t.objectStore(Gr).clear()})),n<17&&r>=17&&(i=i.next(()=>{!function(e){e.createObjectStore(ts,{keyPath:"name"})}(e)})),n<18&&r>=18&&w()&&(i=i.next(()=>{t.objectStore(qr).clear()}).next(()=>{t.objectStore(Gr).clear()})),i}wi(e){let t=0;return e.store(ir).ee((e,n)=>{t+=pu(n)}).next(()=>{const n={byteSize:t};return e.store(Tr).put(Er,n)})}yi(e){const t=e.store(cr),n=e.store(ur);return t.J().next(t=>On.forEach(t,t=>{const r=IDBKeyRange.bound([t.userId,Jn],[t.userId,t.lastAcknowledgedBatchId]);return n.J(hr,r).next(n=>On.forEach(n,n=>{Dt(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});const r=vc(this.serializer,n);return fu(e,t.userId,r).next(()=>{})}))}))}Si(e){const t=e.store(kr),n=e.store(ir);return e.store(Pr).get(Rr).next(e=>{const r=[];return n.ee((n,s)=>{const i=new en(n),o=[0,tr(i)];r.push(t.get(o).next(n=>{return n?On.resolve():(r=i,t.put({targetId:0,path:tr(r),sequenceNumber:e.highestListenSequenceNumber}));var r}))}).next(()=>On.waitFor(r))})}bi(e,t){e.createObjectStore(Or,{keyPath:Mr});const n=t.store(Or),r=new tu,s=e=>{if(r.add(e)){const t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:tr(r)})}};return t.store(ir).ee({X:!0},(e,t)=>{const n=new en(e);return s(n.popLast())}).next(()=>t.store(gr).ee({X:!0},([e,t,n],r)=>{const i=sr(t);return s(i.popLast())}))}Di(e){const t=e.store(Sr);return t.ee((e,n)=>{const r=wc(n),s=Ic(this.serializer,r);return t.put(s)})}Ci(e,t){const n=t.store(ir),r=[];return n.ee((e,n)=>{const s=t.store(yr),i=(a=n,a.document?new rn(en.fromString(a.document.name).popFirst(5)):a.noDocument?rn.fromSegments(a.noDocument.path):a.unknownDocument?rn.fromSegments(a.unknownDocument.path):kt(36783)).path.toArray(),o={prefixPath:i.slice(0,i.length-2),collectionGroup:i[i.length-2],documentId:i[i.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};var a;r.push(s.put(o))}).next(()=>On.waitFor(r))}Fi(e,t){const n=t.store(ur),r=Lu(this.serializer),s=new el(nl.mi,this.serializer.yt);return n.J().next(e=>{const n=new Map;return e.forEach(e=>{let t=n.get(e.userId)??So();vc(this.serializer,e).keys().forEach(e=>t=t.add(e)),n.set(e.userId,t)}),On.forEach(n,(e,n)=>{const i=new It(n),o=kc.wt(this.serializer,i),a=s.getIndexManager(i),c=mu.wt(i,this.serializer,a,s.referenceDelegate);return new $u(r,c,o,a).recalculateAndSaveOverlaysForDocumentKeys(new ls(t,Qn.ce),e).next()})})}}function il(e){e.createObjectStore(kr,{keyPath:Nr}).createIndex(Dr,xr,{unique:!0}),e.createObjectStore(Sr,{keyPath:"targetId"}).createIndex(Cr,Ar,{unique:!0}),e.createObjectStore(Pr)}const ol="IndexedDbPersistence",al=18e5,cl=5e3,ul="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",ll="main";class hl{constructor(e,t,n,r,s,i,o,a,c,u,l=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Mi=s,this.window=i,this.document=o,this.xi=c,this.Oi=u,this.Ni=l,this.ci=null,this.li=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Bi=null,this.inForeground=!1,this.Li=null,this.ki=null,this.qi=Number.NEGATIVE_INFINITY,this.Qi=e=>Promise.resolve(),!hl.v())throw new Pt(Rt.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Ru(this,r),this.$i=t+ll,this.serializer=new fc(a),this.Ui=new Fn(this.$i,this.Ni,new sl(this.serializer)),this.hi=new Dc,this.Pi=new _u(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Lu(this.serializer),this.Ii=new Sc,this.window&&this.window.localStorage?this.Ki=this.window.localStorage:(this.Ki=null,!1===u&&St(ol,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Wi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new Pt(Rt.FAILED_PRECONDITION,ul);return this.Gi(),this.zi(),this.ji(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Pi.getHighestSequenceNumber(e))}).then(e=>{this.ci=new Qn(e,this.xi)}).then(()=>{this.li=!0}).catch(e=>(this.Ui&&this.Ui.close(),Promise.reject(e)))}Ji(e){return this.Qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ui.$(async t=>{null===t.newVersion&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Mi.enqueueAndForget(async()=>{this.started&&await this.Wi()}))}Wi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>fl(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Hi(e).next(e=>{e||(this.isPrimary=!1,this.Mi.enqueueRetryable(()=>this.Qi(!1)))})}).next(()=>this.Yi(e)).next(t=>this.isPrimary&&!t?this.Zi(e).next(()=>!1):!!t&&this.Xi(e).next(()=>!0))).catch(e=>{if(qn(e))return Et(ol,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return Et(ol,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Mi.enqueueRetryable(()=>this.Qi(e)),this.isPrimary=e})}Hi(e){return dl(e).get(ar).next(e=>On.resolve(this.es(e)))}ts(e){return fl(e).delete(this.clientId)}async ns(){if(this.isPrimary&&!this.rs(this.qi,al)){this.qi=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{const t=hs(e,Lr);return t.J().next(e=>{const n=this.ss(e,al),r=e.filter(e=>-1===n.indexOf(e));return On.forEach(r,e=>t.delete(e.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Ki)for(const t of e)this.Ki.removeItem(this._s(t.clientId))}}ji(){this.ki=this.Mi.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Wi().then(()=>this.ns()).then(()=>this.ji()))}es(e){return!!e&&e.ownerId===this.clientId}Yi(e){return this.Oi?On.resolve(!0):dl(e).get(ar).next(t=>{if(null!==t&&this.rs(t.leaseTimestampMs,cl)&&!this.us(t.ownerId)){if(this.es(t)&&this.networkEnabled)return!0;if(!this.es(t)){if(!t.allowTabSynchronization)throw new Pt(Rt.FAILED_PRECONDITION,ul);return!1}}return!(!this.networkEnabled||!this.inForeground)||fl(e).J().next(e=>void 0===this.ss(e,cl).find(e=>{if(this.clientId!==e.clientId){const t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&Et(ol,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.li=!1,this.cs(),this.ki&&(this.ki.cancel(),this.ki=null),this.ls(),this.hs(),await this.Ui.runTransaction("shutdown","readwrite",[or,Lr],e=>{const t=new ls(e,Qn.ce);return this.Zi(t).next(()=>this.ts(t))}),this.Ui.close(),this.Ps()}ss(e,t){return e.filter(e=>this.rs(e.updateTimeMs,t)&&!this.us(e.clientId))}Ts(){return this.runTransaction("getActiveClients","readonly",e=>fl(e).J().next(e=>this.ss(e,al).map(e=>e.clientId)))}get started(){return this.li}getGlobalsCache(){return this.hi}getMutationQueue(e,t){return mu.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new su(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return kc.wt(this.serializer,e)}getBundleCache(){return this.Ii}runTransaction(e,t,n){Et(ol,"Starting transaction:",e);const r="readonly"===t?"readonly":"readwrite",s=18===(i=this.Ni)?us:17===i?cs:16===i?as:15===i?os:14===i?is:13===i?ss:12===i?rs:11===i?ns:void kt(60245);var i;let o;return this.Ui.runTransaction(e,r,s,r=>(o=new ls(r,this.ci?this.ci.next():Qn.ce),"readwrite-primary"===t?this.Hi(o).next(e=>!!e||this.Yi(o)).next(t=>{if(!t)throw St(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Mi.enqueueRetryable(()=>this.Qi(!1)),new Pt(Rt.FAILED_PRECONDITION,xn);return n(o)}).next(e=>this.Xi(o).next(()=>e)):this.Is(o).next(()=>n(o)))).then(e=>(o.raiseOnCommittedEvent(),e))}Is(e){return dl(e).get(ar).next(e=>{if(null!==e&&this.rs(e.leaseTimestampMs,cl)&&!this.us(e.ownerId)&&!this.es(e)&&!(this.Oi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new Pt(Rt.FAILED_PRECONDITION,ul)})}Xi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return dl(e).put(ar,t)}static v(){return Fn.v()}Zi(e){const t=dl(e);return t.get(ar).next(e=>this.es(e)?(Et(ol,"Releasing primary lease."),t.delete(ar)):On.resolve())}rs(e,t){const n=Date.now();return!(e<n-t||e>n&&(St(`Detected an update time that is in the future: ${e} > ${n}`),1))}Gi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Li=()=>{this.Mi.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.Wi()))},this.document.addEventListener("visibilitychange",this.Li),this.inForeground="visible"===this.document.visibilityState)}ls(){this.Li&&(this.document.removeEventListener("visibilitychange",this.Li),this.Li=null)}zi(){var e;"function"==typeof(null==(e=this.window)?void 0:e.addEventListener)&&(this.Bi=()=>{this.cs();const e=/(?:Version|Mobile)\/1[456]/;v()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Mi.enterRestrictedMode(!0),this.Mi.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Bi))}hs(){this.Bi&&(this.window.removeEventListener("pagehide",this.Bi),this.Bi=null)}us(e){var t;try{const n=null!==(null==(t=this.Ki)?void 0:t.getItem(this._s(e)));return Et(ol,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return St(ol,"Failed to get zombied client id.",n),!1}}cs(){if(this.Ki)try{this.Ki.setItem(this._s(this.clientId),String(Date.now()))}catch(e){St("Failed to set zombie client id.",e)}}Ps(){if(this.Ki)try{this.Ki.removeItem(this._s(this.clientId))}catch(e){}}_s(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function dl(e){return hs(e,or)}function fl(e){return hs(e,Lr)}function pl(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+="."+e.database),"firestore/"+t+"/"+n+"/"
/**
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
 */}class ml{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Es=n,this.ds=r}static As(e,t){let n=So(),r=So();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:r=r.add(s.doc.key)}return new ml(e,t.fromCache,n,r)}}
/**
 * @license
 * Copyright 2023 Google LLC
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
 */class gl{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}
/**
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
 */class yl{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=v()?8:Vn(g())>0?6:4}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,r){const s={result:null};return this.ys(e,t).next(e=>{s.result=e}).next(()=>{if(!s.result)return this.ws(e,t,r,n).next(e=>{s.result=e})}).next(()=>{if(s.result)return;const n=new gl;return this.Ss(e,t,n).next(r=>{if(s.result=r,this.Vs)return this.bs(e,t,n,r.size)})}).next(()=>s.result)}bs(e,t,n,r){return n.documentReadCount<this.fs?(Tt()<=L.DEBUG&&Et("QueryEngine","SDK will not create cache indexes for query:",co(t),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),On.resolve()):(Tt()<=L.DEBUG&&Et("QueryEngine","Query:",co(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.gs*r?(Tt()<=L.DEBUG&&Et("QueryEngine","The SDK decides to create cache indexes for query:",co(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,to(t))):On.resolve())}ys(e,t){if(Xi(t))return On.resolve(null);let n=to(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(t=io(t,null,"F"),n=to(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{const s=So(...r);return this.ps.getDocuments(e,s).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{const i=this.Ds(t,r);return this.Cs(t,i,s,n.readTime)?this.ys(e,io(t,null,"F")):this.vs(e,i,t,n)}))})))}ws(e,t,n,r){return Xi(t)||r.isEqual(vn.min())?On.resolve(null):this.ps.getDocuments(e,n).next(s=>{const i=this.Ds(t,s);return this.Cs(t,i,n,r)?On.resolve(null):(Tt()<=L.DEBUG&&Et("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),co(t)),this.vs(e,i,t,An(r,wn)).next(e=>e))})}Ds(e,t){let n=new ws(ho(e));return t.forEach((t,r)=>{uo(e,r)&&(n=n.add(r))}),n}Cs(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;const s="F"===e.limitType?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(r)>0)}Ss(e,t,n){return Tt()<=L.DEBUG&&Et("QueryEngine","Using full collection scan to execute query:",co(t)),this.ps.getDocumentsMatchingQuery(e,t,Nn.min(),n)}vs(e,t,n,r){return this.ps.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}
/**
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
 */const vl="LocalStore";class wl{constructor(e,t,n,r){this.persistence=e,this.Fs=t,this.serializer=r,this.Ms=new gs(Gt),this.xs=new po(e=>zi(e),$i),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(n)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new $u(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Ms))}}function Il(e,t,n,r){return new wl(e,t,n,r)}async function _l(e,t){const n=xt(e);return await n.persistence.runTransaction("Handle user change","readonly",e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next(s=>(r=s,n.Bs(t),n.mutationQueue.getAllMutationBatches(e))).next(t=>{const s=[],i=[];let o=So();for(const e of r){s.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}for(const e of t){i.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next(e=>({Ls:e,removedBatchIds:s,addedBatchIds:i}))})})}function bl(e){const t=xt(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Pi.getLastRemoteSnapshotVersion(e))}function Tl(e,t,n){let r=So(),s=So();return n.forEach(e=>r=r.add(e)),t.getEntries(e,r).next(e=>{let r=go();return n.forEach((n,i)=>{const o=e.get(n);i.isFoundDocument()!==o.isFoundDocument()&&(s=s.add(n)),i.isNoDocument()&&i.version.isEqual(vn.min())?(t.removeEntry(n,i.readTime),r=r.insert(n,i)):!o.isValidDocument()||i.version.compareTo(o.version)>0||0===i.version.compareTo(o.version)&&o.hasPendingWrites?(t.addEntry(i),r=r.insert(n,i)):Et(vl,"Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",i.version)}),{ks:r,qs:s}})}function El(e,t){const n=xt(e);return n.persistence.runTransaction("Get next mutation batch","readonly",e=>(void 0===t&&(t=Jn),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t)))}function Sl(e,t){const n=xt(e);return n.persistence.runTransaction("Allocate target","readwrite",e=>{let r;return n.Pi.getTargetData(e,t).next(s=>s?(r=s,On.resolve(r)):n.Pi.allocateTargetId(e).next(s=>(r=new dc(t,s,"TargetPurposeListen",e.currentSequenceNumber),n.Pi.addTargetData(e,r).next(()=>r))))}).then(e=>{const r=n.Ms.get(e.targetId);return(null===r||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.Ms=n.Ms.insert(e.targetId,e),n.xs.set(t,e.targetId)),e})}async function Cl(e,t,n){const r=xt(e),s=r.Ms.get(t),i=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",i,e=>r.persistence.referenceDelegate.removeTarget(e,s))}catch(o){if(!qn(o))throw o;Et(vl,`Failed to update sequence numbers for target ${t}: ${o}`)}r.Ms=r.Ms.remove(t),r.xs.delete(s.target)}function Al(e,t,n){const r=xt(e);let s=vn.min(),i=So();return r.persistence.runTransaction("Execute query","readwrite",e=>function(e,t,n){const r=xt(e),s=r.xs.get(n);return void 0!==s?On.resolve(r.Ms.get(s)):r.Pi.getTargetData(t,n)}(r,e,to(t)).next(t=>{if(t)return s=t.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(e,t.targetId).next(e=>{i=e})}).next(()=>r.Fs.getDocumentsMatchingQuery(e,t,n?s:vn.min(),n?i:So())).next(e=>(Dl(r,lo(t),e),{documents:e,Qs:i})))}function kl(e,t){const n=xt(e),r=xt(n.Pi),s=n.Ms.get(t);return s?Promise.resolve(s.target):n.persistence.runTransaction("Get target data","readonly",e=>r.At(e,t).next(e=>e?e.target:null))}function Nl(e,t){const n=xt(e),r=n.Os.get(t)||vn.min();return n.persistence.runTransaction("Get new document changes","readonly",e=>n.Ns.getAllFromCollectionGroup(e,t,An(r,wn),Number.MAX_SAFE_INTEGER)).then(e=>(Dl(n,t,e),e))}function Dl(e,t,n){let r=e.Os.get(t)||vn.min();n.forEach((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)}),e.Os.set(t,r)}async function xl(e,t,n=So()){const r=await Sl(e,to(_c(t.bundledQuery))),s=xt(e);return s.persistence.runTransaction("Save named query","readwrite",e=>{const i=Ua(t.readTime);if(r.snapshotVersion.compareTo(i)>=0)return s.Ii.saveNamedQuery(e,t);const o=r.withResumeToken(Es.EMPTY_BYTE_STRING,i);return s.Ms=s.Ms.insert(o.targetId,o),s.Pi.updateTargetData(e,o).next(()=>s.Pi.removeMatchingKeysForTargetId(e,r.targetId)).next(()=>s.Pi.addMatchingKeys(e,n,r.targetId)).next(()=>s.Ii.saveNamedQuery(e,t))})}
/**
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
 */const Rl="firestore_clients";function Pl(e,t){return`${Rl}_${e}_${t}`}const Ol="firestore_mutations";function Ml(e,t,n){let r=`${Ol}_${e}_${n}`;return t.isAuthenticated()&&(r+=`_${t.uid}`),r}const Ll="firestore_targets";function Fl(e,t){return`${Ll}_${e}_${t}`}
/**
 * @license
 * Copyright 2018 Google LLC
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
 */const Vl="SharedClientState";class Ul{constructor(e,t,n,r){this.user=e,this.batchId=t,this.state=n,this.error=r}static Ws(e,t,n){const r=JSON.parse(n);let s,i="object"==typeof r&&-1!==["pending","acknowledged","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error);return i&&r.error&&(i="string"==typeof r.error.message&&"string"==typeof r.error.code,i&&(s=new Pt(r.error.code,r.error.message))),i?new Ul(e,t,r.state,s):(St(Vl,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Gs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Bl{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Ws(e,t){const n=JSON.parse(t);let r,s="object"==typeof n&&-1!==["not-current","current","rejected"].indexOf(n.state)&&(void 0===n.error||"object"==typeof n.error);return s&&n.error&&(s="string"==typeof n.error.message&&"string"==typeof n.error.code,s&&(r=new Pt(n.error.code,n.error.message))),s?new Bl(e,n.state,r):(St(Vl,`Failed to parse target state for ID '${e}': ${t}`),null)}Gs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class ql{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Ws(e,t){const n=JSON.parse(t);let r="object"==typeof n&&n.activeTargetIds instanceof Array,s=Ao();for(let i=0;r&&i<n.activeTargetIds.length;++i)r=Zn(n.activeTargetIds[i]),s=s.add(n.activeTargetIds[i]);return r?new ql(e,s):(St(Vl,`Failed to parse client data for instance '${e}': ${t}`),null)}}class jl{constructor(e,t){this.clientId=e,this.onlineState=t}static Ws(e){const t=JSON.parse(e);return"object"==typeof t&&-1!==["Unknown","Online","Offline"].indexOf(t.onlineState)&&"string"==typeof t.clientId?new jl(t.clientId,t.onlineState):(St(Vl,`Failed to parse online state: ${e}`),null)}}class zl{constructor(){this.activeTargetIds=Ao()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class $l{constructor(e,t,n,r,s){this.window=e,this.Mi=t,this.persistenceKey=n,this.Js=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Hs=this.Ys.bind(this),this.Zs=new gs(Gt),this.started=!1,this.Xs=[];const i=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=s,this.eo=Pl(this.persistenceKey,this.Js),this.no=`firestore_sequence_number_${this.persistenceKey}`,this.Zs=this.Zs.insert(this.Js,new zl),this.ro=new RegExp(`^${Rl}_${i}_([^_]*)$`),this.io=new RegExp(`^${Ol}_${i}_(\\d+)(?:_(.*))?$`),this.so=new RegExp(`^${Ll}_${i}_(\\d+)$`),this.oo=function(e){return`firestore_online_state_${e}`}(this.persistenceKey),this._o=function(e){return`firestore_bundle_loaded_v2_${e}`}(this.persistenceKey),this.window.addEventListener("storage",this.Hs)}static v(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ts();for(const n of e){if(n===this.Js)continue;const e=this.getItem(Pl(this.persistenceKey,n));if(e){const t=ql.Ws(n,e);t&&(this.Zs=this.Zs.insert(t.clientId,t))}}this.ao();const t=this.storage.getItem(this.oo);if(t){const e=this.uo(t);e&&this.co(e)}for(const n of this.Xs)this.Ys(n);this.Xs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.no,JSON.stringify(e))}getAllActiveQueryTargets(){return this.lo(this.Zs)}isActiveQueryTarget(e){let t=!1;return this.Zs.forEach((n,r)=>{r.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.ho(e,"pending")}updateMutationState(e,t,n){this.ho(e,t,n),this.Po(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const t=this.storage.getItem(Fl(this.persistenceKey,e));if(t){const r=Bl.Ws(e,t);r&&(n=r.state)}}return t&&this.To.zs(e),this.ao(),n}removeLocalQueryTarget(e){this.To.js(e),this.ao()}isLocalQueryTarget(e){return this.To.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Fl(this.persistenceKey,e))}updateQueryState(e,t,n){this.Io(e,t,n)}handleUserChange(e,t,n){t.forEach(e=>{this.Po(e)}),this.currentUser=e,n.forEach(e=>{this.addPendingMutation(e)})}setOnlineState(e){this.Eo(e)}notifyBundleLoaded(e){this.Ao(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Hs),this.removeItem(this.eo),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return Et(Vl,"READ",e,t),t}setItem(e,t){Et(Vl,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){Et(Vl,"REMOVE",e),this.storage.removeItem(e)}Ys(e){const t=e;if(t.storageArea===this.storage){if(Et(Vl,"EVENT",t.key,t.newValue),t.key===this.eo)return void St("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Mi.enqueueRetryable(async()=>{if(this.started){if(null!==t.key)if(this.ro.test(t.key)){if(null==t.newValue){const e=this.Ro(t.key);return this.Vo(e,null)}{const e=this.mo(t.key,t.newValue);if(e)return this.Vo(e.clientId,e)}}else if(this.io.test(t.key)){if(null!==t.newValue){const e=this.fo(t.key,t.newValue);if(e)return this.po(e)}}else if(this.so.test(t.key)){if(null!==t.newValue){const e=this.yo(t.key,t.newValue);if(e)return this.wo(e)}}else if(t.key===this.oo){if(null!==t.newValue){const e=this.uo(t.newValue);if(e)return this.co(e)}}else if(t.key===this.no){const e=function(e){let t=Qn.ce;if(null!=e)try{const n=JSON.parse(e);Dt("number"==typeof n,30636,{So:e}),t=n}catch(n){St(Vl,"Failed to read sequence number from WebStorage",n)}return t}(t.newValue);e!==Qn.ce&&this.sequenceNumberHandler(e)}else if(t.key===this._o){const e=this.bo(t.newValue);await Promise.all(e.map(e=>this.syncEngine.Do(e)))}}else this.Xs.push(t)})}}get To(){return this.Zs.get(this.Js)}ao(){this.setItem(this.eo,this.To.Gs())}ho(e,t,n){const r=new Ul(this.currentUser,e,t,n),s=Ml(this.persistenceKey,this.currentUser,e);this.setItem(s,r.Gs())}Po(e){const t=Ml(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Eo(e){const t={clientId:this.Js,onlineState:e};this.storage.setItem(this.oo,JSON.stringify(t))}Io(e,t,n){const r=Fl(this.persistenceKey,e),s=new Bl(e,t,n);this.setItem(r,s.Gs())}Ao(e){const t=JSON.stringify(Array.from(e));this.setItem(this._o,t)}Ro(e){const t=this.ro.exec(e);return t?t[1]:null}mo(e,t){const n=this.Ro(e);return ql.Ws(n,t)}fo(e,t){const n=this.io.exec(e),r=Number(n[1]),s=void 0!==n[2]?n[2]:null;return Ul.Ws(new It(s),r,t)}yo(e,t){const n=this.so.exec(e),r=Number(n[1]);return Bl.Ws(r,t)}uo(e){return jl.Ws(e)}bo(e){return JSON.parse(e)}async po(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Co(e.batchId,e.state,e.error);Et(Vl,`Ignoring mutation for non-active user ${e.user.uid}`)}wo(e){return this.syncEngine.vo(e.targetId,e.state,e.error)}Vo(e,t){const n=t?this.Zs.insert(e,t):this.Zs.remove(e),r=this.lo(this.Zs),s=this.lo(n),i=[],o=[];return s.forEach(e=>{r.has(e)||i.push(e)}),r.forEach(e=>{s.has(e)||o.push(e)}),this.syncEngine.Fo(i,o).then(()=>{this.Zs=n})}co(e){this.Zs.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}lo(e){let t=Ao();return e.forEach((e,n)=>{t=t.unionWith(n.activeTargetIds)}),t}}class Gl{constructor(){this.Mo=new zl,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,t,n){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new zl,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}
/**
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
 */class Kl{Oo(e){}shutdown(){}}
/**
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
 */const Hl="ConnectivityMonitor";class Wl{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){Et(Hl,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){Et(Hl,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
/**
 * @license
 * Copyright 2023 Google LLC
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
 */let Ql=null;function Jl(){return null===Ql?Ql=268435456+Math.round(2147483648*Math.random()):Ql++,"0x"+Ql.toString(16)
/**
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
 */}const Yl="RestConnection",Xl={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Zl{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Uo=t+"://"+e.host,this.Ko=`projects/${n}/databases/${r}`,this.Wo=this.databaseId.database===Fs?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Go(e,t,n,r,s){const i=Jl(),o=this.zo(e,t.toUriEncodedString());Et(Yl,`Sending RPC '${e}' ${i}:`,o,n);const a={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(a,r,s);const{host:c}=new URL(o),u=h(c);return this.Jo(e,o,a,n,u).then(t=>(Et(Yl,`Received RPC '${e}' ${i}: `,t),t),t=>{throw Ct(Yl,`RPC '${e}' ${i} failed with error: `,t,"url: ",o,"request:",n),t})}Ho(e,t,n,r,s,i){return this.Go(e,t,n,r,s)}jo(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+_t,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}zo(e,t){const n=Xl[e];return`${this.Uo}/v1/${t}:${n}`}terminate(){}}
/**
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
 */class eh{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}
/**
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
 */const th="WebChannelConnection";class nh extends Zl{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,n,r,s){const i=Jl();return new Promise((s,o)=>{const a=new ut;a.setWithCredentials(!0),a.listenOnce(ht.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case dt.NO_ERROR:const t=a.getResponseJson();Et(th,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(t)),s(t);break;case dt.TIMEOUT:Et(th,`RPC '${e}' ${i} timed out`),o(new Pt(Rt.DEADLINE_EXCEEDED,"Request time out"));break;case dt.HTTP_ERROR:const n=a.getStatus();if(Et(th,`RPC '${e}' ${i} failed with status:`,n,"response text:",a.getResponseText()),n>0){let e=a.getResponseJson();Array.isArray(e)&&(e=e[0]);const t=null==e?void 0:e.error;if(t&&t.status&&t.message){const e=function(e){const t=e.toLowerCase().replace(/_/g,"-");return Object.values(Rt).indexOf(t)>=0?t:Rt.UNKNOWN}(t.status);o(new Pt(e,t.message))}else o(new Pt(Rt.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new Pt(Rt.UNAVAILABLE,"Connection failed."));break;default:kt(9055,{l_:e,streamId:i,h_:a.getLastErrorCode(),P_:a.getLastError()})}}finally{Et(th,`RPC '${e}' ${i} completed.`)}});const c=JSON.stringify(r);Et(th,`RPC '${e}' ${i} sending request:`,r),a.send(t,"POST",c,n,15)})}T_(e,t,n){const r=Jl(),s=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],i=gt(),o=mt(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;void 0!==c&&(a.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(a.useFetchStreams=!0),this.jo(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const u=s.join("");Et(th,`Creating RPC '${e}' stream ${r}: ${u}`,a);const l=i.createWebChannel(u,a);this.I_(l);let h=!1,d=!1;const f=new eh({Yo:t=>{d?Et(th,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(h||(Et(th,`Opening RPC '${e}' stream ${r} transport.`),l.open(),h=!0),Et(th,`RPC '${e}' stream ${r} sending:`,t),l.send(t))},Zo:()=>l.close()}),p=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(t){setTimeout(()=>{throw t},0)}})};return p(l,lt.EventType.OPEN,()=>{d||(Et(th,`RPC '${e}' stream ${r} transport opened.`),f.o_())}),p(l,lt.EventType.CLOSE,()=>{d||(d=!0,Et(th,`RPC '${e}' stream ${r} transport closed`),f.a_(),this.E_(l))}),p(l,lt.EventType.ERROR,t=>{d||(d=!0,Ct(th,`RPC '${e}' stream ${r} transport errored. Name:`,t.name,"Message:",t.message),f.a_(new Pt(Rt.UNAVAILABLE,"The operation could not be completed")))}),p(l,lt.EventType.MESSAGE,t=>{var n;if(!d){const s=t.data[0];Dt(!!s,16349);const i=s,o=(null==i?void 0:i.error)||(null==(n=i[0])?void 0:n.error);if(o){Et(th,`RPC '${e}' stream ${r} received error:`,o);const t=o.status;let n=function(e){const t=ha[e];if(void 0!==t)return pa(t)}(t),s=o.message;void 0===n&&(n=Rt.INTERNAL,s="Unknown error status: "+t+" with message "+o.message),d=!0,f.a_(new Pt(n,s)),l.close()}else Et(th,`RPC '${e}' stream ${r} received:`,s),f.u_(s)}}),p(o,pt.STAT_EVENT,t=>{t.stat===ft.PROXY?Et(th,`RPC '${e}' stream ${r} detected buffering proxy`):t.stat===ft.NOPROXY&&Et(th,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{f.__()},0),f}terminate(){this.c_.forEach(e=>e.close()),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter(t=>t===e)}}
/**
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
 */
/**
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
 */function rh(){return"undefined"!=typeof window?window:null}function sh(){return"undefined"!=typeof document?document:null}
/**
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
 */function ih(e){return new Oa(e,!0)}
/**
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
 */class oh{constructor(e,t,n=1e3,r=1.5,s=6e4){this.Mi=e,this.timerId=t,this.d_=n,this.A_=r,this.R_=s,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-n);r>0&&Et("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){null!==this.m_&&(this.m_.skipDelay(),this.m_=null)}cancel(){null!==this.m_&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}
/**
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
 */const ah="PersistentStream";class ch{constructor(e,t,n,r,s,i,o,a){this.Mi=e,this.S_=n,this.b_=r,this.connection=s,this.authCredentialsProvider=i,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new oh(e,t)}x_(){return 1===this.state||5===this.state||this.O_()}O_(){return 2===this.state||3===this.state}start(){this.F_=0,4!==this.state?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&null===this.C_&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,4!==e?this.M_.reset():t&&t.code===Rt.RESOURCE_EXHAUSTED?(St(t.toString()),St("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===Rt.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.D_===t&&this.G_(e,n)},t=>{e(()=>{const e=new Pt(Rt.UNKNOWN,"Fetching auth token failed: "+t.message);return this.z_(e)})})}G_(e,t){const n=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo(()=>{n(()=>this.listener.Xo())}),this.stream.t_(()=>{n(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(e=>{n(()=>this.z_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.F_?this.J_(e):this.onNext(e))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return Et(ah,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget(()=>this.D_===e?t():(Et(ah,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class uh extends ch{constructor(e,t,n,r,s,i){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,i),this.serializer=s}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=function(e,t){let n;if("targetChange"in t){t.targetChange;const s="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:kt(39313,{state:r}),i=t.targetChange.targetIds||[],o=function(e,t){return e.useProto3Json?(Dt(void 0===t||"string"==typeof t,58123),Es.fromBase64String(t||"")):(Dt(void 0===t||t instanceof Buffer||t instanceof Uint8Array,16193),Es.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),a=t.targetChange.cause,c=a&&function(e){const t=void 0===e.code?Rt.UNKNOWN:pa(e.code);return new Pt(t,e.message||"")}(a);n=new Ca(s,i,o,c||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=$a(e,r.document.name),i=Ua(r.document.updateTime),o=r.document.createTime?Ua(r.document.createTime):vn.min(),a=new pi({mapValue:{fields:r.document.fields}}),c=gi.newFoundDocument(s,i,o,a),u=r.targetIds||[],l=r.removedTargetIds||[];n=new Ea(u,l,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=$a(e,r.document),i=r.readTime?Ua(r.readTime):vn.min(),o=gi.newNoDocument(s,i),a=r.removedTargetIds||[];n=new Ea([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=$a(e,r.document),i=r.removedTargetIds||[];n=new Ea([],i,s,null)}else{if(!("filter"in t))return kt(11601,{Rt:t});{t.filter;const e=t.filter;e.targetId;const{count:r=0,unchangedNames:s}=e,i=new la(r,s),o=e.targetId;n=new Sa(o,i)}}var r;return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return vn.min();const t=e.targetChange;return t.targetIds&&t.targetIds.length?vn.min():t.readTime?Ua(t.readTime):vn.min()}(e);return this.listener.H_(t,n)}Y_(e){const t={};t.database=Ha(this.serializer),t.addTarget=function(e,t){let n;const r=t.target;if(n=Gi(r)?{documents:Za(e,r)}:{query:ec(e,r).ft},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=Fa(e,t.resumeToken);const r=Ma(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(vn.min())>0){n.readTime=La(e,t.snapshotVersion.toTimestamp());const r=Ma(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);const n=function(e,t){const n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return kt(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.q_(t)}Z_(e){const t={};t.database=Ha(this.serializer),t.removeTarget=e,this.q_(t)}}class lh extends ch{constructor(e,t,n,r,s,i){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,i),this.serializer=s}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return Dt(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Dt(!e.writeResults||0===e.writeResults.length,55816),this.listener.ta()}onNext(e){Dt(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=function(e,t){return e&&e.length>0?(Dt(void 0!==t,14353),e.map(e=>function(e,t){let n=e.updateTime?Ua(e.updateTime):Ua(t);return n.isEqual(vn.min())&&(n=Ua(t)),new $o(n,e.transformResults||[])}(e,t))):[]}(e.writeResults,e.commitTime),n=Ua(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=Ha(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map(e=>Ya(this.serializer,e))};this.q_(t)}}
/**
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
 */class hh{}class dh extends hh{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new Pt(Rt.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,t,n,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,i])=>this.connection.Go(e,qa(t,n),r,s,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===Rt.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Pt(Rt.UNKNOWN,e.toString())})}Ho(e,t,n,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Ho(e,qa(t,n),r,i,o,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===Rt.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Pt(Rt.UNKNOWN,e.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class fh{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){0===this.oa&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){"Online"===this.state?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,"Online"===e&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(St(t),this.aa=!1):Et("OnlineStateTracker",t)}Pa(){null!==this._a&&(this._a.cancel(),this._a=null)}}
/**
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
 */const ph="RemoteStore";class mh{constructor(e,t,n,r,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=s,this.Aa.Oo(e=>{n.enqueueAndForget(async()=>{Eh(this)&&(Et(ph,"Restarting streams for network reachability change."),await async function(e){const t=xt(e);t.Ea.add(4),await yh(t),t.Ra.set("Unknown"),t.Ea.delete(4),await gh(t)}(this))})}),this.Ra=new fh(n,r)}}async function gh(e){if(Eh(e))for(const t of e.da)await t(!0)}async function yh(e){for(const t of e.da)await t(!1)}function vh(e,t){const n=xt(e);n.Ia.has(t.targetId)||(n.Ia.set(t.targetId,t),Th(n)?bh(n):zh(n).O_()&&Ih(n,t))}function wh(e,t){const n=xt(e),r=zh(n);n.Ia.delete(t),r.O_()&&_h(n,t),0===n.Ia.size&&(r.O_()?r.L_():Eh(n)&&n.Ra.set("Unknown"))}function Ih(e,t){if(e.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(vn.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}zh(e).Y_(t)}function _h(e,t){e.Va.Ue(t),zh(e).Z_(t)}function bh(e){e.Va=new ka({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),At:t=>e.Ia.get(t)||null,ht:()=>e.datastore.serializer.databaseId}),zh(e).start(),e.Ra.ua()}function Th(e){return Eh(e)&&!zh(e).x_()&&e.Ia.size>0}function Eh(e){return 0===xt(e).Ea.size}function Sh(e){e.Va=void 0}async function Ch(e){e.Ra.set("Online")}async function Ah(e){e.Ia.forEach((t,n)=>{Ih(e,t)})}async function kh(e,t){Sh(e),Th(e)?(e.Ra.ha(t),bh(e)):e.Ra.set("Unknown")}async function Nh(e,t,n){if(e.Ra.set("Online"),t instanceof Ca&&2===t.state&&t.cause)try{await async function(e,t){const n=t.cause;for(const r of t.targetIds)e.Ia.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.Ia.delete(r),e.Va.removeTarget(r))}(e,t)}catch(r){Et(ph,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await Dh(e,r)}else if(t instanceof Ea?e.Va.Ze(t):t instanceof Sa?e.Va.st(t):e.Va.tt(t),!n.isEqual(vn.min()))try{const t=await bl(e.localStore);n.compareTo(t)>=0&&await function(e,t){const n=e.Va.Tt(t);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const s=e.Ia.get(r);s&&e.Ia.set(r,s.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{const r=e.Ia.get(t);if(!r)return;e.Ia.set(t,r.withResumeToken(Es.EMPTY_BYTE_STRING,r.snapshotVersion)),_h(e,t);const s=new dc(r.target,t,n,r.sequenceNumber);Ih(e,s)}),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(s){Et(ph,"Failed to raise snapshot:",s),await Dh(e,s)}}async function Dh(e,t,n){if(!qn(t))throw t;e.Ea.add(1),await yh(e),e.Ra.set("Offline"),n||(n=()=>bl(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{Et(ph,"Retrying IndexedDB access"),await n(),e.Ea.delete(1),await gh(e)})}function xh(e,t){return t().catch(n=>Dh(e,n,t))}async function Rh(e){const t=xt(e),n=$h(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:Jn;for(;Ph(t);)try{const e=await El(t.localStore,r);if(null===e){0===t.Ta.length&&n.L_();break}r=e.batchId,Oh(t,e)}catch(s){await Dh(t,s)}Mh(t)&&Lh(t)}function Ph(e){return Eh(e)&&e.Ta.length<10}function Oh(e,t){e.Ta.push(t);const n=$h(e);n.O_()&&n.X_&&n.ea(t.mutations)}function Mh(e){return Eh(e)&&!$h(e).x_()&&e.Ta.length>0}function Lh(e){$h(e).start()}async function Fh(e){$h(e).ra()}async function Vh(e){const t=$h(e);for(const n of e.Ta)t.ea(n.mutations)}async function Uh(e,t,n){const r=e.Ta.shift(),s=aa.from(r,t,n);await xh(e,()=>e.remoteSyncer.applySuccessfulWrite(s)),await Rh(e)}async function Bh(e,t){t&&$h(e).X_&&await async function(e,t){if(fa(n=t.code)&&n!==Rt.ABORTED){const n=e.Ta.shift();$h(e).B_(),await xh(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await Rh(e)}var n}(e,t),Mh(e)&&Lh(e)}async function qh(e,t){const n=xt(e);n.asyncQueue.verifyOperationInProgress(),Et(ph,"RemoteStore received new credentials");const r=Eh(n);n.Ea.add(3),await yh(n),r&&n.Ra.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.Ea.delete(3),await gh(n)}async function jh(e,t){const n=xt(e);t?(n.Ea.delete(2),await gh(n)):t||(n.Ea.add(2),await yh(n),n.Ra.set("Unknown"))}function zh(e){return e.ma||(e.ma=function(e,t,n){const r=xt(e);return r.sa(),new uh(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Xo:Ch.bind(null,e),t_:Ah.bind(null,e),r_:kh.bind(null,e),H_:Nh.bind(null,e)}),e.da.push(async t=>{t?(e.ma.B_(),Th(e)?bh(e):e.Ra.set("Unknown")):(await e.ma.stop(),Sh(e))})),e.ma}function $h(e){return e.fa||(e.fa=function(e,t,n){const r=xt(e);return r.sa(),new lh(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Xo:()=>Promise.resolve(),t_:Fh.bind(null,e),r_:Bh.bind(null,e),ta:Vh.bind(null,e),na:Uh.bind(null,e)}),e.da.push(async t=>{t?(e.fa.B_(),await Rh(e)):(await e.fa.stop(),e.Ta.length>0&&(Et(ph,`Stopping write stream with ${e.Ta.length} pending writes`),e.Ta=[]))})),e.fa
/**
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
 */}class Gh{constructor(e,t,n,r,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=s,this.deferred=new Ot,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,s){const i=Date.now()+n,o=new Gh(e,t,i,r,s);return o.start(n),o}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new Pt(Rt.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Kh(e,t){if(St("AsyncQueue",`${t}: ${e}`),qn(e))return new Pt(Rt.UNAVAILABLE,`${t}: ${e}`);throw e}
/**
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
 */class Hh{static emptySet(e){return new Hh(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||rn.comparator(t.key,n.key):(e,t)=>rn.comparator(e.key,t.key),this.keyedMap=vo(),this.sortedSet=new gs(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Hh))return!1;if(this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){const n=new Hh;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}
/**
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
 */class Wh{constructor(){this.ga=new gs(rn.comparator)}track(e){const t=e.doc.key,n=this.ga.get(t);n?0!==e.type&&3===n.type?this.ga=this.ga.insert(t,e):3===e.type&&1!==n.type?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.ga=this.ga.remove(t):1===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):kt(63341,{Rt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal((t,n)=>{e.push(n)}),e}}class Qh{constructor(e,t,n,r,s,i,o,a,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=s,this.fromCache=i,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,r,s){const i=[];return t.forEach(e=>{i.push({type:0,doc:e})}),new Qh(e,t,Hh.emptySet(t),i,n,r,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&oo(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
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
 */class Jh{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class Yh{constructor(){this.queries=Xh(),this.onlineState="Unknown",this.Ca=new Set}terminate(){!function(e,t){const n=xt(e),r=n.queries;n.queries=Xh(),r.forEach((e,n)=>{for(const r of n.Sa)r.onError(t)})}(this,new Pt(Rt.ABORTED,"Firestore shutting down"))}}function Xh(){return new po(e=>ao(e),oo)}async function Zh(e,t){const n=xt(e);let r=3;const s=t.query;let i=n.queries.get(s);i?!i.ba()&&t.Da()&&(r=2):(i=new Jh,r=t.Da()?0:1);try{switch(r){case 0:i.wa=await n.onListen(s,!0);break;case 1:i.wa=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(o){const e=Kh(o,`Initialization of query '${co(t.query)}' failed`);return void t.onError(e)}n.queries.set(s,i),i.Sa.push(t),t.va(n.onlineState),i.wa&&t.Fa(i.wa)&&rd(n)}async function ed(e,t){const n=xt(e),r=t.query;let s=3;const i=n.queries.get(r);if(i){const e=i.Sa.indexOf(t);e>=0&&(i.Sa.splice(e,1),0===i.Sa.length?s=t.Da()?0:1:!i.ba()&&t.Da()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function td(e,t){const n=xt(e);let r=!1;for(const s of t){const e=s.query,t=n.queries.get(e);if(t){for(const e of t.Sa)e.Fa(s)&&(r=!0);t.wa=s}}r&&rd(n)}function nd(e,t,n){const r=xt(e),s=r.queries.get(t);if(s)for(const i of s.Sa)i.onError(n);r.queries.delete(t)}function rd(e){e.Ca.forEach(e=>{e.next()})}var sd,id;(id=sd||(sd={})).Ma="default",id.Cache="cache";class od{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){const t=[];for(const n of e.docChanges)3!==n.type&&t.push(n);e=new Qh(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache)return!0;if(!this.Da())return!0;const n="Offline"!==t;return(!this.options.qa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}ka(e){e=Qh.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==sd.Cache}}
/**
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
 */class ad{constructor(e,t){this.Qa=e,this.byteLength=t}$a(){return"metadata"in this.Qa}}
/**
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
 */class cd{constructor(e){this.serializer=e}$s(e){return $a(this.serializer,e)}Us(e){return e.metadata.exists?Ja(this.serializer,e.document,!1):gi.newNoDocument(this.$s(e.metadata.name),this.Ks(e.metadata.readTime))}Ks(e){return Ua(e)}}class ud{constructor(e,t){this.Ua=e,this.serializer=t,this.Ka=[],this.Wa=[],this.collectionGroups=new Set,this.progress=ld(e)}get queries(){return this.Ka}get documents(){return this.Wa}Ga(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.Qa.namedQuery)this.Ka.push(e.Qa.namedQuery);else if(e.Qa.documentMetadata){this.Wa.push({metadata:e.Qa.documentMetadata}),e.Qa.documentMetadata.exists||++t;const n=en.fromString(e.Qa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.Qa.document&&(this.Wa[this.Wa.length-1].document=e.Qa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,{...this.progress}):null}za(e){const t=new Map,n=new cd(this.serializer);for(const r of e)if(r.metadata.queries){const e=n.$s(r.metadata.name);for(const n of r.metadata.queries){const r=(t.get(n)||So()).add(e);t.set(n,r)}}return t}async ja(e){const t=await async function(e,t,n,r){const s=xt(e);let i=So(),o=go();for(const l of n){const e=t.$s(l.metadata.name);l.document&&(i=i.add(e));const n=t.Us(l);n.setReadTime(t.Ks(l.metadata.readTime)),o=o.insert(e,n)}const a=s.Ns.newChangeBuffer({trackRemovals:!0}),c=await Sl(s,(u=r,to(Yi(en.fromString(`__bundle__/docs/${u}`)))));var u;return s.persistence.runTransaction("Apply bundle documents","readwrite",e=>Tl(e,a,o).next(t=>(a.apply(e),t)).next(t=>s.Pi.removeMatchingKeysForTargetId(e,c.targetId).next(()=>s.Pi.addMatchingKeys(e,i,c.targetId)).next(()=>s.localDocuments.getLocalViewOfDocuments(e,t.ks,t.qs)).next(()=>t.ks)))}(e,new cd(this.serializer),this.Wa,this.Ua.id),n=this.za(this.documents);for(const r of this.Ka)await xl(e,r,n.get(r.name));return this.progress.taskState="Success",{progress:this.progress,Ja:this.collectionGroups,Ha:t}}}function ld(e){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:e.totalDocuments,totalBytes:e.totalBytes}}
/**
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
 */class hd{constructor(e){this.key=e}}class dd{constructor(e){this.key=e}}class fd{constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=So(),this.mutatedKeys=So(),this.eu=ho(e),this.tu=new Hh(this.eu)}get nu(){return this.Ya}ru(e,t){const n=t?t.iu:new Wh,r=t?t.tu:this.tu;let s=t?t.mutatedKeys:this.mutatedKeys,i=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{const u=r.get(e),l=uo(this.query,t)?t:null,h=!!u&&this.mutatedKeys.has(u.key),d=!!l&&(l.hasLocalMutations||this.mutatedKeys.has(l.key)&&l.hasCommittedMutations);let f=!1;u&&l?u.data.isEqual(l.data)?h!==d&&(n.track({type:3,doc:l}),f=!0):this.su(u,l)||(n.track({type:2,doc:l}),f=!0,(a&&this.eu(l,a)>0||c&&this.eu(l,c)<0)&&(o=!0)):!u&&l?(n.track({type:0,doc:l}),f=!0):u&&!l&&(n.track({type:1,doc:u}),f=!0,(a||c)&&(o=!0)),f&&(l?(i=i.add(l),s=d?s.add(e):s.delete(e)):(i=i.delete(e),s=s.delete(e)))}),null!==this.query.limit)for(;i.size>this.query.limit;){const e="F"===this.query.limitType?i.last():i.first();i=i.delete(e.key),s=s.delete(e.key),n.track({type:1,doc:e})}return{tu:i,iu:n,Cs:o,mutatedKeys:s}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const s=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const i=e.iu.ya();i.sort((e,t)=>function(e,t){const n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return kt(20277,{Rt:e})}};return n(e)-n(t)}(e.type,t.type)||this.eu(e.doc,t.doc)),this.ou(n),r=r??!1;const o=t&&!r?this._u():[],a=0===this.Xa.size&&this.current&&!r?1:0,c=a!==this.Za;return this.Za=a,0!==i.length||c?{snapshot:new Qh(this.query,e.tu,s,i,e.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:o}:{au:o}}va(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Wh,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(e=>this.Ya=this.Ya.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Ya=this.Ya.delete(e)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=So(),this.tu.forEach(e=>{this.uu(e.key)&&(this.Xa=this.Xa.add(e.key))});const t=[];return e.forEach(e=>{this.Xa.has(e)||t.push(new dd(e))}),this.Xa.forEach(n=>{e.has(n)||t.push(new hd(n))}),t}cu(e){this.Ya=e.Qs,this.Xa=So();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return Qh.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,0===this.Za,this.hasCachedResults)}}const pd="SyncEngine";class md{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class gd{constructor(e){this.key=e,this.hu=!1}}class yd{constructor(e,t,n,r,s,i){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=s,this.maxConcurrentLimboResolutions=i,this.Pu={},this.Tu=new po(e=>ao(e),oo),this.Iu=new Map,this.Eu=new Set,this.du=new gs(rn.comparator),this.Au=new Map,this.Ru=new Wu,this.Vu={},this.mu=new Map,this.fu=Iu.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return!0===this.gu}}async function vd(e,t,n=!0){const r=Hd(e);let s;const i=r.Tu.get(t);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lu()):s=await Id(r,t,n,!0),s}async function wd(e,t){const n=Hd(e);await Id(n,t,!0,!1)}async function Id(e,t,n,r){const s=await Sl(e.localStore,to(t)),i=s.targetId,o=e.sharedClientState.addLocalQueryTarget(i,n);let a;return r&&(a=await _d(e,t,i,"current"===o,s.resumeToken)),e.isPrimaryClient&&n&&vh(e.remoteStore,s),a}async function _d(e,t,n,r,s){e.pu=(t,n,r)=>async function(e,t,n,r){let s=t.view.ru(n);s.Cs&&(s=await Al(e.localStore,t.query,!1).then(({documents:e})=>t.view.ru(e,s)));const i=r&&r.targetChanges.get(t.targetId),o=r&&null!=r.targetMismatches.get(t.targetId),a=t.view.applyChanges(s,e.isPrimaryClient,i,o);return Pd(e,t.targetId,a.au),a.snapshot}(e,t,n,r);const i=await Al(e.localStore,t,!0),o=new fd(t,i.Qs),a=o.ru(i.documents),c=Ta.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,s),u=o.applyChanges(a,e.isPrimaryClient,c);Pd(e,n,u.au);const l=new md(t,n,o);return e.Tu.set(t,l),e.Iu.has(n)?e.Iu.get(n).push(t):e.Iu.set(n,[t]),u.snapshot}async function bd(e,t,n){const r=xt(e),s=r.Tu.get(t),i=r.Iu.get(s.targetId);if(i.length>1)return r.Iu.set(s.targetId,i.filter(e=>!oo(e,t))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Cl(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),n&&wh(r.remoteStore,s.targetId),xd(r,s.targetId)}).catch(Pn)):(xd(r,s.targetId),await Cl(r.localStore,s.targetId,!0))}async function Td(e,t){const n=xt(e),r=n.Tu.get(t),s=n.Iu.get(r.targetId);n.isPrimaryClient&&1===s.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),wh(n.remoteStore,r.targetId))}async function Ed(e,t){const n=xt(e);try{const e=await function(e,t){const n=xt(e),r=t.snapshotVersion;let s=n.Ms;return n.persistence.runTransaction("Apply remote event","readwrite-primary",e=>{const i=n.Ns.newChangeBuffer({trackRemovals:!0});s=n.Ms;const o=[];t.targetChanges.forEach((i,a)=>{const c=s.get(a);if(!c)return;o.push(n.Pi.removeMatchingKeys(e,i.removedDocuments,a).next(()=>n.Pi.addMatchingKeys(e,i.addedDocuments,a)));let u=c.withSequenceNumber(e.currentSequenceNumber);var l,h,d;null!==t.targetMismatches.get(a)?u=u.withResumeToken(Es.EMPTY_BYTE_STRING,vn.min()).withLastLimboFreeSnapshotVersion(vn.min()):i.resumeToken.approximateByteSize()>0&&(u=u.withResumeToken(i.resumeToken,r)),s=s.insert(a,u),h=u,d=i,(0===(l=c).resumeToken.approximateByteSize()||h.snapshotVersion.toMicroseconds()-l.snapshotVersion.toMicroseconds()>=3e8||d.addedDocuments.size+d.modifiedDocuments.size+d.removedDocuments.size>0)&&o.push(n.Pi.updateTargetData(e,u))});let a=go(),c=So();if(t.documentUpdates.forEach(r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))}),o.push(Tl(e,i,t.documentUpdates).next(e=>{a=e.ks,c=e.qs})),!r.isEqual(vn.min())){const t=n.Pi.getLastRemoteSnapshotVersion(e).next(t=>n.Pi.setTargetsMetadata(e,e.currentSequenceNumber,r));o.push(t)}return On.waitFor(o).next(()=>i.apply(e)).next(()=>n.localDocuments.getLocalViewOfDocuments(e,a,c)).next(()=>a)}).then(e=>(n.Ms=s,e))}(n.localStore,t);t.targetChanges.forEach((e,t)=>{const r=n.Au.get(t);r&&(Dt(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1,22616),e.addedDocuments.size>0?r.hu=!0:e.modifiedDocuments.size>0?Dt(r.hu,14607):e.removedDocuments.size>0&&(Dt(r.hu,42227),r.hu=!1))}),await Ld(n,e,t)}catch(r){await Pn(r)}}function Sd(e,t,n){const r=xt(e);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const e=[];r.Tu.forEach((n,r)=>{const s=r.view.va(t);s.snapshot&&e.push(s.snapshot)}),function(e,t){const n=xt(e);n.onlineState=t;let r=!1;n.queries.forEach((e,n)=>{for(const s of n.Sa)s.va(t)&&(r=!0)}),r&&rd(n)}(r.eventManager,t),e.length&&r.Pu.H_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function Cd(e,t,n){const r=xt(e);r.sharedClientState.updateQueryState(t,"rejected",n);const s=r.Au.get(t),i=s&&s.key;if(i){let e=new gs(rn.comparator);e=e.insert(i,gi.newNoDocument(i,vn.min()));const n=So().add(i),s=new ba(vn.min(),new Map,new gs(Gt),e,n);await Ed(r,s),r.du=r.du.remove(i),r.Au.delete(t),Md(r)}else await Cl(r.localStore,t,!1).then(()=>xd(r,t,n)).catch(Pn)}async function Ad(e,t){const n=xt(e),r=t.batch.batchId;try{const e=await function(e,t){const n=xt(e);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{const r=t.batch.keys(),s=n.Ns.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){const s=n.batch,i=s.keys();let o=On.resolve();return i.forEach(e=>{o=o.next(()=>r.getEntry(t,e)).next(t=>{const i=n.docVersions.get(e);Dt(null!==i,48541),t.version.compareTo(i)<0&&(s.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),o.next(()=>e.mutationQueue.removeMutationBatch(t,s))}(n,e,t,s).next(()=>s.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=So();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))})}(n.localStore,t);Dd(n,r,null),Nd(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Ld(n,e)}catch(s){await Pn(s)}}async function kd(e,t,n){const r=xt(e);try{const e=await function(e,t){const n=xt(e);return n.persistence.runTransaction("Reject batch","readwrite-primary",e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next(t=>(Dt(null!==t,37113),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t))).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r)).next(()=>n.localDocuments.getDocuments(e,r))})}(r.localStore,t);Dd(r,t,n),Nd(r,t),r.sharedClientState.updateMutationState(t,"rejected",n),await Ld(r,e)}catch(s){await Pn(s)}}function Nd(e,t){(e.mu.get(t)||[]).forEach(e=>{e.resolve()}),e.mu.delete(t)}function Dd(e,t,n){const r=xt(e);let s=r.Vu[r.currentUser.toKey()];if(s){const e=s.get(t);e&&(n?e.reject(n):e.resolve(),s=s.remove(t)),r.Vu[r.currentUser.toKey()]=s}}function xd(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.Iu.get(t))e.Tu.delete(r),n&&e.Pu.yu(r,n);e.Iu.delete(t),e.isPrimaryClient&&e.Ru.jr(t).forEach(t=>{e.Ru.containsKey(t)||Rd(e,t)})}function Rd(e,t){e.Eu.delete(t.path.canonicalString());const n=e.du.get(t);null!==n&&(wh(e.remoteStore,n),e.du=e.du.remove(t),e.Au.delete(n),Md(e))}function Pd(e,t,n){for(const r of n)r instanceof hd?(e.Ru.addReference(r.key,t),Od(e,r)):r instanceof dd?(Et(pd,"Document no longer in limbo: "+r.key),e.Ru.removeReference(r.key,t),e.Ru.containsKey(r.key)||Rd(e,r.key)):kt(19791,{wu:r})}function Od(e,t){const n=t.key,r=n.path.canonicalString();e.du.get(n)||e.Eu.has(r)||(Et(pd,"New document in limbo: "+n),e.Eu.add(r),Md(e))}function Md(e){for(;e.Eu.size>0&&e.du.size<e.maxConcurrentLimboResolutions;){const t=e.Eu.values().next().value;e.Eu.delete(t);const n=new rn(en.fromString(t)),r=e.fu.next();e.Au.set(r,new gd(n)),e.du=e.du.insert(n,r),vh(e.remoteStore,new dc(to(Yi(n.path)),r,"TargetPurposeLimboResolution",Qn.ce))}}async function Ld(e,t,n){const r=xt(e),s=[],i=[],o=[];r.Tu.isEmpty()||(r.Tu.forEach((e,a)=>{o.push(r.pu(a,t,n).then(e=>{var t;if((e||n)&&r.isPrimaryClient){const s=e?!e.fromCache:null==(t=null==n?void 0:n.targetChanges.get(a.targetId))?void 0:t.current;r.sharedClientState.updateQueryState(a.targetId,s?"current":"not-current")}if(e){s.push(e);const t=ml.As(a.targetId,e);i.push(t)}}))}),await Promise.all(o),r.Pu.H_(s),await async function(e,t){const n=xt(e);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",e=>On.forEach(t,t=>On.forEach(t.Es,r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r)).next(()=>On.forEach(t.ds,r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))}catch(r){if(!qn(r))throw r;Et(vl,"Failed to update sequence numbers: "+r)}for(const s of t){const e=s.targetId;if(!s.fromCache){const t=n.Ms.get(e),r=t.snapshotVersion,s=t.withLastLimboFreeSnapshotVersion(r);n.Ms=n.Ms.insert(e,s)}}}(r.localStore,i))}async function Fd(e,t){const n=xt(e);if(!n.currentUser.isEqual(t)){Et(pd,"User change. New user:",t.toKey());const e=await _l(n.localStore,t);n.currentUser=t,s="'waitForPendingWrites' promise is rejected due to a user change.",(r=n).mu.forEach(e=>{e.forEach(e=>{e.reject(new Pt(Rt.CANCELLED,s))})}),r.mu.clear(),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await Ld(n,e.Ls)}var r,s}function Vd(e,t){const n=xt(e),r=n.Au.get(t);if(r&&r.hu)return So().add(r.key);{let e=So();const r=n.Iu.get(t);if(!r)return e;for(const t of r){const r=n.Tu.get(t);e=e.unionWith(r.view.nu)}return e}}async function Ud(e,t){const n=xt(e),r=await Al(n.localStore,t.query,!0),s=t.view.cu(r);return n.isPrimaryClient&&Pd(n,t.targetId,s.au),s}async function Bd(e,t){const n=xt(e);return Nl(n.localStore,t).then(e=>Ld(n,e))}async function qd(e,t,n,r){const s=xt(e),i=await function(e,t){const n=xt(e),r=xt(n.mutationQueue);return n.persistence.runTransaction("Lookup mutation documents","readonly",e=>r.er(e,t).next(t=>t?n.localDocuments.getDocuments(e,t):On.resolve(null)))}(s.localStore,t);var o,a;null!==i?("pending"===n?await Rh(s.remoteStore):"acknowledged"===n||"rejected"===n?(Dd(s,t,r||null),Nd(s,t),o=s.localStore,a=t,xt(xt(o).mutationQueue).ir(a)):kt(6720,"Unknown batchState",{Su:n}),await Ld(s,i)):Et(pd,"Cannot apply mutation batch with id: "+t)}async function jd(e,t,n){const r=xt(e),s=[],i=[];for(const o of t){let e;const t=r.Iu.get(o);if(t&&0!==t.length){e=await Sl(r.localStore,to(t[0]));for(const e of t){const t=r.Tu.get(e),n=await Ud(r,t);n.snapshot&&i.push(n.snapshot)}}else{const t=await kl(r.localStore,o);e=await Sl(r.localStore,t),await _d(r,zd(t),o,!1,e.resumeToken)}s.push(e)}return r.Pu.H_(i),s}function zd(e){return Ji(e.path,e.collectionGroup,e.orderBy,e.filters,e.limit,"F",e.startAt,e.endAt)}function $d(e){return t=xt(e).localStore,xt(xt(t).persistence).Ts();var t}async function Gd(e,t,n,r){const s=xt(e);if(s.gu)return void Et(pd,"Ignoring unexpected query state notification.");const i=s.Iu.get(t);if(i&&i.length>0)switch(n){case"current":case"not-current":{const e=await Nl(s.localStore,lo(i[0])),r=ba.createSynthesizedRemoteEventForCurrentChange(t,"current"===n,Es.EMPTY_BYTE_STRING);await Ld(s,e,r);break}case"rejected":await Cl(s.localStore,t,!0),xd(s,t,r);break;default:kt(64155,n)}}async function Kd(e,t,n){const r=Hd(e);if(r.gu){for(const e of t){if(r.Iu.has(e)&&r.sharedClientState.isActiveQueryTarget(e)){Et(pd,"Adding an already active target "+e);continue}const t=await kl(r.localStore,e),n=await Sl(r.localStore,t);await _d(r,zd(t),n.targetId,!1,n.resumeToken),vh(r.remoteStore,n)}for(const e of n)r.Iu.has(e)&&await Cl(r.localStore,e,!1).then(()=>{wh(r.remoteStore,e),xd(r,e)}).catch(Pn)}}function Hd(e){const t=xt(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=Ed.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Vd.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=Cd.bind(null,t),t.Pu.H_=td.bind(null,t.eventManager),t.Pu.yu=nd.bind(null,t.eventManager),t}function Wd(e){const t=xt(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Ad.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=kd.bind(null,t),t}class Qd{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ih(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Il(this.persistence,new yl,e.initialUser,this.serializer)}Cu(e){return new el(nl.mi,this.serializer)}Du(e){return new Gl}async terminate(){var e,t;null==(e=this.gcScheduler)||e.stop(),null==(t=this.indexBackfillerScheduler)||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Qd.provider={build:()=>new Qd};class Jd extends Qd{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){Dt(this.persistence.referenceDelegate instanceof rl,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Nu(n,e.asyncQueue,t)}Cu(e){const t=void 0!==this.cacheSizeBytes?du.withCacheSize(this.cacheSizeBytes):du.DEFAULT;return new el(e=>rl.mi(e,t),this.serializer)}}class Yd extends Qd{constructor(e,t,n){super(),this.xu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.xu.initialize(this,e),await Wd(this.xu.syncEngine),await Rh(this.xu.remoteStore),await this.persistence.Ji(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(e){return Il(this.persistence,new yl,e.initialUser,this.serializer)}Fu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Nu(n,e.asyncQueue,t)}Mu(e,t){const n=new Wn(t,this.persistence);return new Hn(e.asyncQueue,n)}Cu(e){const t=pl(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?du.withCacheSize(this.cacheSizeBytes):du.DEFAULT;return new hl(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,rh(),sh(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Du(e){return new Gl}}class Xd extends Yd{constructor(e,t){super(e,t,!1),this.xu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.xu.syncEngine;this.sharedClientState instanceof $l&&(this.sharedClientState.syncEngine={Co:qd.bind(null,t),vo:Gd.bind(null,t),Fo:Kd.bind(null,t),Ts:$d.bind(null,t),Do:Bd.bind(null,t)},await this.sharedClientState.start()),await this.persistence.Ji(async e=>{await async function(e,t){const n=xt(e);if(Hd(n),Wd(n),!0===t&&!0!==n.gu){const e=n.sharedClientState.getAllActiveQueryTargets(),t=await jd(n,e.toArray());n.gu=!0,await jh(n.remoteStore,!0);for(const r of t)vh(n.remoteStore,r)}else if(!1===t&&!1!==n.gu){const e=[];let t=Promise.resolve();n.Iu.forEach((r,s)=>{n.sharedClientState.isLocalQueryTarget(s)?e.push(s):t=t.then(()=>(xd(n,s),Cl(n.localStore,s,!0))),wh(n.remoteStore,s)}),await t,await jd(n,e),function(e){const t=xt(e);t.Au.forEach((e,n)=>{wh(t.remoteStore,n)}),t.Ru.Jr(),t.Au=new Map,t.du=new gs(rn.comparator)}(n),n.gu=!1,await jh(n.remoteStore,!1)}}(this.xu.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())})}Du(e){const t=rh();if(!$l.v(t))throw new Pt(Rt.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=pl(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new $l(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class Zd{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>Sd(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=Fd.bind(null,this.syncEngine),await jh(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new Yh}createDatastore(e){const t=ih(e.databaseInfo.databaseId),n=(r=e.databaseInfo,new nh(r));var r;return function(e,t,n,r){return new dh(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return t=this.localStore,n=this.datastore,r=e.asyncQueue,s=e=>Sd(this.syncEngine,e,0),i=Wl.v()?new Wl:new Kl,new mh(t,n,r,s,i);var t,n,r,s,i}createSyncEngine(e,t){return function(e,t,n,r,s,i,o){const a=new yd(e,t,n,r,s,i);return o&&(a.gu=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(e){const t=xt(e);Et(ph,"RemoteStore shutting down."),t.Ea.add(5),await yh(t),t.Aa.shutdown(),t.Ra.set("Unknown")}(this.remoteStore),null==(e=this.datastore)||e.terminate(),null==(t=this.eventManager)||t.terminate()}}function ef(e,t=10240){let n=0;return{async read(){if(n<e.byteLength){const r={value:e.slice(n,n+t),done:!1};return n+=t,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}
/**
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
 */
/**
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
 */Zd.provider={build:()=>new Zd};class tf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):St("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout(()=>{this.muted||e(t)},0)}}
/**
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
 */class nf{constructor(e,t){this.Bu=e,this.serializer=t,this.metadata=new Ot,this.buffer=new Uint8Array,this.Lu=new TextDecoder("utf-8"),this.ku().then(e=>{e&&e.$a()?this.metadata.resolve(e.Qa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null==e?void 0:e.Qa)}`))},e=>this.metadata.reject(e))}close(){return this.Bu.cancel()}async getMetadata(){return this.metadata.promise}async bu(){return await this.getMetadata(),this.ku()}async ku(){const e=await this.qu();if(null===e)return null;const t=this.Lu.decode(e),n=Number(t);isNaN(n)&&this.Qu(`length string (${t}) is not valid number`);const r=await this.$u(n);return new ad(JSON.parse(r),e.length+n)}Uu(){return this.buffer.findIndex(e=>e==="{".charCodeAt(0))}async qu(){for(;this.Uu()<0&&!(await this.Ku()););if(0===this.buffer.length)return null;const e=this.Uu();e<0&&this.Qu("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async $u(e){for(;this.buffer.length<e;)await this.Ku()&&this.Qu("Reached the end of bundle when more is expected.");const t=this.Lu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}Qu(e){throw this.Bu.cancel(),new Error(`Invalid bundle format: ${e}`)}async Ku(){const e=await this.Bu.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}
/**
 * @license
 * Copyright 2025 Google LLC
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
 */class rf{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let n=this.bu();if(!n||!n.$a())throw new Error(`The first element of the bundle is not a metadata object, it is\n         ${JSON.stringify(null==n?void 0:n.Qa)}`);this.metadata=n;do{n=this.bu(),null!==n&&this.elements.push(n)}while(null!==n)}getMetadata(){return this.metadata}Wu(){return this.elements}bu(){if(this.cursor===this.bundleData.length)return null;const e=this.qu(),t=this.$u(e);return new ad(JSON.parse(t),e)}$u(e){if(this.cursor+e>this.bundleData.length)throw new Pt(Rt.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}qu(){const e=this.cursor;let t=this.cursor;for(;t<this.bundleData.length;){if("{"===this.bundleData[t]){if(t===e)throw new Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw new Error("Reached the end of bundle when more is expected.")}}
/**
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
 */class sf{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new Pt(Rt.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(e,t){const n=xt(e),r={documents:t.map(e=>za(n.serializer,e))},s=await n.Ho("BatchGetDocuments",n.serializer.databaseId,en.emptyPath(),r,t.length),i=new Map;s.forEach(e=>{const t=function(e,t){return"found"in t?function(e,t){Dt(!!t.found,43571),t.found.name,t.found.updateTime;const n=$a(e,t.found.name),r=Ua(t.found.updateTime),s=t.found.createTime?Ua(t.found.createTime):vn.min(),i=new pi({mapValue:{fields:t.found.fields}});return gi.newFoundDocument(n,r,s,i)}(e,t):"missing"in t?function(e,t){Dt(!!t.missing,3894),Dt(!!t.readTime,22933);const n=$a(e,t.missing),r=Ua(t.readTime);return gi.newNoDocument(n,r)}(e,t):kt(7234,{result:t})}(n.serializer,e);i.set(t.key.toString(),t)});const o=[];return t.forEach(e=>{const t=i.get(e.toString());Dt(!!t,55234,{key:e}),o.push(t)}),o}(this.datastore,e);return t.forEach(e=>this.recordVersion(e)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new sa(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((e,t)=>{const n=rn.fromPath(t);this.mutations.push(new ia(n,this.precondition(n)))}),await async function(e,t){const n=xt(e),r={writes:t.map(e=>Ya(n.serializer,e))};await n.Go("Commit",n.serializer.databaseId,en.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw kt(50498,{Gu:e.constructor.name});t=vn.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new Pt(Rt.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(vn.min())?Go.exists(!1):Go.updateTime(t):Go.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(vn.min()))throw new Pt(Rt.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Go.updateTime(t)}return Go.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}
/**
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
 */class of{constructor(e,t,n,r,s){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=s,this.zu=n.maxAttempts,this.M_=new oh(this.asyncQueue,"transaction_retry")}ju(){this.zu-=1,this.Ju()}Ju(){this.M_.p_(async()=>{const e=new sf(this.datastore),t=this.Hu(e);t&&t.then(t=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(t)}).catch(e=>{this.Yu(e)}))}).catch(e=>{this.Yu(e)})})}Hu(e){try{const t=this.updateFunction(e);return!Yn(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Yu(e){this.zu>0&&this.Zu(e)?(this.zu-=1,this.asyncQueue.enqueueAndForget(()=>(this.Ju(),Promise.resolve()))):this.deferred.reject(e)}Zu(e){if("FirebaseError"===(null==e?void 0:e.name)){const t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!fa(t)}return!1}}
/**
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
 */const af="FirestoreClient";class cf{constructor(e,t,n,r,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=It.UNAUTHENTICATED,this.clientId=$t.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(n,async e=>{Et(af,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(Et(af,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Ot;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Kh(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function uf(e,t){e.asyncQueue.verifyOperationInProgress(),Et(af,"Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await _l(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function lf(e,t){e.asyncQueue.verifyOperationInProgress();const n=await hf(e);Et(af,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>qh(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>qh(t.remoteStore,n)),e._onlineComponents=t}async function hf(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){Et(af,"Using user provided OfflineComponentProvider");try{await uf(e,e._uninitializedComponentsProvider._offline)}catch(n){const r=n;if(!("FirebaseError"===(t=r).name?t.code===Rt.FAILED_PRECONDITION||t.code===Rt.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw r;Ct("Error using user provided cache. Falling back to memory cache: "+r),await uf(e,new Qd)}}else Et(af,"Using default OfflineComponentProvider"),await uf(e,new Jd(void 0));var t;return e._offlineComponents}async function df(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(Et(af,"Using user provided OnlineComponentProvider"),await lf(e,e._uninitializedComponentsProvider._online)):(Et(af,"Using default OnlineComponentProvider"),await lf(e,new Zd))),e._onlineComponents}function ff(e){return hf(e).then(e=>e.persistence)}function pf(e){return hf(e).then(e=>e.localStore)}function mf(e){return df(e).then(e=>e.remoteStore)}function gf(e){return df(e).then(e=>e.syncEngine)}function yf(e){return df(e).then(e=>e.datastore)}async function vf(e){const t=await df(e),n=t.eventManager;return n.onListen=vd.bind(null,t.syncEngine),n.onUnlisten=bd.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=wd.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=Td.bind(null,t.syncEngine),n}function wf(e,t,n={}){const r=new Ot;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,s){const i=new tf({next:a=>{i.Nu(),t.enqueueAndForget(()=>ed(e,o));const c=a.docs.has(n);!c&&a.fromCache?s.reject(new Pt(Rt.UNAVAILABLE,"Failed to get document because the client is offline.")):c&&a.fromCache&&r&&"server"===r.source?s.reject(new Pt(Rt.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):s.resolve(a)},error:e=>s.reject(e)}),o=new od(Yi(n.path),i,{includeMetadataChanges:!0,qa:!0});return Zh(e,o)}(await vf(e),e.asyncQueue,t,n,r)),r.promise}function If(e,t,n={}){const r=new Ot;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,s){const i=new tf({next:n=>{i.Nu(),t.enqueueAndForget(()=>ed(e,o)),n.fromCache&&"server"===r.source?s.reject(new Pt(Rt.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):s.resolve(n)},error:e=>s.reject(e)}),o=new od(n,i,{includeMetadataChanges:!0,qa:!0});return Zh(e,o)}(await vf(e),e.asyncQueue,t,n,r)),r.promise}function _f(e,t,n,r){const s=function(e,t){let n;return n="string"==typeof e?ga().encode(e):e,r=function(e,t){if(e instanceof Uint8Array)return ef(e,t);if(e instanceof ArrayBuffer)return ef(new Uint8Array(e),t);if(e instanceof ReadableStream)return e.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(n),new nf(r,t);var r}(n,ih(t));e.asyncQueue.enqueueAndForget(async()=>{!function(e,t,n){const r=xt(e);(async function(e,t,n){try{const s=await t.getMetadata();if(await function(e,t){const n=xt(e),r=Ua(t.createTime);return n.persistence.runTransaction("hasNewerBundle","readonly",e=>n.Ii.getBundleMetadata(e,t.id)).then(e=>!!e&&e.createTime.compareTo(r)>=0)}(e.localStore,s))return await t.close(),n._completeWith({taskState:"Success",documentsLoaded:(r=s).totalDocuments,bytesLoaded:r.totalBytes,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}),Promise.resolve(new Set);n._updateProgress(ld(s));const i=new ud(s,t.serializer);let o=await t.bu();for(;o;){const e=await i.Ga(o);e&&n._updateProgress(e),o=await t.bu()}const a=await i.ja(e.localStore);return await Ld(e,a.Ha,void 0),await function(e,t){const n=xt(e);return n.persistence.runTransaction("Save bundle","readwrite",e=>n.Ii.saveBundleMetadata(e,t))}(e.localStore,s),n._completeWith(a.progress),Promise.resolve(a.Ja)}catch(r){return Ct(pd,`Loading bundle failed with ${r}`),n._failWith(r),Promise.resolve(new Set)}var r})(r,t,n).then(e=>{r.sharedClientState.notifyBundleLoaded(e)})}(await gf(e),s,r)})}function bf(e,t){return new rf(e,t)}
/**
 * @license
 * Copyright 2023 Google LLC
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
 */
function Tf(e){const t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t
/**
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
 */}const Ef=new Map,Sf="firestore.googleapis.com",Cf=!0;
/**
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
 */class Af{constructor(e){if(void 0===e.host){if(void 0!==e.ssl)throw new Pt(Rt.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Sf,this.ssl=Cf}else this.host=e.host,this.ssl=e.ssl??Cf;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=hu;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<Cu)throw new Pt(Rt.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}on("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Tf(e.experimentalLongPollingOptions??{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new Pt(Rt.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new Pt(Rt.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new Pt(Rt.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams;var t,n}}class kf{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Af({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Pt(Rt.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new Pt(Rt.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Af(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new Lt;switch(e.type){case"firstParty":return new Bt(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new Pt(Rt.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=Ef.get(e);t&&(Et("ComponentProvider","Removing Datastore"),Ef.delete(e),t.terminate())}(this),Promise.resolve()}}function Nf(e,t,n,s={}){var i;e=hn(e,kf);const o=h(t),a=e._getSettings(),c={...a,emulatorOptions:e._getEmulatorOptions()},u=`${t}:${n}`;o&&(d(`https://${u}`),m("Firestore",!0)),a.host!==Sf&&a.host!==u&&Ct("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...a,host:u,ssl:o,emulatorOptions:s};if(!E(l,c)&&(e._setSettings(l),s.mockUserToken)){let t,n;if("string"==typeof s.mockUserToken)t=s.mockUserToken,n=It.MOCK_USER;else{t=function(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",s=e.iat||0,i=e.sub||e.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...e};return[r(JSON.stringify({alg:"none",type:"JWT"})),r(JSON.stringify(o)),""].join(".")}(s.mockUserToken,null==(i=e._app)?void 0:i.options.projectId);const o=s.mockUserToken.sub||s.mockUserToken.user_id;if(!o)throw new Pt(Rt.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new It(o)}e._authCredentials=new Ft(new Mt(t,n))}}
/**
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
 */class Df{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Df(this.firestore,e,this._query)}}class xf{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Rf(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new xf(this.firestore,e,this._key)}toJSON(){return{type:xf._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(pn(t,xf._jsonSchema))return new xf(e,n||null,new rn(en.fromString(t.referencePath)))}}xf._jsonSchemaVersion="firestore/documentReference/1.0",xf._jsonSchema={type:fn("string",xf._jsonSchemaVersion),referencePath:fn("string")};class Rf extends Df{constructor(e,t,n){super(e,t,Yi(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new xf(this.firestore,null,new rn(e))}withConverter(e){return new Rf(this.firestore,e,this._path)}}function Pf(e,t,...n){if(e=x(e),sn("collection","path",t),e instanceof kf){const r=en.fromString(t,...n);return cn(r),new Rf(e,null,r)}{if(!(e instanceof xf||e instanceof Rf))throw new Pt(Rt.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(en.fromString(t,...n));return cn(r),new Rf(e.firestore,null,r)}}function Of(e,t,...n){if(e=x(e),1===arguments.length&&(t=$t.newId()),sn("doc","path",t),e instanceof kf){const r=en.fromString(t,...n);return an(r),new xf(e,null,new rn(r))}{if(!(e instanceof xf||e instanceof Rf))throw new Pt(Rt.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(en.fromString(t,...n));return an(r),new xf(e.firestore,e instanceof Rf?e.converter:null,new rn(r))}}function Mf(e,t){return e=x(e),t=x(t),e instanceof Df&&t instanceof Df&&e.firestore===t.firestore&&oo(e._query,t._query)&&e.converter===t.converter
/**
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
 */}const Lf="AsyncQueue";class Ff{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new oh(this,"async_queue_retry"),this._c=()=>{const e=sh();e&&Et(Lf,"Visibility state changed to "+e.visibilityState),this.M_.w_()},this.ac=e;const t=sh();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=sh();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new Ot;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(0!==this.Xu.length){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!qn(e))throw e;Et(Lf,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(e=>{throw this.nc=e,this.rc=!1,St("INTERNAL UNHANDLED ERROR: ",Vf(e)),e}).then(e=>(this.rc=!1,e))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=Gh.createAndSchedule(this,e,t,n,e=>this.hc(e));return this.tc.push(r),r}uc(){this.nc&&kt(47125,{Pc:Vf(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do{e=this.ac,await e}while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Vf(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t
/**
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
 */}function Uf(e){return function(e,t){if("object"!=typeof e||null===e)return!1;const n=e;for(const r of t)if(r in n&&"function"==typeof n[r])return!0;return!1}(e,["next","error","complete"])}class Bf{constructor(){this._progressObserver={},this._taskCompletionResolver=new Ot,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}
/**
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
 */class qf extends kf{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new Ff,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ff(e),this._firestoreClient=void 0,await e}}}function jf(e,t){const n="object"==typeof e?e:We(),r="string"==typeof e?e:t||Fs,s=je(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const e=(e=>{const t=a(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]})("firestore");e&&Nf(s,...e)}return s}function zf(e){if(e._terminated)throw new Pt(Rt.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||$f(e),e._firestoreClient}function $f(e){var t,n,r;const s=e._freezeSettings(),i=(o=e._databaseId,a=(null==(t=e._app)?void 0:t.options.appId)||"",c=e._persistenceKey,new Ls(o,a,c,(u=s).host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,Tf(u.experimentalLongPollingOptions),u.useFetchStreams,u.isUsingEmulator));var o,a,c,u;e._componentsProvider||(null==(n=s.localCache)?void 0:n._offlineComponentProvider)&&(null==(r=s.localCache)?void 0:r._onlineComponentProvider)&&(e._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),e._firestoreClient=new cf(e._authCredentials,e._appCheckCredentials,e._queue,i,e._componentsProvider&&function(e){const t=null==e?void 0:e._online.build();return{_offline:null==e?void 0:e._offline.build(t),_online:t}}(e._componentsProvider))}function Gf(e,t,n){if((e=hn(e,qf))._firestoreClient||e._terminated)throw new Pt(Rt.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new Pt(Rt.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},$f(e)}function Kf(e,t){const n=zf(e=hn(e,qf)),r=new Bf;return _f(n,e._databaseId,t,r),r}function Hf(e,t){return function(e,t){return e.asyncQueue.enqueue(async()=>function(e,t){const n=xt(e);return n.persistence.runTransaction("Get named query","readonly",e=>n.Ii.getNamedQuery(e,t))}(await pf(e),t))}(zf(e=hn(e,qf)),t).then(t=>t?new Df(e,null,t.query):null)}
/**
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
 */
/**
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
 */class Wf{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class Qf{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}}
/**
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
 */class Jf{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Jf(Es.fromBase64String(e))}catch(t){throw new Pt(Rt.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Jf(Es.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Jf._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(pn(e,Jf._jsonSchema))return Jf.fromBase64String(e.bytes)}}Jf._jsonSchemaVersion="firestore/bytes/1.0",Jf._jsonSchema={type:fn("string",Jf._jsonSchemaVersion),bytes:fn("string")};
/**
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
 */
class Yf{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new Pt(Rt.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new nn(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}
/**
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
 */
class Xf{constructor(e){this._methodName=e}}
/**
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
 */class Zf{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Pt(Rt.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Pt(Rt.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Gt(this._lat,e._lat)||Gt(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Zf._jsonSchemaVersion}}static fromJSON(e){if(pn(e,Zf._jsonSchema))return new Zf(e.latitude,e.longitude)}}Zf._jsonSchemaVersion="firestore/geoPoint/1.0",Zf._jsonSchema={type:fn("string",Zf._jsonSchemaVersion),latitude:fn("number"),longitude:fn("number")};
/**
 * @license
 * Copyright 2024 Google LLC
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
 */
class ep{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:ep._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(pn(e,ep._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new ep(e.vectorValues);throw new Pt(Rt.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ep._jsonSchemaVersion="firestore/vectorValue/1.0",ep._jsonSchema={type:fn("string",ep._jsonSchemaVersion),vectorValues:fn("object")};
/**
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
 */
const tp=/^__.*__$/;class np{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new ea(e,this.data,this.fieldMask,t,this.fieldTransforms):new Zo(e,this.data,t,this.fieldTransforms)}}class rp{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new ea(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function sp(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw kt(40011,{Ac:e})}}class ip{constructor(e,t,n,r,s,i){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===s&&this.Rc(),this.fieldTransforms=s||[],this.fieldMask=i||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new ip({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){var t;const n=null==(t=this.path)?void 0:t.child(e),r=this.Vc({path:n,fc:!1});return r.gc(e),r}yc(e){var t;const n=null==(t=this.path)?void 0:t.child(e),r=this.Vc({path:n,fc:!1});return r.Rc(),r}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return Sp(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(0===e.length)throw this.Sc("Document fields must not be empty");if(sp(this.Ac)&&tp.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class op{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||ih(e)}Cc(e,t,n,r=!1){return new ip({Ac:e,methodName:t,Dc:n,path:nn.emptyPath(),fc:!1,bc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function ap(e){const t=e._freezeSettings(),n=ih(e._databaseId);return new op(e._databaseId,!!t.ignoreUndefinedProperties,n)}function cp(e,t,n,r,s,i={}){const o=e.Cc(i.merge||i.mergeFields?2:0,t,n,s);_p("Data must be an object, but it was:",o,r);const a=wp(r,o);let c,u;if(i.merge)c=new bs(o.fieldMask),u=o.fieldTransforms;else if(i.mergeFields){const e=[];for(const r of i.mergeFields){const s=bp(t,r,n);if(!o.contains(s))throw new Pt(Rt.INVALID_ARGUMENT,`Field '${s}' is specified in your field mask but missing from your input data.`);Cp(e,s)||e.push(s)}c=new bs(e),u=o.fieldTransforms.filter(e=>c.covers(e.field))}else c=null,u=o.fieldTransforms;return new np(new pi(a),c,u)}class up extends Xf{_toFieldTransform(e){if(2!==e.Ac)throw 1===e.Ac?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof up}}function lp(e,t,n){return new ip({Ac:3,Dc:t.settings.Dc,methodName:e._methodName,fc:n},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class hp extends Xf{_toFieldTransform(e){return new zo(e.path,new Mo)}isEqual(e){return e instanceof hp}}class dp extends Xf{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=lp(this,e,!0),n=this.vc.map(e=>vp(e,t)),r=new Lo(n);return new zo(e.path,r)}isEqual(e){return e instanceof dp&&E(this.vc,e.vc)}}class fp extends Xf{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=lp(this,e,!0),n=this.vc.map(e=>vp(e,t)),r=new Vo(n);return new zo(e.path,r)}isEqual(e){return e instanceof fp&&E(this.vc,e.vc)}}class pp extends Xf{constructor(e,t){super(e),this.Fc=t}_toFieldTransform(e){const t=new Bo(e.serializer,Do(e.serializer,this.Fc));return new zo(e.path,t)}isEqual(e){return e instanceof pp&&this.Fc===e.Fc}}function mp(e,t,n,r){const s=e.Cc(1,t,n);_p("Data must be an object, but it was:",s,r);const i=[],o=pi.empty();fs(r,(e,r)=>{const a=Ep(t,e,n);r=x(r);const c=s.yc(a);if(r instanceof up)i.push(a);else{const e=vp(r,c);null!=e&&(i.push(a),o.set(a,e))}});const a=new bs(i);return new rp(o,a,s.fieldTransforms)}function gp(e,t,n,r,s,i){const o=e.Cc(1,t,n),a=[bp(t,r,n)],c=[s];if(i.length%2!=0)throw new Pt(Rt.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<i.length;d+=2)a.push(bp(t,i[d])),c.push(i[d+1]);const u=[],l=pi.empty();for(let d=a.length-1;d>=0;--d)if(!Cp(u,a[d])){const e=a[d];let t=c[d];t=x(t);const n=o.yc(e);if(t instanceof up)u.push(e);else{const r=vp(t,n);null!=r&&(u.push(e),l.set(e,r))}}const h=new bs(u);return new rp(l,h,o.fieldTransforms)}function yp(e,t,n,r=!1){return vp(n,e.Cc(r?4:3,t))}function vp(e,t){if(Ip(e=x(e)))return _p("Unsupported field value:",t,e),wp(e,t);if(e instanceof Xf)return function(e,t){if(!sp(t.Ac))throw t.Sc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Sc(`${e._methodName}() is not currently supported inside arrays`);const n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.fc&&4!==t.Ac)throw t.Sc("Nested arrays are not supported");return function(e,t){const n=[];let r=0;for(const s of e){let e=vp(s,t.wc(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=x(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return Do(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){const n=yn.fromDate(e);return{timestampValue:La(t.serializer,n)}}if(e instanceof yn){const n=new yn(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:La(t.serializer,n)}}if(e instanceof Zf)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof Jf)return{bytesValue:Fa(t.serializer,e._byteString)};if(e instanceof xf){const n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.Sc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:Ba(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof ep)return n=e,r=t,{mapValue:{fields:{[Us]:{stringValue:js},[zs]:{arrayValue:{values:n.toArray().map(e=>{if("number"!=typeof e)throw r.Sc("VectorValues must only contain numeric values.");return ko(r.serializer,e)})}}}}};var n,r;throw t.Sc(`Unsupported field value: ${ln(e)}`)}(e,t)}function wp(e,t){const n={};return ms(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):fs(e,(e,r)=>{const s=vp(r,t.mc(e));null!=s&&(n[e]=s)}),{mapValue:{fields:n}}}function Ip(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof yn||e instanceof Zf||e instanceof Jf||e instanceof xf||e instanceof Xf||e instanceof ep)}function _p(e,t,n){if(!Ip(n)||!un(n)){const r=ln(n);throw"an object"===r?t.Sc(e+" a custom object"):t.Sc(e+" "+r)}}function bp(e,t,n){if((t=x(t))instanceof Yf)return t._internalPath;if("string"==typeof t)return Ep(e,t);throw Sp("Field path arguments must be of type string or ",e,!1,void 0,n)}const Tp=new RegExp("[~\\*/\\[\\]]");function Ep(e,t,n){if(t.search(Tp)>=0)throw Sp(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new Yf(...t.split("."))._internalPath}catch(r){throw Sp(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function Sp(e,t,n,r,s){const i=r&&!r.isEmpty(),o=void 0!==s;let a=`Function ${t}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${r}`),o&&(c+=` in document ${s}`),c+=")"),new Pt(Rt.INVALID_ARGUMENT,a+e+c)}function Cp(e,t){return e.some(e=>e.isEqual(t))}
/**
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
 */class Ap{constructor(e,t,n,r,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new xf(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const e=new kp(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Np("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class kp extends Ap{data(){return super.data()}}function Np(e,t){return"string"==typeof t?Ep(e,t):t instanceof Yf?t._internalPath:t._delegate._internalPath}
/**
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
 */function Dp(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new Pt(Rt.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class xp{}class Rp extends xp{}function Pp(e,t,...n){let r=[];t instanceof xp&&r.push(t),r=r.concat(n),function(e){const t=e.filter(e=>e instanceof Lp).length,n=e.filter(e=>e instanceof Op).length;if(t>1||t>0&&n>0)throw new Pt(Rt.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)e=s._apply(e);return e}class Op extends Rp{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new Op(e,t,n)}_apply(e){const t=this._parse(e);return Gp(e._query,t),new Df(e.firestore,e.converter,so(e._query,t))}_parse(e){const t=ap(e.firestore);return function(e,t,n,r,s,i,o){let a;if(s.isKeyField()){if("array-contains"===i||"array-contains-any"===i)throw new Pt(Rt.INVALID_ARGUMENT,`Invalid Query. You can't perform '${i}' queries on documentId().`);if("in"===i||"not-in"===i){$p(o,i);const t=[];for(const n of o)t.push(zp(r,e,n));a={arrayValue:{values:t}}}else a=zp(r,e,o)}else"in"!==i&&"not-in"!==i&&"array-contains-any"!==i||$p(o,i),a=yp(n,t,o,"in"===i||"not-in"===i);return Ti.create(s,i,a)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Mp(e,t,n){const r=t,s=Np("where",e);return Op._create(s,r,n)}class Lp extends xp{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Lp(e,t)}_parse(e){const t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:Ei.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;const r=t.getFlattenedFilters();for(const s of r)Gp(n,s),n=so(n,s)}(e._query,t),new Df(e.firestore,e.converter,so(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class Fp extends Rp{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Fp(e,t)}_apply(e){const t=function(e,t,n){if(null!==e.startAt)throw new Pt(Rt.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new Pt(Rt.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ii(t,n)}(e._query,this._field,this._direction);return new Df(e.firestore,e.converter,function(e,t){const n=e.explicitOrderBy.concat([t]);return new Qi(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function Vp(e,t="asc"){const n=t,r=Np("orderBy",e);return Fp._create(r,n)}class Up extends Rp{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Up(e,t,n)}_apply(e){return new Df(e.firestore,e.converter,io(e._query,this._limit,this._limitType))}}class Bp extends Rp{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Bp(e,t,n)}_apply(e){const t=jp(e,this.type,this._docOrFields,this._inclusive);return new Df(e.firestore,e.converter,(n=e._query,r=t,new Qi(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,r,n.endAt)));var n,r}}class qp extends Rp{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new qp(e,t,n)}_apply(e){const t=jp(e,this.type,this._docOrFields,this._inclusive);return new Df(e.firestore,e.converter,(n=e._query,r=t,new Qi(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,n.startAt,r)));var n,r}}function jp(e,t,n,r){if(n[0]=x(n[0]),n[0]instanceof Ap)return function(e,t,n,r,s){if(!r)throw new Pt(Rt.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${n}().`);const i=[];for(const o of eo(e))if(o.field.isKeyField())i.push(ei(t,r.key));else{const e=r.data.field(o.field);if(Ps(e))throw new Pt(Rt.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+o.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null===e){const e=o.field.canonicalString();throw new Pt(Rt.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`)}i.push(e)}return new yi(i,s)}(e._query,e.firestore._databaseId,t,n[0]._document,r);{const s=ap(e.firestore);return function(e,t,n,r,s,i){const o=e.explicitOrderBy;if(s.length>o.length)throw new Pt(Rt.INVALID_ARGUMENT,`Too many arguments provided to ${r}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const a=[];for(let c=0;c<s.length;c++){const i=s[c];if(o[c].field.isKeyField()){if("string"!=typeof i)throw new Pt(Rt.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${r}(), but got a ${typeof i}`);if(!Zi(e)&&-1!==i.indexOf("/"))throw new Pt(Rt.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${r}() must be a plain document ID, but '${i}' contains a slash.`);const n=e.path.child(en.fromString(i));if(!rn.isDocumentKey(n))throw new Pt(Rt.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${r}() must result in a valid document path, but '${n}' is not because it contains an odd number of segments.`);const s=new rn(n);a.push(ei(t,s))}else{const e=yp(n,r,i);a.push(e)}}return new yi(a,i)}(e._query,e.firestore._databaseId,s,t,n,r)}}function zp(e,t,n){if("string"==typeof(n=x(n))){if(""===n)throw new Pt(Rt.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Zi(t)&&-1!==n.indexOf("/"))throw new Pt(Rt.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=t.path.child(en.fromString(n));if(!rn.isDocumentKey(r))throw new Pt(Rt.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return ei(e,new rn(r))}if(n instanceof xf)return ei(e,n._key);throw new Pt(Rt.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ln(n)}.`)}function $p(e,t){if(!Array.isArray(e)||0===e.length)throw new Pt(Rt.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Gp(e,t){const n=function(e,t){for(const n of e)for(const e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new Pt(Rt.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new Pt(Rt.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}function Kp(e,t){if(!(t instanceof Op||t instanceof Lp))throw new Pt(Rt.INVALID_ARGUMENT,`Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class Hp{convertValue(e,t="none"){switch(Gs(e)){case 0:return null;case 1:return e.booleanValue;case 2:return As(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(ks(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw kt(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return fs(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){var t,n,r;const s=null==(r=null==(n=null==(t=e.fields)?void 0:t[zs].arrayValue)?void 0:n.values)?void 0:r.map(e=>As(e.doubleValue));return new ep(s)}convertGeoPoint(e){return new Zf(As(e.latitude),As(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Os(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Ms(e));default:return null}}convertTimestamp(e){const t=Cs(e);return new yn(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=en.fromString(e);Dt(hc(n),9688,{name:e});const r=new Vs(n.get(1),n.get(3)),s=new rn(n.popFirst(5));return r.isEqual(t)||St(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}
/**
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
 */function Wp(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}class Qp extends Hp{constructor(e){super(),this.firestore=e}convertBytes(e){return new Jf(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new xf(this.firestore,null,t)}}
/**
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
 */function Jp(){return new Wf("count")}
/**
 * @license
 * Copyright 2025 Google LLC
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
 */
/**
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
 */
const Yp="NOT SUPPORTED";class Xp{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Zp extends Ap{constructor(e,t,n,r,s,i){super(e,t,n,r,i),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new em(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Np("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new Pt(Rt.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Zp._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),e&&e.isValidDocument()&&e.isFoundDocument()?(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t):t}}Zp._jsonSchemaVersion="firestore/documentSnapshot/1.0",Zp._jsonSchema={type:fn("string",Zp._jsonSchemaVersion),bundleSource:fn("string","DocumentSnapshot"),bundleName:fn("string"),bundle:fn("string")};class em extends Zp{data(e={}){return super.data(e)}}class tm{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Xp(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new em(this._firestore,this._userDataWriter,n.key,n,new Xp(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new Pt(Rt.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(n=>{const r=new em(e._firestore,e._userDataWriter,n.doc.key,n.doc,new Xp(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}})}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{const r=new em(e._firestore,e._userDataWriter,t.doc.key,t.doc,new Xp(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter);let s=-1,i=-1;return 0!==t.type&&(s=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(n=n.add(t.doc),i=n.indexOf(t.doc.key)),{type:nm(t.type),doc:r,oldIndex:s,newIndex:i}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new Pt(Rt.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=tm._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=$t.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],r=[];return this.docs.forEach(e=>{null!==e._document&&(t.push(e._document),n.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields,"previous")),r.push(e.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function nm(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return kt(61501,{type:e})}}
/**
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
 */
function rm(e){e=hn(e,xf);const t=hn(e.firestore,qf);return wf(zf(t),e._key).then(n=>dm(t,e,n))}tm._jsonSchemaVersion="firestore/querySnapshot/1.0",tm._jsonSchema={type:fn("string",tm._jsonSchemaVersion),bundleSource:fn("string","QuerySnapshot"),bundleName:fn("string"),bundle:fn("string")};class sm extends Hp{constructor(e){super(),this.firestore=e}convertBytes(e){return new Jf(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new xf(this.firestore,null,t)}}function im(e){e=hn(e,Df);const t=hn(e.firestore,qf),n=zf(t),r=new sm(t);return Dp(e._query),If(n,e._query).then(n=>new tm(t,r,e,n))}function om(e,t,n){e=hn(e,xf);const r=hn(e.firestore,qf),s=Wp(e.converter,t,n);return hm(r,[cp(ap(r),"setDoc",e._key,s,null!==e.converter,n).toMutation(e._key,Go.none())])}function am(e,t,n,...r){e=hn(e,xf);const s=hn(e.firestore,qf),i=ap(s);let o;return o="string"==typeof(t=x(t))||t instanceof Yf?gp(i,"updateDoc",e._key,t,n,r):mp(i,"updateDoc",e._key,t),hm(s,[o.toMutation(e._key,Go.exists(!0))])}function cm(e){return hm(hn(e.firestore,qf),[new sa(e._key,Go.none())])}function um(e,t){const n=hn(e.firestore,qf),r=Of(e),s=Wp(e.converter,t);return hm(n,[cp(ap(e.firestore),"addDoc",r._key,s,null!==e.converter,{}).toMutation(r._key,Go.exists(!1))]).then(()=>r)}function lm(e,...t){var n,r,s;e=x(e);let i={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof t[o]||Uf(t[o])||(i=t[o++]);const a={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(Uf(t[o])){const e=t[o];t[o]=null==(n=e.next)?void 0:n.bind(e),t[o+1]=null==(r=e.error)?void 0:r.bind(e),t[o+2]=null==(s=e.complete)?void 0:s.bind(e)}let c,u,l;if(e instanceof xf)u=hn(e.firestore,qf),l=Yi(e._key.path),c={next:n=>{t[o]&&t[o](dm(u,e,n))},error:t[o+1],complete:t[o+2]};else{const n=hn(e,Df);u=hn(n.firestore,qf),l=n._query;const r=new sm(u);c={next:e=>{t[o]&&t[o](new tm(u,r,n,e))},error:t[o+1],complete:t[o+2]},Dp(e._query)}return function(e,t,n,r){const s=new tf(r),i=new od(t,s,n);return e.asyncQueue.enqueueAndForget(async()=>Zh(await vf(e),i)),()=>{s.Nu(),e.asyncQueue.enqueueAndForget(async()=>ed(await vf(e),i))}}(zf(u),l,a,c)}function hm(e,t){return function(e,t){const n=new Ot;return e.asyncQueue.enqueueAndForget(async()=>async function(t,n,r){const s=Wd(t);try{const e=await function(e,t){const n=xt(e),r=yn.now(),s=t.reduce((e,t)=>e.add(t.key),So());let i,o;return n.persistence.runTransaction("Locally write mutations","readwrite",e=>{let a=go(),c=So();return n.Ns.getEntries(e,s).next(e=>{a=e,a.forEach((e,t)=>{t.isValidDocument()||(c=c.add(e))})}).next(()=>n.localDocuments.getOverlayedDocuments(e,a)).next(s=>{i=s;const o=[];for(const e of t){const t=Yo(e,i.get(e.key).overlayedDocument);null!=t&&o.push(new ea(e.key,t,mi(t.value.mapValue),Go.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)}).next(t=>{o=t;const r=t.applyToLocalDocumentSet(i,c);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)})}).then(()=>({batchId:o.batchId,changes:wo(i)}))}(s.localStore,n);s.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.Vu[e.currentUser.toKey()];r||(r=new gs(Gt)),r=r.insert(t,n),e.Vu[e.currentUser.toKey()]=r}(s,e.batchId,r),await Ld(s,e.changes),await Rh(s.remoteStore)}catch(e){const n=Kh(e,"Failed to persist write");r.reject(n)}}(await gf(e),t,n)),n.promise}(zf(e),t)}function dm(e,t,n){const r=n.docs.get(t._key),s=new sm(e);return new Zp(e,s,t._key,r,new Xp(n.hasPendingWrites,n.fromCache),t.converter)}function fm(e,t){const n=hn(e.firestore,qf),r=zf(n),s=ps(t,(e,t)=>new ua(t,e.aggregateType,e._internalFieldPath));return function(e,t,n){const r=new Ot;return e.asyncQueue.enqueueAndForget(async()=>{try{const s=await yf(e);r.resolve(async function(e,t,n){var r;const s=xt(e),{request:i,gt:o,parent:a}=tc(s.serializer,no(t),n);s.connection.$o||delete i.parent;const c=(await s.Ho("RunAggregationQuery",s.serializer.databaseId,a,i,1)).filter(e=>!!e.result);Dt(1===c.length,64727);const u=null==(r=c[0].result)?void 0:r.aggregateFields;return Object.keys(u).reduce((e,t)=>(e[o[t]]=u[t],e),{})}(s,t,n))}catch(s){r.reject(s)}}),r.promise}(r,e._query,s).then(t=>function(e,t,n){const r=new sm(e);return new Qf(t,r,n)}(n,e,t))}class pm{constructor(e){this.kind="memory",this._onlineComponentProvider=Zd.provider,this._offlineComponentProvider=(null==e?void 0:e.garbageCollector)?e.garbageCollector._offlineComponentProvider:{build:()=>new Jd(void 0)}}toJSON(){return{kind:this.kind}}}class mm{constructor(e){let t;this.kind="persistent",(null==e?void 0:e.tabManager)?(e.tabManager._initialize(e),t=e.tabManager):(t=Im(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class gm{constructor(){this.kind="memoryEager",this._offlineComponentProvider=Qd.provider}toJSON(){return{kind:this.kind}}}class ym{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new Jd(e)}}toJSON(){return{kind:this.kind}}}class vm{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Zd.provider,this._offlineComponentProvider={build:t=>new Yd(t,null==e?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class wm{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Zd.provider,this._offlineComponentProvider={build:t=>new Xd(t,null==e?void 0:e.cacheSizeBytes)}}}function Im(e){return new vm(null==e?void 0:e.forceOwnership)}
/**
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
 */
const _m={maxAttempts:5};
/**
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
 */class bm{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=ap(e)}set(e,t,n){this._verifyNotCommitted();const r=Tm(e,this._firestore),s=Wp(r.converter,t,n),i=cp(this._dataReader,"WriteBatch.set",r._key,s,null!==r.converter,n);return this._mutations.push(i.toMutation(r._key,Go.none())),this}update(e,t,n,...r){this._verifyNotCommitted();const s=Tm(e,this._firestore);let i;return i="string"==typeof(t=x(t))||t instanceof Yf?gp(this._dataReader,"WriteBatch.update",s._key,t,n,r):mp(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(i.toMutation(s._key,Go.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Tm(e,this._firestore);return this._mutations=this._mutations.concat(new sa(t._key,Go.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new Pt(Rt.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Tm(e,t){if((e=x(e)).firestore!==t)throw new Pt(Rt.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}
/**
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
 */class Em{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=ap(e)}get(e){const t=Tm(e,this._firestore),n=new Qp(this._firestore);return this._transaction.lookup([t._key]).then(e=>{if(!e||1!==e.length)return kt(24041);const r=e[0];if(r.isFoundDocument())return new Ap(this._firestore,n,r.key,r,t.converter);if(r.isNoDocument())return new Ap(this._firestore,n,t._key,null,t.converter);throw kt(18433,{doc:r})})}set(e,t,n){const r=Tm(e,this._firestore),s=Wp(r.converter,t,n),i=cp(this._dataReader,"Transaction.set",r._key,s,null!==r.converter,n);return this._transaction.set(r._key,i),this}update(e,t,n,...r){const s=Tm(e,this._firestore);let i;return i="string"==typeof(t=x(t))||t instanceof Yf?gp(this._dataReader,"Transaction.update",s._key,t,n,r):mp(this._dataReader,"Transaction.update",s._key,t),this._transaction.update(s._key,i),this}delete(e){const t=Tm(e,this._firestore);return this._transaction.delete(t._key),this}}
/**
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
 */class Sm extends Em{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Tm(e,this._firestore),n=new sm(this._firestore);return super.get(e).then(e=>new Zp(this._firestore,n,t._key,e._document,new Xp(!1,!1),t.converter))}}function Cm(){return new hp("serverTimestamp")}function Am(...e){return new dp("arrayUnion",e)}function km(...e){return new fp("arrayRemove",e)}function Nm(e){return new pp("increment",e)}
/**
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
 */
function Dm(e){return zf(e=hn(e,qf)),new bm(e,t=>hm(e,t))
/**
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
 */}function xm(e,t){if("string"!=typeof e[t])throw new Pt(Rt.INVALID_ARGUMENT,"Missing string value for: "+t);return e[t]}
/**
 * @license
 * Copyright 2023 Google LLC
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
 */class Rm{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function Pm(e,t){(function(e,t){return e.asyncQueue.enqueue(async()=>{return n=await pf(e),r=t,void(xt(n).Fs.Vs=r);var n,r})})(zf(e._firestore),t).then(e=>Et(`setting persistent cache index auto creation isEnabled=${t} succeeded`)).catch(e=>Ct(`setting persistent cache index auto creation isEnabled=${t} failed`,e))}const Om=new WeakMap;
/**
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
 */class Mm{constructor(){this.Mc=new Map}static get instance(){return Lm||(Lm=new Mm,function(e){if(ma)throw new Error("a TestingHooksSpi instance is already set");ma=e}(Lm)),Lm}lt(e){this.Mc.forEach(t=>t(e))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.Mc;return n.set(t,e),()=>n.delete(t)}}let Lm=null;!function(e,t=!0){_t=Ke,qe(new R("firestore",(e,{instanceIdentifier:n,options:r})=>{const s=e.getProvider("app").getImmediate(),i=new qf(new Vt(e.getProvider("auth-internal")),new jt(s,e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new Pt(Rt.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Vs(e.options.projectId,t)}(s,n),s);return r={useFetchStreams:t,...r},i._setSettings(r),i},"PUBLIC").setMultipleInstances(!0)),Qe(vt,wt,e),Qe(vt,wt,"esm2020")}();const Fm=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Hp,AggregateField:Wf,AggregateQuerySnapshot:Qf,Bytes:Jf,CACHE_SIZE_UNLIMITED:-1,CollectionReference:Rf,DocumentReference:xf,DocumentSnapshot:Zp,FieldPath:Yf,FieldValue:Xf,Firestore:qf,FirestoreError:Pt,GeoPoint:Zf,LoadBundleTask:Bf,PersistentCacheIndexManager:Rm,Query:Df,QueryCompositeFilterConstraint:Lp,QueryConstraint:Rp,QueryDocumentSnapshot:em,QueryEndAtConstraint:qp,QueryFieldFilterConstraint:Op,QueryLimitConstraint:Up,QueryOrderByConstraint:Fp,QuerySnapshot:tm,QueryStartAtConstraint:Bp,SnapshotMetadata:Xp,Timestamp:yn,Transaction:Sm,VectorValue:ep,WriteBatch:bm,_AutoId:$t,_ByteString:Es,_DatabaseId:Vs,_DocumentKey:rn,_EmptyAppCheckTokenProvider:class{getToken(){return Promise.resolve(new qt(""))}invalidateToken(){}start(e,t){}shutdown(){}},_EmptyAuthCredentialsProvider:Lt,_FieldPath:nn,_TestingHooks:
/**
 * @license
 * Copyright 2023 Google LLC
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
 */
class{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return Mm.instance.onExistenceFilterMismatch(e)}},_cast:hn,_debugAssert:function(e,t){e||kt(57014,t)},_internalAggregationQueryToProtoRunAggregationQueryRequest:function(e,t){var n;const r=ps(t,(e,t)=>new ua(t,e.aggregateType,e._internalFieldPath)),s=null==(n=zf(hn(e.firestore,qf))._onlineComponents)?void 0:n.datastore.serializer;return void 0===s?null:tc(s,no(e._query),r,!0).request},_internalQueryToProtoQueryTarget:function(e){var t;const n=null==(t=zf(hn(e.firestore,qf))._onlineComponents)?void 0:t.datastore.serializer;return void 0===n?null:ec(n,to(e._query)).ft},_isBase64Available:function(){return"undefined"!=typeof atob},_logWarn:Ct,_validateIsNotUsedTogether:on,addDoc:um,aggregateFieldEqual:function(e,t){var n,r;return e instanceof Wf&&t instanceof Wf&&e.aggregateType===t.aggregateType&&(null==(n=e._internalFieldPath)?void 0:n.canonicalString())===(null==(r=t._internalFieldPath)?void 0:r.canonicalString())},aggregateQuerySnapshotEqual:function(e,t){return Mf(e.query,t.query)&&E(e.data(),t.data())},and:function(...e){return e.forEach(e=>Kp("and",e)),Lp._create("and",e)},arrayRemove:km,arrayUnion:Am,average:function(e){return new Wf("avg",bp("average",e))},clearIndexedDbPersistence:function(e){if(e._initialized&&!e._terminated)throw new Pt(Rt.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const t=new Ot;return e._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(e){if(!Fn.v())return Promise.resolve();const t=e+ll;await Fn.delete(t)}(pl(e._databaseId,e._persistenceKey)),t.resolve()}catch(n){t.reject(n)}}),t.promise},collection:Pf,collectionGroup:function(e,t){if(e=hn(e,kf),sn("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new Pt(Rt.INVALID_ARGUMENT,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new Df(e,null,(n=t,new Qi(en.emptyPath(),n)));var n},connectFirestoreEmulator:Nf,count:Jp,deleteAllPersistentCacheIndexes:function(e){(function(e){return e.asyncQueue.enqueue(async()=>function(e){const t=xt(e),n=t.indexManager;return t.persistence.runTransaction("Delete All Indexes","readwrite",e=>n.deleteAllFieldIndexes(e))}(await pf(e)))})(zf(e._firestore)).then(e=>Et("deleting all persistent cache indexes succeeded")).catch(e=>Ct("deleting all persistent cache indexes failed",e))},deleteDoc:cm,deleteField:
/**
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
 */
function(){return new up("deleteField")},disableNetwork:function(e){return function(e){return e.asyncQueue.enqueue(async()=>{const t=await ff(e),n=await mf(e);return t.setNetworkEnabled(!1),async function(e){const t=xt(e);t.Ea.add(0),await yh(t),t.Ra.set("Offline")}(n)})}(zf(e=hn(e,qf)))},disablePersistentCacheIndexAutoCreation:function(e){Pm(e,!1)},doc:Of,documentId:function(){return new Yf(Xt)},documentSnapshotFromJSON:function(e,t,n){if(pn(t,Zp._jsonSchema)){if(t.bundle===Yp)throw new Pt(Rt.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=ih(e._databaseId),s=bf(t.bundle,r),i=s.Wu(),o=new ud(s.getMetadata(),r);for(const e of i)o.Ga(e);const a=o.documents;if(1!==a.length)throw new Pt(Rt.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${a.length} documents.`);const c=Ja(r,a[0].document),u=new rn(en.fromString(t.bundleName));return new Zp(e,new Qp(e),u,c,new Xp(!1,!1),n||null)}},enableIndexedDbPersistence:function(e,t){Ct("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=e._freezeSettings();return Gf(e,Zd.provider,{build:e=>new Yd(e,n.cacheSizeBytes,null==t?void 0:t.forceOwnership)}),Promise.resolve()},enableMultiTabIndexedDbPersistence:async function(e){Ct("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=e._freezeSettings();Gf(e,Zd.provider,{build:e=>new Xd(e,t.cacheSizeBytes)})},enableNetwork:function(e){return function(e){return e.asyncQueue.enqueue(async()=>{const t=await ff(e),n=await mf(e);return t.setNetworkEnabled(!0),function(e){const t=xt(e);return t.Ea.delete(0),gh(t)}(n)})}(zf(e=hn(e,qf)))},enablePersistentCacheIndexAutoCreation:function(e){Pm(e,!0)},endAt:function(...e){return qp._create("endAt",e,!0)},endBefore:function(...e){return qp._create("endBefore",e,!1)},ensureFirestoreConfigured:zf,executeWrite:hm,getAggregateFromServer:fm,getCountFromServer:function(e){return fm(e,{count:Jp()})},getDoc:rm,getDocFromCache:function(e){e=hn(e,xf);const t=hn(e.firestore,qf),n=zf(t),r=new sm(t);return function(e,t){const n=new Ot;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){try{const r=await function(e,t){const n=xt(e);return n.persistence.runTransaction("read document","readonly",e=>n.localDocuments.getDocument(e,t))}(e,t);r.isFoundDocument()?n.resolve(r):r.isNoDocument()?n.resolve(null):n.reject(new Pt(Rt.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(r){const e=Kh(r,`Failed to get document '${t} from cache`);n.reject(e)}}(await pf(e),t,n)),n.promise}(n,e._key).then(n=>new Zp(t,r,e._key,n,new Xp(null!==n&&n.hasLocalMutations,!0),e.converter))},getDocFromServer:function(e){e=hn(e,xf);const t=hn(e.firestore,qf);return wf(zf(t),e._key,{source:"server"}).then(n=>dm(t,e,n))},getDocs:im,getDocsFromCache:function(e){e=hn(e,Df);const t=hn(e.firestore,qf),n=zf(t),r=new sm(t);return function(e,t){const n=new Ot;return e.asyncQueue.enqueueAndForget(async()=>async function(e,t,n){try{const r=await Al(e,t,!0),s=new fd(t,r.Qs),i=s.ru(r.documents),o=s.applyChanges(i,!1);n.resolve(o.snapshot)}catch(r){const e=Kh(r,`Failed to execute query '${t} against cache`);n.reject(e)}}(await pf(e),t,n)),n.promise}(n,e._query).then(n=>new tm(t,r,e,n))},getDocsFromServer:function(e){e=hn(e,Df);const t=hn(e.firestore,qf),n=zf(t),r=new sm(t);return If(n,e._query,{source:"server"}).then(n=>new tm(t,r,e,n))},getFirestore:jf,getPersistentCacheIndexManager:function(e){var t;e=hn(e,qf);const n=Om.get(e);if(n)return n;if("persistent"!==(null==(t=zf(e)._uninitializedComponentsProvider)?void 0:t._offline.kind))return null;const r=new Rm(e);return Om.set(e,r),r},increment:Nm,initializeFirestore:function(e,t,n){n||(n=Fs);const r=je(e,"firestore");if(r.isInitialized(n)){const e=r.getImmediate({identifier:n});if(E(r.getOptions(n),t))return e;throw new Pt(Rt.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==t.cacheSizeBytes&&void 0!==t.localCache)throw new Pt(Rt.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==t.cacheSizeBytes&&-1!==t.cacheSizeBytes&&t.cacheSizeBytes<Cu)throw new Pt(Rt.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&h(t.host)&&d(t.host),r.initialize({options:t,instanceIdentifier:n})},limit:function(e){return dn("limit",e),Up._create("limit",e,"F")},limitToLast:function(e){return dn("limitToLast",e),Up._create("limitToLast",e,"L")},loadBundle:Kf,memoryEagerGarbageCollector:function(){return new gm},memoryLocalCache:function(e){return new pm(e)},memoryLruGarbageCollector:function(e){return new ym(null==e?void 0:e.cacheSizeBytes)},namedQuery:Hf,onSnapshot:lm,onSnapshotResume:function(e,t,...n){const r=x(e),s=function(e){const t={bundle:"",bundleName:"",bundleSource:""},n=["bundle","bundleName","bundleSource"];for(const r of n){if(!(r in e)){t.error=`snapshotJson missing required field: ${r}`;break}const n=e[r];if("string"!=typeof n){t.error=`snapshotJson field '${r}' must be a string.`;break}if(0===n.length){t.error=`snapshotJson field '${r}' cannot be an empty string.`;break}"bundle"===r?t.bundle=n:"bundleName"===r?t.bundleName=n:"bundleSource"===r&&(t.bundleSource=n)}return t}(t);if(s.error)throw new Pt(Rt.INVALID_ARGUMENT,s.error);let i,o=0;if("object"!=typeof n[o]||Uf(n[o])||(i=n[o++]),"QuerySnapshot"===s.bundleSource){let e=null;if("object"==typeof n[o]&&Uf(n[o])){const t=n[o++];e={next:t.next,error:t.error,complete:t.complete}}else e={next:n[o++],error:n[o++],complete:n[o++]};return function(e,t,n,r,s){let i,o=!1;return Kf(e,t.bundle).then(()=>Hf(e,t.bundleName)).then(e=>{e&&!o&&(s&&e.withConverter(s),i=lm(e,n||{},r))}).catch(e=>(r.error&&r.error(e),()=>{})),()=>{o||(o=!0,i&&i())}}(r,s,i,e,n[o])}if("DocumentSnapshot"===s.bundleSource){let e=null;if("object"==typeof n[o]&&Uf(n[o])){const t=n[o++];e={next:t.next,error:t.error,complete:t.complete}}else e={next:n[o++],error:n[o++],complete:n[o++]};return function(e,t,n,r,s){let i,o=!1;return Kf(e,t.bundle).then(()=>{if(!o){const o=new xf(e,s||null,rn.fromPath(t.bundleName));i=lm(o,n||{},r)}}).catch(e=>(r.error&&r.error(e),()=>{})),()=>{o||(o=!0,i&&i())}}(r,s,i,e,n[o])}throw new Pt(Rt.INVALID_ARGUMENT,`unsupported bundle source: ${s.bundleSource}`)},onSnapshotsInSync:function(e,t){return function(e,t){const n=new tf(t);return e.asyncQueue.enqueueAndForget(async()=>{return t=await vf(e),r=n,xt(t).Ca.add(r),void r.next();var t,r}),()=>{n.Nu(),e.asyncQueue.enqueueAndForget(async()=>{return t=await vf(e),r=n,void xt(t).Ca.delete(r);var t,r})}}(zf(e=hn(e,qf)),Uf(t)?t:{next:t})},or:function(...e){return e.forEach(e=>Kp("or",e)),Lp._create("or",e)},orderBy:Vp,persistentLocalCache:function(e){return new mm(e)},persistentMultipleTabManager:function(){return new wm},persistentSingleTabManager:Im,query:Pp,queryEqual:Mf,querySnapshotFromJSON:function(e,t,n){if(pn(t,tm._jsonSchema)){if(t.bundle===Yp)throw new Pt(Rt.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=ih(e._databaseId),s=bf(t.bundle,r),i=s.Wu(),o=new ud(s.getMetadata(),r);for(const e of i)o.Ga(e);if(1!==o.queries.length)throw new Pt(Rt.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const a=_c(o.queries[0].bundledQuery),c=o.documents;let u=new Hh;c.map(e=>{const t=Ja(r,e.document);u=u.add(t)});const l=Qh.fromInitialDocuments(a,u,So(),!1,!1),h=new Df(e,n||null,a);return new tm(e,new Qp(e),h,l)}},refEqual:function(e,t){return e=x(e),t=x(t),(e instanceof xf||e instanceof Rf)&&(t instanceof xf||t instanceof Rf)&&e.firestore===t.firestore&&e.path===t.path&&e.converter===t.converter},runTransaction:function(e,t,n){e=hn(e,qf);const r={..._m,...n};return function(e){if(e.maxAttempts<1)throw new Pt(Rt.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r),function(e,t,n){const r=new Ot;return e.asyncQueue.enqueueAndForget(async()=>{const s=await yf(e);new of(e.asyncQueue,s,n,t,r).ju()}),r.promise}(zf(e),n=>t(new Sm(e,n)),r)},serverTimestamp:Cm,setDoc:om,setIndexConfiguration:function(e,t){const n=zf(e=hn(e,qf));return n._uninitializedComponentsProvider&&"memory"!==n._uninitializedComponentsProvider._offline.kind?function(e,t){return e.asyncQueue.enqueue(async()=>async function(e,t){const n=xt(e),r=n.indexManager,s=[];return n.persistence.runTransaction("Configure indexes","readwrite",e=>r.getFieldIndexes(e).next(n=>
/**
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
      */function(e,t,n,r,s){e=[...e],t=[...t],e.sort(n),t.sort(n);const i=e.length,o=t.length;let a=0,c=0;for(;a<o&&c<i;){const i=n(e[c],t[a]);i<0?s(e[c++]):i>0?r(t[a++]):(a++,c++)}for(;a<o;)r(t[a++]);for(;c<i;)s(e[c++])}(n,t,Tn,t=>{s.push(r.addFieldIndex(e,t))},t=>{s.push(r.deleteFieldIndex(e,t))})).next(()=>On.waitFor(s)))}(await pf(e),t))}(n,function(e){const t="string"==typeof e?function(e){try{return JSON.parse(e)}catch(t){throw new Pt(Rt.INVALID_ARGUMENT,"Failed to parse JSON: "+(null==t?void 0:t.message))}}(e):e,n=[];if(Array.isArray(t.indexes))for(const r of t.indexes){const e=xm(r,"collectionGroup"),t=[];if(Array.isArray(r.fields))for(const n of r.fields){const e=Ep("setIndexConfiguration",xm(n,"fieldPath"));"CONTAINS"===n.arrayConfig?t.push(new En(e,2)):"ASCENDING"===n.order?t.push(new En(e,0)):"DESCENDING"===n.order&&t.push(new En(e,1))}n.push(new In(In.UNKNOWN_ID,e,t,Cn.empty()))}return n}(t)):(Ct("Cannot enable indexes when persistence is disabled"),Promise.resolve())},setLogLevel:function(e){bt.setLogLevel(e)},snapshotEqual:function(e,t){return e instanceof Zp&&t instanceof Zp?e._firestore===t._firestore&&e._key.isEqual(t._key)&&(null===e._document?null===t._document:e._document.isEqual(t._document))&&e._converter===t._converter:e instanceof tm&&t instanceof tm&&e._firestore===t._firestore&&Mf(e.query,t.query)&&e.metadata.isEqual(t.metadata)&&e._snapshot.isEqual(t._snapshot)},startAfter:function(...e){return Bp._create("startAfter",e,!1)},startAt:function(...e){return Bp._create("startAt",e,!0)},sum:function(e){return new Wf("sum",bp("sum",e))},terminate:function(e){return function(e,t,n=Me){je(e,t).clearInstance(n)}(e.app,"firestore",e._databaseId.database),e._delete()},updateDoc:am,vector:function(e){return new ep(e)},waitForPendingWrites:function(e){return function(e){const t=new Ot;return e.asyncQueue.enqueueAndForget(async()=>async function(t,n){const r=xt(t);Eh(r.remoteStore)||Et(pd,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const e=await function(e){const t=xt(e);return t.persistence.runTransaction("Get highest unacknowledged batch id","readonly",e=>t.mutationQueue.getHighestUnacknowledgedBatchId(e))}(r.localStore);if(e===Jn)return void n.resolve();const t=r.mu.get(e)||[];t.push(n),r.mu.set(e,t)}catch(e){const r=Kh(e,"Initialization of waitForPendingWrites() operation failed");n.reject(r)}}(await gf(e),t)),t.promise}(zf(e=hn(e,qf)))},where:Mp,writeBatch:Dm},Symbol.toStringTag,{value:"Module"}));function Vm(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}
/**
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
 */
Qe("firebase","12.3.0","app");const Um=Vm,Bm=new b("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),qm=new j("@firebase/auth");function jm(e,...t){qm.logLevel<=L.ERROR&&qm.error(`Auth (${Ke}): ${e}`,...t)}
/**
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
 */function zm(e,...t){throw Hm(e,...t)}function $m(e,...t){return Hm(e,...t)}function Gm(e,t,n){const r={...Um(),[t]:n};return new b("auth","Firebase",r).create(t,{appName:e.name})}function Km(e){return Gm(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Hm(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return Bm.create(e,...t)}function Wm(e,t,...n){if(!e)throw Hm(t,...n)}function Qm(e){const t="INTERNAL ASSERTION FAILED: "+e;throw jm(t),new Error(t)}function Jm(e,t){e||Qm(t)}
/**
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
 */function Ym(){var e;return"undefined"!=typeof self&&(null==(e=self.location)?void 0:e.href)||""}function Xm(){var e;return"undefined"!=typeof self&&(null==(e=self.location)?void 0:e.protocol)||null}
/**
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
 */function Zm(){return"undefined"==typeof navigator||!navigator||!("onLine"in navigator)||"boolean"!=typeof navigator.onLine||"http:"!==Xm()&&"https:"!==Xm()&&!function(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()&&!("connection"in navigator)||navigator.onLine}
/**
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
 */
class eg{constructor(e,t){this.shortDelay=e,this.longDelay=t,Jm(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(g())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return Zm()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
/**
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
 */function tg(e,t){Jm(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
/**
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
 */class ng{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void Qm("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void Qm("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void Qm("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
/**
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
 */const rg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},sg=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],ig=new eg(3e4,6e4);
/**
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
 */function og(e,t){return e.tenantId&&!t.tenantId?{...t,tenantId:e.tenantId}:t}async function ag(e,t,n,r,s={}){return cg(e,s,async()=>{let s={},i={};r&&("GET"===t?i=r:s={body:JSON.stringify(r)});const o=C({key:e.config.apiKey,...i}).slice(1),a=await e._getAdditionalHeaders();a["Content-Type"]="application/json",e.languageCode&&(a["X-Firebase-Locale"]=e.languageCode);const c={method:t,headers:a,...s};return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&h(e.emulatorConfig.host)&&(c.credentials="include"),ng.fetch()(await lg(e,e.config.apiHost,n,o),c)})}async function cg(e,t,n){e._canInitEmulator=!1;const r={...rg,...t};try{const t=new dg(e),s=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const i=await s.json();if("needConfirmation"in i)throw fg(e,"account-exists-with-different-credential",i);if(s.ok&&!("errorMessage"in i))return i;{const t=s.ok?i.errorMessage:i.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw fg(e,"credential-already-in-use",i);if("EMAIL_EXISTS"===n)throw fg(e,"email-already-in-use",i);if("USER_DISABLED"===n)throw fg(e,"user-disabled",i);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw Gm(e,a,o);zm(e,a)}}catch(s){if(s instanceof _)throw s;zm(e,"network-request-failed",{message:String(s)})}}async function ug(e,t,n,r,s={}){const i=await ag(e,t,n,r,s);return"mfaPendingCredential"in i&&zm(e,"multi-factor-auth-required",{_serverResponse:i}),i}async function lg(e,t,n,r){const s=`${t}${n}?${r}`,i=e,o=i.config.emulator?tg(e.config,s):`${e.config.apiScheme}://${s}`;if(sg.includes(n)&&(await i._persistenceManagerAvailable,"COOKIE"===i._getPersistenceType())){return i._getPersistence()._getFinalTarget(o).toString()}return o}function hg(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class dg{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t($m(this.auth,"network-request-failed")),ig.get())})}}function fg(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=$m(e,t,r);return s.customData._tokenResponse=n,s}function pg(e){return void 0!==e&&void 0!==e.enterprise}class mg{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return hg(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function gg(e,t){return ag(e,"POST","/v1/accounts:lookup",t)}
/**
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
 */function yg(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}function vg(e){return 1e3*Number(e)}function wg(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return jm("JWT malformed, contained fewer than 3 sections"),null;try{const e=s(n);return e?JSON.parse(e):(jm("Failed to decode base64 JWT payload"),null)}catch(i){return jm("Caught error parsing JWT payload as JSON",null==i?void 0:i.toString()),null}}function Ig(e){const t=wg(e);return Wm(t,"internal-error"),Wm(void 0!==t.exp,"internal-error"),Wm(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
/**
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
 */async function _g(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof _&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
/**
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
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class bg{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===(null==e?void 0:e.code)&&this.schedule(!0))}this.schedule()}}
/**
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
 */class Tg{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=yg(this.lastLoginAt),this.creationTime=yg(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
/**
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
 */async function Eg(e){var t;const n=e.auth,r=await e.getIdToken(),s=await _g(e,gg(n,{idToken:r}));Wm(null==s?void 0:s.users.length,n,"internal-error");const i=s.users[0];e._notifyReloadListener(i);const o=(null==(t=i.providerUserInfo)?void 0:t.length)?Sg(i.providerUserInfo):[],a=(c=e.providerData,u=o,[...c.filter(e=>!u.some(t=>t.providerId===e.providerId)),...u]);var c,u;const l=e.isAnonymous,h=!(e.email&&i.passwordHash||(null==a?void 0:a.length)),d=!!l&&h,f={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Tg(i.createdAt,i.lastLoginAt),isAnonymous:d};Object.assign(e,f)}function Sg(e){return e.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}
/**
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
 */
/**
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
 */
class Cg{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Wm(e.idToken,"internal-error"),Wm(void 0!==e.idToken,"internal-error"),Wm(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):Ig(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Wm(0!==e.length,"internal-error");const t=Ig(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(Wm(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:s}=await async function(e,t){const n=await cg(e,{},async()=>{const n=C({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:s}=e.config,i=await lg(e,r,"/v1/token",`key=${s}`),o=await e._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const a={method:"POST",headers:o,body:n};return e.emulatorConfig&&h(e.emulatorConfig.host)&&(a.credentials="include"),ng.fetch()(i,a)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:s}=t,i=new Cg;return n&&(Wm("string"==typeof n,"internal-error",{appName:e}),i.refreshToken=n),r&&(Wm("string"==typeof r,"internal-error",{appName:e}),i.accessToken=r),s&&(Wm("number"==typeof s,"internal-error",{appName:e}),i.expirationTime=s),i}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Cg,this.toJSON())}_performRefresh(){return Qm("not implemented")}}
/**
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
 */function Ag(e,t){Wm("string"==typeof e||void 0===e,"internal-error",{appName:t})}class kg{constructor({uid:e,auth:t,stsTokenManager:n,...r}){this.providerId="firebase",this.proactiveRefresh=new bg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Tg(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await _g(this,this.stsTokenManager.getToken(this.auth,e));return Wm(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return async function(e,t=!1){const n=x(e),r=await n.getIdToken(t),s=wg(r);Wm(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const i="object"==typeof s.firebase?s.firebase:void 0,o=null==i?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:yg(vg(s.auth_time)),issuedAtTime:yg(vg(s.iat)),expirationTime:yg(vg(s.exp)),signInProvider:o||null,signInSecondFactor:(null==i?void 0:i.sign_in_second_factor)||null}}(this,e)}reload(){return async function(e){const t=x(e);await Eg(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}(this)}_assign(e){this!==e&&(Wm(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>({...e})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new kg({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){Wm(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Eg(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ze(this.auth.app))return Promise.reject(Km(this.auth));const e=await this.getIdToken();return await _g(this,
/**
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
 */
async function(e,t){return ag(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,r=t.email??void 0,s=t.phoneNumber??void 0,i=t.photoURL??void 0,o=t.tenantId??void 0,a=t._redirectEventId??void 0,c=t.createdAt??void 0,u=t.lastLoginAt??void 0,{uid:l,emailVerified:h,isAnonymous:d,providerData:f,stsTokenManager:p}=t;Wm(l&&p,e,"internal-error");const m=Cg.fromJSON(this.name,p);Wm("string"==typeof l,e,"internal-error"),Ag(n,e.name),Ag(r,e.name),Wm("boolean"==typeof h,e,"internal-error"),Wm("boolean"==typeof d,e,"internal-error"),Ag(s,e.name),Ag(i,e.name),Ag(o,e.name),Ag(a,e.name),Ag(c,e.name),Ag(u,e.name);const g=new kg({uid:l,auth:e,email:r,emailVerified:h,displayName:n,isAnonymous:d,photoURL:i,phoneNumber:s,tenantId:o,stsTokenManager:m,createdAt:c,lastLoginAt:u});return f&&Array.isArray(f)&&(g.providerData=f.map(e=>({...e}))),a&&(g._redirectEventId=a),g}static async _fromIdTokenResponse(e,t,n=!1){const r=new Cg;r.updateFromServerResponse(t);const s=new kg({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await Eg(s),s}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];Wm(void 0!==r.localId,"internal-error");const s=void 0!==r.providerUserInfo?Sg(r.providerUserInfo):[],i=!(r.email&&r.passwordHash||(null==s?void 0:s.length)),o=new Cg;o.updateFromIdToken(n);const a=new kg({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:i}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:s,metadata:new Tg(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash||(null==s?void 0:s.length))};return Object.assign(a,c),a}}
/**
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
 */const Ng=new Map;function Dg(e){Jm(e instanceof Function,"Expected a class definition");let t=Ng.get(e);return t?(Jm(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,Ng.set(e,t),t)}
/**
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
 */class xg{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}xg.type="NONE";const Rg=xg;
/**
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
 */function Pg(e,t,n){return`firebase:${e}:${t}:${n}`}class Og{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:s}=this.auth;this.fullUserKey=Pg(this.userKey,r.apiKey,s),this.fullPersistenceKey=Pg("persistence",r.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if("string"==typeof e){const t=await gg(this.auth,{idToken:e}).catch(()=>{});return t?kg._fromGetAccountInfoResponse(this.auth,t,e):null}return kg._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Og(Dg(Rg),e,n);const r=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e);let s=r[0]||Dg(Rg);const i=Pg(n,e.config.apiKey,e.name);let o=null;for(const c of t)try{const t=await c._get(i);if(t){let n;if("string"==typeof t){const r=await gg(e,{idToken:t}).catch(()=>{});if(!r)break;n=await kg._fromGetAccountInfoResponse(e,r,t)}else n=kg._fromJSON(e,t);c!==s&&(o=n),s=c;break}}catch{}const a=r.filter(e=>e._shouldAllowMigration);return s._shouldAllowMigration&&a.length?(s=a[0],o&&await s._set(i,o.toJSON()),await Promise.all(t.map(async e=>{if(e!==s)try{await e._remove(i)}catch{}})),new Og(s,e,n)):new Og(s,e,n)}}
/**
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
 */function Mg(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Ug(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(Lg(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(qg(t))return"Blackberry";if(jg(t))return"Webos";if(Fg(t))return"Safari";if((t.includes("chrome/")||Vg(t))&&!t.includes("edge/"))return"Chrome";if(Bg(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null==n?void 0:n.length))return n[1]}return"Other"}function Lg(e=g()){return/firefox\//i.test(e)}function Fg(e=g()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Vg(e=g()){return/crios\//i.test(e)}function Ug(e=g()){return/iemobile/i.test(e)}function Bg(e=g()){return/android/i.test(e)}function qg(e=g()){return/blackberry/i.test(e)}function jg(e=g()){return/webos/i.test(e)}function zg(e=g()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function $g(){return function(){const e=g();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}()&&10===document.documentMode}function Gg(e=g()){return zg(e)||Bg(e)||jg(e)||qg(e)||/windows phone/i.test(e)||Ug(e)}
/**
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
 */function Kg(e,t=[]){let n;switch(e){case"Browser":n=Mg(g());break;case"Worker":n=`${Mg(g())}-${e}`;break;default:n=e}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ke}/${r}`}
/**
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
 */class Hg{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise((n,r)=>{try{n(e(t))}catch(s){r(s)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==n?void 0:n.message})}}}
/**
 * @license
 * Copyright 2023 Google LLC
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
 */class Wg{constructor(e){var t;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??6,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),void 0!==n.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),void 0!==n.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),void 0!==n.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),void 0!==n.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(null==(t=e.allowedNonAlphanumericCharacters)?void 0:t.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}
/**
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
 */class Qg{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Yg(this),this.idTokenSubscription=new Yg(this),this.beforeStateQueue=new Hg(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Bm,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(e=>this._resolvePersistenceManagerAvailable=e)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Dg(t)),this._initializationPromise=this.queue(async()=>{var n,r,s;if(!this._deleted&&(this.persistenceManager=await Og.create(this,e),null==(n=this._resolvePersistenceManagerAvailable)||n.call(this),!this._deleted)){if(null==(r=this._popupRedirectResolver)?void 0:r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(i){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null==(s=this.currentUser)?void 0:s.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e,!0)):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await gg(this,{idToken:e}),n=await kg._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(ze(this.app)){const e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const n=null==(t=this.redirectUser)?void 0:t._redirectEventId,i=null==r?void 0:r._redirectEventId,o=await this.tryRedirectSignIn(e);n&&n!==i||!(null==o?void 0:o.user)||(r=o.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(i){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(i))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return Wm(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Eg(e)}catch(t){if("auth/network-request-failed"!==(null==t?void 0:t.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ze(this.app))return Promise.reject(Km(this));const t=e?x(e):null;return t&&Wm(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Wm(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ze(this.app)?Promise.reject(Km(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ze(this.app)?Promise.reject(Km(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Dg(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await async function(e,t={}){return ag(e,"GET","/v2/passwordPolicy",og(e,t))}
/**
 * @license
 * Copyright 2023 Google LLC
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
 */(this),t=new Wg(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new b("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:await this.currentUser.getIdToken()};null!=this.tenantId&&(t.tenantId=this.tenantId),await async function(e,t){return ag(e,"POST","/v2/accounts:revokeToken",og(e,t))}(this,t)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null==(e=this._currentUser)?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Dg(e)||this._popupRedirectResolver;Wm(t,this,"argument-error"),this.redirectPersistenceManager=await Og.create(this,[Dg(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),(null==(t=this._currentUser)?void 0:t._redirectEventId)===e?this._currentUser:(null==(n=this.redirectUser)?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const t=(null==(e=this.currentUser)?void 0:e.uid)??null;this.lastNotifiedUid!==t&&(this.lastNotifiedUid=t,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const s="function"==typeof t?t:t.next.bind(t);let i=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(Wm(o,this,"internal-error"),o.then(()=>{i||s(this.currentUser)}),"function"==typeof t){const s=e.addObserver(t,n,r);return()=>{i=!0,s()}}{const n=e.addObserver(t);return()=>{i=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Wm(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Kg(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await(null==(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(ze(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await(null==(e=this.appCheckServiceProvider.getImmediate({optional:!0}))?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){qm.logLevel<=L.WARN&&qm.warn(`Auth (${Ke}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}}function Jg(e){return x(e)}class Yg{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){const n=new N(e,t);return n.subscribe.bind(n)}(e=>this.observer=e)}get next(){return Wm(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
/**
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
 */let Xg={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Zg(e){return Xg.loadJS(e)}class ey{constructor(){this.enterprise=new ty}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class ty{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const ny="NO_RECAPTCHA";class ry{constructor(e){this.type="recaptcha-enterprise",this.auth=Jg(e)}async verify(e="verify",t=!1){async function n(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,n)=>{(async function(e,t){return ag(e,"GET","/v2/recaptchaConfig",og(e,t))})(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(r=>{if(void 0!==r.recaptchaKey){const n=new mg(r);return null==e.tenantId?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}n(new Error("recaptcha Enterprise site key undefined"))}).catch(e=>{n(e)})})}function r(t,n,r){const s=window.grecaptcha;pg(s)?s.enterprise.ready(()=>{s.enterprise.execute(t,{action:e}).then(e=>{n(e)}).catch(()=>{n(ny)})}):r(Error("No reCAPTCHA enterprise script loaded."))}if(this.auth.settings.appVerificationDisabledForTesting){return(new ey).execute("siteKey",{action:"verify"})}return new Promise((e,s)=>{n(this.auth).then(n=>{if(!t&&pg(window.grecaptcha))r(n,e,s);else{if("undefined"==typeof window)return void s(new Error("RecaptchaVerifier is only supported in browser"));let t=Xg.recaptchaEnterpriseScript;0!==t.length&&(t+=n),Zg(t).then(()=>{r(n,e,s)}).catch(e=>{s(e)})}}).catch(e=>{s(e)})})}}async function sy(e,t,n,r=!1,s=!1){const i=new ry(e);let o;if(s)o=ny;else try{o=await i.verify(n)}catch(c){o=await i.verify(n,!0)}const a={...t};if("mfaSmsEnrollment"===n||"mfaSmsSignIn"===n){if("phoneEnrollmentInfo"in a){const e=a.phoneEnrollmentInfo.phoneNumber,t=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:t,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const e=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:e,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function iy(e,t,n,r,s){var i,o;if("EMAIL_PASSWORD_PROVIDER"===s){if(null==(i=e._getRecaptchaConfig())?void 0:i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await sy(e,t,n,"getOobCode"===n);return r(e,s)}return r(e,t).catch(async s=>{if("auth/missing-recaptcha-token"===s.code){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const s=await sy(e,t,n,"getOobCode"===n);return r(e,s)}return Promise.reject(s)})}if("PHONE_PROVIDER"===s){if(null==(o=e._getRecaptchaConfig())?void 0:o.isProviderEnabled("PHONE_PROVIDER")){const s=await sy(e,t,n);return r(e,s).catch(async s=>{var i;if("AUDIT"===(null==(i=e._getRecaptchaConfig())?void 0:i.getProviderEnforcementState("PHONE_PROVIDER"))&&("auth/missing-recaptcha-token"===s.code||"auth/invalid-app-credential"===s.code)){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${n} flow.`);const s=await sy(e,t,n,!1,!0);return r(e,s)}return Promise.reject(s)})}{const s=await sy(e,t,n,!1,!0);return r(e,s)}}return Promise.reject(s+" provider is not supported.")}
/**
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
 */function oy(e,t,n){const r=Jg(e);Wm(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const s=!!(null==n?void 0:n.disableWarnings),i=ay(t),{host:o,port:a}=function(e){const t=ay(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const e=s[1];return{host:e,port:cy(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:cy(t)}}}(t),c=null===a?"":`:${a}`,u={url:`${i}//${o}${c}/`},l=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator)return Wm(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),void Wm(E(u,r.config.emulator)&&E(l,r.emulatorConfig),r,"emulator-config-failed");r.config.emulator=u,r.emulatorConfig=l,r.settings.appVerificationDisabledForTesting=!0,h(o)?(d(`${i}//${o}${c}`),m("Auth",!0)):s||function(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}
/**
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
 */()}function ay(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function cy(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}class uy{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Qm("not implemented")}_getIdTokenResponse(e){return Qm("not implemented")}_linkToIdToken(e,t){return Qm("not implemented")}_getReauthenticationResolver(e){return Qm("not implemented")}}async function ly(e,t){return ag(e,"POST","/v1/accounts:signUp",t)}
/**
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
 */async function hy(e,t){return ug(e,"POST","/v1/accounts:signInWithPassword",og(e,t))}
/**
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
 */
/**
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
 */
class dy extends uy{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new dy(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new dy(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":return iy(e,{returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signInWithPassword",hy,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return async function(e,t){return ug(e,"POST","/v1/accounts:signInWithEmailLink",og(e,t))}(e,{email:this._email,oobCode:this._password});default:zm(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return iy(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",ly,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return async function(e,t){return ug(e,"POST","/v1/accounts:signInWithEmailLink",og(e,t))}(e,{idToken:t,email:this._email,oobCode:this._password});default:zm(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}
/**
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
 */async function fy(e,t){return ug(e,"POST","/v1/accounts:signInWithIdp",og(e,t))}
/**
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
 */class py extends uy{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new py(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):zm("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r,...s}=t;if(!n||!r)return null;const i=new py(n,r);return i.idToken=s.idToken||void 0,i.accessToken=s.accessToken||void 0,i.secret=s.secret,i.nonce=s.nonce,i.pendingToken=s.pendingToken||null,i}_getIdTokenResponse(e){return fy(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,fy(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,fy(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=C(t)}return e}}
/**
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
 */class my{constructor(e){const t=A(k(e)),n=t.apiKey??null,r=t.oobCode??null,s=function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(t.mode??null);Wm(n&&r&&s,"argument-error"),this.apiKey=n,this.operation=s,this.code=r,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=function(e){const t=A(k(e)).link,n=t?A(k(t)).deep_link_id:null,r=A(k(e)).deep_link_id;return(r?A(k(r)).link:null)||r||n||t||e}(e);try{return new my(t)}catch{return null}}}
/**
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
 */class gy{constructor(){this.providerId=gy.PROVIDER_ID}static credential(e,t){return dy._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=my.parseLink(t);return Wm(n,"argument-error"),dy._fromEmailAndCode(e,n.code,n.tenantId)}}gy.PROVIDER_ID="password",gy.EMAIL_PASSWORD_SIGN_IN_METHOD="password",gy.EMAIL_LINK_SIGN_IN_METHOD="emailLink";
/**
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
 */
class yy{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
/**
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
 */class vy extends yy{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}
/**
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
 */class wy extends vy{constructor(){super("facebook.com")}static credential(e){return py._fromParams({providerId:wy.PROVIDER_ID,signInMethod:wy.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return wy.credentialFromTaggedObject(e)}static credentialFromError(e){return wy.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return wy.credential(e.oauthAccessToken)}catch{return null}}}wy.FACEBOOK_SIGN_IN_METHOD="facebook.com",wy.PROVIDER_ID="facebook.com";
/**
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
 */
class Iy extends vy{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return py._fromParams({providerId:Iy.PROVIDER_ID,signInMethod:Iy.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Iy.credentialFromTaggedObject(e)}static credentialFromError(e){return Iy.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Iy.credential(t,n)}catch{return null}}}Iy.GOOGLE_SIGN_IN_METHOD="google.com",Iy.PROVIDER_ID="google.com";
/**
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
 */
class _y extends vy{constructor(){super("github.com")}static credential(e){return py._fromParams({providerId:_y.PROVIDER_ID,signInMethod:_y.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _y.credentialFromTaggedObject(e)}static credentialFromError(e){return _y.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return _y.credential(e.oauthAccessToken)}catch{return null}}}_y.GITHUB_SIGN_IN_METHOD="github.com",_y.PROVIDER_ID="github.com";
/**
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
 */
class by extends vy{constructor(){super("twitter.com")}static credential(e,t){return py._fromParams({providerId:by.PROVIDER_ID,signInMethod:by.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return by.credentialFromTaggedObject(e)}static credentialFromError(e){return by.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return by.credential(t,n)}catch{return null}}}
/**
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
 */
async function Ty(e,t){return ug(e,"POST","/v1/accounts:signUp",og(e,t))}
/**
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
 */by.TWITTER_SIGN_IN_METHOD="twitter.com",by.PROVIDER_ID="twitter.com";class Ey{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const s=await kg._fromIdTokenResponse(e,n,r),i=Sy(n);return new Ey({user:s,providerId:i,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=Sy(n);return new Ey({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function Sy(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
/**
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
 */class Cy extends _{constructor(e,t,n,r){super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Cy.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Cy(e,t,n,r)}}function Ay(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(n=>{if("auth/multi-factor-auth-required"===n.code)throw Cy._fromErrorAndOperation(e,n,t,r);throw n})}
/**
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
 */
async function ky(e,t,n=!1){if(ze(e.app))return Promise.reject(Km(e));const r="signIn",s=await Ay(e,r,t),i=await Ey._fromIdTokenResponse(e,r,s);return n||await e._updateCurrentUser(i.user),i}
/**
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
 */
async function Ny(e){const t=Jg(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function Dy(e,t,n){if(ze(e.app))return Promise.reject(Km(e));const r=Jg(e),s=iy(r,{returnSecureToken:!0,email:t,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Ty,"EMAIL_PASSWORD_PROVIDER"),i=await s.catch(t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Ny(e),t}),o=await Ey._fromIdTokenResponse(r,"signIn",i);return await r._updateCurrentUser(o.user),o}function xy(e,t,n){return ze(e.app)?Promise.reject(Km(e)):async function(e,t){return ky(Jg(e),t)}(x(e),gy.credential(t,n)).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Ny(e),t})}const Ry="__sak";
/**
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
 */class Py{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ry,"1"),this.storage.removeItem(Ry),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
/**
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
 */class Oy extends Py{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Gg(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},s=this.storage.getItem(n);$g()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,10):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Oy.type="LOCAL";const My=Oy;
/**
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
 */class Ly extends Py{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Ly.type="SESSION";const Fy=Ly;
/**
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
 */
/**
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
 */
class Vy{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;const n=new Vy(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:s}=t.data,i=this.handlersMap[r];if(!(null==i?void 0:i.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(i).map(async e=>e(t.origin,s)),a=await function(e){return Promise.all(e.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
/**
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
 */
function Uy(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
/**
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
 */Vy.receivers=[];class By{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let s,i;return new Promise((o,a)=>{const c=Uy("",20);r.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},n);i={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===c)switch(t.data.status){case"ack":clearTimeout(u),s=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(t.data.response);break;default:clearTimeout(u),clearTimeout(s),a(new Error("invalid_response"))}}},this.handlers.add(i),r.port1.addEventListener("message",i.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])}).finally(()=>{i&&this.removeMessageHandler(i)})}}
/**
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
 */function qy(){return window}
/**
 * @license
 * Copyright 2020 Google LLC.
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
 */
function jy(){return void 0!==qy().WorkerGlobalScope&&"function"==typeof qy().importScripts}
/**
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
 */
const zy="firebaseLocalStorageDb",$y="firebaseLocalStorage",Gy="fbase_key";class Ky{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Hy(e,t){return e.transaction([$y],t?"readwrite":"readonly").objectStore($y)}function Wy(){const e=indexedDB.open(zy,1);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const t=e.result;try{t.createObjectStore($y,{keyPath:Gy})}catch(r){n(r)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains($y)?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(zy);return new Ky(e).toPromise()}(),t(await Wy()))})})}async function Qy(e,t,n){const r=Hy(e,!0).put({[Gy]:t,value:n});return new Ky(r).toPromise()}function Jy(e,t){const n=Hy(e,!0).delete(t);return new Ky(n).toPromise()}class Yy{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await Wy()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return jy()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Vy._getInstance(jy()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await async function(){if(!(null==navigator?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}(),!this.activeServiceWorker)return;this.sender=new By(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null==(e=n[0])?void 0:e.fulfilled)&&(null==(t=n[0])?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null==(t=null==navigator?void 0:navigator.serviceWorker)?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Wy();return await Qy(e,Ry,"1"),await Jy(e,Ry),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Qy(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(t=>async function(e,t){const n=Hy(e,!1).get(t),r=await new Ky(n).toPromise();return void 0===r?null:r.value}(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Jy(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(e=>{const t=Hy(e,!1).getAll();return new Ky(t).toPromise()});if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:s}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(s)&&(this.notifyListeners(r,s),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}Yy.type="LOCAL";const Xy=Yy;new eg(3e4,6e4);
/**
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
 */
class Zy extends uy{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return fy(e,this._buildIdpRequest())}_linkToIdToken(e,t){return fy(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return fy(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function ev(e){return ky(e.auth,new Zy(e),e.bypassAuthState)}function tv(e){const{auth:t,user:n}=e;return Wm(n,t,"internal-error"),
/**
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
 */
async function(e,t,n=!1){const{auth:r}=e;if(ze(r.app))return Promise.reject(Km(r));const s="reauthenticate";try{const i=await _g(e,Ay(r,s,t,e),n);Wm(i.idToken,r,"internal-error");const o=wg(i.idToken);Wm(o,r,"internal-error");const{sub:a}=o;return Wm(e.uid===a,r,"user-mismatch"),Ey._forOperation(e,s,i)}catch(i){throw"auth/user-not-found"===(null==i?void 0:i.code)&&zm(r,"user-mismatch"),i}}(n,new Zy(e),e.bypassAuthState)}async function nv(e){const{auth:t,user:n}=e;return Wm(n,t,"internal-error"),async function(e,t,n=!1){const r=await _g(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return Ey._forOperation(e,"link",r)}(n,new Zy(e),e.bypassAuthState)}
/**
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
 */class rv{constructor(e,t,n,r,s=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:s,error:i,type:o}=e;if(i)return void this.reject(i);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:s||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return ev;case"linkViaPopup":case"linkViaRedirect":return nv;case"reauthViaPopup":case"reauthViaRedirect":return tv;default:zm(this.auth,"internal-error")}}resolve(e){Jm(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Jm(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
/**
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
 */const sv=new eg(2e3,1e4);class iv extends rv{constructor(e,t,n,r,s){super(e,t,r,s),this.provider=n,this.authWindow=null,this.pollId=null,iv.currentPopupAction&&iv.currentPopupAction.cancel(),iv.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Wm(e,this.auth,"internal-error"),e}async onExecution(){Jm(1===this.filter.length,"Popup operations only handle one event");const e=Uy();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject($m(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null==(e=this.authWindow)?void 0:e.associatedEvent)||null}cancel(){this.reject($m(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,iv.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null==(n=null==(t=this.authWindow)?void 0:t.window)?void 0:n.closed)?this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject($m(this.auth,"popup-closed-by-user"))},8e3):this.pollId=window.setTimeout(e,sv.get())};e()}}iv.currentPopupAction=null;
/**
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
 */
const ov="pendingRedirect",av=new Map;class cv extends rv{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=av.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=function(e){return Pg(ov,e.config.apiKey,e.name)}(t),r=function(e){return Dg(e._redirectPersistence)}(e);if(!(await r._isAvailable()))return!1;const s="true"===await r._get(n);return await r._remove(n),s}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}av.set(this.auth._key(),e)}return this.bypassAuthState||av.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}function uv(e,t){av.set(e._key(),t)}async function lv(e,t,n=!1){if(ze(e.app))return Promise.reject(Km(e));const r=Jg(e),s=
/**
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
 */
function(e,t){return t?Dg(t):(Wm(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}(r,t),i=new cv(r,s,n),o=await i.execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,t)),o}
/**
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
 */class hv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return fv(e);default:return!1}}
/**
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
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!fv(e)){const r=(null==(n=e.error.code)?void 0:n.split("auth/")[1])||"internal-error";t.onError($m(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(dv(e))}saveEventToCache(e){this.cachedEventUids.add(dv(e)),this.lastProcessedEventTime=Date.now()}}function dv(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function fv({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null==t?void 0:t.code)}
/**
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
 */
const pv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,mv=/^https?/;async function gv(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return ag(e,"GET","/v1/projects",t)}(e);for(const n of t)try{if(yv(n))return}catch{}zm(e,"unauthorized-domain")}function yv(e){const t=Ym(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const s=new URL(e);return""===s.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&s.hostname===r}if(!mv.test(n))return!1;if(pv.test(e))return r===e;const s=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const vv=new eg(3e4,6e4);function wv(){const e=qy().___jsl;if(null==e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function Iv(e){return new Promise((t,n)=>{var r,s,i;function o(){wv(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{wv(),n($m(e,"network-request-failed"))},timeout:vv.get()})}if(null==(s=null==(r=qy().gapi)?void 0:r.iframes)?void 0:s.Iframe)t(gapi.iframes.getContext());else{if(!(null==(i=qy().gapi)?void 0:i.load)){const t=`__${"iframefcb"}${Math.floor(1e6*Math.random())}`;return qy()[t]=()=>{gapi.load?o():n($m(e,"network-request-failed"))},Zg(`${Xg.gapiScript}?onload=${t}`).catch(e=>n(e))}o()}}).catch(e=>{throw _v=null,e})}let _v=null;
/**
 * @license
 * Copyright 2020 Google LLC.
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
 */
const bv=new eg(5e3,15e3),Tv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ev=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Sv(e){const t=e.config;Wm(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?tg(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:Ke},s=Ev.get(e.config.apiHost);s&&(r.eid=s);const i=e._getFrameworks();return i.length&&(r.fw=i.join(",")),`${n}?${C(r).slice(1)}`}async function Cv(e){const t=await function(e){return _v=_v||Iv(e),_v}(e),n=qy().gapi;return Wm(n,e,"internal-error"),t.open({where:document.body,url:Sv(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Tv,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});const s=$m(e,"network-request-failed"),i=qy().setTimeout(()=>{r(s)},bv.get());function o(){qy().clearTimeout(i),n(t)}t.ping(o).then(o,()=>{r(s)})}))}
/**
 * @license
 * Copyright 2020 Google LLC.
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
 */const Av={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class kv{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function Nv(e,t,n,r=500,s=600){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c={...Av,width:r.toString(),height:s.toString(),top:i,left:o},u=g().toLowerCase();n&&(a=Vg(u)?"_blank":n),Lg(u)&&(t=t||"http://localhost",c.scrollbars="yes");const l=Object.entries(c).reduce((e,[t,n])=>`${e}${t}=${n},`,"");if(function(e=g()){var t;return zg(e)&&!!(null==(t=window.navigator)?void 0:t.standalone)}(u)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
/**
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
 */(t||"",a),new kv(null);const h=window.open(t||"",a,l);Wm(h,e,"popup-blocked");try{h.focus()}catch(d){}return new kv(h)}const Dv="__/auth/handler",xv="emulator/auth/handler",Rv=encodeURIComponent("fac");async function Pv(e,t,n,r,s,i){Wm(e.config.authDomain,e,"auth-domain-config-required"),Wm(e.config.apiKey,e,"invalid-api-key");const o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:Ke,eventId:s};if(t instanceof yy){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||"",function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries(i||{}))o[e]=t}if(t instanceof vy){const e=t.getScopes().filter(e=>""!==e);e.length>0&&(o.scopes=e.join(","))}e.tenantId&&(o.tid=e.tenantId);const a=o;for(const l of Object.keys(a))void 0===a[l]&&delete a[l];const c=await e._getAppCheckToken(),u=c?`#${Rv}=${encodeURIComponent(c)}`:"";return`${function({config:e}){if(!e.emulator)return`https://${e.authDomain}/${Dv}`;return tg(e,xv)}
/**
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
 */(e)}?${C(a).slice(1)}${u}`}const Ov="webStorageSupport";const Mv=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Fy,this._completeRedirectFn=lv,this._overrideRedirectResult=uv}async _openPopup(e,t,n,r){var s;Jm(null==(s=this.eventManagers[e._key()])?void 0:s.manager,"_initialize() not called before _openPopup()");return Nv(e,await Pv(e,t,n,Ym(),r),Uy())}async _openRedirect(e,t,n,r){await this._originValidation(e);return function(e){qy().location.href=e}(await Pv(e,t,n,Ym(),r)),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(Jm(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await Cv(e),n=new hv(e);return t.register("authEvent",t=>{Wm(null==t?void 0:t.authEvent,e,"invalid-auth-event");return{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ov,{type:Ov},n=>{var r;const s=null==(r=null==n?void 0:n[0])?void 0:r[Ov];void 0!==s&&t(!!s),zm(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=gv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Gg()||Fg()||zg()}};var Lv="@firebase/auth",Fv="1.11.0";
/**
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
 */
class Vv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null==(e=this.auth.currentUser)?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;return{accessToken:await this.auth.currentUser.getIdToken(e)}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Wm(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
/**
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
 */
/**
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
 */
const Uv=u("authIdTokenMaxAge")||300;let Bv=null;function qv(e=We()){const t=je(e,"auth");if(t.isInitialized())return t.getImmediate();const n=function(e,t){const n=je(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(E(n.getOptions(),t??{}))return e;zm(e,"already-initialized")}return n.initialize({options:t})}(e,{popupRedirectResolver:Mv,persistence:[Xy,My,Fy]}),r=u("authTokenSyncURL");if(r&&"boolean"==typeof isSecureContext&&isSecureContext){const e=new URL(r,location.origin);if(location.origin===e.origin){const t=(s=e.toString(),async e=>{const t=e&&await e.getIdTokenResult(),n=t&&((new Date).getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>Uv)return;const r=null==t?void 0:t.token;Bv!==r&&(Bv=r,await fetch(s,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))});!function(e,t,n){x(e).beforeAuthStateChanged(t,n)}(n,t,()=>t(n.currentUser)),function(e,t,n,r){x(e).onIdTokenChanged(t,n,r)}(n,e=>t(e))}}var s;const i=a("auth");return i&&oy(n,`http://${i}`),n}var jv;Xg={loadJS:e=>new Promise((t,n)=>{const r=document.createElement("script");var s;r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=$m("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",((null==(s=document.getElementsByTagName("head"))?void 0:s[0])??document).appendChild(r)}),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},jv="Browser",qe(new R("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:i,authDomain:o}=n.options;Wm(i&&!i.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:i,authDomain:o,clientPlatform:jv,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Kg(jv)},c=new Qg(n,r,s,a);return function(e,t){const n=(null==t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Dg);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null==t?void 0:t.popupRedirectResolver)}(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),qe(new R("auth-internal",e=>{const t=Jg(e.getProvider("auth").getImmediate());return new Vv(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Qe(Lv,Fv,function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(jv)),Qe(Lv,Fv,"esm2020");export{jf as a,im as b,Pf as c,Of as d,rm as e,Cm as f,qv as g,um as h,He as i,cm as j,Dm as k,Vp as l,Nm as m,Am as n,lm as o,km as p,Pp as q,xy as r,om as s,Dy as t,am as u,Fm as v,Mp as w};
