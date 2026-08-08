import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'placehold.co',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/api/logout',
				destination: process.env.NEXT_PUBLIC_LOGOUT_URL || 'https://logout-ag7er5qhga-ew.a.run.app',
			},
			{
				source: '/api/setStudentReturnStatus',
				destination: process.env.NEXT_PUBLIC_SET_RETURN_STATUS_URL || 'https://setstudentreturnstatus-ag7er5qhga-ew.a.run.app',
			},
		]
	},
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
