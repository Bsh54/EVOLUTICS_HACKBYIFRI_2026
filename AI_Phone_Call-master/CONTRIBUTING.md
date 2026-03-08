# Contributing to AI Phone Call Interface

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/yourusername/ai-phone-call/issues) to avoid duplicates.

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g. Chrome 120]
- OS: [e.g. Windows 11]
- Device: [e.g. Desktop, Mobile]
- Version: [e.g. 2.0.0]

**Console Errors**
Any error messages from browser console.
```

### ✨ Suggesting Features

Feature requests are welcome! Please provide:

- **Clear description** of the feature
- **Use case** - why would this be useful?
- **Implementation ideas** (if you have any)
- **Mockups or examples** (if applicable)

### 🔧 Pull Requests

1. **Fork** the repository
2. **Create** a feature branch from `main`
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

**PR Guidelines:**
- Use descriptive commit messages
- Include tests for new features
- Update documentation if needed
- Follow the existing code style
- Keep PRs focused and atomic

## 🏗️ Development Setup

### Prerequisites

- Modern web browser (Chrome recommended for development)
- Text editor or IDE
- Local web server (Python, Node.js, or PHP)
- Git for version control

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-phone-call.git
   cd ai-phone-call
   ```

2. **Start local server**
   ```bash
   # Python
   python -m http.server 8000

   # Node.js
   npx serve .

   # PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

4. **Enable developer tools**
   - Open browser DevTools (F12)
   - Check console for errors
   - Use Network tab to monitor API calls

### Testing

**Manual Testing Checklist:**
- [ ] Voice selection works correctly
- [ ] Speech recognition activates properly
- [ ] AI responses are generated and played
- [ ] Call timer functions accurately
- [ ] Interface is responsive on mobile
- [ ] Error handling works as expected
- [ ] Audio cleanup prevents memory leaks

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## 📝 Code Style

### JavaScript

```javascript
// Use const/let, avoid var
const API_CONFIG = {
    TTS_API: 'endpoint'
};

// Use arrow functions for callbacks
elements.forEach(element => {
    element.addEventListener('click', handleClick);
});

// Use async/await for promises
async function fetchData() {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Use descriptive variable names
const conversationState = {
    isRecording: false,
    currentTranscript: ''
};
```

### CSS

```css
/* Use CSS custom properties */
:root {
    --primary-color: #667eea;
    --border-radius: 12px;
}

/* Use BEM methodology for classes */
.call-button {
    /* Base styles */
}

.call-button--active {
    /* Modifier styles */
}

.call-button__icon {
    /* Element styles */
}

/* Use mobile-first approach */
.container {
    width: 100%;
}

@media (min-width: 768px) {
    .container {
        max-width: 750px;
    }
}
```

### HTML

```html
<!-- Use semantic HTML -->
<main class="phone-container">
    <section class="setup-section">
        <h2>Configuration</h2>
        <!-- Content -->
    </section>
</main>

<!-- Use proper accessibility attributes -->
<button
    class="call-button"
    aria-label="Start phone call"
    role="button"
    tabindex="0">
    Start Call
</button>

<!-- Use meaningful IDs and classes -->
<div id="conversationArea" class="conversation-area">
    <!-- Content -->
</div>
```

## 🛡️ Security Guidelines

### Input Validation

```javascript
// Always sanitize user input
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Validate API responses
function validateApiResponse(response) {
    if (!response || typeof response !== 'object') {
        throw new Error('Invalid API response');
    }
    return response;
}
```

### API Security

```javascript
// Never expose API keys in client code
// Use environment variables or secure configuration

// Validate URLs before making requests
function isValidUrl(url) {
    try {
        new URL(url);
        return url.startsWith('https://');
    } catch {
        return false;
    }
}
```

## 📚 Documentation

### Code Comments

```javascript
/**
 * Processes user voice input and generates AI response
 * @param {string} userMessage - Transcribed user speech
 * @returns {Promise<string>} AI response text
 */
async function processUserMessage(userMessage) {
    // Implementation
}

// Inline comments for complex logic
const organizedVoices = {};
// Filter French voices first, then English US only
Object.keys(availableVoices).forEach(key => {
    if (key.startsWith('fr-FR-')) {
        organizedVoices[key] = availableVoices[key];
    }
});
```

### README Updates

When adding features, update:
- Feature list in README.md
- Usage instructions
- Configuration examples
- API documentation

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality
- **PATCH** version for backward-compatible bug fixes

### Release Checklist

- [ ] Update version in package files
- [ ] Update CHANGELOG.md
- [ ] Test all features thoroughly
- [ ] Update documentation
- [ ] Create release notes
- [ ] Tag the release

## 🎯 Areas for Contribution

### High Priority
- [ ] **Performance optimization** - Reduce memory usage
- [ ] **Accessibility improvements** - WCAG compliance
- [ ] **Error handling** - Better user feedback
- [ ] **Mobile experience** - Touch interactions

### Medium Priority
- [ ] **Voice quality** - Additional voice options
- [ ] **UI enhancements** - Animation improvements
- [ ] **Browser compatibility** - Safari optimizations
- [ ] **Documentation** - Video tutorials

### Low Priority
- [ ] **Internationalization** - Multi-language support
- [ ] **Themes** - Dark mode, custom colors
- [ ] **Analytics** - Usage tracking
- [ ] **Integrations** - Third-party services

## 💬 Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time chat with contributors
- **Email** - Direct contact for sensitive issues

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and constructive
- Focus on the issue, not the person
- Accept feedback gracefully
- Help others learn and grow
- Follow the [Contributor Covenant](https://www.contributor-covenant.org/)

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Annual contributor highlights

## 📞 Getting Help

Stuck? Need guidance? Reach out:

- 💬 **Discord**: [Join our community](https://discord.gg/yourserver)
- 📧 **Email**: contributors@yourproject.com
- 📖 **Wiki**: [Development guides](https://github.com/yourusername/ai-phone-call/wiki)

---

**Thank you for contributing to the future of human-AI interaction! 🚀**