exports.SHARED = {
    AWS_REGION: 'us-east-1',
    //TODO: Ideally there should be two sets of creds, one for development/staging, one for production.
    COGNITO_CREDENTIALS: {
        IDENTITY_POOL_ID: 'us-east-1:03443fc7-64eb-49aa-81f4-e01a8a905a89',
        USER_POOL_ID: 'us-east-1_RH4OtsRic',
        ARN: 'cognito-idp.us-east-1.amazonaws.com/us-east-1_RH4OtsRic',
        CLIENT_ID: '247878tga1bs50frpa48hhp7gt'
    },
    CLAIM_S3_BUCKET_NAME: 'claim-documents', //TODO refactor into individual envs within `S3_BUCKETS`
    DUMMY: 'dummy',
};