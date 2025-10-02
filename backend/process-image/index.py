"""
Business: AI-powered image text removal using fal.ai inpainting service
Args: event - dict with httpMethod, body containing base64 image
      context - object with attributes: request_id, function_name
Returns: HTTP response with processed image URL
"""

import json
import os
import base64
import fal_client
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    fal_key = os.environ.get('FAL_KEY')
    if not fal_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'FAL_KEY not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    image_url = body_data.get('image_url')
    
    if not image_url:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'image_url is required'})
        }
    
    os.environ['FAL_KEY'] = fal_key
    
    result = fal_client.subscribe(
        "fal-ai/lama",
        arguments={
            "image_url": image_url,
            "prompt": "remove all text and watermarks, restore background"
        },
        with_logs=False
    )
    
    output_url = result.get('image', {}).get('url') if isinstance(result.get('image'), dict) else result.get('image')
    
    if not output_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Processing failed', 'details': str(result)})
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'output_url': output_url,
            'request_id': context.request_id
        })
    }
