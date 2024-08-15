import { getPlaiceholder } from 'plaiceholder';

export const getImagePlaceHolder = async (path: string) => {
  const buffer = await fetch(path).then(async (res) => Buffer.from(await res.arrayBuffer()));
  const plaiceholder = await getPlaiceholder(buffer);

  return { ...plaiceholder, img: { src: path } };
};
