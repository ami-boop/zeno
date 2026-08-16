import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'placehold.co',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/api/logout',
				destination: process.env.NEXT_PUBLIC_LOGOUT_URL || 'https://logout-ag7er5qhga-ew.a.run.app',
			},
		]
	},
}

const withNextIntl = createNextIntlPlugin()
export default withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})(withNextIntl(nextConfig))
