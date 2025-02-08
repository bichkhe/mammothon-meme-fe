// import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, type NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getErrorMessage } from '@/utils/errors';

//req is short for request
export async function GET() {
  return NextResponse.json({ message: 'this is a get request' }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Access a specific query parameter
  const filename = searchParams.get('filename');
  const contentType = searchParams.get('contentType');

  // const { query } = req;
  // const { filename, contentType } = query;

  try {
    const client = new S3Client({
      region: process.env.AA_AWS_REGION,
      credentials: {
        accessKeyId: process.env.AA_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AA_AWS_SECRET_ACCESS_KEY!,
      },
    });

    console.log('filename:', filename);

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AA_AWS_BUCKET_NAME!,
      Key: filename?.toString()!,
      Conditions: [['starts-with', '$Content-Type', contentType?.toString()!]],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType?.toString()!,
      },
      Expires: 600,
    });
    return NextResponse.json({ url, fields }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 200 });
  }
}
