export default {
  async fetch(request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")
    const integrity = searchParams.get("integrity")

    if (!url || !integrity || !integrity.startsWith("sha256-")) {
      return new Response("// Invalid request\n", { status: 400 })
    }

    try {
      const targetRes = await fetch(url)

      if (!targetRes.ok) {
        return new Response(`// Failed to fetch target (${targetRes.status})\n`, { status: 502 })
      }

      const contentBuffer = await targetRes.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest("SHA-256", contentBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashBase64 = btoa(hashArray.map(b => String.fromCharCode(b)).join(""))

      const expectedHash = integrity.replace("sha256-", "")

      if (hashBase64 === expectedHash) {
        return new Response(contentBuffer, {
          status: 200,
          headers: {
            "Content-Type": targetRes.headers.get("Content-Type") || "application/javascript",
            "X-Integrity-Verified": "true",
          }
        })
      } else {
        return new Response(`// Integrity check failed\nconsole.error("Integrity mismatch");\n`, {
          status: 200,
          headers: {
            "Content-Type": "application/javascript",
            "X-Integrity-Verified": "false",
          }
        })
      }
    } catch (e) {
      return new Response(`// Error: ${e.message}\n`, { status: 500 })
    }
  }
}
