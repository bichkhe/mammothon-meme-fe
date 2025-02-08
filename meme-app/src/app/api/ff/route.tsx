import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getErrorMessage } from '@/utils/errors';
import { extractOfficeIds, parse } from '@/utils/ff_parser';
import { FeatureFlag, FF, FlagTableData, Segment } from '@/utils/ffprovider';

// import { evaluateQuery } from '@/utils/operator';

// const S3_FF_FILE = 'feature-flag/beta/aa-feature-flag.json';
// const S3_FF_FILE_STAGING = 'feature-flag/staging/aa-feature-flag.json';
// const S3_FF_FILE = 'ff.json';
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const namespace = searchParams.get('ns');
  console.log('namespace:', namespace);

  try {
    const params = {
      Key:
        namespace === 'dev'
          ? 'ff.json'
          : namespace === 'beta'
            ? process.env.AA_JSON_FILE_KEY_BETA || 'feature-flag/beta/aa-feature-flag.json'
            : namespace === 'staging'
              ? process.env.AA_JSON_FILE_KEY_STAGING || 'feature-flag/staging/aa-feature-flag.json'
              : 'ff.json',
      Bucket: namespace === 'dev' ? 'kitto-aa-feature-flags' : process.env.AA_AWS_BUCKET_NAME,
    };
    const client = new S3Client({
      region: process.env.AA_AWS_REGION,
      credentials: {
        accessKeyId: process.env.AA_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AA_AWS_SECRET_ACCESS_KEY!,
      },
    });
    const command = new GetObjectCommand(params);
    const response = await client.send(command);
    const data = await response.Body?.transformToString();
    const flags = (await parse(data as string)) as FF;
    const flagsKeys: FlagTableData[] = [];
    for (const key in flags) {
      if (Object.prototype.hasOwnProperty.call(flags, key)) {
        const featureFlag = flags[key] as FeatureFlag;
        // console.log(`Feature Flag: ${key}`, featureFlag);
        const segments: Segment[] = [];
        if (featureFlag.targeting) {
          featureFlag.targeting.forEach((t) => {
            const segment: Segment = {
              name: t.name || '',
              query: t.query,
              description: 'This is a segement',
              offices: extractOfficeIds(t.query),
              variant: t.variation,
            };
            segments.push(segment);
          });
        }

        const flagTableData: FlagTableData = {
          key,
          variations: featureFlag.variations,
          description: `Defaul rule: ${featureFlag.defaultRule.variation}`,
          enable: !featureFlag.disable,
          metadata: featureFlag.variations,
          defaultRule: featureFlag.defaultRule.variation,
          segments,
        };
        flagsKeys.push(flagTableData);
      }
    }
    return NextResponse.json({ flagsKeys, rawData: flags });
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}

export async function POST(req: NextRequest) {
  const { env: namespace, data } = await req.json();
  console.log('env:', namespace, 'data:', data);
  const contentType = req.nextUrl.searchParams.get('contentType') as string;
  console.log('contentType', contentType, 'namespace:', namespace);
  try {
    const client = new S3Client({
      region: process.env.AA_AWS_REGION,
      credentials: {
        accessKeyId: process.env.AA_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AA_AWS_SECRET_ACCESS_KEY!,
      },
    });

    const buf = Buffer.from(data);
    try {
      // Set upload parameters
      const params = {
        Body: buf,
        Key:
          namespace === 'dev'
            ? 'ff.json'
            : namespace === 'beta'
              ? process.env.AA_JSON_FILE_KEY_BETA || 'feature-flag/beta/aa-feature-flag.json'
              : namespace === 'staging'
                ? process.env.AA_JSON_FILE_KEY_STAGING ||
                  'feature-flag/staging/aa-feature-flag.json'
                : 'ff.json',
        Bucket: namespace === 'dev' ? 'kitto-aa-feature-flags' : process.env.AA_AWS_BUCKET_NAME,
      };
      // Upload file to S3
      const command = new PutObjectCommand(params);
      const response = await client.send(command);

      if (response) {
        const { url, fields } = await createPresignedPost(client, {
          Key:
            namespace === 'dev'
              ? 'ff.json'
              : namespace === 'beta'
                ? process.env.AA_JSON_FILE_KEY_BETA || 'feature-flag/beta/aa-feature-flag.json'
                : namespace === 'staging'
                  ? process.env.AA_JSON_FILE_KEY_STAGING ||
                    'feature-flag/staging/aa-feature-flag.json'
                  : 'ff.json',
          Bucket:
            namespace === 'dev'
              ? 'kitto-aa-feature-flags'
              : process.env.AA_AWS_BUCKET_NAME || 'kitto-aa-feature-flags',
          Conditions: [['starts-with', '$Content-Type', contentType]],
          Fields: {
            acl: 'public-read',
            'Content-Type': contentType,
          },
          Expires: 600,
        });

        // Respond with the presigned URL and fields
        return NextResponse.json({ url, fields });
      }
      return NextResponse.json({ error: response });
    } catch (error) {
      return NextResponse.json({ error: getErrorMessage(error) });
    } finally {
      // Clean up resources if needed
    }
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) });
  }
}
