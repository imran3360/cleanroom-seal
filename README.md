# CleanRoom Seal — Verifiable Redaction for Sensitive Documents

Built at **NEAR HACKATHON** (Nov 1–14, 2026) · Track: **Privacy & Private AI** (`privacy`)

## The problem
Journalists, lawyers, clinics and whistleblowers need AI to clean documents before
sharing them — but pasting a leak, a case file or a patient note into a normal AI
chat means the AI's operator can read it. For this job, ordinary AI is disqualified
by design: you have to trust the operator.

## What CleanRoom Seal does
1. You paste a sensitive document in a static web page (bring-your-own NEAR AI key,
   held in tab memory only).
2. The document is redacted by a model running inside **NEAR AI Cloud's Trusted
   Execution Environments (TEEs)** — model providers, cloud providers and NEAR
   itself cannot see the input.
3. The page then **verifies the proof in your browser**: it fetched the NEAR AI
   attestation report *before* the request, recomputes SHA-256 over the exact
   request and response bytes, fetches the completion's signature, checks the
   signed text, matches the signer against the preflight attestation evidence,
   and verifies the Ed25519 signature where the browser supports it.
4. Only **hashes** — never the document — form a seal payload for a chain-of-custody
   record on NEAR (testnet `seal()` contract, phase 2).

If any check fails, the page shows red and says **NOT VERIFIED**. It never paints
a fake green.

## Try it (do X → see Y)
1. Open the hosted demo → see the 4-step CleanRoom page.
2. Get a NEAR AI key ($10 free via https://nearbuilders.org/dashboard — a NEAR
   Builders key — or https://cloud.near.ai) and paste it into Step 0
   → the key stays in the tab; nothing is stored.
3. Click **Load fictional sample memo** → a memo full of invented names, an IBAN,
   a passport number and addresses fills the box.
4. Click **Clean inside the TEE** → the redacted document appears with names and
   numbers replaced by ███, plus the completion id and SHA-256 hashes of the
   original, the redaction, and the exact request/response bytes.
5. Read the verification panel → each check is listed: attestation preflight,
   signature presence, signed-text match, signer match, Ed25519 verification,
   and a final VERIFIED / NOT VERIFIED verdict.
6. Click **Open NEAR Verification Center** → NEAR's own page re-checks the model
   attestation in your browser.
7. Copy the seal payload → it contains only hashes, the model and the completion id.

## How NEAR fits
- **NEAR AI Cloud** (cloud-api.near.ai) is the engine: OpenAI-compatible chat
  completions inside TEEs, a public attestation report endpoint, and per-completion
  response signatures (`/v1/signature/<id>`).
- Verification follows NEAR AI's published flow
  (docs.near.ai/cloud/verification/cloud-api/response-signatures):
  `request_hash = SHA-256(exact request bytes)`, `response_hash = SHA-256(exact
  response bytes)`; `provider_tee` signed text is `<MODEL>:<req>:<res>`, `gateway`
  signed text is `<req>:<res>`. Requests send `x-no-aliasing: true` with the
  canonical model id.
- **NEAR (testnet)** anchors the seal: hashes only, so the custody record is public
  and permanent without leaking content.

## Honest limits (what we do NOT claim)
- A `gateway` signature binds the reply to the attested gateway, **not** by itself
  to model TEE execution. The page labels the signature kind it actually got.
  Only `provider_tee` binds to a model-serving TEE signer.
- Full Intel TDX quote validation is done by NEAR's Verification Center (linked
  from the page); this page checks signer matching and the reply signature.
- The seal contract is phase 2; until it is deployed, the page shows the exact
  seal payload that will be submitted.
- Demo data is fictional. Never paste real personal data into any demo.

## Stack
One static HTML file (no backend, no build step): browser fetch to
`cloud-api.near.ai` (CORS-verified), WebCrypto for SHA-256 and Ed25519.
AI assistance: built with Muse (Muse) as the coding agent; libraries: none
(vanilla JS + WebCrypto).

## License
MIT
