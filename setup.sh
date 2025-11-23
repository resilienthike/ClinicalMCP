#!/bin/bash

echo "🚀 Setting up ClinicalMCP for Hackathon..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.example .env
  echo ""
  echo "⚠️  IMPORTANT: Edit .env and add your API keys:"
  echo "   - E2B_API_KEY (get at https://e2b.dev)"
  echo "   - GROQ_API_KEY (use promo code: MCP_AGENTS_2025)"
  echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Edit .env with your API keys"
echo "   2. Run: node agent.js (CLI demo)"
echo "   3. Or run: node server.js (web server)"
echo "   4. Open index.html in browser"
echo ""
echo "🏆 Good luck with the hackathon!"
