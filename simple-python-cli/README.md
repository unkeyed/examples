# Simple Python CLI

A command-line tool for creating API keys using the Unkey Python SDK.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- An Unkey root key (get one from [Unkey.com](https://unkey.com))

## Installation

1. Copy all the folder `/simple-python-cli` and all files

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root:
```bash
echo "UNKEY_BEARER_AUTH=your_root_key_here" > .env
```

**Important**: Replace `your_root_key_here` with your actual Unkey root key. Never commit the `.env` file to version control.

## Usage

The script supports various options for creating API keys. Here are some examples:

### Basic Usage
```bash
python create_key.py --api-id "api_123" --name "Test Key"
```

### Advanced Usage
```bash
python create_key.py \
    --api-id "api_123" \
    --name "Production API Key" \
    --external-id "team_456" \
    --meta "tier=pro" "customer=acme" \
    --roles "admin" "user" \
    --permissions "read:users" "write:users" \
    --expires "24h" \
    --remaining 1000 \
    --refill-interval daily \
    --refill-amount 100 \
    --ratelimit-limit 10 \
    --ratelimit-duration "1h" \
    --ratelimit-type async
```

### Available Options

- `--api-id`: (Required) The API ID for the key
- `--name`: (Required) Name of the key
- `--external-id`: External identifier for the key
- `--meta`: Metadata in key=value format
- `--roles`: List of roles
- `--permissions`: List of permissions
- `--expires`: Expiration time (ISO date or duration like 24h)
- `--remaining`: Number of remaining uses
- `--refill-interval`: Refill interval (daily/monthly)
- `--refill-amount`: Refill amount
- `--ratelimit-limit`: Rate limit count
- `--ratelimit-duration`: Rate limit duration (e.g., "1h", "30m")
- `--ratelimit-type`: Rate limit type (async/sync)
- `--disabled`: Create key in disabled state

## Duration Formats

The script supports various duration formats:
- Hours: "24h", "1h"
- Minutes: "30m", "45m"
- Seconds: "60s", "90s"

## Development

To set up the development environment:

1. Create a virtual environment (optional but recommended):
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install development dependencies:
```bash
pip install -r requirements-dev.txt  # If you have separate dev requirements
```

## Error Handling

The script includes error handling for:
- Missing bearer token
- Invalid duration formats
- Invalid expiration formats
- API errors

If you encounter errors, check:
1. Your `.env` file is properly configured
2. Your API ID is correct
3. Your root key has the necessary permissions