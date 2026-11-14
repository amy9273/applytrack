# ApplyTrack — Security Best Practices

1. **OAuth Credential Storage**: Refresh and access tokens are managed strictly on the server.
2. **Read-Only Gmail Access**: Write, delete, or compose scopes are strictly forbidden.
3. **Environment Security**: Sensitive keys reside in `.env` / `.env.local`, which are ignored by Git.
4. **Input Sanitization**: Email snippets and bodies rendered in the UI are sanitized to prevent XSS.
5. **No Data Leakage**: AI extraction prompts contain only the relevant email header and body snippet, never sending personal emails to third parties.
