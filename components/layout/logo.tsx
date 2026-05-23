import Link from "next/link";
import Image from "next/image";

type Variant = "mark" | "full";

type Props = {
  variant?: Variant;
  size?: number;
  showWordmark?: boolean;
  className?: string;
  imgClassName?: string;
  asLink?: boolean;
};

export function Logo({
  variant = "mark",
  size,
  showWordmark = true,
  className,
  imgClassName,
  asLink = true,
}: Readonly<Props>) {
  const body =
    variant === "full" ? (
      <FullLogo size={size} imgClassName={imgClassName} />
    ) : (
      <MarkLogo size={size ?? 32} showWordmark={showWordmark} />
    );

  if (!asLink) return <span className={className}>{body}</span>;

  return (
    <Link
      href="/"
      aria-label="Pixuntra home"
      className={`inline-flex items-center transition-opacity hover:opacity-90 active:scale-95 ${className ?? ""}`}
    >
      {body}
    </Link>
  );
}

function MarkLogo({
  size,
  showWordmark,
}: Readonly<{ size: number; showWordmark: boolean }>) {
  return (
    <span className="group inline-flex items-center gap-2">
      <Image
        src="/LogoWihtoutText.png"
        alt=""
        width={size}
        height={size}
        priority
        className="object-contain transition-transform duration-200 group-hover:rotate-[-4deg]"
        style={{ width: size, height: size }}
      />
      {showWordmark && (
        <span
          className="font-semibold tracking-tight"
          style={{ fontSize: size * 0.62, lineHeight: 1 }}
        >
          Pixuntra
        </span>
      )}
    </span>
  );
}

function FullLogo({
  size,
  imgClassName,
}: Readonly<{ size?: number; imgClassName?: string }>) {
  if (imgClassName) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src="/Logo.png"
        alt="Pixuntra"
        className={`object-contain block ${imgClassName}`}
      />
    );
  }
  const px = size ?? 140;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/Logo.png"
      alt="Pixuntra"
      width={px}
      height={px}
      style={{ width: px, height: px, objectFit: "contain", display: "block" }}
    />
  );
}
