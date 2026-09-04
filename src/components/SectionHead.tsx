export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
}: {
  eyebrow: string
  title: string
  lead: string
  id?: string
}) {
  return (
    <div className="sec-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="sec-title" id={id}>
        {title}
      </h2>
      <p className="sec-lead">{lead}</p>
    </div>
  )
}
