import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Welcome to OnePuzzle!</h2>
          <p className="mb-4">
            By using this website and service, you agree to the following terms and conditions. Please read them carefully.
          </p>
          <h3 className="font-semibold mb-2">1. Use of Service</h3>
          <p className="mb-4">
            You may use OnePuzzle for personal, non-commercial purposes only. You agree not to misuse the service or attempt to disrupt its operation.
          </p>
          <h3 className="font-semibold mb-2">2. NFTs and Blockchain</h3>
          <p className="mb-4">
            NFTs minted on OnePuzzle are recorded on the Solana blockchain. You are responsible for your wallet and any blockchain transactions.
          </p>
          <h3 className="font-semibold mb-2">3. User Content</h3>
          <p className="mb-4">
            You retain ownership of your chess solutions and profile data. By using the service, you grant us permission to display your achievements and stats.
          </p>
          <h3 className="font-semibold mb-2">4. Disclaimer</h3>
          <p className="mb-4">
            This service is provided "as is" without warranties of any kind. We are not responsible for any loss of funds, NFTs, or data.
          </p>
          <h3 className="font-semibold mb-2">5. Changes</h3>
          <p className="mb-4">
            We may update these terms at any time. Continued use of the service means you accept the new terms.
          </p>
          <h3 className="font-semibold mb-2">6. Contact</h3>
          <p>
            For questions, contact us at <a href="mailto:support@onepuzzle.app" className="text-blue-600 underline">support@onepuzzle.app</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 