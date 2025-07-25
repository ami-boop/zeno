// XSS patterns to block (for passwords and general fields)
const XSS_PATTERNS = [
	/script/i,
	/javascript/i,
	/on\w+\s*=/i,
	/union\s+select/i,
	/alert\s*\(/i,
	/prompt\s*\(/i,
	/confirm\s*\(/i,
	/eval\s*\(/i,
	/expression\s*\(/i,
	/url\s*\(/i,
	/data\s*:/i,
	/vbscript\s*:/i,
]

// Dangerous characters to block (for passwords only)
const DANGEROUS_CHARS = /[<>"']/

/**
 * Securely validates an email address.
 * @param email - The email to validate.
 * @returns true if the email is valid and secure.
 */
export const validateEmail = (email: string): boolean => {
	// Check for null or undefined values
	if (!email || typeof email !== 'string') return false

	// Remove leading and trailing whitespace
	const trimmedEmail = email.trim()

	// Check length (RFC 5321)
	if (trimmedEmail.length > 254) return false

	// Basic email regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(trimmedEmail)) return false

	// Check for double dots
	if (trimmedEmail.includes('..')) return false

	// Check for dots at the beginning or end
	if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) return false

	// Check for spaces
	if (trimmedEmail.includes(' ')) return false

	// Check for null bytes
	if (trimmedEmail.includes('\0')) return false

	// Check for control characters
	if (/[\x00-\x1F\x7F]/.test(trimmedEmail)) return false

	return true
}

/**
 * Validates a password with XSS protection.
 * @param password - The password to validate.
 * @returns true if the password is valid and secure.
 */
export const validatePassword = (password: string): boolean => {
	// Check for null or undefined values
	if (!password || typeof password !== 'string') return false

	// Check password length (min 6, max 128 characters)
	if (password.length < 6) return false
	if (password.length > 128) return false

	// Check for null bytes
	if (password.includes('\0')) return false

	// Check for control characters
	if (/[\x00-\x1F\x7F]/.test(password)) return false

	// Check for XSS patterns
	if (XSS_PATTERNS.some(pattern => pattern.test(password))) return false

	// Check for dangerous characters (a softer check)
	if (DANGEROUS_CHARS.test(password)) return false

	return true
}

/**
 * Sanitizes input data with XSS protection.
 * @param input - The string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (input: string): string => {
	if (!input || typeof input !== 'string') return ''

	// Remove leading and trailing whitespace
	let sanitized = input.trim()

	// Remove null bytes
	sanitized = sanitized.replace(/\0/g, '')

	// Remove control characters
	sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')

	// Remove XSS patterns
	XSS_PATTERNS.forEach(pattern => {
		sanitized = sanitized.replace(pattern, '')
	})

	// Limit length
	if (sanitized.length > 1000) {
		sanitized = sanitized.substring(0, 1000)
	}

	return sanitized
}
