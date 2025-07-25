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
				destination: 'https://logout-ag7er5qhga-ew.a.run.app',
			},
			{
				source: '/api/setStudentReturnStatus',
				destination: 'https://setstudentreturnstatus-ag7er5qhga-ew.a.run.app',
			},
		]
	},
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
