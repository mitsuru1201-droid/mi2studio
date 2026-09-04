import icons from '../icons.json'

export type IconName = keyof typeof icons

type Props = {
  name: IconName
  className?: string
  strokeWidth?: number
}

/**
 * Single stroke-based icon system. Path data lives in src/icons.json so the
 * standalone preview build can render byte-identical icons.
 */
export function Icon({ name, className, strokeWidth = 1.7 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {(icons[name] as string[]).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
