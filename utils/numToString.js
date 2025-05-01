export default function convert(v) {
  if (Array.isArray(v)) return v.map(convert);
  if (v !== null && typeof v === 'object')
    return Object.fromEntries(Object.entries(v).map(
      ([k, val]) => [k, convert(val)]
    ));
  return typeof v === 'number' ? String(v) : v;
}
