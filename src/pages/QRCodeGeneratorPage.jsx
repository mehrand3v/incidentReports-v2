// src/pages/QRCodeGeneratorPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Copy,
  Download,
  Settings,
  Printer,
  Check,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const QRCodeGeneratorPage = () => {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [storeNumber, setStoreNumber] = useState("");
  const [size, setSize] = useState(200);
  const baseUrl = window.location.origin;
  const qrUrl = `${baseUrl}/?store=${storeNumber}`;
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const canvasRef = useRef(null);

  const drawQRToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const qrCodeSvg = document.getElementById("qr-code");
    if (!qrCodeSvg) return;

    const svgData = new XMLSerializer().serializeToString(qrCodeSvg);
    const img = new Image();

    img.onload = () => {
      canvas.width = size + 40;
      canvas.height = size + 40;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20, size, size);
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      drawQRToCanvas();
    }, 100);

    return () => clearTimeout(timer);
  }, [qrUrl, size]);

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      drawQRToCanvas();
      setTimeout(() => {
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qrcode-store-${storeNumber || "all"}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }, 200);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(qrUrl)
      .then(() => {
        setShowCopyNotification(true);
        setTimeout(() => {
          setShowCopyNotification(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  const printQRCode = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print the QR code");
      return;
    }

    const qrCodeElement = document.getElementById("qr-code");
    const qrCodeHTML = qrCodeElement ? qrCodeElement.outerHTML : "";

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code for Store ${storeNumber || "All Locations"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; text-align: center; }
          .container { max-width: 400px; margin: 0 auto; }
          .qr-code { background-color: white; padding: 20px; border-radius: 8px; display: inline-block; margin-bottom: 20px; }
          .store-info { margin-top: 15px; font-size: 16px; }
          .instructions { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 15px; font-size: 14px; text-align: left; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Scan to Report an Incident</h2>
          <div class="qr-code">${qrCodeHTML}</div>
          <div class="store-info">
            ${storeNumber ? `Store #: ${storeNumber}` : "All Store Locations"}
          </div>
          <div class="instructions">
            <p>1. Scan this QR code with your phone camera</p>
            <p>2. Open the link that appears</p>
            <p>3. Complete the incident report form</p>
          </div>
          <button class="no-print" onclick="window.print();setTimeout(function() { window.close(); }, 500);"
            style="margin-top: 20px; padding: 10px 20px;">
            Print
          </button>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const goToDashboard = () => {
    navigate("/admin");
  };

  return (
    <div className="py-6 max-w-4xl mx-auto">
      {showCopyNotification && (
        <div className="fixed top-4 right-4 bg-blue-700 text-white px-4 py-2 rounded-md shadow-lg flex items-center transition-opacity duration-300 opacity-100 z-50">
          <Check className="h-4 w-4 mr-2" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Enhanced Back Button */}
      <div className="mb-6 px-4 sm:px-0">
        <Button
          variant="outline"
          className="
            bg-slate-800/90 hover:bg-slate-700/90
            border border-blue-500/30 hover:border-blue-400/50
            text-blue-400 hover:text-blue-300
            transition-all duration-300 ease-in-out
            group cursor-pointer
            px-4 py-2
            shadow-sm hover:shadow-md
            rounded-lg
          "
          onClick={goToDashboard}
        >
          <ArrowLeft
            className="
            h-4 w-4 mr-2
            transition-transform duration-300
            group-hover:-translate-x-1
            text-blue-400 group-hover:text-blue-300
          "
          />
          <span
            className="
            font-medium
            transition-all duration-300
            group-hover:text-blue-200
          "
          >
            Back to Dashboard
          </span>
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        QR Code Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-blue-400">QR Code Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Customize the QR code for your location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeNumber" className="text-gray-300">
                Store Number
              </Label>
              <Input
                id="storeNumber"
                value={storeNumber}
                onChange={(e) => setStoreNumber(e.target.value)}
                placeholder="Enter store number (optional)"
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-gray-400">
                Leave empty to create a generic QR code for all locations
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-gray-300">
                QR Code Size
              </Label>
              <Select
                value={size.toString()}
                onValueChange={(value) => setSize(parseInt(value))}
              >
                <SelectTrigger
                  id="size"
                  className="bg-slate-700 border-slate-600 text-white"
                >
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value="150">Small (150px)</SelectItem>
                  <SelectItem value="200">Medium (200px)</SelectItem>
                  <SelectItem value="300">Large (300px)</SelectItem>
                  <SelectItem value="400">Extra Large (400px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-blue-400">Generated QR Code</CardTitle>
            <CardDescription className="text-gray-400">
              Scan to access the incident report form
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                id="qr-code"
                value={qrUrl}
                size={size}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "/logo.png",
                  excavate: true,
                  height: size * 0.15,
                  width: size * 0.15,
                }}
              />
              <canvas
                ref={canvasRef}
                id="qr-code-canvas"
                style={{ display: "none" }}
              />
            </div>
            <p className="mt-4 text-center text-sm text-gray-400">
              {storeNumber
                ? `This QR code is linked to store #${storeNumber}`
                : "Generic QR code for all locations"}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-600 text-gray-300 hover:bg-slate-700"
              onClick={copyLinkToClipboard}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-600 text-gray-300 hover:bg-slate-700"
              onClick={printQRCode}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 text-white"
              onClick={downloadQRCode}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isSuperAdmin && (
        <Card className="bg-slate-800 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              As a super admin, you can generate QR codes for all store
              locations at once
            </p>
          </CardContent>
          <CardFooter>
            <Button className="bg-blue-700 hover:bg-blue-600 text-white">
              Generate QR Codes for All Stores
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default QRCodeGeneratorPage;
