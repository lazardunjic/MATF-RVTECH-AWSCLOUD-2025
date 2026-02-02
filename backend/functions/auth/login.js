const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1',
    endpoint: process.env.AWS_ENDPOINT_URL || undefined
});

exports.handler = async(event) => {
    console.log('=== LOGIN START ===');
    console.log('Region:', process.env.AWS_REGION);
    console.log('Endpoint:', process.env.AWS_ENDPOINT_URL);
    console.log('User Pool Client ID:', process.env.USER_POOL_CLIENT_ID);

    try {
        const body = JSON.parse(event.body || '{}');
        const { email, password } = body;

        if (!email || !password) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Email and password required'
                })
            };
        }

        console.log('Attempting auth for:', email);

        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.USER_POOL_CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };

        console.log('Calling Cognito initiateAuth...');
        const result = await cognito.initiateAuth(params).promise();
        console.log('Auth successful!');

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Login successful',
                tokens: {
                    accessToken: result.AuthenticationResult.AccessToken,
                    idToken: result.AuthenticationResult.IdToken,
                    refreshToken: result.AuthenticationResult.RefreshToken
                }
            })
        };
        
    } catch (error) {
        console.error('=== LOGIN ERROR ===');
        console.error('Error:', error);
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        
        let errorMessage = 'Login failed';
        let statusCode = 500;
        
        if (error.code === 'NotAuthorizedException') {
            errorMessage = 'Incorrect email or password';
            statusCode = 401;
        } else if (error.code === 'UserNotFoundException') {
            errorMessage = 'User does not exist';
            statusCode = 404;
        }
        
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: errorMessage,
                details: error.message,
                code: error.code
            })
        };
    }
};