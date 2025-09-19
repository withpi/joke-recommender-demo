import Image from 'next/image';
import blackLogo from '@/public/pi-logo.svg';

export function PiIcon({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      width={size}
      height={size}
      src={blackLogo}
      className={className}
      alt={'Pi labs logo'}
    />
  );
}
