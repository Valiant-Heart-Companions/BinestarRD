import Image from 'next/image';

export function providerInitials(name: string): string {
  const stripped = name
    .replace(/^\s*(dra?|lic(da)?|ing|mtra?|ph\.?\s?d|prof)\.?\s+/i, '')
    .trim();
  return (stripped.charAt(0) || name.charAt(0) || '?').toUpperCase();
}

type BaseProps = {
  src?: string | null;
  name: string;
  className?: string;
};

type Props =
  | (BaseProps & { fill: true; sizes: string; width?: never; height?: never })
  | (BaseProps & { width: number; height: number; fill?: never; sizes?: never });

const placeholderBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-primary)',
  color: 'white',
  fontWeight: 700,
} as const;

export default function ProviderAvatar(props: Props) {
  const { src, name, className } = props;

  if (src) {
    if (props.fill) {
      return (
        <Image
          src={src}
          alt={name}
          fill
          sizes={props.sizes}
          className={className}
          style={{ objectFit: 'cover' }}
        />
      );
    }
    return (
      <Image
        src={src}
        alt={name}
        width={props.width}
        height={props.height}
        className={className}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  if (props.fill) {
    return (
      <div
        role="img"
        aria-label={name}
        className={className}
        style={{ ...placeholderBase, position: 'absolute', inset: 0, fontSize: '2.5rem' }}
      >
        {providerInitials(name)}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={className}
      style={{
        ...placeholderBase,
        width: props.width,
        height: props.height,
        fontSize: Math.round(props.width / 2.4),
      }}
    >
      {providerInitials(name)}
    </div>
  );
}
