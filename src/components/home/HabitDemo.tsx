import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function HabitDemo() {
  return (
    <Card className="border-0 shadow-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Today&apos;s Habits
          <Badge variant="secondary">3/5 Complete</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-medium">Morning Exercise</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            7 day streak
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Read 30 Minutes</span>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            3 day streak
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
            <span className="font-medium text-gray-600">Meditate</span>
          </div>
          <Badge variant="outline">Not started</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
