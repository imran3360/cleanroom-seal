# CleanRoom Seal — Verifiable Redaction for Sensitive Documents

Built at **NEAR HACKATHON** (Nov 1–14, 2026) · Track: **Privacy & Private AI** (`privacy`)

**▶ Live demo: https://cleanroom-seal.pages.dev/** (Cloudflare Pages)
· backup mirror: https://imran3360.github.io/cleanroom-seal/ (GitHub Pages)

**Status (Nov 13, 2026):** the full flow runs live end-to-end — a real Builders
key cleaned the sample memo and the browser verification panel returned
**PROOF VERIFIED** with signature kind **`provider_tee`** (the model-TEE tier).
The `seal()` contract is **deployed on NEAR testnet at
[`imran3360.testnet`](https://testnet.nearblocks.io/address/imran3360.testnet)**
(deploy tx `9oBx4AgsQu81uxLBNKVH6i6kujQMxd6HN8oh7x5bJGgf`) and **three seals are
recorded on-chain** (`seal_count` = 3, all verified via RPC) — the second was
sealed from the demo page itself through a Meteor testnet wallet
(block 277497139).
**Live verified run #3:** sealed from the demo page by `equallace2782.testnet`,
completion `c017c39f1dc0400abc4f435bcb74262c`, block `277510508`. Contract source: `seal-contract.js`; build/deploy guide:
`DEPLOY.md`. The demo page seals from the browser with a testnet wallet via
NEAR Wallet Selector (Meteor Wallet), and anyone can audit a seal afterwards
with the read-only **Verify a seal** lookup (Step 5 — no wallet, no key).

## The problem
Journalists, lawyers, clinics and whistleblowers need AI to clean documents before
sharing them — but pasting a leak, a case file or a patient note into a normal AI
chat means the AI's operator can read it. For this job, ordinary AI is disqualified
by design: you have to trust the operator.

## What CleanRoom Seal does
1. You paste a sensitive document in a static web page (bring-your-own NEAR AI key,
   held in tab memory only).
2. The document is redacted by a model running inside **NEAR AI Cloud's Trusted
   Execution Environments (TEEs)** — the model sees the document inside the
   enclave; the operator cannot read it there. That is the claim the
   attestation and signature checks below exist to test.
3. The page then **verifies the proof in your browser**: it fetched the NEAR AI
   attestation report *before* the request, recomputes SHA-256 over the exact
   request and response bytes, fetches the completion's signature, checks the
   signed text, matches the signer against the preflight attestation evidence,
   and verifies the Ed25519 signature where the browser supports it.
4. Only **hashes** — never the document — are sealed on NEAR testnet via the
   `seal()` contract, forming a public chain-of-custody record.

If any check fails, the page shows red and says **NOT VERIFIED**. It never paints
a fake green.

## Try it (do X → see Y)
1. Open the hosted demo → see the 6-step CleanRoom page (Steps 0–5).
2. Get a NEAR AI key ($10 free via https://nearbuilders.org/dashboard — a NEAR
   Builders key — or https://cloud.near.ai) and paste it into Step 0
   → the key stays in the tab; nothing is stored.
3. Click **Load fictional sample memo** → a memo full of invented names, an IBAN,
   a passport number and addresses fills the box. (You can also load a local
   .txt file — button or drag & drop; it is read in your browser only.)
4. Click **Clean inside the TEE** → the redacted document appears with names and
   numbers replaced by ███, a **redaction report** (how many ███ blocks were
   applied), the completion id, and SHA-256 hashes of the original, the
   redaction, and the exact request/response bytes.
5. Read the verification panel → each check is listed: attestation preflight,
   signature presence, signed-text match, signer match, Ed25519 verification,
   and a final VERIFIED / NOT VERIFIED verdict.
6. Click **Open NEAR Verification Center** → NEAR's own page re-checks the model
   attestation in your browser.
7. Click **Connect NEAR testnet wallet** → sign in with a testnet wallet
   (NEAR Wallet Selector — Meteor Wallet), then **Seal this run on NEAR testnet** → the page
   calls `seal()` with only the two hashes, the model and the completion id,
   and reports the contract's new `seal_count`. Verify the record yourself on
   [NearBlocks testnet](https://testnet.nearblocks.io/address/imran3360.testnet)
   (`get_seal_by_doc_hash` with the original SHA-256).
8. **Verify a seal (Step 5)** → paste the fictional sample memo (or any sealed
   document, or its SHA-256) and click **Check the seal on NEAR testnet** →
   the page hashes it locally and shows the on-chain custody record: who
   sealed it, both hashes, the model, the block height and the time. This is
   the audit step a recipient, editor or court could run — the document itself
   is never sent anywhere.

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
- The seal contract is a hackathon demo on **testnet**: records are permanent
  and public there, so never seal hashes of real documents you need to keep
  unlinkable — a hash of a known document is confirmable by anyone who has it.
- Demo data is fictional. Never paste real personal data into any demo.

## Roadmap (honest next steps, not shipped yet)
- Full Intel TDX quote validation inside the page (today it links out to
  NEAR's Verification Center).
- Mainnet seals for production chain-of-custody, with access-controlled
  records for organisations.
- Redaction-quality benchmarking: measured recall/precision of the TEE
  redaction across document types, published with the demo.
- PDF and richer document input (today: paste or .txt).

## Stack
One static HTML file (no backend, no build step): browser fetch to
`cloud-api.near.ai` (CORS-verified), WebCrypto for SHA-256 and Ed25519,
plain JSON-RPC view calls to NEAR testnet, and NEAR Wallet Selector +
Meteor Wallet for the seal transaction.
AI assistance: built with Muse (Muse) as the coding agent; the page itself
is vanilla JS + WebCrypto.

## License
MIT
