interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center rounded-full border border-[#FED7AA] bg-white px-4 py-1 text-sm font-medium text-[#C2410C] shadow-sm">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#111827] md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[#374151] md:text-lg">
        {description}
      </p>
    </div>
  )
}
