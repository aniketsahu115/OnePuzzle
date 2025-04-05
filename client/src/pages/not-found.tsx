import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-6">
          <div className="text-8xl font-bold text-primary/10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">♟️</div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to solving daily chess puzzles!
        </p>
        
        <div className="space-y-4">
          <Link href="/" className="w-full block">
            <Button className="w-full bg-primary text-white">
              Return to Home
            </Button>
          </Link>
          
          <div className="flex space-x-3">
            <Link href="/learn" className="flex-1">
              <Button variant="outline" className="w-full">
                Learn Chess
              </Button>
            </Link>
            <Link href="/resources" className="flex-1">
              <Button variant="outline" className="w-full">
                Resources
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>
            Can't find what you're looking for? 
            <a href="mailto:support@onepuzzle.com" className="text-primary ml-1 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
