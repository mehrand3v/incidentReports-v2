// src/pages/HelpPage.jsx
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertTriangle, Info, FileQuestion, HelpCircle } from "lucide-react";
import { logPageView } from "../services/analytics";
import BackToReportButton from "../components/shared/BackToReportButton";
import Navbar from "../components/shared/Navbar";


const HelpPage = () => {
  // Log page view on component mount
  useEffect(() => {
    logPageView("Help Page");
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-800">
      <Navbar />
      <main className="flex-grow">
        <div className="py-4 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-white mb-1">Help Center</h1>
            <p className="text-gray-300 text-sm">
              Get assistance with the incident reporting system
            </p>
          </div>

          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="py-3">
                <CardTitle className="text-blue-400 flex items-center text-lg">
                  <Info className="h-4 w-4 mr-2" />
                  Reporting an Incident
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3 text-sm py-3">
                <p>To report a workplace incident, follow these steps:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Scan the QR code displayed in your workplace</li>
                  <li>Enter your 7-digit store number</li>
                  <li>Select the appropriate incident type</li>
                  <li>Add any additional details (optional)</li>
                  <li>Review your information and submit</li>
                </ol>
                <p>
                  After submission, you'll receive a case number. Keep this
                  number for your records and to check the status of your
                  report.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="py-3">
                <CardTitle className="text-blue-400 flex items-center text-lg">
                  <FileQuestion className="h-4 w-4 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <Accordion
                  type="single"
                  collapsible
                  className="text-gray-300 text-sm"
                >
                  <AccordionItem value="item-1" className="border-slate-700">
                    <AccordionTrigger className="hover:text-white text-sm py-3">
                      What should I do in an emergency?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      For emergencies requiring immediate assistance, always
                      call emergency services (911) first before reporting
                      through this system.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-slate-700">
                    <AccordionTrigger className="hover:text-white text-sm py-3">
                      How long will it take to process my report?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      Reports are typically processed within 24-48 hours,
                      depending on the severity and type of incident.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-slate-700">
                    <AccordionTrigger className="hover:text-white text-sm py-3">
                      Can I update my report after submission?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      Once submitted, reports cannot be directly edited. If you
                      need to provide additional information, please contact
                      your supervisor with your case number.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-slate-700">
                    <AccordionTrigger className="hover:text-white text-sm py-3">
                      What is the difference between incident types?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <ul className="space-y-2">
                        <li>
                          <strong>Shoplifting:</strong> Theft of merchandise
                          from the store
                        </li>
                        <li>
                          <strong>Robbery:</strong> Theft using force or threats
                        </li>
                        <li>
                          <strong>Beer-run:</strong> Theft specifically of
                          alcoholic beverages
                        </li>
                        <li>
                          <strong>Property Damage:</strong> Damage to store
                          property or fixtures
                        </li>
                        <li>
                          <strong>Injury:</strong> Customer or employee injury
                          on premises
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border-slate-700">
                    <AccordionTrigger className="hover:text-white text-sm py-3">
                      How do I check the status of my report?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      You can check the status of your report by going to the
                      "Check Status" page and entering your case number.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="py-3">
                <CardTitle className="text-blue-400 flex items-center text-lg">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm py-3">
                <p>
                  If you need further assistance, please contact support at:
                </p>
                <p className="mt-2">
                  <strong className="text-white">Email:</strong>{" "}
                  support@example.com
                </p>
                <p>
                  <strong className="text-white">Phone:</strong> (555) 123-4567
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Support hours: Monday-Friday, 9am-5pm
                </p>
              </CardContent>
            </Card>
          </div>

          <BackToReportButton />
        </div>
      </main>

    </div>
  );
};

export default HelpPage;
