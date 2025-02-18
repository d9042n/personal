#!/bin/sh

# Generate .env.production file from environment variables
echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.production
echo "NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME=$NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME" >> .env.production

# Start the application
node server.js 