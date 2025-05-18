#!/usr/bin/env node
/* eslint-disable no-console */
const fs=require('fs');
const path=require('path');
const axios=require('axios');
const dotenv=require('dotenv');
const pLimit=require('p-limit');
const chalk=require('chalk');
dotenv.config();
const DIR=path.resolve('src','data');
const FILES=['videos.ts','pdfs.ts','externalResources.ts'];
const RE=/https?:\/\/[^\s'"\)]+/g;
const CONC=10;
const KEY=process.env.MISTRAL_API_KEY||'';
const limit=pLimit(CONC);
const seen=new Set();
const dead=[];
async function myst(url){
 if(!KEY) return '';
 try{
  const r=await axios.post('https://api.mistral.ai/v1/chat/completions',{
    model:'mistral-small',
    messages:[{role:'user',content:`Verify resource: ${url}`}],
    temperature:0.1
  },{headers:{Authorization:`Bearer ${KEY}`},timeout:15000});
  return r.data.choices?.[0]?.message?.content?.trim()||'';
 }catch(e){return`⚠️ ${e.response?.status??e.message}`;}
}
async function alive(url){
 try{
  const r=await axios.head(url,{timeout:10000,maxRedirects:3});
  return r.status>=200&&r.status<400;
 }catch{
  try{
   const r=await axios.get(url,{headers:{Range:'bytes=0-0'},timeout:10000,maxRedirects:3});
   return r.status>=200&&r.status<400;
  }catch{return false;}
 }
}
(async()=>{
 for(const f of FILES){
  const p=path.join(DIR,f);
  if(!fs.existsSync(p))continue;
  const urls=(fs.readFileSync(p,'utf8').match(RE)||[])
    .map(u=>u.replace(/[',"\)]+$/,''))
    .filter(u=>!seen.has(u)&&seen.add(u));
  await Promise.all(urls.map(u=>limit(async()=>{
    if(!await alive(u)){
      dead.push(`${f}: ${u}`);
      console.log(chalk.red('✗'),u,chalk.gray(`(${f})`));
      return;
    }
    const note=await myst(u);
    console.log(chalk.green('✓'),u,note?chalk.cyan(`→ ${note}`):'');
  })));
 }
 if(dead.length){
  fs.writeFileSync('broken-links.txt',dead.join('\n'));
  console.error(chalk.red(`\n${dead.length} broken link(s).`));
  process.exit(1);
 }else{
  console.log(chalk.blue('\nAll links healthy ✔'));
 }
})();
