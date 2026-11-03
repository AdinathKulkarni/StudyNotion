const GradientHeading = ({
  segments,
  as: HeadingTag = "h1",
  className = "",
  gradientClassName = "bg-gradient-to-t from-blue-200 to-blue-50 bg-clip-text text-transparent",
  active,
}) => {
  return (
    <HeadingTag className={
      active ? `text-white text-3xl font-bold whitespace-pre-line leading-tight sm:text-[36px] ${className}` : `text-black text-3xl font-bold whitespace-pre-line leading-tight sm:text-[36px] ${className}`
    }>
      {segments.map((segment, index) => {
        if (typeof segment === "string") {
          return segment;
        }

        return segment.gradient ? (
          <span key={index} className={gradientClassName}>
            {segment.text}
          </span>
        ) : (
          segment.text
        );
      })}
    </HeadingTag>
  );
};

export default GradientHeading;