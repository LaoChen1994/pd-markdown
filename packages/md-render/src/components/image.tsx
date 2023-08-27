import { Image as ImageType } from 'mdast';
import { FC, PropsWithChildren } from 'react';
import { IMetaComponentBase } from '.';

const Image: FC<PropsWithChildren<IMetaComponentBase<ImageType>>> = (props) => {
  const { node } = props;
  const { alt, url } = node;

  return (
    <div className="flex flex-col items-center justify-center">
    <img className="max-w-full h-auto object-contain shadow-md rounded-lg" src={url} alt={alt || ''} />
      {alt ? <p className="mt-4 text-base text-gray-500">{alt}</p> : null}
    </div>
  )
}

export default Image