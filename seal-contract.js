// CleanRoom Seal — seal() contract for NEAR testnet (near-sdk-js)
// Stores ONLY hashes + metadata. Never store document content.
// Deploy guide: see DEPLOY.md in this folder.
import { NearBindgen, call, view, near } from "near-sdk-js";

@NearBindgen({})
class SealContract {
  constructor() {
    this.seals = []; // array of seal records (small scale, hackathon demo)
  }

  // Record a custody seal for a redacted document.
  // args: { doc_hash, redacted_hash, completion_id, model }
  // doc_hash / redacted_hash: 64-char lowercase hex SHA-256 strings.
  @call({})
  seal({ doc_hash, redacted_hash, completion_id, model }) {
    if (!/^[0-9a-f]{64}$/.test(doc_hash || "")) throw new Error("doc_hash must be a SHA-256 hex string");
    if (!/^[0-9a-f]{64}$/.test(redacted_hash || "")) throw new Error("redacted_hash must be a SHA-256 hex string");
    const record = {
      owner: near.predecessorAccountId(),
      doc_hash,
      redacted_hash,
      completion_id: String(completion_id || ""),
      model: String(model || ""),
      block_height: Number(near.blockHeight()),
      timestamp_ms: Number(near.blockTimestamp() / 1000000n),
    };
    this.seals.push(record);
    near.log(`SEALED ${doc_hash} by ${record.owner}`);
    return record;
  }

  @view({})
  seal_count() {
    return this.seals.length;
  }

  @view({})
  get_seals({ from_index = 0, limit = 20 } = {}) {
    return this.seals.slice(from_index, from_index + limit);
  }

  @view({})
  get_seal_by_doc_hash({ doc_hash }) {
    return this.seals.find((s) => s.doc_hash === doc_hash) || null;
  }
}
