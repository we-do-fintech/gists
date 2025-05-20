# PoC of safejs

## What is this?

`safejs` is a PoC of proxy similar to SRI to secure imported third parties.

This is particularly useful when using:

* `importScripts()` inside Web Workers
* Environments without native SRI enforcement

## Why it matters

The web loads tons of third-party code — often without audit or control. One compromised CDN and you’re shipping malware to production.

**Subresource Integrity (SRI)** helps, but only works in HTML. Not in JS. Not in Workers. Not in `importScripts()`.


```js
importScripts("https://safejs.yourdomain.workers.dev/?url=https://cdn.example.com/lib.js&integrity=sha256-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcdeFg=");
```

If the hash is valid ✅ — script loads.
If the hash is wrong ❌ — returns:

```js
// Integrity check failed
console.error("Integrity mismatch");
```


by [wdft](https://wdft.ovh)