# CleanRoom Seal — Submission payload (DRAFT, prepared 2026-11-13)

Imran reviews this exact payload and says "yes" before anything is submitted.
Deadline: Nov 14 23:59 UTC = Nov 15 05:59 Dhaka.

## Form fields
- **Project name:** CleanRoom Seal
- **Track:** privacy (Privacy & Private AI)
- **GitHub repo:** https://github.com/<IMRAN_USERNAME>/cleanroom-seal  ← fill after repo is public
- **Demo link:** GitHub Pages URL of index.html  ← fill after hosting
- **Demo post (X):** ← fill after Imran posts (tag @NEARProtocol, #NEARHackathon)
- **Payout NEAR address (mainnet):** livewheat2666.near
- **website field:** ⚠️ LEAVE EMPTY (spam trap per HACKATHON.md)

## One-line description
Redact sensitive documents inside a NEAR AI Cloud hardware TEE — then verify the
attestation and the response signature in your browser, and seal only the SHA-256
hash on NEAR testnet as chain-of-custody. The document itself never goes on-chain.

## What it does (submission text)
1. Paste a sensitive document and your own NEAR AI key (BYOK, stays in the tab).
2. NEAR AI Cloud runs the redaction inside a hardware TEE and signs the response.
3. The page verifies, live in the browser: the preflight attestation report, the
   exact signed text (SHA-256 of the exact request/response bytes), the signer
   against the attestation evidence, and the Ed25519 signature itself.
4. Only hashes are sealed on NEAR testnet via the `seal()` contract — a public
   chain-of-custody record that reveals nothing about the document.

## Honest limits (keep in README + submission)
- The seal contract stores hashes and metadata only — never document content.
- Verification is shown exactly as computed; a failed check shows NOT VERIFIED.
- If Phase 2 (contract) is not live at submit time, submit Phase 1 only and say so.

## Demo video script (90 seconds)
1. (0:00) Show a memo with a name, phone and account number.
2. (0:15) Paste it, click "Clean inside the TEE".
3. (0:35) Show the redacted output — names/numbers replaced.
4. (0:50) Scroll the verify panel: all green, "PROOF VERIFIED", kind provider_tee.
5. (1:10) Click "Open NEAR Verification Center" — independent check exists.
6. (1:20) Seal step: show the hash + (if live) the NearBlocks testnet record.
End card: repo link + "Built for the NEAR Hackathon".

## X post draft (Imran posts it himself)
I built CleanRoom Seal for the @NEARProtocol Hackathon 🛡️

Paste a sensitive document → NEAR AI redacts it inside a hardware TEE →
your browser verifies the attestation + signature → only the hash is
sealed on NEAR as chain-of-custody.

No server ever sees your document. Demo + code 👇
#NEARHackathon
