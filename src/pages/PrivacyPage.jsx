// src/pages/PrivacyPage.jsx
import React, { useEffect } from "react";
import { Shield, Lock, Eye, FileText, CheckCircle } from "lucide-react";
import { logPageView } from "../services/analytics";
import BackToReportButton from "../components/shared/BackToReportButton";
import Navbar from "../components/shared/Navbar";
import BasicFooter from "../components/shared/BasicFooter";

const PrivacyPage = () => {
  // Log page view on component mount
  useEffect(() => {
    logPageView("Privacy Policy Page");
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-800">
      <Navbar />
      <main className="flex-grow">
        <div className="py-4 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-3">
              <div className="bg-blue-900 rounded-full p-2">
                <Shield className="h-6 w-6 text-blue-300" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Privacy Policy
            </h1>
            <p className="text-gray-300 text-sm">
              How we handle your information
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 text-gray-300 space-y-4 text-sm">
            <section>
              <div className="flex items-center mb-2">
                <Eye className="h-4 w-4 text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold text-blue-400">
                  Information We Collect
                </h2>
              </div>
              <p>
                When you use our incident reporting system, we collect the
                following information:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Store number</li>
                <li>Incident details</li>
                <li>Date and time of the report</li>
                <li>Optional additional details provided by you</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold text-blue-400">
                  How We Use Your Information
                </h2>
              </div>
              <p>
                The information collected is used for the following purposes:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>To process and respond to incident reports</li>
                <li>To improve workplace safety and security</li>
                <li>To comply with legal obligations</li>
                <li>
                  To generate anonymous statistics about workplace incidents
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center mb-2">
                <Lock className="h-4 w-4 text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold text-blue-400">
                  Data Security
                </h2>
              </div>
              <p>
                We take the security of your information seriously. We implement
                appropriate technical and organizational measures to protect
                your data from unauthorized access, loss, or alteration.
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>All data is stored securely in Firebase Firestore</li>
                <li>
                  Access to the data is restricted to authorized personnel only
                </li>
                <li>All transmissions are encrypted using HTTPS</li>
                <li>Regular security audits are conducted</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold text-blue-400">
                  Data Retention
                </h2>
              </div>
              <p>
                We retain incident reports for a period of 5 years to comply
                with legal requirements and to assist with ongoing safety
                improvements. After this period, the data is anonymized or
                deleted.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-400 mb-2">
                Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>
                  Request deletion of your data (subject to legal retention
                  requirements)
                </li>
                <li>Object to certain processing of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-400 mb-2">
                Updates to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. Any changes
                will be posted on this page with a revised effective date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-400 mb-2">
                Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy or our data
                practices, please contact us at privacy@example.com.
              </p>
            </section>

            <footer className="text-xs text-gray-400 pt-3 border-t border-slate-700">
              Last updated: March 2025
            </footer>
          </div>

          <BackToReportButton />
        </div>
      </main>
      <BasicFooter />
    </div>
  );
};

export default PrivacyPage;
