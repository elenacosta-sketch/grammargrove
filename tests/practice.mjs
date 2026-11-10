import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),frontend=await readFile(new URL('../dist/app.js',import.meta.url),'utf8'),data=await readFile(new URL('../dist/data.js',import.meta.url),'utf8');
assert(!/join-nav|account-entry|avatar-entry|data-view="classroom"/.test(html));
assert(!/authState|authScreen|studentView|fetch\(|function signup|function classroom/.test(frontend));
assert(html.includes('src="./app.js"')&&html.includes('href="./style.css"'));
const storage=new Map(),nodes=new Map(),menus=['home','reels','library','progress','practice'].map(v=>({dataset:{view:v},classList:{toggle(){}}}));
function removeChildren(id){for(const [key,n] of [...nodes])if(n.owner===id){removeChildren(key);nodes.delete(key)}}
let serial=0;
class Node{constructor(id,owner){this.id=id;this.owner=owner;this.value=id==='level'?'All levels':'';this.dataset={};this.classList={add(){},remove(){},toggle(){return false},contains(){return false}};this.style={};this.open=false}set innerHTML(value){this.html=value;removeChildren(this.id);for(let match of value.matchAll(/id="([^"]+)"/g))nodes.set(match[1],new Node(match[1],this.id));for(let match of value.matchAll(/data-match="(\d+)"/g)){let n=new Node('match-'+serial++,this.id);n.dataset.match=match[1];nodes.set(n.id,n)}}get innerHTML(){return this.html||''}addEventListener(){}showModal(){this.open=true}close(){this.open=false}setAttribute(){}}
const root=new Node('document');root.innerHTML=html;nodes.set('close',new Node('close'));nodes.set('body',new Node('body'));
const document={querySelector:s=>s==='.close'?nodes.get('close'):s==='.search'?new Node('search'):nodes.get(s.slice(1))||null,querySelectorAll:s=>s==='nav button'||s==='[data-view]'?menus:s==='[data-match]'?[...nodes.values()].filter(n=>n.dataset.match!==undefined):[],body:nodes.get('body')};
const context=vm.createContext({document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setTimeout(){},window:{scrollTo(){}},scrollTo(){},scrollY:0});
vm.runInContext(data+'\n'+frontend,context);
assert(nodes.get('app').innerHTML.includes('Your daily grammar boost'));
for(let page of ['practice','library','progress','home'])vm.runInContext(`navigate('${page}')`,context);
for(let id=0;id<33;id++){
let bank=vm.runInContext(`TOPICS[${id}].bank`,context);assert.equal(bank.length,13);assert.equal(new Set(bank.map(x=>x.sentence)).size,13);
let first=vm.runInContext(`chooseItems(${id},8)`,context),second=vm.runInContext(`chooseItems(${id},8)`,context);assert.equal(new Set(first).size,8);assert.equal(new Set([...first,...second]).size,13);
}
vm.runInContext('start(7)',context);
for(let i=0;i<6;i++){
let kind=vm.runInContext('quiz.order[quiz.step]',context),item=vm.runInContext('currentItem(quiz)',context);
if(kind===0||kind===5)vm.runInContext(`quiz.choice=${JSON.stringify(kind===0?item.answer:item.sentence)}`,context);
if(kind===1||kind===2)nodes.get('typed').value=kind===1?item.answer:item.sentence;
if(kind===3)vm.runInContext('quiz.tokens=quiz.wordbank.map(x=>x.i).sort((a,b)=>a-b)',context);
if(kind===4){let answers=vm.runInContext('quiz.match',context);[...nodes.values()].filter(n=>n.dataset.match!==undefined).forEach((n,i)=>n.value=answers[i])}
vm.runInContext('check()',context);nodes.get('check').onclick();
}
assert.equal(vm.runInContext('quiz.score',context),6);assert(nodes.get('lessoncontent').innerHTML.includes('Your practice progress is saved in this browser.'));assert.equal(JSON.parse(storage.get('grove-progress')).done[7],6);
console.log('PASS: account controls removed, relative assets, all practice views, 429 examples, rotation, six-format quest completion and local progress');
const {default:worker}=await import('../worker/index.js');
assert.equal((await worker.fetch(new Request('https://test.site/api/me'),{})).status,404);
assert.equal((await worker.fetch(new Request('https://test.site/api/join',{method:'POST'}),{})).status,404);
console.log('PASS: retired account and enrollment API routes are unavailable');
