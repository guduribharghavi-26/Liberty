"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Upload, CheckCircle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ReportForm() {
  const [formData, setFormData] = useState({
    message: "",
    vehicleNumber: "",
    notifyParent: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [trackingCaseNumber, setTrackingCaseNumber] = useState("")
  const [incidentStatus, setIncidentStatus] = useState<any>(null)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
      toast({
        title: "Report Submitted Successfully",
        description:
          "Your safety report has been sent to the nearest police station. You will receive updates on your case.",
      })
    }, 1000)
  }

  const handleTrackStatus = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/incidents/track?case_number=${trackingCaseNumber}`)
      const data = await response.json()

      if (data.success) {
        setIncidentStatus(data.incident)
        toast({
          title: "Case Found",
          description: `Case ${trackingCaseNumber} status retrieved successfully.`,
        })
      } else {
        toast({
          title: "Case Not Found",
          description: "Please check the case number and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to track case status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Report Submitted Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your safety report has been received and forwarded to the appropriate authorities. A case number has been
              generated: <strong>LIB-2024-{Math.floor(Math.random() * 10000)}</strong>
            </p>
            <div className="bg-white p-4 rounded-lg border border-green-200 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Police will review your report within 2 hours</li>
                <li>• You'll receive SMS updates on case progress</li>
                <li>• Emergency contact will be notified if requested</li>
                <li>• Follow-up call within 24 hours</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                Submit Another Report
              </Button>
              <Button onClick={() => setIsTracking(true)} className="saffron-gradient hover:opacity-90 text-white">
                Track Case Status
              </Button>
            </div>
          </CardContent>
        </Card>
        {isTracking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Track Case Status
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsTracking(false)
                      setIncidentStatus(null)
                      setTrackingCaseNumber("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!incidentStatus ? (
                  <form onSubmit={handleTrackStatus} className="space-y-4">
                    <div>
                      <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Case Number
                      </label>
                      <Input
                        id="caseNumber"
                        value={trackingCaseNumber}
                        onChange={(e) => setTrackingCaseNumber(e.target.value)}
                        placeholder="e.g., LIB-202412-1234"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full saffron-gradient hover:opacity-90 text-white">
                      Track Status
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="font-semibold text-gray-800 mb-2">Case Details</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Case Number:</strong> {incidentStatus.case_number}
                        </p>
                        <p>
                          <strong>Title:</strong> {incidentStatus.title}
                        </p>
                        <p>
                          <strong>Status:</strong>
                          <Badge
                            className={`ml-2 ${
                              incidentStatus.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : incidentStatus.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : incidentStatus.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {incidentStatus.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </p>
                        <p>
                          <strong>Priority:</strong>
                          <Badge
                            className={`ml-2 ${
                              incidentStatus.priority === 4
                                ? "bg-red-100 text-red-800"
                                : incidentStatus.priority === 3
                                  ? "bg-orange-100 text-orange-800"
                                  : incidentStatus.priority === 2
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                          >
                            {incidentStatus.priority === 4
                              ? "CRITICAL"
                              : incidentStatus.priority === 3
                                ? "HIGH"
                                : incidentStatus.priority === 2
                                  ? "MEDIUM"
                                  : "LOW"}
                          </Badge>
                        </p>
                        <p>
                          <strong>Reported:</strong> {new Date(incidentStatus.created_at).toLocaleDateString()}
                        </p>
                        {incidentStatus.assigned_officer_name && (
                          <p>
                            <strong>Assigned Officer:</strong> {incidentStatus.assigned_officer_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setIncidentStatus(null)
                        setTrackingCaseNumber("")
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Track Another Case
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Safety Incident Report</h1>
        <p className="text-gray-600">
          Submit a confidential safety report. All information is encrypted and handled by trained safety professionals.
        </p>
      </div>

      <Card>
        <CardHeader className="patriot-gradient text-white">
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Secure Incident Reporting
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Badge */}
            <div className="flex items-center justify-center">
              <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold">
                <MapPin className="h-3 w-3 mr-1" />
                Location secured and verified
              </Badge>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe the incident *</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please provide detailed information about what happened, when it occurred, and any other relevant details..."
                className="min-h-[120px]"
                required
              />
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number (if applicable)</label>
              <Input
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                placeholder="e.g., KA 01 AB 1234"
                className="uppercase"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Evidence (Photos/Screenshots)
              </label>
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <Upload className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                <input type="file" accept="image/*" multiple className="hidden" />
              </div>
            </div>

            {/* Notify Parent */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifyParent"
                checked={formData.notifyParent}
                onCheckedChange={(checked) => setFormData({ ...formData, notifyParent: checked as boolean })}
              />
              <label htmlFor="notifyParent" className="text-sm text-gray-700">
                Notify my emergency contact/parent about this report
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full saffron-gradient hover:opacity-90 text-white py-3 font-semibold shadow-lg"
                size="lg"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Submit Safety Report
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-700">
                <strong>Privacy Notice:</strong> Your report is encrypted and handled by certified safety professionals.
                All communications are monitored and recorded for quality assurance. For immediate emergencies, contact
                emergency services at 100.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
