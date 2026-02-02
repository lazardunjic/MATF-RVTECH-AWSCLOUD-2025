const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1'
});

exports.handler = async(event) => {
    console.log('Logging out...');

    try {
        const authHeader = event.headers?.Authorization || event.headers?.authorization;
        const accessToken = authHeader?.split(' ')[1];

        console.log('Auth header present:', !!authHeader);

        if (!accessToken) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Access token required'
                })
            };
        }

        const params = {
            AccessToken: accessToken
        };

        console.log('Calling Cognito globalSignOut...');
        await cognito.globalSignOut(params).promise();
        console.log('Logout successful!');

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Logged out successfully'
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        
        let errorMessage = 'Logout failed';
        let statusCode = 500;
        
        if (error.code === 'NotAuthorizedException') {
            errorMessage = 'Invalid or expired token';
            statusCode = 401;
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