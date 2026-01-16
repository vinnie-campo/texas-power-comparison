import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Texas Power Compare',
  description: 'Learn how Texas Power Compare collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                When you use Texas Power Compare, we may collect the following information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>ZIP Code:</strong> To show you available electricity plans in your area</li>
                <li><strong>Usage Information:</strong> Estimated electricity usage to calculate rates</li>
                <li><strong>Contact Information:</strong> Name and email if you contact us or sign up for alerts</li>
                <li><strong>Device Information:</strong> Browser type, IP address, and device type for analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Show you electricity plans available in your area</li>
                <li>Calculate estimated costs based on your usage</li>
                <li>Improve our website and services</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Send you updates if you opt in to communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Electricity Providers:</strong> When you choose to sign up for a plan through our site</li>
                <li><strong>Service Providers:</strong> Third parties that help us operate our website (hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Remember your preferences (like language selection)</li>
                <li>Analyze how visitors use our site</li>
                <li>Improve our services based on usage patterns</li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can control cookies through your browser settings. Disabling cookies may limit some functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your information. However, no internet transmission is 100% secure. We encourage you to use caution when sharing personal information online.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access the personal information we have about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Third-Party Links</h2>
              <p className="text-gray-600">
                Our site contains links to electricity provider websites. We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about this privacy policy, please contact us at:{' '}
                <a href="mailto:privacy@texaspowercompare.com" className="text-blue-600 hover:underline">
                  privacy@texaspowercompare.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
