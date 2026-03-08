# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Security Features

### 🔐 API Security
- **Token-based Authentication**: DeepSeek API uses secure bearer token authentication
- **HTTPS Only**: All API communications are encrypted via HTTPS
- **No Sensitive Data Storage**: No API keys or tokens stored in localStorage
- **CORS Protection**: Proper CORS headers configured for API endpoints

### 🛡️ Client-Side Security
- **Input Sanitization**: All user inputs are properly escaped to prevent XSS
- **Content Security Policy**: Recommended CSP headers for production deployment
- **No Eval Usage**: Code doesn't use eval() or similar dangerous functions
- **Secure Audio Handling**: Audio blobs are properly cleaned up to prevent memory leaks

### 🎤 Privacy Protection
- **Local Processing**: Voice recognition happens locally in browser
- **No Audio Storage**: Voice data is not stored or transmitted permanently
- **Conversation Cleanup**: Chat history is cleared when call ends
- **Microphone Permissions**: Explicit user consent required for microphone access

## Security Recommendations

### For Production Deployment

1. **Environment Variables**
   ```bash
   # Use environment variables for API configuration
   DEEPSEEK_API_URL=your_api_url
   DEEPSEEK_API_TOKEN=your_secure_token
   TTS_API_URL=your_tts_api_url
   ```

2. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self';
                  connect-src 'self' https://shads229-personnal-aiv2.hf.space https://librettts-api.shadobsh.workers.dev;
                  media-src 'self' blob:;
                  style-src 'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com;
                  script-src 'self' https://code.jquery.com https://cdnjs.cloudflare.com;">
   ```

3. **HTTPS Enforcement**
   ```javascript
   // Redirect to HTTPS in production
   if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
       location.replace('https:' + window.location.href.substring(window.location.protocol.length));
   }
   ```

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to **security@yourproject.com**.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Within 30 days (depending on complexity)

## Security Checklist for Contributors

- [ ] No hardcoded API keys or sensitive data
- [ ] All user inputs are properly sanitized
- [ ] HTTPS is used for all external API calls
- [ ] No use of `eval()` or `innerHTML` with user data
- [ ] Proper error handling without exposing sensitive information
- [ ] Audio/media resources are properly cleaned up
- [ ] No storage of sensitive user data in localStorage/sessionStorage

## Known Security Considerations

1. **Web Speech API**: Requires HTTPS and user permission
2. **Third-party APIs**: Dependent on external service security
3. **Browser Compatibility**: Security features may vary across browsers
4. **Microphone Access**: Requires explicit user consent

## Security Updates

Security updates will be released as patch versions and documented in the [CHANGELOG.md](CHANGELOG.md).