import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Texas Power Compare',
  description: 'Read the terms and conditions for using Texas Power Compare electricity comparison service.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using Texas Power Compare (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                Texas Power Compare provides an electricity plan comparison service for Texas residents. Our Service allows you to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Compare electricity rates from multiple providers</li>
                <li>View plan details and terms</li>
                <li>Access educational resources about electricity</li>
                <li>Connect with electricity providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Not an Electricity Provider</h2>
              <p className="text-gray-600">
                Texas Power Compare is a comparison service only. We are not an electricity provider, and we do not sell electricity directly. When you choose a plan through our Service, you enter into a contract directly with the electricity provider. We are not a party to that contract.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Accuracy of Information</h2>
              <p className="text-gray-600 mb-4">
                We strive to provide accurate and up-to-date information. However:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Rates and plan details may change without notice</li>
                <li>Providers may have additional terms not displayed on our site</li>
                <li>Actual costs may vary based on your specific usage</li>
                <li>Always verify plan details with the provider before signing up</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Affiliate Relationships</h2>
              <p className="text-gray-600">
                We may receive compensation from electricity providers when you sign up for a plan through our Service. This compensation does not affect the rates you pay. We strive to present all options fairly, regardless of affiliate relationships.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">When using our Service, you agree to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Provide accurate information (ZIP code, usage estimates)</li>
                <li>Use the Service for lawful purposes only</li>
                <li>Not attempt to interfere with the Service&apos;s operation</li>
                <li>Not scrape or collect data from the Service without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600">
                To the maximum extent permitted by law, Texas Power Compare shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. This includes but is not limited to damages from choosing an electricity plan, service interruptions, or inaccurate information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-600">
                The Service is provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or completely secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-600">
                All content on Texas Power Compare, including text, graphics, logos, and software, is our property or the property of our licensors. You may not copy, reproduce, or distribute this content without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600">
                We may modify these Terms of Service at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-600">
                These Terms of Service are governed by the laws of the State of Texas. Any disputes shall be resolved in the courts of Texas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about these terms, please contact us at:{' '}
                <a href="mailto:legal@texaspowercompare.com" className="text-blue-600 hover:underline">
                  legal@texaspowercompare.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
