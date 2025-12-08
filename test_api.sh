#!/bin/bash

# API Testing Script for Akil Backend
# Usage: ./test_api.sh

BASE_URL="https://akil-backend.onrender.com"

echo "=========================================="
echo "  Akil Backend API Testing"
echo "=========================================="
echo ""

echo "1. Testing search endpoint (GET /opportunities/search)..."
SEARCH_RESPONSE=$(curl -s "${BASE_URL}/opportunities/search")
echo "$SEARCH_RESPONSE" | jq '{success, count, message}'
echo ""

echo "2. Getting first opportunity ID..."
FIRST_ID=$(echo "$SEARCH_RESPONSE" | jq -r '.data[0].id // empty')
if [ -z "$FIRST_ID" ]; then
  echo "   ❌ No opportunities found"
else
  echo "   ✅ First ID: $FIRST_ID"
fi
echo ""

if [ -n "$FIRST_ID" ]; then
  echo "3. Fetching opportunity by ID (GET /opportunities/${FIRST_ID})..."
  SINGLE_RESPONSE=$(curl -s "${BASE_URL}/opportunities/${FIRST_ID}")
  echo "$SINGLE_RESPONSE" | jq '{success, data: {id: .data.id, title: .data.title, orgName: .data.orgName}}'
  echo ""
fi

echo "4. Testing error case (invalid ID)..."
ERROR_RESPONSE=$(curl -s "${BASE_URL}/opportunities/invalid-id-12345")
echo "$ERROR_RESPONSE" | jq '{success, message}'
echo ""

echo "5. Getting all opportunity IDs..."
echo "$SEARCH_RESPONSE" | jq -r '.data[] | .id' | head -5
echo "   ... (showing first 5)"
echo ""

echo "6. Summary statistics:"
TOTAL=$(echo "$SEARCH_RESPONSE" | jq '.count')
IN_PERSON=$(echo "$SEARCH_RESPONSE" | jq '[.data[] | select(.opType == "inPerson")] | length')
VIRTUAL=$(echo "$SEARCH_RESPONSE" | jq '[.data[] | select(.opType == "virtual")] | length')
echo "   Total opportunities: $TOTAL"
echo "   In Person: $IN_PERSON"
echo "   Virtual: $VIRTUAL"
echo ""

echo "=========================================="
echo "  Testing Complete"
echo "=========================================="

