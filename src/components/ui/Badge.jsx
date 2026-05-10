export default function Badge({ count, color }) {
  return (
    <span
      className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold tabular-nums"
      style={{
        background: color + '22',
        color: color,
        border: `1px solid ${color}38`,
      }}
    >
      {count}
    </span>
  )
}
