!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){const n=new Request("https://cfw-takehome.developers.workers.dev/api/variants"),r="_wrangling_cloudflare_variant",o=new RegExp(r+"=(.+?)(?=;?\\s|$)","m"),a=["Something has not gone as planned...","Oh noes!","You are here, but the page is not.","We promise, there really should be a response here...","Clearly, someone took a wrong turn."];function i(e){return(new HTMLRewriter).on("p#description",{element(e){e.setInnerContent("Congratulations! There were two paths in the woods, equally traveled, and you took one of them. I think that's how it goes at least...")}}).on("title",{element(e){e.setInnerContent("Variant Paths")}}).on("a#url",{element(e){e.setAttribute("href","https://github.com/thearchitector"),e.setInnerContent('<div class="text-center"><img width="32" style="display:inline-block !important" src="https://upload.wikimedia.org/wikipedia/commons/9/95/Font_Awesome_5_brands_github.svg"><span class="pl-2 align-middle">Visit Elias on GitHub</span></div>',{html:!0})}}).transform(e)}addEventListener("fetch",e=>e.respondWith(async function(e){try{let t=e.headers.get("Cookie")||"";if(t.includes(r)){let e=t.match(o)[1];return i(await fetch(e))}let a=await fetch(n);if(!a.ok)throw new Error(":(");let s=(await a.json()).variants,l=s[Math.floor(Math.random()*s.length)],u=await fetch(l);return u=new Response(u.body,u),u.headers.set("Set-Cookie",`${r}=${l}`),i(u)}catch(e){let t=Math.floor(Math.random()*a.length);return new Response(a[t]+" Please try again later.",{headers:{"content-type":"text/plain; charset=utf-8"},status:500})}}(e.request)))}]);