import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const RegistrationSuccessPage = () => {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-900/50 p-3 border border-green-700">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white text-center">
            Registration Submitted!
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Your registration request has been submitted successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <p className="text-gray-300 text-center">
              Your request will be reviewed by an administrator. You will receive an email
              with further instructions once your registration has been approved.
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-400 text-center">
              What happens next?
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center mr-2">
                  <span className="text-blue-400">1</span>
                </div>
                Admin review of your registration
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center mr-2">
                  <span className="text-blue-400">2</span>
                </div>
                Email notification of approval status
              </li>
              <li className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center mr-2">
                  <span className="text-blue-400">3</span>
                </div>
                Login credentials sent upon approval
              </li>
            </ul>
          </div>

          <Link to="/" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-500">
              Return to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationSuccessPage; 