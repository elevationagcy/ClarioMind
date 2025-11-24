import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5]">
      <div className="max-w-4xl mx-auto p-6">
        <Link 
          href="/welcome" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: November 24, 2024</p>

          <div className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Reframe. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit 
                our App and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We collect and process the following data about you:</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Email address</li>
                <li>Name (if provided)</li>
                <li>Account credentials</li>
                <li>Profile information</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Progress through lessons and courses</li>
                <li>Quiz responses and scores</li>
                <li>Onboarding responses (demographics, goals, patterns)</li>
                <li>App usage statistics</li>
                <li>Device information and IP address</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Sensitive Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Self-reported drinking patterns and habits</li>
                <li>Personal goals and motivations</li>
                <li>Reflections and journal entries</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">We use your personal data for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>To provide and maintain our App</li>
                <li>To personalize your experience and content</li>
                <li>To track your progress and achievements</li>
                <li>To send you notifications and reminders (with your consent)</li>
                <li>To improve our App and develop new features</li>
                <li>To provide customer support</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Storage and Security</h2>
              <p className="text-gray-700 leading-relaxed">
                Your data is stored securely using Supabase, a trusted cloud database provider. We implement 
                appropriate technical and organizational security measures to protect your personal data against 
                unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                All data transmissions are encrypted using SSL/TLS protocols. We use Row Level Security (RLS) 
                policies to ensure users can only access their own data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect and defend our rights or property</li>
                <li>To prevent or investigate possible wrongdoing</li>
                <li>With service providers who assist in our operations (subject to confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Data Protection Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of processing</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                <li><strong>Right to Object:</strong> Object to our processing of your data</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise these rights, please contact us at privacy@reframe.app
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in 
                this Privacy Policy, unless a longer retention period is required by law. When you delete your 
                account, we will delete or anonymize your personal data within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our App and hold certain 
                information. Cookies are files with small amounts of data. You can instruct your browser to 
                refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our App is not intended for use by children under the age of 18. We do not knowingly collect 
                personal data from children under 18. If you become aware that a child has provided us with 
                personal data, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to 
                review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state, 
                province, country or other governmental jurisdiction. We will take all steps reasonably necessary 
                to ensure that your data is treated securely and in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none text-gray-700 space-y-2 mt-3">
                <li>Email: privacy@reframe.app</li>
                <li>Support: support@reframe.app</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

