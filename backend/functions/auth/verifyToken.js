const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1'
});

exports.handler = async(event) => {
    console.log('Token verification...');

    try {
        const authHeader = event.headers?.Authorization || event.headers?.authorization;
        const token = authHeader?.split(' ')[1];

        console.log('Auth header present:', !!authHeader);

        if (!token) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Access token required',
                    authenticated: false
                })
            };
        }

        const params = {
            AccessToken: token
        };

        const result = await cognito.getUser(params).promise();
        console.log('Token valid!');

        const attributes = {};
        result.UserAttributes.forEach(attr => {
            attributes[attr.Name] = attr.Value;
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                authenticated: true,
                user: {
                    username: result.Username,
                    email: attributes.email,
                    name: attributes.name || null,
                    sub: attributes.sub,
                    emailVerified: attributes.email_verified === 'true'
                }
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        
        let errorMessage = 'Token verification failed';
        let statusCode = 401;
        
        if (error.code === 'NotAuthorizedException') {
            errorMessage = 'Invalid or expired token';
        } else if (error.code === 'UserNotFoundException') {
            errorMessage = 'User not found';
        }
        
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                authenticated: false,
                error: errorMessage,
                details: error.message,
                code: error.code
            })
        };
    }
};