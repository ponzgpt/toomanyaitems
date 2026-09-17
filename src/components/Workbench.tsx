import { COMPUTE, NETWORK } from '../data/infra.ts';

interface Props {
  compute?: string;
  network?: string;
  onChange: (key: 'compute' | 'network', value: string) => void;
}

/**
 * What you're building on, chosen before what you build with it — a strip
 * above the grid, not a 10th and 11th slot. Native <select>: two choices from
 * a short list need nothing more, and it comes free with keyboard and
 * screen-reader support.
 */
export function Workbench({ compute, network, onChange }: Props) {
  return (
    <div className="workbench">
      <span className="workbench-label">Workbench</span>
      <select
        className="workbench-select"
        value={compute ?? ''}
        onChange={(e) => onChange('compute', e.target.value)}
        aria-label="Compute — what runs it"
      >
        <option value="">running on…</option>
        {COMPUTE.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <span className="workbench-joiner">via</span>
      <select
        className="workbench-select"
        value={network ?? ''}
        onChange={(e) => onChange('network', e.target.value)}
        aria-label="Network — how it connects"
      >
        <option value="">reached over…</option>
        {NETWORK.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
      </select>
    </div>
  );
}
