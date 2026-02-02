const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: 'us-east-1'
});

exports.handler = async(event) => {
    console.log('Registration in progress...');

    try {
        const body = JSON.parse(event.body || '{}');
        const { email, password, name } = body;

        console.log('Registration attempt for:', email);

        if (!email || !password) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Email and password are required'
                })
            };
        }

        if (password.length < 8) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Password must be at least 8 characters'
                })
            };
        }

        const params = {
            ClientId: process.env.USER_POOL_CLIENT_ID,
            Username: email,
            Password: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                }
            ]
        };

        if (name) {
            params.UserAttributes.push({
                Name: 'name',
                Value: name
            });
        }

        const result = await cognito.signUp(params).promise();
        console.log('Registration successful!');

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'User registered successfully. Please check your email for verification.',
                userSub: result.UserSub,
                userConfirmed: result.UserConfirmed
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        
        let errorMessage = 'Registration failed';
        let statusCode = 500;
        
        if (error.code === 'UsernameExistsException') {
            errorMessage = 'User with this email already exists';
            statusCode = 409;
        } else if (error.code === 'InvalidPasswordException') {
            errorMessage = 'Password does not meet requirements';
            statusCode = 400;
        } else if (error.code === 'InvalidParameterException') {
            errorMessage = 'Invalid email or password format';
            statusCode = 400;
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