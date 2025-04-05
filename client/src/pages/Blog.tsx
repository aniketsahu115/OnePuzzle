import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const blogPosts = [
    {
      id: 1,
      title: "The Evolution of Chess NFTs on Solana",
      excerpt: "How blockchain technology is transforming the way chess accomplishments are recorded and shared.",
      author: "Maria Chen",
      date: "April 2, 2025",
      category: "Blockchain",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1614107151491-6876eecbff89",
      featured: true
    },
    {
      id: 2,
      title: "Mastering Daily Chess Puzzles: A Guide to Rapid Improvement",
      excerpt: "Consistent puzzle solving is one of the fastest ways to improve your chess. Here's how to make the most of your daily practice.",
      author: "Alex Johnson",
      date: "March 28, 2025",
      category: "Strategy",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24",
      featured: false
    },
    {
      id: 3,
      title: "Understanding Compressed NFTs: How They Make Chess NFTs Affordable",
      excerpt: "How Solana's compressed NFTs are making digital chess achievements accessible to all players.",
      author: "David Kumar",
      date: "March 25, 2025",
      category: "Technology",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
      featured: false
    },
    {
      id: 4,
      title: "From Beginner to Master: A Chess Journey Recorded as NFTs",
      excerpt: "One player's story of improvement, with each milestone captured as a permanent NFT on Solana.",
      author: "Sarah Williams",
      date: "March 18, 2025",
      category: "Community",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1580541631950-7282082b03fe",
      featured: false
    },
    {
      id: 5,
      title: "The Psychology of Daily Chess Challenges",
      excerpt: "How consistent puzzle-solving builds mental resilience and pattern recognition abilities.",
      author: "Michael Petrov",
      date: "March 15, 2025",
      category: "Psychology",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793",
      featured: false
    },
    {
      id: 6,
      title: "How Chess Helps Develop Strategic Thinking in Web3",
      excerpt: "The surprising similarities between chess mastery and successful navigation of the blockchain ecosystem.",
      author: "Lisa Chang",
      date: "March 10, 2025",
      category: "Blockchain",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1637251483904-a01e2a9a1749",
      featured: false
    }
  ];
  
  const categories = [
    "All",
    "Strategy",
    "Blockchain",
    "Technology",
    "Community",
    "Psychology"
  ];
  
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredPosts = blogPosts.filter(post => {
    // Filter by search query
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get the featured post
  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">OnePuzzle Blog</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Insights, strategies, and stories from the intersection of chess and blockchain
        </p>
      </div>
      
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div 
                className="h-64 md:h-auto bg-cover bg-center" 
                style={{ backgroundImage: `url(${featuredPost.image})` }}
              >
                <div className="w-full h-full bg-primary/50 flex items-center justify-center">
                  <span className="sr-only">Featured image</span>
                </div>
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <Badge className="mr-2">{featuredPost.category}</Badge>
                  <span className="text-sm text-gray-500">{featuredPost.date} • {featuredPost.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                    <span className="text-sm font-medium">{featuredPost.author}</span>
                  </div>
                  <Button>Read Article</Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}
      
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-2/3">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="md:w-1/3 flex items-center overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-md text-sm mr-2 ${
                  activeCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredPosts.filter(post => !post.featured).map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col h-full">
            <div 
              className="h-48 bg-cover bg-center" 
              style={{ backgroundImage: `url(${post.image})` }}
            >
              <div className="w-full h-full bg-black/20">
                <Badge className="m-4">{post.category}</Badge>
              </div>
            </div>
            <CardContent className="p-6 flex-grow flex flex-col">
              <div className="mb-2 text-sm text-gray-500">{post.date} • {post.readTime}</div>
              <h3 className="text-xl font-bold mb-3">{post.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                  <span className="text-xs font-medium">{post.author}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">Read More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Newsletter */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-4">
              Get the latest articles, chess insights, and blockchain updates delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
          <div className="md:w-1/3 md:pl-8 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-primary">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-primary text-white rounded-xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Solve Today's Puzzle?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Challenge yourself with our daily chess puzzle and mint your success as an NFT on Solana.
          </p>
          <Button className="bg-white text-primary hover:bg-white/90">Try Today's Puzzle</Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;