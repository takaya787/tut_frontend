import Image from "next/image";
type Gravatar_Props = {
  src: string;
  height: number;
  width: number;
  alt?: string;
  className?: string;
};

//外部Image用のComponent
export const External_Image: React.FC<Gravatar_Props> = ({
  src,
  alt,
  height,
  width,
  className,
}) => {
  const myLoader = ({ src, width }: { src: string; width: number }) => {
    return `${src}?w=${width}`;
  };
  return (
    <Image
      loader={myLoader}
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
};
