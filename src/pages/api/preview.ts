/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Document } from '@prismicio/client/types/documents';
import { NextApiRequest, NextApiResponse } from 'next';
import { getPrismicClient } from '../../services/prismic';

export function linkResolver(doc: Document) {
  if (doc.type === 'post') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

const Preview = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> => {
  const { token: ref, documentId } = req.query;
  const prismic = getPrismicClient();
  const redirectUrl = await prismic
    .getPreviewResolver(String(ref), String(documentId))
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'invalid token' });
  }

  console.log(documentId);

  res.setPreviewData({ ref });
  res.writeHead(302, { location: `${redirectUrl}` });

  return null;
};

export default Preview;
