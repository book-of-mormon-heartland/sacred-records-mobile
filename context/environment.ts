var _Environments = {
    production:  {
        GOOGLE_WEB_CLIENT_ID: '376185747738-hced54r8i2jc4bjq428i54dp2g4uhnvo.apps.googleusercontent.com', 
        GOOGLE_ANDROID_CLIENT_ID: '376185747738-ha1jqq32roeta8g7c34c7koend7lmp5o.apps.googleusercontent.com', 
        GOOGLE_IOS_CLIENT_ID: '376185747738-t1nrjh269jqarco0grlo6a5vs8fcbf8b.apps.googleusercontent.com',
        NODE_SERVER_URL: 'http://10.0.2.2:3000',
        DJANGO_SERVER_URL: 'http://10.0.2.2:8000',
        IOS_NODE_SERVER_URL: 'http://192.168.1.171:3000',
    },
    staging:     {
        GOOGLE_WEB_CLIENT_ID: '376185747738-hced54r8i2jc4bjq428i54dp2g4uhnvo.apps.googleusercontent.com', 
        GOOGLE_ANDROID_CLIENT_ID: '376185747738-ha1jqq32roeta8g7c34c7koend7lmp5o.apps.googleusercontent.com', 
        GOOGLE_IOS_CLIENT_ID: '376185747738-t1nrjh269jqarco0grlo6a5vs8fcbf8b.apps.googleusercontent.com',
        NODE_SERVER_URL: 'http://10.0.2.2:3000',
        DJANGO_SERVER_URL: 'http://10.0.2.2:8000',
        IOS_NODE_SERVER_URL: 'http://192.168.1.171:3000',
    },
    development: {
        GOOGLE_WEB_CLIENT_ID: '376185747738-hced54r8i2jc4bjq428i54dp2g4uhnvo.apps.googleusercontent.com', 
        GOOGLE_ANDROID_CLIENT_ID: '376185747738-ha1jqq32roeta8g7c34c7koend7lmp5o.apps.googleusercontent.com', 
        GOOGLE_IOS_CLIENT_ID: '376185747738-t1nrjh269jqarco0grlo6a5vs8fcbf8b.apps.googleusercontent.com',
        NODE_SERVER_URL: 'http://10.0.2.2:3000',
        DJANGO_SERVER_URL: 'http://10.0.2.2:8000',
        IOS_NODE_SERVER_URL: 'http://192.168.1.171:3000',
    }
}

function getEnvironment() {
    // This value is defined in the .env file.  
    var platform = process.env.ENVIRONMENT;

    // ...now return the correct environment
    return _Environments[platform]
}

var Environment = getEnvironment()
module.exports = Environment