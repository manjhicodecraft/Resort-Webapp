import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  children?: ReactNode;
  testId: string;
}

export default function PageHeader({ eyebrow, title, description, image, children, testId }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden py-16 sm:py-20 text-center text-white" data-testid={testId}>
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-[hsl(220,35%,10%/0.82)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[hsl(40,20%,97%)] to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <p className="text-[hsl(42,75%,68%)] text-sm font-medium tracking-widest uppercase mb-2">{eyebrow}</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
        {description && <p className="text-gray-200 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">{description}</p>}
        {children && <div className="mt-6 max-w-xl mx-auto">{children}</div>}
      </div>
    </header>
  );
}
