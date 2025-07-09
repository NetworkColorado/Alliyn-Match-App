import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdCard() {
  return (
    <div className="max-w-md mx-auto">
      <Card className="overflow-hidden shadow-xl border-2 border-yellow-400">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-center">
          <h3 className="text-white font-bold text-lg">Sponsored</h3>
        </div>

        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
            B
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900">BusinessBoost Pro</h3>
            <p className="text-gray-600">Accelerate your growth with AI-powered business insights</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">✓ Advanced Analytics Dashboard</p>
            <p className="text-sm text-gray-500">✓ Partnership Recommendations</p>
            <p className="text-sm text-gray-500">✓ Market Intelligence Reports</p>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">Learn More - Free Trial</Button>

          <p className="text-xs text-gray-400">Ad will close automatically</p>
        </CardContent>
      </Card>
    </div>
  )
}
