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

const HelpPage = () => {
  // Log page view on component mount
  useEffect(() => {
    logPageView("Help Page");
  }, []);

  return (
    <div className="py-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Help Center</h1>
        <p className="text-gray-300">
          Get assistance with the incident reporting system
        </p>
      </div>

      <div className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Reporting an Incident
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>To report a workplace incident, follow these steps:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Scan the QR code displayed in your workplace</li>
              <li>Enter your 7-digit store number</li>
              <li>Select the appropriate incident type</li>
              <li>Add any additional details (optional)</li>
              <li>Review your information and submit</li>
            </ol>
            <p>
              After submission, you'll receive a case number. Keep this number
              for your records and to check the status of your report.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <FileQuestion className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="text-gray-300">
              <AccordionItem value="item-1" className="border-slate-700">
                <AccordionTrigger className="hover:text-white">
                  What should I do in an emergency?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  For emergencies requiring immediate assistance, always call
                  emergency services (911) first before reporting through this
                  system.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-slate-700">
                <AccordionTrigger className="hover:text-white">
                  How long will it take to process my report?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Reports are typically processed within 24-48 hours, depending
                  on the severity and type of incident.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-slate-700">
                <AccordionTrigger className="hover:text-white">
                  Can I update my report after submission?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  Once submitted, reports cannot be directly edited. If you need
                  to provide additional information, please contact your
                  supervisor with your case number.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-slate-700">
                <AccordionTrigger className="hover:text-white">
                  What is the difference between incident types?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  <ul className="space-y-2">
                    <li>
                      <strong>Shoplifting:</strong> Theft of merchandise from
                      the store
                    </li>
                    <li>
                      <strong>Robbery:</strong> Theft using force or threats
                    </li>
                    <li>
                      <strong>Beer-run:</strong> Theft specifically of alcoholic
                      beverages
                    </li>
                    <li>
                      <strong>Property Damage:</strong> Damage to store property
                      or fixtures
                    </li>
                    <li>
                      <strong>Injury:</strong> Customer or employee injury on
                      premises
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-slate-700">
                <AccordionTrigger className="hover:text-white">
                  How do I check the status of my report?
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  You can check the status of your report by going to the "Check
                  Status" page and entering your case number.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg border border-amber-600">
              <p>
                For emergencies requiring immediate assistance, please call
                emergency services at 911 before submitting this form. This
                reporting system is for documentation purposes and may not
                result in an immediate response.
              </p>
            </div>

            <p>
              All incidents are reviewed by management. Serious incidents may
              require additional follow-up from appropriate personnel.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>If you need further assistance, please contact support at:</p>
            <p className="mt-2">
              <strong className="text-white">Email:</strong> support@example.com
            </p>
            <p>
              <strong className="text-white">Phone:</strong> (555) 123-4567
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Support hours: Monday-Friday, 9am-5pm
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
