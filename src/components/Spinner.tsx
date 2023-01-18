import React from "react";

export default function Spinner({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 38 38"
      className={`animate-spin${className ? ` ${className}` : ""}`}
      {...props}
    >
      <defs>
        <linearGradient
          x1="8.042%"
          y1="0%"
          x2="65.682%"
          y2="23.865%"
          id="prefix__a"
        >
          <stop stopColor="currentColor" stopOpacity={0} offset="0%" />
          <stop stopColor="currentColor" stopOpacity={0.631} offset="63.146%" />
          <stop stopColor="currentColor" offset="100%" />
        </linearGradient>
      </defs>
      <g transform="translate(1 1)" fill="none" fillRule="evenodd">
        <path
          d="M36 18c0-9.94-8.06-18-18-18"
          stroke="url(#prefix__a)"
          strokeWidth={2}
        />
        <circle fill="currentColor" cx={36} cy={18} r={1} />
      </g>
    </svg>
  );
}
