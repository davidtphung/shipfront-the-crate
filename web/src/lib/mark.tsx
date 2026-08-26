export function CrateMark({
  size = 20,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M7 9 L12 6 L17 9 L17 15 L12 18 L7 15 Z" />
        <path d="M7 9 L12 12 L17 9" />
        <path d="M12 12 L12 18" />
        <path d="M7 15 L12 12 L17 15" />
      </g>
    </svg>
  )
}
