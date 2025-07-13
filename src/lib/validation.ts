// XSS паттерны для блокировки (только для паролей и общих полей)
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

// Опасные символы для блокировки (только для паролей)
const DANGEROUS_CHARS = /[<>"']/

/**
 * Валидация email с правильной защитой
 * @param email - email для проверки
 * @returns true если email валиден и безопасен
 */
export const validateEmail = (email: string): boolean => {
	// Проверка на null/undefined
	if (!email || typeof email !== 'string') return false

	// Обрезка пробелов
	const trimmedEmail = email.trim()

	// Проверка длины (RFC 5321)
	if (trimmedEmail.length > 254) return false

	// Базовый regex для email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(trimmedEmail)) return false

	// Проверка на двойные точки
	if (trimmedEmail.includes('..')) return false

	// Проверка на точки в начале или конце
	if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) return false

	// Проверка на пробелы
	if (trimmedEmail.includes(' ')) return false

	// Проверка на null bytes
	if (trimmedEmail.includes('\0')) return false

	// Проверка на control characters
	if (/[\x00-\x1F\x7F]/.test(trimmedEmail)) return false

	return true
}

/**
 * Валидация пароля с защитой от XSS атак
 * @param password - пароль для проверки
 * @returns true если пароль валиден и безопасен
 */
export const validatePassword = (password: string): boolean => {
	// Проверка на null/undefined
	if (!password || typeof password !== 'string') return false

	// Проверка длины
	if (password.length < 6) return false
	if (password.length > 128) return false

	// Проверка на null bytes
	if (password.includes('\0')) return false

	// Проверка на control characters
	if (/[\x00-\x1F\x7F]/.test(password)) return false

	// Проверка на XSS паттерны
	if (XSS_PATTERNS.some(pattern => pattern.test(password))) return false

	// Проверка на опасные символы (более мягкая проверка)
	if (DANGEROUS_CHARS.test(password)) return false

	return true
}

/**
 * Проверка custom claims пользователя на admin/parent права
 * @param claims - custom claims из токена
 * @returns true если пользователь является admin или parent
 */
export const isAdminOrParent = (claims: any): boolean => {
	if (!claims || typeof claims !== 'object') return false

	// Проверяем различные варианты admin/parent claims
	const adminChecks = [
		claims.admin === true,
		claims.role === 'admin',
		claims.isAdmin === true,
		claims.userRole === 'admin',
		claims.type === 'admin',
	]

	const parentChecks = [
		claims.parent === true,
		claims.role === 'parent',
		claims.isParent === true,
		claims.userRole === 'parent',
		claims.type === 'parent',
	]

	return adminChecks.some(check => check) || parentChecks.some(check => check)
}

/**
 * Санитизация входных данных с защитой от XSS
 * @param input - строка для очистки
 * @returns очищенная строка
 */
export const sanitizeInput = (input: string): string => {
	if (!input || typeof input !== 'string') return ''

	// Обрезка пробелов
	let sanitized = input.trim()

	// Удаление null bytes
	sanitized = sanitized.replace(/\0/g, '')

	// Удаление control characters
	sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')

	// Удаление XSS паттернов
	XSS_PATTERNS.forEach(pattern => {
		sanitized = sanitized.replace(pattern, '')
	})

	// Ограничение длины
	if (sanitized.length > 1000) {
		sanitized = sanitized.substring(0, 1000)
	}

	return sanitized
}

/**
 * Безопасная санитизация для отображения в HTML
 * @param input - строка для очистки
 * @returns безопасная строка для отображения
 */
export const sanitizeForDisplay = (input: string): string => {
	if (!input || typeof input !== 'string') return ''

	// Базовая санитизация
	let sanitized = sanitizeInput(input)

	// Экранирование HTML символов
	sanitized = sanitized
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')

	return sanitized
}
