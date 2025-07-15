import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: '/api/setToken',
				destination: 'https://settoken-ag7er5qhga-ew.a.run.app',
			},
			{
				source: '/api/logout',
				destination: 'https://logout-ag7er5qhga-ew.a.run.app',
			},
		]
	},
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
