#!/bin/bash

echo "🧪 Testing CHJ Family Farm site..."
echo ""

# Check if server directory exists
if [ ! -d "server" ]; then
  echo "❌ Error: server/ directory not found"
  exit 1
fi

cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Check if cache files exist
echo "📁 Checking cache files..."
if [ -f "data/tasks.json" ] && [ -f "data/crowdfund.json" ]; then
  echo "✅ Cache files found"
else
  echo "⚠️  Cache files missing - will be created on first API call"
fi

# Start server in background
echo ""
echo "🚀 Starting server on port 4000..."
node index.js &
SERVER_PID=$!

# Wait for server
sleep 2

# Test endpoints
echo ""
echo "🧪 Testing /api/tasks endpoint..."
TASKS_RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/tasks)
if [ "$TASKS_RESULT" = "200" ]; then
  echo "✅ /api/tasks returns 200 OK"
  echo "📄 Sample response:"
  curl -s http://localhost:4000/api/tasks | head -c 200
  echo "..."
else
  echo "❌ /api/tasks returned HTTP $TASKS_RESULT"
fi

echo ""
echo ""
echo "🧪 Testing /api/crowdfund endpoint..."
FUND_RESULT=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/crowdfund)
if [ "$FUND_RESULT" = "200" ]; then
  echo "✅ /api/crowdfund returns 200 OK"
  echo "📄 Sample response:"
  curl -s http://localhost:4000/api/crowdfund | head -c 200
  echo "..."
else
  echo "❌ /api/crowdfund returned HTTP $FUND_RESULT"
fi

# Cleanup
echo ""
echo "🧹 Stopping test server..."
kill $SERVER_PID 2>/dev/null

echo ""
if [ "$TASKS_RESULT" = "200" ] && [ "$FUND_RESULT" = "200" ]; then
  echo "✅ All tests passed! Site is working with cached data."
  echo ""
  echo "🎉 You can now:"
  echo "   • Run 'npm start' in server/ to start the site"
  echo "   • Deploy to Netlify/Vercel (see DEPLOYMENT.md)"
  echo "   • Configure GitHub secrets for auto cache refresh"
else
  echo "⚠️  Some tests failed. Check the output above."
fi
