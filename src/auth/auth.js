export function isNonEmpty(s){ return typeof s==='string' && s.trim().length>0; }
export function minLen(s,n){ return typeof s==='string' && s.trim().length>=n; }
export function validateUsername(u){ return isNonEmpty(u) && /^[a-z0-9_.-]+$/i.test(u); }
export function validatePassword(p){ return isNonEmpty(p) && minLen(p,6); }

export function fakeSignIn({username,password}){
  if(!validateUsername(username)) return {ok:false, message:"Invalid username"};
  if(!validatePassword(password)) return {ok:false, message:"Invalid password"};
  return {ok:true, token:"fake.jwt.token", user:{name:username}};
}

export function attachLoginFormHandlers(){
  const form=document.getElementById('login-form');
  const out=document.getElementById('login-output');
  if(!form||!out) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const username=form.username.value, password=form.password.value;
    const res=fakeSignIn({username,password});
    out.textContent=res.ok?`Welcome ${username}!`:res.message;
  });
}
document.addEventListener('DOMContentLoaded', attachLoginFormHandlers);
