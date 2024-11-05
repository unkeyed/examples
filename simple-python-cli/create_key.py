#!/usr/bin/env python3
import os
import argparse
from datetime import datetime, timedelta
from typing import Optional
from unkey_py import Unkey
from unkey_py.models import CreateKeyInterval
from dotenv import load_dotenv

load_dotenv()

def parse_duration(duration_str: str) -> int:
    """Convert a duration string (e.g., '1h', '30m', '45s') to milliseconds"""
    unit = duration_str[-1].lower()
    value = int(duration_str[:-1])
    
    if unit == 'h':
        return value * 60 * 60 * 1000
    elif unit == 'm':
        return value * 60 * 1000
    elif unit == 's':
        return value * 1000
    else:
        raise ValueError("Duration must end with 'h', 'm', or 's'")

def parse_expires(expires_str: Optional[str]) -> Optional[int]:
    """Convert an expires string to Unix timestamp in milliseconds"""
    if not expires_str:
        return None
    
    try:
        # Try parsing as duration from now
        duration_ms = parse_duration(expires_str)
        return int((datetime.now() + timedelta(milliseconds=duration_ms)).timestamp() * 1000)
    except ValueError:
        # Try parsing as ISO date
        try:
            dt = datetime.fromisoformat(expires_str.replace('Z', '+00:00'))
            return int(dt.timestamp() * 1000)
        except ValueError:
            raise ValueError("Expires must be either a duration (e.g., '24h') or ISO date")

def main():
    parser = argparse.ArgumentParser(description='Create a new API key using Unkey')
    
    # Required arguments
    parser.add_argument('--api-id', required=True, help='API ID')
    parser.add_argument('--name', required=True, help='Key name')
    
    # Optional arguments
    parser.add_argument('--external-id', help='External ID for the key')
    parser.add_argument('--meta', nargs='*', help='Metadata in key=value format')
    parser.add_argument('--roles', nargs='*', help='List of roles')
    parser.add_argument('--permissions', nargs='*', help='List of permissions')
    parser.add_argument('--expires', help='Expiration time (ISO date or duration like 24h)')
    parser.add_argument('--remaining', type=int, help='Number of remaining uses')
    parser.add_argument('--refill-interval', choices=['daily', 'monthly'], help='Refill interval')
    parser.add_argument('--refill-amount', type=int, help='Refill amount')
    parser.add_argument('--ratelimit-limit', type=int, help='Rate limit count')
    parser.add_argument('--ratelimit-duration', help='Rate limit duration (e.g., "1h", "30m")')
    parser.add_argument('--ratelimit-type', choices=['async', 'sync'], help='Rate limit type, e.g "async" (formerly "fast") or "sync" (formerly "consistent")')
    parser.add_argument('--disabled', action='store_true', help='Create key in disabled state')
    
    args = parser.parse_args()
    
    # Initialize Unkey client
    root_key = os.getenv("UNKEY_ROOT_KEY")
    if not root_key:
        raise ValueError("UNKEY_ROOT_KEY environment variable is required")
    
    # Keep eye on `bearer_auth`, subject to change name
    client = Unkey(bearer_auth=root_key)
    
    # Build request body
    request = {
        "api_id": args.api_id,
        "name": args.name,
        "enabled": not args.disabled
    }
    
    if args.external_id:
        request["external_id"] = args.external_id
    
    if args.meta:
        meta = {}
        for item in args.meta:
            key, value = item.split('=', 1)
            meta[key] = value
        request["meta"] = meta
    
    if args.roles:
        request["roles"] = args.roles
    
    if args.permissions:
        request["permissions"] = args.permissions
    
    if args.expires:
        request["expires"] = parse_expires(args.expires)
    
    if args.remaining is not None:
        request["remaining"] = args.remaining
    
    # Add refill configuration if both interval and amount are provided
    if args.refill_interval and args.refill_amount:
        request["refill"] = {
            "interval": CreateKeyInterval.DAILY if args.refill_interval == "daily" else CreateKeyInterval.MONTHLY,
            "amount": args.refill_amount
        }
    
    # Add rate limit configuration if limit and duration are provided
    if args.ratelimit_limit and args.ratelimit_duration:
        request["ratelimit"] = {
            "limit": args.ratelimit_limit,
            "duration": parse_duration(args.ratelimit_duration),
            "async": True if args.ratelimit_type == "async" else False
        }
    
    # Create the key
    try:
        response = client.keys.create(request=request)
        if response.object is not None:
            print(f"Key created successfully!")
            print(f"Key ID: {response.object.key_id}")
            print(f"Key: {response.object.key}")
    except Exception as e:
        print(f"Error creating key: {e}")
        exit(1)

if __name__ == "__main__":
    main()