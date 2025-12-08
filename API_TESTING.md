# API Testing Guide

This guide shows how to test the Akil Backend API from the command line using `curl`.

## Prerequisites

- `curl` - HTTP client (usually pre-installed on Linux/Mac)
- `jq` - JSON processor (install with: `sudo apt install jq` or `brew install jq`)

## Base URL

```
https://akil-backend.onrender.com
```

## Endpoints

### 1. Search All Opportunities

**Endpoint:** `GET /opportunities/search`

**Basic request:**
```bash
curl "https://akil-backend.onrender.com/opportunities/search"
```

**Pretty print JSON:**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.'
```

**Get only the count:**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.count'
```

**Get first opportunity details:**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.data[0]'
```

**Get all opportunity IDs:**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.data[] | .id'
```

**Get specific fields from first opportunity:**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.data[0] | {id, title, orgName, opType, location, categories}'
```

**Check if request was successful:**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.success'
```

### 2. Get Opportunity by ID

**Endpoint:** `GET /opportunities/:id`

**Get a specific opportunity:**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/65509e9353a7667de6ef5a60" | jq '.'
```

**Get specific fields:**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/65509e9353a7667de6ef5a60" | jq '.data | {id, title, description, responsibilities, orgName}'
```

**Test with invalid ID (error handling):**
```bash
curl -s "https://akil-backend.onrender.com/opportunities/invalid-id" | jq '.'
```

## Advanced Testing

### Save response to file:
```bash
curl -s "https://akil-backend.onrender.com/opportunities/search" > api_response.json
```

### Check HTTP status code:
```bash
curl -s -o /dev/null -w "%{http_code}" "https://akil-backend.onrender.com/opportunities/search"
```

### Verbose output (see headers and timing):
```bash
curl -v "https://akil-backend.onrender.com/opportunities/search"
```

### Test with timeout:
```bash
curl --max-time 10 "https://akil-backend.onrender.com/opportunities/search"
```

### Filter opportunities by specific criteria (using jq):
```bash
# Get only in-person opportunities
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.data[] | select(.opType == "inPerson")'

# Get opportunities from specific organization
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.data[] | select(.orgName == "Africa to Silicon Valley")'

# Count opportunities by type
curl -s "https://akil-backend.onrender.com/opportunities/search" | jq '.data | group_by(.opType) | map({type: .[0].opType, count: length})'
```

## Response Structure

### Success Response:
```json
{
  "success": true,
  "message": "",
  "data": [
    {
      "id": "65509e9353a7667de6ef5a60",
      "title": "Volunteer Software Development Mentor",
      "description": "...",
      "responsibilities": "...",
      "requirements": "...",
      "idealCandidate": "...",
      "categories": ["..."],
      "opType": "inPerson",
      "startDate": "2006-01-02T15:04:05.999Z",
      "endDate": "2006-01-02T15:04:05.999Z",
      "deadline": "2006-01-02T15:04:05.999Z",
      "location": ["Addis Ababa"],
      "requiredSkills": ["..."],
      "whenAndWhere": "...",
      "orgName": "Africa to Silicon Valley",
      "logoUrl": "...",
      "datePosted": "2024-07-17T11:09:29.135Z",
      ...
    }
  ],
  "errors": null,
  "count": 23
}
```

### Error Response:
```json
{
  "success": false,
  "message": "An unexpected error occurred, please try again later",
  "data": null,
  "errors": null,
  "count": 0
}
```

## Quick Test Script

Create a file `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="https://akil-backend.onrender.com"

echo "Testing API Endpoints..."
echo ""

echo "1. Testing search endpoint..."
curl -s "${BASE_URL}/opportunities/search" | jq '{success, count}'

echo ""
echo "2. Getting first opportunity ID..."
FIRST_ID=$(curl -s "${BASE_URL}/opportunities/search" | jq -r '.data[0].id')
echo "ID: $FIRST_ID"

echo ""
echo "3. Fetching opportunity by ID..."
curl -s "${BASE_URL}/opportunities/${FIRST_ID}" | jq '{success, data: {id: .data.id, title: .data.title}}'

echo ""
echo "4. Testing error case..."
curl -s "${BASE_URL}/opportunities/invalid-id" | jq '{success, message}'
```

Make it executable and run:
```bash
chmod +x test_api.sh
./test_api.sh
```

