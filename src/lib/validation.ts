const XSS_PATTERNS = [
	/<script[^>]*>/i,
	/<\/script>/i,
	/javascript:/i,
	/vbscript:/i,
	/data:/i,
	/on\w+\s*=/i,
	/\bon\w+\s*\(/i,
	/\beval\s*\(/i,
	/\balert\s*\(/i,
	/\bprompt\s*\(/i,
	/\bconfirm\s*\(/i,
	/\bsetTimeout\s*\(/i,
	/\bsetInterval\s*\(/i,
	/document\.(write|writeln|cookie)/i,
	/window\.(location|open)/i,
	/innerHTML/i,
	/outerHTML/i,
	/expression\s*\(/i,
	/url\s*\(/i,
	/union\s+select/i,
	/drop\s+table/i,
	/%3[cC]script/i,
	/%6[aA]avascript/i,
	/\\u003[cC]/i,
	/\\x3[cC]/i,
]

const DANGEROUS_CHARS = /[<>"'`\\]/

const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/
const ZERO_WIDTH_CHARS = /[\u200B-\u200D\uFEFF]/
const RTL_OVERRIDE_CHARS = /[\u202A-\u202E]/
const CYRILLIC_LOOKALIKES = /[\u0430\u043E\u0440\u0435\u0445\u0441]/

const BLOCKED_PATTERNS = [ZERO_WIDTH_CHARS, RTL_OVERRIDE_CHARS, CYRILLIC_LOOKALIKES]
const REPLACE_PATTERNS: RegExp[] = [
	/\0/g,
	new RegExp(CONTROL_CHARS.source, 'g'),
	new RegExp(ZERO_WIDTH_CHARS.source, 'g'),
	new RegExp(RTL_OVERRIDE_CHARS.source, 'g'),
	new RegExp(CYRILLIC_LOOKALIKES.source, 'g'),
	...XSS_PATTERNS.map((pattern) => new RegExp(pattern.source, pattern.flags.includes('g') ? 'gi' : 'g')),
]

const hasBlockedContent = (value: string) =>
	value.includes('\0') || CONTROL_CHARS.test(value) || BLOCKED_PATTERNS.some((pattern) => pattern.test(value))

export const validateEmail = (email: string): boolean => {
	if (!email || typeof email !== 'string') return false

	const trimmedEmail = email.trim()

	if (trimmedEmail.length > 254) return false

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(trimmedEmail)) return false
	if (trimmedEmail.includes('..')) return false
	if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) return false
	if (trimmedEmail.includes(' ')) return false
	if (hasBlockedContent(trimmedEmail)) return false
	if (trimmedEmail !== trimmedEmail.normalize('NFC')) return false

	return true
}

export const validatePassword = (password: string): boolean => {
	if (!password || typeof password !== 'string') return false

	if (password.length < 6) return false
	if (password.length > 128) return false
	if (hasBlockedContent(password)) return false
	if (password !== password.normalize('NFC')) return false
	if (XSS_PATTERNS.some((pattern) => pattern.test(password))) return false
	if (DANGEROUS_CHARS.test(password)) return false

	return true
}

export const sanitizeInput = (input: string): string => {
	if (!input || typeof input !== 'string') return ''

	let sanitized = input.trim()

	for (const pattern of REPLACE_PATTERNS) {
		sanitized = sanitized.replace(pattern, '')
	}

	sanitized = sanitized.normalize('NFC')

	if (sanitized.length > 1000) {
		sanitized = sanitized.substring(0, 1000)
	}

	return sanitized
}
